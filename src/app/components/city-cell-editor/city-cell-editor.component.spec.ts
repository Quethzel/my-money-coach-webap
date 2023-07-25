import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityCellEditorComponent } from './city-cell-editor.component';

describe('CityCellEditorComponent', () => {
  let component: CityCellEditorComponent;
  let fixture: ComponentFixture<CityCellEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityCellEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CityCellEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
