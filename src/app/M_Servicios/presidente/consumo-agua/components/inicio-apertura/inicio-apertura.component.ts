import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../../../../servicios/error.service';
import { InicioFinAperturaService } from '../../services/inicio-fin-apertura.service';
import { ClassAllApertura, ClassNextApertura } from '../../models';

@Component({
  selector: 'app-inicio-apertura',
  templateUrl: './inicio-apertura.component.html',
  styleUrl: './inicio-apertura.component.css'
})
export class InicioAperturaComponent {
  private subscription: Subscription = new Subscription();
  datosApertura: ClassNextApertura[] = [];
  datosAllApertura: ClassAllApertura[] = [];
  usuarioSeleccionado: any = {};
  id_estado_apertura: number=0;


  constructor(
    private toastr: ToastrService,
    private inicioApertura: InicioFinAperturaService,
    private _errorService: ErrorService,
  ) { }

  ngOnInit(): void {
    this.getInicioApertura();
    this.getAllApertura();
  }




  //Función para obtener la fecha siguiente de inicio de apertura
  getInicioApertura() {
    this.subscription = this.inicioApertura.obtenerAperturaNext()
    .subscribe({
      next: (resultados) => {
        if (resultados && resultados.length > 0) {
          this.datosApertura = resultados;
          //guardar el id_anio y id_mes en el usuarioSeleccionado
          this.usuarioSeleccionado.id_anio = resultados[0].id_anio;
          this.usuarioSeleccionado.id_mes = resultados[0].id_mes;
        } else {
          this.toastr.error("No tienes permitido hacer eso!");
        }
      }, error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });

  }

  //Función para obtener todas las aperturas realizadas
  getAllApertura() {
    this.subscription = this.inicioApertura.obtenerAllApertura()
      .subscribe({
        next: (resultados) => {
          if (resultados && resultados.length > 0) {
            this.datosAllApertura = resultados;
            // primero se busca en cada resultado si el id_estado_apertura es igual a 1, 
            //luego se guarda el id_estado_apertura, junto con la fecha del elemento encontrado
            const foundResult = resultados.find((element) => element.id_estado_apertura === 1);
            this.id_estado_apertura = foundResult ? foundResult.id_estado_apertura : 0;

            //TODO: Verificar si la apertura ya fue realizada por mes y dias correspondientes
            //es decir, si el id_anio y id_mes de la apertura actual ya se encuentran en la lista de aperturas realizadas



          } else {
            this.toastr.error("No tienes permitido hacer eso!");
          }
        }, error: (e: HttpErrorResponse) => {
          this._errorService.msjError(e);
        }
      });

  }

  // Función para realizar una nueva apertura
  realizarApertura() {
    const data ={
      // Deben ser numeros y no any
      id_anio: Number(this.usuarioSeleccionado.id_anio),
      id_mes: Number(this.usuarioSeleccionado.id_mes)
    }
    // Si en el campo de id_estado_apertura de todos los resultados es igual a 1, no se puede realizar la apertura
    if (this.id_estado_apertura === 1) {
      this.toastr.info("Una apertura ya se encuentra en proceso, verifique!");

      // Verificar si la apertura ya fue realizada por mes y dias correspondientes
      //es decir, si el id_anio y id_mes de la apertura actual ya se encuentran en la lista de aperturas realizadas
    }else if (this.datosAllApertura.find((element) => element.id_anio === data.id_anio && element.id_mes === data.id_mes)) {
      this.toastr.info("La apertura ya fue realizada para el mes y año seleccionado!");

    } else{
      this.subscription = this.inicioApertura.realizarApertura(data)
      .subscribe({
        next: (resultados) => {
          if (resultados) {
            this.toastr.success("Apertura realizada con éxito!");
            this.getInicioApertura();
            this.getAllApertura();
          } else {
            this.toastr.error("No tienes permitido hacer eso!");
          }
        }, error: (e: HttpErrorResponse) => {
          this._errorService.msjError(e);
        }
      });
      
    }

  }






    
  ngOnDestroy(): void {
    // Desuscribirse cuando el componente se destruye
    this.subscription.unsubscribe();    
  }
}
