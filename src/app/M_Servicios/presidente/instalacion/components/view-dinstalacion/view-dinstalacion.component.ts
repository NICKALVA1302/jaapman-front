import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatosPorLocalidad } from '../../models/localidades';
import { ViewUsuariosComponent } from '../view-usuarios/view-usuarios.component';
import { EditInstalacionComponent } from '../edit-instalacion/edit-instalacion.component';
import { InstalacionService } from '../../services/instalacion.service';
import { ElimInstalacionComponent } from '../elim-instalacion/elim-instalacion.component';


@Component({
  selector: 'app-view-dinstalacion',
  templateUrl: './view-dinstalacion.component.html',
  styleUrls: ['./view-dinstalacion.component.css']
})
export class ViewDinstalacionComponent {
  usuarioSeleccionado: DatosPorLocalidad | null = null;
  proximoNumeroInstalacion: number = 0;
  mensaje: string = ''; // Propiedad para almacenar el mensaje
  error: string | null = null;
  personaError: string | null = null;
  mensajeDuracion = 5000; // Duración en milisegundos (en este caso, 5 segundos)
  estadoPago: boolean = false; // Inicializado como false por defecto

  constructor(private modalService: NgbModal, private instalacionService: InstalacionService) { }

  ngOnInit(): void {
    this.obtenerProximoNumeroInstalacion();
    this.estadoPago = false;
  }

  guardarInstalacion() {
    if (!this.usuarioSeleccionado) {
      this.personaError = 'Seleccione una persona';
      setTimeout(() => {
        this.personaError = null;
      }, this.mensajeDuracion);
      return;
    }

    if (this.usuarioSeleccionado) {
      const numero = (document.getElementById('number') as HTMLInputElement).value;
      const valor = (document.getElementById('installationFee') as HTMLInputElement).value;
      const observacion = (document.getElementById('observation') as HTMLTextAreaElement).value;

      const estadoPago = this.estadoPago ? 1 : 2; // Asigna 1 si está pagado, 2 si está pendiente

      const instalacionData = {
        id_usuario: this.usuarioSeleccionado.usuarios[0]?.id_usuario,
        id_estado_pago: estadoPago,
        valor: +valor,
        numero: +numero,
        observacion: observacion
      };

      this.instalacionService.agregarInstalacion(instalacionData).subscribe(
        response => {
          console.log('Instalación agregada correctamente:', response);
          this.limpiarCampos();
          this.obtenerProximoNumeroInstalacion();
          this.mensaje = 'D.Instalacion ingresado correctamente';
          setTimeout(() => {
            this.error = null;
          }, this.mensajeDuracion);

          // Limpia los datos del cliente en la parte de búsqueda después de guardar la instalación
          this.limpiarDatosClienteEnBusqueda();
        },
        error => {
          console.error('Error al agregar la instalación:', error);
          this.error = 'Error al agregar la instalación. Por favor, inténtelo de nuevo.';
          setTimeout(() => {
            this.error = null;
          }, this.mensajeDuracion);
        }
      );
    } else {
      console.error('No se ha seleccionado ninguna persona.');
    }
  }
  
  limpiarDatosClienteEnBusqueda() {
    document.getElementById('nombre')!.setAttribute('value', ''); // Limpiar el valor del campo nombre
    document.getElementById('apellido')!.setAttribute('value', ''); // Limpiar el valor del campo apellido
    document.getElementById('cedula')!.setAttribute('value', ''); // Limpiar el valor del campo cédula
    document.getElementById('codigo')!.setAttribute('value', ''); // Limpiar el valor del campo código
    document.getElementById('localidad')!.setAttribute('value', ''); // Limpiar el valor del campo localidad
    document.getElementById('direccion')!.setAttribute('value', ''); // Limpiar el valor del campo dirección
  }
  
  
  limpiarCampos() {
    // Limpiar los valores de los campos
    (document.getElementById('number') as HTMLInputElement).value = '';
    (document.getElementById('installationFee') as HTMLInputElement).value = '';
    (document.getElementById('observation') as HTMLTextAreaElement).value = '';
    // Después de limpiar los campos y obtener el próximo número de instalación

  }

  obtenerProximoNumeroInstalacion() {
    this.instalacionService.obtenerProximoNumeroInstalacion().subscribe(
      response => {
        this.proximoNumeroInstalacion = response.ultimoNumeroInstalacion + 1;
      },
      error => {
        console.error('Error al obtener el último número de instalación:', error);
      }
    );
  }

  abrirModal() {
    const modalRef = this.modalService.open(ViewUsuariosComponent);
    modalRef.componentInstance.usuarioSeleccionado.subscribe((usuario: DatosPorLocalidad) => {
      this.usuarioSeleccionado = usuario;
      this.autocompletarCampos();
    });
    this.mensaje = '';
  }

  autocompletarCampos() {
    if (this.usuarioSeleccionado) {
      const { nombre, apellido, cedula, direccion } = this.usuarioSeleccionado;
      document.getElementById('nombre')!.setAttribute('value', nombre || '');
      document.getElementById('apellido')!.setAttribute('value', apellido || '');
      document.getElementById('cedula')!.setAttribute('value', cedula || '');
      document.getElementById('codigo')!.setAttribute('value', this.usuarioSeleccionado.usuarios[0].medidor.codigo || '');
      document.getElementById('localidad')!.setAttribute('value', this.usuarioSeleccionado.usuarios[0].localidad.nombre || '');
      document.getElementById('direccion')!.setAttribute('value', direccion || '');
    }
  }

  abrirModalEdit() {
    const modalRef = this.modalService.open(EditInstalacionComponent);
    this.mensaje = '';
  }

  abrirModalElim() {
    const modalRef = this.modalService.open(ElimInstalacionComponent);
    this.mensaje = '';
  }

}
