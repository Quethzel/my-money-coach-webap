import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IKPIValue } from '../models/interfaces/IKPI';
import { IExpenses, IExpensesByCity, IExpensesByMonth, IExpensesBySubcategory } from '../models/interfaces/IExpenses';
import { CommonService } from './common.service';
import { VariableExpense } from '../models/variable-expense';
import { IChartByCategory } from '../models/interfaces/IChart';

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

    return this.http.get<IChartByCategory[]>(URL);
  }

  getBySubcategory(year: number, month?: number) {
    const URL = month
      ? `${this.apiURL}/expensesBySubcategory/${year}/${month}`
      : `${this.apiURL}/expensesBySubcategory/${year}`;

    return this.http.get<IExpensesBySubcategory[]>(URL);
  }

}
