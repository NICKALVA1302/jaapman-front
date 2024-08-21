import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroments';
import { Mantenimeinto } from '../../../M_Servicios/materiales/models/mantenimiento';
import { Localidad } from '../../deudas-pueblo/models/localidades';

@Injectable({
  providedIn: 'root',
})
export class TipoIngresoService {
  private myAppUrl: string;
  private myApiURL: string;
  private myApiURLCajero: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = enviroment.endpoint;
    (this.myApiURL = 'api/login/'), (this.myApiURLCajero = 'api/cajero');
  }
  obtenerLocalidades(): Observable<Localidad[]> {
    return this.http.get<Localidad[]>(
      `${this.myAppUrl}${this.myApiURL}obtencion/localidadesRegister`
    );
  }
  getDatosMantenimiento(localidad: string): Observable<Mantenimeinto[]> {
    return this.http.post<Mantenimeinto[]>(
      `${this.myAppUrl}${this.myApiURLCajero}/getrecudacionMante`,
      { localidad }
    );
  }
  getDatosAlcantarillado(localidad: string): Observable<Mantenimeinto[]> {
    return this.http.post<Mantenimeinto[]>(
      `${this.myAppUrl}${this.myApiURLCajero}/getrecudacionAlca`,
      { localidad }
    );
  }
}
