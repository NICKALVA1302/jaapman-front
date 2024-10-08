import { ElementRef, Injectable } from '@angular/core';
import { TDocumentDefinitions, PageSize, PageOrientation } from 'pdfmake/interfaces';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { CarteraMensual, CarteraAnual } from './cartera-vencida.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  
  constructor() {}

  generatePdf(content: any[], styles: any, pageSize: PageSize = 'A4', pageOrientation: PageOrientation = 'landscape'): Promise<Blob> {
    const dd: TDocumentDefinitions = {
      content: content,
      styles: styles,
      pageSize: pageSize,
      pageOrientation: pageOrientation,
    };
    return new Promise((resolve, reject) => {
      try {
        const pdf = pdfMake.createPdf(dd);
        pdf.getBlob(blob => {
          resolve(blob);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  createTableContent(data: CarteraMensual[]): any {
    const tableBody = [
      ['Mes', 'Total con Descuento', 'Total sin Descuento', 'Total Facturado', 'Total por Facturar'].map(header => ({ text: header, style: 'tableHeader' })),
      ...data.map(item => [
        item.mes ? this.getMonthName(item.mes) : 'Sin Mes',  // Asegurarse de que 'mes' no es undefined
        item.total_con_descuento !== undefined ? `$${item.total_con_descuento.toFixed(2)}` : '$0.00',  // Maneja undefined
        item.total_sin_descuento !== undefined ? `$${item.total_sin_descuento.toFixed(2)}` : '$0.00',  // Maneja undefined
        item.total_facturado !== undefined ? `$${item.total_facturado.toFixed(2)}` : '$0.00',  // Maneja undefined
        item.total_por_facturar !== undefined ? `$${item.total_por_facturar.toFixed(2)}` : '$0.00'  // Maneja undefined
      ])
    ];
  
    return {
      table: {
        headerRows: 1,
        widths: ['*', '*', '*', '*', '*'],
        body: tableBody
      },
      layout: 'lightHorizontalLines'
    };
  }

  createTableContentAnual(data: CarteraAnual[]): any {
    // Sumar los totales de cada columna
    const totalConDescuento = data.reduce((sum, item) => sum + (item.total_con_descuento || 0), 0);
    const totalSinDescuento = data.reduce((sum, item) => sum + (item.total_sin_descuento || 0), 0);
    const totalFacturado = data.reduce((sum, item) => sum + (item.total_facturado || 0), 0);
    const totalPorFacturar = data.reduce((sum, item) => sum + (item.total_por_facturar || 0), 0);
  
    const tableBody = [
      ['Mes', 'Total con Descuento', 'Total sin Descuento', 'Total Facturado', 'Total por Facturar'].map(header => ({ text: header, style: 'tableHeader' })),
      ...data.map(item => [
        item.mes ? this.getMonthName(item.mes) : 'Sin Mes',  // Verificar directamente si hay un valor en 'mes'
        item.total_con_descuento !== undefined ? `$${item.total_con_descuento.toFixed(2)}` : '$0.00',
        item.total_sin_descuento !== undefined ? `$${item.total_sin_descuento.toFixed(2)}` : '$0.00',
        item.total_facturado !== undefined ? `$${item.total_facturado.toFixed(2)}` : '$0.00',
        item.total_por_facturar !== undefined ? `$${item.total_por_facturar.toFixed(2)}` : '$0.00'
      ])
    ];
  
    // Agregar una fila al final con los totales sumados
    tableBody.push([
      { text: 'Totales:', style: 'tableHeader' },
      { text: `$${totalConDescuento.toFixed(2)}`, style: 'tableHeader' },
      { text: `$${totalSinDescuento.toFixed(2)}`, style: 'tableHeader' },
      { text: `$${totalFacturado.toFixed(2)}`, style: 'tableHeader' },
      { text: `$${totalPorFacturar.toFixed(2)}`, style: 'tableHeader' }
    ]);
  
    return {
      table: {
        headerRows: 1,
        widths: ['*', '*', '*', '*', '*'],
        body: tableBody
      },
      layout: 'lightHorizontalLines'
    };
  }
  
  getMonthName(month: number): string {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return monthNames[month - 1] || 'Sin Mes';
  }
  
  generarPdfSinDatos(localidad: string, tipoServicio: string, anio: string, fechaGeneracion: Date, pdfContainer: ElementRef): void {
    const pdfContent = [
      this.createPdfHeader('Reporte Mensual de Cartera'),
      {
        columns: [
          { text: `Localidad: ${localidad}`, style: 'infoText' },
          { text: `Tipo de Servicio: ${tipoServicio}`, style: 'infoText', alignment: 'right' }
        ],
        margin: [0, 10, 0, 0]
      },
      {
        columns: [
          { text: `Año: ${anio}`, style: 'infoText' },
          { text: `Generado: ${fechaGeneracion.toLocaleDateString()}`, style: 'infoText', alignment: 'right' }
        ],
        margin: [0, 0, 0, 20]
      },
      {
        text: 'Reporte no disponible por falta de datos',
        alignment: 'center',
        style: 'infoText',
        margin: [0, 50, 0, 50]
      },
      '\n\n',
      {
        text: '______________________\nFirma encargado',
        alignment: 'center',
        margin: [0, 20, 0, 0],
        style: 'infoText'
      }
    ];

    const styles = this.getPdfStyles();

    this.generatePdf(pdfContent, styles, 'A4', 'landscape').then(blob => {
      const pdfUrl = URL.createObjectURL(blob);
      this.mostrarPdf(pdfUrl, pdfContainer);
    }).catch(error => {
      console.error('Error al generar el PDF:', error);
    });
  }

  generarPdfSinDatosAnual(localidad: string, tipoServicio: string, anio: string, fechaGeneracion: Date, pdfContainer: ElementRef): void {
    const pdfContent = [
      this.createPdfHeader('Reporte Anual de Cartera'),
      {
        columns: [
          { text: `Localidad: ${localidad}`, style: 'infoText' },
          { text: `Tipo de Servicio: ${tipoServicio}`, style: 'infoText', alignment: 'right' }
        ],
        margin: [0, 10, 0, 0]
      },
      {
        columns: [
          { text: `Año: ${anio}`, style: 'infoText' },
          { text: `Generado: ${fechaGeneracion.toLocaleDateString()}`, style: 'infoText', alignment: 'right' }
        ],
        margin: [0, 0, 0, 20]
      },
      {
        text: 'Reporte no disponible por falta de datos',
        alignment: 'center',
        style: 'infoText',
        margin: [0, 50, 0, 50]
      },
      '\n\n',
      {
        text: '______________________\nFirma encargado',
        alignment: 'center',
        margin: [0, 20, 0, 0],
        style: 'infoText'
      }
    ];

    const styles = this.getPdfStyles();

    this.generatePdf(pdfContent, styles, 'A4', 'landscape').then(blob => {
      const pdfUrl = URL.createObjectURL(blob);
      this.mostrarPdf(pdfUrl, pdfContainer);
    }).catch(error => {
      console.error('Error al generar el PDF:', error);
    });
  }

  mostrarPdf(pdfUrl: string, pdfContainer: ElementRef): void {
    if (pdfContainer) {
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '500px';
      iframe.src = pdfUrl;
      pdfContainer.nativeElement.innerHTML = '';
      pdfContainer.nativeElement.appendChild(iframe);
    }
  }

  createPdfHeader(title: string): any {
    return {
      alignment: 'center',
      style: 'header',
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          stack: [
            { text: title, fontSize: 15, characterSpacing: 10, alignment: 'center' },
            { canvas: [this.createLine(0, 5, 515), this.createLine(0, 10, 515)] },
            { text: 'JUNTA ADMINISTRADORA DE AGUA POTABLE REGIONAL MANGLARALTO', fontSize: 12, margin: [0, 10, 0, 0] },
            { text: '24900013639001 Calle 5 de junio vía a Montañita junto al Colegio Fiscal Manglaralto', fontSize: 12 }
          ]
        },
        { width: '*', text: '' }
      ],
      columnGap: 10
    };
  }

  private createLine(x1: number, y1: number, x2: number): object {
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

  getPdfStyles(): any {
    return {
      header: { bold: true, fontSize: 16, alignment: 'center', margin: [0, 0, 0, 20] },
      infoText: { fontSize: 12, bold: true, margin: [0, 0, 0, 10] },
      noData: { fontSize: 14, bold: true },
      tableHeader: { bold: true, fontSize: 12, color: 'black' },
    };
  }
}
