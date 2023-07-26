import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IExpenses } from 'src/app/models/interfaces/IExpenses';
import { ExpensesService } from 'src/app/services/expenses.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { CommonService } from 'src/app/services/common.service';
import { ExpenseFilters } from 'src/app/models/ExpenseFilters';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit, OnDestroy {
  bsModalRef?: BsModalRef;
  sbExpenses!: Subscription;
  expenses!: IExpenses[];
  activeFilter: string;
  currentDate: Date;
  currentMonth: string;
  totalExpenses: number = 0;

  filters: ExpenseFilters;

  constructor(
    private modalService: BsModalService,
    private expenseService: ExpensesService,
    private commonService: CommonService,
    ) {
      this.currentDate = new Date();
      this.currentMonth = this.commonService.getMonthName(this.currentDate.getMonth());
      this.activeFilter = 'month';
      this.expenses = [];

      this.filters = new ExpenseFilters();
    }

  ngOnInit() {
    this.filterBy(this.activeFilter);
  }

  ngOnDestroy(): void {
    if (this.sbExpenses) this.sbExpenses.unsubscribe();
  }

  getExpenses(filters: ExpenseFilters) {
    this.sbExpenses = this.expenseService.getExpenses(filters.year, filters.month).subscribe(data => {
      this.expenses = data;
      this.totalExpenses = this.getTotalExpenses();
    });
  }

  filterBy(filterBy: string) {
    this.activeFilter = filterBy;
    
    if(filterBy == 'month') {
      this.getExpenses(this.filters.byThisMonth());
    } else {
      this.getExpenses(this.filters.byThisYear());
    }
  }

  openExpenseModal(item?: IExpenses) {
    const data = item ? item : {};
    const modalParas: ModalOptions = {
      class: 'modal-lg',
      initialState: data
    };

    this.bsModalRef = this.modalService.show(ExpenseFormComponent, modalParas);
    if (this.bsModalRef.onHidden) {
      this.bsModalRef.onHidden.subscribe((res) => {
        this.filterBy(this.activeFilter);
      });
    }
  }

  editItem(item: IExpenses) {
    this.openExpenseModal(item);
  }

  deleteItem(item: IExpenses) {
    this.expenseService.delete(item.id).subscribe(item => {
      this.filterBy(this.activeFilter);  
    });
  }

  saveItem(item: IExpenses) {
    this.expenseService.saveExpense(item).subscribe(() => {
      this.filterBy(this.activeFilter);
    });
  }

  private getTotalExpenses() {
    let total = 0;
    this.expenses.forEach(e => total += e.cost);
    return total;
  }

}
