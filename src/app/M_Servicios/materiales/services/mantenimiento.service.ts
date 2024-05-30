import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DatosPorLocalidad, Localidad } from '../models/localidades';
import { Material } from '../models/material';
import { Tarifa } from '../models/mantenimiento';
import { enviroment } from '../../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {
  private myAppUrl: string;
  private myApiURL: string;
  private myApiUrlPresi: string;

  constructor(private http: HttpClient) {

    //localhost:3000/
    this.myAppUrl = enviroment.endpoint;
    this.myApiURL = 'api/login/',
    this.myApiUrlPresi = 'api/presidente'
  }

  //Peticiones

  // obtener localidades
  obtenerLocalidades(): Observable<Localidad[]> {
    return this.http.get<Localidad[]>(`${this.myAppUrl}${this.myApiURL}obtencion/localidadesRegister`);
  }

  //Metodo para obtener usuario por localidad
  getDatosPorLocalidad(id_localidad: number): Observable<DatosPorLocalidad[]> {
    return this.http.post<DatosPorLocalidad[]>(`${this.myAppUrl}${this.myApiUrlPresi}/usuarioxlocalidad`, { id_localidad });
  }

  //Agregar un mantenimiento
  postAgregarMantenimiento(id_usuario: number, id_tarifa: number | null, materiales: any[]): Observable<any> {
    // Asignar un valor predeterminado si id_tarifa es null
    const idTarifa = id_tarifa ?? null;
  
    const body = { id_usuario, id_tarifa: idTarifa, materiales };
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrlPresi}/agregarManteniento`, body);
  }

  //Lista de Materiales
  listMateriales(): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.myAppUrl}${this.myApiUrlPresi}/mostrarMateriales`).pipe(
      tap((materiales) => console.log('Datos de Materiales:', materiales))
    );
  }

  listTarifa(): Observable<Tarifa[]> {
    return this.http.get<Tarifa[]>(`${this.myAppUrl}${this.myApiUrlPresi}/tarifa`);
  }

}
