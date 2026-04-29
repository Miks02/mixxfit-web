import { TestBed } from '@angular/core/testing';

import { TemplateModalLayoutService } from './template-modal-layout-service';

describe('TemplateModalSession', () => {
  let service: TemplateModalLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateModalLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
