import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Localidad, NombreLoc, UsuariosxLocalidad } from '../models';
import { UserxLoc } from '../models/UsuariosxLocalidad';
import { enviroment } from '../../../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class ConsumoAguaService {
  private myUrl: string;
  private myApiUrl: string;

  constructor(private http:HttpClient) { 
    this.myUrl = enviroment.endpoint;
    this.myApiUrl = 'api/operador';
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
    

//Función para obtener el nombre del operador que inicia sesion, por el parametro (id_usuarioRol)
  obtenerNombreUserRol(id_usuarioRol: string) {
    const url = `${this.myUrl}${this.myApiUrl}/obtenerNombreUserRol/${id_usuarioRol}`;
    return this.http.get<any>(url);
  }

//Función para mostrar todas las localidades que tiene asignado un operador, por
//dos parametros (id_usuarioRol - id_rol)
  cargarLocalidades(id_usuarioRol: string) {
    const url = `${this.myUrl}${this.myApiUrl}/listarNumPersonasxLoc/${id_usuarioRol}`;
    return this.http.get<Localidad>(url)
      .pipe(
        map(result => {
          return result.resultados.map(locxNumUser => NombreLoc.locxNumUser(locxNumUser))
        })
      );
  }

//Función para mostrar a todos los usuarios de una localidad, por el parametro (id_localidad)
  cargarUsuariosxLoc(id_localidad: number, id_usuarioRol: number) {
    const url = `${this.myUrl}${this.myApiUrl}/listarPersonasTomaLectura/${id_localidad}/${id_usuarioRol}`;
    return this.http.get<UsuariosxLocalidad>(url).
    pipe(
      map(result => {
        return result.resultados.map(userxloc => UserxLoc.userxLoc(userxloc))
    }))
  }

//Función para actualizar la toma de lectura realizada por el operador
  tomarLectura(body:any){
    const url = `${this.myUrl}${this.myApiUrl}/actualizarLectura_Planilla`;
    return this.http.put(url,body)
  }

  //Función para actualizar la contraseña del operador
    changePassword(body:any){
    const url = `${this.myUrl}${this.myApiUrl}/changePassword`;
    return this.http.put(url,body)
  }

}
