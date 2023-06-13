import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IExpenses } from 'src/app/models/interfaces/IExpenses';
import { ExpensesService } from 'src/app/services/expenses.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  bsModalRef?: BsModalRef;
  expenses!: Observable<IExpenses[]>;

  constructor(
    private modalService: BsModalService,
    private expeneService: ExpensesService,
    ) { }

  ngOnInit() {
    this.getExpenses();
  }

  getExpenses() {
    this.expenses = this.expeneService.getExpenses();
  }

  openExpenseModal() {
    const modalParas: ModalOptions = {
      class: 'modal-lg'
    };

    this.bsModalRef = this.modalService.show(ExpenseFormComponent, modalParas);
    if (this.bsModalRef.onHidden) {
      this.bsModalRef.onHidden.subscribe((res) => {
        console.log(res);
        this.getExpenses();
      });
    }
  }

}
