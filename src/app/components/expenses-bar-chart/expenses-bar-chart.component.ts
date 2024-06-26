import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';

@Component({
  selector: 'app-expenses-bar-chart',
  templateUrl: './expenses-bar-chart.component.html',
  styleUrls: ['./expenses-bar-chart.component.scss']
})
export class ExpensesBarChartComponent implements OnChanges {
  @Input() options: AgChartOptions;

  constructor() {
    this.options = {};
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.options = changes['options'].currentValue;
  }

}
