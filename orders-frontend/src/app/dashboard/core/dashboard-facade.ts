import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { DashboardService, EnumOption } from './dashboard-service';
import { DashboardStore } from './dashboard-store';
import { HttpErrorResponse } from '@angular/common/http';


export interface KpiData {
    value: number;
    previous: number;
    percent: number;
    status: string;
}

export interface PendingData {
    value: number;
    threshold: number;
    percent: number;
    overLimit?: boolean;
}

export interface TopData {
    name: string;
    value: number;
    details: string;
}

export interface RevenueEvolutionData {
    month: string;
    numberOrders: number;
    revenue: number;
}

export interface DashboardViewDto {
    orders: KpiData;
    revenue: KpiData;
    pending: PendingData;

    topCustomers: TopData[];
    topProducts: TopData[];

    revenueEvolution: RevenueEvolutionData[];
}

@Injectable({
    providedIn: 'root' // Rend le service disponible dans toute l'application (Singleton)
})
export class DashboardFacade {

    private store = inject(DashboardStore);
    private service = inject(DashboardService);

    periods = signal<EnumOption[]>([]);
    metrics = signal<EnumOption[]>([]);

    loading = this.store.loading;
    period = this.store.period;
    metric = this.store.metric;

    loadPeriods() {
        this.service.getListPeriods().subscribe({
            next: (datas) => {
                this.periods.set(datas);
            },
            error: (err: HttpErrorResponse) => {
                const apiError = err.error?.message || 'Une erreur inconnue est survenue lors du chargement des données du Dashboard';
                this.store.setErrorState(apiError);

                this.store.setLoadingState(false);

                console.log('DashboardFacade [loadDashboard]', apiError);
            }
        });
    }

    loadMetrics() {
        this.service.getListMetrics().subscribe({
            next: (datas) => {
                this.metrics.set(datas);
            },
            error: (err: HttpErrorResponse) => {
                const apiError = err.error?.message || 'Une erreur inconnue est survenue lors du chargement des données du Dashboard';
                this.store.setErrorState(apiError);

                this.store.setLoadingState(false);

                console.log('DashboardFacade [loadDashboard]', apiError);
            }
        });
    }

    loadDashboard() {
        this.store.setLoadingState(true);
        this.service.getDatasDashboard(this.period(), this.metric()).subscribe({
            next: datas => {
                this.store.setDataState(datas);
                this.store.setLoadingState(false);
            },
            error: (err: HttpErrorResponse) => {
                const apiError = err.error?.message || 'Une erreur inconnue est survenue lors du chargement des données du Dashboard';
                this.store.setErrorState(apiError);

                this.store.setLoadingState(false);

                console.log('DashboardFacade [loadDashboard]', apiError);
            }
        });
    }

    datasView = computed(() => {
        const datas = this.store.datas();

        if (!datas) {
            return null;
        }

        const view: DashboardViewDto = {
            orders: {
                value: datas.orders?.value ?? 0,
                previous: datas.orders?.previous_value ?? 0,
                percent: datas.orders?.percent_difference ?? 0,
                status: datas.orders?.status ?? 'N/A',
            },
            revenue: {
                value: datas.revenue?.value ?? 0,
                previous: datas.revenue?.previous_value ?? 0,
                percent: datas.revenue?.percent_difference ?? 0,
                status: datas.revenue?.status ?? 'N/A',
            },
            pending: {
                value: datas.pending_orders?.value ?? 0,
                threshold: datas.pending_orders?.threshold ?? 0,
                percent: datas.pending_orders?.percent_difference ?? 0,
                overLimit: datas.pending_orders?.over_limit ?? false,
            },
            topCustomers: (datas.top_customers ?? []).map((customer: any) => ({
                name: customer.name,
                value: customer.value ?? 0,
                details: customer.details,
            })),
            topProducts: (datas.top_products ?? []).map((product: any) => ({
                name: product.name,
                value: product.value ?? 0,
                details: product.details,
            })),
            revenueEvolution: (datas.revenue_evolution ?? []).map((revenue: any) => ({
                month: revenue.month,
                numberOrders: revenue.number_order ?? 0,
                revenue: revenue.revenue ?? 0,
            }))
        }

        return view;
    });

    changePeriod(period: string) {
        if (period !== this.store.period()) {
            this.store.setPeriodeState(period);

            this.loadDashboard();
        }
    }

    changeMetric(metric: string) {
        if (metric !== this.store.metric()) {
            this.store.setMetricState(metric);
            
            this.loadDashboard();
        }
    }
}
