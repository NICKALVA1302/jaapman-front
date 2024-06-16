import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../utils/auth.guard';
import { CommonModule } from '@angular/common';
import { ViewReporteVmComponent } from './components/view-reporte-vm/view-reporte-vm.component';



//Rutas hijas de modulo cobros
const routes: Routes = [
  { path: '', component: ViewReporteVmComponent },
  // Otras rutas si las hay...
];

@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule  ],
})
  export class ValoresRoutingModule { }