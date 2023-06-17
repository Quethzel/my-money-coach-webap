import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartEvent } from 'chart.js';
import { KPI } from '../models/kpi';
import { ExpensesService } from '../services/expenses.service';
import { Subscription } from 'rxjs';
import { CustomDataChart } from '../models/custom-data-chart';
import { ExpensesChartService } from '../services/expenses-chart.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ExpenseFormComponent } from '../components/expense-form/expense-form.component';

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

  sbAnnualExpensesByMonth: Subscription = new Subscription;
  sbCategory: Subscription = new Subscription;
  sbSubcategory: Subscription = new Subscription;
  sbExpensesByCity: Subscription = new Subscription;

  totalVariableExpensesByYear!: KPI;
  kpiMontlyExpenses!: KPI;
  kpiAverageDailyExpenses!: KPI;
  kpiRemainingMontlyBudget!: KPI;

  annualChart!: CustomDataChart<number>;
  cityChart!: CustomDataChart<number>;
  categoryChart!: CustomDataChart<number>;
  subcategoryChart!: CustomDataChart<number>;

  currentYear = new Date().getFullYear();
  bsModalRef?: BsModalRef;

  constructor(
    private varexService: ExpensesService,
    private chartService: ExpensesChartService, private modalService: BsModalService) { }
  
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
      this.annualChart = this.chartService.byMonth(data);
    });

    this.sbCategory = this.varexService.getByCategory(this.currentYear).subscribe(data => {
      this.categoryChart = this.chartService.byCategory(data);
    });

    this.sbSubcategory = this.varexService.getBySubcategory(this.currentYear).subscribe(data => {
      this.subcategoryChart = this.chartService.bySubcategory(data);
    });

    this.sbExpensesByCity = this.varexService.getVariableExpensesByCity(this.currentYear).subscribe(data => {
      this.cityChart = this.chartService.byCity(data);
    });
    
  }

  ngOnDestroy(): void {
    if (this.sbKPIAnnualExpenses) this.sbKPIAnnualExpenses.unsubscribe();
    if (this.sbKPIMontlyExpenses) this.sbKPIMontlyExpenses.unsubscribe();
    if (this.sbKPIAverageDailyExpenses) this.sbKPIAverageDailyExpenses.unsubscribe();
    if (this.sbKPIRemainingMontlyExpenses) this.sbKPIRemainingMontlyExpenses.unsubscribe();
    
    if (this.sbAnnualExpensesByMonth) this.sbAnnualExpensesByMonth.unsubscribe();
    if (this.sbCategory) this.sbCategory.unsubscribe();
    if (this.sbSubcategory) this.sbSubcategory.unsubscribe();
    if (this.sbExpensesByCity) this.sbExpensesByCity.unsubscribe();
  }

  newExpense() {
    this.bsModalRef = this.modalService.show(ExpenseFormComponent);
  }


  // events
  chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }


}
