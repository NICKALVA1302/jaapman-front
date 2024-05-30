import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';



import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultaComponent } from './components/multa/multa.component';
import { ListMultaComponent } from './components/list-multa/list-multa.component';
import { CommonModule } from '@angular/common';
import { PresidenteModule } from '../presidente/presidente.module';

@NgModule({
  declarations: [
    ListMultaComponent,
    MultaComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    PresidenteModule,
    FormsModule,
    ReactiveFormsModule,
  ]

})
export class MultaModule { }