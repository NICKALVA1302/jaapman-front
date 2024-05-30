import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { InstalacionRoutingModule } from './instalacion-routing.module';
import { ViewInstalacionComponent } from './pages/view-instalacion/view-instalacion.component';
import { NavbarInstalacionComponent } from './components/navbar-instalacion/navbar-instalacion.component';
import { ViewDinstalacionComponent } from './components/view-dinstalacion/view-dinstalacion.component';
import { ViewUsuarioComponent } from './components/view-usuario/view-usuario.component';
import { EditInstalacionComponent } from './components/edit-instalacion/edit-instalacion.component';
import { ElimInstalacionComponent } from './components/elim-instalacion/elim-instalacion.component';


@NgModule({
  declarations: [
    ViewInstalacionComponent,
    NavbarInstalacionComponent,
    ViewDinstalacionComponent,
    ViewUsuarioComponent,
    EditInstalacionComponent,
    ElimInstalacionComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    InstalacionRoutingModule,
    FormsModule,
    NgxExtendedPdfViewerModule

  ]
})

export class InstalacionModule { }
