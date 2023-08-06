import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { KPIType, KPIv2 } from 'src/app/models/kpiV2';
import { VariableExpense } from 'src/app/models/variable-expense';
//TODO: This component is not unsed. Was replaced by KPI components
@Component({
  selector: 'app-variable-expenses-kpi-bar',
  templateUrl: './variable-expenses-kpi-bar.component.html',
  styleUrls: ['./variable-expenses-kpi-bar.component.scss']
})
export class VariableExpensesKpiBarComponent implements OnInit {
  @Input() expenses: VariableExpense[];
  totalMonthlyExpenses = 0;
  kpiMonthlyExpenses: KPIv2;

  constructor() { }

  ngOnInit(): void {
    this.totalMonthlyExpenses = this.getTotalExpenses();
    this.kpiMonthlyExpenses = new KPIv2('Monthly Expenses', this.totalMonthlyExpenses, KPIType.Currency);
  }

  private getTotalExpenses() {
    let total = 0;
    this.expenses.forEach(e => total += e.cost);
    return total;
  }

}
