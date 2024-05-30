import { Component, OnInit } from '@angular/core';
import { Material } from '../../models/material';

import { ToastrService } from 'ngx-toastr';
import { MaterialService } from '../../services/material.service';



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
  

  constructor(private _materialService: MaterialService,
    private toastr: ToastrService) {

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

  deleteMaterial(id_material: number) {
    // console.log(id_material)

    this.loading = true;

    this._materialService.deleteMaterial(id_material).subscribe(() => { 
      this.getListMateriales();
      this.toastr.error('El Material fue Eliminado con exito', 'Material Eliminado');
    })
  }

}
