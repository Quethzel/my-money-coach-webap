import { Injectable } from '@angular/core';
import { ChartConfig, CustomDataChart } from '../models/custom-data-chart';
import { IExpenses, IExpensesByMonth, IExpensesBySubcategory } from '../models/interfaces/IExpenses';
import { IChartByCategory, IChartByCity, IChartByDay, IChartByDayAndCategory, IChartBySubcategory, IChartExpensesByMonth } from '../models/interfaces/IChart';
import { AgChartOptions } from 'ag-charts-community';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class ExpensesChartService {

  constructor(private commonService: CommonService) { }

  //TODO: this is not used
  byMonth(data: IExpensesByMonth[]) {
    const options = new ChartConfig();
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const months = data.map((item: any) => labels[item.month - 1] );
    const totals = data.map((item: any) => Number(item.total));
    
    const datasets = [
      { 
        data: totals,
        label: 'Expenses By Month', type: 'bar'
      },
    ];

    const settingsObject = localStorage.getItem('settings');
    if (settingsObject != null) {
      const settings = JSON.parse(settingsObject);
      const budget = settings.monthlyExpenseBudget;
      if (budget) {
        const budgetData = Array(11).fill(budget);
        datasets.push({ data: budgetData, label: 'Budget', type: 'line' });
      }
    }

    return new CustomDataChart<number>(months, datasets, options);
  }


  //TODO: this is not used
  bySubcategory(data: IExpensesBySubcategory[]) {
        const options = new ChartConfig('y');
        const labels = data.map(e => e.subcategory);
        const totals = data.map(e => e.total);
        const datasets = [
          { data: totals, label: 'Expenses By Subcategory' },
        ];
    
        return new CustomDataChart(labels, datasets, options);
  }


  byCategory(data: IExpenses[], options: AgChartOptions, topCategories?: number) {
    const dataChart = this.transformDataByCategory(data);
    options.data = dataChart;
    if (topCategories) {
      options.data = options.data.sort((a, b) => b.total - a.total).slice(0, topCategories);
    } else {
      options.data = options.data;
    }
    return this.buildCategorySeries(options);
  }

  byCity(data: IExpenses[], options: AgChartOptions) {
    const dataChart = this.transformDataByCity(data);
    options.data = dataChart;
    return options;
  }

  byDayAndCategory(data: IExpenses[], options: AgChartOptions) {
    const dataChart = this.transformDataByDayAndCategory(data);
    // console.log(dataChart);
    options.data = dataChart;
    return options;
  }

  byDay(data: IExpenses[], options: AgChartOptions) {
    const dataChart = this.transformDataByDay(data);
    options.data = this.sortByDayOfWeek(dataChart);
    return options;

  }

  bySubcategories(data: IExpenses[], options: AgChartOptions, topSubcategories?: number) {
    const dataChart = this.transformDataBySubcategory(data);
    if (topSubcategories) {
      options.data = dataChart.sort((a, b) => b.total - a.total).slice(0, topSubcategories);
    } else {
      options.data = dataChart;
    }
    return this.buildSubcategorySeries(options);
  }

  byYear(data: IExpenses[], options: AgChartOptions) {
    const dataChart = this.transformDataByTotalByMonth(data);
    options.data = this.sortByMonth(dataChart);
    return options;
  }

  private transformDataByDay(data: IExpenses[]) {
    const dataChart: IChartByDay[] = [];
    data.forEach((item) => {
      const day = item.date.getDay();
      const dayName = this.commonService.getDaysOfTheWeek()[day];
      const index = dataChart.findIndex((x) => x.Day === dayName);
      if (index > -1) {
        dataChart[index].Total += item.cost;
      } else {
        dataChart.push({ Day: dayName, Total: item.cost });
      }
    });

    return dataChart;
  }

  private transformDataByDayAndCategory(data: IExpenses[]) {
    const dataChart: IChartByDayAndCategory[] = [];

    data.forEach((item) => {
      const day = item.date.getDay();
      const dayName = this.commonService.getDaysOfTheWeek()[day];

      const index = dataChart.findIndex((x) => x.Category === item.category && x.Day === dayName);
      if (index > -1) {
        dataChart[index].Total += item.cost;
      } else {
        dataChart.push({ Day: dayName, Category: item.category, Total: item.cost });
      }
    });

    return dataChart;
  }

  private transformDataByCity(data: IExpenses[]) {
    const dataChart: IChartByCity[] = [];

    data.forEach((item) => {
      const city = item.cityCode ? item.cityCode : 'Unknown City';
      const index = dataChart.findIndex((x) => x.City === city);
      if (index > -1) {
        dataChart[index].Total += item.cost;
      } else {
        dataChart.push({ City: city, Total: item.cost });
      }
    });

    return dataChart;
  }

  private transformDataByCategory(data: IExpenses[]) {
    const dataChart: IChartByCategory[] = [];

    data.forEach((item) => {
      const category = item.category;
      const index = dataChart.findIndex((x) => x.category === category);
      index === -1
        ? dataChart.push({ category: item.category, total: item.cost})
        : (dataChart[index].total += item.cost);
    });

    return dataChart;
  }

  private transformDataByTotalByMonth(data: IExpenses[]) {
    const dataChart: IChartExpensesByMonth[] = [];

    data.forEach((item) => {
      const month = item.date.getMonth();
      const monthName = this.commonService.getMonthName(month);
      const index = dataChart.findIndex((x) => x.month === month);
      index === -1
        ? dataChart.push({ month: month, monthName, total: item.cost})
        : (dataChart[index].total += item.cost);
    });

    return dataChart;
  }

  private transformDataBySubcategory(data: IExpenses[]) {
    const dataChart: IChartBySubcategory[] = [];

    data.forEach((item) => {
      const subcategory = item.subcategory;
      const index = dataChart.findIndex((x) => x.subcategory === subcategory);
      index === -1
        ? dataChart.push({ category: item.category, subcategory: item.subcategory, total: item.cost})
        : (dataChart[index].total += item.cost);
    });

    return dataChart;
  }

  private buildCategorySeries(options: AgChartOptions) {
    if (options.data.length > 0) {   
      options.data = options.data.sort((a, b) => b.total - a.total);
      options.series.forEach((item) => {
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

      if (options.title == null) {
        options.title = { text: `Expenses by Category (${options.data.length})` };
      }
      if (options.subtitle == null) {
        options.subtitle = { text: 'Variable Expenses in MXN' };
      }
      
    }
    return options;
  }

  private buildSubcategorySeries(options: AgChartOptions) {
    if (options.data.length > 0) {
      options.data = options.data.sort((a, b) => b.total - a.total);
      options.series.forEach((item) => {
        item.tooltip = {
          renderer: (params: any) => {
            return {
              title: params.datum?.subcategory,
              content: params.datum?.total != null 
                ? `${this.commonService.capitalize(params.yKey)} : ${CommonService.formatAsCurrency(params.datum.total)}` 
                : `${this.commonService.capitalize(params.yKey)}: 0`
            };
          }
        }
      });
    }
    return options;
  }

  private sortByDayOfWeek(data: IChartByDay[]) {
    const days = this.commonService.getDaysOfTheWeek();

    const sortedData = data.sort((a, b) => {
      return days.indexOf(a.Day) - days.indexOf(b.Day);
    });

    return sortedData;
  }
  
  private sortByMonth(data: IChartExpensesByMonth[]) {
    return data.sort((a, b) => a.month - b.month);
  }


}
