import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewLocalidadesComponent } from './components/view-localidades/view-localidades.component';
import { ViewLocUsuariosComponent } from './components/view-loc-usuarios/view-loc-usuarios.component';
import { AuthGuard } from '../../utils/auth.guard';
import { ViewOperadorComponent } from './pages/view-operador/view-operador.component';
import { MenuOperadorComponent } from './components/menu-operador/menu-operador.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

//Rutas hijas de modulo consumo-agua
const routes: Routes = [
  {
    path:'consumo-agua',component: ViewOperadorComponent, canActivate: [AuthGuard],
    children:[
      {path:'localidades', component: ViewLocalidadesComponent, canActivate: [AuthGuard]},
      {path:'loc-usuarios/:id', component: ViewLocUsuariosComponent, canActivate: [AuthGuard]},
      {path:'menu-operador', component: MenuOperadorComponent, canActivate: [AuthGuard]},
      {path:'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard]},
      {path:'**', redirectTo: 'menu-operador'},
    ],
  },
  /* {path:'**', redirectTo: 'menu-operador'}, */
  {path:'consumo-agua', redirectTo: 'menu-operador'}, 

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingConsumoModule { }