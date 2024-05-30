import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuComponentComponent } from '../menu/componentes/menu-component/menu-component.component';
import { MenuOperadorComponentComponent } from './componentes/menu-operador-component/menu-operador-component.component';
import { MenuRoutingModule } from './menu-routing.module'; 

@NgModule({
  declarations: [MenuComponentComponent,MenuOperadorComponentComponent],
  imports: [
    CommonModule,
    MenuRoutingModule 
  ]
})
export class MenuModule { }
