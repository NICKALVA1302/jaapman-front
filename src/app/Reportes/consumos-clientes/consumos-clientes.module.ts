import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarReportesComponent } from './components/navbar-reportes/navbar-reportes.component';
import { MenuReportesComponent } from './components/menu-reportes/menu-reportes.component';
import { ViewConsumosClientesComponent } from './components/view-consumos-clientes/view-consumos-clientes.component';
import { ViewReportesComponent } from './pages/view-reportes/view-reportes.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingConsumoModule } from '../../M_Servicios/operador/consumo-agua/app-routing-consumo.module';
import { FormsModule } from '@angular/forms';
import { AccesoModule } from '../../acceso/acceso.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';


@NgModule({
  declarations: [
    NavbarReportesComponent,
    MenuReportesComponent,
    ViewConsumosClientesComponent,
    ViewReportesComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    AppRoutingConsumoModule,
    FormsModule,
    AccesoModule,
    NgxExtendedPdfViewerModule,
    
  ]
})
export class ConsumosClientesModule { }
