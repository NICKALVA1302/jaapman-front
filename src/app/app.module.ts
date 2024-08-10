import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ToastrModule } from 'ngx-toastr';
import { ConsumosClientesModule } from './Reportes/consumos-clientes/consumos-clientes.module';
import { DeudasPuebloModule } from './Reportes/deudas-pueblo/deudas-pueblo.module';
import { LecturasClienteModule } from './Reportes/lecturas-cliente/lecturas-cliente.module';
import { PagoClienteModule } from './Reportes/pago-cliente/pago-cliente.module';
import { TipoIngresoModule } from './Reportes/tipo-ingreso/tipo-ingreso.module';
import { AuthService } from './acceso/servicios/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CountryService } from './menu/componentes/menu-component/demo/service/country.service';
import { CustomerService } from './menu/componentes/menu-component/demo/service/customer.service';
import { EventService } from './menu/componentes/menu-component/demo/service/event.service';
import { IconService } from './menu/componentes/menu-component/demo/service/icon.service';
import { NodeService } from './menu/componentes/menu-component/demo/service/node.service';
import { PhotoService } from './menu/componentes/menu-component/demo/service/photo.service';
import { ProductService } from './menu/componentes/menu-component/demo/service/product.service';
import { AppLayoutModule } from './menu/componentes/menu-component/layout/app.layout.module';
import { MenuModule } from './menu/menu.module'; // Importa el módulo completo
import { AddTokenInterceptor } from './utils/add-token-interceptor';
@NgModule({
  declarations: [AppComponent],
  imports: [
    //
    TipoIngresoModule,
    PagoClienteModule,
    ConsumosClientesModule,
    LecturasClienteModule,
    DeudasPuebloModule,
    //
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    NgxExtendedPdfViewerModule,
    MenuModule,
    RouterModule,
    AppLayoutModule,
    NgbDatepickerModule
  ],

  providers: [
    [AuthService],
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true },
    CountryService,
    CustomerService,
    EventService,
    IconService,
    NodeService,
    PhotoService,
    ProductService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
