import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../../../../enviroments/enviroments';
import { Usuaxlocalidad } from '../models/inscribir-cliente';
import { Observable } from 'rxjs';
import { Localidad } from '../../materiales/models/localidades';

@Injectable({
  providedIn: 'root'
})
export class InscribirClienteService {

  private myAppUrl: string;
  private myApiURL: string;
  private myApiUrlPresi: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = enviroment.endpoint;
    this.myApiURL = 'api/login/',
    this.myApiUrlPresi = 'api/presidente';
  }

   // Método para obtener el listado de usuarios
   getListadoUsuarios(): Observable<Usuaxlocalidad[]> {
    return this.http.get<Usuaxlocalidad[]>(`${this.myAppUrl}${this.myApiUrlPresi}/listadoUsuario`);
  }

  // Método para obtener los datos de localidades por usuario en mantenimiento
  getDatosPorLocalidad(id_localidad: number): Observable<Usuaxlocalidad[]> {
    return this.http.post<Usuaxlocalidad[]>(`${this.myAppUrl}${this.myApiUrlPresi}/UsuXAlcantarillado`, { id_localidad });
  }

  // Método para suspender usuario
  inscribirCliente(idUsuario: number): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrlPresi}/inscribirCliente`, { id_usuario: idUsuario });
  }

  // obtener localidades
  obtenerLocalidades(): Observable<Localidad[]> {
    return this.http.get<Localidad[]>(`${this.myAppUrl}${this.myApiURL}obtencion/localidadesRegister`);
  }

}