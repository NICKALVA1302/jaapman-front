import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../../../../enviroments/enviroments';
import { map } from 'rxjs';
import { 
  AllApertura,
  ClassAllApertura,
  ClassNextApertura,
  NextApertura 

} from '../models';

@Injectable({
  providedIn: 'root'
})
export class InicioFinAperturaService {
  private myUrl: string;
  private myApiUrl: string;

  constructor(private http:HttpClient) { 
    this.myUrl = enviroment.endpoint;
    this.myApiUrl = 'api/presidente';
    }

    // Función para inicializar el control del localStorage
    init() {
      window.addEventListener('storage', this.handleStorageChange);
    }
  
    // Función para manejar los cambios en el almacenamiento local
    handleStorageChange(event: StorageEvent) {
      //Si el usuario realiza un cambio manual, se borran todos los valores del localStorage
      if (event.storageArea === localStorage) {
        localStorage.clear(); 
      }
    }

  //Funcion para obtener la apertura actual
  obtenerAperturaActual() {
    const url = `${this.myUrl}${this.myApiUrl}/getAperturaActual`;
    return this.http.get<AllApertura>(url)
      .pipe(
        map(result => {
          return result.resultados.map(AperturaActual => ClassAllApertura.allApertura(AperturaActual))
        })
      );
  }
    
    //Funcion para obtener la fecha siguente de inicio de apertura
  obtenerAperturaNext() {
    const url = `${this.myUrl}${this.myApiUrl}/getNewApertura`;
    return this.http.get<NextApertura>(url)
      .pipe(
        map(result => {
          return result.resultados.map(NextApertura => ClassNextApertura.nextApertura(NextApertura))
        })
      );
  }

  //Funcion para obtener todas las aperturas realizadas
  obtenerAllApertura() {
    const url = `${this.myUrl}${this.myApiUrl}/getAllAperturas`;
    return this.http.get<AllApertura>(url)
      .pipe(
        map(result => {
          return result.resultados.map(AllApertura => ClassAllApertura.allApertura(AllApertura))
        })
      );
  }

  //Funcion para realizar una nueva apertura: id_mes, id_anio
  realizarApertura(data: any) {
    const url = `${this.myUrl}${this.myApiUrl}/newApertura`;
    return this.http.post(url, data);
  }

  //Funcion para cerrar la apertura
  cerrarApertura() {
    const url = `${this.myUrl}${this.myApiUrl}/putEstadoApertura`;
    return this.http.put(url, {});
  }


}
