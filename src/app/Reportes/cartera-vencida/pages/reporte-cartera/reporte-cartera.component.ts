import { Component, ViewChild, ElementRef } from '@angular/core';
import { CarteraVencidaService, GeneralCarteraVA } from '../../services/cartera-vencida.service';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Localidad } from '../../models/localidades';
import { GraficoComponent } from '../../components/grafico/grafico.component';
import { PdfService } from '../../services/pdf.service';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reporte-cartera',
  templateUrl: './reporte-cartera.component.html'
})
export class ReporteCarteraComponent {
  localidades: Localidad[] = [];
  years: number[] = [];
  generalData: GeneralCarteraVA[] = [];
  labels: string[] = [];
  chartData: number[] = [];
  isLoading = false;
  errorMessage = '';
  selectedTipoServicio: string | null = null;
  
  @ViewChild('pdfContainer') pdfContainer!: ElementRef;
  @ViewChild(GraficoComponent) graficoComponent!: GraficoComponent; // Referencia al componente del gráfico

  constructor(private carteraVencidaService: CarteraVencidaService,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.obtenerLocalidades();
    this.generateYears();
  }

  obtenerLocalidades(): void {
    this.carteraVencidaService.obtenerLocalidades().subscribe(
      localidades => this.localidades = localidades,
      error => console.error('Error al cargar localidades:', error)
    );
  }

  generateYears(): void {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5;
    const maxYear = startYear + 10;

    this.years = Array.from({ length: maxYear - startYear + 1 }, (_, i) => startYear + i);
  }

  handleGenerate(event: { localidadId: number | null, tipoServicio: string | null, anio: string | null }): void {
    if (event.localidadId && event.tipoServicio && event.anio) {
      this.selectedTipoServicio = event.tipoServicio;
      this.isLoading = true;
      const fechaInicio = new Date(`${event.anio}-01-01`);
      const fechaFin = new Date(`${event.anio}-12-31`);
      this.carteraVencidaService.obtenerCarteraVA(event.tipoServicio, fechaInicio, fechaFin, event.localidadId).subscribe(
        data => {
          this.generalData = data;
          this.labels = data.map(item => this.obtenerNombreMes(item.mes));
          this.chartData = data.map(item => item.total_facturado);
          this.generarPdf(); // Genera el PDF después de obtener los datos
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          this.errorMessage = `Error al obtener datos: ${error.message}`;
        }
      );
    } else {
      alert('Por favor, complete todos los campos para generar el reporte.');
    }
  }

  handleGenerateGeneral(event: { tipoServicio: string | null, anio: string | null }): void {
    if (event.tipoServicio && event.anio) {
      this.selectedTipoServicio = event.tipoServicio;
      this.isLoading = true;
      const fechaInicio = new Date(`${event.anio}-01-01`);
      const fechaFin = new Date(`${event.anio}-12-31`);
      this.carteraVencidaService.obtenerGeneralCarteraVA(event.tipoServicio, fechaInicio, fechaFin).subscribe(
        data => {
          this.generalData = data;
          this.labels = data.map(item => this.obtenerNombreMes(item.mes));
          this.chartData = data.map(item => item.total_facturado);
          this.generarPdfGeneral(); // Genera el PDF después de obtener los datos generales
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          this.errorMessage = `Error al obtener datos: ${error.message}`;
        }
      );
    } else {
      alert('Por favor, complete todos los campos para generar el reporte general.');
    }
  }

  generarPdf(): void {
    if (this.generalData.length > 0) {
      const content = [
        this.pdfService.createPdfHeader('CARTERA VENCIDA ANUAL'),
        this.pdfService.createTableContent(this.generalData)
      ];

      this.graficoComponent.generarDataURL().then((chartImage) => {
        content.push({
          image: chartImage,
          width: 500,
          alignment: 'center',
          margin: [0, 20, 0, 0]
        });

        this.pdfService.generatePdf(content, this.pdfService.getPdfStyles()).then(blob => {
          const url = URL.createObjectURL(blob);
          this.mostrarPdf(url);
        }).catch(error => {
          this.isLoading = false;
          this.errorMessage = `Error al generar el PDF: ${error}`;
        });
      }).catch(error => {
        this.isLoading = false;
        this.errorMessage = `Error al generar el gráfico: ${error}`;
      });
    } else {
      const content = [
        this.pdfService.createPdfHeader('CARTERA VENCIDA ANUAL'),
        { text: 'No hay datos disponibles para el servicio o año seleccionado.', style: 'noData', alignment: 'center', margin: [0, 20, 0, 0] }
      ];

      this.pdfService.generatePdf(content, this.pdfService.getPdfStyles()).then(blob => {
        const url = URL.createObjectURL(blob);
        this.mostrarPdf(url);
      });
    }
  }

  generarPdfGeneral(): void {
    const content: any[] = [];
    const currentDate = new Date().toLocaleDateString('es-ES');

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
        style: 'header',
        columns: [
            { width: '*', text: '' },
            {
                width: 'auto',
                stack: [
                    { text: 'CARTERA VENCIDA ANUAL', fontSize: 15, characterSpacing: 10, alignment: 'center' },
                    { canvas: [createLine(0, 5, 515), createLine(0, 10, 515)] },
                    { text: 'JUNTA ADMINISTRADORA DE AGUA POTABLE REGIONAL MANGLARALTO', fontSize: 12, margin: [0, 10, 0, 0] },
                    { text: '24900013639001 Calle 5 de junio vía a Montañita junto al Colegio Fiscal Manglaralto', fontSize: 12 }
                ]
            },
            { width: '*', text: '' }
        ],
        columnGap: 10
    });

    if (this.generalData.length > 0) {
        const firstItem = this.generalData[0];

        content.push({
            columns: [
                { text: `Localidad:  Todas las localidades`, style: 'infoText' },
                { text: `Tipo de Servicio: ${this.selectedTipoServicio}`, style: 'infoText', alignment: 'right' },
            ]
        });

        content.push({
            columns: [
                { text: `Año: ${firstItem.anio}`, style: 'infoText' },
                { text: `Generado: ${currentDate}`, style: 'infoText', alignment: 'right' }
            ]
        });

        content.push(this.createContentWithData(this.generalData));
    } else {
        content.push({
            text: 'No hay datos disponibles para el servicio o año seleccionado.',
            style: 'noData',
            alignment: 'center',
            margin: [0, 20, 0, 0]
        });
    }

    const dd: TDocumentDefinitions = {
        content: content,
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
            noData: {
                fontSize: 14,
                bold: true
            },
            tableHeader: {
                bold: true,
                fontSize: 12,
                color: 'black'
            }
        },
        pageSize: 'A4',
        pageOrientation: 'landscape'
    };

    const pdf = pdfMake.createPdf(dd);
    pdf.getBlob(blob => {
        const url = URL.createObjectURL(blob);
        this.mostrarPdf(url);
    });
  }

  createContentWithData(data: GeneralCarteraVA[]): any {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const tableBody = [
      ['Mes', 'Total con Descuento', 'Total sin Descuento', 'Total Facturado', 'Total por Facturar'].map(header => ({ text: header, style: 'tableHeader' })),
      ...data.map(item => [
        monthNames[item.mes - 1], // Convert month number to name
        `$${item.total_con_descuento.toFixed(2)}`,
        `$${item.total_sin_descuento.toFixed(2)}`,
        `$${item.total_facturado.toFixed(2)}`,
        `$${item.total_por_facturar.toFixed(2)}`
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

  obtenerNombreMes(mes: number): string {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return meses[mes - 1];
  }
}
