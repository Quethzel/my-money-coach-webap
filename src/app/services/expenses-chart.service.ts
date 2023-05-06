import { Injectable } from '@angular/core';
import { ChartConfig, CustomDataChart } from '../models/custom-data-chart';
import { IExpensesByCity } from '../models/interfaces/expenses';

@Injectable({
  providedIn: 'root'
})
export class ExpensesChartService {

  constructor() { }

  //TODO: Budget value is hardcode
  annualByMonth(data: any) {
    const options = new ChartConfig();
    const labels = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const months = data.map((item: any) => labels[item._id - 1] );
    const totals = data.map((item: any) => Number(item.total));
    const datasets = [
      { 
        data: totals,
        label: 'Expenses By Month', type: 'bar'
      },
      {
        data: [ 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000 ], 
        label: 'Budget', type: 'line' 
      }
    ];

    return new CustomDataChart<number>(months, datasets, options);
  }


  expensesByCity(data: IExpensesByCity[]) {
    const options = new ChartConfig();
    const lables = data.map(e => e.city);
    const totals = data.map(e => e.total);
    const datasets = [ { data: totals, label: ''} ]

    return new CustomDataChart(lables, datasets, options);
  }

}
