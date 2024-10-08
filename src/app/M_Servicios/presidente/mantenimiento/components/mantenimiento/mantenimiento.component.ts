import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import pdfMake from 'pdfmake/build/pdfmake';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { ViewUsuarioComponent } from '../../../materiales/components/view-usuario/view-usuario.component';
import { DatosPorLocalidad } from '../../../materiales/models/localidades';
import { MantenimientoService } from '../../services/mantenimiento.service';
// Cargar las fuentes de PDFMake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  id_estado_pago: number = 2;

  @ViewChild('pdfContainer') pdfContainer: ElementRef | undefined;

  constructor(private modalService: NgbModal, private mantenimientoService: MantenimientoService, private toastr: ToastrService) { pdfDefaultOptions.assetsFolder = 'bleeding-edge'; }

  async ngOnInit() {
    // Cargar datos iniciales (puedes hacer llamadas al servicio aquí para obtener las listas)
    await this.cargarListaMateriales();
    await this.cargarListaTarifas();
  }

  cargarListaMateriales() {
    this.mantenimientoService.listMateriales().subscribe((materiales) => {
      // Filtrar los materiales activos (estado = 'ACTIVO')
      this.listaMateriales = materiales.filter(material => material.id_estado === 1);
      console.log('Lista de Materiales:', this.listaMateriales);
    });
  }

  // cargarListaMateriales() {
  //   this.mantenimientoService.listMateriales().subscribe((materiales) => {
  //     this.listaMateriales = materiales;
  //     console.log('Lista de Materiales:', this.listaMateriales);
  //   });
  // }

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
  
    // Convertir cantidadMaterial a un número si no es null
    const cantidadMaterial = this.cantidadMaterial ?? 0;
  
    if (
      this.materialSeleccionado !== null &&
      this.materialSeleccionado !== undefined &&
      cantidadMaterial > 0  // Asegura que la cantidad sea positiva
    ) {
      // Buscar el material seleccionado
      const material = this.listaMateriales.find(m => m.id_material === +this.materialSeleccionado!);
  
      if (material) {
        // Obtener la cantidad total del material en la lista de materiales seleccionados
        const cantidadTotalActual = this.obtenerCantidadTotalDeMaterial(material.id_material);
        // Calcular el stock restante
        const stockRestante = material.stock - cantidadTotalActual;
  
        if (stockRestante <= 0) {
          // Si el stock es cero o menor, mostrar mensaje de material agotado
          this.toastr.warning(`Se ha agotado el stock del "${material.nombre}"`, 'Advertencia');
          return;
        } else if (cantidadMaterial > stockRestante) {
          // Si la cantidad solicitada supera el stock restante, mostrar mensaje con el stock restante
          this.toastr.warning(`No hay suficiente stock para "${material.nombre}". Stock restante: ${stockRestante}`, 'Advertencia');
          return;
        }
  
        const materialExistente = this.materialesSeleccionados.find(m => m.id_material === +this.materialSeleccionado!);
  
        if (materialExistente) {
          // Si el material ya existe, actualiza la cantidad y el subtotal
          const nuevaCantidad = materialExistente.cantidad + cantidadMaterial;
          const nuevoStockRestante = material.stock - this.obtenerCantidadTotalDeMaterial(material.id_material) + materialExistente.cantidad;
  
          if (nuevaCantidad > nuevoStockRestante) {
            // Si la nueva cantidad supera el stock restante, mostrar mensaje de insuficiencia de stock
            this.toastr.warning(`No hay suficiente stock para "${material.nombre}". Stock restante: ${nuevoStockRestante}`, 'Advertencia');
            return;
          }
  
          // Actualizar la cantidad y el subtotal
          materialExistente.cantidad += cantidadMaterial;
          materialExistente.subtotal = materialExistente.precio * materialExistente.cantidad;
          this.toastr.info('Material actualizado en la lista', 'Actualización');
        } else {
          // Si el material no existe, agrégalo a la lista
          if (material) {
            const nuevoStockRestante = material.stock - this.obtenerCantidadTotalDeMaterial(material.id_material);
  
            if (cantidadMaterial > nuevoStockRestante) {
              // Si la cantidad solicitada supera el stock restante, mostrar mensaje de insuficiencia de stock
              this.toastr.warning(`No hay suficiente stock para "${material.nombre}". Stock restante: ${nuevoStockRestante}`, 'Advertencia');
              return;
            }
  
            material.subtotal = material.precio * cantidadMaterial; // Calcular el subtotal
            this.materialesSeleccionados.push({
              id_material: material.id_material,
              nombre: material.nombre,
              cantidad: cantidadMaterial,
              precio: material.precio,
              subtotal: material.subtotal,
            });
            this.toastr.success('Material agregado a la lista', 'Éxito');
          }
        }
  
        this.calcularSumaTotal(); // Recalcula la suma total
  
        console.log('Lista de Materiales Seleccionados:', this.materialesSeleccionados);
  
        // Reinicia la búsqueda del material y la cantidad
        this.materialSeleccionado = 0;
        this.cantidadMaterial = null;
      }
    } else if (cantidadMaterial <= 0) {
      this.toastr.error('Por favor, ingrese una cantidad válida', 'Error');
    } else {
      this.toastr.error('Por favor, seleccione un material y una cantidad válida', 'Error');
    }
  }
  
  // Método para obtener la cantidad total del material en la lista de materiales seleccionados
  obtenerCantidadTotalDeMaterial(id_material: number): number {
    return this.materialesSeleccionados
      .filter(m => m.id_material === id_material)
      .reduce((total, m) => total + m.cantidad, 0);
  }

  // Método para eliminar un material de la lista de materiales seleccionados
  eliminarMaterial(index: number) {
    this.materialesSeleccionados.splice(index, 1);
    this.calcularSumaTotal(); // Recalcula la suma total después de eliminar un material
  }

  // Método para calcular la suma total
  calcularSumaTotal() {
    console.log('aplicarTarifa:', this.aplicarTarifa);

    // Si se debe aplicar la tarifa, agregarla al listado de materiales seleccionados
    if (this.aplicarTarifa) {
      this.seleccionarTarifaDefault();
      // Verificar si la tarifa ya está en el listado
      const tarifaExistente = this.materialesSeleccionados.find(m => m.nombre === 'TARIFA');

      if (!tarifaExistente) {
        // Si no está, agregarla
        this.materialesSeleccionados.push({
          id_material: -1, // No tiene ID de material porque es una tarifa
          nombre: 'TARIFA',
          cantidad: 1,
          precio: this.tarifaValor,
          subtotal: this.tarifaValor,
        });
        this.toastr.success('Tarifa agregada al listado', 'Éxito');
      }
    } else {
      // Si no se debe aplicar la tarifa, eliminarla del listado
      const indexTarifa = this.materialesSeleccionados.findIndex(m => m.nombre === 'TARIFA');
      if (indexTarifa !== -1) {
        this.materialesSeleccionados.splice(indexTarifa, 1);
        this.toastr.info('Tarifa eliminada del listado', 'Información');
      }
    }

    // Calcula la suma de los subtotales de los materiales seleccionados
    const sumaMateriales = this.materialesSeleccionados.reduce(
      (total, material) => total + material.subtotal, 0
    );

    // Asignar la suma total
    this.sumaTotal = sumaMateriales;

    console.log('Suma Total:', this.sumaTotal);
  }

  // Método para manejar el cambio en el checkbox de la tarifa
  toggleTarifa() {
    this.calcularSumaTotal();
  }

  // // Método para calcular la suma total
  // calcularSumaTotal() {
  //   console.log('aplicarTarifa:', this.aplicarTarifa);

  //   // Verificar si se debe aplicar una tarifa
  //   if (this.aplicarTarifa) {
  //     this.seleccionarTarifaDefault();
  //     this.toastr.success('Tarifa agregada', 'Información');
  //   } else {
  //     this.toastr.info('Tarifa no agregada', 'Información');
  //   }

  //   // Calcula la suma de los subtotales de los materiales seleccionados
  //   const sumaMateriales = this.materialesSeleccionados.reduce(
  //     (total, material) => total + material.subtotal, 0
  //   );

  //   // Suma la tarifa si aplica
  //   this.sumaTotal = this.aplicarTarifa ? sumaMateriales + this.tarifaValor : sumaMateriales;

  //   console.log('Suma Total:', this.sumaTotal);
  // }


  // SECCION DE MODAL DE BUSCAR USUARIO POR LOCALIDAD
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
    document.getElementById('nombre')!.setAttribute('value', '');
    document.getElementById('apellido')!.setAttribute('value', '');
    document.getElementById('cedula')!.setAttribute('value', '');
    document.getElementById('codigo')!.setAttribute('value', '');
    document.getElementById('localidad')!.setAttribute('value', '');
    document.getElementById('direccion')!.setAttribute('value', '');
    document.getElementById('id_persona')!.setAttribute('value', '');

    this.usuarioSeleccionado = null; // Restablecer el cliente seleccionado
    this.materialesSeleccionados = []; // Limpiar la lista de materiales seleccionados
    this.materialSeleccionado = null; // Restablecer el material seleccionado
    this.cantidadMaterial = null; // Restablecer la cantidad de material
    this.aplicarTarifa = false; // Restablecer la selección de tarifa
    this.sumaTotal = 0; // Restablecer la suma total
  }


  // Método para verificar el stock antes de agregar el mantenimiento
  verificarStock(): boolean {
    for (const materialSeleccionado of this.materialesSeleccionados) {
      const material = this.listaMateriales.find(m => m.id_material === materialSeleccionado.id_material);
      if (material && material.stock < materialSeleccionado.cantidad) {
        this.toastr.warning(`No hay suficiente stock para el material: ${material.nombre}`, 'Advertencia');
        return false; // Detener la verificación si no hay suficiente stock
      }
    }
    return true; // Todos los materiales tienen suficiente stock
  }


  // Método para guardar el mantenimiento
guardarMantenimiento() {
  this.loading = true;

  // Filtrar materiales para excluir la tarifa antes de hacer las verificaciones
  const materialesSinTarifa = this.materialesSeleccionados.filter(material => material.id_material !== -1);

  // Verificar si se ha seleccionado un cliente
  if (!this.usuarioSeleccionado) {
    this.toastr.warning('Selecciona un cliente', 'Advertencia');
    this.loading = false;
    return;
  }

  // Verificar si hay al menos un material válido (excluyendo la tarifa)
  if (materialesSinTarifa.length === 0) {
    this.toastr.warning('Agrega al menos un material', 'Advertencia');
    this.loading = false;
    return;
  }

  // Verificar stock
  if (!this.verificarStock()) {
    this.loading = false;
    return; // Detener la operación si no hay suficiente stock
  }

  const id_usuario = this.usuarioSeleccionado.id_persona;
  const id_tarifa = this.aplicarTarifa ? this.tarifaSeleccionadaId : null;
  const id_estado_pago = this.id_estado_pago; // Obtén el valor de id_estado_pago

  // Preparar los datos de materiales excluyendo la tarifa
  const materiales = materialesSinTarifa.map(material => ({
    id_material: material.id_material,
    cantidad: material.cantidad
  }));

  // Verificar si hay materiales para enviar
  if (materiales.length === 0) {
    this.toastr.warning('Agrega al menos un material válido', 'Advertencia');
    this.loading = false;
    return;
  }

  this.mantenimientoService.postAgregarMantenimiento(id_usuario, id_tarifa, id_estado_pago, materiales).subscribe(
    (response) => {
      this.toastr.success('Mantenimiento guardado correctamente', 'Éxito');
      this.cargarListaMateriales();
    },
    (error) => {
      console.error('Error al guardar el mantenimiento:', error);
      this.toastr.error('Error al guardar el mantenimiento', 'Error');
    },
    () => {
      this.loading = false;
    }
  );
}

  // Método para generar el PDF
  generarPdf() {
    // Función para crear la línea
    function createLine(x1: number, y1: number, x2: number, color: string = 'black'): any {
      return {
        type: 'line',
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y1,
        lineWidth: 2,
        lineColor: color // Color de la línea
      };
    }


    const pageWidth = 520; // Ancho total de la página

    const fechaActual = new Date().toLocaleDateString('es-ES');

    // Obtener el valor de la tarifa o establecerlo en 0 si no hay valor
    const tarifaValor = (this.tarifaValor !== undefined && this.tarifaValor !== null) ? this.tarifaValor : 0;

    const docDefinition: TDocumentDefinitions = {
      content: [
        // Línea azul inicio
        {
          canvas: [
            createLine(0, 5, pageWidth, '#007bff')
          ]
        },
        { text: '\n' },
        { text: 'DETALLES DEL MANTENIMIENTO', style: 'header' },
        { text: '\n' },
        {
          alignment: 'center',
          fontSize: 15,
          bold: true,
          text: 'M A N T E N I M I E N T O'
        },

        {
          canvas: [
            createLine((pageWidth - 300) / 2, 5, (pageWidth + 300) / 2), // Primera línea negra centrada y más larga
            createLine((pageWidth - 300) / 2, 7, (pageWidth + 300) / 2)  // Segunda línea negra centrada y más larga
          ]
        },
        { text: '\n' },
        {
          alignment: 'center',
          text: 'JUNTA ADMINISTRADORA DE AGUA POTABLE REGIONAL MANGLARALTO 24900013639001 Calle 5 de junio via a Montañita junto al Colegio Fiscal Manglaralto',
          fontSize: 10,
          bold: true
        },
        { text: '\n' },
        { text: '\n' },
        { text: 'DATOS DEL CLIENTE', style: 'header' },
        { text: '\n' },
        {
          columns: [
            {
              width: '50%',
              margin: [70, 0, 0, 0],
              stack: [
                {
                  text: [
                    { text: 'Nombre: ', style: 'boldText' },
                    { text: `${document.getElementById('nombre')!.getAttribute('value') || ''}`, style: 'normalText' }
                  ]
                },
                { text: '\n' },
                {
                  text: [
                    { text: 'Apellido: ', style: 'boldText' },
                    { text: `${document.getElementById('apellido')!.getAttribute('value') || ''}`, style: 'normalText' }
                  ]
                },
                { text: '\n' },
                {
                  text: [
                    { text: 'Cédula: ', style: 'boldText' },
                    { text: `${document.getElementById('cedula')!.getAttribute('value') || ''}`, style: 'normalText' }
                  ]
                },
                { text: '\n' },
                {
                  text: [
                    { text: 'Dirección: ', style: 'boldText' },
                    { text: `${document.getElementById('direccion')!.getAttribute('value') || ''}`, style: 'normalText' }
                  ]
                }
              ]
            },
            {
              width: '50%',
              margin: [70, 0, 0, 0],
              stack: [
                {
                  text: [
                    { text: 'Localidad: ', style: 'boldText' },
                    { text: `${document.getElementById('localidad')!.getAttribute('value') || ''}`, style: 'normalText' }
                  ]
                },
                { text: '\n' },
                {
                  text: [
                    { text: 'Código del Medidor: ', style: 'boldText' },
                    { text: `${document.getElementById('codigo')!.getAttribute('value') || ''}`, style: 'normalText' }
                  ]
                },
                { text: '\n' },
                {
                  text: [
                    { text: 'Número: ', style: 'boldText' },
                    { text: `${document.getElementById('id_persona')!.getAttribute('value') || ''}`, style: 'normalText' }
                  ]
                },
                { text: '\n' },
                { text: `Fecha: ${fechaActual}`, style: 'boldText' }
              ]
            }
          ]
        },
        { text: '\n' },
        { text: '\n' },
        { text: 'MATERIALES VENDIDOS', style: 'header' },
        { text: '\n' },
        this.getMaterialesSeleccionadosTable(),
        { text: '\n' },
        // Sección de resumen 
        {
          alignment: 'right', // Alinea el contenedor a la derecha
          style: 'resumenSection',

          columns: [
            { width: '*', text: '' }, // Columna vacía para alinear a la derecha
            {
              width: 'auto', // Ancho ajustado al contenido
              stack: [
                { text: 'RESUMEN', style: 'tableHeader', alignment: 'center' }, // Título del resumen
                { text: '\n' },
                {
                  text: `TARIFA: ${this.aplicarTarifa ? '$' + tarifaValor : '$0'}`, alignment: 'right', style: 'boldText', fontSize: 13,
                  margin: [0, 0, 15, 0],
                }, // Valor de la tarifa, si está definida; de lo contrario, muestra 0
                { text: '\n' },
                { text: `TOTAL: $${this.sumaTotal}`, style: 'tableHeader', alignment: 'right', fontSize: 13 }, // Total
                { text: '\n' },
              ],
              alignment: 'right', // Alinea el bloque a la derecha
              margin: [0, 10, 0, 10], // Margen negro
            }
          ]
        },
        // Línea azul final
        {
          canvas: [
            createLine(0, 5, pageWidth, '#007bff') // Línea color azul
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        normalText: {
          fontSize: 12
        },
        boldText: {
          bold: true
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        tableExampleResumen: {
          margin: [0, 5, 0, 15]
        },
        resumenSection: {
          margin: [0, 10, 0, 10] // Margen superior e inferior
        }
      },

      pageMargins: [40, 60, 40, 60] // Márgenes izquierdo, superior, derecho, inferior
    };

    // // Agregar logo
    // const logoWidth = 60; // Ancho de la imagen de logo
    // const logoHeight = 60; // Alto de la imagen de logo
    // const logoMargin = 10; // Margen de la imagen de logo desde el borde derecho y superior
    // const logo = {
    //   image: '../../../assets/img/OIP.png', // Ruta a tu imagen de logo
    //   width: logoWidth,
    //   height: logoHeight,
    //   absolutePosition: {
    //     x: pageWidth - logoWidth - logoMargin, // Posición X desde el borde derecho
    //     y: logoMargin // Posición Y desde el borde superior
    //   },
    //   opacity: 0.5 // Opacidad de la imagen 

    // };

    // const content = docDefinition.content;

    // docDefinition.content = [];

    // docDefinition.content.push(logo);

    // docDefinition.content.push(content);

    // Generar el PDF 
    const pdfDoc = pdfMake.createPdf(docDefinition);

    // Abrir pdf
    pdfDoc.open();

    // Descargar el PDF
    // pdfDoc.download('detalles_mantenimiento.pdf');
  }

  // Método para obtener la tabla de materiales seleccionados
  getMaterialesSeleccionadosTable() {
    const body = [];
    body.push(['Nº', 'MATERIAL', 'CANTIDAD', 'PRECIO VENTA', 'SUBTOTAL']);
    this.materialesSeleccionados.forEach((material, index) => {
      body.push([index + 1, material.nombre, material.cantidad, `$${material.precio}`, `$${material.subtotal}`]);
    });

    return {
      table: {
        headerRows: 1,
        widths: ['auto', '*', '*', '*', '*'],
        body: body
      }
    };
  }
}

