import { Component, EventEmitter, Output } from '@angular/core';
import { Localidad } from '../../models/localidades';
import { RecaudacionService } from '../../services/recaudacion.service';

@Component({
  selector: 'app-form-seleccion',
  templateUrl: './form-seleccion.component.html',
  styleUrls: ['./form-seleccion.component.css']
})
export class FormSeleccionComponent {
  localidades: Localidad[] = [];
  selectedLocalidadId: number | null = null;
  model: any;

  @Output() generar = new EventEmitter<{ tipo: string, fecha: any, localidadId: number }>();

  constructor(private recaudacionagua: RecaudacionService) {}

  ngOnInit(): void {
    this.obtenerLocalidades();
  }

  onGenerar(tipo: string): void {
    if (this.selectedLocalidadId && this.model) {
      this.generar.emit({ tipo, fecha: this.model, localidadId: this.selectedLocalidadId });
    } else {
      console.error('Debes seleccionar una localidad y una fecha');
    }
  }

  obtenerLocalidades(): void {
    this.recaudacionagua.obtenerLocalidades().subscribe(
      localidades => this.localidades = localidades,
      error => console.error('Error al cargar localidades:', error)
    );
  }

}
