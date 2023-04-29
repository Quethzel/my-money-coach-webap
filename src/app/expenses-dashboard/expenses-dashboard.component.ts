import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { KPI } from '../models/kpi';
import { ExpensesService } from '../services/expenses.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-expenses-dashboard',
  templateUrl: './expenses-dashboard.component.html',
  styleUrls: ['./expenses-dashboard.component.scss']
})
export class ExpensesDashboardComponent implements OnInit, OnDestroy {
  
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
    datasets: [
      { 
        data: [ 65000, 59000, 80000, 81000, 56000, 55000, 40000, 66000, 77000, 120000, 33000, 30000 ], 
        label: 'Expenses By Month'
      },
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  subKPIs: Subscription = new Subscription;
  kpis: KPI[] = []; 

  constructor(private exService: ExpensesService) { }
  
  ngOnInit(): void {
    this.subKPIs = this.exService.getKPIs().subscribe(kpis => {
      this.kpis = kpis;
    });
  }


  ngOnDestroy(): void {
    this.subKPIs.unsubscribe();
  }

  // events
  chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }


}
