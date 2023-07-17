import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableExpenseGridComponent } from './editable-expense-grid.component';

describe('EditableExpenseGridComponent', () => {
  let component: EditableExpenseGridComponent;
  let fixture: ComponentFixture<EditableExpenseGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditableExpenseGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditableExpenseGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
