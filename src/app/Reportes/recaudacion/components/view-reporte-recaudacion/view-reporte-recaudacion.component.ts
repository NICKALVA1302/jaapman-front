import { Component, ElementRef, ViewChild } from '@angular/core';
import { Localidad } from '../../models/localidades';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { RecaudacionService } from '../../services/recaudacion.service';


pdfMake.vfs = pdfFonts.pdfMake.vfs;
type MonthKey = 'Enero' | 'Febrero' | 'Marzo' | 'Abril' | 'Mayo' | 'Junio' |
                 'Julio' | 'Agosto' | 'Septiembre' | 'Octubre' | 'Noviembre' | 'Diciembre';
                 
@Component({
  selector: 'app-view-reporte-recaudacion',
  templateUrl: './view-reporte-recaudacion.component.html',
  styleUrl: './view-reporte-recaudacion.component.css'
})
export class ViewReporteRecaudacionComponent {
  model: Date = new Date();
  localidades: Localidad[] = [];
  selectedLocalidadId: number | null = null;
  selectedTipoServicio: string | null = null;
  selectedAnio: number | null = null;
  selectedMes: MonthKey | null = null;
  years: number[] = [];
  startYear: number = new Date().getFullYear() - 5;  // Establece el año inicial

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
}
