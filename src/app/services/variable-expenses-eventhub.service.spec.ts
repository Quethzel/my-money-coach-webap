import { TestBed } from '@angular/core/testing';

import { VariableExpensesEventhubService } from './variable-expenses-eventhub.service';

describe('VariableExpensesEventhubService', () => {
  let service: VariableExpensesEventhubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VariableExpensesEventhubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
