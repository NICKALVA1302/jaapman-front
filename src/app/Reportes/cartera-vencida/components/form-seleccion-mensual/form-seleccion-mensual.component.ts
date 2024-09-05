import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CarteraVencidaService } from '../../services/cartera-vencida.service';
import { Localidad } from '../../models/localidades';

@Component({
  selector: 'app-form-seleccion-mensual',
  templateUrl: './form-seleccion-mensual.component.html',
  styleUrl: './form-seleccion-mensual.component.css'
})
export class FormSeleccionMensualComponent {
  @Input() localidades: Localidad[] = [];
  @Input() years: number[] = [];
  @Output() generar = new EventEmitter<{ localidadId: number |null, tipoServicio: string |null, mes: string |null, anio: string | null }>();
  
  selectedLocalidadId: number | null = null;
  selectedTipoServicio: string | null = null;
  selectedAnio: string | null = null;
  selectedMes: string | null = null;
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
    // En caso de que selectedLocalidadId sea null, lo pasamos como null en el emit
    const localidadId = this.selectedLocalidadId;
    this.generar.emit({ localidadId: this.selectedLocalidadId, tipoServicio: this.selectedTipoServicio, mes: this.selectedMes, anio: this.selectedAnio });
    this.resetForm();  // Llamar a resetForm después de generar el evento
  }

  // Método para resetear el formulario después de generar el reporte
  resetForm(): void {
    this.selectedLocalidadId = null;
    this.selectedTipoServicio = null;
    this.selectedMes = null;
    this.selectedAnio = null;
  }
}
