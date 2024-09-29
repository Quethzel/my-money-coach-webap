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


  transformExpensesByCity(expenses: IExpenses[]): { city: string, residenceTime: number, costPerDay: number, total: number }[] {
    const expensesByCity = expenses.reduce((acc, expense) => {
      const cityCode = expense.cityCode || 'Unknown'; // Asegurarse de que siempre haya una ciudad (puedes ajustar 'Unknown' según tu necesidad)
      const expenseDate = this.formatDateToYMD(expense.date)

      if (!acc[cityCode]) {
        acc[cityCode] = {
          total: 0,
          uniqueDates: new Set(),
          days: 0,
        };
      }

      acc[cityCode].total += expense.cost;
      acc[cityCode].uniqueDates.add(expenseDate);

      return acc;
    }, {} as Record<string, { total: number, uniqueDates: Set<string>, days: number }>);

    const result = Object.entries(expensesByCity).map(([cityCode, data]) => {
      const residenceTime = data.uniqueDates.size;
      const costPerDay = residenceTime > 0 ? data.total / residenceTime : 0;

      return {
        city: cityCode,
        residenceTime,
        costPerDay: parseFloat(costPerDay.toFixed(2)),
        total: parseFloat(data.total.toFixed(2)),
      };
    });

    return result;
  }

    /**
   * Formatea una fecha a "YYYY-MM-DD".
   * @param date La fecha a formatear.
   * @returns Fecha formateada como "YYYY-MM-DD".
   */
    private formatDateToYMD(date: Date): string {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); 
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }



}
