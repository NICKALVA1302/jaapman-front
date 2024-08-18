import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Localidad } from '../../../../interfaces/localidad';

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

  ngOnInit(): void {
    // Cualquier lógica de inicialización adicional
  }

  onGenerar(): void {
    this.generar.emit({ localidadId: this.selectedLocalidadId, tipoServicio: this.selectedTipoServicio, anio: this.selectedAnio });
  }

  onGenerarGeneral(): void {
    this.generarGeneral.emit({ tipoServicio: this.selectedTipoServicio, anio: this.selectedAnio });
  }
}
