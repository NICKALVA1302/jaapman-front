import { Component, ElementRef, ViewChild } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { PagoCliente } from '../../models/interfaces';
import { PagoClienteService } from '../../services/pago-cliente.service';
@Component({
  selector: 'app-view-reporte-pago',
  templateUrl: './view-reporte-pago.component.html',
  styleUrl: './view-reporte-pago.component.css',
})
export class ViewReportePagoComponent {
  @ViewChild('pdfContainer') pdfContainer: ElementRef | undefined;
  datos: PagoCliente[] = [];
  cedula: string | '' = '';
  fechaInicio: string = '';
  fechaFin: string = '';
  constructor(public servicioReportes: PagoClienteService) {}
  ngOnInit() {}
  getInfo(): void {
    this.servicioReportes
      .getDatos(this.cedula, this.fechaInicio, this.fechaFin)
      .subscribe(
        (response: any) => {
          if (response) {
            this.datos = response;
            console.log(this.fechaInicio);
            console.log(this.fechaFin);

            // this.formatData();
            this.generarPdf();
          }
        },
        (error: any) => {
          console.error('Error al obtener datos:', error);
        }
      );
  }
  generarPdf() {
    let total = 0;
    const content: any[] = [];
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    if (this.datos.length !== 0) {
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
                text: 'PAGOS DEL CLIENTE',
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
      content.push({
        columns: [
          {
            text: '',
          },
          {
            text: ' ',
          },
          {
            text: '',
          },
        ],
      });
      content.push({
        columns: [
          {
            text: 'Cedula: ' + this.datos[0].PersonaCedula,
          },
          {
            text: '',
          },
          {
            text: 'Telefono: ' + this.datos[0].PersonaTelefono,
          },
        ],
      });
      content.push({
        columns: [
          {
            text: 'Nombre: ' + this.datos[0].PersonaNombre.toUpperCase(),
          },
          {
            text: '',
          },
          {
            text: 'Direccion: ' + this.datos[0].PersonaDireccion,
          },
        ],
      });
      content.push({
        columns: [
          {
            text: 'Apellido: ' + this.datos[0].PersonaApellido.toUpperCase(),
          },
          {
            text: ' ',
          },
          {
            text: 'Fecha de emisión: ' + fechaFormateada,
          },
        ],
      });
      content.push({
        columns: [
          {
            text: '',
          },
          {
            text: ' ',
          },
          {
            text: '',
          },
        ],
      });
      let tableBody: any[] = [
        [
          { text: '#', style: 'tableHeader', alignment: 'center' },
          { text: 'Tipo', style: 'tableHeader', alignment: 'center' },
          { text: 'Descripcion', style: 'tableHeader', alignment: 'center' },
          { text: 'Fecha Del Pago', style: 'tableHeader', alignment: 'center' },
          { text: 'Total A Pagar', style: 'tableHeader', alignment: 'center' },
          { text: 'Abono', style: 'tableHeader', alignment: 'center' },
          { text: 'Deuda', style: 'tableHeader', alignment: 'center' },
          { text: 'Estado', style: 'tableHeader', alignment: 'center' },
        ],
      ];

      this.datos.forEach((cliente, index) => {
        total += cliente.Deuda ?? 0;
        const formattedDate = this.formatDate(cliente.Fecha);

        tableBody.push([
          {
            text: String(index + 1),
            style: 'tableContent',
            alignment: 'center',
          }, // Número de fila
          {
            text: cliente.Tipo ?? '',
            style: 'tableContent',
            alignment: 'center',
          },
          {
            text: cliente.Descripcion ?? 'Sin Descripcion',
            style: 'tableContent',
            alignment: 'center',
          },
          {
            text: formattedDate ?? '',
            style: 'tableContent',
            alignment: 'center',
          },
          {
            text:
              '$' +
              (cliente.Total ?? 0).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
            style: 'tableContent',
            alignment: 'right' as any,
          } as Content,
          {
            text:
              '$' +
              (cliente.Abono ?? 0).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
            style: 'tableContent',
            alignment: 'right' as any,
          } as Content,
          {
            text:
              '$' +
              (cliente.Deuda ?? 0).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
            style: 'tableContent',
            alignment: 'right' as any,
          } as Content,
          {
            text: cliente.Estado ?? '',
            style: 'tableContent',
            alignment: 'center',
          },
        ]);
      });

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
                        text: 'Total De La Deuda En El Rango De Fechas',
                        style: 'tableHeader',
                        alignment: 'center',
                      },
                      {
                        text:
                          '$' +
                          (total ?? 0).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }),
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
  formatData() {
    this.datos.forEach((data) => {
      data.Fecha = this.formatDate(data.Fecha);
    });
  }
  formatDate(isoDate: any): string {
    if (typeof isoDate === 'string' && isoDate.includes('T')) {
      return isoDate.split('T')[0];
    } else {
      return isoDate;
    }
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
