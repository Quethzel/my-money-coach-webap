import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IExpenses } from '../models/interfaces/IExpenses';
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

  getExpenses(year: number, month?: number | null) {
    const URL = month != null
      ? `${this.apiURL}/list/${year}/${month}`
      : `${this.apiURL}/list/${year}`;

    return this.http.get<IExpenses[]>(URL).pipe(map(data => {
      data.forEach(v => { v.date = new Date(v.date) });
      return data;
    }));
  }

  save(expense: VariableExpense) {
    return this.commonService.isEmpty(expense.id)
      ? this.http.post(this.apiURL, expense)
      : this.http.put(`${this.apiURL}/${expense.id}`, expense);
  }

  delete(id: string) {
    return this.http.delete<VariableExpense>(`${this.apiURL}/${id}`);
  }

}
