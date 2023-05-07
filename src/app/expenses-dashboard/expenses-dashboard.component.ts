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
  
  sbKPIRemainingMontlyExpenses: Subscription = new Subscription;
  sbKPIAnnualExpenses: Subscription = new Subscription;
  sbKPIMontlyExpenses: Subscription = new Subscription;
  sbKPIAverageDailyExpenses: Subscription = new Subscription;

  sbExpensesByCity: Subscription = new Subscription;
  sbAnnualExpensesByMonth: Subscription = new Subscription;

  totalVariableExpensesByYear!: KPI;
  kpiMontlyExpenses!: KPI;
  kpiAverageDailyExpenses!: KPI;
  kpiRemainingMontlyBudget!: KPI;

  annualChart!: CustomDataChart<number>;
  cityChart!: CustomDataChart<number>;
  categoryChart!: CustomDataChart<number>;
  subcategoryChart!: CustomDataChart<number>;

  currentYear = 2023;

  constructor(
    private varexService: ExpensesService,
    private chartService: ExpensesChartService) { }
  
  ngOnInit(): void {
    this.sbKPIAnnualExpenses = this.varexService.getKPIAnnualVariableExpenses(this.currentYear).subscribe(kpi => {
      this.totalVariableExpensesByYear = kpi;
    });

    this.sbKPIMontlyExpenses = this.varexService.getKPITotalExpensesByCurrentMonth().subscribe(kpi => {
      this.kpiMontlyExpenses = kpi;
    });

    this.sbKPIAverageDailyExpenses = this.varexService.getKPIAverageDailyExpensesInThisMonth().subscribe(kpi => {
      this.kpiAverageDailyExpenses = kpi;
    });

    this.sbKPIRemainingMontlyExpenses = this.varexService.getKPIRemainingMontlyBudget().subscribe(kpi => {
      this.kpiRemainingMontlyBudget = kpi;
    });

    this.sbAnnualExpensesByMonth = this.varexService.getVariableExpensesGroupByMonth(this.currentYear).subscribe(data => {
      this.annualChart = this.chartService.annualByMonth(data);
    });

    this.sbExpensesByCity = this.varexService.getVariableExpensesByCity(this.currentYear).subscribe(data => {
      this.cityChart = this.chartService.expensesByCity(data);
    })
  
    this.getCategoryChart();
    this.getSubcategoryChart();
  }

  ngOnDestroy(): void {
    this.sbKPIAnnualExpenses.unsubscribe();
    this.sbKPIMontlyExpenses.unsubscribe();
    this.sbKPIAverageDailyExpenses.unsubscribe();
    this.sbKPIRemainingMontlyExpenses.unsubscribe();
    
    this.sbAnnualExpensesByMonth.unsubscribe();
    this.sbExpensesByCity.unsubscribe();
  }
  
  async getCategoryChart() {
    this.categoryChart = await this.varexService.getCategoryExpensesAsChart();
  }

  async getSubcategoryChart() {
    this.subcategoryChart = await this.varexService.getSubcategoryExpensesAsChart();
  }

  // events
  chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }


}
