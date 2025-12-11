import {ChangeDetectionStrategy, Component, computed, input, Signal} from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { UserStatistics } from '../../../../core/models/user-statistics';

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
  statistics = input.required<UserStatistics | null>();

  // Transform UserStatistics to StatisticsData format for the chart
  statisticsData: Signal<StatisticsData | null> = computed(() => {
    const stats = this.statistics();
    if (!stats) {
      return null;
    }

    const monthAbbreviations: { [key: string]: string } = {
      'January': 'Jan',
      'February': 'Feb',
      'March': 'Mar',
      'April': 'Apr',
      'May': 'May',
      'June': 'Jun',
      'July': 'Jul',
      'August': 'Aug',
      'September': 'Sep',
      'October': 'Oct',
      'November': 'Nov',
      'December': 'Dec'
    };

    const series: ChartData[] = stats.monthlyBooks.map(monthData => ({
      name: monthAbbreviations[monthData.month] || monthData.month,
      value: monthData.booksRead
    }));

    return {
      monthlyBooks: [
        {
          name: 'Books Read',
          series
        }
      ],
      totalBooksCurrentYear: stats.readBooks,
      totalPagesCurrentYear: stats.totalPages
    };
  });

    yScaleMax: Signal<number> = computed(() => {
        const maxValueWhenEmpty = 5;

        const data = this.statisticsData();
        if (!data?.monthlyBooks || data.monthlyBooks.length === 0) {
            return maxValueWhenEmpty;
        }

        const allValues = data.monthlyBooks.flatMap(lineData =>
            lineData.series.map(chartData => chartData.value)
        );

        return allValues.length > 0 ? Math.max(...allValues) + 1 : maxValueWhenEmpty;
    });

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
  protected readonly yScaleMin = -0.5;

  // Format Y-axis to show whole numbers only
  protected readonly yAxisTickFormatting = (value: number): string => {

      if(value === -0.5) {
          return '';
      }

      return Math.round(value).toString();
  };
}
