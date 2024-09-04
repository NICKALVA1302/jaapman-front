import { Component, ElementRef, ViewChild } from '@angular/core';
import { GraficoComponent } from '../../components/grafico/grafico.component';
import { Localidad } from '../../models/localidades';
import { CarteraMensual, CarteraVencidaService } from '../../services/cartera-vencida.service';
import { PdfService } from '../../services/pdf.service';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

type MonthKey = 'Enero' | 'Febrero' | 'Marzo' | 'Abril' | 'Mayo' | 'Junio' |
  'Julio' | 'Agosto' | 'Septiembre' | 'Octubre' | 'Noviembre' | 'Diciembre';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reporte-cartera-mensual',
  templateUrl: './reporte-cartera-mensual.component.html',
  styleUrl: './reporte-cartera-mensual.component.css'
})
export class ReporteCarteraMensualComponent {

  localidades: Localidad[] = [];
  years: number[] = [];
  generalData: CarteraMensual[] = [];
  labels: string[] = [];
  chartData: number[] = [];
  isLoading = false;
  errorMessage = '';
  selectedMes: MonthKey | null = null;

  private loadingTimeout: any;

  @ViewChild('pdfContainer') pdfContainer: ElementRef | undefined;
  //@ViewChild('pdfContainer') pdfContainer!: ElementRef;
  @ViewChild(GraficoComponent) graficoComponent!: GraficoComponent; // Referencia al componente del gráfico

  constructor(private carteraVencidaService: CarteraVencidaService,
    private pdfService: PdfService
  ) { }

  handleGenerate(event: { localidadId: number | null, tipoServicio: string | null, mes: string | null, anio: string | null }): void {
    const { localidadId, tipoServicio, mes, anio } = event;
  
    // Primero, valida que los parámetros básicos estén presentes
    if (!mes || !anio) {
      alert('Por favor, complete todos los campos para generar el reporte.');
      return;
    }
  
    // Mapeo de meses
    const monthMapping: Record<MonthKey, string> = {
      Enero: "01", Febrero: "02", Marzo: "03", Abril: "04", Mayo: "05", Junio: "06",
      Julio: "07", Agosto: "08", Septiembre: "09", Octubre: "10", Noviembre: "11", Diciembre: "12"
    };
  
    const monthNumber = monthMapping[mes as MonthKey];
    if (!monthNumber) {
      console.error('Mes no válido:', mes);
      return;
    }
  
    const fechaInicio = `${anio}-${monthNumber}-01`;
    const lastDay = new Date(parseInt(anio), parseInt(monthNumber), 0).getDate();
    const fechaFin = `${anio}-${monthNumber}-${lastDay}`;
  
    console.log('Fecha Inicio:', fechaInicio);
    console.log('Fecha Fin:', fechaFin);
  
    // Determina el caso y realiza la consulta correspondiente
    this.isLoading = true;
  
    if (tipoServicio && localidadId) {
      // Caso 1: Localidad específica, un servicio, y el mes
      this.generarCaso1(tipoServicio, fechaInicio, fechaFin, localidadId);
    } else if (tipoServicio && !localidadId) {
      // Caso 2: Todas las localidades, un servicio
      this.generarCaso2(tipoServicio, fechaInicio, fechaFin);
    } else if (!tipoServicio && localidadId) {
      // Caso 3: Una localidad, todos los servicios
      //this.generarCaso3(fechaInicio, fechaFin, localidadId);
    } else {
      // Caso 4: Todas las localidades, todos los servicios
      //this.generarCaso4(fechaInicio, fechaFin);
    }
  }
  
  private generarCaso1(tipoServicio: string, fechaInicio: string, fechaFin: string, localidadId: number): void {
    this.carteraVencidaService.obtenerCarteraMensual(tipoServicio, fechaInicio, fechaFin, localidadId.toString()).subscribe(
      data => {
        this.generalData = data;
        this.labels = data.map(item => `Día ${new Date(item.fecha).getDate()}`);
        this.chartData = data.map(item => item.total_facturado);
        this.isLoading = false;
        this.generarPdfCaso1();
      },
      error => {
        this.isLoading = false;
        this.errorMessage = `Error al obtener datos: ${error.message}`;
      }
    );
  }
  
  private generarCaso2(tipoServicio: string, fechaInicio: string, fechaFin: string): void {
    this.carteraVencidaService.obtenerCarteraMensual(tipoServicio, fechaInicio, fechaFin, '').subscribe(
      data => {
        this.generalData = data;
        this.labels = data.map(item => item.localidad || 'No especificada');  // Localidades como etiquetas
        this.chartData = data.map(item => item.total_facturado);  // Total facturado por localidad
        this.isLoading = false;
        this.generarPdfCaso2();
      },
      error => {
        this.isLoading = false;
        this.errorMessage = `Error al obtener datos: ${error.message}`;
      }
    );
  }

  generarPdfCaso1(): void {
    if (!this.graficoComponent) {
      console.error('No se puede generar el PDF sin un gráfico.');
      return;
    }

    const fechaGeneracion = new Date();
    const localidad = this.generalData.length > 0 ? this.generalData[0].localidad : 'No especificada';
    const tipoServicio = this.generalData.length > 0 ? this.generalData[0].tipo_de_servicio : 'No especificado';
    const anio = this.generalData.length > 0 ? this.generalData[0].anio : 'No especificado';

    // Verificar si hay datos disponibles
    if (this.generalData.length === 0) {
      const pdfContent = [
        this.pdfService.createPdfHeader('Reporte Mensual de Cartera'),
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

      const styles = this.pdfService.getPdfStyles();

      this.pdfService.generatePdf(pdfContent, styles, 'A4', 'landscape').then(blob => {
        const pdfUrl = URL.createObjectURL(blob);
        this.mostrarPdf(pdfUrl);
      }).catch(error => {
        console.error('Error al generar el PDF:', error);
      });
      return;
    }

    this.graficoComponent.generarDataURL().then(dataURL => {
      const pdfContent = [
        this.pdfService.createPdfHeader('Reporte Mensual de Cartera'),
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
          image: dataURL,
          width: 500,
          alignment: 'center'
        },
        '\n\n',
        this.pdfService.createTableContent([this.sumarTotales(this.generalData)]),
        '\n\n',
        {
          text: '______________________\nFirma encargado',
          alignment: 'center',
          margin: [0, 20, 0, 0],
          style: 'infoText'
        }
      ];

      const styles = this.pdfService.getPdfStyles();

      this.pdfService.generatePdf(pdfContent, styles, 'A4', 'landscape').then(blob => {
        const pdfUrl = URL.createObjectURL(blob);
        this.mostrarPdf(pdfUrl);
      }).catch(error => {
        console.error('Error al generar el PDF:', error);
      });
    }).catch(error => {
      console.error('Error al generar la imagen del gráfico:', error);
    });
  }

  private generarPdfCaso2(): void {
    if (!this.graficoComponent) {
      console.error('No se puede generar el PDF sin un gráfico.');
      return;
    }
  
    const fechaGeneracion = new Date();
    const tipoServicio = this.generalData.length > 0 ? this.generalData[0].tipo_de_servicio : 'No especificado';
  
    this.graficoComponent.generarDataURL().then(dataURL => {
      const pdfContent = [
        this.pdfService.createPdfHeader('Reporte Mensual de Cartera'),
        {
          columns: [
            { text: `Tipo de Servicio: ${tipoServicio}`, style: 'infoText' },
            { text: `Generado: ${fechaGeneracion.toLocaleDateString()}`, style: 'infoText', alignment: 'right' }
          ],
          margin: [0, 10, 0, 20]
        },
        {
          image: dataURL,
          width: 500,
          alignment: 'center'
        },
        '\n\n',
        this.pdfService.createTableContentLocalidades(this.generalData), // Llama a la función corregida
        '\n\n',
        {
          text: '______________________\nFirma encargado',
          alignment: 'center',
          margin: [0, 20, 0, 0],
          style: 'infoText'
        }
      ];
  
      const styles = this.pdfService.getPdfStyles();
  
      this.pdfService.generatePdf(pdfContent, styles, 'A4', 'landscape').then(blob => {
        const pdfUrl = URL.createObjectURL(blob);
        this.mostrarPdf(pdfUrl);
      }).catch(error => {
        console.error('Error al generar el PDF:', error);
      });
    }).catch(error => {
      console.error('Error al generar la imagen del gráfico:', error);
    });
  }
  
  
  sumarTotales(data: CarteraMensual[]): CarteraMensual {
    return {
      localidad: data[0].localidad,
      anio: data[0].anio,
      mes: data[0].mes,
      fecha: new Date(), // Puedes asignar cualquier fecha aquí ya que estás consolidando
      total_con_descuento: data.reduce((sum, item) => sum + item.total_con_descuento, 0),
      total_sin_descuento: data.reduce((sum, item) => sum + item.total_sin_descuento, 0),
      total_facturado: data.reduce((sum, item) => sum + item.total_facturado, 0),
      total_por_facturar: data.reduce((sum, item) => sum + item.total_por_facturar, 0),
      tipo_de_servicio: data[0].tipo_de_servicio
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
