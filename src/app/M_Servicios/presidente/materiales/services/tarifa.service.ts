import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tarifa } from '../models/mantenimiento';
import { enviroment } from '../../../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class TarifaService {
  private myAppUrl: string;
  private myApiUrlPresi: string;

  constructor(private http: HttpClient) {

    //localhost:3000/
    this.myAppUrl = enviroment.endpoint;
    this.myApiUrlPresi = 'api/presidente'

   }

   //Peticiones

   //Lista de Tarifa
   listTarifa(): Observable<Tarifa[]> {
    return this.http.get<Tarifa[]>(`${this.myAppUrl}${this.myApiUrlPresi}/listTarifa`);
  }

  // Actualizar Tarifa
  actualizarTarifa(id_tarifa1: number, valor1: number, id_tarifa2: number, valor2: number, id_tarifa3: number, valor3: number): Observable<any> {
    const tarifas = {
      id_tarifa1, valor1,
      id_tarifa2, valor2,
      id_tarifa3, valor3
    };
    return this.http.put<any>(`${this.myAppUrl}${this.myApiUrlPresi}/actualizarTarifa`, tarifas);
  }

  
}
