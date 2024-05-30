import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumoAgua2Pipe } from '../../../pipes/filtros/consumo-agua2.pipe';



@NgModule({
  declarations: [
    ConsumoAgua2Pipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ConsumoAgua2Pipe,
  ]
})
export class SharedModule { }
