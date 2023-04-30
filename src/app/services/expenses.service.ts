import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { KPI } from '../models/kpi';
import { CustomDataChart, IDataset } from '../models/custom-data-chart';
import { ChartConfiguration } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  constructor() { }

  getKPIs(): Observable<KPI[]> {
    const KPIs = [
      new KPI('Annual Total Expenses', 175000, 'bg-primary text-white'),
      new KPI('Most Expensive Month', 60000, 'bg-warning text-dark', 'March'),
      new KPI('Remaining Monthly Budget', 12000, 'bg-success text-white', '10 Days Left'),
      new KPI('Another KPI', 5300, 'bg-danger text-white')
    ];

    return of(KPIs);
  }


  getAnnualExpenses() {      
    return [
      { month: 'Jan', total: 65000 },
      { month: 'Feb', total: 59000 },
      { month: 'Mar', total: 80000 },
      { month: 'Apr', total: 81000 },
      { month: 'May', total: 56000 },
      { month: 'Jun', total: 55000 },
      { month: 'Jul', total: 40000 },
      { month: 'Aug', total: 66000 },
      { month: 'Sep', total: 77000 },
      { month: 'Oct', total: 120000 },
      { month: 'Nov', total: 33000 },
      { month: 'Dec', total: 30000 },
    ];
  }

  async getAnnualExpensesAsChart() {    
    const labels = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const datasets = [
      { 
        data: [ 65000, 59000, 80000, 81000, 56000, 55000, 40000, 66000, 77000, 120000, 33000, 30000 ],
        label: 'Expenses By Month'
      } as IDataset<number>
    ];

    return new CustomDataChart(labels, datasets);
  }

  async getAnnualExpensesByCityAsChart() {
    const labels = [ 'Mty', 'Oax', 'Xal', 'CDMX' ];
    const datasets = [
      {
        data: [ 23000, 10000, 3500, 8000 ],
        label: 'Expenses By City'
      }
    ];

    return new CustomDataChart(labels, datasets);
  }

  async getCategoryExpensesAsChart() {
    const options: ChartConfiguration['options'] = {
      responsive: true,
      indexAxis: 'y'
    }
    const labels = [ 'Car', 'Home', 'Undertake', 'Health Care' ];
    const datasets = [
      { 
        data: [ 21000, 13000, 9000, 5500 ], 
        label: 'Expenses By Category'
      },
    ];

    return new CustomDataChart(labels, datasets, options);
  }

  async getSubcategoryExpensesAsChart() {
    const options: ChartConfiguration['options'] = {
      responsive: true,
      indexAxis: 'y'
    }
    const labels = [ 'Restaurant', 'Books', 'Coffee', 'Appointments', 'Food' ];
    const datasets = [
      { 
        data: [ 7500, 5121, 4200, 1900, 1100 ], 
        label: 'Expenses By Subcategory'
      },
    ];

    return new CustomDataChart(labels, datasets, options);
  }

  getAnnualExpensesByCategory() { }

  getAnnualExpensesBySubcategory() { }

  getMonthlyExpensesByCategory() { }

  getMonthlyExpensesBySubcategory() { }


  

}
