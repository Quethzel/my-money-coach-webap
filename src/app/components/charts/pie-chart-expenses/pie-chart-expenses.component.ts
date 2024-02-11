import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';

@Component({
  selector: 'app-pie-chart-expenses',
  templateUrl: './pie-chart-expenses.component.html',
  styleUrls: ['./pie-chart-expenses.component.scss']
})
export class PieChartExpensesComponent implements OnChanges {
  @Input() options: AgChartOptions;

  constructor() {
    this.options = {};
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.options = changes['options'].currentValue;
  }

}
