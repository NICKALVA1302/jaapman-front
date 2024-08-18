import { Component, Input, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables, LinearScale } from 'chart.js';

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html'
})
export class GraficoComponent implements OnChanges {
  @Input() data: number[] = [];
  @Input() labels: string[] = [];
  @ViewChild('hiddenChart') hiddenChart!: ElementRef<HTMLCanvasElement>;
  chart: Chart | undefined;

  constructor() {
    // Registra la escala linear
    Chart.register(...registerables, LinearScale);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data.length > 0) {
      this.generarGrafico();
    }
  }

  generarGrafico(): void {
    const canvas = this.hiddenChart.nativeElement;
    const ctx = canvas.getContext('2d');
  
    if (ctx && this.data.length > 0) {
      if (this.chart) {
        this.chart.destroy();
      }
  
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: [{
            label: 'Total Facturado',
            data: this.data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              type: 'linear',
              beginAtZero: true
            }
          }
        }
      });
  
      //console.log('Gráfico generado:', this.chart);
    } else {
      console.error('Error: el contexto del canvas no es válido o no hay datos para mostrar');
    }
  }
  
  generarDataURL(): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.chart) {
          const dataURL = this.hiddenChart.nativeElement.toDataURL('image/png');
          //console.log('Generated dataURL:', dataURL);
          if (dataURL && dataURL.startsWith('data:image/png')) {
            resolve(dataURL);
          } else {
            reject('El dataURL generado es inválido o vacío.');
          }
        } else {
          reject('El gráfico no se ha generado correctamente.');
        }
      }, 1000);
    });
  }
  
}
