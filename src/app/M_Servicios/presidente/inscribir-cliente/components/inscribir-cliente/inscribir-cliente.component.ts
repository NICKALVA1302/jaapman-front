import { Component } from '@angular/core';
import { Usuaxlocalidad } from '../../models/inscribir-cliente';
import { ToastrService } from 'ngx-toastr';
import { InscribirClienteService } from '../../services/inscribir-cliente.service';

declare var bootstrap: any;

@Component({
  selector: 'app-inscribir-cliente',
  templateUrl: './inscribir-cliente.component.html',
  styleUrl: './inscribir-cliente.component.css'
})
export class InscribirClienteComponent {
  Usuaxlocalidad: Usuaxlocalidad[] = [];
  localidades: any[] = [];
  buscarUsuario: string = '';
  filtroSeleccionado: string = 'todos';

  selectedUser: any = null;
  userAction: string = '';
  checkboxEvent: any = null;
  temporaryCheckboxState: boolean = false;

  constructor(
    private inscribirService: InscribirClienteService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.obtenerLocalidades();
  }

  // Obtener la lista de localidades disponibles
  obtenerLocalidades(): void {
    this.inscribirService.obtenerLocalidades()
      .subscribe(localidades => {
        this.localidades = localidades;
        console.log('Localidades obtenidas:', this.localidades);
      });
  }

  // Obtener los datos de los usuarios por localidad
  obtenerDatosPorLocalidad(idLocalidad: number): void {
    this.inscribirService.getDatosPorLocalidad(idLocalidad)
      .subscribe(data => {
        this.Usuaxlocalidad = data.map(item => ({
          ...item,
          id_estado_al: item.alcantarillado.length > 0 ? item.alcantarillado[0].id_estado_al : 2,
          isChecked: item.alcantarillado.length > 0 ? item.alcantarillado[0].id_estado_al === 1 : false
        }));
        console.log('Datos por localidad obtenidos:', this.Usuaxlocalidad);
      });
  }

  // Seleccionar una localidad
  onLocalidadSelected(event: any): void {
    const idLocalidad = Number(event.target.value);
    this.obtenerDatosPorLocalidad(idLocalidad);
  }

  onCheckboxClick(item: Usuaxlocalidad, event: any): void {
    // Prevent immediate checkbox state change
    event.preventDefault(); // Prevent default checkbox behavior
    event.stopImmediatePropagation(); // Stop immediate propagation

    this.selectedUser = item;
    this.userAction = event.target.checked ? 'inscribir' : 'eliminar';
    this.temporaryCheckboxState = event.target.checked;

    // Show the modal
    const modalElement = document.getElementById('modalInscribirUsuario');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }


  confirmAction(): void {
    if (!this.selectedUser) return;
  
    const isToInscribe = this.temporaryCheckboxState;
  
    this.inscribirService.inscribirCliente(this.selectedUser.id_usuario).subscribe(
      () => {
        if (isToInscribe) {
          this.toastr.success(`El usuario ${this.selectedUser.persona.nombre} ${this.selectedUser.persona.apellido} se ha inscrito correctamente.`, 'Éxito');
          this.updateUserStatus(this.selectedUser.id_usuario, false); // Actualiza el estado local
        } else {
          this.toastr.warning(`La inscripción del usuario ${this.selectedUser.persona.nombre} ${this.selectedUser.persona.apellido} ha sido eliminada correctamente.`, 'Eliminado');
          this.updateUserStatus(this.selectedUser.id_usuario, true); // Actualiza el estado local
        }
      },
      error => {
        this.toastr.error('Hubo un error al procesar la solicitud.', 'Error');
        console.error(error);
      }
    );
  }
  
  updateUserStatus(idUsuario: number, isNotInscribed: boolean): void {
    const user = this.Usuaxlocalidad.find(u => u.id_usuario === idUsuario);
    if (user) {
      // Actualiza el estado del usuario en la lista local
      user.id_estado_al = isNotInscribed ? 2 : 1;
      user.isChecked = !isNotInscribed; // Actualiza el estado del checkbox
    }
  }

  filtrarUsuarios(): Usuaxlocalidad[] {
    return this.Usuaxlocalidad.filter(user => {
      const matchesSearch = this.buscarUsuario ?
        user.persona.nombre.toLowerCase().includes(this.buscarUsuario.toLowerCase()) ||
        user.persona.apellido.toLowerCase().includes(this.buscarUsuario.toLowerCase()) ||
        user.persona.cedula.includes(this.buscarUsuario) : true;

      const matchesFilter = this.filtroSeleccionado === 'todos' ||
        (this.filtroSeleccionado === 'inscritos' && user.id_estado_al === 1) ||
        (this.filtroSeleccionado === 'noInscritos' && user.id_estado_al === 2);

      return matchesSearch && matchesFilter;
    });
  }
}