import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../utils/auth.guard';
import { ViewRepListCliComponent } from './pages/view-rep-list-cli/view-rep-list-cli.component';

//Rutas hijas de modulo cobros
const routes: Routes = [
    {
      path:'listado-clientes',component: ViewRepListCliComponent, canActivate: [AuthGuard],
      children:[
        {path:'**', redirectTo: 'listado-clientes'}, 
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
  export class ListadoRoutingModule { }