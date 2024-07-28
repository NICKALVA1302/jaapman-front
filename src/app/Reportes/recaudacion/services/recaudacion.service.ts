import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../../../enviroments/enviroments';
import { Localidad } from '../models/localidades';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecaudacionService {
  private myAppUrl: string;
  private myApiURL: string;
  private myApiURLCajero: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = enviroment.endpoint;
    this.myApiURL = 'api/login/';
    this.myApiURLCajero = 'api/cajero';
  }
  
  
  // Llamada a la función obtenerLocalidades en el usuario-controlador del backend.
  obtenerLocalidades(): Observable<Localidad[]> {
    return this.http.get<Localidad[]>(`${this.myAppUrl}${this.myApiURL}obtencion/localidadesRegister`);
  }
}
