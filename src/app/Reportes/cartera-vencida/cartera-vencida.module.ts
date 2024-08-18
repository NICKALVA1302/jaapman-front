import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AccesoModule } from '../../acceso/acceso.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ViewReporteCVComponent } from './components/view-reporte-cv/view-reporte-cv.component';
import { CarteraRoutingModule } from './cartera-routing.module';
import { AppRoutingConsumoModule } from '../../M_Servicios/operador/consumo-agua/app-routing-consumo.module';
import { FormSeleccionComponent } from './components/form-seleccion/form-seleccion.component';
import { ReporteCarteraComponent } from './pages/reporte-cartera/reporte-cartera.component';
import { TablaResultadosComponent } from './components/tabla-resultados/tabla-resultados.component';
import { GraficoComponent } from './components/grafico/grafico.component';


@NgModule({
  declarations: [
    ViewReporteCVComponent,
    FormSeleccionComponent,
    ReporteCarteraComponent,
    TablaResultadosComponent,
    GraficoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    AppRoutingConsumoModule,
    FormsModule,
    AccesoModule,
    NgxExtendedPdfViewerModule,
    CarteraRoutingModule,  // Asegúrate de que el módulo de enrutamiento esté importado
  ]
})
export class CarteraVencidaModule { }
