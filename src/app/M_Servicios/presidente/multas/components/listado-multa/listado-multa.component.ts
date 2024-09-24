import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MultasService } from '../../services/multas.service';
import { Multa } from '../../models/multa';

@Component({
  selector: 'app-listado-multa',
  templateUrl: './listado-multa.component.html',
  styleUrl: './listado-multa.component.css'
})
export class ListadoMultaComponent {

  multas: Multa[] = [];
  multasFiltradas: Multa[] = [];
  multaToDelete: Multa | undefined;

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

  confirmarEliminacionMulta(multa: Multa): void {
    this.multaToDelete = multa;
  }

  confirmarEliminarMulta(): void {
    if (this.multaToDelete) {
      this.multasService.eliminarMulta(this.multaToDelete.id_multa).subscribe(
        () => {
          this.obtenerListadoMultas(); // Actualizar la lista de multas después de eliminar
          this.toastr.success('La Multa fue eliminada exitosamente', 'Multa Eliminada');
        },
        error => {
          console.error('Error al eliminar la multa:', error);
          this.toastr.error('Ocurrió un error al eliminar la multa', 'Error');
        }
      );
      this.multaToDelete = undefined; // Reiniciar la multa a eliminar después de la eliminación
    }
  }

  getUsuarioNombreCompleto(): string {
    if (this.multaToDelete && this.multaToDelete.usuario && this.multaToDelete.usuario.persona) {
      const { nombre, apellido } = this.multaToDelete.usuario.persona;
      return `${nombre} ${apellido}`;
    }
    return '';
  }

  // eliminarMulta(id_multa: number): void {
  //   this.multasService.eliminarMulta(id_multa).subscribe(
  //     () => {
  //       // Actualizar la lista de multas después de eliminar
  //       this.obtenerListadoMultas();
  //       this.toastr.error('La Multa fue Eliminado con exito', 'Multa Eliminada');
  //     },
  //   );
  // }

}
