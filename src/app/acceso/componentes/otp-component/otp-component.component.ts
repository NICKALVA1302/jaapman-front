import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { ErrorService } from '../../servicios/error.service';

@Component({
  selector: 'app-otp-component',
  templateUrl: './otp-component.component.html',
  styleUrl: './otp-component.component.scss'
})
export class OtpComponentComponent {
  mensajeCorreo: string = '';
  otp: string = '';
  mensajeRegistroExitoso: string = '';
  mostrarMensajeRegistro: boolean = false;
  longitudOTPCorrecta: boolean = false;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router, private _errorService: ErrorService) {}

  habilitarBoton() {

  }

  //Verifica si los campos el HTML están completos
  camposCompletos(): String {
    return (
      this.otp 
    );
  }
  
  //Verifica si el OTP ingresado por el usuario existe en la bd
  verificarOTP(otp: string) {  
    this.authService.verificarOTP(otp).subscribe(
      (response: any) => {
        if (response.success) {
          if (response.otpExists) {
            const idLogin = response.id_login;
            if (idLogin) {
              this._errorService.msjSuccess({ success: { msg: "OTP verificado, por favor, espere." } });
              setTimeout(() => {
                this.authService.setAuthenticatedId(idLogin);
                this.router.navigate(['/acceso/cambio-clave', idLogin]);
              }, 3000);
            } else {
              console.error('Error: No se encontró id_login en la respuesta del backend.');
            }
          } else {
            this._errorService.msjErrorNuevo({ error: { msg: "El OTP no es correcto, por favor reintente" } });
          }
        } else {
          this.mostrarMensajeRegistro = true;
          this.mensajeRegistroExitoso = 'Error al verificar el OTP. Por favor, inténtelo de nuevo.';
          console.error('Error al verificar el OTP:', response.error);
        }
  
        setTimeout(() => {
          this.mostrarMensajeRegistro = false;
          this.mensajeRegistroExitoso = '';
        }, 3000);
      },
      (error) => {
        this.mostrarMensajeRegistro = true;
        this.mensajeRegistroExitoso = 'Error al verificar el OTP. Por favor, inténtelo de nuevo.';
        console.error('Error al verificar el OTP:', error);
  
        setTimeout(() => {
          this.mostrarMensajeRegistro = false;
          this.mensajeRegistroExitoso = '';
        }, 3000);
      }
    );
  }

  //Verifica que el OTP tenga solo números
  esOTPCorrecto(otp: string): boolean {
    const regexOTP = /^\d{6}$/;
    return regexOTP.test(otp);
  }

  //Verifica que el OTP solo tenga 6 dígitos numericos.
  verificarLongitudOTP() {
    this.longitudOTPCorrecta = this.otp.length === 6;
  }


}
