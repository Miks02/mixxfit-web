import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetTargetForm } from './set-target-form';

describe('SetTargetForm', () => {
  let component: SetTargetForm;
  let fixture: ComponentFixture<SetTargetForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetTargetForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetTargetForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
