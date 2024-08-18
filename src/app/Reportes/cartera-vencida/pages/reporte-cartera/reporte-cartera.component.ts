import { Component, ViewChild, ElementRef } from '@angular/core';
import { CarteraVA, CarteraVencidaService, GeneralCarteraVA } from '../../services/cartera-vencida.service';
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
  generalData: CarteraVA[] = [];
  labels: string[] = [];
  chartData: number[] = [];
  isLoading = false;
  errorMessage = '';
  selectedTipoServicio: string | null = null;
  private loadingTimeout: any;

  @ViewChild('pdfContainer') pdfContainer!: ElementRef;
  @ViewChild(GraficoComponent) graficoComponent!: GraficoComponent; // Referencia al componente del gráfico

  constructor(private carteraVencidaService: CarteraVencidaService,
    private pdfService: PdfService
  ) { }

  ngOnInit(): void {
    this.obtenerLocalidades();
    this.generateYears();
  }

  ngAfterViewInit() {
    // Ahora `graficoComponent` y otros `ViewChild` están disponibles
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
      this.loadingTimeout = setTimeout(() => {
        this.isLoading = true;
      }, 2000);
      const fechaInicio = new Date(`${event.anio}-01-01`);
      const fechaFin = new Date(`${event.anio}-12-31`);
      this.carteraVencidaService.obtenerCarteraVA(event.tipoServicio, fechaInicio, fechaFin, event.localidadId).subscribe(
        data => {
          this.generalData = data;
          this.labels = data.map(item => this.obtenerNombreMes(item.mes));
          this.chartData = data.map(item => item.total_facturado);
          this.generarPdf(); // Genera el PDF después de obtener los datos
          clearTimeout(this.loadingTimeout); // Limpia el timeout
          this.isLoading = false;
        },
        error => {
          clearTimeout(this.loadingTimeout); // Limpia el timeout
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
      this.loadingTimeout = setTimeout(() => {
        this.isLoading = true;
      }, 2000);
      const fechaInicio = new Date(`${event.anio}-01-01`);
      const fechaFin = new Date(`${event.anio}-12-31`);
      this.carteraVencidaService.obtenerGeneralCarteraVA(event.tipoServicio, fechaInicio, fechaFin).subscribe(
        data => {
          this.generalData = data.map(item => ({
            ...item,
            localidad: 'Todas las localidades' // Valor predeterminado para localidad
          }));
          this.labels = data.map(item => this.obtenerNombreMes(item.mes));
          this.chartData = data.map(item => item.total_facturado);
          this.generarPdfGeneral(); // Genera el PDF después de obtener los datos generales
          clearTimeout(this.loadingTimeout); // Limpia el timeout
          this.isLoading = false;
        },
        error => {
          clearTimeout(this.loadingTimeout); // Limpia el timeout
          this.isLoading = false;
          this.errorMessage = `Error al obtener datos: ${error.message}`;
        }
      );
    } else {
      alert('Por favor, complete todos los campos para generar el reporte general.');
    }
  }

  generarPdf(): void {
    const currentDate = new Date().toLocaleDateString('es-ES');
  
    if (this.generalData.length > 0) {
      const firstItem = this.generalData[0];
  
      const content = [
        this.pdfService.createPdfHeader('CARTERA VENCIDA ANUAL'),
        {
          columns: [
            { text: `Localidad: ${firstItem.localidad || 'Todas las localidades'}`, style: 'infoText' },
            { text: `Tipo de Servicio: ${this.selectedTipoServicio}`, style: 'infoText', alignment: 'right' },
          ]
        },
        {
          columns: [
            { text: `Año: ${firstItem.anio}`, style: 'infoText' },
            { text: `Generado: ${currentDate}`, style: 'infoText', alignment: 'right' }
          ]
        },
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
          console.error(error);
        });
      }).catch(error => {
        this.isLoading = false;
        this.errorMessage = `Error al generar el gráfico: ${error}`;
        console.error(error);
      });
  
    } else {
      const content = [
        this.pdfService.createPdfHeader('CARTERA VENCIDA ANUAL'),
        { text: 'No hay datos disponibles para el servicio o año seleccionado.', style: 'noData', alignment: 'center', margin: [0, 20, 0, 0] }
      ];
  
      this.pdfService.generatePdf(content, this.pdfService.getPdfStyles()).then(blob => {
        const url = URL.createObjectURL(blob);
        this.mostrarPdf(url);
      }).catch(error => {
        this.isLoading = false;
        this.errorMessage = `Error al generar el PDF: ${error}`;
        console.error(error);
      });
    }
  }
  
  generarPdfGeneral(): void {
    const content: any[] = [];
    const currentDate = new Date().toLocaleDateString('es-ES');

    content.push(this.pdfService.createPdfHeader('CARTERA VENCIDA ANUAL - GENERAL'));

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

      content.push(this.pdfService.createTableContent(this.generalData));

      // Generar el gráfico y añadirlo al PDF
      this.graficoComponent.generarDataURL().then((chartImage) => {
        content.push({
          image: chartImage,
          width: 500,
          alignment: 'center',
          margin: [0, 20, 0, 0]
        });

        const dd: TDocumentDefinitions = {
          content: content,
          styles: this.pdfService.getPdfStyles(),
          pageSize: 'A4',
          pageOrientation: 'landscape'
        };

        const pdf = pdfMake.createPdf(dd);
        pdf.getBlob(blob => {
          const url = URL.createObjectURL(blob);
          this.mostrarPdf(url);
        });
      }).catch(error => {
        this.errorMessage = `Error al generar el gráfico: ${error}`;
        console.error('Error al generar el gráfico:', error);
      });
    } else {
      content.push({
        text: 'No hay datos disponibles para el servicio o año seleccionado.',
        style: 'noData',
        alignment: 'center',
        margin: [0, 20, 0, 0]
      });

      const dd: TDocumentDefinitions = {
        content: content,
        styles: this.pdfService.getPdfStyles(),
        pageSize: 'A4',
        pageOrientation: 'landscape'
      };

      const pdf = pdfMake.createPdf(dd);
      pdf.getBlob(blob => {
        const url = URL.createObjectURL(blob);
        this.mostrarPdf(url);
      });
    }
  }

  obtenerNombreMes(mes: number): string {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return meses[mes - 1];
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
/* SE VE MAS PRESENTABLE SOLO EL HECHO DE REDUCIR MAS DE 200 LINEAS
TOCO REORGANIZAR TODO, PERO YA ES ENTENDIBLE CREOOO XD
*/