import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatosPorLocalidad } from '../../models/localidades';
import { ViewUsuarioComponent } from '../view-usuario/view-usuario.component';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})

export class MantenimientoComponent {

  usuarioSeleccionado: DatosPorLocalidad | null = null;
  listaMateriales: any[] = [];
  listaTarifas: any[] = [];
  materialSeleccionado: number | null = null;
  cantidadMaterial: number | null = null;
  materialesSeleccionados: any[] = [];
  tarifaSeleccionadaId: number = 2; // Establecer la id de la tarifa predeterminada
  tarifaValor: number = 0; // Almacenar el valor de la tarifa
  aplicarTarifa: boolean = false;
  sumaTotal: number = 0;
  loading: boolean = false; 

  constructor(private modalService: NgbModal, private mantenimientoService: MantenimientoService, private toastr: ToastrService) { }

  async ngOnInit() {
    // Cargar datos iniciales (puedes hacer llamadas al servicio aquí para obtener las listas)
    await this.cargarListaMateriales();
    await this.cargarListaTarifas();
  }

  cargarListaMateriales() {
    this.mantenimientoService.listMateriales().subscribe((materiales) => {
      this.listaMateriales = materiales;
      console.log('Lista de Materiales:', this.listaMateriales);
    });
  }

  cargarListaTarifas() {
    this.mantenimientoService.listTarifa().subscribe((tarifas) => {
      this.listaTarifas = tarifas;
      console.log('Lista de Tarifas:', this.listaTarifas);
      this.seleccionarTarifaDefault(); // Llama a la función para seleccionar la tarifa predeterminada
    });
  }

  seleccionarTarifaDefault() {
    const tarifaDefault = this.listaTarifas.find(tarifa => tarifa.id_tarifa === this.tarifaSeleccionadaId);
    if (tarifaDefault) {
      this.tarifaValor = tarifaDefault.valor;
    }
  }

  // Método para agregar un material a la lista de materiales seleccionados
  agregarMaterial() {
    console.log('Material Seleccionado:', this.materialSeleccionado);
    console.log('Cantidad Material:', this.cantidadMaterial);

    if (
      this.materialSeleccionado !== null &&
      this.materialSeleccionado !== undefined &&
      this.cantidadMaterial !== null &&
      this.cantidadMaterial >= 1  // Asegura que la cantidad no sea negativa
    ) {
      const materialExistente = this.materialesSeleccionados.find(
        (m) => m.id_material === +this.materialSeleccionado!
      );

      if (materialExistente) {
        // Si el material ya existe, actualiza la cantidad
        materialExistente.cantidad += this.cantidadMaterial!;
        materialExistente.subtotal = materialExistente.precio * materialExistente.cantidad;
        this.toastr.info('Material actualizada en la lista', 'Actualizacion');

      } else {
        // Si el material no existe, agrégalo a la lista
        const material = this.listaMateriales.find(
          (m) => m.id_material === +this.materialSeleccionado!
        );

        if (material) {
          material.subtotal = material.precio * this.cantidadMaterial!; // Calcular el subtotal
          this.materialesSeleccionados.push({
            id_material: material.id_material,
            nombre: material.nombre,
            cantidad: this.cantidadMaterial,
            precio: material.precio,
            subtotal: material.subtotal,
          });
          this.toastr.success('Material agregado a la lista', 'Éxito');
        }
      }

      this.calcularSumaTotal(); // Recalcula la suma total

      console.log('Lista de Materiales Seleccionados:', this.materialesSeleccionados);

      // Reinicia la búsqueda del material y la cantidad
      this.materialSeleccionado = null;
      this.cantidadMaterial = null;
    } else if (this.cantidadMaterial !== null && this.cantidadMaterial < 1) {
      this.toastr.error('Por favor, ingrese una cantidad válida', 'Error');
    } else {
      this.toastr.error('Por favor, seleccione un material y ingrese una cantidad válida', 'Error');
    }
  }

  // Método para eliminar un material de la lista de materiales seleccionados
  eliminarMaterial(index: number) {
    this.materialesSeleccionados.splice(index, 1);
    this.calcularSumaTotal(); // Recalcula la suma total después de eliminar un material
  }

  // Método para calcular la suma total
  calcularSumaTotal() {
    console.log('aplicarTarifa:', this.aplicarTarifa);

    // Verificar si se debe aplicar una tarifa
    if (this.aplicarTarifa) {
      this.seleccionarTarifaDefault();
      this.toastr.success('Tarifa agregada', 'Información');
    } else {
      this.toastr.info('Tarifa no agregada', 'Información');
    }

    //Como utilizar sintaxis reduce 
    // array.reduce(callback(acumulador, elementoActual, índice, array), valorInicial)

    // const numeros = [1, 2, 3, 4, 5];

    // const suma = numeros.reduce((acumulador, numero) => acumulador + numero, 0);

    // console.log(suma); // Resultado: 15

    // Calcula la suma de los subtotales de los materiales seleccionados
    const sumaMateriales = this.materialesSeleccionados.reduce(
      (total, material) => total + material.subtotal, 0
    );

    // Suamr Tarifa
    this.sumaTotal = this.aplicarTarifa ? sumaMateriales + this.tarifaValor : sumaMateriales;

    console.log('Suma Total:', this.sumaTotal);
  }


  //SECCION DE MODAL DE BUSCAR USUARIO POR LOCALIDAD
  abrirModal() {
    const modalRef = this.modalService.open(ViewUsuarioComponent);
    modalRef.componentInstance.usuarioSeleccionado.subscribe((usuario: DatosPorLocalidad) => {
      this.usuarioSeleccionado = usuario; // Recibe el usuario seleccionado del modal
      this.autocompletarCampos();
    });
  }

  autocompletarCampos() {
    if (this.usuarioSeleccionado) {
      // Autocompletar los campos en el componente ViewCobroComponent con los datos del usuario seleccionado
      const { nombre, apellido, cedula, direccion, id_persona } = this.usuarioSeleccionado;
      // Asignar los valores a los campos del formulario
      document.getElementById('nombre')!.setAttribute('value', this.usuarioSeleccionado.nombre);
      document.getElementById('apellido')!.setAttribute('value', this.usuarioSeleccionado.apellido);
      document.getElementById('cedula')!.setAttribute('value', this.usuarioSeleccionado.cedula);
      document.getElementById('codigo')!.setAttribute('value', this.usuarioSeleccionado.usuarios[0].medidor.codigo); // Aquí se muestra el código del medidor
      document.getElementById('localidad')!.setAttribute('value', this.usuarioSeleccionado.usuarios[0].localidad.nombre); // Aquí se muestra el nombre de la localidad
      document.getElementById('direccion')!.setAttribute('value', this.usuarioSeleccionado.direccion);
      document.getElementById('id_persona')!.setAttribute('value', String(this.usuarioSeleccionado.id_persona));
      // Asignar otros valores a otros campos si es necesario
      this.toastr.success('Cliente seleccionado', 'Éxito');
    }
  }

  limpiarCampos() {
    // document.getElementById('nombre')!.setAttribute('value', '');
    // document.getElementById('apellido')!.setAttribute('value', '');
    // document.getElementById('cedula')!.setAttribute('value', '');
    // document.getElementById('codigo')!.setAttribute('value', '');
    // document.getElementById('localidad')!.setAttribute('value', '');
    // document.getElementById('direccion')!.setAttribute('value', '');
    // document.getElementById('id_persona')!.setAttribute('value', '');
    // Reiniciar la página
    location.reload();
  }


  // Método para guardar el mantenimiento
  guardarMantenimiento() {
    this.loading = true;
  
    if (!this.usuarioSeleccionado && this.materialesSeleccionados.length === 0) {
      this.toastr.warning('Selecciona un cliente y agrega al menos un material', 'Advertencia');
      this.loading = false;
      return;
    }
  
    if (!this.usuarioSeleccionado) {
      this.toastr.warning('Selecciona un cliente', 'Advertencia');
      this.loading = false;
      return;
    }
  
    if (this.materialesSeleccionados.length === 0) {
      this.toastr.warning('Agrega al menos un material', 'Advertencia');
      this.loading = false;
      return;
    }
  
    const id_usuario = this.usuarioSeleccionado.id_persona;
    const id_tarifa = this.aplicarTarifa ? this.tarifaSeleccionadaId : null;
    const materiales = this.materialesSeleccionados.map(material => ({
      id_material: material.id_material,
      cantidad: material.cantidad
    }));
  
    this.mantenimientoService.postAgregarMantenimiento(id_usuario, id_tarifa, materiales).subscribe(
      (response) => {
        this.toastr.success('Mantenimiento guardado correctamente', 'Éxito');
        this.limpiarCampos();
      },
      (error) => {
        console.error('Error al guardar el mantenimiento:', error);
        this.toastr.error('Error al guardar el mantenimiento', 'Error');
      },
      () => {
        this.loading = false; // Esto asegura que 'loading' se establezca en false incluso si hay un error
      }
    );
  }

}


