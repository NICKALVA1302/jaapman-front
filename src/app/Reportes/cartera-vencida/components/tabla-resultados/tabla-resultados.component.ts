import { Component, Input } from '@angular/core';
import { CarteraVA, GeneralCarteraVA } from '../../services/cartera-vencida.service';

@Component({
  selector: 'app-tabla-resultados',
  templateUrl: './tabla-resultados.component.html',
  styleUrl: './tabla-resultados.component.css'
})
export class TablaResultadosComponent {
  @Input() data: CarteraVA[] = [];
  headers = ['Mes', 'Total con Descuento', 'Total sin Descuento', 'Total Facturado', 'Total por Facturar'];
}
