import { Component, ElementRef, ViewChild } from '@angular/core';
import { PdfService } from '../../services/pdf.service';
import { RecaudacionService, RecaudacionAguaDia, RecaudacionAguaMensual, RecaudacionAguaAnual } from '../../services/recaudacion.service';
import { GraficoComponent } from '../../components/grafico/grafico.component';

@Component({
  selector: 'app-reporte-recaudacion-agua',
  templateUrl: './reporte-recaudacion-agua.component.html',
  styleUrls: ['./reporte-recaudacion-agua.component.css']
})
export class ReporteRecaudacionAguaComponent {
  @ViewChild('pdfContainer') pdfContainer: ElementRef | undefined;
  @ViewChild(GraficoComponent) graficoComponent!: GraficoComponent;
  chartData: number[] = [];
  labels: string[] = [];

  constructor(private pdfService: PdfService, private recaudacionService: RecaudacionService) {}

  private obtenerNombreMes(mes: string): string {
    const mesNumero = parseInt(mes.split('-')[1], 10); // Suponiendo que `mes` tiene el formato 'YYYY-MM'
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return meses[mesNumero - 1];
  }

  onGenerar(event: { tipo: string, fecha: any, localidadId: number }): void {
    const { tipo, fecha, localidadId } = event;
    const date = this.convertToDate(fecha);
    const formattedDate = this.formatDate(date, tipo);
  
    switch (tipo) {
      case 'diario':
        this.recaudacionService.obtenerReporteAguaporDia(formattedDate, localidadId).subscribe(
          (data: RecaudacionAguaDia[]) => this.pdfService.generarPdf('diario', data, this.pdfContainer),
          error => console.error('Error al obtener la recaudación de agua por día:', error)
        );
        break;
      case 'mensual':
        this.recaudacionService.obtenerReporteAguaporMes(formattedDate, localidadId).subscribe(
          (data: RecaudacionAguaMensual[]) => this.pdfService.generarPdf('mensual', data, this.pdfContainer),
          error => console.error('Error al obtener la recaudación de agua por mes:', error)
        );
        break;
      case 'anual':
        this.recaudacionService.obtenerReporteAguaporAnio(formattedDate, localidadId).subscribe(
          (data: RecaudacionAguaAnual[]) => {
            const allMonths = [
              '01', '02', '03', '04', '05', '06',
              '07', '08', '09', '10', '11', '12'
            ];
  
            const labels = allMonths.map(month => this.obtenerNombreMes(`2024-${month}`));
            const dataMap: { [key: string]: number } = {};
  
            data.forEach(item => {
              dataMap[item.mes.split('-')[1]] = +item.recaudacion_total;
            });
  
            const chartData = allMonths.map(month => dataMap[month] || 0);
  
            this.labels = labels;
            this.chartData = chartData;
  
            this.generarPdfConGrafico(data);
          },
          error => console.error('Error al obtener la recaudación de agua por año:', error)
        );
        break;
      default:
        console.error('Tipo de reporte no válido');
    }
  }
  
  private convertToDate(ngbDate: { year: number; month: number; day: number }): Date {
    return new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
  }

  private formatDate(date: Date, tipo: string): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    switch (tipo) {
      case 'diario':
        return `${year}-${month}-${day}`;
      case 'mensual':
        return `${year}-${month}`;
      case 'anual':
        return `${year}`;
      default:
        return date.toISOString();
    }
  }

  private generarPdfConGrafico(data: RecaudacionAguaAnual[]): void {
    this.graficoComponent.generarDataURL().then((chartImage) => {
      console.log('Generando PDF con el gráfico'); // Confirmación en consola
      this.pdfService.generarPdfConGrafico('anual', data, chartImage, this.pdfContainer);
    }).catch(error => {
      console.error('Error al generar la imagen del gráfico:', error);
      this.pdfService.generarPdf('anual', data, this.pdfContainer); // Genera el PDF sin el gráfico si ocurre un error
    });
  }
  
}
