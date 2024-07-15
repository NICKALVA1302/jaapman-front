import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewLecturaClienteComponent } from './components/view-lectura-cliente/view-lectura-cliente.component';

//Rutas hijas de modulo cobros
const routes: Routes = [
  { path: '', component: ViewLecturaClienteComponent },
  // Otras rutas si las hay...
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LecturasClienteRoutingModule {}
