import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../utils/auth.guard';
import { ViewRepCarteraComponent } from './pages/view-rep-cartera/view-rep-cartera.component';
import { ViewReporteCVComponent } from './components/view-reporte-cv/view-reporte-cv.component';
import { CommonModule } from '@angular/common';



//Rutas hijas de modulo cobros
const routes: Routes = [
  { path: '', component: ViewReporteCVComponent },
  // Otras rutas si las hay...
];

@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule  ],
})
  export class CarteraRoutingModule { }