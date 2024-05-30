import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponentComponent } from './componentes/login-component/login-component.component';
import { CambioClaveComponentComponent } from './componentes/cambio-clave-component/cambio-clave-component.component';
import { RegistrarComponentComponent } from './componentes/registrar-component/registrar-component.component';
import { ReestablecerComponentComponent } from './componentes/reestablecer-component/reestablecer-component.component';
import { OtpComponentComponent } from './componentes/otp-component/otp-component.component';
import { AuthGuardReestablecer } from '../utils/auth.guard.register';



const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: LoginComponentComponent},
      { path: 'registrar', component: RegistrarComponentComponent},
      { path: 'reestablecer', component: ReestablecerComponentComponent},
      { path: 'otp', component: OtpComponentComponent, canActivate: [AuthGuardReestablecer]},
      { path: 'cambio-clave/:idLogin', component:CambioClaveComponentComponent, canActivate: [AuthGuardReestablecer]},
    ]
  }
]
  

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AccesoRoutingModule { }
