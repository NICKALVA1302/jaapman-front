import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../../../../servicios/error.service';
import { InicioFinAperturaService } from '../../services/inicio-fin-apertura.service';
import { ClassAllApertura } from '../../models';

@Component({
  selector: 'app-fin-apertura',
  templateUrl: './fin-apertura.component.html',
  styleUrl: './fin-apertura.component.css'
})
export class FinAperturaComponent {
  private subscription: Subscription = new Subscription();
  datosAllApertura: ClassAllApertura[] = [];
  datosAllApertura2: ClassAllApertura[] = [];
  id_estado_apertura: number = 0;

  constructor(
    private toastr: ToastrService,
    private FinApertura: InicioFinAperturaService,
    private _errorService: ErrorService,
  ) { }

  ngOnInit(): void {
    this.getInicioApertura();
    this.getAllApertura();
  }


    //Función para obtener la apertura actual
    getInicioApertura() {
      this.subscription = this.FinApertura.obtenerAperturaActual()
        .subscribe({
          next: (resultados) => {
            if (resultados && resultados.length > 0) {
              this.datosAllApertura = resultados;
            }
          }, error: (e: HttpErrorResponse) => {
            this._errorService.msjError(e);
          }
        });
    }

  //Función para obtener todas las aperturas realizadas
  getAllApertura() {
    this.subscription = this.FinApertura.obtenerAllApertura()
      .subscribe({
        next: (resultados) => {
          if (resultados && resultados.length > 0) {
            this.datosAllApertura2 = resultados;
            // primero se busca en cada resultado si el id_estado_apertura es igual a 1, luego se guarda el id_estado_apertura en id_estado_apertura
            const foundResult = resultados.find((element) => element.id_estado_apertura === 1);
            this.id_estado_apertura = foundResult ? foundResult.id_estado_apertura : 0;
          }
        }, error: (e: HttpErrorResponse) => {
          this._errorService.msjError(e);
        }
      });

  }

    //Función para cerrar la apertura
    cerrarApertura() {
    // Si en el campo de id_estado_apertura de todos los resultados es igual a 1, se puede realizar la apertura
    if (this.id_estado_apertura === 1) {
      this.subscription = this.FinApertura.cerrarApertura()
        .subscribe({
          next: (resultados) => {
            if (resultados) {
              this.toastr.success("Apertura cerrada correctamente");
              this.getInicioApertura();
              this.getAllApertura();
            }
          }, error: (e: HttpErrorResponse) => {
            this._errorService.msjError(e);
          }
        });
      
      }else {
        this.toastr.info("No hay ninguna apertura en proceso para cerrar!");
      }
    }




        
  ngOnDestroy(): void {
    // Desuscribirse cuando el componente se destruye
    this.subscription.unsubscribe();    
  }
}
