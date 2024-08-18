import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CarteraVA, CarteraVencidaService, GeneralCarteraVA } from '../../services/cartera-vencida.service';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { Localidad } from '../../../../interfaces/localidad';
import { Chart, registerables } from 'chart.js';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-view-reporte-cv',
  templateUrl: './view-reporte-cv.component.html',
  styleUrls: ['./view-reporte-cv.component.css']
})

//ESTO ES VIEJO Y MUY EXTENSO YA ME ESTABA MAREANDO HACERLO ASI
export class ViewReporteCVComponent implements OnInit {
  localidades: Localidad[] = [];
  selectedLocalidadId: number | null = null;
  selectedTipoServicio: string | null = null;
  selectedAnio: string | null = null;
  years: number[] = [];
  startYear: number = new Date().getFullYear() - 5;  // Establece el año inicial

  @ViewChild('pdfContainer') pdfContainer: ElementRef | undefined;
  carteraVA: CarteraVA[] = [];
  GeneralCarteraVA: GeneralCarteraVA[] = [];
  chart: any;

  // Variables de estado para el loader y el mensaje de error
  isLoading = false;
  errorMessage = '';

  constructor(private carteraVencidaService: CarteraVencidaService) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.obtenerLocalidades();
    this.generateYears();
  }

  generateYears(): void {
    const currentYear = new Date().getFullYear();
    const maxYear = this.startYear + 10;  // Establece el máximo año 10 años después del año inicial

    // Genera años desde el año inicial hasta el máximo año
    if (this.years.length === 0) {  // Si la lista está vacía, inicializa la lista
      for (let year = this.startYear; year <= maxYear; year++) {
        this.years.push(year);
      }
    } else {  // Si no, simplemente añade el nuevo año al final si es necesario
      const lastYear = this.years[this.years.length - 1];
      if (lastYear < currentYear + 5) {
        for (let year = lastYear + 1; year <= currentYear + 5; year++) {
          this.years.push(year);
        }
      }
    }
  }

  obtenerLocalidades(): void {
    this.carteraVencidaService.obtenerLocalidades().subscribe(
      localidades => {
        this.localidades = localidades;
      },
      error => {
        console.error('Error al cargar localidades:', error);
      }
    );
  }

  obtenerCartera(): void {
    if (this.selectedLocalidadId && this.selectedTipoServicio && this.selectedAnio) {
      const fechaInicio = new Date(`${this.selectedAnio}-01-01`);
      const fechaFin = new Date(`${this.selectedAnio}-12-31`);
      this.carteraVencidaService.obtenerCarteraVA(this.selectedTipoServicio, fechaInicio, fechaFin, this.selectedLocalidadId).subscribe(
        data => {
          this.carteraVA = data;
          this.generarPdf(); // Llama a generar PDF independientemente de si hay datos o no
        },
        error => {
          console.error('Error al obtener la cartera vencida:', error);
        }
      );
    } else {
      alert('Por favor, seleccione una localidad, un tipo de servicio y un año para generar el reporte.');
    }
  }

  obtenerCarteraGeneral(): void{
    if (this.selectedTipoServicio && this.selectedAnio) {
      const fechaInicio = new Date(`${this.selectedAnio}-01-01`);
      const fechaFin = new Date(`${this.selectedAnio}-12-31`);
      this.carteraVencidaService.obtenerGeneralCarteraVA(this.selectedTipoServicio, fechaInicio, fechaFin).subscribe(
        data => {
          this.GeneralCarteraVA = data;
          this.generarPdfGeneral(); // Llama a generar PDF independientemente de si hay datos o no
        },
        error => {
          console.error('Error al obtener la cartera vencida:', error);
        }
      );
    } else {
      alert('Por favor, seleccione un tipo de servicio y un año para generar el reporte General.');
    }
  }
  
  generarPdfGeneral(): void {
    const content: any[] = [];
    const currentDate = new Date().toLocaleDateString('es-ES');
  
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
  
    // Encabezado con diseño específico
    content.push({
      alignment: 'center',
      style: 'header',
      columns: [
        {
          width: '*',
          text: ''
        },
        {
          width: 'auto',
          stack: [
            { text: 'CARTERA VENCIDA ANUAL', fontSize: 15, characterSpacing: 10, alignment: 'center' },
            { canvas: [createLine(0, 5, 515), createLine(0, 10, 515)] },
            { text: 'JUNTA ADMINISTRADORA DE AGUA POTABLE REGIONAL MANGLARALTO', fontSize: 12, margin: [0, 10, 0, 0] },
            { text: '24900013639001 Calle 5 de junio vía a Montañita junto al Colegio Fiscal Manglaralto', fontSize: 12 }
          ]
        },
        {
          width: '*',
          text: ''
        }
      ],
      columnGap: 10
    });
  

  if (this.GeneralCarteraVA.length > 0) {
    const firstItem = this.GeneralCarteraVA[0];  // Asumiendo que todos los items tienen la misma localidad, año, etc.

    content.push({
      columns: [
        { text: `Localidad:  Todas las localidades`, style: 'infoText' },
        { text: `Tipo de Servicio: ${this.selectedTipoServicio}`, style: 'infoText', alignment: 'right' },
      ]
    });

    content.push({
      columns: [
        { text: `Año: ${firstItem.anio}`, style: 'infoText' },
        { text: `Generado: ${currentDate}`, style: 'infoText', alignment: 'right' }
      ]
    });

    content.push(this.createContentWithData(this.GeneralCarteraVA));
  } else {
    content.push({
      text: 'No hay datos disponibles para el servicio o año seleccionado.',
      style: 'noData',
      alignment: 'center',
      margin: [0, 20, 0, 0]
    });
  }
  
    const dd: TDocumentDefinitions = {
      content: content,
      styles: {
        header: {
          bold: true,
          fontSize: 16,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        infoText: {
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        noData: {
          fontSize: 14,
          bold: true
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black'
        }
      },
      pageSize: 'A4',
      pageOrientation: 'landscape'
    };
  
    const pdf = pdfMake.createPdf(dd);
    pdf.getBlob(blob => {
      const url = URL.createObjectURL(blob);
      this.mostrarPdf(url);
    });
  }

  createContentWithData(data: GeneralCarteraVA[]): any {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const tableBody = [
      ['Mes', 'Total con Descuento', 'Total sin Descuento', 'Total Facturado', 'Total por Facturar'].map(header => ({ text: header, style: 'tableHeader' })),
      ...data.map(item => [
        monthNames[item.mes - 1], // Convert month number to name
        `$${item.total_con_descuento.toFixed(2)}`,
        `$${item.total_sin_descuento.toFixed(2)}`,
        `$${item.total_facturado.toFixed(2)}`,
        `$${item.total_por_facturar.toFixed(2)}`
      ])
    ];
  
    return {
      table: {
        headerRows: 1,
        widths: ['*', '*', '*', '*', '*'],
        body: tableBody
      },
      layout: 'lightHorizontalLines'
    };
  }
  

  mostrarPdf(pdfUrl: string): void {
    if (this.pdfContainer) {
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '500px';
      iframe.src = pdfUrl;
      this.pdfContainer.nativeElement.innerHTML = '';
      this.pdfContainer.nativeElement.appendChild(iframe);
    }
  }

  obtenerNombreMes(mes: number): string {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return meses[mes - 1];
  }

  generarGrafico(data: GeneralCarteraVA[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const labels = data.map(item => this.obtenerNombreMes(item.mes));
      const totalFacturado = data.map(item => item.total_facturado);
  
      // Usar el canvas oculto
      const canvas = document.getElementById('hiddenChart') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
  
      if (!ctx) {
        reject('No se pudo obtener el contexto 2D del canvas');
        return;
      }
  
      // Destruir el gráfico anterior si existe
      if (this.chart) {
        this.chart.destroy();
      }
  
      try {
        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Total Facturado',
                data: totalFacturado,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
  
        setTimeout(() => {
          const chartImage = canvas.toDataURL('image/png');
          if (chartImage && chartImage.startsWith('data:image/png')) {
            resolve(chartImage);
          } else {
            reject('El dataURL generado es inválido');
          }
        }, 500);
  
      } catch (error) {
        reject(`Error al configurar el gráfico: ${error}`);
      }
    });
  }
  
  generarPdf(): void {
    this.isLoading = true;
    const content: any[] = [];
    const currentDate = new Date().toLocaleDateString('es-ES');
  
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
      style: 'header',
      columns: [
        {
          width: '*',
          text: ''
        },
        {
          width: 'auto',
          stack: [
            { text: 'CARTERA VENCIDA ANUAL', fontSize: 15, characterSpacing: 10, alignment: 'center' },
            { canvas: [createLine(0, 5, 515), createLine(0, 10, 515)] },
            { text: 'JUNTA ADMINISTRADORA DE AGUA POTABLE REGIONAL MANGLARALTO', fontSize: 12, margin: [0, 10, 0, 0] },
            { text: '24900013639001 Calle 5 de junio vía a Montañita junto al Colegio Fiscal Manglaralto', fontSize: 12 }
          ]
        },
        {
          width: '*',
          text: ''
        }
      ],
      columnGap: 10
    });
  
    if (this.carteraVA.length > 0) {
      const firstItem = this.carteraVA[0];
  
      content.push({
        columns: [
          { text: `Localidad: ${firstItem.localidad}`, style: 'infoText' },
          { text: `Tipo de Servicio: ${this.selectedTipoServicio}`, style: 'infoText', alignment: 'right' },
        ]
      });
  
      content.push({
        columns: [
          { text: `Año: ${firstItem.anio}`, style: 'infoText' },
          { text: `Generado: ${currentDate}`, style: 'infoText', alignment: 'right' }
        ]
      });
  
      content.push(this.createContentWithData(this.carteraVA));
  
      this.generarGrafico(this.carteraVA).then((chartImage) => {
        content.push({
          image: chartImage,
          width: 500,
          alignment: 'center',
          margin: [0, 20, 0, 0]
        });
  
        const dd: TDocumentDefinitions = {
          content: content,
          styles: {
            header: {
              bold: true,
              fontSize: 16,
              alignment: 'center',
              margin: [0, 0, 0, 20]
            },
            infoText: {
              fontSize: 12,
              bold: true,
              margin: [0, 0, 0, 10]
            },
            noData: {
              fontSize: 14,
              bold: true
            },
            tableHeader: {
              bold: true,
              fontSize: 12,
              color: 'black'
            }
          },
          pageSize: 'A4',
          pageOrientation: 'landscape'
        };
  
        const pdf = pdfMake.createPdf(dd);
        pdf.getBlob(blob => {
          const url = URL.createObjectURL(blob);
          this.mostrarPdf(url);
          this.isLoading = false;
        });
      }).catch(error => {
        this.isLoading = false;
        this.errorMessage = `Error al generar el gráfico: ${error}`;
        console.error('Error al generar el gráfico:', error);
      });
    } else {
      this.isLoading = false;
      content.push({
        text: 'No hay datos disponibles para el servicio o año seleccionado.',
        style: 'noData',
        alignment: 'center',
        margin: [0, 20, 0, 0]
      });
  
      const dd: TDocumentDefinitions = {
        content: content,
        styles: {
          header: {
            bold: true,
            fontSize: 16,
            alignment: 'center',
            margin: [0, 0, 0, 20]
          },
          infoText: {
            fontSize: 12,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          noData: {
            fontSize: 14,
            bold: true
          },
          tableHeader: {
            bold: true,
            fontSize: 12,
            color: 'black'
          }
        },
        pageSize: 'A4',
        pageOrientation: 'landscape'
      };
  
      const pdf = pdfMake.createPdf(dd);
      pdf.getBlob(blob => {
        const url = URL.createObjectURL(blob);
        this.mostrarPdf(url);
      });
    }
  }
}
//ESTO ES VIEJO Y MUY EXTENSO YA ME ESTABA MAREANDO HACERLO ASI