import { Component } from '@angular/core';
import { TarifaService } from '../../services/tarifa.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tarifa',
  templateUrl: './tarifa.component.html',
  styleUrl: './tarifa.component.css'
})
export class TarifaComponent {

  editar = false; // Variable para controlar si esta editando o no

  //valores iniciales 
  valor1: number = 0;
  valor2: number = 0;
  valor3: number = 0;

  constructor(private tarifaService: TarifaService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.obtenerValores();
  }

  // Metodo para obtener los valores

  obtenerValores() {
    this.tarifaService.listTarifa().subscribe(
      (data) => {
        if (data && data.length >= 3) {
          this.valor1 = data[0].valor;
          this.valor2 = data[1].valor;
          this.valor3 = data[2].valor;
        }
        console.log(data);
      },
      (error) => {
        console.error('Error al obtener valores:', error);
      }
    );
  }

  guardarTarifas() {
    // Validar si los valores son negativos
    if (this.valor1 < 0 || this.valor2 < 0 || this.valor3 < 0) {
      this.toastr.warning('No se permiten valores negativos', 'Advertencia');
      return;  // Evitar la llamada a this.tarifaService.actualizarTarifa()
    }

    // Llamada para actualizar tarifas solo si no hay valores negativos
    this.tarifaService.actualizarTarifa(1, this.valor1, 2, this.valor2, 3, this.valor3).subscribe(
      (data) => {
        this.toastr.success('Tarifas Actualizadas', 'Exito');
        this.editar = false;
      },
      (error) => {
        console.error('Error al actualizar valores:', error);
        this.editar = false;
      }
    );
  }
}
