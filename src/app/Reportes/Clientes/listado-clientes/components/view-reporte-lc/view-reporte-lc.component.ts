import { Component, ElementRef, ViewChild } from '@angular/core';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer'
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { DatosPorLocalidad } from '../../models/localidades';
import { Localidad } from '../../../../../interfaces/localidad';
import { ListadoService, Cliente } from '../../services/listado.service';


pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-view-reporte-lc',
  templateUrl: './view-reporte-lc.component.html',
  styleUrl: './view-reporte-lc.component.css'
})
export class ViewReporteLcComponent {
  localidades: Localidad[] = [];
  selectedLocalidadId: number | null = null; // Cambiar el tipo de selectedLocalidadId a string | null
  datosPorLocalidad: DatosPorLocalidad[] = [];
  @ViewChild('pdfContainer') pdfContainer: ElementRef | undefined;

  constructor(public listadoService: ListadoService) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
  }

  ngOnInit() {
    this.obtenerLocalidades();
  }

  obtenerLocalidades(): void {
    this.listadoService.obtenerLocalidades().subscribe(
      (Localidad: Localidad[]) => {
        this.localidades = Localidad; //lista de localidades guardada en localidades
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
  }

  generarPdf() {
    if (this.selectedLocalidadId) { // Verifica que haya una localidad seleccionada
      this.listadoService.obtenerClientes(this.selectedLocalidadId).subscribe(
        (clientesPorLocalidad: Cliente[]) => {

          const content: any[] = [];
          const fechaActual = new Date();
          const fechaFormateada = fechaActual.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

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
                    text: 'LISTADO CLIENTES ',
                  },
                  {
                    canvas: [
                      createLine(0, 2, 250),
                      createLine(0, 4, 250)
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

          if (clientesPorLocalidad.length > 0) {
            const tableData = clientesPorLocalidad.map(cliente => [
              (cliente.Nombre || '').toUpperCase() + ' ' + (cliente.Apellido || '').toUpperCase(),
              cliente.Cedula || '',
              (cliente.Localidad || '').toUpperCase(),
              (cliente.Direccion || '').toUpperCase(),
              (cliente.Telefono || '').toUpperCase()
            ]);

            content.push({
              table: {
                headerRows: 1,
                widths: ['*', '*', '*', '*', '*'],
                body: [
                  [
                    { text: 'Nombre', style: 'tableHeader' },
                    { text: 'Cédula', style: 'tableHeader' },
                    { text: 'Localidad', style: 'tableHeader' },
                    { text: 'Dirección', style: 'tableHeader' },
                    { text: 'Telefono', style: 'tableHeader' }
                  ],
                  ...tableData
                ]
              },
              layout: 'lightHorizontalLines',
              style: 'tableExample'
            });
          } else {
            content.push({
              text: 'No hay clientes ',
              alignment: 'center'
            });
          }

          const dd: TDocumentDefinitions = {
            content: content,
            styles: {
              header: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5]
              },
              subheader: {
                fontSize: 14,
                bold: true,
                margin: [0, 5, 0, 2]
              },
              tableExample: {
                margin: [0, 5, 0, 15],
                alignment: 'center'
              },
              tableHeader: {
                bold: true,
                fontSize: 12,
                color: 'black'
              },
              tableRow: {
                fontSize: 10,
                margin: [0, 0, 0, 0]
              }
            }
          };

          const pdf = pdfMake.createPdf(dd);
          pdf.getBlob((blob: Blob) => {
            const url = URL.createObjectURL(blob);
            this.mostrarPdf(url);
          });
        },
        (error: any) => {
          console.error('Error al obtener clientes suspendidos:', error);
        }
      );
    } else {
      console.error('No se ha seleccionado ninguna localidad');
    }
  }

  mostrarPdf(pdfUrl: string) {
    if (this.pdfContainer) {
      const iframe = document.createElement('iframe');
      iframe.src = pdfUrl;
      iframe.width = '100%';
      iframe.height = '600px';
      iframe.style.maxWidth = '100%';
      iframe.style.maxHeight = '600px';
      this.pdfContainer.nativeElement.innerHTML = '';
      this.pdfContainer.nativeElement.appendChild(iframe);
    } else {
      console.error('pdfContainer is undefined');
    }
  }
}
