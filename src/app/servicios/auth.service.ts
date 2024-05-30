import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Environment } from '@angular/compiler-cli/src/ngtsc/typecheck/src/environment';
import { enviroment } from '../enviroments/enviroments';
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
    private myApiURLRegister: string;
    private myApiURLVerificacion: string;
    private myApiURLToken: string;

    constructor(private http: HttpClient) {
        this.myAppUrl = enviroment.endpoint;
        this.myApiURL = 'api/acceso/'
        this.myApiURLRegister = 'api/'
        this.myApiURLVerificacion = 'api/verificacion/'
        this.myApiURLToken = 'api/obtencion/'


     }

    login(user: login): Observable<string> {
        return this.http.post<string>(`${this.myAppUrl}${this.myApiURL}login`, user);
    }

    registrarUsuario(user: persona, loginInfo: login, localidadInfo: Localidad): Observable<string> {
        const body = { ...user, ...loginInfo, ...localidadInfo};
          const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<string>(`${this.myAppUrl}${this.myApiURLRegister}usuario`, body,  { headers });
      }

      
      verificarCedula(cedula: string): Observable<string> {
        if (!cedula) {
          return throwError('La cédula no es válida');
        }
      
        const body = { cedula };
        return this.http.post<string>(`${this.myAppUrl}${this.myApiURLVerificacion}cedula`, body);
      }

      obtenerToken(usuario: string): Observable<string> {
        const body = { usuario };
        return this.http.post<string>(`${this.myAppUrl}${this.myApiURLToken}token`, body);
      }
}