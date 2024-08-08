import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewReporteTipoIngresoComponent } from './components/view-reporte-tipo-ingreso/view-reporte-tipo-ingreso.component';

const routes: Routes = [
  { path: '', component: ViewReporteTipoIngresoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TipoIngresoRoutingModule {}
