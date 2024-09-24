import { Injectable, ElementRef } from '@angular/core';
import { TDocumentDefinitions, PageSize, PageOrientation } from 'pdfmake/interfaces';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ValoresMes } from './valores-mes.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() {}

  generarPdf(valoresMes: ValoresMes[], pdfContainer: ElementRef | undefined): void {
    const content = this.crearContenidoPdf(valoresMes);
    const styles = this.getPdfStyles();

    this.generatePdf(content, styles).then(blob => {
      const url = URL.createObjectURL(blob);
      if (pdfContainer) {
        this.mostrarPdf(url, pdfContainer);
      }
    }).catch(error => console.error('Error al generar el PDF:', error));
  }

  private crearContenidoPdf(valoresMes: ValoresMes[]): any[] {
    const content: any[] = [];
    const currentDate = new Date().toLocaleDateString('es-ES');

    // Encabezado
    content.push(this.createPdfHeader('VALORES GENERADOS POR MES'));

    if (valoresMes.length > 0) {
      const firstItem = valoresMes[0];
      content.push(this.createInfoText(`Localidad: ${firstItem.localidad}`, `Tipo de Servicio: ${firstItem.tipo_de_servicio}`));
      content.push(this.createInfoText(`Año: ${firstItem.anio}`, `Generado: ${currentDate}`));
      content.push(this.createTableContent(valoresMes));
    } else {
      content.push(this.createNoDataMessage('No hay datos disponibles.'));
    }

    return content;
  }

  private createPdfHeader(title: string): any {
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

  private createInfoText(leftText: string, rightText: string): any {
    return {
      columns: [
        { text: leftText, style: 'infoText' },
        { text: rightText, style: 'infoText', alignment: 'right' }
      ]
    };
  }

  private createTableContent(data: ValoresMes[]): any {
    const headers = [
      { text: 'Fecha', style: 'tableHeader' },
      { text: 'Cedula', style: 'tableHeader' },
      { text: 'Cliente', style: 'tableHeader' },
      { text: 'Direccion', style: 'tableHeader' },
      { text: 'Telefono', style: 'tableHeader' },
      { text: 'Email', style: 'tableHeader' },
      { text: 'Total', style: 'tableHeader', alignment: 'right' }
    ];
  
    // Convierte los valores de 'total' a número antes de sumarlos
    const totales = data.reduce((sum, item) => sum + parseFloat(item.total), 0);
  
    const body = data.map(item => {
      const fechaObj = new Date(item.fecha);
      return [
        { text: fechaObj.toLocaleDateString(), style: 'tableData' },
        { text: item.cedula, style: 'tableData' },
        { text: item.cliente, style: 'tableData' },
        { text: item.direccion, style: 'tableData' },
        { text: item.telefono, style: 'tableData' },
        { text: item.correo, style: 'tableData' },
        { text: `$${parseFloat(item.total).toFixed(2)}`, style: 'tableData', alignment: 'right' }
      ];
    });
  
    // Añadir la fila de totales al final, sin colSpan
    body.push([
      { text: '', style: 'tableData' },
      { text: '', style: 'tableData' },  // Celda vacía para 'Cedula'
      { text: '', style: 'tableData' },  // Celda vacía para 'Cliente'
      { text: '', style: 'tableData' },  // Celda vacía para 'Direccion'
      { text: '', style: 'tableData' },  // Celda vacía para 'Telefono'
      { text: 'Valor Total', style: 'tableHeader' },  // Celda vacía para 'Email'
      { text: `$${totales.toFixed(2)}`, style: 'tableHeader', alignment: 'right' }  // Total en la última columna
    ]);
  
    return {
      table: {
        headerRows: 1,
        widths: ['auto', '*', '*', 'auto', 'auto', 'auto', 'auto'],
        body: [headers, ...body]
      },
      layout: 'lightHorizontalLines',
      margin: [0, 20, 0, 0] // Margen superior para la tabla
    };
  }
  
  
  private createNoDataMessage(message: string): any {
    return {
      text: message,
      style: 'noData',
      alignment: 'center',
      margin: [0, 20, 0, 0]
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

  private getPdfStyles(): any {
    return {
      header: { bold: true, fontSize: 16, alignment: 'center', margin: [0, 0, 0, 20] },
      infoText: { fontSize: 12, bold: true, margin: [0, 0, 0, 10] },
      noData: { fontSize: 14, bold: true },
      tableHeader: { bold: true, fontSize: 12, color: 'black' },
      tableData: { fontSize: 12 }
    };
  }

  private generatePdf(content: any[], styles: any, pageSize: PageSize = 'A4', pageOrientation: PageOrientation = 'landscape'): Promise<Blob> {
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

  private mostrarPdf(pdfUrl: string, pdfContainer: ElementRef): void {
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '500px';
    iframe.src = pdfUrl;
    pdfContainer.nativeElement.innerHTML = '';
    pdfContainer.nativeElement.appendChild(iframe);
  }
}
