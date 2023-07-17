import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridExpenseBtnsRendererComponent } from './grid-expense-btns-renderer.component';

describe('GridExpenseBtnsRendererComponent', () => {
  let component: GridExpenseBtnsRendererComponent;
  let fixture: ComponentFixture<GridExpenseBtnsRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridExpenseBtnsRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridExpenseBtnsRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
