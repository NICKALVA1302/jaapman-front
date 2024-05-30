import { Localidad } from './../../../../interfaces/localidad';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReportesService } from '../../services/reportes.service';
import { DatosPorLocalidad } from '../../models/localidades';

import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer'

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';


pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-view-consumos-clientes',
  templateUrl: './view-consumos-clientes.component.html',
  styleUrl: './view-consumos-clientes.component.css'
})
export class ViewConsumosClientesComponent {

  localidades: Localidad[] = [];
  selectedLocalidadId: number | null = null; // Cambiar el tipo de selectedLocalidadId a string | null
  datosPorLocalidad: DatosPorLocalidad[] = [];
  @ViewChild('pdfContainer') pdfContainer: ElementRef | undefined;

  constructor(public servicioReportes: ReportesService) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';

  }



  ngOnInit() {
    this.obtenerLocalidades();
  }


  obtenerLocalidades(): void {
    this.servicioReportes.obtenerLocalidades().subscribe(
      (Localidad: Localidad[]) => {
        this.localidades = Localidad; //lista de localidades guardada en localidades
        console.log(this.localidades);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  //Obtener ID de localidad
  obtenerIdLocalidadeleccionado(event: any): void {
    // Obtener el valor seleccionado del evento
    const selectedValue = event.target.value;

    // Asignar el id_tipopago seleccionado a la propiedad selectedTipoPagoId
    this.selectedLocalidadId = selectedValue;
    console.log(this.selectedLocalidadId);
    this.obtenerDatosClientes()

  }

  //Obtener datos de los clientes x localidad
  obtenerDatosClientes(): void {
    this.servicioReportes.getDatosPorLocalidad(Number(this.selectedLocalidadId)).subscribe(
      (response: any) => {
        if (response && response.LocalidadesxUsuario) {
          this.datosPorLocalidad = response.LocalidadesxUsuario;
          console.log(this.datosPorLocalidad)
        }
      },
      (error: any) => {
        console.error('Error al obtener datos por localidad:', error);
      }
    );
  }

  generarPdf() {
    const content: any[] = [];
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });


    // Iterar sobre los datos de clientes
    this.datosPorLocalidad.forEach(cliente => {

      // Verificar si el cliente tiene planillas registradas
      if (cliente.usuarios.length > 0 && cliente.usuarios[0].planillas.length > 0) {

        content.push({
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 5,
              x2: 520,
              y2: 5,
              lineWidth: 2,
              lineColor: '#007bff' // Código de color azul
            }
          ]
        });
        // Agregar el encabezado inicial en cada iteración de usuario
        // Función para generar una línea
        function createLine(x1: number, y1: number, x2: number): object {
          return {
            type: 'line',
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y1,
            lineWidth: 1,
            lineColor: 'black'
          };
        }

        // Crear el contenido con la función para generar las líneas
        content.push({
          alignment: 'center',
          fontSize: 7,
          style: 'header',
          columns: [
            {
              fontSize: 15,
              characterSpacing: 10,
              alignment: 'center',
              stack: [
                {
                  text: 'Aviso de Cobro',
                },
                {
                  canvas: [
                    createLine(0, 2, 250), // Primera línea
                    createLine(0, 4, 250)  // Segunda línea
                  ]
                }
              ]
            },
            [
              'JUNTA ADMINISTRADORA DE AGUA POTABLE REGIONAL MANGLARALTO',
              '24900013639001 Calle 5 de junio via a Montañita junto al Colegio Fiscal Manglaralto'
            ]
          ],
          styles: {
            header: {
              alignment: 'justify'
            }
          }
        });


        // Agregar el encabezado del cliente
        content.push({
          columns: [
            {
              text: 'Cliente: ' + cliente.nombre.toUpperCase() + ' ' + cliente.apellido.toUpperCase()
            },
            {
              text: ""
            },
            {
              text: 'Localidad: ' + cliente.usuarios[0].localidad.nombre.toUpperCase()
            }
          ]
        })
        content.push({
          columns: [
            {
              text: 'Direccion: ' + cliente.direccion.toUpperCase()
            },
            {
              text: ""
            },
            {
              text: 'Codigo medidor:'
            }
          ]
        })
        content.push({
          columns: [
            {
              text: 'Cedula: ' + cliente.cedula
            },
            {
              text: 'Categoria: ' + cliente.usuarios[0].medidor.categoria_medidor.nombre.toUpperCase()
            },
            {
              text: 'Fecha: ' + fechaFormateada
            }
          ]
        })

        // Agregar las planillas del cliente
        cliente.usuarios.forEach(usuario => {

          // Iterar sobre las planillas del usuario
          usuario.planillas.forEach(planilla => {
            // Agregar detalles de la planilla
            content.push({
              style: 'tableExample',
              table: {
                headerRows: 1,
                body: [
                  [
                    { text: 'Tipo', style: 'tableHeader' },
                    { text: 'Fecha L.Actual', style: 'tableHeader' },
                    { text: 'Mes', style: 'tableHeader' },
                    { text: 'Año', style: 'tableHeader' },
                    { text: 'L.Actual', style: 'tableHeader' },
                    { text: 'L.anterior', style: 'tableHeader' },
                    { text: 'ConsumoTotal', style: 'tableHeader' },
                    { text: 'Tp Cnsm Mes', style: 'tableHeader' }
                  ],
                  [
                    'Agua',
                    '20',
                    'Agosto',
                    '2023',
                    cliente.usuarios[0].planillas[0].lectura_actual ?? '',
                    cliente.usuarios[0].planillas[0].lectura_anterior ?? '',
                    cliente.usuarios[0].planillas[0].consumo_total ?? '',
                    cliente.usuarios[0].planillas[0].total_pagar ?? '',
                  ]
                ]
              }
            });
            

            content.push({
              alignment: 'right', // Alinea el contenedor a la derecha
              columns: [
                  {
                      stack: [
                        
                          {
                              style: 'tableExampleResumen', // Estilo específico para la tabla de RESUMEN
                              table: {
                                  headerRows: 1,
                                  widths: ['auto', 'auto'], // Ajusta el ancho de las columnas aquí (puedes usar 'auto' o un valor específico en porcentaje)
                                  body: [
                                      [
                                          { text: 'RESUMEN', style: 'tableHeader', alignment: 'center' },
                                          { text: 'TOTAL:', style: 'tableHeader', border: [true, true, true, false] }
                                      ],
                                      [
                                          { text: 'Tp Cnsm+Deuda A.: ', border: [true, false, false, false] },
                                          { text: '', border: [true, false, true, false] }
                                      ],
                                      [
                                          { text: 'Tp Alcan+ Deuda A.:', border: [true, false, false, false] },
                                          { text: 'DESCUENTO', border: [true, false, true, false], style: 'tableHeader' } // Aquí se colocaría el valor correspondiente al TOTAL
                                      ],
                                      [
                                          { text: 'Tp Manten+Deuda:', border: [true, false, false, false] },
                                          { text: '', border: [true, false, true, false] } // Aquí se colocaría el valor correspondiente al DESCUENTO
                                      ],
                                      [
                                          { text: 'Insta. Material:', border: [true, false, false, false] },
                                          { text: 'TOTAL PAGAR: ', border: [true, false, true, false], style: 'tableHeader' } // Aquí se colocaría el valor correspondiente al TOTAL PAGAR
                                      ],
                                      [
                                          { text: 'Derecho Insta: '+ cliente.usuarios[0].planillas[0].PlanillaDetalles[0]?.Instalacion?.valor, border: [true, false, false, false] },
                                          { text: cliente.usuarios[0].planillas[0].PlanillaDetalles[0]?.total_pago , border: [true, false, true, false], alignment: 'right' }
                                      ],
                                      [
                                          { text: 'Multas:', border: [true, false, false, true] },
                                          { text: '', border: [true, false, true, true] }
                                      ],
                                  ]
                              },
                              
                          }
                          
                      ]
                  }
              ]
          });
          
          


          });
        });
      }
    });


    // Definir el documento PDF
    const dd: TDocumentDefinitions = {
      content: content,
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5] // Definir margen como un array de números
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 5, 0, 2] // Definir margen como un array de números
        },
        tableExample: {
          margin: [0, 5, 0, 15], // Definir margen como un array de números,
          alignment: 'center'
        },
        tableExampleResumen: { // Estilo específico para la tabla de RESUMEN
          margin: [0, 0, 0, 0] // Definir margen como un array de números
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',

        },
        tableRow: {
          fontSize: 10,
          margin: [0, 0, 0, 0] // Eliminar el margen inferior
        },
      }
    };



    const pdf = pdfMake.createPdf(dd);
    pdf.getBlob((blob: Blob) => {
      const url = URL.createObjectURL(blob);
      this.mostrarPdf(url);
    });
  }



  mostrarPdf(pdfUrl: string) {
    if (this.pdfContainer) {
      const iframe = document.createElement('iframe');
      iframe.src = pdfUrl;
      iframe.width = '100%';
      iframe.height = '600px';
      iframe.style.maxWidth = '100%'; // Establece el ancho máximo del iframe
      iframe.style.maxHeight = '600px'; // Establece la altura máxima del iframe
      this.pdfContainer.nativeElement.innerHTML = '';
      this.pdfContainer.nativeElement.appendChild(iframe);
    } else {
      console.error('pdfContainer is undefined');
    }
  }



}
