import { Component, inject, input } from '@angular/core'
import { DashboardService } from '@angular/dashboard/core/dashboard-service';
import { KpiCard } from './kpi-card/kpi-card';
import { PendingCard } from './pending-card/pending-card';
import { DashboardFacade } from '@angular/dashboard/core/dashboard-facade';

@Component({
  selector: 'app-dashboard-kpi',
  imports: [ KpiCard, PendingCard ],
  templateUrl: './dashboard-kpi.html',
  styleUrl: './dashboard-kpi.scss',
})
export class DashboardKpi {
  facade = inject(DashboardFacade);
}
