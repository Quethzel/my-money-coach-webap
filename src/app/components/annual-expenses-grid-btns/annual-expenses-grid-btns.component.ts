import { Component, TemplateRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { IExpenses } from 'src/app/models/interfaces/IExpenses';

@Component({
  selector: 'app-annual-expenses-grid-btns',
  templateUrl: './annual-expenses-grid-btns.component.html',
  styleUrls: ['./annual-expenses-grid-btns.component.scss']
})
export class AnnualExpensesGridBtnsComponent implements ICellRendererAngularComp {
  componentParent: any;
  isPinnedRowOnTop!: boolean;
  
  rowId: string | undefined;
  rowNumber!: number;
  expense!: IExpenses;

  modalRef?: BsModalRef;
  message?: string;
  
  constructor(private modalService: BsModalService) { }

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.rowId = params.node.id;
    this.expense = params.data;
    this.rowNumber = params.rowIndex + 1;
    this.componentParent = params.context.componentParent;
    this.isPinnedRowOnTop = params.node.isRowPinned();
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }

  onDelete(template: TemplateRef<any>) {
    const params: ModalOptions = { class: 'modal-sm' };
    this.modalRef = this.modalService.show(template, params);
  }

  confirmDelete(val: boolean) {
    this.modalRef?.hide();
    if (val) {
      this.delete(this.expense);
    }
  }

  private delete(item: IExpenses) {
    this.componentParent.delete(item);
  }

}
