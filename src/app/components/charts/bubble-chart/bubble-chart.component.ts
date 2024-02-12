import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss']
})
export class BubbleChartComponent implements OnChanges {
  @Input() options: AgChartOptions;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.options = changes['options'].currentValue;
  }

}
