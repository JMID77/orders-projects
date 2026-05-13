import { Component, inject, OnInit, signal } from '@angular/core'
import { DashboardFacade } from '@angular/dashboard/core/dashboard-facade';
import { FormsModule } from '@angular/forms';
import { SelectModule } from "primeng/select";
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-dashboard-selector',
  standalone: true,
  imports: [ SelectModule, FormsModule, ToolbarModule, ToastModule ],
  templateUrl: './dashboard-selector.html',
  styleUrl: './dashboard-selector.scss',
})
export class DashboardSelector implements OnInit {
  facade = inject(DashboardFacade);

  ngOnInit(): void {
    this.facade.loadPeriods();
    this.facade.loadMetrics()
  }

  onChangePeriod(period: string): void {
    this.facade.changePeriod(period);
  }
  
  onChangeMetric(metric: string): void {
    this.facade.changeMetric(metric);
  }
}
