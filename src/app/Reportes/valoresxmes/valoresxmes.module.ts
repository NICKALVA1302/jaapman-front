import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingConsumoModule } from '../../M_Servicios/operador/consumo-agua/app-routing-consumo.module';
import { FormsModule } from '@angular/forms';
import { AccesoModule } from '../../acceso/acceso.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { FormSeleccionComponent } from './components/form-seleccion/form-seleccion.component';
import { ReporteValoresxmesComponent } from './pages/reporte-valoresxmes/reporte-valoresxmes.component';


@NgModule({
  declarations: [
    FormSeleccionComponent,
    ReporteValoresxmesComponent
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
export class ValoresxmesModule { }
