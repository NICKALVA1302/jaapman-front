import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Localidad } from '../../../../interfaces/localidad';
import { CarteraVencidaService } from '../../services/cartera-vencida.service';

@Component({
  selector: 'app-form-seleccion',
  templateUrl: './form-seleccion.component.html'
})
export class FormSeleccionComponent implements OnInit {
  @Input() localidades: Localidad[] = [];
  @Input() years: number[] = [];
  @Output() generar = new EventEmitter<{ localidadId: number | null, tipoServicio: string | null, anio: string | null }>();
  @Output() generarGeneral = new EventEmitter<{ tipoServicio: string | null, anio: string | null }>();

  selectedLocalidadId: number | null = null;
  selectedTipoServicio: string | null = null;
  selectedAnio: string | null = null;
  startYear: number = new Date().getFullYear() - 5;
  
  constructor(private carteraService: CarteraVencidaService) {}

  ngOnInit(): void {
    this.obtenerLocalidades();
    this.generateYears();
  }
  
  generateYears(): void {
    const currentYear = new Date().getFullYear();
    const maxYear = this.startYear + 10;
    for (let year = this.startYear; year <= maxYear; year++) {
      this.years.push(year);
    }
  }

  obtenerLocalidades(): void {
    this.carteraService.obtenerLocalidades().subscribe(
      localidades => this.localidades = localidades,
      error => console.error('Error al cargar localidades:', error)
    );
  }

  onGenerar(): void {
    this.generar.emit({ localidadId: this.selectedLocalidadId, tipoServicio: this.selectedTipoServicio, anio: this.selectedAnio });
  }

  onGenerarGeneral(): void {
    this.generarGeneral.emit({ tipoServicio: this.selectedTipoServicio, anio: this.selectedAnio });
  }
}
