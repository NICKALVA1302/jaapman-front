import { Component, ElementRef, ViewChild } from '@angular/core';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import pdfMake from 'pdfmake/build/pdfmake';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { Localidad } from '../../../deudas-pueblo/models/localidades';
import {
  AlcantarilladoInterface,
  MantenimientoInterface,
} from '../../models/interfaces';
import { TipoIngresoService } from '../../services/tipo-ingreso.service';

@Component({
  selector: 'app-view-reporte-tipo-ingreso',
  templateUrl: './view-reporte-tipo-ingreso.component.html',
  styleUrl: './view-reporte-tipo-ingreso.component.css',
})
export class ViewReporteTipoIngresoComponent {
  localidades: Localidad[] = [];
  selectedLocalidadId: string | '' = '';
  selectedTipo: string | null = null;
  datosPorMantenimiento: MantenimientoInterface[] = [];
  datosPorAlcantarillado: AlcantarilladoInterface[] = [];

  @ViewChild('pdfContainer') pdfContainer: ElementRef | undefined;

  constructor(public servicioReportes: TipoIngresoService) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
  }
  ngOnInit() {
    this.obtenerLocalidades();
  }

  obtenerLocalidades(): void {
    this.servicioReportes.obtenerLocalidades().subscribe(
      (Localidad: Localidad[]) => {
        this.localidades = Localidad; //lista de localidades guardada en localidades
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
    // console.log(this.selectedLocalidadId);
    // console.log(this.selectedTipo);
  }
  //Obtener datos de los Respuestas x localidad
  obtenerDatos(): void {
    if (this.selectedTipo === 'Mantenimiento') {
      this.getInfoMantenimiento();
    } else {
      this.getInfoAlcantarillado();
    }
    console.log(this.selectedTipo);
  }
  getInfoMantenimiento() {
    this.servicioReportes
      .getDatosMantenimiento(this.selectedLocalidadId)
      .subscribe(
        (response: any) => {
          if (response) {
            this.datosPorMantenimiento = response;
            this.generarPdf();
            console.log(this.datosPorMantenimiento);
          }
        },
        (error: any) => {
          console.error('Error al obtener datos por localidad:', error);
        }
      );
  }
  getInfoAlcantarillado() {
    this.servicioReportes
      .getDatosAlcantarillado(this.selectedLocalidadId)
      .subscribe(
        (response: any) => {
          if (response) {
            this.datosPorAlcantarillado = response;
            this.generarPdf();
            console.log(this.datosPorAlcantarillado);
          }
        },
        (error: any) => {
          console.error('Error al obtener datos por localidad:', error);
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

    //this.datosPorMantenimiento.length !== 0
    if (true) {
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
                text:
                  this.selectedTipo === 'Alcantarillado'
                    ? 'RECUDACIÓN POR TIPO DE INGRESO: ALCANTARILLADO'
                    : 'RECUDACIÓN POR TIPO DE INGRESO: MANTENIMIENTO',
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
            text: 'Localidad: ' + this.selectedLocalidadId.toUpperCase(),
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

      if (this.selectedTipo === 'Alcantarillado') {
        let tableBody: any[] = [
          [
            { text: '#', style: 'tableHeader' },
            { text: 'Cedula', style: 'tableHeader' },
            { text: 'Nombre', style: 'tableHeader' },
            { text: 'Apellido', style: 'tableHeader' },
            { text: 'Direccion', style: 'tableHeader' },
            { text: 'Fecha', style: 'tableHeader' },
            { text: 'Inscrito', style: 'tableHeader' },
            { text: 'Estado', style: 'tableHeader' },
          ],
        ];

        this.datosPorAlcantarillado.forEach((Respuesta, index) => {
          const formattedDate = this.formatDate(Respuesta.createdAt);
          tableBody.push([
            { text: String(index + 1), style: 'tableContent' }, // Número de fila
            { text: Respuesta.cedula ?? '', style: 'tableContent' },
            { text: Respuesta.nombre ?? '', style: 'tableContent' },
            { text: Respuesta.apellido ?? '', style: 'tableContent' },
            { text: Respuesta.direccion ?? '', style: 'tableContent' },
            { text: formattedDate ?? '', style: 'tableContent' },
            {
              text: Respuesta.inscrito === 1 ? 'SI' : 'NO' ?? '',
              style: 'tableContent',
            },

            { text: Respuesta.Estado ?? '', style: 'tableContent' },
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
      } else {
        let tableBody: any[] = [
          [
            { text: '#', style: 'tableHeader' },
            { text: 'Cedula', style: 'tableHeader' },
            { text: 'Nombre', style: 'tableHeader' },
            { text: 'Apellido', style: 'tableHeader' },
            { text: 'Fecha', style: 'tableHeader' },
            { text: 'Direccion', style: 'tableHeader' },
            { text: 'Total', style: 'tableHeader' },
          ],
        ];

        this.datosPorMantenimiento.forEach((Respuesta, index) => {
          total += Respuesta.total ?? 0;
          const formattedDate = this.formatDate(Respuesta.createdAt);
          tableBody.push([
            { text: String(index + 1), style: 'tableContent' }, // Número de fila
            { text: Respuesta.cedula ?? '', style: 'tableContent' },
            { text: Respuesta.nombre ?? '', style: 'tableContent' },
            { text: Respuesta.apellido ?? '', style: 'tableContent' },
            { text: formattedDate ?? '', style: 'tableContent' },
            { text: Respuesta.direccion ?? '', style: 'tableContent' },
            {
              text:
                '$' +
                (Respuesta.total ?? 0).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }),
              style: 'tableContent',
              alignment: 'right' as any,
            } as Content,
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
              width: 'auto',
              stack: [
                {
                  style: 'tableExampleResumen', // Estilo específico para la tabla de RESUMEN
                  table: {
                    headerRows: 1,
                    widths: ['auto', 'auto'], // Ajusta el ancho de las columnas aquí (puedes usar 'auto' o un valor específico en porcentaje)
                    body: [
                      [
                        {
                          text: 'Total Por Localidad',
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
  }
  formatData() {
    this.datosPorMantenimiento.forEach((data) => {
      data.createdAt = this.formatDate(data.createdAt);
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
