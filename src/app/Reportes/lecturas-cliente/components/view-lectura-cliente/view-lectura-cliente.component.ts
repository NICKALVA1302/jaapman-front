import { Component, ElementRef, ViewChild } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { Anio, LecturaUser } from '../../models/interfaces';
import { LecturaClienteService } from '../../services/lectura-cliente.service';

@Component({
  selector: 'app-view-lectura-cliente',
  templateUrl: './view-lectura-cliente.component.html',
  styleUrl: './view-lectura-cliente.component.css',
})
export class ViewLecturaClienteComponent {
  @ViewChild('pdfContainer') pdfContainer: ElementRef | undefined;
  anios: Anio[] = [];

  selectedAnio: string | '' = '';
  cedula: string | '' = '';
  datos: LecturaUser[] = [];
  constructor(public servicioReportes: LecturaClienteService) {}
  ngOnInit() {
    this.obtenerAnios();
  }

  obtenerAnios(): void {
    this.servicioReportes.getAnios().subscribe(
      (Anio: Anio[]) => {
        this.anios = Anio;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  getInfo(): void {
    this.servicioReportes.getDatos(this.cedula, this.selectedAnio).subscribe(
      (response: any) => {
        if (response) {
          this.datos = response;
          this.formatData();
          this.generarPdf();
        }
      },
      (error: any) => {
        console.error('Error al obtener datos:', error);
      }
    );
  }

  obtenerDatosClientes() {
    this.getInfo();
  }
  onSelectAnio(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedNombre = selectElement.value;
    this.selectedAnio = selectedNombre;
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
                text: 'LECTURAS DE CLIENTE',
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
            text: 'Direccion:' + this.datos[0].PersonaDireccion,
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
            text: 'Fecha: ' + fechaFormateada,
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
      let tableBody = [
        [
          { text: '#', style: 'tableHeader' },
          { text: 'Año', style: 'tableHeader' },
          { text: 'Mes', style: 'tableHeader' },
          { text: 'Lectura Anterior', style: 'tableHeader' },
          { text: 'Lectura Actual', style: 'tableHeader' },
          { text: 'Consumo', style: 'tableHeader' },
          { text: 'FechaAbono', style: 'tableHeader' },
          { text: 'Deuda', style: 'tableHeader' },
          { text: 'Valor', style: 'tableHeader' },
          { text: 'Estado', style: 'tableHeader' },
        ],
      ];

      this.datos.forEach((cliente, index) => {
        tableBody.push([
          { text: String(index + 1), style: 'tableContent' }, // Número de fila
          { text: cliente.Año ?? '', style: 'tableContent' },
          { text: cliente.Mes ?? '', style: 'tableContent' },
          { text: cliente.Anterior ?? '', style: 'tableContent' },
          { text: cliente.Actual ?? '', style: 'tableContent' },
          { text: cliente.Consumo ?? '', style: 'tableContent' },
          { text: cliente.Abono ?? '', style: 'tableContent' },
          { text: cliente.COM ?? '', style: 'tableContent' },
          { text: cliente.Valor ?? '', style: 'tableContent' },
          { text: cliente.Estado ?? '', style: 'tableContent' },
        ]);
      });

      content.push({
        style: 'tableExample',
        table: {
          headerRows: 1,
          body: tableBody,
        },
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
      data.Abono = this.formatDate(data.Abono);
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
