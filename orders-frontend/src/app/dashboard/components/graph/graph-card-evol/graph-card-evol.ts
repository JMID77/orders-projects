import { Component, computed, effect, input } from '@angular/core'
import { RevenueEvolutionData } from '@angular/dashboard/core/dashboard-facade';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-graph-card-evol',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './graph-card-evol.html',
  styleUrl: './graph-card-evol.scss',
})
export class GraphCardEvol {
  title = input.required<string>();
  datas = input.required<RevenueEvolutionData[] | null>();

  chartData = computed(() => {
    const raw = this.datas();

    // Couleurs de base (RGB)
    const monthColors = [
      '66, 165, 245',   // Janvier – Bleu
      '255, 167, 38',   // Février – Orange
      '102, 187, 106',  // Mars – Vert
      '171, 71, 188',   // Avril – Violet
      '38, 198, 218',   // Mai – Cyan
      '239, 83, 80',    // Juin – Rouge
      '156, 204, 101',  // Juillet – Vert clair
      '255, 213, 79',   // Août – Jaune
      '92, 107, 192',   // Septembre – Indigo
      '255, 138, 101',  // Octobre – Corail
      '121, 134, 203',  // Novembre – Bleu violacé
      '141, 110, 99'    // Décembre – Brun / hiver
    ];

    return {
      labels: raw?.map(item => item.month),
      datasets: [
        {
          type: 'bar',
          label: 'Revenue',
          data: raw?.map(item => item.revenue),
          backgroundColor: monthColors.map(c => `rgba(${c}, 0.2)`),
          borderColor: monthColors.map(c => `rgba(${c})`),
          fill: true,
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          type: 'line',
          label: 'Nombre de commande',
          data: raw?.map(item => item.numberOrders),
          backgroundColor: monthColors.map(c => `rgba(${c}, 0.2)`),
          borderColor: monthColors.map(c => `rgba(${c})`),
          fill: true,
          tension: 0.4,
          yAxisID: 'y1'
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
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Chiffre d\'Affaires (€)' }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'Nombre de commandes' },
        grid: {
          drawOnChartArea: false, // Évite de superposer les lignes de grille
        },
        min: 0,
        max: 25 // Optionnel : pour donner un peu d'air au dessus de vos 20 max
      }
    }
  };
}
