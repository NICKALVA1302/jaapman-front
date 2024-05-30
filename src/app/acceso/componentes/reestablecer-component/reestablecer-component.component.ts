import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import emailjs from 'emailjs-com';
import { ErrorService } from '../../servicios/error.service';

@Component({
  selector: 'app-reestablecer-component',
  templateUrl: './reestablecer-component.component.html',
  styleUrl: './reestablecer-component.component.scss'
})
export class ReestablecerComponentComponent {
  mensajeCorreo: string = '';
  correo: string = '';
  correoEnabled = false;
  correoInputHabilitado = false;
  mensajeRegistroExitoso: string = '';
  mostrarMensajeRegistro: boolean = false;
  constructor(private http: HttpClient, private authService: AuthService, private router: Router, private _errorService: ErrorService) {}


  //Habilita el botón en caso de tener un correo valido, sino no.
  habilitarBoton() {
    this.authService.verificarCorreo(this.correo).subscribe(
      (response: any) => {
        if (response.success) {
          if (response.correoExists) {
            this.correoEnabled = true;
            this.correoInputHabilitado = true;
            this.mensajeCorreo = 'Correo validado. Puede continuar.';
          } else {
            this.correoEnabled = false;
            this.correoInputHabilitado = false;
            this.mensajeCorreo = 'Correo no encontrado en la base de datos.';
          }
        } else {
          this.correoEnabled = false;
          this.correoInputHabilitado = true;
          this.mensajeCorreo = 'Error al verificar el correo.';
        }
      },
      (error) => {
        console.error('Error al verificar el correo:', error);
      }
    );
  }

  //Verifica si el correo tiene @domain.com
  esCorreoValido(correo: string): boolean {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexCorreo.test(correo);
  }

  //Verifica si los campos están completos
  camposCompletos(): String {
    return (
      this.correo 
    );
  }
  
//Envía el OTP a la bd.
  enviarOTP() {  
    const otp = this.generarOTP();

    this.authService.enviarOTP(this.correo,otp).subscribe(
      (response) => {
        this._errorService.msjSuccess({ success: { msg: "El OTP fue enviado con éxito, revise su correo electrónico." } });
        console.log('OTP enviado al backend con éxito:', response);
  


        this.enviarCorreoDeVerificacion(this.correo, otp);
      },
      (error) => {
        console.error('Error al enviar OTP al backend:', error);
        this._errorService.msjErrorNuevo({ error: { msg: "Ocurrió un error al enviar el OTP, comunique a soporte." } });

      }
    );
  }

  //Genera el OTP que se va a enviar
  generarOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  //Envía el OTP al correo electrónico si es valido, sino manda error.
  enviarCorreoDeVerificacion(correo: string, otp: string): void {
    emailjs.init("yIBKDlhop9O6soM8z");
  
    const params = {
      to: correo,
      message: `Tu código de verificación es: ${otp}.`
    };
  
    const serviceID = "service_ysds53s";
    const templateID = "template_u1i87xa";
  
    emailjs.send(serviceID, templateID, params)
      .then(res => {
        console.log("Correo de verificación enviado con éxito:", res);
        this.generarToken();
        this.router.navigate(['/acceso/otp']);
      })
      .catch(error => {
        console.error("Error al enviar el correo de verificación:", error);
      });

}

generarToken(): string {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const longitud = 32;
  let token = '';

  for (let i = 0; i < longitud; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    token += caracteres.charAt(indice);
  }
  localStorage.setItem("token", token);
  return token;
}


//Función para volver al inicio de sesión.
  volver(): void {
    this.router.navigate(['/']);
}

}


