import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewPresidenteComponent } from './materiales/pages/view-presidente/view-presidente.component';

import { AuthGuard } from '../../utils/auth.guard';
import { CambiarClaveComponent } from './materiales/components/cambiar-clave/cambiar-clave.component';

// Materiales
import { MaterialComponent } from './materiales/components/material/material.component';
import { AddEditMaterialesComponent } from './materiales/components/add-edit-materiales/add-edit-materiales.component';

// Mantenimiento
import { ViewMantenimientoComponent } from './mantenimiento/pages/view-mantenimiento/view-mantenimiento.component';
import { MantenimientoComponent } from './mantenimiento/components/mantenimiento/mantenimiento.component';

// Multas
import { ViewMultaComponent } from './multas/pages/view-multa/view-multa.component';
import { MultaComponent } from './multas/components/multa/multa.component';
import { ListadoMultaComponent } from './multas/components/listado-multa/listado-multa.component';
import { ActualizarMultaComponent } from './multas/components/actualizar-multa/actualizar-multa.component';

// Tarifa
import { ViewTarifaComponent } from './tarifas/pages/view-tarifa/view-tarifa.component';
import { TarifaComponent } from './tarifas/components/tarifa/tarifa.component';

// Suspender
import { ViewSuspenderUsuarioComponent } from './suspender-usuario/pages/view-suspender-usuario/view-suspender-usuario.component';
import { SuspenderUsuarioComponent } from './suspender-usuario/components/suspender-usuario/suspender-usuario.component';
import { ReporteMaterialComponent } from './materiales/components/reporteMaterial/reporte-material/reporte-material.component';

// Instalacion
import { ViewInstalacionComponent } from './instalacion/pages/view-instalacion/view-instalacion.component';
import { ViewDinstalacionComponent } from './instalacion/components/view-dinstalacion/view-dinstalacion.component';
import { AsignarOperadorComponent } from './consumo-agua/components/asignar-operador/asignar-operador.component';
import { TomaLecturaComponent } from './consumo-agua/components/toma-lectura/toma-lectura.component';
import { InicioAperturaComponent } from './consumo-agua/components/inicio-apertura/inicio-apertura.component';
import { FinAperturaComponent } from './consumo-agua/components/fin-apertura/fin-apertura.component';
import { ViewInscribirClienteComponent } from './inscribir-cliente/pages/view-inscribir-cliente/view-inscribir-cliente.component';
import { InscribirClienteComponent } from './inscribir-cliente/components/inscribir-cliente/inscribir-cliente.component';



//Rutas hijas de modulo presidente
const routes: Routes = [
  {
    path:'', component: ViewPresidenteComponent, canActivate: [AuthGuard],
    children:[
      {path: 'material', component: MaterialComponent, canActivate: [AuthGuard]},
      {path: 'editar/:id_material', component: AddEditMaterialesComponent, canActivate: [AuthGuard]},
      {path: 'agregar', component: AddEditMaterialesComponent, canActivate: [AuthGuard]},
      {path: 'reporteMaterial', component: ReporteMaterialComponent, canActivate: [AuthGuard]},
      {
        path: 'cambiar-clave', 
        component: CambiarClaveComponent, canActivate: [AuthGuard]
      },
      {path: '**', redirectTo: 'materiales'},
    ]
  },
  {
    path: '', component: ViewPresidenteComponent, canActivate: [AuthGuard],
    children:[
      {path: 'asignar-operador', component: AsignarOperadorComponent, canActivate: [AuthGuard]},
      {path: 'toma-lectura', component: TomaLecturaComponent, canActivate: [AuthGuard]},
    ]
  },
  {
    path: '', component: ViewMantenimientoComponent, canActivate: [AuthGuard],
    children:[
      {path: 'mantenimiento', component: MantenimientoComponent, canActivate: [AuthGuard]},
    ]
  },
  {
    path: '', component: ViewMultaComponent, canActivate: [AuthGuard],
    children:[
      {path: 'multa', component: MultaComponent, canActivate: [AuthGuard]},
      {path: 'listMulta', component: ListadoMultaComponent, canActivate: [AuthGuard]},
      {path: 'actualizar/:id_multa', component: ActualizarMultaComponent, canActivate: [AuthGuard]},
      
    ]
  },
  {
    path: '', component: ViewTarifaComponent, canActivate: [AuthGuard],
    children:[
      {path: 'tarifa', component: TarifaComponent, canActivate: [AuthGuard]},
    ]
  },
  {
    path: '', component: ViewSuspenderUsuarioComponent, canActivate: [AuthGuard],
    children:[
      {path: 'suspender', component: SuspenderUsuarioComponent, canActivate: [AuthGuard]},
    ]
  },
  {
    path: '', component: ViewInstalacionComponent, canActivate: [AuthGuard],
    children:[
      {path: 'instalacion', component: ViewDinstalacionComponent, canActivate: [AuthGuard]},
    ]
  },
  {
    path: '', component: ViewPresidenteComponent, canActivate: [AuthGuard],
    children:[
      {path: 'asignar-operador', component: AsignarOperadorComponent, canActivate: [AuthGuard]},
      {path: 'toma-lectura', component: TomaLecturaComponent, canActivate: [AuthGuard]},
      {path: 'inicio-apertura', component: InicioAperturaComponent , canActivate: [AuthGuard]},
      {path: 'fin-apertura', component: FinAperturaComponent , canActivate: [AuthGuard]},

    ]
  },
  {
    path: '', component: ViewInscribirClienteComponent, canActivate: [AuthGuard],
    children:[
      {path: 'inscribir-cliente', component: InscribirClienteComponent, canActivate: [AuthGuard]},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresidenteRoutingModule { }
