import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Environment } from '@angular/compiler-cli/src/ngtsc/typecheck/src/environment';
import { enviroment } from '../../enviroments/enviroments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { login } from '../interfaces/login';
import { persona } from '../interfaces/persona';
import { Localidad } from '../interfaces/localidad';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private myAppUrl: string;
    private myApiURL: string;
    private idLoginFromAuth: number | null = null;

    constructor(private http: HttpClient) {
        this.myAppUrl = enviroment.endpoint;
        this.myApiURL = 'api/login/'

     }
    //Llamada de la función login en el usuario-controlador al back end.
    login(user: login): Observable<string> {
        return this.http.post<string>(`${this.myAppUrl}${this.myApiURL}acceso/login`, user);
    }

    //Llamada de la función registrarUsuario en el usuario-controlador al back end.
    registrarUsuario(user: persona, loginInfo: login, localidadInfo: Localidad): Observable<string> {
        const body = { ...user, ...loginInfo, ...localidadInfo};
          const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<string>(`${this.myAppUrl}${this.myApiURL}acceso/usuario`, body,  { headers });
      }

      //Llamada de la función verificarCedula en el usuario-controlador al back end.
      verificarCedula(cedula: string): Observable<string> {
        if (!cedula) {
          return throwError('La cédula no es válida');
        }
        const body = { cedula };
        return this.http.post<string>(`${this.myAppUrl}${this.myApiURL}verificacion/cedula`, body);
      }

      //Llamada de la función obtenerToken en el usuario-controlador al back end.
      obtenerToken(usuario: string): Observable<string> {
        const body = { usuario };
        return this.http.post<string>(`${this.myAppUrl}${this.myApiURL}obtencionT/token`, body);
      }

      //Llamada de la función verificarCorreo en el usuario-controlador al back end.
      verificarCorreo(correo: string): Observable<string> {
        if (!correo) {
          return throwError('El correo no es válido');
        }
      
        const body = { correo };
        return this.http.post<string>(`${this.myAppUrl}${this.myApiURL}verificacion/correo`, body);
      }

      //Llamada de la función enviarOTP en el usuario-controlador al back end.
      enviarOTP(correo: string, otp: string): Observable<string> {
        if (!correo) {
          return throwError('El correo no es válido');
        }
      
        const body = { correo, otp};
        return this.http.post<string>(`${this.myAppUrl}${this.myApiURL}obtencionT/otp`, body);
      }

      //Llamada de la funcion verificarOTP en el usuario-controlador al back end.
      verificarOTP(otp: string): Observable<string>{
        if (!otp) {
          return throwError('El OTP no es válido');
        }
      
        const body = { otp};
        return this.http.post<string>(`${this.myAppUrl}${this.myApiURL}verificacion/otp`, body);
      }

      //Seteo de idLogin para reestablecer clave.
      setAuthenticatedId(idLogin: number): void {
        this.idLoginFromAuth = idLogin;
      }
      
      //Recuperada de idLogin para reestablecer clave del servicio (si existe).
      getAuthenticatedId(): number | null {
        return this.idLoginFromAuth;
      }

      //Llamada de la funcion actualizarClave en el usuario-controlador al back end.
      actualizarClave(idLoginFromAuth: string,nuevaClave: string): Observable<string>{
        if (!idLoginFromAuth) {
          return throwError('No se ha proporcionado usuario');
        }
      
        const body = { idLoginFromAuth, nuevaClave};
        return this.http.post<string>(`${this.myAppUrl}${this.myApiURL}actualizacion/clave`, body);
      }

      getIdRolUsuario(id_usuario: string, id_rol: number): Observable<any> {
        const url = `${this.myAppUrl}${this.myApiURL}obtener/rolesxUsuario`;
        const body = { id_usuario, id_rol };
        return this.http.post<any>(url, body).pipe(
          catchError(error => throwError('Error al obtener el id_rol_usuario'))
        );
      }
}