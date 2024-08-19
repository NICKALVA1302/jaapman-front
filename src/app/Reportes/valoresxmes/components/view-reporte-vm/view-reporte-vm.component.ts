import { Component, ElementRef, ViewChild } from '@angular/core';
import { Localidad } from '../../../../interfaces/localidad';
import { ValoresMes, ValoresMesService } from '../../services/valores-mes.service';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { style } from '@angular/animations';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
type MonthKey = 'Enero' | 'Febrero' | 'Marzo' | 'Abril' | 'Mayo' | 'Junio' |
                 'Julio' | 'Agosto' | 'Septiembre' | 'Octubre' | 'Noviembre' | 'Diciembre';

@Component({
  selector: 'app-view-reporte-vm',
  templateUrl: './view-reporte-vm.component.html',
  styleUrl: './view-reporte-vm.component.css'
})
export class ViewReporteVmComponent {
  localidades: Localidad[] = [];
  selectedLocalidadId: number | null = null;
  selectedTipoServicio: string | null = null;
  selectedAnio: number | null = null;
  selectedMes: MonthKey | null = null;
  years: number[] = [];
  startYear: number = new Date().getFullYear() - 5;  // Establece el año inicial


  @ViewChild('pdfContainer') pdfContainer: ElementRef | undefined;
  valoresMes: ValoresMes[] = [];
  constructor(private valoresMesService: ValoresMesService) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
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
    this.valoresMesService.obtenerLocalidades().subscribe(
      localidades => {
        this.localidades = localidades;
      },
      error => {
        console.error('Error al cargar localidades:', error);
      }
    );
  }
    
  obtenerValores(): void {
    if (this.selectedLocalidadId && this.selectedTipoServicio && this.selectedAnio && this.selectedMes) {
      const monthMapping: Record<MonthKey, string> = {
        Enero: "01", Febrero: "02", Marzo: "03", Abril: "04", Mayo: "05", Junio: "06",
        Julio: "07", Agosto: "08", Septiembre: "09", Octubre: "10", Noviembre: "11", Diciembre: "12"
      };
  
      const monthNumber = monthMapping[this.selectedMes as MonthKey]; // Cast como MonthKey
  
      const fechaInicio = `${this.selectedAnio}-${monthNumber}-01`;
      const fechaFin = `${this.selectedAnio}-${monthNumber}-${new Date(this.selectedAnio, parseInt(monthNumber) - 1, 0).getDate()}`;
  
      this.valoresMesService.obtenerValoresxmes(this.selectedTipoServicio, fechaInicio, fechaFin, this.selectedLocalidadId).subscribe(
        data => {
          this.valoresMes = data;
          console.log(this.valoresMes);
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

  generarPdf(): void {
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


    if (this.valoresMes.length > 0) {
      const firstItem = this.valoresMes[0];  // Asumiendo que todos los items tienen la misma localidad, año, etc.

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

      content.push(this.createContentWithData(this.valoresMes));
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

  createContentWithData(data: ValoresMes[]): any {
    const headers = [
        { text: 'Fecha', style: 'tableHeader' },
        { text: 'Cedula', style: 'tableHeader'},
        { text: 'Cliente', style: 'tableHeader' },
        { text: 'Direccion', style: 'tableHeader'},
        { text: 'Telefono', style: 'tableHeader'},
        { text: 'Email', style: 'tableHeader'},
        { text: 'Total', style: 'tableHeader' }
    ];

    const body = data.map(item => {
        const fechaObj = new Date(item.fecha);
        return [
            { text: fechaObj.toLocaleDateString(), style: 'tableData' },
            { text: item.cedula, style: 'tableData' },
            { text: item.cliente, style: 'tableData' },
            { text: item.direccion, style: 'tableData' },
            { text: item.telefono, style: 'tableData' },
            { text: item.correo, style: 'tableData' },
            { text: `$${item.total}`, style: 'tableData' }
        ];
    });

    return {
        table: {
            headerRows: 1,
            widths: ['auto', '*', '*', 'auto', 'auto', 'auto', 'auto'],
            body: [headers, ...body]
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
}
