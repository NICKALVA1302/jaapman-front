import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../utils/auth.guard';
import { ViewInstalacionComponent } from './pages/view-instalacion/view-instalacion.component';


//Rutas hijas de modulo cobros
const routes: Routes = [
    {
      path:'instalacion',component: ViewInstalacionComponent, canActivate: [AuthGuard],
      children:[
        /* {path:'cobro', component: ViewCobroComponent, canActivate: [AuthGuard]}, */
        /* {
          path: 'consumos-clientes',
          component: ViewConsumosClientesComponent
        }, */
        /* {path:'menu-operador', component: MenuOperadorComponent},*/
        {path:'**', redirectTo: 'instalacion'}, 
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
  export class InstalacionRoutingModule { }