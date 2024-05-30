import { Component } from '@angular/core';
import { Multa } from '../../models/multa';
import { MultasService } from '../../services/multas.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listado-multa',
  templateUrl: './listado-multa.component.html',
  styleUrl: './listado-multa.component.css'
})
export class ListadoMultaComponent {

  multas: Multa[] = [];
  multasFiltradas: Multa[] = [];

  constructor(private multasService: MultasService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.obtenerListadoMultas();
  }

  obtenerListadoMultas(): void {
    this.multasService.obtenerListadoMultas().subscribe(
      (data: Multa[]) => {
        this.multas = data;
        this.multasFiltradas = data; 
        console.log(data);
      },
      error => {
        console.error('Error al obtener el listado de multas:', error);
      }
    );
  }

  filtrarPorLocalidad(event: any): void {
    const localidadSeleccionada = event?.target?.value;
    if (!localidadSeleccionada) {
      // Si no se seleccionó ninguna localidad, mostrar todas las multas
      this.multasFiltradas = this.multas;
    } else {
      // Filtrar las multas por la localidad seleccionada
      this.multasFiltradas = this.multas.filter(multa => multa.usuario.localidad.nombre === localidadSeleccionada);
    }
  }

  obtenerNombresLocalidades(): string[] {
    // Obtener un array con los nombres de todas las localidades
    return this.multas.map(multa => multa.usuario.localidad.nombre)
                     .filter((value, index, self) => self.indexOf(value) === index); // Eliminar duplicados
  }

  eliminarMulta(id_multa: number): void {
    this.multasService.eliminarMulta(id_multa).subscribe(
      () => {
        // Actualizar la lista de multas después de eliminar
        this.obtenerListadoMultas();
        this.toastr.error('La Multa fue Eliminado con exito', 'Multa Eliminada');
      },
    );
  }

}
