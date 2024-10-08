import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IExpenses } from 'src/app/models/interfaces/IExpenses';
import { ExpensesService } from 'src/app/services/expenses.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { CommonService } from 'src/app/services/common.service';
import { ExpenseFilters } from 'src/app/models/ExpenseFilters';
import { VariableExpense } from 'src/app/models/variable-expense';
import { KPIType, KPIv2 } from 'src/app/models/kpiV2';
import { VariableExpensesEventhubService } from 'src/app/services/variable-expenses-eventhub.service';
import { AgChartOptions } from 'ag-charts-community';
import { ExpensesChartService } from 'src/app/services/expenses-chart.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit, OnDestroy {
  bsModalRef?: BsModalRef;
  sbExpenses!: Subscription;
  expenses!: IExpenses[];
  activeFilter: string;
  currentDate: Date;
  currentMonth: string;

  filters: ExpenseFilters;
  gridHasUIFilters: boolean;

  kpiMonthlyExpenses: KPIv2;
  kpiAverageDailyExpenses: KPIv2;
  kpiRemaningMonthlyBudget: KPIv2;
  kpiRemainingDaysMonth: KPIv2;
  kpiTotalRows: KPIv2;

  kpiRemaningMonthlyBudgetClass: string;

  sbGridHasUIFilters: Subscription;

  expensesByCategoryDataChart: AgChartOptions;
  expensesByCityDataChart: AgChartOptions;
  expensesByDayAndCategoryDataChart: AgChartOptions;
  expensesByDayDataChart: AgChartOptions;
  expensesBySubcategoryDataChart: AgChartOptions;

  constructor(
    private modalService: BsModalService,
    private expenseService: ExpensesService,
    private commonService: CommonService,
    private chartService: ExpensesChartService,
    private veEventHub: VariableExpensesEventhubService
    ) {
      this.currentDate = new Date();
      this.currentMonth = this.commonService.getMonthName(this.currentDate.getMonth());
      this.activeFilter = 'month';
      this.expenses = [];

      this.filters = new ExpenseFilters();

      this.sbGridHasUIFilters = this.veEventHub.$gridHasUIFilters.subscribe(value => {
        this.gridHasUIFilters = value;
      });
  }

  ngOnInit() {
    this.filterBy(this.activeFilter);
  }

  ngOnDestroy(): void {
    if (this.sbExpenses) this.sbExpenses.unsubscribe();
    if (this.sbGridHasUIFilters) this.sbGridHasUIFilters.unsubscribe();
  }

  getExpenses(filters: ExpenseFilters) {
    this.sbExpenses = this.expenseService.getExpenses(filters.year, filters.month).subscribe(data => {
      this.expenses = data;
      this.loadKPIs(this.expenses);

      this.buildChartByCategory(this.expenses);
      this.buildChartByCity(this.expenses);
      this.buildChartByDay(this.expenses);
      this.buildChartByDayAndCategory(this.expenses);
      this.buildChartBySubcategory(this.expenses);
    });
  }

  filterBy(filterBy: string) {
    this.activeFilter = filterBy;
    this.currentDate = new Date();
    
    if(filterBy == 'month') {
      this.getExpenses(this.filters.byThisMonth());
    } else {
      this.getExpenses(this.filters.byThisYear());
    }
  }

  filterByDate(date: Date, byPeriod: 'month' | 'year') {
    const period = new ExpenseFilters();
    period.year = date.getFullYear();
    period.month = byPeriod == 'month' ? date.getMonth() : null;
    this.getExpenses(period);
  }

  openExpenseModal(item?: IExpenses) {
    const data = item ? item : {};
    const modalParas: ModalOptions = {
      class: 'modal-lg',
      initialState: data
    };

    this.bsModalRef = this.modalService.show(ExpenseFormComponent, modalParas);
    if (this.bsModalRef.onHidden) {
      this.bsModalRef.onHidden.subscribe((res) => {
        this.filterBy(this.activeFilter);
      });
    }
  }

  editItem(item: IExpenses) {
    this.openExpenseModal(item);
  }

  deleteItem(item: VariableExpense) {
    this.expenseService.delete(item.id).subscribe(item => {
      this.filterBy(this.activeFilter);  
    });
  }

  saveItem(item: VariableExpense) {
    this.expenseService.save(item).subscribe(() => {
      this.filterBy(this.activeFilter);
    });
  }

  clearGridFilters() {
    this.veEventHub.setGridHasUIFilters(false);
  }

  onPrevPeriod() {
    if (this.activeFilter == 'month') {
      if (this.currentDate.getMonth() == 0) {
        this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
        this.currentDate.setMonth(11);
      } else {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      }
      this.currentMonth = this.commonService.getMonthName(this.currentDate.getMonth());
    } else if (this.activeFilter == 'year') {
      this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
    }
    this.filterByDate(this.currentDate, this.activeFilter as 'month' | 'year');
  }

  onNextPeriod() {
    if (this.activeFilter == 'month') {
      if (this.currentDate.getMonth() == new Date().getMonth()) return;
      if (this.currentDate.getMonth() == 11) {
        this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
        this.currentDate.setMonth(0);
      } else {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      } 
      this.currentMonth = this.commonService.getMonthName(this.currentDate.getMonth());
    } else if (this.activeFilter == 'year') {
      if (this.currentDate.getFullYear() == new Date().getFullYear()) return;
      this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
    }
    this.filterByDate(this.currentDate, this.activeFilter as 'month' | 'year');
  }

  buildChartByCategory(data: IExpenses[]) {
    const dataTop = 7;
    const titleChart = "Expenses by Category" + (dataTop < data.length ? ` (Top ${dataTop})` : '');
    const options: AgChartOptions = {
      title: {
        text: titleChart,
      },
      subtitle: {
        text: 'Variable Expenses in MXN',
      },
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
    
    this.expensesByCategoryDataChart = this.chartService.byCategory(data, options, dataTop);
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

  buildChartByDayAndCategory(data: IExpenses[]) {
    const options: AgChartOptions = {
        title: {
          text: "Expenses by Day & Category",
        },
        subtitle: {
          text: "Variable Expenses in MXN",
        },
        series: [{
          type: "bubble",
          title: "Expenses",
          xKey: "Category",
          xName: "Category",
          yKey: "Day",
          yName: "Day",
          sizeKey: "Total",
          sizeName: "Total",
        }],
        data: data,
        axes: [
          {
            position: "bottom",
            type: "category",
            gridLine: {
              enabled: true,
            },
            line: {
              enabled: false,
            },
          },
          {
            position: "left",
            type: "category",
            line: {
              enabled: false,
            },
          },
        ],
        seriesArea: {
          padding: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 30,
          },
        }
    };

    this.expensesByDayAndCategoryDataChart = this.chartService.byDayAndCategory(data, options);
  }

  buildChartBySubcategory(data: IExpenses[]) {
    const dataTop = 7;
    const titleChart = "Expenses by Subcategory" + (dataTop < data.length ? ` (Top ${dataTop})` : '');
    const options: AgChartOptions = {
      title: {
        text: titleChart,
      },
      subtitle: {
        text: "Variable Expenses in MXN",
      },
      series: [{
        type: "bar",
        xKey: "subcategory",
        yKey: "total",
        yName: "Total Expenses",
        tooltip: {
          renderer: (params: any) => {
            return {
              content: `${params.yKey} : ${CommonService.formatAsCurrency(params.yValue)}`
            };
          }
        }
      }],
      data: data
    };

    this.expensesBySubcategoryDataChart = this.chartService.bySubcategories(data, options, dataTop);
  }

  buildChartByDay(data: IExpenses[]) {
    const options: AgChartOptions = {
      title: {
        text: "Total Expenses by Day of the Week",
      },
      subtitle: {
        text: "Variable Expenses in MXN",
      },
      series: [{
        type: "line",
        xKey: "Day",
        yKey: "Total",
        yName: "Total Expenses",
        marker: {
          enabled: true,
        },
        // tooltip: {
        //   renderer: (params: any) => {
        //     return {
        //       content: `${params.yKey} : ${CommonService.formatAsCurrency(params.yValue)}`
        //     };
        //   }
        // }
      }],
      data: data
    };

    this.expensesByDayDataChart = this.chartService.byDay(data, options);
  }

  private getTotalExpenses(data: IExpenses[]) {
    let total = 0;
    this.expenses.forEach(e => total += e.cost);
    return total;
  }

  private loadKPIs(data: IExpenses[]) {
    const total = this.getTotalExpenses(data);
    const totalExpTitle = this.activeFilter == 'month' ? 'Monthly Expenses' : 'Annual Expenses';
    this.kpiMonthlyExpenses = new KPIv2(totalExpTitle, total, KPIType.Currency);

    let dailyAvg;
    if (this.activeFilter == 'month' || this.activeFilter == 'year') {
      dailyAvg = this.averageDaily(data, this.currentDate, this.activeFilter);
    }
    this.kpiAverageDailyExpenses = new KPIv2('Average Daily Expenses', dailyAvg, KPIType.Currency);


    // This KPI will be only available for filter by Month
    const userSettings = localStorage.getItem('settings');
    if (this.activeFilter == 'month' && userSettings != null) {
      const settings = JSON.parse(userSettings);
      const budget = settings.monthlyExpenseBudget;
      const remaining = budget - this.getTotalExpenses(data);
      const budgetAsCurrency = CommonService.formatAsCurrency(budget);
      const legend = `/ ${budgetAsCurrency}`;
      
      if (remaining <= 0) { this.kpiRemaningMonthlyBudgetClass = 'bl6-danger' }
      else {
        const twentyFivePercent = (25 * remaining) / 100;
        if (remaining <= twentyFivePercent) {
          this.kpiRemaningMonthlyBudgetClass = 'bl6-warning';
        }
      }
      
      this.kpiRemaningMonthlyBudget = new KPIv2('Remaning Monthly Budget', remaining, KPIType.Currency, legend);
    }

    const today = new Date().setHours(0,0,0,0);
    const chosenDate = new Date(this.currentDate).setHours(0,0,0,0);
    let daysLeft: number;

    if (chosenDate < today) {
      daysLeft = 0;
    } else if (this.activeFilter == 'month') { 
      daysLeft = this.commonService.getRemainingDaysInCurrentMonth();
    } else {
      daysLeft = this.commonService.getRemaningDaysInCurrentYear();
    }

    this.kpiRemainingDaysMonth = new KPIv2('Days Left', daysLeft, KPIType.Number);

    this.kpiTotalRows = new KPIv2('Total Rows', data.length, KPIType.Number);
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


}
