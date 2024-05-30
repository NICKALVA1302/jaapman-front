import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../../../enviroments/enviroments';
import { Observable } from 'rxjs';
import { DatosPorLocalidad, Localidad, TipoPago } from '../models/localidades';
import { Instalacion } from '../models/instalacion';

interface ProximoNumeroResponse {
  ultimoNumeroInstalacion: number;
}

@Injectable({
  providedIn: 'root'
})
export class InstalacionService {
  private myAppUrl: string;
  private myApiURL: string;
  private myApiURLCajero: string;
  

  constructor(private http: HttpClient) {
    this.myAppUrl = enviroment.endpoint;
    this.myApiURL = 'api/login/',
    this.myApiURLCajero = 'api/cajero'
  }

  eliminarInstalacion(numeroInstalacion: number): Observable<any> {
    const url = `${this.myAppUrl}${this.myApiURLCajero}/eliminarInstalacion/${numeroInstalacion}`;
    return this.http.delete<any>(url);
  }
  
  
  editarInstalacion(instalacion: Instalacion): Observable<any> {
    const url = `${this.myAppUrl}${this.myApiURLCajero}/editarInstalacion`;
    return this.http.put<any>(url, instalacion);
  }
  // Función para obtener instalaciones por usuario
  getInstalacionesPorUsuario(id_usuario: number): Observable<Instalacion[]> {
    return this.http.post<Instalacion[]>(`${this.myAppUrl}${this.myApiURLCajero}/getInstxUsu`, { id_usuario });
  }

  getEstadoPagoLegible(idEstadoPago: number): string {
    switch (idEstadoPago) {
      case 1:
        return 'CANCELADO';
      case 2:
        return 'SALDO PENDIENTE';
      default:
        return 'Desconocido';
    }
  }

    // Agregar una nueva instalación
    agregarInstalacion(instalacionData: any): Observable<Instalacion> {
      return this.http.post<Instalacion>(`${this.myAppUrl}${this.myApiURLCajero}/agregar`, instalacionData);
    }
  
  obtenerProximoNumeroInstalacion(): Observable<ProximoNumeroResponse> {
    return this.http.get<ProximoNumeroResponse>(`${this.myAppUrl}${this.myApiURLCajero}/proximonumero`);
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
