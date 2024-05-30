import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewUsuarioComponent } from '../view-usuario/view-usuario.component';
import { ViewPagoComponent } from '../view-pago/view-pago.component';
import { DatosPorLocalidad } from '../../models/localidades';

@Component({
  selector: 'app-view-cobro',
  templateUrl: './view-cobro.component.html',
  styleUrls: ['./view-cobro.component.css']
})
export class ViewCobroComponent {
  usuarioSeleccionado: DatosPorLocalidad | null = null;
  constructor(private modalService: NgbModal) { }

  abrirModal() {
    const modalRef = this.modalService.open(ViewUsuarioComponent);
    modalRef.componentInstance.usuarioSeleccionado.subscribe((usuario: DatosPorLocalidad) => {
      this.usuarioSeleccionado = usuario;
      this.autocompletarCampos();
    });
  }

  //AUTOCOMPLETAR LOS CAMPOS DE DATOS DEL CLIENTE
  autocompletarCampos() {
    if (this.usuarioSeleccionado) {
      const { nombre, apellido, cedula, direccion } = this.usuarioSeleccionado;
      // Asignar los valores a los campos del formulario
      document.getElementById('nombre')!.setAttribute('value', nombre || ''); // Si nombre es null o undefined, se asigna un valor vacío
      document.getElementById('apellido')!.setAttribute('value', apellido || '');
      document.getElementById('cedula')!.setAttribute('value', cedula || '');
      document.getElementById('codigo')!.setAttribute('value', this.usuarioSeleccionado.usuarios[0].medidor.codigo || '');
      document.getElementById('localidad')!.setAttribute('value', this.usuarioSeleccionado.usuarios[0].localidad.nombre || '');
      document.getElementById('direccion')!.setAttribute('value', direccion || '');

      this.limpiarTablaResumen();
      this.autocompletarTablaResumen();
  }
  }

  //LIMPIAR CAMPOS AL MOMENTO DE SELECCIONAR OTRO CLIENTE
  limpiarTablaResumen() {
    const tbody = document.getElementById('tablaResumen')!.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    document.getElementById('tarifa_sin_descuento')!.setAttribute('value', '');
  }

  //AUTOCOMPLETAR LOS CAMPOS DE RESUMEN (DEUDAS)
  autocompletarTablaResumen() {
    if (this.usuarioSeleccionado) {
      const tablaResumen = document.getElementById('tablaResumen') as HTMLTableElement;
      if (tablaResumen) {
        const detallesPlanilla = this.usuarioSeleccionado.usuarios[0].planillas[0].PlanillaDetalles[0];
        const ConsumoAgua = this.usuarioSeleccionado.usuarios[0].planillas[0];
        if (detallesPlanilla && ConsumoAgua) {
          const tbody = tablaResumen.getElementsByTagName('tbody')[0];
          if (ConsumoAgua.total_pagar) {
            this.crearFilaResumen(tbody, 'CONSUMO DE AGUA', ConsumoAgua.total_pagar);
            document.getElementById('tarifa_sin_descuento')!.setAttribute('value', ` $ `+detallesPlanilla.total_pago.toString());
          }
          if (detallesPlanilla.Alcantarillado !== null) {
            this.crearFilaResumen(tbody, 'ALCANTARILLADO', detallesPlanilla.Alcantarillado.Tarifa.valor);
            document.getElementById('tarifa_sin_descuento')!.setAttribute('value', ` $ `+detallesPlanilla.total_pago.toString());
          }
          if (detallesPlanilla.Mantenimiento !== null) {
            this.crearFilaResumen(tbody, 'MANTENIMIENTO', detallesPlanilla.Mantenimiento.total);
             document.getElementById('tarifa_sin_descuento')!.setAttribute('value', ` $ `+detallesPlanilla.total_pago.toString());
          }
          if (detallesPlanilla.Instalacion  !== null) {
            this.crearFilaResumen(tbody, 'DERECHO DE INSTALACIÓN', detallesPlanilla.Instalacion.valor);
             document.getElementById('tarifa_sin_descuento')!.setAttribute('value', ` $ `+detallesPlanilla.total_pago.toString());
          }
        }
      }
    }
  }

  
  //cREAR LAS FILAS SEGUN EL TIPO Y LA DEUDA 
  crearFilaResumen(tbody: HTMLTableSectionElement, tipoDeuda: string, monto: number) {
    const row = tbody.insertRow();
    const tipoCell = row.insertCell(0);
    const deudaCell = row.insertCell(1);

    tipoCell.innerHTML = tipoDeuda;
    deudaCell.innerHTML = `$ ${monto.toString()}`;
  }

  abrirModalPago() {
    const modalRef = this.modalService.open(ViewPagoComponent);
    modalRef.componentInstance.usuarioSeleccionado = this.usuarioSeleccionado;
  }
  
  


}
