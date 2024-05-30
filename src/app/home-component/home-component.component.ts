import { Component } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { Router } from '@angular/router'; 
import { login } from '../interfaces/login';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../servicios/error.service';
import { RolesService } from '../servicios/roles.service';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.scss']
})
export class HomeComponentComponent {
  id_usuario: number = 0;
  username: string = '';
  password: string = '';
  selectedRole: string = '';
  roles: string[] = [];
  showRoleSelection: boolean = false;
  token : string = ''
  authenticated: boolean = false;
  loading: boolean = false;
  constructor(private _authService: AuthService, private router: Router, private _errorService : ErrorService, private _rolesService: RolesService) { }

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
          this.authenticated = true;
          this.obtenerRoles(response.id_usuario);
        } else {
          this.obtenerRoles(response.id_usuario);
          console.log('Error de inicio de sesión: ' + response.message);
          this.loading = false;
        }
      },
      error: (e: HttpErrorResponse) =>{
        this._errorService.msjError(e);
        this.loading = false;
      }
    });
  }
  
  obtenerRoles(idUsuario: string): void {
    this._rolesService.obtenerRolesBE(idUsuario).subscribe({
      next: (rolesResponse: any) => {
        this.roles = rolesResponse.roles || [];

        console.log('showRoleSelection:', this.showRoleSelection);
        if (this.roles.length === 1) {
          this.router.navigate(['/menu', this.roles[0].toLowerCase()]);
        } else if (this.roles.length > 1) {
          this.showRoleSelection = true;
        } else {
          console.warn('El usuario no tiene roles asignados.');
        }
  
        this.loading = false;
      },
      error: (rolesError: HttpErrorResponse) => {
        console.error('Error al obtener roles:', rolesError);
        this._errorService.msjError(rolesError);
        this.loading = false;
      }
    });
}
  
  selectRole(): void {
    if (this.selectedRole) {
      console.log('Rol seleccionado:', this.selectedRole);
      this.showRoleSelection = false; 
      this.router.navigate(['/menu', this.selectedRole.toLowerCase()]);
    }
  }
}
