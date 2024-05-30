import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../../../enviroments/enviroments';
import { DatosPorLocalidad, Localidad } from '../models/localidades';
import { Observable } from 'rxjs';
import { Multa } from '../models/multa';

@Injectable({
  providedIn: 'root'
})
export class MultasService {
  private myAppUrl: string;
  private myApiURL: string;
  private myApiUrlPresi: string;

  constructor(private http: HttpClient) {

    //localhost:3000/
    this.myAppUrl = enviroment.endpoint;
    this.myApiURL = 'api/login/',
      this.myApiUrlPresi = 'api/presidente';
  }

  //Peticiones

  // obtener localidades
  obtenerLocalidades(): Observable<Localidad[]> {
    return this.http.get<Localidad[]>(`${this.myAppUrl}${this.myApiURL}obtencion/localidadesRegister`);
  }

  //Metodo para obtener usuario por localidad
  getDatosPorLocalidad(id_localidad: number): Observable<any> {
    return this.http.post<DatosPorLocalidad[]>(`${this.myAppUrl}${this.myApiUrlPresi}/usuarioxlocalidad`, { id_localidad });
  }

  // Obtener listado de multas
  obtenerListadoMultas(): Observable<Multa[]> {
    return this.http.get<Multa[]>(`${this.myAppUrl}${this.myApiUrlPresi}/listMulta`);
  }

  //Guardar Multa
  guardarMulta(id_usuario: number, valor_multa: number, observacion: string): Observable<any> {
    const multaData = { id_usuario, valor_multa, observacion }; // Datos de la multa
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrlPresi}/agregarMulta`, multaData);
  }
}
