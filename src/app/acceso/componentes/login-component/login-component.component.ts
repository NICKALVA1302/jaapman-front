import { Component } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router'; 
import { login } from '../../interfaces/login';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../servicios/error.service';
import { RolesService } from '../../servicios/roles.service';
import { OnlyNumbersDirective } from '../../directivas/only-numbers.directive';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.scss']
})
export class LoginComponentComponent {
  id_usuario: string = '';
  username: string = '';
  password: string = '';
  selectedRole: string = '';
  roles: string[] = [];
  showRoleSelection: boolean = false;
  token : string = '';
  authenticated: boolean = false;
  loading: boolean = false;
  constructor(private _authService: AuthService, private router: Router, private _errorService : ErrorService, private _rolesService: RolesService) { }

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

  //La función para el logeo de usuario.
  login(): void {
    if (this.username == '' || this.password == ''){
      return;
    }
    
    const user: login = {
      usuario: this.username,
      clave: this.password
    };
    this.loading = true;
  
    this._authService.login(user).subscribe({
      next: (response: any) => {
        
        if (response.success) {
          this.generarToken();
          this.obtenerRoles(response.id_usuario);
          this.id_usuario = response.id_usuario;
        } else {
          this.generarToken();
          this.obtenerRoles(response.id_usuario);
          this.id_usuario = response.id_usuario;
        }
      },
      error: (e: HttpErrorResponse) =>{
        this._errorService.msjError(e);
        this.loading = false;
      }
    });
  }


// Obtención de roles basado en el idUsuario obtenido en el login anteriormente
obtenerRoles(idUsuario: string): void {
  // Llamada al servicio RolesService para obtener los roles del usuario
  this._rolesService.obtenerRolesBE(idUsuario).subscribe({
    next: (rolesResponse: any) => {
      // Almacenar los roles obtenidos en la propiedad 'roles'
      this.roles = rolesResponse.roles || [];

      // Si solo existe un rol, redirigir al menú correspondiente
      if (this.roles.length === 1) {
        this._errorService.msjSuccess({ success: { msg: "Acceso correcto, bienvenido"} });
        // Obtener el primer rol de la lista como el rol seleccionado
        const selectedRole = this.roles[0].toLowerCase();
        // Mapear el rol seleccionado al id_rol correspondiente
        const rolesMap: { [key: string]: string } = {
          'usuario': '5',
          'operador': '3',
          'presidente': '2',
          'cajero':'4'
        };
        const selectedRoleId = rolesMap[selectedRole];
        // Llamar al servicio para obtener el id_usuario_rol
        this._authService.getIdRolUsuario(idUsuario, parseInt(selectedRoleId)).subscribe({
          next: (response: any) => {
            console.log(response);
            // Almacenar el id_rol_usuario en el localStorage
            localStorage.setItem('id_rol', selectedRoleId);
            localStorage.setItem('id_usuario_rol', response.id_usuario_rol);
            // Redirigir al menú correspondiente
            this.router.navigate(['/menu', selectedRole]);
          },
          error: (error: any) => {
            console.error('Error al obtener el id_usuario_rol:', error);
          }
        });
      } else if (this.roles.length > 1) {
        // Si hay más de un rol, permitir al usuario elegir
        this._errorService.msjSuccess({ success: { msg: "Acceso correcto, por favor elija un rol."} });
        this.showRoleSelection = true;
      } else {
        // Si no hay roles asignados, mostrar un mensaje de advertencia
        console.warn('El usuario no tiene roles asignados.');
      }

      this.loading = false; // Marcar la carga como completada
    },
    error: (rolesError: HttpErrorResponse) => {
      console.error('Error al obtener roles:', rolesError);
      this._errorService.msjError(rolesError);
      this.loading = false; // Marcar la carga como completada en caso de error
    }
  });
}
  
  //Selección de roles en caso de existir mas de un rol para una persona.
  selectRole(): void {
    this.loading = true;
    if (this.selectedRole) {
      const rolesMap: { [key: string]: string } = {
        'usuario': '5',
        'operador': '3',
        'presidente': '2',
        'cajero':'4'
      };
  
      const selectedRoleId = rolesMap[this.selectedRole.toLowerCase()];
      
      if (selectedRoleId) {
        localStorage.setItem('id_rol', selectedRoleId);
        
        // Llamar al servicio para obtener el id_usuario_rol
        this._authService.getIdRolUsuario(this.id_usuario, parseInt(selectedRoleId)).subscribe({
          next: (response: any) => {
            this.loading = false;
            localStorage.setItem('id_usuario_rol', response.id_usuario_rol);
            this.showRoleSelection = false;
            const nombreRol = this.selectedRole.toLowerCase();
            console.log(nombreRol);
            
            if (nombreRol === 'operador') {
              this.router.navigate(['/operador/consumo-agua']);

            } else if (nombreRol === 'presidente') {
              this.router.navigate(['/presidente/materiales']) 
            } else if(nombreRol === 'cajero'){
              this.router.navigate(['/cajero/cobros'])
            }else{
              this.router.navigate(['/menu', this.selectedRole.toLowerCase()]);
            }
            
          },
          error: (error: any) => {
            this.loading = false;
            console.error('Error al obtener el id_usuario_rol:', error);
          }
        });
      } else {
        console.error('Rol no reconocido:', this.selectedRole);
      }
    }
  }
}