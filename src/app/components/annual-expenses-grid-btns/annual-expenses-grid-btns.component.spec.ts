import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualExpensesGridBtnsComponent } from './annual-expenses-grid-btns.component';

describe('AnnualExpensesGridBtnsComponent', () => {
  let component: AnnualExpensesGridBtnsComponent;
  let fixture: ComponentFixture<AnnualExpensesGridBtnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualExpensesGridBtnsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnualExpensesGridBtnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
