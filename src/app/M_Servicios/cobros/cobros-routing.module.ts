import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewReporteCSComponent } from '../../Reportes/Clientes/clientes-suspendidos/components/view-reporte-cs/view-reporte-cs.component';
import { ViewReporteLcComponent } from '../../Reportes/Clientes/listado-clientes/components/view-reporte-lc/view-reporte-lc.component';
import { ViewConsumosClientesComponent } from '../../Reportes/consumos-clientes/components/view-consumos-clientes/view-consumos-clientes.component';
import { ViewReporteDeudasComponent } from '../../Reportes/deudas-pueblo/components/view-reporte-deudas/view-reporte-deudas.component';
import { ViewLecturaClienteComponent } from '../../Reportes/lecturas-cliente/components/view-lectura-cliente/view-lectura-cliente.component';
import { ViewReportePagoComponent } from '../../Reportes/pago-cliente/components/view-reporte-pago/view-reporte-pago.component';
import { ViewReporteTipoIngresoComponent } from '../../Reportes/tipo-ingreso/components/view-reporte-tipo-ingreso/view-reporte-tipo-ingreso.component';
import { AuthGuard } from '../../utils/auth.guard';
import { ViewCobroComponent } from './components/view-cobro/view-cobro.component';
import { ViewCobrosComponent } from './pages/view-cobros/view-cobros.component';
import { ReporteCarteraComponent } from '../../Reportes/cartera-vencida/pages/reporte-cartera/reporte-cartera.component';
import { ReporteValoresxmesComponent } from '../../Reportes/valoresxmes/pages/reporte-valoresxmes/reporte-valoresxmes.component';
import { ReporteRecaudacionAguaComponent } from '../../Reportes/recaudacion/pages/reporte-recaudacion-agua/reporte-recaudacion-agua.component';
import { ReporteCarteraMensualComponent } from '../../Reportes/cartera-vencida/pages/reporte-cartera-mensual/reporte-cartera-mensual.component';
//Rutas hijas de modulo cobros
const routes: Routes = [
  {
    path: 'cobros',
    component: ViewCobrosComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'cobro',
        component: ViewCobroComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'consumos-clientes',
        component: ViewConsumosClientesComponent,
      },
      { path: 'clientes-suspendidos', component: ViewReporteCSComponent },
      { path: 'listado-clientes', component: ViewReporteLcComponent },
      { path: 'reporte-cartera', component: ReporteCarteraComponent},
      { path: 'reporte-cartera-mensual', component: ReporteCarteraMensualComponent},
      { path: 'reporte-valoresxmes', component: ReporteValoresxmesComponent },
      { path: 'recaudacion-agua', component: ReporteRecaudacionAguaComponent },
      { path: 'deudas-pueblo', component: ViewReporteDeudasComponent },
      { path: 'lectura-cliente', component: ViewLecturaClienteComponent },
      { path: 'pago-cliente', component: ViewReportePagoComponent },
      { path: 'tipoxingreso', component: ViewReporteTipoIngresoComponent },

      /* {path:'menu-operador', component: MenuOperadorComponent},*/
      { path: '**', redirectTo: 'cobros' },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CobrosRoutingModule {}
