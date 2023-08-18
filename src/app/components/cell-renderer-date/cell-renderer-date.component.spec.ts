import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellRendererDateComponent } from './cell-renderer-date.component';

describe('CellRendererDateComponent', () => {
  let component: CellRendererDateComponent;
  let fixture: ComponentFixture<CellRendererDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CellRendererDateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CellRendererDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
