
export enum DashboardDataStatus {
    SUCCESS = 'SUCCESS',
    WARNING = 'WARNING',
    DANGER = 'DANGER',
    NOT_FOUND = 'NOT_FOUND'
}


export interface DashboardDataKpi {
    value: number;
    previous_value: number;
    percent_difference: number;
    status: string;
}

export interface DashboardDataSeuil {
    value: number;
    threshold: number;
    percent_difference: number;
    over_limit?: boolean;
}

export interface DashboardTopBest {
    value: number;
    name: string;
    details: string;
}

export class DashboardRevenueEvolution {
    month: string;
    number_order: number;
    revenue: number;
}

export interface DashboardDataDto {
    period: string;
    metric: string;
    
    orders: DashboardDataKpi;
    revenue: DashboardDataKpi;
    pending_orders: DashboardDataSeuil;
    top_customers: DashboardTopBest[];
    top_products: DashboardTopBest[];
    revenue_evolution: DashboardRevenueEvolution[];
}
