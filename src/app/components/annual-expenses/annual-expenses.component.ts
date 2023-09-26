import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnnualExpense } from 'src/app/models/annual-expense';
import { IAnnualExpense } from 'src/app/models/interfaces/IAnnualExpense';
import { AnnualExpensesService } from 'src/app/services/annual-expenses.service';

@Component({
  selector: 'app-annual-expenses',
  templateUrl: './annual-expenses.component.html',
  styleUrls: ['./annual-expenses.component.scss']
})
export class AnnualExpensesComponent {
  sbExpenses: Subscription;
  annualExpenses: IAnnualExpense[];
  currentDate: Date;

  constructor(private aexService: AnnualExpensesService) {
    this.currentDate = new Date();
    this.annualExpenses = [];

    this.getExpenses(new Date().getFullYear());
  }

  getExpenses(year: number) {
    this.sbExpenses = this.aexService.getAllExpensesByYear(year).subscribe(data => {
      this.annualExpenses = data;
    });
  }

  saveItem(item: AnnualExpense) {
    console.log(item);
  }

  deleteItem(item: AnnualExpense) {
    console.log('delete: item: ', item);
  }

}
