import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppRoutingMaterialModule } from './app-routing-material.module';

import { SpinnerComponent } from '../../spinner/spinner.component';
import { AddEditMaterialesComponent } from './components/add-edit-materiales/add-edit-materiales.component';
import { MaterialComponent } from './components/material/material.component';
import { FiltroPipe } from './components/pipes/filtro.pipe';

import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { MantenimientoComponent } from './components/mantenimiento/mantenimiento.component';
import { MenuPresidenteComponent } from './components/menu-presidente/menu-presidente.component';
import { ViewPresidenteComponent } from './pages/view-presidente/view-presidente.component';
import { ViewUsuarioComponent } from './components/view-usuario/view-usuario.component';
import { TarifaComponent } from './components/tarifa/tarifa.component';


@NgModule({
  declarations: [
    AddEditMaterialesComponent,
    MaterialComponent,
    FiltroPipe,
    ProgressBarComponent,
    SpinnerComponent,
    MenuPresidenteComponent,
    ViewPresidenteComponent,
    MantenimientoComponent,
    ViewUsuarioComponent,
    TarifaComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    AppRoutingMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MaterialModule { }
