import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroments';
import { PagoCliente } from '../models/interfaces';
@Injectable({
  providedIn: 'root',
})
export class PagoClienteService {
  private myAppUrl: string;
  private myApiURL: string;
  private myApiURLCajero: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = enviroment.endpoint;
    (this.myApiURL = 'api/login'), (this.myApiURLCajero = 'api/cajero');
  }
  getDatos(cedula: string): Observable<PagoCliente[]> {
    return this.http.post<PagoCliente[]>(
      `${this.myAppUrl}${this.myApiURLCajero}/getPagoCliente`,
      { cedula }
    );
  }
}
