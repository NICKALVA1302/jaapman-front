import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../../../enviroments/enviroments';
import { Observable } from 'rxjs';
import { Localidad } from '../models/localidades';

export interface ValoresMes {
  localidad: string;
  anio: number;
  mes: number;
  fecha: Date;
  cedula: string;
  cliente: string;
  direccion: string;
  telefono: string;
  correo: string;
  total: string;
  tipo_de_servicio: string;
}

@Injectable({
  providedIn: 'root'
})
export class ValoresMesService {
  private myAppUrl: string;
  private myApiURL: string;
  private myApiURLCajero: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = enviroment.endpoint;
    this.myApiURL = 'api/login/';
    this.myApiURLCajero = 'api/cajero';
  }
  
  // Conectar el endpoint de cartera vencida anual
  obtenerValoresxmes(tipo_servicio: string, fecha_inicio: String, fecha_fin: String, localidad: number): Observable<ValoresMes[]> {
    const body = {
      tipo_servicio,
      fecha_inicio,
      fecha_fin,
      localidad
    };
    return this.http.post<ValoresMes[]>(`${this.myAppUrl}${this.myApiURLCajero}/GeneradosxMes`, body);
  }

  // Llamada a la función obtenerLocalidades en el usuario-controlador del backend.
  obtenerLocalidades(): Observable<Localidad[]> {
    return this.http.get<Localidad[]>(`${this.myAppUrl}${this.myApiURL}obtencion/localidadesRegister`);
  }
  
}
