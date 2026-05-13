import { Component, input, computed } from '@angular/core'
import { TopData } from '@angular/dashboard/core/dashboard-facade';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-graph-card-top',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './graph-card-top.html',
  styleUrl: './graph-card-top.scss',
})
export class GraphCardTop {
  title = input.required<string>();
  datas = input.required<TopData[] | null>();

  chartData = computed(() => {
    const raw = this.datas();

    // Couleurs de base (RGB)
    const baseColors = [
      '66, 165, 245',  // Bleu
      '102, 187, 106', // Vert
      '255, 167, 38',  // Orange
      '38, 198, 218',  // Cyan
      '126, 87, 194'   // Violet
    ];

    return {
      labels: raw?.map(item => item.name),
      datasets: [
        {
          label: this.title(),
          data: raw?.map(item => item.value),
          backgroundColor: baseColors.map(c => `rgba(${c}, 0.2)`),
          borderColor: baseColors.map(c => `rgba(${c})`),
          fill: true,
          tension: 0.4
        }
      ]
    }
  })

  options = {
    maintainAspectRatio: false,
    aspectRatio: 0.9,
    plugins: {
      legend: {
        display: false,
      }
    }
  };
}
