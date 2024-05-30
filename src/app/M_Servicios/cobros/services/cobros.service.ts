import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../../../enviroments/enviroments';
import { Observable } from 'rxjs';
import { DatosPorLocalidad, Localidad, TipoPago } from '../models/localidades';

@Injectable({
  providedIn: 'root'
})
export class CobrosService {
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

  //Funcion para obtener los tipos de pago
  getTipoPago():Observable<TipoPago[]>{
    return this.http.get<TipoPago[]>(`${this.myAppUrl}${this.myApiURLCajero}/tipoPago`);
  }

  //Crear registro nuevo en PlanillaDetalle
  nuevoRegistroPlanillaDet():Observable<any>{
    return this.http.get<any>(`${this.myAppUrl}${this.myApiURLCajero}/PlanillaDet`);

  }

  //Pagos
  registroPago(datosAbono: any):Observable<any>{
    return this.http.get<any>(`${this.myAppUrl}${this.myApiURLCajero}/Pago`, datosAbono);
  }


  //ObtenerEstadoPago
  obtenerEstadPago(): Observable<any>{
    return this.http.get<any>(`${this.myAppUrl}${this.myApiURLCajero}/EstadoPago`);
  }
}
