import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-cell-renderer-date',
  template: '{{dateString}}',
  styleUrls: ['./cell-renderer-date.component.scss']
})
export class CellRendererDateComponent implements ICellRendererAngularComp {
  dateString: string;
  locale = 'es-MX';
  defaultFormat = { year: "2-digit", month: "short", day: "2-digit" };

  agInit(params: any): void {
    const opt = params.formatDate ? params.formatDate : this.defaultFormat;
    const dt = params.value ? new Date(params.value) : new Date();

    this.dateString = new Intl.DateTimeFormat(this.locale, opt).format(dt);
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }

}
