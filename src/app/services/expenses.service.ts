import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { KPI } from '../models/kpi';

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
}
