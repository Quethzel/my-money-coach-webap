import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnChanges {
  @Input() options: AgChartOptions;

  constructor() {
    this.options = {};
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.options = changes['options'].currentValue;
  }
}
