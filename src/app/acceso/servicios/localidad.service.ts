import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { enviroment } from '../../enviroments/enviroments';
import { Localidad } from '../interfaces/localidad';

@Injectable({
  providedIn: 'root'
})
export class LocalidadService {
  private myAppUrl: string;
  private myApiURL: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = enviroment.endpoint;
    this.myApiURL = 'api/login/'
   }
   //Llamada a la funcion obtenerLocalidades en el usuario-controlador del back end.
   obtenerLocalidades(): Observable<Localidad[]> {
    return this.http.get<Localidad[]>(`${this.myAppUrl}${this.myApiURL}obtencion/localidadesRegister`);
  }
}
