import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightPage } from './weight-page';

describe('WeightPage', () => {
  let component: WeightPage;
  let fixture: ComponentFixture<WeightPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeightPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeightPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
