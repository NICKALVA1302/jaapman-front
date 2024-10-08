import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../../../../enviroments/enviroments';
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

  // Obtener el próximo número de id_multa
  obtenerProximoIdMulta(): Observable<number> {
    return this.http.get<number>(`${this.myAppUrl}${this.myApiUrlPresi}/proxNum`);
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
