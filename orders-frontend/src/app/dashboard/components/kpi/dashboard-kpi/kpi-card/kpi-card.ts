import { CurrencyPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core'
import { KpiData } from '@angular/dashboard/core/dashboard-facade';
import { DashboardDataStatus } from '@angular/dashboard/model/dashboard-model';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';


@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [ CardModule, FormsModule, CurrencyPipe ], //, CurrencyPipe, DecimalPipe ],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.scss',
})
export class KpiCard {
  title= input.required<string>();
  icon = input.required<string>();
  isCurrency = input<boolean>(false);
  data = input.required<KpiData | null>();

  iconStatus = computed(() => {
    const statusIcons: Record<DashboardDataStatus, string> = {
      [DashboardDataStatus.SUCCESS]: 'pi-arrow-up',
      [DashboardDataStatus.WARNING]: 'pi-arrow-circle-right',
      [DashboardDataStatus.DANGER]: 'pi-arrow-down',
      [DashboardDataStatus.NOT_FOUND]: 'pi-ban',
    }

    const dataStatus = this.data()?.status;
    const status = (dataStatus && dataStatus in statusIcons) 
        ? (dataStatus as DashboardDataStatus) 
        : DashboardDataStatus.NOT_FOUND;

    return statusIcons[status];
  })

  colorStatus = computed(() => {
    const statusColors: Record<DashboardDataStatus, string> = {
      [DashboardDataStatus.SUCCESS]: 'text-green-500',
      [DashboardDataStatus.WARNING]: 'text-orange-500',
      [DashboardDataStatus.DANGER]: 'text-red-500',
      [DashboardDataStatus.NOT_FOUND]: 'text-500',
    }

    const dataStatus = this.data()?.status;
    const color = (dataStatus && dataStatus in statusColors) 
        ? (dataStatus as DashboardDataStatus) 
        : DashboardDataStatus.NOT_FOUND;

    return statusColors[color];
  })
}
