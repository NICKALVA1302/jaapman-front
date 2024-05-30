import { Component, OnInit } from '@angular/core';
import { ConsumoAguaService } from '../../services/consumo-agua.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NombreLoc } from '../../models';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-localidades',
  templateUrl: './view-localidades.component.html',
  styleUrl: './view-localidades.component.css'
})

export class ViewLocalidadesComponent implements OnInit {
  
  private subscription: Subscription = new Subscription();
  localidades: NombreLoc[] = [];
  loading: boolean = false;

  constructor(private toastr: ToastrService, 
              private localidadServices:ConsumoAguaService,
              private router: Router){}


  ngOnInit(): void {
    this.cargarLoc();
    this.localidadServices.init();
  }

 //Se muestran las localidades que tiene asignado un responsable

  cargarLoc() {
  const id_usuarioRol: any = localStorage.getItem('id_usuario_rol');
  this.loading = true;
  
  //Se llama al servicio para mostrar las localidades
  this.subscription = this.localidadServices.cargarLocalidades(id_usuarioRol)
    .subscribe(resultados => {
      // Verificar si hay resultados y si la longitud de resultados es mayor a 0
      if (resultados && resultados.length > 0) {
          this.loading = false;
          this.localidades = resultados;
      } else {
        //Sino, redirige al componente de login borrando todos los items del localStorage
        this.loading = false;
        this.router.navigate(['/login']);
        localStorage.clear();
        this.toastr.error("No tienes permitido hacer eso!");
      }
    });
}

  //(este es el id_localidad de la tabla responsable_lectura)
  capturarIdLocalidad(id_localidad: number): void {
    this.router.navigate(['/operador/consumo-agua/loc-usuarios/' + id_localidad]);
  }

  ngOnDestroy(): void {
    // Desuscribirse cuando el componente se destruye
    this.subscription.unsubscribe();    
  }
}