import { Component, TemplateRef } from '@angular/core';
import { IExpenses } from 'src/app/models/interfaces/IExpenses';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-grid-expense-btns-renderer',
  templateUrl: './grid-expense-btns-renderer.component.html',
  styleUrls: ['./grid-expense-btns-renderer.component.scss']
})
export class GridExpenseBtnsRendererComponent implements ICellRendererAngularComp {
  componentParent: any;
  
  rowId: string | undefined;
  rowNumber!: number;
  expense!: IExpenses;

  modalRef?: BsModalRef;
  message?: string;

  constructor(private modalService: BsModalService) { }

  agInit(params: ICellRendererParams): void {
    this.rowId = params.node.id;
    this.expense = params.data;
    this.rowNumber = params.rowIndex + 1;
    this.componentParent = params.context.componentParent;
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    console.log(params);
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
    this.componentParent.delete(this.rowId, item);
  }

}
