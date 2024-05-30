import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MultaComponent } from './components/multa/multa.component';
import { ListMultaComponent } from './components/list-multa/list-multa.component';



//Rutas hijas de modulo multa
const routes: Routes = [
  { path: '', component: MultaComponent },
  { path: '', component: ListMultaComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class AppRoutingMultaModule { }
