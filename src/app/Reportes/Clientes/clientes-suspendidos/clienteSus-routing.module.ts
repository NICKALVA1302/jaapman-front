import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ViewReporteCSComponent } from './components/view-reporte-cs/view-reporte-cs.component';



//Rutas hijas de modulo cobros
const routes: Routes = [
  { path: '', component: ViewReporteCSComponent },
  // Otras rutas si las hay...
];

@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule ],
})
export class ClienteSRoutingModule { }
