import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service'; 
import { ErrorService } from '../../servicios/error.service';

@Component({
  selector: 'app-cambio-clave-component',
  templateUrl: './cambio-clave-component.component.html',
  styleUrls: ['./cambio-clave-component.component.scss']
})
export class CambioClaveComponentComponent {
  nuevaClave: string = '';
  nuevaClaveVerify: string = '';
  idLoginFromUrl: string = ''; 

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private _errorService: ErrorService) {}

  //Verifica si hay un ID de login en el servicio.
  ngOnInit() {
    const snapshot = this.route.snapshot;

    if (snapshot && snapshot.paramMap) {
      const idLoginFromUrl = snapshot.paramMap.get('idLogin');
      
      if (idLoginFromUrl !== null && idLoginFromUrl !== undefined) {
        const idLogin = idLoginFromUrl.toString();  


        const idLoginFromAuth = this.authService.getAuthenticatedId();
        this.idLoginFromUrl = idLogin;  

        if (idLoginFromAuth === null || idLogin !== idLoginFromAuth.toString()) {
          this.router.navigate(['/acceso/login']);
        }
      } else {
      }
    } else {
    }
  }
 
  //Actualiza la clave si es que todo está correcto.
  actualizar() {
    if (this.nuevaClave !== this.nuevaClaveVerify) {
      this._errorService.msjErrorNuevo({ error: { msg: "Las claves no coinciden, verifique." } });
      return;
    }

    this.authService.actualizarClave(this.idLoginFromUrl, this.nuevaClave).subscribe(
      (response: any) => {
        if (response.success) {
          localStorage.removeItem('token');
          this._errorService.msjSuccess({ success: { msg: "Su clave fue actualizada con éxito, por favor inicie sesión" } });

          setTimeout(() => {
            this.router.navigate(['/login']);
        }, 3000);
        } else {
          console.error('Error al actualizar la contraseña:', response.error);
          this._errorService.msjErrorNuevo({ error: { msg: "Ocurrió un error al actualizar la clave." } });
        }
      },
      (error: any) => {
        console.error('Error al actualizar la contraseña:', error);
      }
    );
  }
}