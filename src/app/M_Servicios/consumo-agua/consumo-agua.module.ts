//Importaciones de modulos
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppRoutingConsumoModule } from './app-routing-consumo.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AccesoModule } from '../../acceso/acceso.module';
import {ScrollingModule} from '@angular/cdk/scrolling';


//Importaciones de componentes
import { MenuOperadorComponent } from './components/menu-operador/menu-operador.component';
import { ViewLocalidadesComponent } from './components/view-localidades/view-localidades.component';
import { ViewLocUsuariosComponent } from './components/view-loc-usuarios/view-loc-usuarios.component';
import { ViewOperadorComponent } from './pages/view-operador/view-operador.component';
import { NavbarOperadorComponent } from './components/navbar-operador/navbar-operador.component';

//Importaciones de filtros 
import { ConsumoAguaPipe } from '../../pipes/filtros/consumo-agua.pipe';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

@NgModule({
    declarations: [
        ViewLocalidadesComponent,
        ViewLocUsuariosComponent,
        ViewOperadorComponent,
        MenuOperadorComponent,
        NavbarOperadorComponent,
        ConsumoAguaPipe,
        ChangePasswordComponent
    ],
    exports: [

    ],
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule,
        AppRoutingConsumoModule,
        FormsModule,
        AccesoModule,
        ScrollingModule 
    ]
})
export class ConsumoAguaModule { }