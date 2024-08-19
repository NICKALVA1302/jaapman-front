import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ValoresMesService } from '../../services/valores-mes.service';
import { Localidad } from '../../models/localidades';

type MonthKey = 'Enero' | 'Febrero' | 'Marzo' | 'Abril' | 'Mayo' | 'Junio' |
                 'Julio' | 'Agosto' | 'Septiembre' | 'Octubre' | 'Noviembre' | 'Diciembre';

@Component({
  selector: 'app-form-seleccion',
  templateUrl: './form-seleccion.component.html',
  styleUrls: ['./form-seleccion.component.css']
})
export class FormSeleccionComponent implements OnInit {
  localidades: Localidad[] = [];
  selectedLocalidadId: number | null = null;
  selectedTipoServicio: string | null = null;
  selectedAnio: number | null = null;
  selectedMes: MonthKey | null = null;
  years: number[] = [];
  startYear: number = new Date().getFullYear() - 5;

  @Output() valoresSeleccionados = new EventEmitter<{ tipoServicio: string, fechaInicio: string, fechaFin: string, localidadId: number }>();

  constructor(private valoresMesService: ValoresMesService) {}

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
    this.valoresMesService.obtenerLocalidades().subscribe(
      localidades => this.localidades = localidades,
      error => console.error('Error al cargar localidades:', error)
    );
  }

  onGenerarReporte(): void {
    if (this.selectedLocalidadId && this.selectedTipoServicio && this.selectedAnio && this.selectedMes) {
      const monthMapping: Record<MonthKey, string> = {
        Enero: "01", Febrero: "02", Marzo: "03", Abril: "04", Mayo: "05", Junio: "06",
        Julio: "07", Agosto: "08", Septiembre: "09", Octubre: "10", Noviembre: "11", Diciembre: "12"
      };
      const monthNumber = monthMapping[this.selectedMes as MonthKey];
      const fechaInicio = `${this.selectedAnio}-${monthNumber}-01`;
      const fechaFin = `${this.selectedAnio}-${monthNumber}-${new Date(this.selectedAnio, parseInt(monthNumber) - 1, 0).getDate()}`;

      this.valoresSeleccionados.emit({
        tipoServicio: this.selectedTipoServicio,
        fechaInicio,
        fechaFin,
        localidadId: this.selectedLocalidadId
      });
    } else {
      alert('Por favor, complete todos los campos para generar el reporte.');
    }
  }
}
