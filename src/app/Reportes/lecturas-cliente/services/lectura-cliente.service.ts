import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroments';
import { Anio, LecturaUser } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class LecturaClienteService {
  private myAppUrl: string;
  private myApiURL: string;
  private myApiURLCajero: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = enviroment.endpoint;
    (this.myApiURL = 'api/login'), (this.myApiURLCajero = 'api/cajero');
  }

  getDatos(cedula: string, fecha: string): Observable<LecturaUser[]> {
    return this.http.post<LecturaUser[]>(
      `${this.myAppUrl}${this.myApiURLCajero}/getLecturaCliente`,
      { cedula, fecha }
    );
  }

  getAnios(): Observable<Anio[]> {
    return this.http.get<Anio[]>(
      `${this.myAppUrl}${this.myApiURL}/obtencion/anios`
    );
  }
}
