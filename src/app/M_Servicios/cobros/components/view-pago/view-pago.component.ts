import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CobrosService } from '../../services/cobros.service';
import { DatosPorLocalidad, TipoPago } from '../../models/localidades';
import { log } from '@angular-devkit/build-angular/src/builders/ssr-dev-server';
import { ThisReceiver } from '@angular/compiler';


@Component({
  selector: 'app-view-pago',
  templateUrl: './view-pago.component.html',
  styleUrl: './view-pago.component.css'
})
export class ViewPagoComponent {
  
  @Input() usuarioSeleccionado: DatosPorLocalidad | null = null;
  selectedServicio: string | null = null;

  opcionesServicioPago: string[] = ['Consumo de agua', 'Derecho de instalación', 'Mantenimiento', 'Alcantarillado'];
  tipopagos: TipoPago[]=[]
  selectedTipoPagoId: string | null = null; // Cambiar el tipo de selectedLocalidadId a string | null
  abonoRealizado:number | null =null;

  constructor(public activeModal: NgbActiveModal, public servicioCobro: CobrosService) {}
  

  // Método ngOnInit que se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.obtenerTipoPago();

  }

  actualizarTotal() {
    switch (this.selectedServicio) {
      case 'Consumo de agua':
        return this.usuarioSeleccionado?.usuarios[0]?.planillas[0]?.total_pagar || '';
      case 'Alcantarillado':
        return this.usuarioSeleccionado?.usuarios[0]?.planillas[0]?.PlanillaDetalles[0]?.Alcantarillado?.Tarifa?.valor || '';
      case 'Mantenimiento':
        return this.usuarioSeleccionado?.usuarios[0]?.planillas[0]?.PlanillaDetalles[0]?.Mantenimiento?.total || '';
      case 'Derecho de instalación':
        return this.usuarioSeleccionado?.usuarios[0]?.planillas[0]?.PlanillaDetalles[0]?.Instalacion?.valor || '';
      default:
        return '';
    }
  }

  //Recuperar y mostrar los tipos de pagos
  obtenerTipoPago(): void {
    this.servicioCobro.getTipoPago().subscribe(
      (tiposPago: TipoPago[]) => {
        this.tipopagos = tiposPago; //lista de tipos de pagos guardad en tiposPago
        console.log(this.tipopagos);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  
  obtenerIdTipoPagoSeleccionado(event: any): void {
    // Obtener el valor seleccionado del evento
    const selectedValue = event.target.value;
    
    // Asignar el id_tipopago seleccionado a la propiedad selectedTipoPagoId
    this.selectedTipoPagoId = selectedValue;
    console.log(this.selectedTipoPagoId);
    
  }



  realizarAbono(): void {
  
    const idPlanillaDet = this.usuarioSeleccionado?.usuarios[0]?.planillas[0]?.PlanillaDetalles[0]?.id_planilla_det
    if (!idPlanillaDet) {
        console.error('No se pudo obtener el ID del detalle de la planilla');
        return;
    }

    const datosAbono = {
        id_planilla_det: idPlanillaDet,
        id_tipopago: this.selectedTipoPagoId,
        abono_realizado: this.abonoRealizado // Obtener el abono realizado desde el input correspondiente
    };

    this.servicioCobro.registroPago(datosAbono).subscribe(
        (response) => {
            console.log('Abono realizado con éxito', response);
            // Realizar acciones adicionales si es necesario
        },
        (error) => {
            console.error('Error al realizar el abono', error);
            // Manejar el error adecuadamente
        }
    );
}



}
