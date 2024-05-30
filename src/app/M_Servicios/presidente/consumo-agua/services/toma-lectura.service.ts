import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { enviroment } from '../../../../enviroments/enviroments';
import { ClassUserxApertura, ClassUserxLoc, UsuariosxLocalidad, UsuarioxApertura } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TomaLecturaService {
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

  //Funcion para obtener a los usuarios por localidad
  getUsuariosxLocalidad(id_localidad: number) {
    const url = `${this.myUrl}${this.myApiUrl}/getUsuariosxLocalidad/${id_localidad}`;
    return this.http.get<UsuariosxLocalidad>(url)
      .pipe(
        map(result => {
          return result.resultados.map(UsersxLoc => ClassUserxLoc.userxLocal(UsersxLoc))
        })
      );
  }

  //Funcion para obtener las aperturas de un usuario
  getUsuarioxApertura(id_usuario: number) {
    const url = `${this.myUrl}${this.myApiUrl}/getUsuarioxApertura/${id_usuario}`;
    return this.http.get<UsuarioxApertura>(url)
      .pipe(
        map(result => {
          return result.resultados.map(UserxApertura => ClassUserxApertura.userxApertura(UserxApertura))
        })
      );
  }
  
}
