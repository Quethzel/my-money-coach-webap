import { TestBed } from '@angular/core/testing';

import { AnnualExpensesService } from './annual-expenses.service';

describe('AnnualExpensesService', () => {
  let service: AnnualExpensesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnualExpensesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
