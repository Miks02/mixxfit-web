import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickLog } from './quick-log';

describe('QuickLog', () => {
  let component: QuickLog;
  let fixture: ComponentFixture<QuickLog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickLog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickLog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
