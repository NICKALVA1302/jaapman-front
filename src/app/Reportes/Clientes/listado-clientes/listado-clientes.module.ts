import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AccesoModule } from '../../../acceso/acceso.module';
import { FormsModule } from '@angular/forms';
import { ViewRepListCliComponent } from './pages/view-rep-list-cli/view-rep-list-cli.component';
import { ViewReporteLcComponent } from './components/view-reporte-lc/view-reporte-lc.component';
import { AppRoutingConsumoModule } from '../../../M_Servicios/operador/consumo-agua/app-routing-consumo.module';

@NgModule({
  declarations: [ViewRepListCliComponent,
    ViewReporteLcComponent
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
export class ListadoClientesModule { }
