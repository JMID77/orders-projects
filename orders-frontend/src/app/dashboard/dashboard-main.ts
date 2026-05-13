import { Component, inject, OnInit } from '@angular/core'
import { DashboardSelector } from './components/dashboard-selector/dashboard-selector';
import { DashboardFacade } from './core/dashboard-facade';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DashboardKpi } from "./components/kpi/dashboard-kpi/dashboard-kpi";
import { DashboardGraph } from './components/graph/dashboard-graph/dashboard-graph';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardSelector, ProgressSpinnerModule, DashboardKpi, DashboardGraph],
  templateUrl: './dashboard-main.html',
  styleUrl: './dashboard-main.scss',
})
export class DashboardMain implements OnInit {

  facade = inject(DashboardFacade);

  ngOnInit(): void {
    this.facade.loadDashboard();
  }

}
