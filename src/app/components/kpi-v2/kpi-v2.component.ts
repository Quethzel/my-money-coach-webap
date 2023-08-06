import { Component, Input } from '@angular/core';
import { KPIv2 } from 'src/app/models/kpiV2';

@Component({
  selector: 'app-kpi-v2',
  templateUrl: './kpi-v2.component.html',
  styleUrls: ['./kpi-v2.component.scss']
})
export class KpiV2Component {
  @Input() kpi: KPIv2;
}
