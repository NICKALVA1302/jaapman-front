//Importaciones de modulos
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppRoutingConsumoModule } from './app-routing-consumo.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AccesoModule } from '../../../acceso/acceso.module';
import {ScrollingModule} from '@angular/cdk/scrolling';


//Importaciones de componentes
import { MenuOperadorComponent } from './components/menu-operador/menu-operador.component';
import { ViewLocalidadesComponent } from './components/view-localidades/view-localidades.component';
import { ViewLocUsuariosComponent } from './components/view-loc-usuarios/view-loc-usuarios.component';
import { ViewOperadorComponent } from './pages/view-operador/view-operador.component';
import { NavbarOperadorComponent } from './components/navbar-operador/navbar-operador.component';

//Importaciones de filtros 
import { ConsumoAguaPipe } from '../../../pipes/filtros/consumo-agua.pipe';
import { ConsumoAgua2Pipe } from '../../../pipes/filtros/consumo-agua2.pipe';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ClientesSuspendidosModule } from '../../../Reportes/Clientes/clientes-suspendidos/clientes-suspendidos.module';
import { ListadoClientesModule } from '../../../Reportes/Clientes/listado-clientes/listado-clientes.module';
import { CarteraVencidaModule } from '../../../Reportes/cartera-vencida/cartera-vencida.module';
import { ValoresxmesModule } from '../../../Reportes/valoresxmes/valoresxmes.module';



@NgModule({
    declarations: [
        ViewLocalidadesComponent,
        ViewLocUsuariosComponent,
        ViewOperadorComponent,
        MenuOperadorComponent,
        NavbarOperadorComponent,
        ConsumoAguaPipe,
        ConsumoAgua2Pipe,
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
        ScrollingModule,
        ClientesSuspendidosModule,
        ListadoClientesModule,
        CarteraVencidaModule,
        ValoresxmesModule
    ]
})
export class ConsumoAguaModule { }
