import { Component, OnInit } from '@angular/core';
import { Material } from '../../models/material';

import { ToastrService } from 'ngx-toastr';
import { MaterialService } from '../../services/material.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit {

  //Array de Materiales
  listMaterial: Material[] = []
  loading: boolean = false;
  filtroMaterial = '';
  materialIdToDelete: number | undefined; 
  

  constructor(private _materialService: MaterialService,
    private toastr: ToastrService,
  private modalService: NgbModal) {

  }

  ngOnInit(): void {
    this.getListMateriales();

  }

  //Realiza la peticion

  getListMateriales() {
    this.loading = true;

    // setTimeout(() => {
    //   this._materialService.getListMaterial().subscribe((data: Material[]) => {
    //     this.listMaterial = data;
    //     this.loading = false;
    //   })

    // }, 1000);

    this._materialService.getMaterialxEstado().subscribe((data: Material[]) => {
      this.listMaterial = data;
      this.loading = false;
      console.log(this.listMaterial);
    })
  }

  confirmDelete(materialId: number | undefined): void {
    this.materialIdToDelete = materialId;
  }
  
  deleteMaterial(): void {
    if (this.materialIdToDelete !== undefined) {
      this.loading = true;
      this._materialService.deleteMaterial(this.materialIdToDelete).subscribe(
        () => {
          this.getListMateriales(); // Actualiza la lista de materiales después de la eliminación
          this.toastr.success('El Material fue eliminado exitosamente', 'Material Eliminado');
        },
        (error) => {
          console.error('Error al eliminar el material:', error);
          this.toastr.error('Ocurrió un error al eliminar el material', 'Error');
        }
      );
      this.materialIdToDelete = undefined; // Reinicia el ID del material después de la eliminación
    }
  }

  // Función para obtener el nombre del material por ID
  getMaterialNameById(materialId: number | undefined): string {
    const material = this.listMaterial.find(m => m.id_material === materialId);
    return material ? material.nombre : '';
  }
}

  // deleteMaterial(id_material: number) {

  //   this.loading = true;

  //   this._materialService.deleteMaterial(id_material).subscribe(() => { 
  //     this.getListMateriales();
  //     this.toastr.error('El Material fue Eliminado con exito', 'Material Eliminado');
  //   })
  // }


