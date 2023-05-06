import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartEvent } from 'chart.js';
import { KPI } from '../models/kpi';
import { ExpensesService } from '../services/expenses.service';
import { Subscription } from 'rxjs';
import { CustomDataChart } from '../models/custom-data-chart';
import { ExpensesChartService } from '../services/expenses-chart.service';

@Component({
  selector: 'app-expenses-dashboard',
  templateUrl: './expenses-dashboard.component.html',
  styleUrls: ['./expenses-dashboard.component.scss']
})
export class ExpensesDashboardComponent implements OnInit, OnDestroy {
  
  subKPIs: Subscription = new Subscription;
  subKPITotalExpenses: Subscription = new Subscription;

  subExpensesByCity: Subscription = new Subscription;
  subAnnualExpensesByMonth: Subscription = new Subscription;

  kpis: KPI[] = [];
  totalVariableExpensesByYear!: KPI;

  annualChart!: CustomDataChart<number>;
  cityChart!: CustomDataChart<number>;
  categoryChart!: CustomDataChart<number>;
  subcategoryChart!: CustomDataChart<number>;

  currentYear = 2023;

  constructor(
    private exService: ExpensesService,
    private chartService: ExpensesChartService) { }
  
  ngOnInit(): void {
    this.subKPIs = this.exService.getKPIs().subscribe(kpis => {
      this.kpis = kpis;
    });

    this.subKPITotalExpenses = this.exService.getKPIAnnualVariableExpenses(this.currentYear).subscribe(kpi => {
      this.totalVariableExpensesByYear = kpi;
    });

    this.subAnnualExpensesByMonth = this.exService.getVariableExpensesGroupByMonth(this.currentYear).subscribe(data => {
      this.annualChart = this.chartService.annualByMonth(data);
    });

    this.subExpensesByCity = this.exService.getVariableExpensesByCity(this.currentYear).subscribe(data => {
      this.cityChart = this.chartService.expensesByCity(data);
    })
  
    this.getCategoryChart();
    this.getSubcategoryChart();
  }

  ngOnDestroy(): void {
    this.subKPIs.unsubscribe();
    this.subKPITotalExpenses.unsubscribe();
    this.subAnnualExpensesByMonth.unsubscribe();
    this.subExpensesByCity.unsubscribe();
  }
  
  async getCategoryChart() {
    this.categoryChart = await this.exService.getCategoryExpensesAsChart();
  }

  async getSubcategoryChart() {
    this.subcategoryChart = await this.exService.getSubcategoryExpensesAsChart();
  }

  // events
  chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }


}
