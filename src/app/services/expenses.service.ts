import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { KPI } from '../models/kpi';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IKPIValue } from '../models/interfaces/IKPI';
import { IExpenses, IExpensesByCategory, IExpensesByCity, IExpensesByMonth, IExpensesBySubcategory } from '../models/interfaces/expenses';
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

  saveExpense(record: IExpenses) {
    console.log(record);
    return this.http.post(this.apiURL, record);
  }

  getKPIAnnualVariableExpenses(year: number) {
    const URL = `${this.apiURL}/total/${year}`;
    return this.http.get<IKPIValue>(URL).pipe(map(result => {
      return new KPI('Annual Variable Expenses to Date', result.total, 'bg-primary text-white');
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

  getVariableExpensesGroupByMonth(year: number) {
    return this.http.get<IExpensesByMonth[]>(`${this.apiURL}/costByMonth/${year}`);
  }

  getVariableExpensesByCity(year: number) {
    return this.http.get<IExpensesByCity[]>(`${this.apiURL}/totalByCity/${year}`);
  }

  getByCategory(year: number, month?: number) {
    const URL = month
      ? `${this.apiURL}/expensesByCategory/${year}/${month}`
      : `${this.apiURL}/expensesByCategory/${year}`;

    return this.http.get<IExpensesByCategory[]>(URL);
  }

  getBySubcategory(year: number, month?: number) {
    const URL = month
      ? `${this.apiURL}/expensesBySubcategory/${year}/${month}`
      : `${this.apiURL}/expensesBySubcategory/${year}`;

    return this.http.get<IExpensesBySubcategory[]>(URL);
  }

}
