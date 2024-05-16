import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { VariableExpensesEventhubService } from '../services/variable-expenses-eventhub.service';
import { ExpensesService } from '../services/expenses.service';
import { VariableExpense } from '../models/variable-expense';
import { IExpenses } from '../models/interfaces/IExpenses';
import { ExpenseFilters } from '../models/ExpenseFilters';
import { AgChartOptions } from 'ag-charts-community';
import { ExpensesChartService } from '../services/expenses-chart.service';


@Component({
  selector: 'app-expenses-list',
  templateUrl: './variable-expenses.component.html',
  styleUrls: ['./variable-expenses.component.scss']
})
export class VariableExpensesComponent implements OnDestroy {
  private expensesSub: Subscription;
  private routeParamsSub: Subscription;
  private gridHasUIFiltersSub: Subscription;

  expenses!: IExpenses[];
  categoryDataChart: AgChartOptions;
  subcategoryDataChart: AgChartOptions;

  private currentDate: Date;
  private activeMonth: string;
  activeFilter: 'month' | 'year';
  gridHasUIFilters: boolean;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private commonService: CommonService,
    private expenseService: ExpensesService,
    private chartService: ExpensesChartService,
    private veEventHub: VariableExpensesEventhubService
  ) {
    this.expenses = [];

    this.routeParamsSub = this.activeRoute.params.subscribe(params => {
      if (params['year'] && params['month']) {
        this.activeFilter = 'month';
        this.currentDate = new Date(+params['year'], +params['month'] - 1);
        this.activeMonth = this.commonService.getMonthName(this.currentDate.getMonth());
      } else if (params['year']) {
        this.activeFilter = 'year';
        this.currentDate = new Date(+params['year'], 0);
      }

      const period = new ExpenseFilters();
      period.year = this.currentDate.getFullYear();
      period.month = this.activeFilter == 'month' ? this.currentDate.getMonth() : null;
      
      this.getExpenses(period);

    });

    this.gridHasUIFiltersSub = this.veEventHub.$gridHasUIFilters.subscribe(value => {
      this.gridHasUIFilters = value;
    });
  }

  ngOnDestroy(): void {
    this.routeParamsSub.unsubscribe();
    this.gridHasUIFiltersSub.unsubscribe();
    if (this.expensesSub) {
      this.expensesSub.unsubscribe();
    }
  }

  onFilter(filter: 'month' | 'year') {
    this.activeFilter = filter;
    console.log("Active filter: ", this.activeFilter);
    if (filter == 'month') {
      this.activeMonth = this.commonService.getMonthName(this.currentDate.getMonth());
    }
    this.filterByDate(this.currentDate, filter);
  }

  onPrevPeriod() {
    if (this.activeFilter == 'month') {
      if (this.currentDate.getMonth() == 0) {
        this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
        this.currentDate.setMonth(11);
      } else {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      }
      this.activeMonth = this.commonService.getMonthName(this.currentDate.getMonth());
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
      this.activeMonth = this.commonService.getMonthName(this.currentDate.getMonth());
    } else if (this.activeFilter == 'year') {
      if (this.currentDate.getFullYear() == new Date().getFullYear()) return;
      this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
    }
    this.filterByDate(this.currentDate, this.activeFilter as 'month' | 'year');
  }

  onClearGridFilters() {
    this.veEventHub.setGridHasUIFilters(false);
  }

  deleteItem(item: VariableExpense) {
    this.expenseService.delete(item.id).subscribe(item => {
      this.onFilter(this.activeFilter);
    });
  }

  saveItem(item: VariableExpense) {
    this.expenseService.saveExpense(item).subscribe(() => {
      this.onFilter(this.activeFilter);
    });
  }

  private filterByDate(date: Date, filter: 'month' | 'year') {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    if (filter == 'year') {
      this.router.navigate(['/variable-expenses', year]);
    } else if (filter == 'month') {
      this.router.navigate(['/variable-expenses', year, month]);
    }
  }

  private getExpenses(filters: ExpenseFilters) {
    this.expensesSub = this.expenseService.getExpenses(filters.year, filters.month).subscribe(data => {
      this.expenses = data;

      this.buildChartByCategory(data);
      this.buildChartBySubcategory(data);
    });
  }

  private buildChartByCategory(data: IExpenses[]) {
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
    
    this.categoryDataChart = this.chartService.byCategory(data, options, dataTop);
  }

  private buildChartBySubcategory(data: IExpenses[]) {
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

    this.subcategoryDataChart = this.chartService.bySubcategories(data, options, dataTop);
  }

}
