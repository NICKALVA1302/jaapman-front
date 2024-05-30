import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {

  }
  //Verificación de variables locales
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const token = localStorage.getItem('token')
    const id_usuario_rol = localStorage.getItem('id_usuario_rol')
    const id_rol = localStorage.getItem('id_rol')


    if(token == undefined || id_rol == undefined || id_usuario_rol == undefined) {
      this.router.navigate(['/login'])
      return false
    }
    
     return true;
  }


  
}