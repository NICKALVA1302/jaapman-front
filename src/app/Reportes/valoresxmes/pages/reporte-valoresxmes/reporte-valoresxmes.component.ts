import { Component, ElementRef, ViewChild } from '@angular/core';
import { PdfService } from '../../services/pdf.service';
import { ValoresMesService } from '../../services/valores-mes.service';
import { ValoresMes } from '../../services/valores-mes.service';

@Component({
  selector: 'app-reporte-valoresxmes',
  templateUrl: './reporte-valoresxmes.component.html',
  styleUrls: ['./reporte-valoresxmes.component.css']
})
export class ReporteValoresxmesComponent {
  @ViewChild('pdfContainer') pdfContainer: ElementRef | undefined;

  isLoading = false;
  errorMessage: string | null = null;

  constructor(private pdfService: PdfService, private valoresMesService: ValoresMesService) {}

  onValoresSeleccionados(event: { tipoServicio: string, fechaInicio: string, fechaFin: string, localidadId: number }): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.valoresMesService.obtenerValoresxmes(event.tipoServicio, event.fechaInicio, event.fechaFin, event.localidadId).subscribe(
      (data: ValoresMes[]) => {
        this.pdfService.generarPdf(data, this.pdfContainer);
        this.isLoading = false;
      },
      error => {
        console.error('Error al obtener los datos:', error);
        this.errorMessage = 'Error al obtener los datos, por favor inténtelo de nuevo más tarde.';
        this.isLoading = false;
      }
    );
  }
}
