import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ViewConsumosClientesComponent } from './components/view-consumos-clientes/view-consumos-clientes.component';



//Rutas hijas de modulo cobros
const routes: Routes = [
  { path: '', component: ViewConsumosClientesComponent },
  // Otras rutas si las hay...
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class ConsumosClientesRoutingModule { }
