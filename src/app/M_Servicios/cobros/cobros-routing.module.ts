import { ConsumosClientesModule } from './../../Reportes/consumos-clientes/consumos-clientes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ViewCobroComponent } from './components/view-cobro/view-cobro.component';
import { AuthGuard } from '../../utils/auth.guard';
import { ViewCobrosComponent } from './pages/view-cobros/view-cobros.component';
import { ViewConsumosClientesComponent } from '../../Reportes/consumos-clientes/components/view-consumos-clientes/view-consumos-clientes.component';
import { ViewReporteCSComponent } from '../../Reportes/Clientes/clientes-suspendidos/components/view-reporte-cs/view-reporte-cs.component';
import { ViewReporteLcComponent } from '../../Reportes/Clientes/listado-clientes/components/view-reporte-lc/view-reporte-lc.component';
import { ViewReporteCVComponent } from '../../Reportes/cartera-vencida/components/view-reporte-cv/view-reporte-cv.component';
import { ViewReporteVmComponent } from '../../Reportes/valoresxmes/components/view-reporte-vm/view-reporte-vm.component';
import { ViewReporteDeudasComponent } from '../../Reportes/deudas-pueblo/components/view-reporte-deudas/view-reporte-deudas.component';


//Rutas hijas de modulo cobros
const routes: Routes = [
  {
    path:'cobros',component: ViewCobrosComponent, canActivate: [AuthGuard],
    children:[
      {path:'cobro', component: ViewCobroComponent, canActivate: [AuthGuard]},
      {
        path: 'consumos-clientes',
        component: ViewConsumosClientesComponent
      },
      { path: 'clientes-suspendidos', component: ViewReporteCSComponent },
      { path: 'listado-clientes', component: ViewReporteLcComponent },
      { path: 'cartera-vencida', component: ViewReporteCVComponent},
      {path: 'valoresxmes', component: ViewReporteVmComponent},
      {path: 'deudas-pueblo', component: ViewReporteDeudasComponent},
      /* {path:'menu-operador', component: MenuOperadorComponent},*/
      {path:'**', redirectTo: 'cobros'}, 
    ]
  }

  
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class CobrosRoutingModule { }
