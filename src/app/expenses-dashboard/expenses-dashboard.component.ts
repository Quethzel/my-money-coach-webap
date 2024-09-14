import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartEvent } from 'chart.js';
import { ExpensesService } from '../services/expenses.service';
import { Subscription } from 'rxjs';
import { CustomDataChart } from '../models/custom-data-chart';
import { ExpensesChartService } from '../services/expenses-chart.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ExpenseFormComponent } from '../components/expense-form/expense-form.component';
import { IExpenses } from '../models/interfaces/IExpenses';
import { KPIType, KPIv2 } from '../models/kpiV2';
import { CommonService } from '../services/common.service';
import { AgChartOptions } from 'ag-charts-community';

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

  annualChart!: CustomDataChart<number>;
  cityChart!: CustomDataChart<number>;
  categoryChart!: CustomDataChart<number>;
  subcategoryChart!: CustomDataChart<number>;
  bsModalRef?: BsModalRef;
  
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  expenses!: IExpenses[];
  sbExpenses: Subscription = new Subscription;

  kpiMonthlyExpenses: KPIv2;
  kpiAverageDailyExpenses: KPIv2;
  kpiRemainingDaysMonth: KPIv2;
  
  expensesPerYearDataChart: AgChartOptions;
  expensesByCityDataChart: AgChartOptions;
  expensesByCategoryDataChart: AgChartOptions;


  constructor(
    private expenseService: ExpensesService,
    private chartService: ExpensesChartService, private modalService: BsModalService, private commonService: CommonService) { 
      this.expenses = [];
    }
  
  ngOnInit(): void {
    this.getExpenses();
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

  getExpenses() {
    this.sbExpenses = this.expenseService.getExpenses(this.currentYear).subscribe(result => {
      this.expenses = result;
      this.loadKPIs(this.expenses);

      this.buildChartExpensesByYear(this.expenses);
      this.buildChartByCity(this.expenses);
      this.buildChartByCategory(this.expenses);
    });
  }

  loadKPIs(data: IExpenses[]) {
    const totalExpenses = this.getTotalExpenses(data);
    const title = "Total Expenses in " + this.currentYear;
    this.kpiMonthlyExpenses = new KPIv2(title, totalExpenses, KPIType.Currency);

    const dailyAvg = this.averageDaily(data, this.currentDate, 'year');
    this.kpiAverageDailyExpenses = new KPIv2('Average Daily Expenses', dailyAvg, KPIType.Currency);


    const today = new Date().setHours(0,0,0,0);
    const chosenDate = new Date(this.currentDate).setHours(0,0,0,0);
    let daysLeft: number;
    if (chosenDate < today) { daysLeft = 0; } 
    else {
      daysLeft = this.commonService.getRemaningDaysInCurrentYear();
    }
    this.kpiRemainingDaysMonth = new KPIv2('Days Left', daysLeft, KPIType.Number);
  }

  private getTotalExpenses(data: IExpenses[]) {
    return data.reduce((total, e) => total + e.cost, 0);
  }

  private averageDaily(data: IExpenses[], date: Date, period: 'month' | 'year') {
    const total = this.getTotalExpenses(data);
    let days: number;
    let result: number;

    if (period == 'month') {
      days = date.getDate();
      result = total/days;
    } else if (period == 'year') {

      const firstDateOfTheYear = new Date(date.getFullYear(), 0, 1);
      const lastDateOfTheYear = new Date(date.getFullYear(), 11, 31, 23, 59, 59);
      const todayWithoutTime = new Date().setHours(0,0,0,0);
      const dateWithoutTime = new Date(date).setHours(0,0,0,0);
      const today = dateWithoutTime < todayWithoutTime ? lastDateOfTheYear : new Date();
      const diff = today.getTime() - firstDateOfTheYear.getTime();
      const daysDiff = Math.ceil(diff / (1000 * 3600 * 24) );
      result = total/daysDiff;
    } else {
      console.log('measure not implemented!');
    }

    return result;
  }

  private buildChartExpensesByYear(data: IExpenses[]) {
    const titleChart = `Total Expenses - ${this.currentYear}`;
    const options: AgChartOptions = {
      title: {
        text: titleChart
      },
      subtitle: {
        text: 'Variable Expenses in MXN',
      },
      data: data.map(v => ({ month: v.date.getMonth() + 1, cost: v.cost })),
      series: [{
        xKey: 'monthName',
        yKey: 'total',
        type: 'line',
        marker: {
          enabled: true,
        },
        tooltip: {
          renderer: (params: any) => {
            return {
              content: `${params.yKey} : ${CommonService.formatAsCurrency(params.datum.total)}`,
            };
          }
        }
      }],
    };

    this.expensesPerYearDataChart = this.chartService.byYear(data, options);
  }

  buildChartByCity(data: IExpenses[]) {
    const options: AgChartOptions = {
      title: {
        text: "Expenses by City",
      },
      subtitle: {
        text: 'Variable Expenses in MXN',
      },
      data: data,
      series: [
        {
          type: 'pie',
          angleKey: 'Total',
          calloutLabelKey: 'City',
          sectorLabelKey: 'Total',
          sectorLabel: {
            color: 'white',
            fontWeight: 'bold',
            formatter: ({ value }: { value: number }) => `$${(value / 1000).toFixed(0)}K`,
          },
          title: {
            enabled: true,
            text: 'Total Expenses',
          },
        },
      ],
    };
    this.expensesByCityDataChart = this.chartService.byCity(data, options);
  }

  buildChartByCategory(data: IExpenses[]) {
    const options: AgChartOptions = {
      data: data,
      series: [
        {
          type: 'bar',
          xKey: 'category',
          yKey: 'total',
          yName: 'Total Expenses',
          tooltip: {
            renderer: (params: any) => {
              return {
                content: params.yValue != null 
                  ? `${params.yKey} : ${CommonService.formatAsCurrency(params.yValue)}` 
                  : `${params.yKey}: 0`
              };
            }
          }
        }
      ],
    };
    
    this.expensesByCategoryDataChart = this.chartService.byCategory(data, options);
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
