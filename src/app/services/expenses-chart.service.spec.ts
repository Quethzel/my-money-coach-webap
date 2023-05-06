import { TestBed } from '@angular/core/testing';

import { ExpensesChartService } from './expenses-chart.service';

describe('ExpensesChartService', () => {
  let service: ExpensesChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpensesChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
