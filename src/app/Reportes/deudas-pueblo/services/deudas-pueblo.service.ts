import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../../../enviroments/enviroments';
import { Observable } from 'rxjs';
import { Localidad } from '../models/localidades';


@Injectable({
  providedIn: 'root'
})
export class DeudasPuebloService {

  private myAppUrl: string;
  private myApiURL: string;
  private myApiURLCajero: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = enviroment.endpoint;
    this.myApiURL = 'api/login/';
    this.myApiURLCajero = 'api/cajero';
  }

  obtenerLocalidades(): Observable<Localidad[]> {
    return this.http.get<Localidad[]>(
      `${this.myAppUrl}${this.myApiURL}obtencion/localidadesRegister`
    );
  }

  /* getDatosPorLocalidad(localidad: string): Observable<DeudaUsuario[]> {
    return this.http.post<DeudaUsuario[]>(
      `${this.myAppUrl}${this.myApiURLCajero}/getDeudaPueblo`,
      { localidad }
    );
  } */
}
