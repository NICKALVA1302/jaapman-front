import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CarteraVA, CarteraVencidaService } from '../../services/cartera-vencida.service';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { Localidad } from '../../../../interfaces/localidad';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-view-reporte-cv',
  templateUrl: './view-reporte-cv.component.html',
  styleUrls: ['./view-reporte-cv.component.css']
})
export class ViewReporteCVComponent implements OnInit {
  localidades: Localidad[] = [];
  selectedLocalidadId: number | null = null;
  selectedTipoServicio: string = 'Agua';
  selectedAnio: string = '2023';
  @ViewChild('pdfContainer') pdfContainer: ElementRef | undefined;
  carteraVA: CarteraVA[] = [];

  constructor(private carteraVencidaService: CarteraVencidaService) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
  }

  ngOnInit(): void {
    this.obtenerLocalidades();
  }

  obtenerLocalidades(): void {
    this.carteraVencidaService.obtenerLocalidades().subscribe(
      (Localidad: Localidad[]) => {
        this.localidades = Localidad;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  obtenerCartera(): void {
    const fechaInicio = new Date(`${this.selectedAnio}-01-01`);
    const fechaFin = new Date(`${this.selectedAnio}-12-31`);
    if (this.selectedLocalidadId) {
      this.carteraVencidaService.obtenerCarteraVA(this.selectedTipoServicio, fechaInicio, fechaFin, this.selectedLocalidadId)
        .subscribe(data => {
          this.carteraVA = data;
        }, error => {
          console.error('Error al obtener la cartera vencida', error);
        });
    }
  }

  generarPdf(): void {
    if (this.selectedLocalidadId && this.carteraVA.length > 0) {
      const content: any[] = [];
      const fechaActual = new Date();
      const fechaFormateada = fechaActual.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

      function createLine(x1: number, y1: number, x2: number): object {
        return {
          type: 'line',
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y1,
          lineWidth: 1,
          lineColor: 'black'
        };
      }

      content.push({
        alignment: 'center',
        fontSize: 7,
        style: 'header',
        columns: [
          {
            fontSize: 15,
            characterSpacing: 10,
            alignment: 'center',
            stack: [
              {
                text: 'CARTERA VENCIDA ANUAL',
              },
              {
                canvas: [
                  createLine(0, 2, 250),
                  createLine(0, 4, 250)
                ]
              }
            ]
          },
          [
            'JUNTA ADMINISTRADORA DE AGUA POTABLE REGIONAL MANGLARALTO',
            '24900013639001 Calle 5 de junio via a Montañita junto al Colegio Fiscal Manglaralto'
          ]
        ],
        styles: {
          header: {
            alignment: 'justify'
          }
        }
      });

      const tableData = this.carteraVA.map(item => [
        item.localidad,
        item.anio,
        item.mes,
        item.total_con_descuento,
        item.total_sin_descuento,
        item.total_facturado,
        item.total_por_facturar,
        item.tipo_de_servicio
      ]);

      content.push({
        table: {
          headerRows: 1,
          widths: ['*', '*', '*', '*', '*', '*', '*', '*'],
          body: [
            [
              { text: 'Localidad', style: 'tableHeader' },
              { text: 'Año', style: 'tableHeader' },
              { text: 'Mes', style: 'tableHeader' },
              { text: 'Total con Descuento', style: 'tableHeader' },
              { text: 'Total sin Descuento', style: 'tableHeader' },
              { text: 'Total Facturado', style: 'tableHeader' },
              { text: 'Total por Facturar', style: 'tableHeader' },
              { text: 'Tipo de Servicio', style: 'tableHeader' }
            ],
            ...tableData
          ]
        },
        layout: 'lightHorizontalLines',
        style: 'tableExample'
      });

      const dd: TDocumentDefinitions = {
        content: content,
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          tableExample: {
            margin: [0, 5, 0, 15],
            alignment: 'center'
          },
          tableHeader: {
            bold: true,
            fontSize: 12,
            color: 'black'
          },
        }
      };

      const pdf = pdfMake.createPdf(dd);
      pdf.getBlob((blob: Blob) => {
        const url = URL.createObjectURL(blob);
        this.mostrarPdf(url);
      });
    } else {
      console.error('No se ha seleccionado ninguna localidad o no hay datos para generar el PDF');
    }
  }

  mostrarPdf(pdfUrl: string): void {
    if (this.pdfContainer) {
      const iframe = document.createElement('iframe');
      iframe.src = pdfUrl;
      iframe.width = '100%';
      iframe.height = '600px';
      iframe.style.maxWidth = '100%';
      iframe.style.maxHeight = '600px';
      this.pdfContainer.nativeElement.innerHTML = '';
      this.pdfContainer.nativeElement.appendChild(iframe);
    } else {
      console.error('pdfContainer is undefined');
    }
  }
}
