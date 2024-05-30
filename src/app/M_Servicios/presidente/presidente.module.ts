import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresidenteRoutingModule } from './presidente-routing.module';
import { AsignarOperadorComponent } from './consumo-agua/components/asignar-operador/asignar-operador.component';
import { TomaLecturaComponent } from './consumo-agua/components/toma-lectura/toma-lectura.component';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { AddEditMaterialesComponent } from './materiales/components/add-edit-materiales/add-edit-materiales.component';
import { CambiarClaveComponent } from './materiales/components/cambiar-clave/cambiar-clave.component';
import { MaterialComponent } from './materiales/components/material/material.component';
import { MenuPresidenteComponent } from './materiales/components/menu-presidente/menu-presidente.component';
import { FiltroPipe } from './materiales/components/pipes/filtro.pipe';
import { ProgressBarComponent } from './materiales/components/progress-bar/progress-bar.component';
import { SuspenderUsuarioComponent } from './suspender-usuario/components/suspender-usuario/suspender-usuario.component';
import { TarifaComponent } from './tarifas/components/tarifa/tarifa.component';
import { ViewUsuarioComponent } from './materiales/components/view-usuario/view-usuario.component';
import { ViewPresidenteComponent } from './materiales/pages/view-presidente/view-presidente.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

//Mantenimiento
import { ViewMantenimientoComponent } from './mantenimiento/pages/view-mantenimiento/view-mantenimiento.component';
import { MantenimientoComponent } from './mantenimiento/components/mantenimiento/mantenimiento.component';

//Multas
import { ViewMultaComponent } from './multas/pages/view-multa/view-multa.component';
import { MultaComponent } from './multas/components/multa/multa.component';
import { ActualizarMultaComponent } from './multas/components/actualizar-multa/actualizar-multa.component';
import { ListadoMultaComponent } from './multas/components/listado-multa/listado-multa.component';
import { ViewTarifaComponent } from './tarifas/pages/view-tarifa/view-tarifa.component';
import { ViewSuspenderUsuarioComponent } from './suspender-usuario/pages/view-suspender-usuario/view-suspender-usuario.component';
import { ReporteMaterialComponent } from './materiales/components/reporteMaterial/reporte-material/reporte-material.component';

import { EditInstalacionComponent } from './instalacion/components/edit-instalacion/edit-instalacion.component';
import { ElimInstalacionComponent } from './instalacion/components/elim-instalacion/elim-instalacion.component';
import { ViewDinstalacionComponent } from './instalacion/components/view-dinstalacion/view-dinstalacion.component';
import { ViewUsuariosComponent } from './instalacion/components/view-usuarios/view-usuarios.component';
import { ViewInstalacionComponent } from './instalacion/pages/view-instalacion/view-instalacion.component';

import { InicioAperturaComponent } from './consumo-agua/components/inicio-apertura/inicio-apertura.component';
import { FinAperturaComponent } from './consumo-agua/components/fin-apertura/fin-apertura.component';
import { ConsumoAguaPipe } from '../../pipes/filtros/presidente/consumo-agua.pipe';
import { UserxlocalidadPipe } from '../../pipes/filtros/presidente/userxlocalidad.pipe';
import { ConsumoAguaPresiPipe } from '../../pipes/filtros/presidente/consumo-agua-presi.pipe';




@NgModule({
  declarations: [
    //Componentes de consumo-agua
    AsignarOperadorComponent,
    TomaLecturaComponent,
    ConsumoAguaPipe,
    ConsumoAguaPresiPipe,
    UserxlocalidadPipe,

    //Componentes de multa
    ViewMultaComponent,
    MultaComponent,
    ListadoMultaComponent,
    ActualizarMultaComponent,

    //Componentes de Mantenimiento
    ViewMantenimientoComponent,
    MantenimientoComponent,

    AddEditMaterialesComponent,
    CambiarClaveComponent,
    MaterialComponent,
    FiltroPipe,
    ProgressBarComponent,
    SpinnerComponent,
    MenuPresidenteComponent,
    ViewPresidenteComponent,
    SuspenderUsuarioComponent,
    ViewUsuarioComponent,
    TarifaComponent,
    ViewTarifaComponent,
    ViewSuspenderUsuarioComponent,
    ReporteMaterialComponent,

    // Instalacion
    EditInstalacionComponent,
    ElimInstalacionComponent,
    ViewDinstalacionComponent,
    ViewUsuariosComponent,
    ViewInstalacionComponent,

    InicioAperturaComponent,
    FinAperturaComponent,
    
  ],
  imports: [
    CommonModule,
    PresidenteRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PresidenteModule { }
