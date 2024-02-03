import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { KPI } from '../models/kpi';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IKPIValue } from '../models/interfaces/IKPI';
import { IExpenses, IExpensesByCategory, IExpensesByCity, IExpensesByMonth, IExpensesBySubcategory } from '../models/interfaces/IExpenses';
import { CommonService } from './common.service';
import { VariableExpense } from '../models/variable-expense';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private apiURL = `${environment.mcApi}/expenses`;

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
  ) { }

  getAllExpenses() {
    const URL = `${this.apiURL}`;
    return this.http.get<IExpenses[]>(URL);
  }

  getExpenses(year: number, month?: number | null) {
    const URL = month != null
      ? `${this.apiURL}/list/${year}/${month}`
      : `${this.apiURL}/list/${year}`;
      
    return this.http.get<IExpenses[]>(URL).pipe(map(data => { 
      data.forEach(v => { v.date = new Date(v.date) });
      return data; 
    }));
  }

  saveExpense(expense: VariableExpense) {
    return this.commonService.isEmpty(expense.id)
      ? this.http.post(this.apiURL, expense)
      : this.http.put(`${this.apiURL}/${expense.id}`, expense);
  }

  delete(id: string) {
    return this.http.delete<VariableExpense>(`${this.apiURL}/${id}`);
  }

  getKPIAnnualVariableExpenses(year: number) {
    const URL = `${this.apiURL}/total/${year}`;
    return this.http.get<IKPIValue>(URL).pipe(map(result => {
      return new KPI('Annual Accrued Expenses', result.total, 'bg-primary text-white');
    }));
  }

  getKPITotalExpensesByCurrentMonth() {
    return this.http.get<IKPIValue>(`${this.apiURL}/totalMontlyExpenses`).pipe(map(result => {
      return new KPI('Montly Expenses', result.total, 'bg-primary text-white')
    }));
  }

  getKPIAverageDailyExpensesInThisMonth() {
    return this.http.get<IKPIValue>(`${this.apiURL}/averageDailyExpenses`).pipe(map(result => {
      return new KPI('Average Daily Expenses', result.total, 'bg-primary text-white')
    }));
  }

  getKPIRemainingMontlyBudget() {
    return this.http.get<IKPIValue>(`${this.apiURL}/remainingMontlyBudget`).pipe(map(result => {
      if (result.total != null) {
        const daysLeftInMonth = this.commonService.getRemainingDaysInCurrentMonth();
        return new KPI('Remaining Monthly Budget', result.total, 'bg-success text-white', `${daysLeftInMonth} Days Left`);
      } else {
        return new KPI('Remaining Monthly Budget', result.total, 'bg-danger text-white', `Not set`);
      }

      
    }));
  }

  getVariableExpensesGroupByMonth(year: number) {
    return this.http.get<IExpensesByMonth[]>(`${this.apiURL}/groupByMonth/${year}`);
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
