import { TestBed } from '@angular/core/testing';

import { LayoutState } from './layout-state';

describe('LayoutState', () => {
  let service: LayoutState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
