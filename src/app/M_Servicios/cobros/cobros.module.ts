import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewCobroComponent } from './components/view-cobro/view-cobro.component';
import { NavbarCobroComponent } from './components/navbar-cobro/navbar-cobro.component';
import { ViewUsuarioComponent } from './components/view-usuario/view-usuario.component';
import { MenuCobroComponent } from './components/menu-cobro/menu-cobro.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CobrosRoutingModule } from './cobros-routing.module';
import { ViewCobrosComponent } from './pages/view-cobros/view-cobros.component';
import { ViewPagoComponent } from './components/view-pago/view-pago.component';
import { FormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';



@NgModule({
  declarations: [
  
    ViewCobroComponent,
    NavbarCobroComponent,
    ViewUsuarioComponent,
    MenuCobroComponent,
    ViewCobrosComponent,
    ViewPagoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    CobrosRoutingModule,
    FormsModule,
    NgxExtendedPdfViewerModule

  ]
})
export class CobrosModule { }
