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

  agInit(params: ICellRendererParams<any, any, any>): void {
    const opt: Intl.DateTimeFormatOptions = { year: "2-digit", month: "short", day: "2-digit" };
    const dt = params.value ? new Date(params.value) : new Date();
    this.dateString = new Intl.DateTimeFormat('es-MX', opt).format(dt);
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }

}
