import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewReportePagoComponent } from './components/view-reporte-pago/view-reporte-pago.component';

const routes: Routes = [
  { path: '', component: ViewReportePagoComponent },
  // Otras rutas si las hay...
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagoClienteRoutingModule {}
