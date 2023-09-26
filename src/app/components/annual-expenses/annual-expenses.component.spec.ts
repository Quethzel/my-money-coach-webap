import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualExpensesComponent } from './annual-expenses.component';

describe('AnnualExpensesComponent', () => {
  let component: AnnualExpensesComponent;
  let fixture: ComponentFixture<AnnualExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualExpensesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnualExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
