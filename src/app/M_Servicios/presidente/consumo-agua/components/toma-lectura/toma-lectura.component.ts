import { Component } from '@angular/core';
import { TomaLecturaService } from '../../services/toma-lectura.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ErrorService } from '../../../materiales/services/error.service';
import { ClassAllApertura, ClassUserxApertura, ClassUserxLoc, NombreLoc } from '../../models';
import { AsignarOperadorService } from '../../services/asignar-operador.service';
import { InicioFinAperturaService } from '../../services/inicio-fin-apertura.service';

@Component({
  selector: 'app-toma-lectura',
  templateUrl: './toma-lectura.component.html',
  styleUrl: './toma-lectura.component.css'
})
export class TomaLecturaComponent {
  buscarUsuario: string = '';
  estadoLectura: number = 0;
  estadoMedidor: number = 0;

  usuariosConLecturaRealizada: number = 0;
  usuariosConLecturaPendiente: number = 0;
  usersConMedidorSuspendido: number = 0;
  usersConMedidorCortado: number = 0;
  totalUsuarios: number = 0;

  loading: boolean = false;
  subscription: Subscription = new Subscription();
  userxLocalidad: ClassUserxLoc[] = [];
  userxApertura: ClassUserxApertura[] = [];
  localidades: NombreLoc[] = [];
  usuarioSeleccionado: any = {};
  aperturaActual: string = '';
  responsableEncargado: string = '';
  datosAllApertura: ClassAllApertura[] = [];


  ordenamiento: 'asc' | 'desc' = 'asc'; // Inicializar orden por defecto
  campoOrdenamiento: 'nombre' | 'apellido' = 'nombre';
  



  constructor(
    private toastr: ToastrService,
    private userxLocServices: TomaLecturaService,
    private _errorService: ErrorService,
    private asignarOpServices: AsignarOperadorService,
    private FinApertura: InicioFinAperturaService,

  ) { }

  ngOnInit(): void {
    this.obtenerLocalidades();
    this.getInicioApertura();
  }

  //Funcion para obtener las localidades
  obtenerLocalidades() {
    this.subscription = this.asignarOpServices.obtenerLocalidades().subscribe({
      next: (resultados) => {
        if (resultados && resultados.length > 0) {
          this.loading = false;
          this.localidades = resultados;
        }
      }, error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });
  }
  //Función para obtener la apertura actual
  getInicioApertura() {
    this.subscription = this.FinApertura.obtenerAperturaActual()
      .subscribe({
        next: (resultados) => {
          if (resultados && resultados.length > 0) {
            this.datosAllApertura = resultados;
            this.aperturaActual = this.datosAllApertura[0].mes;
          }
        }, error: (e: HttpErrorResponse) => {
          this._errorService.msjError(e);
        }
      });
  }

  //Funcion para  seleccionar la localidad
  seleccionarLocalidad(event: any) {
    const idLocalidad:number = event.target.value;
    this.getUsuariosxLocalidad(idLocalidad);
  }

  //Funcion para obtener a los usuarios por localidad
  getUsuariosxLocalidad(id_localidad: number) {
      this.loading = true;
        this.subscription = this.userxLocServices.getUsuariosxLocalidad(id_localidad).subscribe({
          next: (resultados) => {
            if (resultados && resultados.length > 0) {
              this.loading = false;
              this.userxLocalidad = resultados;
              this.actualizarContadores();
              
            }else{
              this.toastr.error('No hay usuarios en esta localidad', 'Error');
              this.loading = false;
            }
          }, error: (e: HttpErrorResponse) => {
            this._errorService.msjError(e);
            this.loading = false;
          }
        });
      };

  // Captura la posicion del usuario seleccionado y carga los datos a 'usuarioSeleccionado' para ser editados
  capturarPosicion(usuario: ClassUserxLoc):void {
    // Se obtiene el nombre del responsable
    const nombreResponsable:string = 'Rol presidente'; 

    // Asigna el nombre del responsable a usuarioSeleccionado basado en los campos nombre_responsable1 y nombre_responsable2
    this.responsableEncargado = nombreResponsable;
    // Asigna el nombre del responsable a usuarioSeleccionado basado en los campos nombre_responsable1 y nombre_responsable2
    this.usuarioSeleccionado.id_usuario = usuario.id_usuario;
    this.usuarioSeleccionado.codigo = usuario.codigo;
    this.usuarioSeleccionado.lectura_anterior = usuario.lectura_anterior;
    this.usuarioSeleccionado.lectura_actual = usuario.lectura_actual;
    this.usuarioSeleccionado.consumo_total = usuario.consumo_total;
    this.usuarioSeleccionado.nombre = usuario.nombre_persona;
    this.usuarioSeleccionado.apellido = usuario.apellido_persona;
    //Si el estado_lectura es 1, marca el switch como válido
    this.usuarioSeleccionado.estado_lectura = usuario.estado_lectura === 1;
    this.usuarioSeleccionado.id_estado_medidor = usuario.id_estado_medidor;
    this.usuarioSeleccionado.observaciones = usuario.observaciones;
    // Aun en verificacion, no se sabe si poner el nombre de quien edita o solo poner 'Rol presidente'
    this.usuarioSeleccionado.editadoPor = usuario.editadoPor;
  }

  capturaIdUser( id_usuario: number){
    this.getUsuarioxApertura(id_usuario);
  }

  guardarCambios() {
    const datosAGuardar = {
      id_usuario: this.usuarioSeleccionado.id_usuario,
      lectura_actual: this.usuarioSeleccionado.lectura_actual,
      observaciones: this.usuarioSeleccionado.observaciones,
      estado_lectura: this.usuarioSeleccionado.estado_lectura ? 1 : 2,
      editadoPor: this.responsableEncargado
    };
    console.log(datosAGuardar);
    this.toastr.success("Datos actualizados con éxito");
    
    /* const saveSubscription = this.localidadServices.tomarLectura(datosAGuardar).subscribe(() => {
      this.toastr.success("Datos actualizados con éxito");
      this.mostrarUsuariosxLoc();
    });

    this.subscription.add(saveSubscription); */
  }

  guardarCambios2(){
    this.toastr.success("Datos actualizados con éxito");
  }

  //Funcio para obtener las aperturas de un usuario
  getUsuarioxApertura(id_usuario: number) {
    this.subscription = this.userxLocServices.getUsuarioxApertura(id_usuario).subscribe({
      next: (resultados) => {
        if (resultados && resultados.length > 0) {
          this.userxApertura = resultados;
          this.usuarioSeleccionado.localidad = this.userxApertura[0].localidad;
          this.usuarioSeleccionado.observacion_presidente = this.userxApertura[0].observacion_presidente;

          
        }
      }, error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
      }
    });
  };


    // Método para cambiar el ordenamiento
    cambiarOrdenamiento(campo: 'nombre' | 'apellido'): void {
      if (campo === this.campoOrdenamiento) {
        // Si se hace clic en el mismo campo, cambiar el orden de clasificación
        this.ordenamiento = this.ordenamiento === 'asc' ? 'desc' : 'asc';
      } else {
        // Si se hace clic en un campo diferente, cambiar el campo de ordenamiento y establecer el orden ascendente
        this.campoOrdenamiento = campo;
        this.ordenamiento = 'asc';
      }
    }

    // TODO: Contador de usuarios por estado de lectura
// 1 para usuarios con lectura realizada, 2 para usuarios con lectura pendiente
  private actualizarContadores() {
    // Reiniciar los contadores
    this.usuariosConLecturaRealizada = 0;
    this.usuariosConLecturaPendiente = 0;
    this.usersConMedidorSuspendido = 0;
    this.usersConMedidorCortado = 0;
    this.totalUsuarios = 0;
  
    // Contar usuarios por estado de lectura
    //El contador NO contabiliza usuarios con id_estado_medidor = 2 ni 3
      this.userxLocalidad.forEach(usuario => {
      if (usuario.estado_lectura === 1 && usuario.id_estado_medidor !== 2 && usuario.id_estado_medidor !== 3) {
        this.usuariosConLecturaRealizada++;
      } else if (usuario.estado_lectura === 2 && usuario.id_estado_medidor !== 2 && usuario.id_estado_medidor !== 3) {
        this.usuariosConLecturaPendiente++;
      } else if(usuario.id_estado_medidor === 2){
        this.usersConMedidorSuspendido++;
      } else if(usuario.id_estado_medidor === 3){
        this.usersConMedidorCortado++;
      }
    });


    // Contar todos los usuarios independientemente del estado_lectura
    this.totalUsuarios = this.userxLocalidad.length;
  }
  


  ngOnDestroy(): void {
    // Desuscribirse cuando el componente se destruye
    this.subscription.unsubscribe();
    
  }
}
