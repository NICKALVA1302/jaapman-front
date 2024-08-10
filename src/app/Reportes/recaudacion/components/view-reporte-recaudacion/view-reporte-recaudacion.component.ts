import { Component, ElementRef, ViewChild } from '@angular/core';
import { Localidad } from '../../models/localidades';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { RecaudacionAguaAnual, RecaudacionAguaDia, RecaudacionAguaMensual, RecaudacionService } from '../../services/recaudacion.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-view-reporte-recaudacion',
  templateUrl: './view-reporte-recaudacion.component.html',
  styleUrls: ['./view-reporte-recaudacion.component.css']
})
export class ViewReporteRecaudacionComponent {
  model: any;
  localidades: Localidad[] = [];
  selectedLocalidadId: number | null = null;
  RecaudacionAguaDia: RecaudacionAguaDia[] = [];
  RecaudacionAguaMensual: RecaudacionAguaMensual[] = [];
  RecaudacionAguaAnual: RecaudacionAguaAnual[] = [];

  @ViewChild('pdfContainer') pdfContainer: ElementRef | undefined;
  
  constructor(private recaudacionService: RecaudacionService) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
  }

  ngOnInit(): void {
    this.obtenerLocalidades();
  }

  obtenerLocalidades(): void {
    this.recaudacionService.obtenerLocalidades().subscribe(
      localidades => {
        this.localidades = localidades;
      },
      error => {
        console.error('Error al cargar localidades:', error);
      }
    );
  }

  convertToDate(ngbDate: { year: number; month: number; day: number }): Date {
    return new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
  }

  obtenerValores(): void {
    if (!this.selectedLocalidadId || !this.model) {
      console.error('Debes seleccionar una localidad y una fecha');
      return;
    }

    const date = this.convertToDate(this.model);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const fechaDia = `${year}-${month}-${day}`;
    const localidad = this.selectedLocalidadId;

    this.recaudacionService.obtenerReporteAguaporDia(fechaDia, localidad).subscribe(
      data => {
        this.RecaudacionAguaDia = data;
        console.log(this.RecaudacionAguaDia);
        this.generarPdfDiario();
      },
      error => {
        console.error('Error al obtener la recaudación de agua por día:', error);
      }
    );
  }

  obtenerValoresMensuales(): void {
    if (!this.selectedLocalidadId || !this.model) {
      console.error('Debes seleccionar una localidad y una fecha');
      return;
    }

    const date = this.convertToDate(this.model);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    const fechaMes = `${year}-${month}`;
    const localidad = this.selectedLocalidadId;

    this.recaudacionService.obtenerReporteAguaporMes(fechaMes, localidad).subscribe(
      data => {
        this.RecaudacionAguaMensual = data;
        console.log(this.RecaudacionAguaMensual);
        this.generarPdfMensual();
      },
      error => {
        console.error('Error al obtener la recaudación de agua por mes:', error);
      }
    );
  }

  obtenerValoresAnuales(): void {
    if (!this.selectedLocalidadId || !this.model) {
      console.error('Debes seleccionar una localidad y una fecha');
      return;
    }

    const date = this.convertToDate(this.model);
    const year = date.getFullYear();

    const fechaAnual = `${year}`;
    const localidad = this.selectedLocalidadId;

    this.recaudacionService.obtenerReporteAguaporAnio(fechaAnual, localidad).subscribe(
      data => {
        this.RecaudacionAguaAnual = data;
        console.log(this.RecaudacionAguaAnual);
        this.generarPdfAnual();
      },
      error => {
        console.error('Error al obtener la recaudación de agua por año:', error);
      }
    );
  }

  generarPdfDiario(): void {
    const content = this.generarContenidoDiario(this.RecaudacionAguaDia);
    this.generarPdf('diario', content);
  }
  
  generarContenidoDiario(data: RecaudacionAguaDia[]): any {
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
  
  generarPdfMensual(): void {
    const content = this.generarContenidoMensual(this.RecaudacionAguaMensual);
    this.generarPdf('mensual', content);
  }
  
  generarContenidoMensual(data: RecaudacionAguaMensual[]): any {
    const headers = [
      { text: 'No.', style: 'tableHeader' },
      { text: 'Fecha', style: 'tableHeader' },
      { text: 'Recaudación Total', style: 'tableHeader' }
    ];
  
    const body = data.map((item, index) => {
      const fechaObj = new Date(`${item.fecha}-01`); // Suponiendo que `item.fecha` tiene el formato 'YYYY-MM'
      const mes = fechaObj.toLocaleDateString('es-ES', { month: 'long' }); // Obtener solo el mes en letras
  
      return [
        { text: (index + 1).toString(), style: 'tableData' },
        { text: item.fecha, style: 'tableData' },
        { text: `$${item.recaudacion_total}`, style: 'tableData' }
      ];
    });
  
    return {
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto'],
        body: [headers, ...body]
      },
      layout: 'lightHorizontalLines'
    };
  }
  

  generarPdfAnual(): void {
    const content = this.generarContenidoAnual(this.RecaudacionAguaAnual);
    this.generarPdf('anual', content);
  }
  
  generarContenidoAnual(data: RecaudacionAguaAnual[]): any {
    const headers = [
      { text: 'No.', style: 'tableHeader' },
      { text: 'Mes', style: 'tableHeader' },
      { text: 'Recaudación Total', style: 'tableHeader' }
    ];
  
    const body = data.map((item, index) => [
      { text: (index + 1).toString(), style: 'tableData' },
      { text: item.mes, style: 'tableData' },
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
  
  generarPdf(tipo: string, content: any): void {
    let firstItem = null;

  switch (tipo) {
    case 'diario':
      firstItem = this.RecaudacionAguaDia.length > 0 ? this.RecaudacionAguaDia[0] : null;
      break;
    case 'mensual':
      firstItem = this.RecaudacionAguaMensual.length > 0 ? this.RecaudacionAguaMensual[0] : null;
      break;
    case 'anual':
      firstItem = this.RecaudacionAguaAnual.length > 0 ? this.RecaudacionAguaAnual[0] : null;
      break;
    default:
      console.error('Tipo de reporte no válido');
      return;
  }
    const pdfContent = [
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
          { text: `Localidad: ${firstItem?.localidad}`, style: 'infoText' },
          { text: `Generado: ${new Date().toLocaleDateString('es-ES')}`, style: 'infoText', alignment: 'right' }
        ]
      },
      content
    ];
  
    const dd: TDocumentDefinitions = {
      content: pdfContent,
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
      footer: function(currentPage, pageCount) {
        return { text: `Página ${currentPage} de ${pageCount}`, alignment: 'center', margin: [0, 10] };
      }
    };
  
    const pdf = pdfMake.createPdf(dd);
    pdf.getBlob(blob => {
      const url = URL.createObjectURL(blob);
      this.mostrarPdf(url);
    });
  }

  createContentWithData(data: any[], tipo: string): any {
    const headers = tipo === 'diario'
      ? [
          { text: 'No.', style: 'tableHeader' },
          { text: 'Fecha', style: 'tableHeader' },
          { text: 'Cliente', style: 'tableHeader' },
          { text: 'Total', style: 'tableHeader' }
        ]
      : tipo === 'mensual'
        ? [
            { text: 'No.', style: 'tableHeader' },
            { text: 'Mes', style: 'tableHeader' },
            { text: 'Recaudación Total', style: 'tableHeader' }
          ]
        : [
            { text: 'No.', style: 'tableHeader' },
            { text: 'Mes', style: 'tableHeader' },
            { text: 'Recaudación Total', style: 'tableHeader' }
          ];
  
    const body = data.map((item, index) => {
      let formattedFecha = '';
      let mes = '';
      
      if (tipo === 'diario') {
        const fechaObj = new Date(item.fecha);
        formattedFecha = fechaObj.toLocaleDateString('es-ES');
      } else if (tipo === 'mensual') {
        const fechaObj = new Date(`${item.fecha}-01`);
        mes = fechaObj.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      } else if (tipo === 'anual') {
        mes = item.mes; // Asume que item.mes ya está en el formato correcto
      }
  
      return [
        { text: (index + 1).toString(), style: 'tableData' },
        { text: tipo === 'diario' ? formattedFecha : mes, style: 'tableData' },
        { text: `$${item.recaudacion_total}`, style: 'tableData' }
      ];
    });
  
    return {
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto'],
        body: [headers, ...body]
      },
      layout: 'lightHorizontalLines'
    };
  }
  
  mostrarPdf(pdfUrl: string): void {
    if (this.pdfContainer) {
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '500px';
      iframe.src = pdfUrl;
      this.pdfContainer.nativeElement.innerHTML = '';
      this.pdfContainer.nativeElement.appendChild(iframe);
    }
  }
}
