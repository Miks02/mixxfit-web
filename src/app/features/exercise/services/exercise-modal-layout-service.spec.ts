import { TestBed } from '@angular/core/testing';

import { ExerciseModalLayoutService } from './exercise-modal-layout-service';

describe('ExerciseModalLayoutService', () => {
  let service: ExerciseModalLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseModalLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
