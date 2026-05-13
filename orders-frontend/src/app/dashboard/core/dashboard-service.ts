import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from 'environments/environment'
import { Observable } from 'rxjs'
import { DashboardDataDto } from '../model/dashboard-model';

export interface EnumOption {
  label: string;
  value: string; // ou OrderStatus si tu exportes l'enum vers le front
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  httpClient: HttpClient = inject(HttpClient)
  baseUrl: string = environment.apiUrl + 'dashboard'

  

  getListPeriods(): Observable<EnumOption[]> {
    return this.httpClient.get<EnumOption[]>(`${this.baseUrl}/periods`);
  }
  
  getListMetrics(): Observable<EnumOption[]> {
    return this.httpClient.get<EnumOption[]>(`${this.baseUrl}/metrics`);
  }

  getDatasDashboard(period: string, metric: string= 'REVENUE'): Observable<DashboardDataDto> {
    return this.httpClient.get<DashboardDataDto>(`${this.baseUrl}/${period}?metric=${metric}`);
  }
}
