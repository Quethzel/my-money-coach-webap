import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-row-number-cell-renderer',
  templateUrl: './row-number-cell-renderer.component.html',
  styleUrls: ['./row-number-cell-renderer.component.scss']
})
export class RowNumberCellRendererComponent implements ICellRendererAngularComp {
  rowNumber!: number;

  refresh(params: any): boolean {
    return true;
  }
  agInit(params: import('ag-grid-community').ICellRendererParams): void {
    this.rowNumber = params.rowIndex + 1;
  }


}
