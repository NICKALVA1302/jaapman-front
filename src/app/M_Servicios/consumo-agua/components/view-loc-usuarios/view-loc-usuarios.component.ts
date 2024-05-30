import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsumoAguaService } from '../../services/consumo-agua.service';
import { UserxLoc } from '../../models/UsuariosxLocalidad';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-loc-usuarios',
  templateUrl: './view-loc-usuarios.component.html',
  styleUrl: './view-loc-usuarios.component.css'
})
export class ViewLocUsuariosComponent implements OnInit{
  parametro: number=0;
  userxLoc: UserxLoc[] = [];
  usuarioSeleccionado: any = {};
  buscarUsuario:string='';
  responsableEncargado: string = '';
  loading: boolean = false;
  estadoFiltrado: number | null = null;
  noHayDatos: boolean = false;
  estadoLectura: number = 0;
  // Variables para contadores de usuarios por estado de lectura
  usuariosConLecturaRealizada: number = 0;
  usuariosConLecturaPendiente: number = 0;
  totalUsuarios: number = 0;

  latitude: number = 0;
  longitude: number = 0;
  private subscription: Subscription = new Subscription();

  constructor(private toastr: ToastrService, 
              private route: ActivatedRoute,
              private localidadServices:ConsumoAguaService, 
              private router: Router) { 
              }
//Se muestran los datos de todos los usuarios por localidad que han sido
//asignados a un responsable de lectura
  ngOnInit(): void {
    this.mostrarUsuariosxLoc();
    this.localidadServices.init();
  }

//captura la longitud y latitud
//Solo captura, pero no se está guardando, en revisión aún...
  capturarLocation(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Se accede a la latitud y longitud desde el objeto 'position'
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

      }, (error) => {
        console.error('Error al obtener la ubicación:', error);
      });
    } else {
      alert('Geolocalización no es compatible con este navegador.');
    }
  }



//Muestra a todos los usuarios por localidad
mostrarUsuariosxLoc() {
  this.loading = true;
  const id_user_rol:any = localStorage.getItem('id_usuario_rol');
  
  // Suscripción al parámetro de la ruta
  const paramSubscription = this.route.params.subscribe(params => {
    const id_localidad = this.parametro = params['id'];
    
    // Suscripción al servicio para cargar usuarios
    //Se llama al servicio para mostrar a los usuarios de una localidad
    const serviceSubscription = this.localidadServices.cargarUsuariosxLoc(id_localidad,id_user_rol).
    subscribe(resultados => {
      // Verificar si hay resultados y si la longitud de resultados es mayor a 0
      if (resultados && resultados.length > 0 && id_user_rol !== null) {
         //Si existen datos los muestra (siempre y cuando sean del mismo operador)
        this.userxLoc = resultados;
        this.actualizarContadores();
        this.router.navigate(['/operador/consumo-agua/loc-usuarios/' + id_localidad]);
      } else {
        //Sino redirige al componente de view-localidades
        this.toastr.error("No tienes acceso a esa localidad");
        this.router.navigate(['/operador/consumo-agua/localidades']);
      }
      this.loading = false;
    });

    // Agregar las suscripciones al Subscription principal
    this.subscription.add(serviceSubscription);
  });

  // Agregar la suscripción al parámetro al Subscription principal
  this.subscription.add(paramSubscription);
}

// Captura la posicion del usuario seleccionado y carga los datos a 'usuarioSeleccionado' para ser editados
  capturarPosicion(usuario: UserxLoc):void {
      this.capturarLocation();

      // Se obtiene el nombre del responsable
      const nombreResponsable:any = localStorage.getItem('fullname'); 
      
      // Asigna el nombre del responsable a usuarioSeleccionado basado en los campos nombre_responsable1 y nombre_responsable2
      this.responsableEncargado = nombreResponsable;
      this.usuarioSeleccionado.id_usuario = usuario.id_usuario;
      this.usuarioSeleccionado.id_responsable_lectura = usuario.id_responsable_lectura;
      this.usuarioSeleccionado.codigo = usuario.codigo;
      this.usuarioSeleccionado.lectura_anterior = usuario.lectura_anterior;
      this.usuarioSeleccionado.lectura_actual = usuario.lectura_actual;
      this.usuarioSeleccionado.consumo_total = usuario.consumo_total;
      this.usuarioSeleccionado.nombre = usuario.nombre;
      this.usuarioSeleccionado.apellido = usuario.apellido;
      //Si el estado_lectura es 1, marca el switch como válido
      this.usuarioSeleccionado.estado_lectura = usuario.estado_lectura === 1;
      this.usuarioSeleccionado.observaciones = usuario.observaciones;
      this.usuarioSeleccionado.editadoPor = usuario.editadoPor;
  }

// Método para guardar los cambios del usuario editado
  guardarCambios() {
    // Objeto con datos especificos a guardar
    const datosAGuardar = {
      id_usuario: this.usuarioSeleccionado.id_usuario,
      id_responsable_lectura: this.usuarioSeleccionado.id_responsable_lectura,
      lectura_actual:this.usuarioSeleccionado.lectura_actual ,
      observaciones: this.usuarioSeleccionado.observaciones,
      //Esto asignará 1 a id_estado si usuarioSeleccionado.estado es true (es decir, si el switch está activado)
      estado_lectura: this.usuarioSeleccionado.estado_lectura ? 1 : 2, 
      editadoPor: this.responsableEncargado
    };
      //console.log("Datos actualizados",datosAGuardar);
      //Servicio para guardar los cambios
      const saveSubscription = this.localidadServices.tomarLectura(datosAGuardar).subscribe(() =>{
      //console.log("Datos actualizados",resultados);
      this.toastr.success("Datos actualizados con éxito");
      this.mostrarUsuariosxLoc();
    });
    // Agregar la suscripción al Subscription principal
    this.subscription.add(saveSubscription);
  }

  
// TODO: Contador de usuarios por estado de lectura
// 1 para usuarios con lectura realizada, 2 para usuarios con lectura pendiente
  private actualizarContadores() {
    // Reiniciar los contadores
    this.usuariosConLecturaRealizada = 0;
    this.usuariosConLecturaPendiente = 0;
    this.totalUsuarios = 0;
  
    // Contar usuarios por estado de lectura
    this.userxLoc.forEach(usuario => {
      if (usuario.estado_lectura === 1) {
        this.usuariosConLecturaRealizada++;
      } else if (usuario.estado_lectura === 2) {
        this.usuariosConLecturaPendiente++;
      }
    });

    // Contar todos los usuarios independientemente del estado_lectura
    this.totalUsuarios = this.userxLoc.length;
  }
  


  ngOnDestroy(): void {
    // Desuscribirse cuando el componente se destruye
    this.subscription.unsubscribe();
    
  }

}