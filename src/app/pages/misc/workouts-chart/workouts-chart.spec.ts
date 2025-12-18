import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutsChart } from './workouts-chart';

describe('WorkoutsChart', () => {
  let component: WorkoutsChart;
  let fixture: ComponentFixture<WorkoutsChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutsChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutsChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
