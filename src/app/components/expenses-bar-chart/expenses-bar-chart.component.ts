import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';

@Component({
  selector: 'app-expenses-bar-chart',
  templateUrl: './expenses-bar-chart.component.html',
  styleUrls: ['./expenses-bar-chart.component.scss']
})
export class ExpensesBarChartComponent implements OnChanges {
  @Input() options: AgChartOptions;

  constructor() {
    this.options = {};
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.options = changes['options'].currentValue;
  }

  // private transformData(data: IExpenses[]) {
  //   const chartData: IChartExpensesByMonth[] = [];
  //   data.forEach((item) => {
  //     const month = item.date.getMonth();
  //     const monthName = this.commonService?.getMonthName(month); // Add null check
  //     const index = chartData.findIndex((x) => x.month === monthName);
  //     if (index > -1) {
  //       chartData[index].total += item.cost;
  //     } else {
  //       chartData.push({ month: monthName, total: item.cost });
  //     }
  //   });
  //   if(chartData.length > 0) console.log(chartData);
  //   return chartData;
  // }

  // private dataByCategoryByMonth(data: IExpenses[]) {
  //   const chartData: IChartByMonthCategory[] = [];

  //   data.forEach((item) => {
  //     const month = item.date.getMonth();
  //     const monthName = this.commonService?.getMonthName(month);
  //     const category = item.category;
  //     const index = chartData.findIndex((x) => x.month === monthName);
  //     if (index > -1) {
  //       const categoryIndex = Object.keys(chartData[index]).findIndex((x) => x === category);
  //       if (categoryIndex > -1) {
  //         chartData[index][category] += item.cost;
  //       } else {
  //         chartData[index][category] = item.cost;
  //       }
  //     } else {
  //       chartData.push({ month: monthName, [item.category]: item.cost });
  //     }
  //   });

  //   if(data.length > 0) console.log(chartData);

  //   if(data.length > 0) { 
  //     const categories = Object.keys(chartData[0]).filter((x) => x !== 'month');
  //     this.options.series = this.buildCategoryByMonthSeries(categories);

  //     chartData.forEach((item) => {
  //       categories.forEach((category) => {
  //         item[category] = item[category] || 0;
  //       });
  //     });
  //   }

  //   this.options.data = chartData;
  // }

  // private buildCategoryByMonthSeries(categories: string[]) {
  //   const series: any[] = [];
  //   categories.forEach((category) => {
  //     series.push({
  //       type: 'bar',
  //       xKey: 'month',
  //       yKey: category,
  //       yName: category,
  //       // stacked: true,
  //       // normalizedTo: 100,
  //     });
  //   });

  //   console.log(series);
  //   return series;
  // }


}
