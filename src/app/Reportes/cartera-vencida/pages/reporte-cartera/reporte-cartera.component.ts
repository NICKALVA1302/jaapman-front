import { Component, ViewChild, ElementRef } from '@angular/core';
import { CarteraVencidaService, CarteraAnual } from '../../services/cartera-vencida.service';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Localidad } from '../../models/localidades';
import { GraficoComponent } from '../../components/grafico/grafico.component';
import { PdfService } from '../../services/pdf.service';

const monthMapping: Record<number, string> = {
  1: 'Enero',2: 'Febrero',3: 'Marzo',4: 'Abril',5: 'Mayo',6: 'Junio',7: 'Julio',8: 'Agosto',9: 'Septiembre',10: 'Octubre',11: 'Noviembre',12: 'Diciembre'};

pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-reporte-cartera',
  templateUrl: './reporte-cartera.component.html'
})
export class ReporteCarteraComponent {
  localidades: Localidad[] = [];
  years: number[] = [];
  generalData: CarteraAnual[] = [];
  labels: string[] = [];
  chartData: number[] = [];
  isLoading = false;
  errorMessage = '';
  selectedAnio: string | null = null;
  selectedTipoServicio: string | null = null;

  @ViewChild('pdfContainer') pdfContainer: ElementRef | undefined;
  @ViewChild(GraficoComponent) graficoComponent!: GraficoComponent; 

  constructor(private carteraVencidaService: CarteraVencidaService, private pdfService: PdfService) { }

  handleGenerate(event: { localidadId: number | null, tipoServicio: string | null, anio: string | null }): void {
    const { localidadId, tipoServicio, anio } = event;

    // Si se selecciona "Todos los servicios", establecer tipoServicio como null
    const tipoServicioFinal = tipoServicio === 'Todos' ? null : tipoServicio;

    this.selectedAnio = anio;
    this.selectedTipoServicio = tipoServicioFinal;

    // Validar que mes y anio estén presentes. Omitimos tipoServicio si es 'Todos' (null)
    if (!this.selectedAnio || (tipoServicio !== 'Todos' && !this.selectedTipoServicio)) {
      console.error('Faltan datos: mes, anio o tipoServicio es null');
      alert('Por favor, complete todos los campos para generar el reporte.');
      return;
    }

    const fechaInicio = `${this.selectedAnio}-01-01`;
    const fechaFin = `${this.selectedAnio}-12-31`;

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
    this.carteraVencidaService.obtenerCarteraAnual(tipoServicio, fechaInicio, fechaFin, localidadId.toString()).subscribe(
      data => {
        this.generalData = data;
        this.labels = data.map(item => monthMapping[item.mes]); 
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
    this.carteraVencidaService.obtenerCarteraAnual(tipoServicio, fechaInicio, fechaFin, '').subscribe(
      data => {
        this.generalData = data;
        this.labels = data.map(item => monthMapping[item.mes]);
        this.chartData = data.map(item => item.total_facturado);  // Total facturado por localidad
        this.isLoading = false;
        this.graficoComponent.generarGrafico();  // Genera el gráfico con los nuevos datos
        this.generarPdfCaso2();
      },
      error => {
        this.isLoading = false;
        this.errorMessage = `Error al obtener datos: ${error.message}`;
      }
    );
  }
  
  private generarCaso3(fechaInicio: string, fechaFin: string, localidadId: number): void {
    this.carteraVencidaService.obtenerCarteraAnual('', fechaInicio, fechaFin, localidadId.toString()).subscribe(
      data => {
        this.generalData = data;
        this.labels = data.map(item => monthMapping[item.mes]);
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
    this.carteraVencidaService.obtenerCarteraAnual('', fechaInicio, fechaFin, '').subscribe(
      data => {
        this.generalData = data;
        this.labels = data.map(item => monthMapping[item.mes]);
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
      this.pdfService.generarPdfSinDatosAnual(localidad, tipoServicio, anio, fechaGeneracion, this.pdfContainer!);
      return;
    }

    this.graficoComponent.generarDataURL().then(dataURL => {
      const pdfContent = [
        this.pdfService.createPdfHeader('Reporte Anual de Cartera'),
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
        // Primera página: Tabla
        this.pdfService.createTableContentAnual(this.generalData),
        // Salto de página antes del gráfico
        { text: '', pageBreak: 'after' },
        // Segunda página: Gráfico
        this.pdfService.createPdfHeader('Reporte Anual de Cartera'),
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
          width: 750,
          alignment: 'center'
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
      this.pdfService.generarPdfSinDatosAnual(localidad, tipoServicio, anio, fechaGeneracion, this.pdfContainer!);
      return;
    }
    
    this.graficoComponent.generarDataURL().then(dataURL => {
      const pdfContent = [
        this.pdfService.createPdfHeader('Reporte Anual de Cartera'),
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
        // Primera página: Tabla
        this.pdfService.createTableContentAnual(this.generalData),
        // Salto de página antes del gráfico
        { text: '', pageBreak: 'after' },
        // Segunda página: Gráfico
        this.pdfService.createPdfHeader('Reporte Anual de Cartera'),
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
          width: 750,
          alignment: 'center'
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
      this.pdfService.generarPdfSinDatosAnual(localidad, tipoServicio, anio, fechaGeneracion, this.pdfContainer!);
      return;
    }

    this.graficoComponent.generarDataURL().then(dataURL => {
      const pdfContent = [
        this.pdfService.createPdfHeader('Reporte Anual de Cartera'),
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
        // Primera página: Tabla
        this.pdfService.createTableContentAnual(this.generalData),
        // Salto de página antes del gráfico
        { text: '', pageBreak: 'after' },
        // Segunda página: Gráfico
        this.pdfService.createPdfHeader('Reporte Anual de Cartera'),
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
          width: 750,
          alignment: 'center'
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
      this.pdfService.generarPdfSinDatosAnual(localidad, tipoServicio, anio, fechaGeneracion, this.pdfContainer!);
      return;
    }

    this.graficoComponent.generarDataURL().then(dataURL => {
      const pdfContent = [
        this.pdfService.createPdfHeader('Reporte Anual de Cartera'),
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
        // Primera página: Tabla
        this.pdfService.createTableContentAnual(this.generalData),
        // Salto de página antes del gráfico
        { text: '', pageBreak: 'after' },
        // Segunda página: Gráfico
        this.pdfService.createPdfHeader('Reporte Anual de Cartera'),
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
          width: 750,
          alignment: 'center'
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
        this.pdfService.mostrarPdf(pdfUrl, this.pdfContainer!);
      }).catch(error => {
        console.error('Error al generar el PDF:', error);
      });
    }).catch(error => {
      console.error('Error al generar la imagen del gráfico:', error);
    });
  }
}
