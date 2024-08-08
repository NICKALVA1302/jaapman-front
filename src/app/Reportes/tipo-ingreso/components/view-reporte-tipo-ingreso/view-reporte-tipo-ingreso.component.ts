import { Component, ElementRef, ViewChild } from '@angular/core';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { Localidad } from '../../../deudas-pueblo/models/localidades';
import { MantenimientoInterface } from '../../models/interfaces';
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
    // console.log(this.selectedLocalidadId);
    // console.log(this.selectedTipo);
  }
  //Obtener datos de los Respuestas x localidad
  obtenerDatos(): void {
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

  generarPdf() {
    let totalDeuda = 0;
    const content: any[] = [];
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    if (this.datosPorMantenimiento.length !== 0) {
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
                text: 'Recudacion por tipo de Ingreso: MAntenimiento',
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
          { text: 'Nombre', style: 'tableHeader' },
          { text: 'Apellido', style: 'tableHeader' },
          { text: 'Total', style: 'tableHeader' },
          { text: 'Fecha', style: 'tableHeader' },
          { text: 'Localidad', style: 'tableHeader' },
          { text: 'Direccion', style: 'tableHeader' },
        ],
      ];

      this.datosPorMantenimiento.forEach((Respuesta, index) => {
        tableBody.push([
          { text: String(index + 1), style: 'tableContent' }, // Número de fila
          { text: Respuesta.nombre ?? '', style: 'tableContent' },
          { text: Respuesta.apellido ?? '', style: 'tableContent' },
          { text: Respuesta.total ?? '', style: 'tableContent' },
          { text: Respuesta.createdAt ?? '', style: 'tableContent' },
          { text: Respuesta.localidad ?? '', style: 'tableContent' },
          { text: Respuesta.direccion ?? '', style: 'tableContent' },
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
