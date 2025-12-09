import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

export interface ChartData {
  name: string;
  value: number;
}

export interface LineChartData {
  name: string;
  series: ChartData[];
}

export interface StatisticsData {
  monthlyBooks: LineChartData[];
  totalBooksCurrentYear: number;
  totalPagesCurrentYear: number;
}

@Component({
  selector: 'app-statistics',
  imports: [NgxChartsModule],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Statistics {
  statisticsData = input.required<StatisticsData | null>();

  // Chart configuration
  protected readonly view: [number, number] = [800, 300];
  protected readonly colorScheme = 'ocean'; // Using 'cool' scheme, will override with CSS

  protected readonly showXAxis = true;
  protected readonly showYAxis = true;
  protected readonly showLegend = false;
  protected readonly showXAxisLabel = false;
  protected readonly showYAxisLabel = false;
  protected readonly autoScale = true;
  protected readonly timeline = false;
  protected readonly roundDomains = true;
  protected readonly yScaleMin = 0;

  // Format Y-axis to show whole numbers only
  protected readonly yAxisTickFormatting = (value: number): string => {
    return Math.round(value).toString();
  };
}
