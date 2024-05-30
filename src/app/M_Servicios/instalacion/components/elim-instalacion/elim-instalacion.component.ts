import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InstalacionService } from '../../services/instalacion.service';
import { DatosPorLocalidad, Localidad } from '../../models/localidades';
import { Instalacion } from '../../models/instalacion';

interface FiltroBusqueda {
  cedula: string;
  nombre: string;
  apellido: string;
  mostrarListaFiltrada: boolean;
  personasFiltradas: DatosPorLocalidad[];
}

@Component({
  selector: 'app-elim-instalacion',
  templateUrl: './elim-instalacion.component.html',
  styleUrl: './elim-instalacion.component.css'
})
export class ElimInstalacionComponent {
  @Output() instalacionEditada = new EventEmitter<Instalacion>(); // EventEmitter para emitir la instalación editada

  localidades: Localidad[] = [];
  datosPorLocalidad: DatosPorLocalidad[] = [];
  instalaciones: Instalacion[] = [];
  selectedLocalidadId: string | null = null;
  filtroBusqueda: FiltroBusqueda = {
    cedula: '',
    nombre: '',
    apellido: '',
    mostrarListaFiltrada: false,
    personasFiltradas: []
  };
  selectedUserId: number | null = null;
  usuarioSeleccionado: DatosPorLocalidad | null = null;

  mostrarConfirmacion: boolean = false;
  mostrarExito: boolean = false;
  numeroInstalacionSeleccionada: number | null = null; // Variable para almacenar el número de instalación seleccionada
  
  
  constructor(public activeModal: NgbActiveModal, public servicioInstalacion: InstalacionService) { }

  ngOnInit() {
    this.obtenerLocalidades();
  }

  eliminarInstalacion(numeroInstalacion: number) {
    // Primero, mostrar la alerta de confirmación
    this.mostrarConfirmacion = true;
    this.numeroInstalacionSeleccionada = numeroInstalacion; // Guardar el número de instalación seleccionada
  }

  confirmarModificacion() {
    // Aquí puedes realizar la lógica para eliminar la instalación
    if (this.numeroInstalacionSeleccionada !== null) {
      this.servicioInstalacion.eliminarInstalacion(this.numeroInstalacionSeleccionada).subscribe(
        () => {
          console.log('Instalación eliminada correctamente');
          // Aquí puedes realizar cualquier otra acción después de eliminar la instalación
          // Después de eliminar los datos, mostrar la alerta de éxito
          this.mostrarExito = true;
          this.mostrarConfirmacion = false;
        },
        (error: any) => {
          console.error('Error al eliminar la instalación:', error);
        }
      );
    }
  }
  
  cancelarModificacion() {
    this.mostrarConfirmacion = false;
  }

  obtenerInstalacionesPorUsuario() {
    if (this.selectedUserId !== null) {
      this.servicioInstalacion.getInstalacionesPorUsuario(this.selectedUserId).subscribe(
        (instalaciones: Instalacion[]) => {
          console.log('Instalaciones recibidas:', instalaciones); // Agregar este console.log
          this.instalaciones = instalaciones;
        },
        (error: any) => {
          console.error('Error al obtener instalaciones:', error);
        }
      );
    }
  }
  
  seleccionarUsuario(usuario: DatosPorLocalidad) {
    console.log('ID de usuario seleccionado:', usuario.usuarios[0]?.id_usuario);
    this.selectedUserId = usuario.usuarios[0]?.id_usuario; // Obtener el id_usuario del primer usuario en el array usuarios
    this.usuarioSeleccionado = usuario; // Guardar toda la información del usuario seleccionado
    this.obtenerInstalacionesPorUsuario();
  }

  getEstadoPagoLegible(idEstadoPago: number): string {
    return this.servicioInstalacion.getEstadoPagoLegible(idEstadoPago);
  }

  obtenerLocalidades(): void {
    this.servicioInstalacion.obtenerLocalidades().subscribe(
      (localidades: Localidad[]) => {
        this.localidades = localidades;
        if (localidades.length > 0) {
          this.selectedLocalidadId = localidades[0].id_localidad.toString();
          this.onLocalidadSelected();
        }
      },
      (error: any) => {
        console.error('Error al obtener localidades:', error);
      }
    );
  }

  onLocalidadSelected(event?: any): void {
    const idLocalidad = event ? event.target.value : this.selectedLocalidadId;

    if (!idLocalidad) {
      return;
    }

    this.servicioInstalacion.getDatosPorLocalidad(Number(idLocalidad)).subscribe(
      (response: any) => {
        if (response && response.LocalidadesxUsuario) {
          this.datosPorLocalidad = response.LocalidadesxUsuario;
          this.resetearFiltroBusqueda();
        }
      },
      (error: any) => {
        console.error('Error al obtener datos por localidad:', error);
      }
    );
  }

  resetearFiltroBusqueda(): void {
    this.filtroBusqueda = {
      cedula: '',
      nombre: '',
      apellido: '',
      mostrarListaFiltrada: false,
      personasFiltradas: []
    };
    this.instalaciones = [];
    this.mostrarExito = false; // Ocultar el mensaje de éxito
  }

  buscarPorCedula(event: any) {
    this.resetearFiltroBusqueda();
    this.filtroBusqueda.cedula = event.target.value;
    this.aplicarFiltro();
  }

  buscarPorNombre(event: any) {
    this.resetearFiltroBusqueda();
    this.filtroBusqueda.nombre = event.target.value;
    this.aplicarFiltro();
  }

  buscarPorApellido(event: any) {
    this.resetearFiltroBusqueda();
    this.filtroBusqueda.apellido = event.target.value;
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
    const { cedula, nombre, apellido } = this.filtroBusqueda;
    let listaFiltrada = this.datosPorLocalidad;

    if (cedula) {
      listaFiltrada = listaFiltrada.filter(item => item.cedula.toLowerCase().includes(cedula.toLowerCase()));
    }
    if (nombre) {
      listaFiltrada = listaFiltrada.filter(item => item.nombre.toLowerCase().includes(nombre.toLowerCase()));
    }
    if (apellido) {
      listaFiltrada = listaFiltrada.filter(item => item.apellido.toLowerCase().includes(apellido.toLowerCase()));
    }

    this.filtroBusqueda.personasFiltradas = listaFiltrada;
    this.filtroBusqueda.mostrarListaFiltrada = true;
  }

}

