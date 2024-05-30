import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../../../enviroments/enviroments';
import { Observable } from 'rxjs';
import { DatosPorLocalidad, Localidad } from '../models/localidades';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private myAppUrl: string;
  private myApiURL: string;
  private myApiURLCajero: string;
  constructor(private http: HttpClient) {
    this.myAppUrl = enviroment.endpoint;
    this.myApiURL = 'api/login/',
      this.myApiURLCajero = 'api/cajero'
  }

  //Llamada a la funcion obtenerLocalidades en el usuario-controlador del back end.
  obtenerLocalidades(): Observable<Localidad[]> {
    return this.http.get<Localidad[]>(`${this.myAppUrl}${this.myApiURL}obtencion/localidadesRegister`);
  }

  //Funcion para obtener los datos del cliente por cada localidad 
  getDatosPorLocalidad(id_localidad: number): Observable<DatosPorLocalidad[]> {
    return this.http.post<DatosPorLocalidad[]>(`${this.myAppUrl}${this.myApiURLCajero}/locxUsu`, { id_localidad });
  }
}
