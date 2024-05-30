import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../../../../enviroments/enviroments';
import { Observable } from 'rxjs';
import { Localidad } from '../models/localidades';

export interface Cliente {
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
export class ListadoService {
  private myAppUrl: string;
  private myApiURL: string;
  private myApiURLCajero: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = enviroment.endpoint;
    this.myApiURL = 'api/login/';
    this.myApiURLCajero = 'api/cajero';
  }

  obtenerClientes(id_localidad: number): Observable<Cliente[]> {
    return this.http.post<Cliente[]>(`${this.myAppUrl}${this.myApiURLCajero}/getclientesLoc`, { id_localidad });
  }

   // Llamada a la función obtenerLocalidades en el usuario-controlador del backend.
   obtenerLocalidades(): Observable<Localidad[]> {
    return this.http.get<Localidad[]>(`${this.myAppUrl}${this.myApiURL}obtencion/localidadesRegister`);
  }
}

