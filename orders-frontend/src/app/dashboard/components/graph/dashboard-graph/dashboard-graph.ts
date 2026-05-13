import { Component, inject } from '@angular/core'
import { GraphCardTop } from '../graph-card-top/graph-card-top';
import { DashboardFacade } from '@angular/dashboard/core/dashboard-facade';
import { GraphCardEvol } from "../graph-card-evol/graph-card-evol";

@Component({
  selector: 'app-dashboard-graph',
  imports: [GraphCardTop, GraphCardEvol],
  templateUrl: './dashboard-graph.html',
  styleUrl: './dashboard-graph.scss',
})
export class DashboardGraph {
  facade = inject(DashboardFacade);
}
