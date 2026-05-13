
export enum DashboardPeriod {
    DAY = 'DAY',
    WEEK = 'WEEK',
    MONTH = 'MONTH',
    YEAR = 'YEAR'
}

export enum DashboardMetric {
    REVENUE = 'REVENUE',
    ORDERS = 'ORDERS'
}

export enum DashboardDataStatus {
    SUCCESS = 'SUCCESS',
    WARNING = 'WARNING',
    DANGER = 'DANGER',
    NOT_FOUND = 'NOT_FOUND'
}


export interface DashboardPeriodsOption {
  label: string; // Ce que l'utilisateur voit (ex: "Expédiée")
  value: DashboardPeriod; // La valeur de l'Enum (ex: "SHIPPED")
}

export interface DashboardMetricsOption {
  label: string; // Ce que l'utilisateur voit (ex: "Expédiée")
  value: DashboardMetric; // La valeur de l'Enum (ex: "SHIPPED")
}