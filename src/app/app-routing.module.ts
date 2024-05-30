//import { ConsumosClientesModule } from './Reportes/consumos-clientes/consumos-clientes.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* import { ViewOperadorComponent } from './M_Servicios/operador/consumo-agua/pages/view-operador/view-operador.component';
import { AuthGuard } from './utils/auth.guard';
 */

const routes: Routes = [

  {
    path: 'acceso',
    loadChildren: () => import('./acceso/acceso.module').then( m => m.AccesoModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuModule)
  },
  {
    path:'presidente',
    loadChildren:() => import ('./M_Servicios/presidente/presidente.module').then(m => m.PresidenteModule),
  },
  {
    path:'operador',
    loadChildren:() => import ('./M_Servicios/operador/consumo-agua/consumo-agua.module').then(m => m.ConsumoAguaModule)
  },
  {
    path:'cajero',
    loadChildren:() => import ('./M_Servicios/cobros/cobros.module').then(m => m.CobrosModule),
    
  },
  {
    path:'cajero',
    loadChildren:() => import ('./M_Servicios/instalacion/instalacion.module').then(m => m.InstalacionModule),
  },
  {
    path: '**',
    redirectTo: 'acceso/login' 
  }/* ,
  {
    path: 'operador',
    redirectTo: 'operador/consumo-agua' 
  } */
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
