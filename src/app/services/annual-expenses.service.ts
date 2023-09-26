import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IAnnualExpense } from '../models/interfaces/IAnnualExpense';

@Injectable({
  providedIn: 'root'
})
export class AnnualExpensesService {
  private apiURL = `${environment.mcApi}/annualExpenses`;

  constructor(private http: HttpClient) { }

  getAllExpensesByYear(year: number) {
    const URL = `${this.apiURL}/year/${year}`;
    return this.http.get<IAnnualExpense[]>(URL);
  }

}
