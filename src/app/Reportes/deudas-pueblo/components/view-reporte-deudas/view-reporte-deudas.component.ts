import { Component, ElementRef, ViewChild } from '@angular/core';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { DeudaUsuario, Localidad } from '../../models/localidades';
import { DeudasPuebloService } from '../../services/deudas-pueblo.service';
@Component({
  selector: 'app-view-reporte-deudas',
  templateUrl: './view-reporte-deudas.component.html',
  styleUrl: './view-reporte-deudas.component.css',
})
export class ViewReporteDeudasComponent {
  localidades: Localidad[] = [];
  selectedLocalidadId: string | '' = ''; // Cambiar el tipo de selectedLocalidadId a string | null
  datosPorLocalidad: DeudaUsuario[] = [];
  @ViewChild('pdfContainer') pdfContainer: ElementRef | undefined;

  constructor(public servicioReportes: DeudasPuebloService) {
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
  onSelectLocalidad(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedNombre = selectElement.value;
    this.selectedLocalidadId = selectedNombre;
    console.log(this.selectedLocalidadId);
  }

  //Obtener ID de localidad
  obtenerIdLocalidadeleccionado(event: any): void {
    // Obtener el valor seleccionado del evento
    const selectedValue = event.target.value;
    this.selectedLocalidadId = selectedValue;
    this.obtenerDatosClientes();
  }

  //Obtener datos de los clientes x localidad
  obtenerDatosClientes(): void {
    this.servicioReportes
      .getDatosPorLocalidad(this.selectedLocalidadId)
      .subscribe(
        (response: any) => {
          if (response) {
            this.datosPorLocalidad = response;
            this.generarPdf();
            console.log(this.datosPorLocalidad);
          }
        },
        (error: any) => {
          console.error('Error al obtener datos por localidad:', error);
        }
      );
  }

  generarPdf() {
    let totalDeuda = 0;
    const content: any[] = [];
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    if (this.datosPorLocalidad.length !== 0) {
      // Verificar si el cliente tiene planillas registradas
      content.push({
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 5,
            x2: 520,
            y2: 5,
            lineWidth: 2,
            lineColor: '#007bff', // Código de color azul
          },
        ],
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
          lineColor: 'black',
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
                text: 'DEUDAS ACUMULADAS POR PUEBLO',
              },
              {
                canvas: [
                  createLine(0, 2, 250), // Primera línea
                  createLine(0, 4, 250), // Segunda línea
                ],
              },
            ],
          },
          [
            'JUNTA ADMINISTRADORA DE AGUA POTABLE REGIONAL MANGLARALTO',
            '24900013639001 Calle 5 de junio via a Montañita junto al Colegio Fiscal Manglaralto',
          ],
        ],
        styles: {
          header: {
            alignment: 'justify',
          },
        },
      });
      let tableBody = [
        [
          { text: '#', style: 'tableHeader' },
          { text: 'cedula', style: 'tableHeader' },
          { text: 'nombre', style: 'tableHeader' },
          { text: 'apellido', style: 'tableHeader' },
          { text: 'direccion', style: 'tableHeader' },
          { text: 'deuda_pendiente', style: 'tableHeader' },
        ],
      ];

      this.datosPorLocalidad.forEach((cliente, index) => {
        totalDeuda += cliente.deuda_pendiente ?? 0;
        tableBody.push([
          { text: String(index + 1), style: 'tableContent' }, // Número de fila
          { text: cliente.cedula ?? '', style: 'tableContent' },
          { text: cliente.nombre ?? '', style: 'tableContent' },
          { text: cliente.apellido ?? '', style: 'tableContent' },
          { text: cliente.direccion ?? '', style: 'tableContent' },
          {
            text: String(cliente.deuda_pendiente ?? ''),
            style: 'tableContent',
          },
        ]);
      });

      // Add the table to the content
      content.push({
        style: 'tableExample',
        table: {
          headerRows: 1,
          body: tableBody,
        },
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
                      {
                        text: 'Total Deuda Por Pueblo',
                        style: 'tableHeader',
                        alignment: 'center',
                      },
                      {
                        text: totalDeuda ?? '',
                        style: 'tableHeader',
                        border: [true, true, true, true],
                      },
                    ],
                  ],
                },
              },
            ],
          },
        ],
      });
    }
    // });

    // Definir el documento PDF
    const dd: TDocumentDefinitions = {
      content: content,
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5], // Definir margen como un array de números
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 5, 0, 2], // Definir margen como un array de números
        },
        tableExample: {
          margin: [0, 5, 0, 15], // Definir margen como un array de números,
          alignment: 'center',
        },
        tableExampleResumen: {
          // Estilo específico para la tabla de RESUMEN
          margin: [0, 0, 0, 0], // Definir margen como un array de números
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
        },
        tableRow: {
          fontSize: 10,
          margin: [0, 0, 0, 0], // Eliminar el margen inferior
        },
      },
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
