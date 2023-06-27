import { Injectable } from '@angular/core';
import { ChartConfig, CustomDataChart } from '../models/custom-data-chart';
import { IExpensesByCategory, IExpensesByCity, IExpensesByMonth, IExpensesBySubcategory } from '../models/interfaces/IExpenses';
import { IUserSettings } from '../models/interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class ExpensesChartService {

  constructor() { }

  //TODO: Budget value is hardcode
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

  byCategory(data: IExpensesByCategory[]) {
    const options = new ChartConfig('y');
    const labels = data.map(e => e.category);
    const totals = data.map(e => e.total);
    const datasets = [
      { data: totals, label: 'Expenses By Category' },
    ];

    return new CustomDataChart(labels, datasets, options);
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

}
