import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';  
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AuthService } from './acceso/servicios/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { AddTokenInterceptor } from './utils/add-token-interceptor'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MenuModule } from './menu/menu.module';  // Importa el módulo completo
import { RouterModule } from '@angular/router';
import { AppLayoutModule } from './menu/componentes/menu-component/layout/app.layout.module';
import { CountryService } from './menu/componentes/menu-component/demo/service/country.service';
import { CustomerService } from './menu/componentes/menu-component/demo/service/customer.service';
import { EventService } from './menu/componentes/menu-component/demo/service/event.service';
import { IconService } from './menu/componentes/menu-component/demo/service/icon.service';
import { NodeService } from './menu/componentes/menu-component/demo/service/node.service';
import { PhotoService } from './menu/componentes/menu-component/demo/service/photo.service';
import { ProductService } from './menu/componentes/menu-component/demo/service/product.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
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
        AppLayoutModule
      ],
        
      
      providers: [[AuthService],
        { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService
      ],
    bootstrap: [AppComponent]
})
export class AppModule { }