import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Multa } from '../models/multa';
import { Observable } from 'rxjs';
import { enviroment } from '../../../../enviroments/enviroments';

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

  // Obtener listado de multas
  obtenerListadoMultas(): Observable<Multa[]> {
    return this.http.get<Multa[]>(`${this.myAppUrl}${this.myApiUrlPresi}/listMulta`);
  }

  // Eliminar multa
  eliminarMulta(id_multa: number): Observable<any> {
    return this.http.delete<any>(`${this.myAppUrl}${this.myApiUrlPresi}/eliminarMulta/${id_multa}`);
  }

  // Actualizar multa
  actualizarMulta(id_multa: number, valor_multa: number, observacion: string): Observable<any> {
    const multaData = { valor_multa, observacion };
    return this.http.put<any>(`${this.myAppUrl}${this.myApiUrlPresi}/actualizarMulta/${id_multa}`, multaData);
  }

  // multa x id 
  obtenerMultaXId(id_multa: number): Observable<Multa> {
    return this.http.get<Multa>(`${this.myAppUrl}${this.myApiUrlPresi}/multaXid/${id_multa}`);
  }
}
