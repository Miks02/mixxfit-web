import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseModalLayout } from './exercise-modal-layout';

describe('ExerciseModalLayout', () => {
  let component: ExerciseModalLayout;
  let fixture: ComponentFixture<ExerciseModalLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseModalLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseModalLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
