import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExerciseForm } from './create-exercise-form';

describe('CreateExerciseForm', () => {
  let component: CreateExerciseForm;
  let fixture: ComponentFixture<CreateExerciseForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateExerciseForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateExerciseForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
