import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IExpenses } from 'src/app/models/interfaces/IExpenses';
import { ExpensesService } from 'src/app/services/expenses.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  bsModalRef?: BsModalRef;
  expenses!: Observable<IExpenses[]>;
  
  activeFilter: string;
  currentDate: Date;
  currentMonth: string;

  constructor(
    private modalService: BsModalService,
    private expeneService: ExpensesService,
    private commonService: CommonService
    ) {
      this.currentDate = new Date();
      this.currentMonth = this.commonService.getMonthName(this.currentDate.getMonth());
      this.activeFilter = 'month';
    }

  ngOnInit() {
    this.filterBy(this.activeFilter);
  }

  getExpenses(year: number, month?: number) {
    this.expenses = this.expeneService.getExpenses(year, month);
  }

  filterBy(filterBy: string) {
    this.activeFilter = filterBy;
    const year = new Date().getFullYear();

    if(filterBy == 'month') {
      const month = new Date().getMonth();
      this.getExpenses(year, month);
    } else {
      this.getExpenses(year);
    }
  }

  openExpenseModal() {
    const modalParas: ModalOptions = {
      class: 'modal-lg'
    };

    this.bsModalRef = this.modalService.show(ExpenseFormComponent, modalParas);
    if (this.bsModalRef.onHidden) {
      this.bsModalRef.onHidden.subscribe((res) => {
        this.filterBy(this.activeFilter);
      });
    }
  }

}
