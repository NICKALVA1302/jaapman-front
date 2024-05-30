import { Component, ElementRef, ViewChild } from '@angular/core';
import { Localidad, UsuarioxLocalidad, Mantenimiento, MantenimientoDetalle } from '../../../models/localidades';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { MaterialService } from '../../../services/material.service';
import { Content, PageOrientation, TDocumentDefinitions } from 'pdfmake/interfaces';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reporte-material',
  templateUrl: './reporte-material.component.html',
  styleUrl: './reporte-material.component.css'
})
export class ReporteMaterialComponent {

  localidades: Localidad[] = [];
  selectedLocalidadId: number | null = null;
  usuarioxLocalidad: UsuarioxLocalidad[] = [];
  @ViewChild('pdfContainer') pdfContainer: ElementRef | undefined;

  constructor(private servicioReportes: MaterialService) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';

  }


  ngOnInit() {
    this.obtenerLocalidades();
  }


  obtenerLocalidades(): void {
    this.servicioReportes.obtenerLocalidades().subscribe(
      (localidades: Localidad[]) => {
        this.localidades = localidades;
        console.log('Localidades obtenidas:', this.localidades);
      },
      (error) => {
        console.error('Error al obtener localidades:', error);
      }
    );
  }

  obtenerIdLocalidadSeleccionada(event: any): void {
    const selectedValue = event.target.value;
    this.selectedLocalidadId = selectedValue;
    console.log(this.selectedLocalidadId);
    this.obtenerDatosClientes();
  }

  obtenerDatosClientes(): void {
    if (this.selectedLocalidadId) {
      this.servicioReportes.datosPorLocalidad(this.selectedLocalidadId).subscribe(
        (response: UsuarioxLocalidad[]) => {
          this.usuarioxLocalidad = response;
          console.log('Datos por localidad:', this.usuarioxLocalidad);
          // Llamar a la función para generar el PDF
        },
        (error) => {
          console.error('Error al obtener datos por localidad:', error);
        }
      );
    }
  }


  generarPdf(): void {
    if (!this.selectedLocalidadId || !this.usuarioxLocalidad.length) return;
  
    const fechaActual = new Date().toLocaleDateString('es-ES');
    const pageWidth = 520;
  
    // Crear un array para almacenar el contenido de cada usuario
    const userContents: Content[] = [];
  
    // Generar el contenido para cada usuario
    this.usuarioxLocalidad.forEach((user, userIndex) => {
      const userDetailsContent: Content[] = [
        // Línea azul superior
        {
          canvas: [{ type: 'line', x1: 0, y1: 0, x2: pageWidth, y2: 0, lineWidth: 2, lineColor: '#007bff' }]
        },
        { text: '\n\n' }, // Espacios
  
        { text: 'DETALLES DEL MANTENIMIENTO', style: 'header' },
        { text: '\n\n' }, // Espacios
        {
          alignment: 'center',
          fontSize: 15,
          bold: true,
          text: 'M A N T E N I M I E N T O'
        },
        { text: '\n' }, // Espacios
  
        // Líneas negras horizontales centradas
        {
          canvas: [
            { type: 'line', x1: (pageWidth - 300) / 2, y1: 0, x2: (pageWidth + 300) / 2, y2: 0, lineWidth: 1 },
            { type: 'line', x1: (pageWidth - 300) / 2, y1: 2, x2: (pageWidth + 300) / 2, y2: 2, lineWidth: 1 }
          ]
        },
        { text: '\n' }, // Espacios
  
        // Texto de dirección
        {
          alignment: 'center',
          text: 'JUNTA ADMINISTRADORA DE AGUA POTABLE REGIONAL MANGLARALTO\n24900013639001 Calle 5 de junio via a Montañita junto al Colegio Fiscal Manglaralto',
          fontSize: 10,
          bold: true
        },
        { text: '\n\n' }, // Espacios
  
        { text: 'DATOS DEL CLIENTE', style: 'header' },
        { text: '\n\n' }, // Espacios
  
        // Columnas para datos del cliente
        {
          columns: [
            {
              width: '50%',
              margin: [70, 0, 0, 0],
              stack: [
                {
                  text: [
                    { text: 'Nombre: ', style: 'boldText' },
                    { text: user.persona.nombre, style: 'normalText' },
  
                  ]
                },
                { text: '\n' },
                {
                  text: [
                    { text: 'Apellido: ', style: 'boldText' },
                    { text: user.persona.apellido, style: 'normalText' },
  
                  ]
                },
                { text: '\n' },
                {
                  text: [
                    { text: 'Cédula: ', style: 'boldText' },
                    { text: user.persona.cedula, style: 'normalText' },
  
                  ]
                },
                { text: '\n' },
                {
                  text: [
                    { text: 'Dirección: ', style: 'boldText' },
                    { text: user.persona.direccion, style: 'normalText' },
  
                  ]
                }
              ],
            },
            {
              width: '50%',
              margin: [70, 0, 0, 0],
              stack: [
                {
                  text: [
                    { text: 'Localidad: ', style: 'boldText' },
                    { text: user.localidad.nombre, style: 'normalText' },
  
                  ]
                },
                { text: '\n' },
                {
                  text: [
                    { text: 'Código del Medidor: ', style: 'boldText' },
                    { text: user.medidor.codigo || 'No asignado', style: 'normalText' },
  
                  ]
                },
                { text: '\n' },
                {
                  text: [
                    { text: 'Número: ', style: 'boldText' },
                    { text: user.id_persona.toString(), style: 'normalText' },
  
                  ]
                },
                { text: '\n' },
                {
                  text: [
                    { text: `Fecha: ${fechaActual}`, style: 'boldText' },
  
                  ]
                },
                { text: '\n\n\n' }
              ],
            }
          ]
        }
      ];
  
      // Agregar mantenimientos y tablas de materiales
      user.Mantenimientos.forEach((mantenimiento, index) => {
        userDetailsContent.push(
          { text: `MATERIALES VENDIDOS`, style: 'header' },
          { text: '\n' },
          // Tabla de materiales
          this.getMantenimientoTable(mantenimiento),
          { text: '\n' },
          { text: '\n' },
          { text: 'RESUMEN', style: 'header', alignment: 'center' },
          { text: '\n' },
          {
            columns: [
              { text: 'TARIFA:', bold: true, width: 'auto' },
              { text: `$${mantenimiento.Tarifa ? mantenimiento.Tarifa.valor : 0}`, style: 'normalText', fontSize: 13, margin: [5, 0, 0, 0]}
            ],
            alignment: 'left'
          },
          { text: '\n' },
          {
            columns: [
              { text: 'TOTAL:', bold: true, width: 'auto' },
              { text: `$${mantenimiento.total}`, style: 'normalText', fontSize: 13, margin: [5, 0, 0, 0]}
            ],
            alignment: 'left'
          },
          { text: '\n' },
          {
            columns: [
              { text: 'ESTADO DE PAGO:', bold: true, width: 'auto' },
              { text: `${mantenimiento.Estado_pago.nombre}`, style: 'normalText', fontSize: 13, margin: [5, 0, 0, 0]}
            ],
            alignment: 'left'
          },
          { text: '\n' },
          { text: '\n\n' },
            // Línea azul superior
        {
          canvas: [{ type: 'line', x1: 0, y1: 0, x2: pageWidth, y2: 0, lineWidth: 2, lineColor: '#007bff' }]
        },
        );
      });
      
      // Agregar el contenido del usuario al array de contenido y agregar salto de página
      if (userIndex < this.usuarioxLocalidad.length - 1) {
        userDetailsContent.push({ text: '', pageBreak: 'after' });
      }
      
      userContents.push(userDetailsContent);
    });
  
    // Crear las definiciones del PDF con una página por usuario
    const pdfDefinition: TDocumentDefinitions = {
      content: userContents,
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        boldText: {
          bold: true
        },
        normalText: {
          fontSize: 12
        }
      }
    };
  
    // Generar el PDF y actualizar el contenedor
    if (this.pdfContainer && this.pdfContainer.nativeElement) {
      const pdfDoc = pdfMake.createPdf(pdfDefinition);
      pdfDoc.getBlob((blob: Blob) => {
        const blobUrl = URL.createObjectURL(blob);
  
        // Verificar que pdfContainer y nativeElement no sean undefined antes de acceder a ellos
        if (this.pdfContainer && this.pdfContainer.nativeElement) {
          this.pdfContainer.nativeElement.innerHTML = `<iframe src="${blobUrl}" style="width: 100%; height: 500px;"></iframe>`;
        }
      });
    }
  }

  // Función para obtener la tabla de materiales de un mantenimiento
  getMantenimientoTable(mantenimiento: Mantenimiento): Content {
    const body: any[] = [];
    body.push(['Nº', 'MATERIAL', 'CANTIDAD', 'PRECIO VENTA', 'SUBTOTAL']);

    mantenimiento.mantenimiento_detalles.forEach((detalle: MantenimientoDetalle, index: number) => {
      body.push([
        index + 1,
        detalle.material.nombre,
        detalle.cantidad,
        `$${detalle.material.precio}`,
        `$${detalle.subtotal}`
      ]);
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

