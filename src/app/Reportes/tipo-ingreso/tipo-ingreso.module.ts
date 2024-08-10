import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TipoIngresoRoutingModule } from './tipo-ingreso-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { AppRoutingConsumoModule } from '../../M_Servicios/operador/consumo-agua/app-routing-consumo.module';
import { AccesoModule } from '../../acceso/acceso.module';
import { ViewReporteTipoIngresoComponent } from './components/view-reporte-tipo-ingreso/view-reporte-tipo-ingreso.component';
@NgModule({
  declarations: [ViewReporteTipoIngresoComponent],
  imports: [
    FormsModule,
    CommonModule,
    TipoIngresoRoutingModule,
    RouterModule,
    HttpClientModule,
    AppRoutingConsumoModule,
    AccesoModule,
    NgxExtendedPdfViewerModule,
  ],
})
export class TipoIngresoModule {}
