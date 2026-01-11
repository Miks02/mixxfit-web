import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightChart } from './weight-chart';

describe('WeightChart', () => {
  let component: WeightChart;
  let fixture: ComponentFixture<WeightChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeightChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeightChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
