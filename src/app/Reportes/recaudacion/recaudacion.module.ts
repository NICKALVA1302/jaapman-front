import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AccesoModule } from '../../acceso/acceso.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { AppRoutingConsumoModule } from '../../M_Servicios/operador/consumo-agua/app-routing-consumo.module';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReporteRecaudacionAguaComponent } from './pages/reporte-recaudacion-agua/reporte-recaudacion-agua.component';
import { FormSeleccionComponent } from './components/form-seleccion/form-seleccion.component';
import { GraficoComponent } from './components/grafico/grafico.component';
import { ReporteRecaudacionAnualComponent } from './pages/reporte-recaudacion-anual/reporte-recaudacion-anual.component';
import { ReporteRecaudacionMensualComponent } from './pages/reporte-recaudacion-mensual/reporte-recaudacion-mensual.component';
import { ReporteRecaudacionDiariaComponent } from './pages/reporte-recaudacion-diaria/reporte-recaudacion-diaria.component';

@NgModule({
  declarations: [ReporteRecaudacionAnualComponent,
    ReporteRecaudacionMensualComponent,
    ReporteRecaudacionDiariaComponent,
    ReporteRecaudacionAguaComponent,
    FormSeleccionComponent,
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
    NgbModule,
    NgbDatepickerModule
  ]
})
export class RecaudacionModule { }
