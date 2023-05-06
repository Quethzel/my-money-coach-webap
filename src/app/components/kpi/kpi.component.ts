import { Component, Input } from '@angular/core';
import { KPI } from 'src/app/models/kpi';

@Component({
  selector: 'app-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.scss']
})
export class KpiComponent {
  @Input() kpi!: KPI;

  constructor() { }

}
