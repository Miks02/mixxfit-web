import { TestBed } from '@angular/core/testing';

import { ExerciseSessionState } from './exercise-session-state';

describe('ExerciseSessionState', () => {
  let service: ExerciseSessionState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseSessionState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
