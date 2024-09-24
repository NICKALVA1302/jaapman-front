import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../../../../enviroments/enviroments';
import { Observable, map } from 'rxjs';
import { Usuxlocalidad } from '../models/suspender';
import { Localidad } from '../../materiales/models/localidades';


@Injectable({
  providedIn: 'root'
})
export class SuspenderService {
  private myAppUrl: string;
  private myApiURL: string;
  private myApiUrlPresi: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = enviroment.endpoint;
    this.myApiURL = 'api/login/',
    this.myApiUrlPresi = 'api/presidente';
  }

   // Método para obtener el listado de usuarios
   getListadoUsuarios(): Observable<Usuxlocalidad[]> {
    return this.http.get<Usuxlocalidad[]>(`${this.myAppUrl}${this.myApiUrlPresi}/listadoUsuario`);
  }

  // Método para obtener los datos de localidades por usuario en mantenimiento
  getDatosPorLocalidad(id_localidad: number): Observable<Usuxlocalidad[]> {
    return this.http.post<Usuxlocalidad[]>(`${this.myAppUrl}${this.myApiUrlPresi}/localidadXusuario`, { id_localidad });
  }

  // Método para suspender usuario
  suspenderUsuario(idUsuario: number): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrlPresi}/suspenderUsuario`, { id_usuario: idUsuario });
  }

  // obtener localidades
  obtenerLocalidades(): Observable<Localidad[]> {
    return this.http.get<Localidad[]>(`${this.myAppUrl}${this.myApiURL}obtencion/localidadesRegister`);
  }

}
