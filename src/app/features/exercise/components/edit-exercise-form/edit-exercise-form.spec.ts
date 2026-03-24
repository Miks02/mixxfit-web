import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExerciseForm } from './edit-exercise-form';

describe('EditExerciseForm', () => {
  let component: EditExerciseForm;
  let fixture: ComponentFixture<EditExerciseForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExerciseForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditExerciseForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
