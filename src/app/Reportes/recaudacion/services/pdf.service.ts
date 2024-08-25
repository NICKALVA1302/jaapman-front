import { Injectable, ElementRef } from '@angular/core';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { RecaudacionAguaDia, RecaudacionAguaMensual, RecaudacionAguaAnual } from './recaudacion.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  generarPdf(tipo: string, data: any[], pdfContainer: ElementRef | undefined): void {
    let content;

    switch (tipo) {
      case 'diario':
        content = this.generarContenidoDiario(data);
        break;
      case 'mensual':
        content = this.generarContenidoMensual(data);
        break;
      case 'anual':
        content = this.generarContenidoAnual(data);
        break;
      default:
        console.error('Tipo de reporte no válido');
        return;
    }

    const pdfDefinition = this.crearDefinicionPdf(content, tipo, data[0]?.localidad);
    this.crearYMostrarPdf(pdfDefinition, pdfContainer);
  }

  private generarContenidoDiario(data: RecaudacionAguaDia[]): any {
    const headers = [
      { text: 'No.', style: 'tableHeader' },
      { text: 'Fecha', style: 'tableHeader' },
      { text: 'Cliente', style: 'tableHeader' },
      { text: 'Total', style: 'tableHeader' }
    ];

    const body = data.map((item, index) => {
      const fechaObj = new Date(item.fecha);
      const formattedFecha = fechaObj.toLocaleDateString('es-ES');

      return [
        { text: (index + 1).toString(), style: 'tableData' },
        { text: formattedFecha, style: 'tableData' },
        { text: item.cliente, style: 'tableData' },
        { text: `$${item.total_pago}`, style: 'tableData' }
      ];
    });

    return {
      table: {
        headerRows: 1,
        widths: ['auto', '*', '*', 'auto'],
        body: [headers, ...body]
      },
      layout: 'lightHorizontalLines'
    };
  }

  private generarContenidoMensual(data: RecaudacionAguaMensual[]): any {
    const headers = [
      { text: 'No.', style: 'tableHeader' },
      { text: 'Fecha', style: 'tableHeader' },
      { text: 'Recaudación Total', style: 'tableHeader' }
    ];

    const body = data.map((item, index) => [
      { text: (index + 1).toString(), style: 'tableData' },
      { text: item.fecha, style: 'tableData' },
      { text: `$${item.recaudacion_total}`, style: 'tableData' }
    ]);

    return {
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto'],
        body: [headers, ...body]
      },
      layout: 'lightHorizontalLines'
    };
  }

  private generarContenidoAnual(data: RecaudacionAguaAnual[]): any {
    const headers = [
      { text: 'No.', style: 'tableHeader' },
      { text: 'Mes', style: 'tableHeader' },
      { text: 'Recaudación Total', style: 'tableHeader' }
    ];
  
    const body = data.map((item, index) => [
      { text: (index + 1).toString(), style: 'tableData' },
      { text: this.obtenerNombreMes(item.mes), style: 'tableData' }, // Convertir el número del mes a nombre
      { text: `$${item.recaudacion_total}`, style: 'tableData' }
    ]);
  
    return {
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto'],
        body: [headers, ...body]
      },
      layout: 'lightHorizontalLines'
    };
  }
  

  generarPdfConGrafico(tipo: string, data: any[], chartImage: string, pdfContainer: ElementRef | undefined): void {
    let content: any[] = []; // Inicializar content como un array

    switch (tipo) {
      case 'diario':
        content = this.generarContenidoDiario(data);
        break;
      case 'mensual':
        content = this.generarContenidoMensual(data);
        break;
      case 'anual':
        content = this.generarContenidoAnual(data);
        break;
      default:
        console.error('Tipo de reporte no válido');
        return;
    }

    // Si generarContenidoDiario, generarContenidoMensual o generarContenidoAnual no devuelven un array,
    // puedes asegurarte aquí de que content sea un array.
    if (!Array.isArray(content)) {
        content = [content]; // Convierte content en un array si no lo es
    }

    // Ahora es seguro usar push para añadir el gráfico
    content.push({
      image: chartImage,
      width: 500,
      alignment: 'center',
      margin: [0, 20, 0, 0]
    });

    const pdfDefinition = this.crearDefinicionPdf(content, tipo, data[0]?.localidad);
    this.crearYMostrarPdf(pdfDefinition, pdfContainer);
}

private obtenerNombreMes(mes: string): string {
  const mesNumero = parseInt(mes.split('-')[1], 10); // Suponiendo que `mes` tiene el formato 'YYYY-MM'
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return meses[mesNumero - 1];
}

  private crearDefinicionPdf(content: any, tipo: string, localidad: string): TDocumentDefinitions {
    return {
      content: [
        {
          alignment: 'center',
          style: 'header',
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              stack: [
                { text: `RECAUDACION ${tipo.toUpperCase()} AGUA`, fontSize: 15, characterSpacing: 10, alignment: 'center' },
                {
                  canvas: [
                    { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 },
                    { type: 'line', x1: 0, y1: 10, x2: 515, y2: 10, lineWidth: 1 }
                  ]
                },
                { text: 'JUNTA ADMINISTRADORA DE AGUA POTABLE REGIONAL MANGLARALTO', fontSize: 12, margin: [0, 10, 0, 0] },
                { text: '24900013639001 Calle 5 de junio vía a Montañita junto al Colegio Fiscal Manglaralto', fontSize: 12 }
              ]
            },
            { width: '*', text: '' }
          ],
          columnGap: 10
        },
        {
          columns: [
            { text: `Localidad: ${localidad}`, style: 'infoText' },
            { text: `Generado: ${new Date().toLocaleDateString('es-ES')}`, style: 'infoText', alignment: 'right' }
          ]
        },
        content
      ],
      styles: {
        header: {
          bold: true,
          fontSize: 16,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        infoText: {
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black'
        },
        tableData: {
          fontSize: 10
        }
      },
      pageSize: 'A4',
      pageOrientation: 'landscape',
      footer: (currentPage, pageCount) => {
        return { text: `Página ${currentPage} de ${pageCount}`, alignment: 'center', margin: [0, 10] };
      }
    };
  }

  private crearYMostrarPdf(pdfDefinition: TDocumentDefinitions, pdfContainer: ElementRef | undefined): void {
    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.getBlob(blob => {
      const url = URL.createObjectURL(blob);
      this.mostrarPdf(url, pdfContainer);
    });
  }

  private mostrarPdf(pdfUrl: string, pdfContainer: ElementRef | undefined): void {
    if (pdfContainer) {
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '500px';
      iframe.src = pdfUrl;
      pdfContainer.nativeElement.innerHTML = '';
      pdfContainer.nativeElement.appendChild(iframe);
    }
  }
}
