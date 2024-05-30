import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../enviroments/enviroments';


@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private myAppUrl: string;
  private myApiURL: string;


    constructor(private http: HttpClient) {
      this.myAppUrl = enviroment.endpoint;
      this.myApiURL = 'api/login/'

     }

    //Llamada de la funcion obtenerRoles en el usuario-controlador al back end.
     obtenerRolesBE(idUsuario: string): Observable<string[]> {
      const body = { idUsuario: idUsuario };
      return this.http.post<string[]>(`${this.myAppUrl}${this.myApiURL}obtener/roles`, body);
    }
  }
