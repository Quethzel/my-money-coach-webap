import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartExpensesComponent } from './pie-chart-expenses.component';

describe('PieChartExpensesComponent', () => {
  let component: PieChartExpensesComponent;
  let fixture: ComponentFixture<PieChartExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieChartExpensesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieChartExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
