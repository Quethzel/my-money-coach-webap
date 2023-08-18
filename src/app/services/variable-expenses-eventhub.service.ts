import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VariableExpensesEventhubService {
  private gridHasUIFilters = new BehaviorSubject<boolean>(false);
  $gridHasUIFilters = this.gridHasUIFilters.asObservable();

  constructor() { }

  setGridHasUIFilters(value: boolean) {
    this.gridHasUIFilters.next(value);
  }

}
