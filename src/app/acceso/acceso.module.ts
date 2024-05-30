import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponentComponent } from './componentes/login-component/login-component.component';
import { CambioClaveComponentComponent } from './componentes/cambio-clave-component/cambio-clave-component.component';
import { RegistrarComponentComponent } from './componentes/registrar-component/registrar-component.component';
import { ReestablecerComponentComponent } from './componentes/reestablecer-component/reestablecer-component.component';
import { OtpComponentComponent } from './componentes/otp-component/otp-component.component';
import { AccesoRoutingModule } from './acceso-routing.module';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SpinnerComponent } from '../shared/spinner/spinner.component'
import { OnlyNumbersDirective } from './directivas/only-numbers.directive';
import { OnlyLettersDirective } from './directivas/only-letters.directive';

@NgModule({
  declarations: [
    LoginComponentComponent,
    CambioClaveComponentComponent,
    OtpComponentComponent,
    ReestablecerComponentComponent,
    RegistrarComponentComponent,
    SpinnerComponent,
    OnlyNumbersDirective,
    OnlyLettersDirective
  ],
  imports: [
    CommonModule,
    AccesoRoutingModule,
    FormsModule,
    RouterLink
  ],
  exports: [
    SpinnerComponent
  ]
})
export class AccesoModule { }
