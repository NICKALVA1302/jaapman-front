import { Component } from '@angular/core';
import { SuspenderService } from '../../services/suspender.service';

import { ToastrService } from 'ngx-toastr';
import { Usuxlocalidad } from '../../models/suspender';

declare var bootstrap: any;

@Component({
  selector: 'app-suspender-usuario',
  templateUrl: './suspender-usuario.component.html',
  styleUrl: './suspender-usuario.component.css'
})
export class SuspenderUsuarioComponent {

  Usuxlocalidad: Usuxlocalidad[] = [];
  localidades: any[] = [];
  buscarUsuario: string = '';
  filtroSeleccionado: string = 'todos';

  selectedUser: any = null;
  userAction: string = '';
  checkboxEvent: any = null;
  temporaryCheckboxState: boolean = false;

  constructor(
    private suspenderService: SuspenderService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.obtenerLocalidades();
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
        this.Usuxlocalidad = data.map(item => ({ ...item, isChecked: item.id_estado === 2 }));
        console.log('Datos por localidad obtenidos:', this.Usuxlocalidad);
      });
  }

  // Seleccionar una localidad
  onLocalidadSelected(event: any): void {
    const idLocalidad = Number(event.target.value);
    this.obtenerDatosPorLocalidad(idLocalidad);
  }

  onCheckboxClick(item: any, event: any): void {
    event.preventDefault();
    this.selectedUser = item;
    this.temporaryCheckboxState = !item.isChecked; // Almacena el estado temporal
    this.userAction = this.temporaryCheckboxState ? 'suspender' : 'reactivar';

    const modalElement = document.getElementById('modalSuspenderUsuario');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  confirmAction(): void {
    const isChecked = this.userAction === 'suspender';

    this.suspenderService.suspenderUsuario(this.selectedUser.id_usuario)
      .subscribe(response => {
        console.log('Usuario suspendido/reactivado:', response);
        const usuario = this.selectedUser.persona;

        if (isChecked) {
          this.toastr.warning(`El usuario ${usuario.nombre} ${usuario.apellido} ha sido suspendido exitosamente.`, 'Éxito');
        } else {
          this.toastr.success(`El usuario ${usuario.nombre} ${usuario.apellido} ha sido reactivado exitosamente.`, 'Éxito');
        }

        this.updateUserStatus(this.selectedUser.id_usuario, isChecked);
      }, error => {
        console.error('Error al suspender/reactivar usuario:', error);
        this.toastr.error('Error al suspender/reactivar usuario.');
      });
  }

  updateUserStatus(idUsuario: number, isSuspended: boolean): void {
    const user = this.Usuxlocalidad.find(u => u.id_usuario === idUsuario);
    if (user) {
      user.isChecked = isSuspended;
    }
  }

  filtrarUsuarios(): Usuxlocalidad[] {
    return this.Usuxlocalidad.filter(user => {
      const matchesSearch = this.buscarUsuario ? 
        user.persona.nombre.toLowerCase().includes(this.buscarUsuario.toLowerCase()) ||
        user.persona.apellido.toLowerCase().includes(this.buscarUsuario.toLowerCase()) ||
        user.persona.cedula.includes(this.buscarUsuario) : true;

      const matchesFilter = this.filtroSeleccionado === 'todos' ||
        (this.filtroSeleccionado === 'suspendidos' && user.isChecked) ||
        (this.filtroSeleccionado === 'activos' && !user.isChecked);

      return matchesSearch && matchesFilter;
    });
  }
}



