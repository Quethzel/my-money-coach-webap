import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { IExpenses } from 'src/app/models/interfaces/IExpenses';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss']
})
export class ExpensesListComponent {
    @Input() expenses!: Observable<IExpenses[]>;
    
    constructor() { }

}
