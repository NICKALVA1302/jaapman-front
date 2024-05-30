import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AccesoModule } from '../../acceso/acceso.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ViewReporteCVComponent } from './components/view-reporte-cv/view-reporte-cv.component';
import { ViewRepCarteraComponent } from './pages/view-rep-cartera/view-rep-cartera.component';
import { CarteraRoutingModule } from './cartera-routing.module';
import { AppRoutingConsumoModule } from '../../M_Servicios/operador/consumo-agua/app-routing-consumo.module';



@NgModule({
  declarations: [
    ViewReporteCVComponent,
    ViewRepCarteraComponent
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
export class CarteraVencidaModule { }
