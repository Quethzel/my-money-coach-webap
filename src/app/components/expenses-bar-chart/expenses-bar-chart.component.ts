import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';
import { AgChartTheme } from 'ag-grid-community';
import { IChartByCategory, IChartByMonthCategory, IChartExpensesByMonth } from 'src/app/models/interfaces/IChart';
import { IExpenses } from 'src/app/models/interfaces/IExpenses';
import { CommonService } from 'src/app/services/common.service';
import { AgBarSeriesFormatterParams } from 'ag-charts-community';
import { AgCartesianSeriesOptions } from 'ag-charts-community';
import { AgLineSeriesOptions } from 'ag-charts-community';

@Component({
  selector: 'app-expenses-bar-chart',
  templateUrl: './expenses-bar-chart.component.html',
  styleUrls: ['./expenses-bar-chart.component.scss']
})
export class ExpensesBarChartComponent implements OnChanges {
  @Input() data: IExpenses[];
  public options: AgChartOptions;
  // public areaOptions: AgChartOptions;

  constructor(private commonService: CommonService) {
    this.data = [];

    this.options = {
        title: {
            text: "Expenses by Category",
        },
        subtitle: {
            text: 'Variable Expenses in MXN',
        },
        data: this.transformData(this.data),
            series: [
              {
                type: 'bar',
                xKey: 'category',
                yKey: 'total',
                yName: 'Total Expenses',
                tooltip: {
                  renderer: (params: any) => {
                    return {
                      content: params.yValue != null 
                        ? `${params.yKey} : ${CommonService.formatAsCurrency(params.yValue)}` 
                        : `${params.yKey}: 0`
                    };
                  }
                }
              }
            ],
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.options.data = this.transformData(this.data);

    // this.dataByCategoryByMonth(this.data);
    this.dataByCategory(this.data);

    // this.options = { ...this.options };
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
    if(chartData.length > 0) console.log(chartData);
    return chartData;
  }

  private dataByCategoryByMonth(data: IExpenses[]) {
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

    if(data.length > 0) console.log(chartData);

    if(data.length > 0) { 
      const categories = Object.keys(chartData[0]).filter((x) => x !== 'month');
      this.options.series = this.buildCategoryByMonthSeries(categories);

      chartData.forEach((item) => {
        categories.forEach((category) => {
          item[category] = item[category] || 0;
        });
      });
    }

    this.options.data = chartData;
  }

  private buildCategoryByMonthSeries(categories: string[]) {
    const series: any[] = [];
    categories.forEach((category) => {
      series.push({
        type: 'bar',
        xKey: 'month',
        yKey: category,
        yName: category,
        // stacked: true,
        // normalizedTo: 100,
      });
    });

    console.log(series);
    return series;
  }

  private dataByCategory(data: IExpenses[]) {
    const dataChart: IChartByCategory[] = [];

    data.forEach((item) => {
      const category = item.category;
      const index = dataChart.findIndex((x) => x.category === category);
      index === -1
        ? dataChart.push({ category: item.category, total: item.cost})
        : (dataChart[index].total += item.cost);
    });

    // dataChart.forEach((item) => { item.total = CommonService.formatAsCurrency(item.amount) });

    if(dataChart.length > 0) console.log(dataChart);
    this.options.data = dataChart;
    
    if(dataChart.length > 0) {
      const categories = dataChart.map((x) => x.category);
      // this.options.series = this.buildCategorySeries(categories);
      this.buildCategorySeries();
    }
  }

  private buildCategorySeries() {
    this.options.data = this.options.data.sort((a, b) => b.total - a.total);
    this.options.series.forEach((item) => {
      item.tooltip = {
        renderer: (params: any) => {
          return {
            title: params.datum?.category,
            content: params.datum?.total != null 
              ? `${this.commonService.capitalize(params.yKey)} : ${CommonService.formatAsCurrency(params.datum.total)}` 
              : `${this.commonService.capitalize(params.yKey)}: 0`
          };
        }
      }
      

    });

    this.options = { ...this.options };

  }






}
