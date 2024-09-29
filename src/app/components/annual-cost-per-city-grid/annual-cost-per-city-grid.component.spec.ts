import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualCostPerCityGridComponent } from './annual-cost-per-city-grid.component';

describe('AnnualCostPerCityGridComponent', () => {
  let component: AnnualCostPerCityGridComponent;
  let fixture: ComponentFixture<AnnualCostPerCityGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualCostPerCityGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnualCostPerCityGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
