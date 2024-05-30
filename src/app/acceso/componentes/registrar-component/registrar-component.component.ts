import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnlyNumbersDirective } from '../../directivas/only-numbers.directive';
import { OnlyLettersDirective } from '../../directivas/only-letters.directive';
import emailjs from 'emailjs-com';
import { v4 as uuidv4 } from 'uuid';
import { persona } from '../../interfaces/persona';
import { AuthService } from '../../servicios/auth.service';
import { login } from '../../interfaces/login';
import { Router } from '@angular/router';
import { LocalidadService } from '../../servicios/localidad.service';
import { usuario } from '../../interfaces/usuario';
import { Localidad } from '../../interfaces/localidad';
import { ErrorService } from '../../servicios/error.service';

@Component({
  selector: 'app-registrar-component',
  templateUrl: './registrar-component.component.html',
  styleUrls: ['./registrar-component.component.scss'],

})

export class RegistrarComponentComponent {
  cedula: string = '';
  direccion: string = '';
  telefono: string = '';
  genero: string = '';
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  password: string = '';
  confirmarPassword: string = '';
  localidad: string = '';

  cedulaEnabled = false;
  mensajeCedula: string = '';
  correoInputHabilitado = false;
  mensajeRegistroExitoso: string = '';
  mostrarMensajeRegistro: boolean = false;
  registroHabilitado: boolean = true;
  selectedLocalidad: string = '';
  mensajeCorreo: string = '';

  botonHabilitado: boolean = false;
  localidades: Localidad[] = [];
  constructor(private http: HttpClient, private authService: AuthService, private router: Router, private LocalidadService: LocalidadService, private _errorService: ErrorService) {}

  //Inicialmente se obtienen las localidades de la BD.
  ngOnInit(){
    this.obtenerLocalidades();
  }

  //Verifica si la cédula existe en la bd, si ya existe manda error, sino, puede proceder.
  habilitarCampos() {
    this.authService.verificarCedula(this.cedula).subscribe(
      (response: any) => {
        if (response.success) {
          if (!response.cedulaExists) {
            this.cedulaEnabled = true;
            this.mensajeCedula = 'Cédula válida. Puede continuar con el registro.';
          } else {
            this.cedulaEnabled = false;
            this.mensajeCedula = 'Ya existe un usuario con esta cédula. No se puede registrar.';
          }
        } else {
          this.cedulaEnabled = true;
          this.mensajeCedula = 'Cédula no encontrada en la base de datos. Puede continuar.';
        }
      },
      (error) => {
        console.error('Error al verificar la cédula:', error);
      }
    );
  }

  //Verifica si el correo existe en la bd, si ya existe manda error, sino, puede proceder.
  habilitarBoton() {
    this.authService.verificarCorreo(this.email).subscribe(
      (response: any) => {
        if (response.success) {
          if (response.correoExists) {
            this.correoInputHabilitado = false;
            this.mensajeCorreo = 'Correo ya existente. Por favor, reintente.';
          } else {
            this.correoInputHabilitado = true;
            this.mensajeCorreo = 'Correo no encontrado en la base de datos, puede continuar.';
          }
        } else {
          this.correoInputHabilitado = true;
          this.mensajeCorreo = 'Error al verificar el correo.';
        }
      },
      (error) => {
        console.error('Error al verificar el correo:', error);
      }
    );
  }
  
  //Función general para el registro
  registrar(): void {
    if (!this.camposCompletos() || this.password !== this.confirmarPassword) {
      this._errorService.msjErrorNuevo({ error: { msg: "Las claves no coinciden, verifique." } });

      return;
    }
    this.registroHabilitado = false;

    const nuevoUsuario: persona = {
      cedula: this.cedula,
      nombre: this.nombre,
      apellido: this.apellido,
      direccion: this.direccion,
      telefono: this.telefono,
      genero: this.genero,
      email: this.email,
    };

    const localidadInfo: Localidad = {
      id_localidad: Number(this.selectedLocalidad),
      id_estado: 0,
      nombre: this.nombre,
      descripcion: ''
    };
    
    console.log("selectedLocalidad:", this.selectedLocalidad);
    console.log("localidadInfo:", localidadInfo);



    const loginInfo: login = {
      usuario: this.cedula.toString(), 
      clave: this.password,
    };

    console.log("Datos a enviar:", { nuevoUsuario, loginInfo, localidadInfo });
    //Llamada al servicio con toda la información del usuario a registrar en las tablas de la BD.
    this.authService.registrarUsuario(nuevoUsuario, loginInfo, localidadInfo).subscribe(
      (response: any) => {
        console.log('Respuesta del servidor:', response);
    
        if (response) {
          if (response.msg === 'Usuario creado.') {
            this._errorService.msjSuccess({ success: { msg: "Usuario registrado exitosamente, por favor verifíquese con el enlace enviado a su correo electrónico" } });
            this.enviarCorreoDeVerificacion(this.email, this.nombre, this.cedula);
            setTimeout(() => {
              this.mostrarMensajeRegistro = false;
              this.router.navigateByUrl('/');
            }, 3000);
          } else {
            console.error('Error al registrar usuario:', response.msg || 'Mensaje de error no proporcionado por el servidor.');
            this._errorService.msjErrorNuevo({ error: { msg: "Error al registrar el usuario" } });
            this.registroHabilitado = true;
          }
        } else {
          console.error('Respuesta del servidor indefinida.');
          this.registroHabilitado = true;
        }
      },
      (error) => {
        console.error('Error al comunicarse con el servidor:', error);
        this.registroHabilitado = true;
      }
    );
  }

  //Verifica si los campos están completos.
  camposCompletos(): boolean {
    return !!(
      this.cedula &&
      this.nombre &&
      this.apellido &&
      this.direccion &&
      this.telefono &&
      this.genero &&
      this.email &&
      this.password &&
      this.confirmarPassword
    );
  }
  
  //Envió del correo electrónico con el enlace de verificación si el registro es correcto.
  enviarCorreoDeVerificacion(correo: string, nombre: string, usuario: string): void {
    //Recuperar el token del usuario mediante el servicio (Llamada al backend).
    this.authService.obtenerToken(usuario).subscribe(
      (response: any) => {
        const token = response.token;
        emailjs.init("yIBKDlhop9O6soM8z");
  
        const enlaceVerificacion = `http://localhost:3000/api/login/verificacion/activacion?token=${token}`;
  
        const params = {
          to: correo,
          to_name: nombre,
          message: `¡Bienvenido! 🎉 Tu cuenta ha sido registrada. Por favor, verifica tu cuenta haciendo clic en el siguiente enlace: ${enlaceVerificacion}`
        };
  
        const serviceID = "service_ysds53s";
        const templateID = "template_eh0zvbw";
  
        emailjs.send(serviceID, templateID, params)
          .then(res => {
            console.log("Correo de verificación enviado con éxito:", res);
          })
          .catch(error => {
            console.error("Error al enviar el correo de verificación:", error);
          });
      },
      (error) => {
        console.error("Error al obtener el token:", error);
      }
    );
  }
  
  //Función para volver al inicio de sesión
  volver(): void {
    this.router.navigate(['/']);
}

//Función para obtener las localidades de la base de datos.
obtenerLocalidades(): void {
  this.LocalidadService.obtenerLocalidades().subscribe(
    (localidades: Localidad[]) => {
      this.localidades = localidades;
      console.log(localidades);
    },
    (error: any) => {
      console.error('Error al obtener localidades:', error);
    }
  );
}



  //Verifica si el correo tiene @domain.com
  esCorreoValido(correo: string): boolean {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexCorreo.test(correo);
  }

}


