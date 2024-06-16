import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewReporteDeudasComponent } from './components/view-reporte-deudas/view-reporte-deudas.component';

//Rutas hijas de modulo cobros
const routes: Routes = [
  { path: '', component: ViewReporteDeudasComponent },
  // Otras rutas si las hay...
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeudasPuebloRoutingModule {}