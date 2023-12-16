import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnnualExpense } from 'src/app/models/annual-expense';
import { IAnnualExpense } from 'src/app/models/interfaces/IAnnualExpense';
import { AnnualExpensesService } from 'src/app/services/annual-expenses.service';

@Component({
  selector: 'app-annual-expenses',
  templateUrl: './annual-expenses.component.html',
  styleUrls: ['./annual-expenses.component.scss']
})
export class AnnualExpensesComponent implements OnInit, OnDestroy {
  sbExpenses: Subscription;
  annualExpenses: IAnnualExpense[];
  currentDate: Date;

  constructor(private aexService: AnnualExpensesService) {
    this.currentDate = new Date();
    this.annualExpenses = [];

  }

  ngOnInit(): void {
    this.getExpenses(this.currentDate.getFullYear());
  }

  ngOnDestroy(): void {
    if (this.sbExpenses) this.sbExpenses.unsubscribe();
  }

  getExpenses(year: number) {
    this.sbExpenses = this.aexService.getAllExpensesByYear(year).subscribe(data => {
      this.annualExpenses = data;
    });
  }

  saveItem(item: AnnualExpense) {
    this.aexService.saveExpense(item).subscribe(() => {
      this.getExpenses(this.currentDate.getFullYear());
    }, (error) => {
      console.log('error', error);
    });
  }

  deleteItem(item: AnnualExpense) {
    this.aexService.delete(item.id).subscribe(item => {
      this.getExpenses(this.currentDate.getFullYear());
    });
  }

}
