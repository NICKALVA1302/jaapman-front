import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from '../../services/error.service';
import { MaterialService } from '../../services/material.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.component.html',
  styleUrl: './cambiar-clave.component.css'
})
export class CambiarClaveComponent {
  loading: boolean = false;
  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  hideCurrentPassword: boolean = true;

  constructor(
    private materialService: MaterialService,
    private toastr: ToastrService, 
    private _errorService: ErrorService) {

  }

  // Métodos para mostrar u ocultar la contraseña
  toggleCurrentPasswordVisibility() {
    this.hideCurrentPassword = !this.hideCurrentPassword;
  }
  toggleNewPasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  // TODO: Desactivar el boton de cambiar contraseña si los campos estan vacios
  get isFormValid(): boolean {
    const isValidnewPassword = this.validatePassword(this.newPassword);
    const isValidConfirmNewPassword=this.newPassword === this.confirmNewPassword;
    return this.currentPassword !== '' && 
    this.newPassword !== '' && 
    this.confirmNewPassword !== '' && isValidnewPassword === true && isValidConfirmNewPassword === true;
  }

    // Método para validar la contraseña
    validatePassword(password: string): boolean {
      // Verifica si la contraseña cumple con los requisitos
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      return password.length >= minLength && hasUpperCase && hasNumber;
      
      
    }

  // Método para cambiar la contraseña
  changePassword() {
    const id_user_rol:any = localStorage.getItem('id_usuario_rol');
    const id_rol:any = localStorage.getItem('id_rol');
    // Verifica si las claves coinciden
    if (this.newPassword !== this.confirmNewPassword) {
      this.toastr.error("Las claves no coinciden, verifique.");
      
      return;
    }

      const actualizarPassword = {
        id_rol_usuario: id_user_rol,
        id_rol: id_rol,
        actualClave: this.currentPassword,
        nuevaClave: this.newPassword
      };

      this.loading = true;
      // Llama al servicio para actualizar la contraseña
      this.materialService.changePassword(actualizarPassword).subscribe({
        next: () => {
          this.toastr.success("Contraseña actualizada correctamente");
          // Limpia los campos
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmNewPassword = '';
          this.loading = false;
        },
        error: (error:HttpErrorResponse)=> {
          this._errorService.msjError(error);
          this.loading = false;
          
          this.hidePassword = true;
          this.hideConfirmPassword = true;
          this.hideCurrentPassword = true;
        }
        
      });

    
  }
}
