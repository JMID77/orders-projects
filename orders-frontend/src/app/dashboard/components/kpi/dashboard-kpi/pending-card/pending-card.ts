import { Component, computed, input } from '@angular/core'
import { PendingData } from '@angular/dashboard/core/dashboard-facade';
import { DashboardDataStatus } from '@angular/dashboard/model/dashboard-model';
import { CardModule } from 'primeng/card';


@Component({
  selector: 'app-pending-card',
  imports: [CardModule],
  templateUrl: './pending-card.html',
  styleUrl: './pending-card.scss',
})
export class PendingCard {
  title= input.required<string>();
  icon = input.required<string>();
  data = input.required<PendingData | null>();

  iconStatus = computed(() => {
    const status = this.data()?.overLimit ?? false;
    const icon = status ? 'pi-arrow-up' : 'pi-arrow-down';

    return icon;
  })

  colorStatus = computed(() => {
    const status = this.data()?.overLimit ?? false;
    const color = status ? 'text-green-500' : 'text-red-500';

    return color;
  })
}
