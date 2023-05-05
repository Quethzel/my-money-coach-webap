import { Injectable } from '@angular/core';
import { Observable, map, of, zip } from 'rxjs';
import { KPI } from '../models/kpi';
import { CustomDataChart } from '../models/custom-data-chart';
import { ChartConfiguration } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IKPITotalExpenses } from '../models/interfaces/IKPI';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private apiURL = `${environment.mcApi}/expenses`;
  constructor(private http: HttpClient) { }

  getKPIs(): Observable<KPI[]> {
    const KPIs = [
      new KPI('Annual Total Expenses', 175000, 'bg-primary text-white'),
      new KPI('Most Expensive Month', 60000, 'bg-warning text-dark', 'March'),
      new KPI('Remaining Monthly Budget', 12000, 'bg-success text-white', '10 Days Left'),
      new KPI('Another KPI', 5300, 'bg-danger text-white')
    ];

    return of(KPIs);
  }

  // Get the sum of the annual expenses grouped by month
  getExpensesByMonth():Observable<any>  {
    return this.http.get(`${this.apiURL}/costByMonth/2023`);
  }

  getKPIAnnualVariableExpenses(year: number) {
    return this.getAnnualExpenses(year)
    .pipe(map(result => {
        return new KPI('Annual Variable Expenses', result.total, 'bg-primary text-white');
    }));  
  }

  private getAnnualExpenses(year: number) {
    return this.http.get<IKPITotalExpenses>(`${this.apiURL}/total/${year}`)
  }

  async getAnnualExpensesAsChart(data: any) {
    const options: ChartConfiguration['options'] = {
      responsive: true,
      plugins: { 
        legend: { display: false }
      }
    };
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

  async getAnnualExpensesByCityAsChart() {
    const options: ChartConfiguration['options'] = {
      responsive: true,
      plugins: { 
        legend: { display: false }
      }
    };
    const labels = [ 'Mty', 'CDMX', 'Oax', 'Xal' ];
    const datasets = [
      { data: [ 23000, 10000, 3500, 8000 ], label: 'Expenses By City' }
    ];

    return new CustomDataChart(labels, datasets, options);
  }

  async getCategoryExpensesAsChart() {
    const options: ChartConfiguration['options'] = {
      responsive: true,
      indexAxis: 'y',
      plugins: { 
        legend: { display: false }
      }
    }
    const labels = [ 'Car', 'Home', 'Undertake', 'Health Care' ];
    const datasets = [
      { data: [ 21000, 13000, 9000, 5500 ], label: 'Expenses By Category' },
      // { data: [ 21000 ], label: 'Car' },
      // { data: [ 13000 ], label: 'Home' },
      // { data: [ 9000 ], label: 'Undertake' },
      // { data: [ 5500 ], label: 'Health Care' },
    ];

    return new CustomDataChart(labels, datasets, options);
  }

  async getSubcategoryExpensesAsChart() {
    const options: ChartConfiguration['options'] = {
      responsive: true,
      indexAxis: 'y',
      plugins: { 
        legend: { display: false }
      }
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


}
