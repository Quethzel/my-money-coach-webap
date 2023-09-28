import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualExpensesGridComponent } from './annual-expenses-grid.component';

describe('AnnualExpensesGridComponent', () => {
  let component: AnnualExpensesGridComponent;
  let fixture: ComponentFixture<AnnualExpensesGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualExpensesGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnualExpensesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
