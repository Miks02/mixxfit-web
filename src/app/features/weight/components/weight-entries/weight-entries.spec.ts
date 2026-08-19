import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightEntries } from './weight-entries';

describe('WeightEntries', () => {
  let component: WeightEntries;
  let fixture: ComponentFixture<WeightEntries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeightEntries]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeightEntries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
