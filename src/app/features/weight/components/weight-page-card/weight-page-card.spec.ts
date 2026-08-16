import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightPageCard } from './weight-page-card';

describe('WeightPageCard', () => {
  let component: WeightPageCard;
  let fixture: ComponentFixture<WeightPageCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeightPageCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeightPageCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
