import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatosPorLocalidad, Localidad } from '../../models/localidades';
import { MantenimientoService } from '../../services/mantenimiento.service';


interface FiltroBusqueda {
  cedula: string;
  nombre: string;
  apellido: string;
  mostrarListaFiltrada: boolean;
  personasFiltradas: DatosPorLocalidad[];
}

@Component({
  selector: 'app-view-usuario',
  templateUrl: './view-usuario.component.html',
  styleUrls: ['./view-usuario.component.css']
})
export class ViewUsuarioComponent {
  @Output() usuarioSeleccionado = new EventEmitter<DatosPorLocalidad>(); // EventEmitter para emitir el usuario seleccionado

  localidades: Localidad[] = [];
  datosPorLocalidad: DatosPorLocalidad[] = [];
  selectedLocalidadId: string | null = null; // Cambiar el tipo de selectedLocalidadId a string | null
  filtroBusqueda: FiltroBusqueda = {
    cedula: '',
    nombre: '',
    apellido: '',
    mostrarListaFiltrada: false,
    personasFiltradas: []
  };

  constructor(public activeModal: NgbActiveModal, public servicioMantenimiento: MantenimientoService) { }

  ngOnInit() {
    this.obtenerLocalidades();
  }

  //Obtener localidades
  obtenerLocalidades(): void {
    this.servicioMantenimiento.obtenerLocalidades().subscribe(
      (localidades: Localidad[]) => {
        this.localidades = localidades;
        if (localidades.length > 0) {
          this.selectedLocalidadId = localidades[0].id_localidad.toString(); // Convertir a string
          this.onLocalidadSelected(); // Llamar a la función sin pasar ningún argumento
        }
      },
      (error: any) => {
        console.error('Error al obtener localidades:', error);
      }
    );
  }

  //Obtener usuarios segun la localidad seleccionada
  onLocalidadSelected(event?: any): void {
    const idLocalidad = event ? event.target.value : this.selectedLocalidadId; // Usar la propiedad selectedLocalidadId si no se proporciona ningún evento

    if (!idLocalidad) {
      return;
    }

    this.servicioMantenimiento.getDatosPorLocalidad(Number(idLocalidad)).subscribe(
      (response: any) => {
        if (response && response.LocalidadesxUsuario) {
          this.datosPorLocalidad = response.LocalidadesxUsuario;
          this.resetearFiltroBusqueda();
          console.log(this.datosPorLocalidad)
        }
      },
      (error: any) => {
        console.error('Error al obtener datos por localidad:', error);
      }
    );
  }

  //Limpiar campos de busquedas

  resetearFiltroBusqueda(): void {
    this.filtroBusqueda = {
      cedula: '',
      nombre: '',
      apellido: '',
      mostrarListaFiltrada: false,
      personasFiltradas: []
    };
  }

  //Búsqueda del usuario por cedula
  buscarPorCedula(event: any) {
    this.filtroBusqueda.cedula = event.target.value;
    this.aplicarFiltro();
  }

  //Búsqueda del usuario por nombre
  buscarPorNombre(event: any) {
    this.filtroBusqueda.nombre = event.target.value;
    this.aplicarFiltro();
  }

  //Búsqueda del usuario por apellido
  buscarPorApellido(event: any) {
    this.filtroBusqueda.apellido = event.target.value;
    this.aplicarFiltro();
  }

  //Uso de los filtros de búsqueda y listado de usuarios
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

  //Autocompletar
  seleccionarUsuario(usuario: DatosPorLocalidad) {
    // Emite el usuario seleccionado
    this.usuarioSeleccionado.emit(usuario);
    this.activeModal.close(); // Cierra el modal
  }
}
