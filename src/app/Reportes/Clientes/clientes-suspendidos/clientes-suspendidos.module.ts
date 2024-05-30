import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AccesoModule } from '../../../acceso/acceso.module';
import { ViewRepClienSusComponent } from './pages/view-rep-clien-sus/view-rep-clien-sus.component';
import { ViewReporteCSComponent } from './components/view-reporte-cs/view-reporte-cs.component';
import { FormsModule } from '@angular/forms';
import { ClienteSRoutingModule } from './clienteSus-routing.module';
import { AppRoutingConsumoModule } from '../../../M_Servicios/operador/consumo-agua/app-routing-consumo.module';

@NgModule({
  declarations: [
    ViewReporteCSComponent,
    ViewRepClienSusComponent
  ], 
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    AppRoutingConsumoModule,
    FormsModule,
    AccesoModule,
    NgxExtendedPdfViewerModule,
    ClienteSRoutingModule
  ]
})
export class ClientesSuspendidosModule { }
