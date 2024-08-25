import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AccesoModule } from '../../acceso/acceso.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { AppRoutingConsumoModule } from '../../M_Servicios/operador/consumo-agua/app-routing-consumo.module';
import { ViewReporteRecaudacionComponent } from './components/view-reporte-recaudacion/view-reporte-recaudacion.component';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReporteRecaudacionAguaComponent } from './pages/reporte-recaudacion-agua/reporte-recaudacion-agua.component';
import { FormSeleccionComponent } from './components/form-seleccion/form-seleccion.component';
import { GraficoComponent } from './components/grafico/grafico.component';

@NgModule({
  declarations: [ViewReporteRecaudacionComponent,
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
