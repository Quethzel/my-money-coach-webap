import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableExpensesKpiBarComponent } from './variable-expenses-kpi-bar.component';

describe('VariableExpensesKpiBarComponent', () => {
  let component: VariableExpensesKpiBarComponent;
  let fixture: ComponentFixture<VariableExpensesKpiBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariableExpensesKpiBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariableExpensesKpiBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
