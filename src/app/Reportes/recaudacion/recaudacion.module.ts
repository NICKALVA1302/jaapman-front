import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AccesoModule } from '../../acceso/acceso.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { AppRoutingConsumoModule } from '../../M_Servicios/operador/consumo-agua/app-routing-consumo.module';
import { ViewReporteRecaudacionComponent } from './components/view-reporte-recaudacion/view-reporte-recaudacion.component';

@NgModule({
  declarations: [ViewReporteRecaudacionComponent],
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
export class RecaudacionModule { }
