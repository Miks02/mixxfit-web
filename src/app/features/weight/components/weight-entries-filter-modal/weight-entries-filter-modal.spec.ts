import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightEntriesFilterModal } from './weight-entries-filter-modal';

describe('WeightEntriesFilterModal', () => {
  let component: WeightEntriesFilterModal;
  let fixture: ComponentFixture<WeightEntriesFilterModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeightEntriesFilterModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeightEntriesFilterModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
