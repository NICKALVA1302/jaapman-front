import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Material } from '../models/material';
import { enviroment } from '../../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {

    //localhost:3001/
    this.myAppUrl = enviroment.endpoint;
    this.myApiUrl = 'api/presidente'
  }

  //Peticion del get y obtener material
  getMaterialxEstado(): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.myAppUrl}${this.myApiUrl}/mostrarMateriales`);
  }

  //ELiminar
  deleteMaterial(id_material: number): Observable<void> {
    //Marcamos la ruta
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/materiales/${id_material}`);

  }

  //Agregar
  postMaterial(material: Material, estadoActivo: boolean): Observable<void> {

    // Si el interruptor está activo, asignar id_estado = 1, de lo contrario, asignar id_estado = 2
    const id_estado = estadoActivo ? 1 : 2;

    // Agregar el id_estado al objeto material
    const materialConEstado = { ...material, id_estado };

    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}/materiales/`, materialConEstado);
  }

  //listar materiales
  getMateriales(id_material: number): Observable<Material> {
    return this.http.get<Material>(`${this.myAppUrl}${this.myApiUrl}/materiales/${id_material}`);
  }

  //Actualizar
  putMaterial(id_material: number, material: Material, estadoActivo: boolean): Observable<void> {
    
    const materialToUpdate: Material = { ...material, id_estado: estadoActivo ? 1 : 2 };

    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}/materiales/${id_material}`, materialToUpdate);
  }
}
