import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AsignarOperadorService } from '../../services/asignar-operador.service';
import { Subscription } from 'rxjs';
import { OperadorsAsig } from '../../models/OperadoresAsig';
import { NombreOperadors } from '../../models/Operadores';
import { NombreLoc } from '../../models/Localidades';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../../../../servicios/error.service';
import { InicioFinAperturaService } from '../../services/inicio-fin-apertura.service';
import { ClassAllApertura } from '../../models';

@Component({
  selector: 'app-asignar-operador',
  templateUrl: './asignar-operador.component.html',
  styleUrl: './asignar-operador.component.css',
})
export class AsignarOperadorComponent {

  private subscription: Subscription = new Subscription();
  operadoresAsig: OperadorsAsig[] = [];
  operadores: NombreOperadors[] = [];
  localidades: NombreLoc[] = [];
  datosAllApertura: ClassAllApertura[] = [];
  usuarioSeleccionado: any = {};

  selectedOperador: number = 0;
  selectedLocalidad: number = 0;
  selectedOperadorNombre: string = '';
  selectedLocalidadNombre: string = '';


  loading: boolean = false;
  id_estado_apertura: number = 0;
  
  constructor(
    private toastr: ToastrService,
    private asignarOpServices: AsignarOperadorService,
    private FinApertura: InicioFinAperturaService,
    private _errorService: ErrorService,
  ) {}

  ngOnInit(): void {
    this.obtenerOperAsig();
    this.getInicioApertura();
  }

  //Función para obtener la apertura actual
  getInicioApertura() {
    this.subscription = this.FinApertura.obtenerAperturaActual()
      .subscribe({
        next: (resultados) => {
          if (resultados && resultados.length > 0) {
            this.datosAllApertura = resultados;
            //obtener el id_estado_apertura para verificar si el igual a 1
            const foundResult = resultados.find((element) => element.id_estado_apertura === 1);
            this.id_estado_apertura = foundResult ? foundResult.id_estado_apertura : 0;

          }
        }, error: (e: HttpErrorResponse) => {
          this._errorService.msjError(e);
        }
      });
  }
  
  //TODO: Funcion para verificar que los datos no sean los mismo que en la lista de operadores asignados
  //es decir, que no se repitan, ejemplo un operador no puede tener la misma localidad: Josue - localidad1, Josue - localidad1 (esto no debe suceder)
  verificarDatos(origen: string): boolean {
    if (this.operadoresAsig.length > 0) {
      if (origen === 'agregarOperador') {
        const operador = this.operadoresAsig.find(o => o.id_usuario_rol === Number(this.selectedOperador) && o.id_localidad === Number(this.selectedLocalidad));
        if (operador) {
          this.toastr.error("El operador ya se encuentra asignado en esa localidad!");
          return false;
        }
      } else if (origen === 'actualizarOperador') {
        const operador2 = this.operadoresAsig.find(o => o.id_usuario_rol === Number(this.usuarioSeleccionado.id_usuario_rol) && o.id_localidad === Number(this.usuarioSeleccionado.id_localidad));
        if (operador2) {
          this.toastr.error("El operador ya se encuentra asignado en esa localidad!");
          return false;
        }
      }
    }
    return true;
  }
  


  //Obtener operadores y localidad
  obtenerOperadoresYLocalidad() {
    // REINICIAR VALORES
    this.selectedOperador = 0;
    this.selectedLocalidad = 0;
    this.obtenerOperadores();
    this.obtenerLocalidades();
  }

/*   capturaIdUserRolAndIdLoc(event: any): void {
    if (this.selectedOperador && this.selectedLocalidad) {
      this.selectedOperador = Number(event.target.value);
      this.selectedLocalidad = Number(event.target.value);

      const operadorSeleccionado = this.operadores.find(o => o.id_usuario_rol === Number(this.selectedOperador));      
      if (operadorSeleccionado) {
        this.selectedOperadorNombre = operadorSeleccionado.fullname;
      }
  
      const localidadSeleccionada = this.localidades.find(l => l.id_localidad === Number(this.selectedLocalidad));
      if (localidadSeleccionada) {
        this.selectedLocalidadNombre = localidadSeleccionada.nombre;
      }  
    } 
  } */

  capturaIdUserRol(event: any) {
    this.selectedOperador = Number(event.target.value);
    // console.log(this.selectedOperador);
    //const idUserRol:number = Number(event.target.value);
    //console.log(idUserRol);
  }

  capturaIdLoc( event: any) {
    this.selectedLocalidad = Number(event.target.value);
    // console.log(this.selectedLocalidad);
    //const idLocalidad:number = Number(event.target.value);
    //console.log(idLocalidad);
  }

  capturaIdUserRolAndIdLoc2(event: any, tipo: string): void {
    const selectedValue = event.target.value;
    // Asignar el valor seleccionado al campo correspondiente en usuarioSeleccionado
    if (tipo === 'id_usuario_rol') {
      this.usuarioSeleccionado.id_usuario_rol = Number(selectedValue);
    } else if (tipo === 'id_localidad') {
      this.usuarioSeleccionado.id_localidad = Number(selectedValue);
    }
  }
  
  

  //Funcion para obtener los operadores asignados
  obtenerOperAsig() {
    this.loading = true;
      this.subscription = this.asignarOpServices.obtenerOperadoresAsignados().subscribe({
        next: (resultados) => {
          if (resultados && resultados.length > 0) {
            this.loading = false;
            this.operadoresAsig = resultados;
          }
        }, error: (e: HttpErrorResponse) => {
          this._errorService.msjError(e);
          this.loading = false;
        }
      });
    }

  
    //Funcion para obtener los operadores
    obtenerOperadores() {
    this.subscription = this.asignarOpServices.obtenerOperadores()
    .subscribe({
      next: (resultados) => {
        if (resultados && resultados.length > 0) {
          this.operadores = resultados;
        }  
      }, error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });
  }

  //Funciones para obtener las localidades
  obtenerLocalidades() {
    this.subscription = this.asignarOpServices.obtenerLocalidades().subscribe({
      next: (resultados) => {
        if (resultados && resultados.length > 0) {
          this.loading = false;
          this.localidades = resultados;
        } else {
          this.loading = false;
          this.toastr.error("No tienes permitido hacer eso!");
        }
      }, error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });
  }

  //Funcion para agregar un operador
  agregarOperador(id_usuario_rol: number, id_localidad:number) {
    if (!this.verificarDatos('agregarOperador')) {
      return;
    }
    const operador = {
      id_usuario_rol: id_usuario_rol,
      id_localidad: id_localidad,
    };
    if (this.id_estado_apertura === 0) {
      this.toastr.error("No hay ninguna apertura activa por el momento!");
      return;
    }

    this.subscription = this.asignarOpServices.agregarOperador(operador).subscribe({
      next: (resultados) => {
        if (resultados) {
          this.toastr.success("Operador agregado correctamente!");
          this.obtenerOperAsig();
        }  
      }, error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });
  }

  // Función para cargar datos del operador y localidad en el modal de edición
  cargarDatosEditar(datos: OperadorsAsig): void {
    this.usuarioSeleccionado.id_responsable_lectura = datos.id_responsable_lectura;
    this.usuarioSeleccionado.id_usuario_rol = datos.id_usuario_rol;
    this.usuarioSeleccionado.id_localidad = datos.id_localidad;
    this.usuarioSeleccionado.fullname = datos.fullname;
    this.usuarioSeleccionado.nombre = datos.localidad;
    
    this.obtenerOperadoresYLocalidad();

  }

  //Funcion para actualizar un operador
  actualizarOperador() {
    if (!this.verificarDatos('actualizarOperador')) {
      return;
    }
    const operador = {
      id_responsable_lectura: this.usuarioSeleccionado.id_responsable_lectura,
      id_usuario_rol: this.usuarioSeleccionado.id_usuario_rol,
      id_localidad: this.usuarioSeleccionado.id_localidad,
    };
    
    this.subscription = this.asignarOpServices.actualizarOperador(operador).subscribe({
      next: (resultados) => {
        if (resultados) {
          this.toastr.info("Operador actualizado correctamente!");
          this.obtenerOperAsig();
        }  
      }, error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });
  }

  //Funcion para eliminar un operador
  eliminarOperador() {
    const operador =  Number(this.usuarioSeleccionado.id_responsable_lectura);
    this.subscription = this.asignarOpServices.eliminarOperador(operador).subscribe({
      next: (resultados) => {
        if (resultados) {
          this.toastr.warning("Operador eliminado correctamente!");
          this.obtenerOperAsig();
        }  
      }, 
      error: (e:HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });
  }


  
  ngOnDestroy(): void {
    // Desuscribirse cuando el componente se destruye
    this.subscription.unsubscribe();    
  }

}
