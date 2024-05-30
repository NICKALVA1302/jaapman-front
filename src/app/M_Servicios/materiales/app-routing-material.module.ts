import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialComponent } from './components/material/material.component';
import { AddEditMaterialesComponent } from './components/add-edit-materiales/add-edit-materiales.component';
import { MantenimientoComponent } from './components/mantenimiento/mantenimiento.component';
import { ViewPresidenteComponent } from './pages/view-presidente/view-presidente.component';
import { AuthGuard } from '../../utils/auth.guard';
import { TarifaComponent } from './components/tarifa/tarifa.component';


//Rutas hijas de modulo consumo-agua
const routes: Routes = [
  {
    path:'materiales', component: ViewPresidenteComponent, canActivate: [AuthGuard],
    children:[
      {path: 'tarifa', component: TarifaComponent, canActivate: [AuthGuard]},
      {path: 'mantenimiento', component: MantenimientoComponent, canActivate: [AuthGuard]},
      {path: 'material', component: MaterialComponent, canActivate: [AuthGuard]},
      {path: 'editar/:id_material', component: AddEditMaterialesComponent, canActivate: [AuthGuard]},
      {path: 'agregar', component: AddEditMaterialesComponent, canActivate: [AuthGuard]},
      {path: '**', redirectTo: 'materiales'},
    ]
  },
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class AppRoutingMaterialModule { }
