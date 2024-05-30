import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../../../enviroments/enviroments';
import { Localidad } from '../models/localidades';

export interface ClienteSuspendido {
  Nombre: string;
  Apellido: string;
  Cedula: string;
  Localidad: string;
  Direccion: string;
  Telefono: string;
}

@Injectable({
  providedIn: 'root'
})
export class SuspendidosService {
  private myAppUrl: string;
  private myApiURL: string;
  private myApiURLCajero: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = enviroment.endpoint;
    this.myApiURL = 'api/login/';
    this.myApiURLCajero = 'api/cajero';
  }

  obtenerClientesSuspendidos(id_localidad: number): Observable<ClienteSuspendido[]> {
    return this.http.post<ClienteSuspendido[]>(`${this.myAppUrl}${this.myApiURLCajero}/getclientesSusp`, { id_localidad });
  }

   // Llamada a la función obtenerLocalidades en el usuario-controlador del backend.
   obtenerLocalidades(): Observable<Localidad[]> {
    return this.http.get<Localidad[]>(`${this.myAppUrl}${this.myApiURL}obtencion/localidadesRegister`);
  }
}
