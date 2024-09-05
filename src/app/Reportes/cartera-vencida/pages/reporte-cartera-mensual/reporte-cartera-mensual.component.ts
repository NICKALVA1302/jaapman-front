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
  selectedAnio: string | null = null;
  selectedTipoServicio: string | null = null;

  @ViewChild('pdfContainer') pdfContainer: ElementRef | undefined;
  @ViewChild(GraficoComponent) graficoComponent!: GraficoComponent; 

  constructor(private carteraVencidaService: CarteraVencidaService, private pdfService: PdfService) { }

  handleGenerate(event: { localidadId: number | null, tipoServicio: string | null, mes: string | null, anio: string | null }): void {
    const { localidadId, tipoServicio, mes, anio } = event;

    // Si se selecciona "Todos los servicios", establecer tipoServicio como null
    const tipoServicioFinal = tipoServicio === 'Todos' ? null : tipoServicio;

    this.selectedMes = mes as MonthKey;
    this.selectedAnio = anio;
    this.selectedTipoServicio = tipoServicioFinal;

    // Validar que mes y anio estén presentes. Omitimos tipoServicio si es 'Todos' (null)
    if (!this.selectedMes || !this.selectedAnio || (tipoServicio !== 'Todos' && !this.selectedTipoServicio)) {
      console.error('Faltan datos: mes, anio o tipoServicio es null');
      alert('Por favor, complete todos los campos para generar el reporte.');
      return;
    }

    const monthMapping: Record<MonthKey, string> = {
      Enero: "01", Febrero: "02", Marzo: "03", Abril: "04", Mayo: "05", Junio: "06",
      Julio: "07", Agosto: "08", Septiembre: "09", Octubre: "10", Noviembre: "11", Diciembre: "12"
    };

    const monthNumber = monthMapping[this.selectedMes];
    if (!monthNumber) {
      console.error('Mes no válido:', this.selectedMes);
      return;
    }

    const fechaInicio = `${this.selectedAnio}-${monthNumber}-01`;
    const lastDay = new Date(parseInt(this.selectedAnio), parseInt(monthNumber), 0).getDate();
    const fechaFin = `${this.selectedAnio}-${monthNumber}-${lastDay}`;

    console.log('Fecha Inicio:', fechaInicio);
    console.log('Fecha Fin:', fechaFin);

    this.isLoading = true;

    if (this.selectedTipoServicio && localidadId) {
      this.generarCaso1(this.selectedTipoServicio, fechaInicio, fechaFin, localidadId);
    } else if (this.selectedTipoServicio && !localidadId) {
      this.generarCaso2(this.selectedTipoServicio, fechaInicio, fechaFin); 
    } else if (!this.selectedTipoServicio && localidadId) {
      // Caso 3: Una localidad, todos los servicios
      this.generarCaso3(fechaInicio, fechaFin, localidadId);
    } else {
      // Caso 4: Todas las localidades, todos los servicios
      this.generarCaso4(fechaInicio, fechaFin);
    }
}

  private generarCaso1(tipoServicio: string, fechaInicio: string, fechaFin: string, localidadId: number): void {
    this.carteraVencidaService.obtenerCarteraMensual(tipoServicio, fechaInicio, fechaFin, localidadId.toString()).subscribe(
      data => {
        this.generalData = data;
        this.labels = data.map(item => `Día ${new Date(item.fecha).getUTCDate()}`);
        this.chartData = data.map(item => item.total_facturado);
        this.isLoading = false;
        this.graficoComponent.generarGrafico();  // Genera el gráfico con los nuevos datos
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
        this.labels = data.map(item => item.localidad);  // Localidades como etiquetas
        this.chartData = data.map(item => item.total_facturado);  // Total facturado por localidad
        this.isLoading = false;
        this.graficoComponent.generarGrafico2();  // Genera el gráfico con los nuevos datos
        this.generarPdfCaso2();
      },
      error => {
        this.isLoading = false;
        this.errorMessage = `Error al obtener datos: ${error.message}`;
      }
    );
  }
  
  private generarCaso3(fechaInicio: string, fechaFin: string, localidadId: number): void {
    this.carteraVencidaService.obtenerCarteraMensual('', fechaInicio, fechaFin, localidadId.toString()).subscribe(
      data => {
        this.generalData = data;
        this.labels = data.map(item => item.tipo_de_servicio);
        this.chartData = data.map(item => item.total_facturado);
        this.isLoading = false;
        this.graficoComponent.generarGrafico();  // Genera el gráfico con los nuevos datos
        this.generarPdfCaso3();
      },
      error => {
        this.isLoading = false;
        this.errorMessage = `Error al obtener datos: ${error.message}`;
      }
    );
  }

  private generarCaso4(fechaInicio: string, fechaFin: string): void {
    this.carteraVencidaService.obtenerCarteraMensual('', fechaInicio, fechaFin, '').subscribe(
      data => {
        this.generalData = data;
        this.labels = data.map(item => item.tipo_de_servicio);
        this.chartData = data.map(item => item.total_facturado);
        this.isLoading = false;
        this.graficoComponent.generarGrafico();  // Genera el gráfico con los nuevos datos
        this.generarPdfCaso4();
      },
      error => {
        this.isLoading = false;
        this.errorMessage = `Error al obtener datos: ${error.message}`;
      }
    );
  }

  generarPdfCaso1(): void {
    const fechaGeneracion = new Date();
    const localidad = this.generalData.length > 0 ? this.generalData[0].localidad : 'No especificada';
    const tipoServicio = this.selectedTipoServicio || 'No especificado';
    const anio = this.selectedAnio || 'No especificado';

    if (this.generalData.length === 0) {
      this.pdfService.generarPdfSinDatos(localidad, tipoServicio, anio, fechaGeneracion, this.pdfContainer!);
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
        this.pdfService.mostrarPdf(pdfUrl, this.pdfContainer!);
      }).catch(error => {
        console.error('Error al generar el PDF:', error);
      });
    }).catch(error => {
      console.error('Error al generar la imagen del gráfico:', error);
    });
  }

  private generarPdfCaso2(): void {
    const fechaGeneracion = new Date();
    const localidad = 'Todas las localidades';
    const tipoServicio = this.selectedTipoServicio || 'No especificado';
    const anio = this.selectedAnio || 'No especificado';

    if (this.generalData.length === 0) {
      this.pdfService.generarPdfSinDatos(localidad, tipoServicio, anio, fechaGeneracion, this.pdfContainer!);
      return;
    }

    this.graficoComponent.generarDataURL().then(dataURL => {
      const pdfContent = [
        this.pdfService.createPdfHeader('Reporte Mensual de Cartera'),
        {
          columns: [
            { text: `Localidad: Todas las localidades`, style: 'infoText' },
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
        this.pdfService.mostrarPdf(pdfUrl, this.pdfContainer!);
      }).catch(error => {
        console.error('Error al generar el PDF:', error);
      });
    }).catch(error => {
      console.error('Error al generar la imagen del gráfico:', error);
    });
  }

  generarPdfCaso3(): void {
    const fechaGeneracion = new Date();
    const localidad = this.generalData.length > 0 ? this.generalData[0].localidad : 'No especificada';
    const tipoServicio = 'Todos los servicios';
    const anio = this.selectedAnio || 'No especificado';

    if (this.generalData.length === 0) {
      this.pdfService.generarPdfSinDatos(localidad, tipoServicio, anio, fechaGeneracion, this.pdfContainer!);
      return;
    }

    this.graficoComponent.generarDataURL().then(dataURL => {
      const pdfContent = [
        this.pdfService.createPdfHeader('Reporte Mensual de Cartera'),
        {
          columns: [
            { text: `Localidad: ${localidad}`, style: 'infoText' },
            { text: `Tipo de Servicio: Todos los servicios`, style: 'infoText', alignment: 'right' }
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
        this.pdfService.mostrarPdf(pdfUrl, this.pdfContainer!);
      }).catch(error => {
        console.error('Error al generar el PDF:', error);
      });
    }).catch(error => {
      console.error('Error al generar la imagen del gráfico:', error);
    });
  }

  generarPdfCaso4(): void {
    const fechaGeneracion = new Date();
    const localidad = 'Todas las localidades';
    const tipoServicio = 'Todos los servicios';
    const anio = this.selectedAnio || 'No especificado';

    if (this.generalData.length === 0) {
      this.pdfService.generarPdfSinDatos(localidad, tipoServicio, anio, fechaGeneracion, this.pdfContainer!);
      return;
    }

    this.graficoComponent.generarDataURL().then(dataURL => {
      const pdfContent = [
        this.pdfService.createPdfHeader('Reporte Mensual de Cartera'),
        {
          columns: [
            { text: `Localidad: Todas las localidades`, style: 'infoText' },
            { text: `Tipo de Servicio: Todos los servicios`, style: 'infoText', alignment: 'right' }
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
        this.pdfService.mostrarPdf(pdfUrl, this.pdfContainer!);
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
      fecha: new Date(),
      total_con_descuento: data.reduce((sum, item) => sum + item.total_con_descuento, 0),
      total_sin_descuento: data.reduce((sum, item) => sum + item.total_sin_descuento, 0),
      total_facturado: data.reduce((sum, item) => sum + item.total_facturado, 0),
      total_por_facturar: data.reduce((sum, item) => sum + item.total_por_facturar, 0),
      tipo_de_servicio: data[0].tipo_de_servicio
    };
  }


}
