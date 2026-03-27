import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseSession } from './exercise-session';

describe('ExerciseSession', () => {
  let component: ExerciseSession;
  let fixture: ComponentFixture<ExerciseSession>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseSession]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseSession);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
