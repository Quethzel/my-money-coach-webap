import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IExpenses } from 'src/app/models/interfaces/IExpenses';
import { ExpensesService } from 'src/app/services/expenses.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  expenses!: Observable<IExpenses[]>;

  constructor(private expeneService: ExpensesService) { }

  ngOnInit() {
    this.expenses = this.expeneService.getExpenses();
  }

}
