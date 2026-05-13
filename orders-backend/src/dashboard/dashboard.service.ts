import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DashboardMetric, DashboardPeriod } from '../models/dashboard.enum';
import { DashbaordDataKpi, DashboardDataSeuil, DashboardResponseDto, DashboardRevenueEvolution, DashboardTopBest } from '../models/dashboard.response.dto';
import { OrderStatus } from '../models/order.status.enum';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class DashboardService {
    private period: DashboardPeriod = DashboardPeriod.DAY;

    constructor(private dataSource: DataSource, private configService: ConfigService) { }

    async buildDashboardData(period: DashboardPeriod, metric: DashboardMetric): Promise<DashboardResponseDto> {
        let dashboard: DashboardResponseDto;

        this.period = period;

        dashboard = new DashboardResponseDto();

        dashboard.period = period;
        dashboard.metric = metric;

        dashboard.orders = await this.retrieveKpi(DashboardMetric.ORDERS);
        dashboard.revenue = await this.retrieveKpi(DashboardMetric.REVENUE);

        dashboard.pendingOrders = await this.retrievePendingOrder();

        dashboard.topCustomers = await this.retrieveTopCustomers(metric);
        dashboard.topProducts = await this.retrieveTopProducts(metric);

        dashboard.revenueEvolution = await this.retrieveRevenueEvolution();


        return dashboard;
    }


    async retrieveKpi(metric: DashboardMetric): Promise<DashbaordDataKpi> {
        let selCurrPeriod: string = '';
        let selPrevPeriod: string = '';
        let selMetric: string = '';

        switch (metric) {
            case DashboardMetric.ORDERS: {
                selMetric = '1';
                break;
            }
            case DashboardMetric.REVENUE: {
                selMetric = 'l.quantity * l.price';
                break;
            }
        }

        switch (this.period) {
            case DashboardPeriod.DAY: {
                selCurrPeriod = `SUM(IF(DATE(o.date) = CURDATE(), ${selMetric}, 0))`;
                selPrevPeriod = `SUM(IF(DATE(o.date) = DATE_SUB(CURDATE(), INTERVAL 1 DAY), ${selMetric}, 0))`;
                break;
            }
            case DashboardPeriod.WEEK: {
                selCurrPeriod = `SUM(IF(YEARWEEK(o.date, 1) = YEARWEEK(CURDATE(), 1), ${selMetric}, 0))`;
                selPrevPeriod = `SUM(IF(YEARWEEK(o.date, 1) = YEARWEEK(DATE_SUB(CURDATE(), INTERVAL 1 WEEK), 1), ${selMetric}, 0))`;
                break;
            }
            case DashboardPeriod.MONTH: {
                selCurrPeriod = `SUM(IF(YEAR(o.date) = YEAR(CURDATE()) AND MONTH(date) = MONTH(CURDATE()), ${selMetric}, 0))`;
                selPrevPeriod = `SUM(IF(YEAR(o.date) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AND MONTH(date) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)), ${selMetric}, 0))`;
                break;
            }

            case DashboardPeriod.YEAR: {
                selCurrPeriod = `SUM(IF(YEAR(o.date) = YEAR(CURDATE()), ${selMetric}, 0))`;
                selPrevPeriod = `SUM(IF(YEAR(o.date) = YEAR(CURDATE()) - 1, ${selMetric}, 0))`;
                break;
            }
        }

        const query = await this.dataSource
            .createQueryBuilder()
            .select(selCurrPeriod, 'current_period')
            .addSelect(selPrevPeriod, 'previous_period')
            .from('order_header', 'o')
            .where('o.status != :status', { status: OrderStatus.CANCELLED });

        if (metric === DashboardMetric.REVENUE) {
            query.innerJoin('order_line', 'l', 'o.id=l.orderHeaderId')
        }

        // console.log('[retrieveKpi]', query.getQuery());

        const result = await query.getRawOne();

        const kpi: DashbaordDataKpi = new DashbaordDataKpi();

        if (result) {
            const currPeriodValue = result.current_period;
            const prevPeriodValue = result.previous_period;

            kpi.value = currPeriodValue;
            kpi.previousValue = prevPeriodValue;
            kpi.percentDiffence = (((kpi.value - kpi.previousValue) / kpi.previousValue) * 100)
            kpi.compareCurrentPreviousValue();
        } else {
            kpi.setNotFound();
        }

        return kpi;
    }

    async retrievePendingOrder(): Promise<DashboardDataSeuil> {
        const statuses = [OrderStatus.CREATED, OrderStatus.VALIDATED];

        const query = await this.dataSource.createQueryBuilder()
            .select('Count(o.id)', 'pendingOrder')
            .from('order_header', 'o')
            .where('o.status in (:statuses)', { statuses });

        // console.log('[retrievePendingOrder]', query.getQueryAndParameters());

        const result = await query.getRawOne();

        const pending: DashboardDataSeuil = new DashboardDataSeuil();

        if (result) {
            const pendingOrder = result.pendingOrder;

            pending.value = pendingOrder;
            pending.threshold = this.configService.get<number>('DASHBOARD_THRESHOLD');
            pending.percentDiffence = (((pending.value - pending.threshold) / pending.threshold) * 100)
        }

        return pending;
    }

    async retrieveTopCustomers(metric: DashboardMetric): Promise<DashboardTopBest[]> {
        const query = this.dataSource
            .createQueryBuilder()
            .select('c.code', 'code')
            .addSelect('c.name', 'customer')
            .addSelect(this.getMetric(metric), 'metric')
            .from('customers', 'c')
            .innerJoin('order_header', 'h', 'c.id=h.customerId')
            .innerJoin('order_line', 'l', 'h.id=l.orderHeaderId')
            .where('h.status != :status', { status: OrderStatus.CANCELLED })
            .andWhere(this.getPeriod())
            .groupBy('c.code, c.name')
            .orderBy('metric', 'DESC')
            .addOrderBy('code', 'ASC')
            .limit(5);

        // console.log('[retriveTopCustomers]', query.getSql());

        const results = await query.getRawMany();

        if (results.length !== 0) {
            return results.map(row => {
                const dto: DashboardTopBest = new DashboardTopBest();

                dto.name = row.code;
                dto.value = row.metric;
                dto.details = row.customer;

                return dto;
            })
        }

        return null;
    }

    async retrieveTopProducts(metric: DashboardMetric): Promise<DashboardTopBest[]> {
        const query = this.dataSource
            .createQueryBuilder()
            .select('p.code', 'code')
            .addSelect('p.description', 'product')
            .addSelect(this.getMetric(metric), 'metric')
            .from('products', 'p')
            .innerJoin('order_line', 'l', 'p.id=l.productId')
            .innerJoin('order_header', 'h', 'h.id=l.orderHeaderId')
            .where('h.status != :status', { status: OrderStatus.CANCELLED })
            .andWhere(this.getPeriod())
            .groupBy('p.code, p.description')
            .orderBy('metric', 'DESC')
            .addOrderBy('code', 'ASC')
            .limit(5);

        // console.log('[retriveTopProducts]', query.getSql());

        const results = await query.getRawMany();

        if (results.length !== 0) {
            return results.map(row => {
                const dto: DashboardTopBest = new DashboardTopBest();

                dto.name = row.code;
                dto.value = row.metric;
                dto.details = row.product;

                return dto;
            });
        }

        return null;
    }

    async retrieveRevenueEvolution(): Promise<DashboardRevenueEvolution[]> {
        const query = this.dataSource
                        .createQueryBuilder()
                        .select('DATE_FORMAT(h.date, \'%Y-%m\')', 'month')
                        .addSelect('COUNT(DISTINCT h.id)', 'numberOrder')
                        .addSelect('SUM(l.quantity * l.price)', 'revenue')
                        .from('order_header', 'h')
                        .innerJoin('order_line', 'l', 'h.id=l.orderHeaderId')
                        .where('h.date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)')
                        .andWhere('h.status IN (\'VALIDATED\', \'SHIPPED\')')
                        .groupBy('DATE_FORMAT(h.date, \'%Y-%m\')')
                        .orderBy('month', 'ASC');
        
        console.log('[retriveTopProducts]', query.getSql());

        const results = await query.getRawMany();

        if (results) {
            return results.map((row) => {
                const dto = new DashboardRevenueEvolution();
                
                dto.month = row.month;
                dto.numberOrder = row.numberOrder;
                dto.revenue = row.revenue;
                
                return dto;
            });
        }

        return null;
    }

    private getMetric(metric: DashboardMetric): string {
        let selMetric: string = '';

        switch (metric) {
            case DashboardMetric.ORDERS: {
                selMetric = 'COUNT(DISTINCT h.id)';
                break;
            }
            case DashboardMetric.REVENUE: {
                selMetric = 'ROUND(SUM(l.quantity * l.price), 2)';
                break;
            }
        }

        return selMetric;
    }

    private getPeriod(): string {
        let periodWhere: string;

        switch (this.period) {
            case DashboardPeriod.DAY: {
                periodWhere = 'DATE(h.date) = CURDATE()';
                break;
            }
            case DashboardPeriod.WEEK: {
                periodWhere = 'YEARWEEK(h.date, 1) = YEARWEEK(CURDATE(), 1)';
                break;
            }
            case DashboardPeriod.MONTH: {
                periodWhere = 'CONCAT(YEAR(h.date), LPAD(MONTH(h.date), 2, \'0\')) = CONCAT(YEAR(CURDATE()), LPAD(MONTH(CURDATE()), 2, \'0\'))';
                break;
            }
            case DashboardPeriod.YEAR: {
                periodWhere = 'YEAR(h.date) = YEAR(CURDATE())';
                break;
            }
        }

        return periodWhere;
    }

    formatPeriodsLabel(key: string): string {
        // Transforme "DAY" en "Journalier", "WEEK" en "Hebdomadaire", etc.
        const labels: Record<string, string> = {
            DAY: 'Journalier',
            WEEK: 'Hebdomadaire',
            MONTH: 'Mensuel',
            YEAR: 'Annuel'
        };
        return labels[key] || key;
    }
    
    formatMetricsLabel(key: string): string {
        // Transforme "DAY" en "Journalier", "WEEK" en "Hebdomadaire", etc.
        const labels: Record<string, string> = {
            REVENUE: 'Chiffre d\'affaire',
            ORDERS: 'Nombre de commande',
        };
        return labels[key] || key;
    }
}
