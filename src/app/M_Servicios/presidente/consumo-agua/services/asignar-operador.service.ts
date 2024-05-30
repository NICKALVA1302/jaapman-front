import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { enviroment } from '../../../../enviroments/enviroments';
import { 
  Operadores, NombreOperadors,
  OperadoresAsig, OperadorsAsig,
  Localidad, NombreLoc 

} from '../models';


@Injectable({
  providedIn: 'root'
})
export class AsignarOperadorService {
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
    


    //Funcion para obtener todas las localidades
    obtenerLocalidades() {
        const url = `${this.myUrl}${this.myApiUrl}/getLocalidades`;
        return this.http.get<Localidad>(url)
          .pipe(
            map(result => {
              return result.resultados.map(NomLocalidad => NombreLoc.localidades(NomLocalidad))
            })
          );
    }

    //Funcion para obtener los operadores
    obtenerOperadores() {
      const url = `${this.myUrl}${this.myApiUrl}/getOperadores`;
      return this.http.get<Operadores>(url)
        .pipe(
          map(result => {
            return result.resultados.map(NomOpers => NombreOperadors.operadores(NomOpers))
          })
        );
    }
    
    //Funcion para obtener los operadores asignados
    obtenerOperadoresAsignados() {
      const url = `${this.myUrl}${this.myApiUrl}/getOperadoresAsig`;
      return this.http.get<OperadoresAsig>(url)
        .pipe(
          map(result => {
            return result.resultados.map(OpersAsig => OperadorsAsig.operadoresAsig(OpersAsig))
          })
        );
    }

    //Funcion para agregar un operador
    agregarOperador(body:any) {
      const url = `${this.myUrl}${this.myApiUrl}/asignarOperador`;
      return this.http.post(url, body);
    }

    //Funcion para actualizar un operador
    actualizarOperador(body:any) {
      const url = `${this.myUrl}${this.myApiUrl}/actualizarOperador`;
      return this.http.put(url, body);
    }

    //Funcion para eliminar un operador
    eliminarOperador(id_responsable_lectura: number) {
      const url = `${this.myUrl}${this.myApiUrl}/eliminarOperador/${id_responsable_lectura}`;
      return this.http.delete(url);
    }

    
    



}
