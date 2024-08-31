import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../utils/auth.guard';
import { CommonModule } from '@angular/common';
import { ReporteCarteraComponent } from './pages/reporte-cartera/reporte-cartera.component';

// Rutas hijas del módulo cartera-vencida
const routes: Routes = [
  { path: '', component: ReporteCarteraComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class CarteraRoutingModule { }