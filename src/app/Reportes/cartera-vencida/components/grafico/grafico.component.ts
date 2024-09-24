import { Component, Input, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

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
  
      // Colores para las barras (uno por cada mes)
      const backgroundColors = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ];
  
      const borderColors = backgroundColors.map(color => color.replace('0.2', '1'));
  
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: [{
            label: 'Total Facturado',
            data: this.data,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              type: 'linear',
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            tooltip: {
              callbacks: {
                label: function (context: any) {
                  const value = context.raw as number;
                  return `Total Facturado: $${value.toFixed(2)}`;
                }
              }
            },
            datalabels: {
              anchor: 'end',
              align: 'end',
              formatter: function(value: number) {
                return `$${value.toFixed(2)}`;
              }
            }
          }
        }
      });
    }
  }

  generarDataURL(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.hiddenChart || !this.hiddenChart.nativeElement) {
        reject('El gráfico no se ha generado correctamente o no está disponible.');
        return;
      }
      
      setTimeout(() => {
        const dataURL = this.hiddenChart.nativeElement.toDataURL('image/png');
        if (dataURL && dataURL.startsWith('data:image/png')) {
          resolve(dataURL);
        } else {
          reject('El dataURL generado es inválido o vacío.');
        }
      }, 1000); // Aumenta el tiempo de espera a 1500 ms para asegurar que el gráfico esté listo
    });
  }
}
