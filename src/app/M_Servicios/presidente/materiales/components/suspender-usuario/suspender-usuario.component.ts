import { Component } from '@angular/core';
import { SuspenderService } from '../../services/suspender.service';

import { ToastrService } from 'ngx-toastr';
import { Usuxlocalidad } from '../../models/suspender';

@Component({
  selector: 'app-suspender-usuario',
  templateUrl: './suspender-usuario.component.html',
  styleUrl: './suspender-usuario.component.css'
})
export class SuspenderUsuarioComponent {

  Usuxlocalidad: Usuxlocalidad[] = [];
  localidades: any[] = [];
  selectedLocalidadId: number | null = null;
  filtroSeleccionado: string = 'todos';

  constructor(
    private suspenderService: SuspenderService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.obtenerLocalidades();
    this.obtenerDatosPorLocalidad(1);
  }

  // Obtener la lista de localidades disponibles
  obtenerLocalidades(): void {
    this.suspenderService.obtenerLocalidades()
      .subscribe(localidades => {
        this.localidades = localidades;
        console.log('Localidades obtenidas:', this.localidades);
      });
  }

  // Obtener los datos de los usuarios por localidad
  obtenerDatosPorLocalidad(idLocalidad: number): void {
    this.suspenderService.getDatosPorLocalidad(idLocalidad)
      .subscribe(data => {
        // Mapear los datos a su vez agregar la propiedad isChecked para determinar si el checkbox debe estar marcado
        this.Usuxlocalidad = data.map(item => ({ ...item, isChecked: item.id_estado === 2 }));

        // Aplicar el filtro
      if (this.filtroSeleccionado === 'suspendidos') {
        this.Usuxlocalidad = this.Usuxlocalidad.filter(item => item.id_estado === 2);
      } else if (this.filtroSeleccionado === 'activos') {
        this.Usuxlocalidad = this.Usuxlocalidad.filter(item => item.id_estado === 1);
      }

        console.log('Datos por localidad obtenidos:', this.Usuxlocalidad);
      });
  }


  // Seleccionar una localidad
  onLocalidadSelected(event: any): void {
    this.selectedLocalidadId = event.target.value;
    // Obtener los datos de los usuarios por la localidad seleccionada
    this.obtenerDatosPorLocalidad(Number(this.selectedLocalidadId));
  }


  // Método para suspender o reactivar un usuario
  suspenderUsuario(idUsuario: number, event: any): void {
    if (event.target && event.target.checked !== undefined) {
      const isChecked: boolean = event.target.checked;
      console.log('ID de usuario:', idUsuario);
      this.suspenderService.suspenderUsuario(idUsuario)
        .subscribe(response => {
          console.log('Usuario suspendido/reactivado:', response);
          // Obtener el usuario correspondiente
          const usuario = this.Usuxlocalidad.find(item => item.id_usuario === idUsuario)?.persona;
          if (isChecked) {
            this.toastr.warning(`El usuario ${usuario?.nombre} ${usuario?.apellido} ha sido suspendido exitosamente.`, 'Éxito');
          } else {
            this.toastr.success(`El usuario ${usuario?.nombre} ${usuario?.apellido} ha sido reactivado exitosamente.`, 'Éxito');
          }
        }, error => {
          console.error('Error al suspender/reactivar usuario:', error);
          this.toastr.error('Error al suspender/reactivar usuario.');
        });
    }
  }

  // Método para aplicar el filtro
  aplicarFiltro(): void {
    if (this.selectedLocalidadId !== null) {
      // Obtener los datos de los usuarios por la localidad seleccionada
      this.obtenerDatosPorLocalidad(this.selectedLocalidadId);
    } else {
      console.error('No se ha seleccionado ninguna localidad.');
    }
  }
}



