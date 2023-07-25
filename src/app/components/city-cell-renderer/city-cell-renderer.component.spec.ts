import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityCellRendererComponent } from './city-cell-renderer.component';

describe('CityCellRendererComponent', () => {
  let component: CityCellRendererComponent;
  let fixture: ComponentFixture<CityCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityCellRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CityCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
