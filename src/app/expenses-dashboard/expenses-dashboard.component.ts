import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartEvent } from 'chart.js';
import { KPI } from '../models/kpi';
import { ExpensesService } from '../services/expenses.service';
import { Subscription } from 'rxjs';
import { CustomDataChart } from '../models/custom-data-chart';


@Component({
  selector: 'app-expenses-dashboard',
  templateUrl: './expenses-dashboard.component.html',
  styleUrls: ['./expenses-dashboard.component.scss']
})
export class ExpensesDashboardComponent implements OnInit, OnDestroy {
  
  subKPIs: Subscription = new Subscription;
  kpis: KPI[] = []; 

  annualChart!: CustomDataChart<number>;
  cityChart!: CustomDataChart<number>;

  constructor(private exService: ExpensesService) { }
  
  ngOnInit(): void {
    this.subKPIs = this.exService.getKPIs().subscribe(kpis => {
      this.kpis = kpis;
    });
  
    this.getAnnualExpensesChart();
    this.getCityChart();
  }

  async getAnnualExpensesChart() {
    this.annualChart = await this.exService.getAnnualExpensesAsChart();
  }

  async getCityChart() {
    this.cityChart = await this.exService.getAnnualExpensesByCityAsChart();
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
