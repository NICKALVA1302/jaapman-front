import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Localidad } from '../models/localidades';
import { enviroment } from '../../../enviroments/enviroments';

export interface CarteraMensual {
  localidad: string;
  anio: number;
  mes: number;
  fecha: Date;
  total_con_descuento: number;
  total_sin_descuento: number;
  total_facturado: number;
  total_por_facturar: number;
  tipo_de_servicio: string;
}

export interface GeneralCarteraVA {
  anio: number;
  mes: number;
  total_con_descuento: number;
  total_sin_descuento: number;
  total_facturado: number;
  total_por_facturar: number;
  tipo_de_servicio: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarteraVencidaService {
  private myAppUrl: string;
  private myApiURL: string;
  private myApiURLCajero: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = enviroment.endpoint;
    this.myApiURL = 'api/login/';
    this.myApiURLCajero = 'api/cajero';
  }

  obtenerCarteraMensual(tipo_servicio: string, fecha_inicio: string, fecha_fin: string, localidad: string | undefined): Observable<CarteraMensual[]> {
    const body = {
      tipo_servicio,
      fecha_inicio,
      fecha_fin,
      localidad
    };
    return this.http.post<CarteraMensual[]>(`${this.myAppUrl}${this.myApiURLCajero}/getcarteraMensual`, body);
  }

  obtenerGeneralCarteraVA(tipo_servicio: string, fecha_inicio: Date, fecha_fin: Date): Observable<GeneralCarteraVA[]> {
    const body = {
      tipo_servicio,
      fecha_inicio,
      fecha_fin
    };
    return this.http.post<GeneralCarteraVA[]>(`${this.myAppUrl}${this.myApiURLCajero}/getGeneralCarteraVA`, body);
  }

  // Llamada a la función obtenerLocalidades en el usuario-controlador del backend.
  obtenerLocalidades(): Observable<Localidad[]> {
    return this.http.get<Localidad[]>(`${this.myAppUrl}${this.myApiURL}obtencion/localidadesRegister`);
  }
}
