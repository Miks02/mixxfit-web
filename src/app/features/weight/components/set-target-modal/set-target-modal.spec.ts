import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetTargetModal } from './set-target-modal';

describe('SetTargetModal', () => {
  let component: SetTargetModal;
  let fixture: ComponentFixture<SetTargetModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetTargetModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetTargetModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
