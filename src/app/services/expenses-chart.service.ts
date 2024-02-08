import { Injectable } from '@angular/core';
import { ChartConfig, CustomDataChart } from '../models/custom-data-chart';
import { IExpenses, IExpensesByCity, IExpensesByMonth, IExpensesBySubcategory } from '../models/interfaces/IExpenses';
import { IUserSettings } from '../models/interfaces/IUser';
import { IChartByCategory } from '../models/interfaces/IChart';
import { AgChartOptions } from 'ag-charts-community';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class ExpensesChartService {

  constructor(private commonService: CommonService) { }

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

  byCity(data: IExpensesByCity[]) {
    const options = new ChartConfig();
    const lables = data.map(e => e.city);
    const totals = data.map(e => e.total);
    const datasets = [ { data: totals, label: 'Expenses By City'} ]

    return new CustomDataChart(lables, datasets, options);
  }

  bySubcategory(data: IExpensesBySubcategory[]) {
        const options = new ChartConfig('y');
        const labels = data.map(e => e.subcategory);
        const totals = data.map(e => e.total);
        const datasets = [
          { data: totals, label: 'Expenses By Subcategory' },
        ];
    
        return new CustomDataChart(labels, datasets, options);
  }


  byCategory(data: IExpenses[], options: AgChartOptions) {
    const dataChart = this.transformDataByCategory(data);
    options.data = dataChart;
    return this.buildCategorySeries(options);
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
    }
    return options;
  }

  


}
