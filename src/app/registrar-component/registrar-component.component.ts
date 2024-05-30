import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnlyNumbersDirective } from '../directivas/only-numbers.directive';
import emailjs from 'emailjs-com';
import { v4 as uuidv4 } from 'uuid';
import { persona } from '../interfaces/persona';
import { AuthService } from '../servicios/auth.service';
import { login } from '../interfaces/login';
import { Router } from '@angular/router';
import { LocalidadService } from '../servicios/localidad.service';
import { usuario } from '../interfaces/usuario';
import { Localidad } from '../interfaces/localidad';

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

  mensajeRegistroExitoso: string = '';
  mostrarMensajeRegistro: boolean = false;
  registroHabilitado: boolean = true;
  selectedLocalidad: string = '';

  localidades: Localidad[] = [];
  constructor(private http: HttpClient, private authService: AuthService, private router: Router, private LocalidadService: LocalidadService) {}

  ngOnInit(){
    this.obtenerLocalidades();
  }

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



  registrar(): void {
    if (!this.camposCompletos() || this.password !== this.confirmarPassword) {
      console.error('Por favor, complete todos los campos correctamente.');
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

    this.authService.registrarUsuario(nuevoUsuario, loginInfo, localidadInfo).subscribe(
      (response: any) => {
        console.log('Respuesta del servidor:', response);
    
        if (response) {
          if (response.msg === 'Usuario creado.') {
            this.mensajeRegistroExitoso = 'Usuario registrado exitosamente';
            this.mostrarMensajeRegistro = true;
            this.enviarCorreoDeVerificacion(this.email, this.nombre, this.cedula);
            setTimeout(() => {
              this.mostrarMensajeRegistro = false;
              this.router.navigateByUrl('/');
            }, 2000);
          } else {
            console.error('Error al registrar usuario:', response.msg || 'Mensaje de error no proporcionado por el servidor.');
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

  camposCompletos(): String {
    return (
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
  
  enviarCorreoDeVerificacion(correo: string, nombre: string, usuario: string): void {
    this.authService.obtenerToken(usuario).subscribe(
      (response: any) => {
        const token = response.token;
        emailjs.init("yIBKDlhop9O6soM8z");
  
        const enlaceVerificacion = `http://localhost:3000/api/verificacion/activacion?token=${token}`;
  
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
  
  volver(): void {
    this.router.navigate(['/']);
}

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
}


