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

      // Array de colores, uno para cada mes
      const backgroundColors = [
        'rgba(255, 99, 132, 0.2)', // Enero
        'rgba(54, 162, 235, 0.2)', // Febrero
        'rgba(255, 206, 86, 0.2)', // Marzo
        'rgba(75, 192, 192, 0.2)', // Abril
        'rgba(153, 102, 255, 0.2)', // Mayo
        'rgba(255, 159, 64, 0.2)', // Junio
        'rgba(255, 99, 132, 0.2)', // Julio
        'rgba(54, 162, 235, 0.2)', // Agosto
        'rgba(255, 206, 86, 0.2)', // Septiembre
        'rgba(75, 192, 192, 0.2)', // Octubre
        'rgba(153, 102, 255, 0.2)', // Noviembre
        'rgba(255, 159, 64, 0.2)'  // Diciembre
      ];

      const borderColors = backgroundColors.map(color => color.replace('0.2', '1'));

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: [{
            label: 'Total Facturado',
            data: this.data,
            backgroundColor: backgroundColors.slice(0, this.data.length), // Solo usa tantos colores como datos
            borderColor: borderColors.slice(0, this.data.length),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Para que el tamaño se respete según el canvas
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
            }
          }
        }
      });
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
