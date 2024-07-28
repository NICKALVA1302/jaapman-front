import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewReporteRecaudacionComponent } from './components/view-reporte-recaudacion/view-reporte-recaudacion.component';

const routes: Routes = [
  { path: '', component: ViewReporteRecaudacionComponent },
  // Otras rutas si las hay...
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecaudacionRoutingModule {}
