import { TestBed } from '@angular/core/testing';

import { TemplateState } from './template-state';

describe('TemplateState', () => {
  let service: TemplateState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
