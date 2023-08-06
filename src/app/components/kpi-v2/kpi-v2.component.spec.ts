import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiV2Component } from './kpi-v2.component';

describe('KpiV2Component', () => {
  let component: KpiV2Component;
  let fixture: ComponentFixture<KpiV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
