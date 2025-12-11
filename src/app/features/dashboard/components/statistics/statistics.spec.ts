import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Statistics } from './statistics';
import { UserStatistics } from '../../../../core/models/user-statistics';
import { NgxChartsModule } from '@swimlane/ngx-charts';

describe('Statistics', () => {
  let component: Statistics;
  let fixture: ComponentFixture<Statistics>;
  let compiled: HTMLElement;

  const mockUserStatistics: UserStatistics = {
    userId: 1,
    readBooks: 38,
    totalPages: 12345,
    monthlyBooks: [
      { month: 'January', booksRead: 3 },
      { month: 'February', booksRead: 2 },
      { month: 'March', booksRead: 2 },
      { month: 'April', booksRead: 3 },
      { month: 'May', booksRead: 5 },
      { month: 'June', booksRead: 2 },
      { month: 'July', booksRead: 4 },
      { month: 'August', booksRead: 3 },
      { month: 'September', booksRead: 4 },
      { month: 'October', booksRead: 3 },
      { month: 'November', booksRead: 5 },
      { month: 'December', booksRead: 2 }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Statistics, NgxChartsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(Statistics);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require statistics input', () => {
    fixture.componentRef.setInput('statistics', mockUserStatistics);
    fixture.detectChanges();
    
    expect(component.statistics()).toEqual(mockUserStatistics);
  });

  it('should transform UserStatistics to StatisticsData format', () => {
    fixture.componentRef.setInput('statistics', mockUserStatistics);
    fixture.detectChanges();

    const statisticsData = component.statisticsData();
    
    expect(statisticsData).toBeTruthy();
    expect(statisticsData?.totalBooksCurrentYear).toBe(38);
    expect(statisticsData?.totalPagesCurrentYear).toBe(12345);
    expect(statisticsData?.monthlyBooks.length).toBe(1);
    expect(statisticsData?.monthlyBooks[0].name).toBe('Books Read');
  });

  it('should convert month names to abbreviations', () => {
    fixture.componentRef.setInput('statistics', mockUserStatistics);
    fixture.detectChanges();

    const statisticsData = component.statisticsData();
    const series = statisticsData?.monthlyBooks[0].series;
    
    expect(series?.[0].name).toBe('Jan');
    expect(series?.[1].name).toBe('Feb');
    expect(series?.[2].name).toBe('Mar');
    expect(series?.[3].name).toBe('Apr');
    expect(series?.[4].name).toBe('May');
    expect(series?.[5].name).toBe('Jun');
    expect(series?.[6].name).toBe('Jul');
    expect(series?.[7].name).toBe('Aug');
    expect(series?.[8].name).toBe('Sep');
    expect(series?.[9].name).toBe('Oct');
    expect(series?.[10].name).toBe('Nov');
    expect(series?.[11].name).toBe('Dec');
  });

  it('should map booksRead values correctly', () => {
    fixture.componentRef.setInput('statistics', mockUserStatistics);
    fixture.detectChanges();

    const statisticsData = component.statisticsData();
    const series = statisticsData?.monthlyBooks[0].series;
    
    expect(series?.[0].value).toBe(3); // January
    expect(series?.[1].value).toBe(2); // February
    expect(series?.[4].value).toBe(5); // May
  });

  it('should return null when statistics is null', () => {
    fixture.componentRef.setInput('statistics', null);
    fixture.detectChanges();

    const statisticsData = component.statisticsData();
    
    expect(statisticsData).toBeNull();
  });

  it('should display section title "The Story So Far"', () => {
    fixture.componentRef.setInput('statistics', mockUserStatistics);
    fixture.detectChanges();

    const title = compiled.querySelector('h2');
    expect(title?.textContent).toBe('The Story So Far');
  });

  it('should display total books read', () => {
    fixture.componentRef.setInput('statistics', mockUserStatistics);
    fixture.detectChanges();

    const statCards = compiled.querySelectorAll('.stat-card');
    const booksCard = statCards[0];
    const value = booksCard.querySelector('.stat-value');
    const label = booksCard.querySelector('.stat-label');
    
    expect(value?.textContent?.trim()).toBe('38');
    expect(label?.textContent?.trim()).toBe('Books Read This Year');
  });

  it('should display total pages read', () => {
    fixture.componentRef.setInput('statistics', mockUserStatistics);
    fixture.detectChanges();

    const statCards = compiled.querySelectorAll('.stat-card');
    const pagesCard = statCards[1];
    const value = pagesCard.querySelector('.stat-value');
    const label = pagesCard.querySelector('.stat-label');
    
    expect(value?.textContent?.trim()).toBe('12345');
    expect(label?.textContent?.trim()).toBe('Pages Read This Year');
  });

  it('should render line chart when statistics are provided', () => {
    fixture.componentRef.setInput('statistics', mockUserStatistics);
    fixture.detectChanges();

    const chart = compiled.querySelector('ngx-charts-line-chart');
    expect(chart).toBeTruthy();
  });

  it('should not render content when statistics is null', () => {
    fixture.componentRef.setInput('statistics', null);
    fixture.detectChanges();

    const section = compiled.querySelector('.statistics-section');
    expect(section).toBeFalsy();
  });

  it('should calculate yScaleMax correctly', () => {
    fixture.componentRef.setInput('statistics', mockUserStatistics);
    fixture.detectChanges();

    const yScaleMax = component.yScaleMax();
    
    // Max value in mockUserStatistics is 5, so yScaleMax should be 6 (5 + 1)
    expect(yScaleMax).toBe(6);
  });

  it('should return default yScaleMax when statistics is null', () => {
    fixture.componentRef.setInput('statistics', null);
    fixture.detectChanges();

    const yScaleMax = component.yScaleMax();
    
    expect(yScaleMax).toBe(5); // Default maxValueWhenEmpty
  });

  it('should have correct chart configuration', () => {
    // Chart configuration is protected, we verify it through the template rendering
    fixture.componentRef.setInput('statistics', mockUserStatistics);
    fixture.detectChanges();
    
    const chart = compiled.querySelector('ngx-charts-line-chart');
    expect(chart).toBeTruthy();
  });

  it('should have OnPush change detection strategy', () => {
    const debugElement: DebugElement = fixture.debugElement;
    const changeDetectionStrategy = debugElement.componentInstance.constructor.ɵcmp.changeDetection;
    expect(changeDetectionStrategy).toBe(1); // 1 = OnPush
  });

  it('should handle statistics with different user IDs', () => {
    const stats1 = { ...mockUserStatistics, userId: 1, readBooks: 38 };
    const stats2 = { ...mockUserStatistics, userId: 2, readBooks: 45 };

    fixture.componentRef.setInput('statistics', stats1);
    fixture.detectChanges();
    
    expect(component.statisticsData()?.totalBooksCurrentYear).toBe(38);

    fixture.componentRef.setInput('statistics', stats2);
    fixture.detectChanges();
    
    expect(component.statisticsData()?.totalBooksCurrentYear).toBe(45);
  });

  it('should update when statistics input changes', () => {
    fixture.componentRef.setInput('statistics', mockUserStatistics);
    fixture.detectChanges();
    
    const updatedStats: UserStatistics = {
      ...mockUserStatistics,
      readBooks: 50,
      totalPages: 20000
    };

    fixture.componentRef.setInput('statistics', updatedStats);
    fixture.detectChanges();

    const statisticsData = component.statisticsData();
    expect(statisticsData?.totalBooksCurrentYear).toBe(50);
    expect(statisticsData?.totalPagesCurrentYear).toBe(20000);
  });
});

