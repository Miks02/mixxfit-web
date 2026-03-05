import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaloriesSummary } from './calories-summary';

describe('CaloriesSummary', () => {
  let component: CaloriesSummary;
  let fixture: ComponentFixture<CaloriesSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaloriesSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaloriesSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
