import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ViewLecturaClienteComponent } from './components/view-lectura-cliente/view-lectura-cliente.component';
import { LecturasClienteRoutingModule } from './lecturas-cliente-routing.module';

@NgModule({
  declarations: [ViewLecturaClienteComponent],
  imports: [FormsModule, CommonModule, LecturasClienteRoutingModule],
})
export class LecturasClienteModule {}
