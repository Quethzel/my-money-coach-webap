import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { KPI } from '../models/kpi';
import { ChartConfig, CustomDataChart } from '../models/custom-data-chart';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IKPIValue } from '../models/interfaces/IKPI';
import { IExpensesByCity } from '../models/interfaces/expenses';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private apiURL = `${environment.mcApi}/expenses`;
  constructor(
    private http: HttpClient,
    private commonService: CommonService
    ) { }

  getKPIAnnualVariableExpenses(year: number) {
    const URL = `${this.apiURL}/total/${year}`;
    return this.http.get<IKPIValue>(URL).pipe(map(result => {
      return new KPI('Annual Variable Expenses', result.total, 'bg-primary text-white');
    }));
  }

  getKPITotalExpensesByCurrentMonth() {
    return this.http.get<IKPIValue>(`${this.apiURL}/totalMontlyExpenses`).pipe(map(result => {
      return new KPI('Montly Expenses', result.total, 'bg-success text-white')
    }));
  }

  getKPIAverageDailyExpensesInThisMonth() {
    return this.http.get<IKPIValue>(`${this.apiURL}/averageDailyExpenses`).pipe(map(result => {
      return new KPI('Average Daily Expenses', result.total, 'bg-danger text-white')
    }));
  }

  getKPIRemainingMontlyBudget() {
    return this.http.get<IKPIValue>(`${this.apiURL}/remainingMontlyBudget`).pipe(map(result => {
      const daysLeftInMonth = this.commonService.getRemainingDaysInCurrentMonth();
      return new KPI('Remaining Monthly Budget', result.total, 'bg-success text-white', `${daysLeftInMonth} Days Left`);
    }));
  }

  getVariableExpensesGroupByMonth(year: number): Observable<any> {
    return this.http.get(`${this.apiURL}/costByMonth/${year}`);
  }

  getVariableExpensesByCity(year: number) {
    return this.http.get<IExpensesByCity[]>(`${this.apiURL}/totalByCity/${year}`);
  }

  async getCategoryExpensesAsChart() {
    const options = new ChartConfig('y');
    const labels = ['Car', 'Home', 'Undertake', 'Health Care'];
    const datasets = [
      { data: [21000, 13000, 9000, 5500], label: 'Expenses By Category' },
      // { data: [ 21000 ], label: 'Car' },
      // { data: [ 13000 ], label: 'Home' },
      // { data: [ 9000 ], label: 'Undertake' },
      // { data: [ 5500 ], label: 'Health Care' },
    ];

    return new CustomDataChart(labels, datasets, options);
  }

  async getSubcategoryExpensesAsChart() {
    const options = new ChartConfig('y');
    const labels = ['Restaurant', 'Books', 'Coffee', 'Appointments', 'Food'];
    const datasets = [
      {
        data: [7500, 5121, 4200, 1900, 1100],
        label: 'Expenses By Subcategory'
      },
    ];

    return new CustomDataChart(labels, datasets, options);
  }


}
