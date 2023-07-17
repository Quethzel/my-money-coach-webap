import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowNumberCellRendererComponent } from './row-number-cell-renderer.component';

describe('RowNumberCellRendererComponent', () => {
  let component: RowNumberCellRendererComponent;
  let fixture: ComponentFixture<RowNumberCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RowNumberCellRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RowNumberCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
