import { Injectable, signal } from '@angular/core';
import { DashboardDataDto } from '../model/dashboard-model';

@Injectable({
    providedIn: 'root' // Rend le service disponible dans toute l'application (Singleton)
})
export class DashboardStore {

    private _dataState = signal<DashboardDataDto | null>(null);
    private _loadingState = signal<boolean>(false);
    private _errorState = signal<string>('');
    private _periodState = signal<string>('DAY');
    private _metricState = signal<string>('REVENUE');

    readonly datas = this._dataState.asReadonly();
    readonly loading = this._loadingState.asReadonly();
    readonly error = this._errorState.asReadonly();
    readonly period = this._periodState.asReadonly();
    readonly metric = this._metricState.asReadonly();

    setDataState(data: DashboardDataDto) {
        this._dataState.set(data);
    }

    setLoadingState(load: boolean) {
        this._loadingState.set(load);
    }

    setErrorState(error: string) {
        this._errorState.set(error);
    }

    setPeriodeState(period: string) {
        this._periodState.set(period);
    }

    setMetricState(metric: string) {
        this._metricState.set(metric);
    }
}
