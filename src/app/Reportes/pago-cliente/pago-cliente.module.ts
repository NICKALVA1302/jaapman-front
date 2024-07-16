import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ViewReportePagoComponent } from './components/view-reporte-pago/view-reporte-pago.component';
import { PagoClienteRoutingModule } from './pago-cliente-routing.module';

@NgModule({
  declarations: [ViewReportePagoComponent],
  imports: [FormsModule, CommonModule, PagoClienteRoutingModule],
})
export class PagoClienteModule {}
