import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Material } from '../../models/material';

import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MaterialService } from '../../services/material.service';


@Component({
  selector: 'app-add-edit-materiales',
  templateUrl: './add-edit-materiales.component.html',
  styleUrls: ['./add-edit-materiales.component.css']
})
export class AddEditMaterialesComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  id_material: number;
  operacion: string = 'AGREGAR'

  constructor(private fb: FormBuilder,
    private _materialService: MaterialService,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute) {

    this.form = this.fb.group({
      estado: [false, Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      stock: [null, Validators.required],
      precio: [null, Validators.required]
    });

    // Obtener la ID del material de la URL y validar
    this.id_material = Number(aRouter.snapshot.paramMap.get('id_material'));
    console.log(this.id_material)
    // aRouter.snapshot.paramMap.get('id_material');
    // console.log(aRouter.snapshot.paramMap.get('id_material'))
  }

  ngOnInit(): void {
    
    if(this.id_material != 0){
      //Editar
      this.operacion = 'EDITAR ';
      this.getMaterial(this.id_material);
      
    } else {
      this.form?.get('estado')?.setValue(false);
    }
  }

  getMaterial(id_material: number) {
    this.loading = true;
    this._materialService.getMateriales(id_material).subscribe ((data: Material) => {
      console.log(data)
      this.loading = false;
      this.form.setValue({
        estado: data.id_estado === 1, // Asigna true si id_estado es 1, de lo contrario, false
        nombre: data.nombre,
        descripcion: data.descripcion,
        stock: data.stock,
        precio: data.precio
      })
    })

  }

  agregarMaterial() {

    const material: Material = {
      id_estado: this.form.value.estado,
      nombre: this.form.value.nombre,
      descripcion: this.form.value.descripcion,
      stock: this.form.value.stock,
      precio: this.form.value.precio
    }

    const estadoActivo: boolean = this.form.value.estado;

    this.loading = true;

    if(this.id_material != 0) {
      //Editar
      material.id_material = this.id_material;
      this._materialService.putMaterial(this.id_material, material, estadoActivo).subscribe(() => {
        this.toastr.info(`El Material ${material.nombre} fue actualizado con exito`, 'Material Actualizado')
        this.loading = false;
        this.router.navigate(['/presidente/material']);
      })

    } else {
      //Agregar
      this._materialService.postMaterial(material, estadoActivo).subscribe(() => {
        this.toastr.success(`El Material "${material.nombre}" fue registrado con exito`, 'Material Registrado')
        this.loading = false;
        this.router.navigate(['/presidente/material']);
      })
    }
  }

}
