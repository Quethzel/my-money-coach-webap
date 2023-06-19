import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  constructor() { }

  edit(item: IExpenses) {
    this.editItem.emit(item);
  }

  delete(item: IExpenses) {
    this.deleteItem.emit(item);
  }

}
