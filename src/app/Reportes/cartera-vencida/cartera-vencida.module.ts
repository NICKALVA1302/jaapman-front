import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AccesoModule } from '../../acceso/acceso.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { CarteraRoutingModule } from './cartera-routing.module';
import { AppRoutingConsumoModule } from '../../M_Servicios/operador/consumo-agua/app-routing-consumo.module';
import { FormSeleccionComponent } from './components/form-seleccion/form-seleccion.component';
import { ReporteCarteraComponent } from './pages/reporte-cartera/reporte-cartera.component';
import { TablaResultadosComponent } from './components/tabla-resultados/tabla-resultados.component';
import { GraficoComponent } from './components/grafico/grafico.component';
import { ReporteCarteraAnualComponent } from './pages/reporte-cartera-anual/reporte-cartera-anual.component';
import { ReporteCarteraMensualComponent } from './pages/reporte-cartera-mensual/reporte-cartera-mensual.component';
import { FormSeleccionMensualComponent } from './components/form-seleccion-mensual/form-seleccion-mensual.component';


@NgModule({
  declarations: [ReporteCarteraAnualComponent,
    ReporteCarteraMensualComponent,
    FormSeleccionComponent,
    FormSeleccionMensualComponent,
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
