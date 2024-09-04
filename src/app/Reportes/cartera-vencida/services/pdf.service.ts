import { Injectable } from '@angular/core';
import { TDocumentDefinitions, PageSize, PageOrientation } from 'pdfmake/interfaces';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { CarteraMensual, GeneralCarteraVA } from './cartera-vencida.service';

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
        item.mes ? this.getMonthName(item.mes) : 'Sin Mes', // Asegúrate de que 'mes' no sea undefined
        `$${data.reduce((sum, item) => sum + item.total_con_descuento, 0).toFixed(2)}`,
            `$${data.reduce((sum, item) => sum + item.total_sin_descuento, 0).toFixed(2)}`,
            `$${data.reduce((sum, item) => sum + item.total_facturado, 0).toFixed(2)}`,
            `$${data.reduce((sum, item) => sum + item.total_por_facturar, 0).toFixed(2)}`
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

  createTableContentLocalidades(data: CarteraMensual[]): any {
    const tableBody = [
      ['Localidad', 'Mes', 'Total con Descuento', 'Total sin Descuento', 'Total Facturado', 'Total por Facturar'].map(header => ({ text: header, style: 'tableHeader' })),
      ...data.map(item => [
        item.localidad || 'Sin Localidad', // Asegúrate de que 'localidad' no sea undefined
        item.mes ? this.getMonthName(item.mes) : 'Sin Mes', // Asegúrate de que 'mes' no sea undefined
        item.total_con_descuento !== undefined ? `$${item.total_con_descuento.toFixed(2)}` : '$0.00', // Maneja undefined
        item.total_sin_descuento !== undefined ? `$${item.total_sin_descuento.toFixed(2)}` : '$0.00', // Maneja undefined
        item.total_facturado !== undefined ? `$${item.total_facturado.toFixed(2)}` : '$0.00', // Maneja undefined
        item.total_por_facturar !== undefined ? `$${item.total_por_facturar.toFixed(2)}` : '$0.00' // Maneja undefined
      ])
    ];
  
    return {
      table: {
        headerRows: 1,
        widths: ['*', '*', '*', '*', '*', '*'], // Añade un ancho adicional para la columna de 'Mes'
        body: tableBody
      },
      layout: 'lightHorizontalLines'
    };
  }
  
  getMonthName(month: number): string {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return monthNames[month - 1] || 'Sin Mes';
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
