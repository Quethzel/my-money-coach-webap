import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IAnnualExpense } from '../models/interfaces/IAnnualExpense';
import { AnnualExpense } from '../models/annual-expense';
import { CommonService } from './common.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnualExpensesService {
  private apiURL = `${environment.mcApi}/annualExpenses`;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  /**
   * Returns all expenses for the given year by the logged user
   * @param year year to filter
   * @returns an observable with the expenses
   */
  getAllExpensesByYear(year: number) {
    const URL = `${this.apiURL}/year/${year}`;
    return this.http.get<IAnnualExpense[]>(URL).pipe(map(data => { 
      data.forEach(v => { v.paymentDate = new Date(v.paymentDate) });
      return data; 
    }));
  }

  /**
   * Creates or updates an annual expense
   * @param expense annual expense to save
   * @returns an observable with the saved expense
   */
  saveExpense(expense: AnnualExpense) {
    return this.commonService.isEmpty(expense.id)
      ? this.http.post(this.apiURL, expense)
      : this.http.put(`${this.apiURL}/${expense.id}`, expense);
  }

  /**
   * Deletes an annual expense by id
   * @param id annual expense id to delete
   * @returns an observable with the deleted expense
   */
  delete(id: string) {
    return this.http.delete<AnnualExpense>(`${this.apiURL}/${id}`);
  }

}
