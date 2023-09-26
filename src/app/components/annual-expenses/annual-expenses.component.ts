import { Component } from '@angular/core';
import { AnnualExpense } from 'src/app/models/annual-expense';

@Component({
  selector: 'app-annual-expenses',
  templateUrl: './annual-expenses.component.html',
  styleUrls: ['./annual-expenses.component.scss']
})
export class AnnualExpensesComponent {
  annualExpenses: AnnualExpense[];
  currentDate: Date;

  constructor() {
    this.currentDate = new Date();
    this.annualExpenses = [];
  }

  saveItem(item: AnnualExpense) {
    console.log(item);
  }

  deleteItem(item: AnnualExpense) {
    console.log('delete: item: ', item);
  }

}
