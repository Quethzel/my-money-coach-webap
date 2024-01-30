import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';
import { IChartByMonthCategory, IChartExpensesByMonth } from 'src/app/models/interfaces/IChart';
import { IExpenses } from 'src/app/models/interfaces/IExpenses';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-expenses-bar-chart',
  templateUrl: './expenses-bar-chart.component.html',
  styleUrls: ['./expenses-bar-chart.component.scss']
})
export class ExpensesBarChartComponent implements OnChanges {
  @Input() data: IExpenses[];
  public options: AgChartOptions;

  constructor(private commonService: CommonService) {
    this.data = [];


    this.options = {
        title: {
            text: "Expenses by Month",
        },
        subtitle: {
            text: 'Variable Expenses in MXN',
        },
        data: this.transformData(this.data),
        series: [
            {
                type: 'bar',
                xKey: 'month',
                yKey: 'total',
                yName: 'Total Expenses'
            }
        ],
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.options.data = this.transformData(this.data);

    this.dataByCategory(this.data);

    this.options = { ...this.options };
  }
  


  private transformData(data: IExpenses[]) {
    const chartData: IChartExpensesByMonth[] = [];
    data.forEach((item) => {
      const month = item.date.getMonth();
      const monthName = this.commonService?.getMonthName(month); // Add null check
      const index = chartData.findIndex((x) => x.month === monthName);
      if (index > -1) {
        chartData[index].total += item.cost;
      } else {
        chartData.push({ month: monthName, total: item.cost });
      }
    });
    return chartData;
  }

  private dataByCategory(data: IExpenses[]) {
    const chartData: IChartByMonthCategory[] = [];

    data.forEach((item) => {
      const month = item.date.getMonth();
      const monthName = this.commonService?.getMonthName(month);
      const category = item.category;
      const index = chartData.findIndex((x) => x.month === monthName);
      if (index > -1) {
        const categoryIndex = Object.keys(chartData[index]).findIndex((x) => x === category);
        if (categoryIndex > -1) {
          chartData[index][category] += item.cost;
        } else {
          chartData[index][category] = item.cost;
        }
      } else {
        chartData.push({ month: monthName, [item.category]: item.cost });
      }
    });

    console.log(chartData);

    if(data.length > 0) { 
      const categories = Object.keys(chartData[0]).filter((x) => x !== 'month');
      this.options.series = this.buildCategorySeries(categories);

      chartData.forEach((item) => {
        categories.forEach((category) => {
          item[category] = item[category] || 0;
        });
      });
    }

    this.options.data = chartData;
  }

  private buildCategorySeries(categories: string[]) {
    const series: any[] = [];
    categories.forEach((category) => {
      series.push({
        type: 'bar',
        xKey: 'month',
        yKey: category,
        yName: category,
        stacked: true,
        normalizedTo: 100,
      });
    });

    return series;
  }

}
