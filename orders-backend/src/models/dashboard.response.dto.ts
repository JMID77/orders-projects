import { IsEnum } from "class-validator";
import { DashboardDataStatus, DashboardMetric, DashboardPeriod } from "./dashboard.enum";
import { Expose, Transform, Type } from "class-transformer";

export class DashbaordDataKpi {
    @Expose()
    @Transform(({ value }) => Number(Number(value).toFixed(2)))
    value: number;

    @Expose({ name: 'previous_value' })
    @Transform(({ value }) => Number(Number(value).toFixed(2)))
    previousValue: number;

    @Expose({ name: 'percent_difference' })
    @Transform(({ value }) => Number(Number(value).toFixed(2)))
    percentDiffence: number;

    @Expose()
    @IsEnum(DashboardDataStatus)
    status: DashboardDataStatus;

    compareCurrentPreviousValue() {
        if (this.value > this.previousValue) {
            this.status = DashboardDataStatus.SUCCESS;
        } else if (this.value >= this.previousValue * 0.5) {
            this.status = DashboardDataStatus.WARNING;
        } else {
            this.status = DashboardDataStatus.DANGER;
        }
    }

    setNotFound() {
        this.value = -1;
        this.status = DashboardDataStatus.NOT_FOUND;
    }
}

export class DashboardDataSeuil {
    @Expose()
    value: number = -99;

    @Expose()
    threshold: number;

    @Expose({ name: 'percent_difference' })
    @Transform(({ value }) => Number(Number(value).toFixed(2)))
    percentDiffence: number;
    
    @Expose({name: 'is_loaded'})
    get isLoaded(): boolean {
        return (this.value !== -99);
    }

    @Expose({ name: 'over_limit' })
    get overLimit(): boolean {
        return (this.value > this.threshold);
    }
}

export class DashboardTopBest {
    @Expose()
    @Transform(({ value }) => Number(Number(value).toFixed(2)))
    value: number;

    @Expose()
    name: string;

    @Expose()
    details: string;
}

export class DashboardRevenueEvolution {
    @Expose()
    month: string;

    @Expose({name: 'number_order'})
    @Transform(({ value }) => Number(Number(value).toFixed(0)))
    numberOrder: number;

    @Expose()
    @Transform(({ value }) => Number(Number(value).toFixed(2)))
    revenue: number;
}

export class DashboardResponseDto {
    @Expose()
    period: DashboardPeriod;
    
    @Expose()
    metric: DashboardMetric;

    @Expose()
    @Type(() => DashbaordDataKpi)
    orders: DashbaordDataKpi;

    @Expose()
    @Type(() => DashbaordDataKpi)
    revenue: DashbaordDataKpi;

    @Expose({ name: 'pending_orders' })
    @Type(() => DashboardDataSeuil)
    pendingOrders: DashboardDataSeuil;

    @Expose({ name: 'top_customers' })
    @Type(() => DashboardTopBest)
    topCustomers: DashboardTopBest[];
    
    @Expose({ name: 'top_products' })
    @Type(() => DashboardTopBest)
    topProducts: DashboardTopBest[];

    @Expose({name: 'revenue_evolution'})
    @Type(() => DashboardRevenueEvolution)
    revenueEvolution: DashboardRevenueEvolution[];
}