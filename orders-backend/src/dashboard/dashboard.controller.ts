import { ClassSerializerInterceptor, Controller, Get, Param, ParseEnumPipe, Query, UseInterceptors } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardResponseDto } from '../models/dashboard.response.dto';
import { DashboardMetric, DashboardMetricsOption, DashboardPeriod, DashboardPeriodsOption } from '../models/dashboard.enum';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('/periods')
  async getDashboardPeriods(): Promise<DashboardPeriodsOption[]> {
    return Object.values(DashboardPeriod).map((value) => ({
      label: this.dashboardService.formatPeriodsLabel(value), // Optionnel : pour rendre le texte plus "humain"
      value: value
    }));
  }
  @Get('/metrics')
  async getDashboardMetrics(): Promise<DashboardMetricsOption[]> {
    return Object.values(DashboardMetric).map((value) => ({
      label: this.dashboardService.formatMetricsLabel(value), // Optionnel : pour rendre le texte plus "humain"
      value: value
    }));
  }
  
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':period')
  async getDashboard(@Param('period', new ParseEnumPipe(DashboardPeriod)) period: DashboardPeriod, @Query('metric', new ParseEnumPipe(DashboardMetric)) metric: DashboardMetric): Promise<DashboardResponseDto> {
    const datas = await this.dashboardService.buildDashboardData(period, metric);

    return datas;
  }

}
