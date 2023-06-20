import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { IExpenses } from 'src/app/models/interfaces/IExpenses';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss']
})
export class ExpensesListComponent {
  @Input() expenses!: Observable<IExpenses[]>;
  @Output() editItem = new EventEmitter<IExpenses>();
  @Output() deleteItem = new EventEmitter<IExpenses>();

  modalRef?: BsModalRef;
  message?: string;

  expense!: IExpenses;
  rowNumber!: number;

  constructor(private modalService: BsModalService) { }

  private delete(item: IExpenses) {
    this.deleteItem.emit(item);
  }

  edit(item: IExpenses) {
    this.editItem.emit(item);
  }

  openDeleteModal(rowNumber: number, item: IExpenses, template: TemplateRef<any>) {
    this.rowNumber = rowNumber;
    this.expense = item;
    const params: ModalOptions = {
      class: 'modal-sm'
    };

    this.modalRef = this.modalService.show(template, params);
  }

  confirmDelete(val: boolean) {
    this.modalRef?.hide();
    if (val) {
      this.delete(this.expense);
    }
  }

}
