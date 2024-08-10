import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../../../enviroments/enviroments';
import { Localidad } from '../models/localidades';
import { Observable } from 'rxjs';

export interface RecaudacionAguaDia {
  localidad: string;
  fecha: Date;
  cliente: string;
  total_pago: string;
}

export interface RecaudacionAguaMensual{
  localidad: string;
  fecha: Date;
  recaudacion_total: string;
}

export interface RecaudacionAguaAnual{
  localidad: string;
  mes: string;
  recaudacion_total: string;
}
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
  
  // Conectar el endpoint
  obtenerReporteAguaporDia(fechaDia: String, localidad: number): Observable<RecaudacionAguaDia[]> {
    const body = {
      fechaDia,
      localidad
    };
    return this.http.post<RecaudacionAguaDia[]>(`${this.myAppUrl}${this.myApiURLCajero}/recaudacionAguaDia`, body);
  }

  obtenerReporteAguaporMes(fechaMes: String, localidad: number): Observable<RecaudacionAguaMensual[]> {
    const body = {
      fechaMes,
      localidad
    };
    return this.http.post<RecaudacionAguaMensual[]>(`${this.myAppUrl}${this.myApiURLCajero}/recaudacionAguaMes`, body);
  }

  obtenerReporteAguaporAnio(fechaAnio: String, localidad: number): Observable<RecaudacionAguaAnual[]> {
    const body = {
      fechaAnio,
      localidad
    };
    return this.http.post<RecaudacionAguaAnual[]>(`${this.myAppUrl}${this.myApiURLCajero}/recaudacionAguaAnio`, body);
  }
  // Llamada a la función obtenerLocalidades en el usuario-controlador del backend.
  obtenerLocalidades(): Observable<Localidad[]> {
    return this.http.get<Localidad[]>(`${this.myAppUrl}${this.myApiURL}obtencion/localidadesRegister`);
  }
}
