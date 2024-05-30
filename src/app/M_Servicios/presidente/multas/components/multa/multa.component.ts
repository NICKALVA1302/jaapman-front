import { Component } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { Router } from '@angular/router';

import { ViewUsuarioComponent } from '../../../materiales/components/view-usuario/view-usuario.component';
import { MultasService } from '../../services/multas.service';
import { DatosPorLocalidad } from '../../models/localidades';

@Component({
  selector: 'app-multa',
  templateUrl: './multa.component.html',
  styleUrl: './multa.component.css'
})
export class MultaComponent {

  usuarioSeleccionado: DatosPorLocalidad | null = null;
  valor_multa: number | null = 0; // Cambiar el tipo a number | null
  observacion: string | null = null;
  id_multa: number = 0;

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private multasService: MultasService,
    private router: Router) { }

  ngOnInit(): void {
    this.obtenerProximoNumeroMultaDisponible();
  }

  //SECCION DE MODAL DE BUSCAR USUARIO POR LOCALIDAD
  abrirModal() {
    const modalRef = this.modalService.open(ViewUsuarioComponent);
    modalRef.componentInstance.usuarioSeleccionado.subscribe((usuario: DatosPorLocalidad) => {
      this.usuarioSeleccionado = usuario; // Recibe el usuario seleccionado del modal
      this.autocompletarCampos();
    });
  }

  obtenerProximoNumeroMultaDisponible() {
    this.multasService.obtenerListadoMultas().subscribe((multas: any[]) => {
        console.log('Listado de multas:', multas);

        // Verificar si hay elementos en el listado de multas
        if (multas.length > 0) {
    
            const idMultas = multas.map(multa => multa.id_multa);

            // Encontrar el máximo valor de id_multa
            const maxIdMulta = Math.max(...idMultas);

            // Calcular el próximo número de multa disponible sumándole 1 al máximo número de multa actual
            this.id_multa = maxIdMulta + 1;
        } else {
            // Si el listado de multas está vacío, el próximo número de multa disponible es 1
            this.id_multa = 1;
        }

        console.log('Próximo número de multa disponible:', this.id_multa);
    });
}


  autocompletarCampos() {
    if (this.usuarioSeleccionado) {
      // Autocompletar los campos en el componente ViewCobroComponent con los datos del usuario seleccionado
      const { nombre, apellido, cedula, direccion, id_persona } = this.usuarioSeleccionado;
      // Asignar los valores a los campos del formulario
      document.getElementById('nombre')!.setAttribute('value', this.usuarioSeleccionado.nombre);
      document.getElementById('apellido')!.setAttribute('value', this.usuarioSeleccionado.apellido);
      document.getElementById('localidad')!.setAttribute('value', this.usuarioSeleccionado.usuarios[0].localidad.nombre); // Aquí se muestra el nombre de la localidad
      // Asignar otros valores a otros campos si es necesario
      this.toastr.success('Cliente seleccionado', 'Éxito');
    }
  }

  limpiarCampos() {
    // Limpiar campos de usuario
    document.getElementById('nombre')!.setAttribute('value', '');
    document.getElementById('apellido')!.setAttribute('value', '');
    document.getElementById('localidad')!.setAttribute('value', '');

    // Limpiar campo de valor de multa
    const valorMultaElement = document.getElementById('valor_multa') as HTMLInputElement;
    valorMultaElement.value = '';

    // Limpiar campo de observación
    const observacionElement = document.getElementById('observacion') as HTMLTextAreaElement;
    observacionElement.value = '';
  }

  guardarMulta() {
    if (!this.usuarioSeleccionado && !this.valor_multa && !this.observacion) {
      this.toastr.warning('Debe seleccionar un usuario, ingresar un valor de multa y agregar una observación antes de guardar', 'Advertencia');
      return;
    }

    if (!this.usuarioSeleccionado) {
      this.toastr.warning('Debe seleccionar un usuario antes de guardar la multa', 'Advertencia');
      return;
    }

    const valorMultaElement = document.getElementById('valor_multa') as HTMLInputElement;
    const valor_multa = valorMultaElement.value ? parseFloat(valorMultaElement.value) : null;

    const observacionElement = document.getElementById('observacion') as HTMLTextAreaElement;
    const observacion = observacionElement.value.trim();

    if (valor_multa === null || isNaN(valor_multa)) {
      this.toastr.warning('Debe ingresar un valor válido para la multa', 'Advertencia');
      return;
    }

    if (!observacion) {
      this.toastr.warning('Debe ingresar una observación antes de guardar la multa', 'Advertencia');
      return;
    }

    if (valor_multa <= 0) {
      this.toastr.warning('El valor de la multa debe ser mayor que cero', 'Advertencia');
      return;
    }

    const id_usuario = this.usuarioSeleccionado.id_persona;

    this.multasService.guardarMulta(id_usuario, valor_multa, observacion).subscribe(
      response => {
        this.obtenerProximoNumeroMultaDisponible();
        console.log('Multa guardada correctamente:', response);
        this.toastr.success('Multa guardada correctamente', 'Éxito');
      },
      error => {
        console.error('Error al guardar la multa:', error);
        this.toastr.error('Error al guardar la multa', 'Error');
      }
    );
  }
}
