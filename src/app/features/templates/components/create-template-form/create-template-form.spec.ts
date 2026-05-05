import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTemplateForm } from './create-template-form';

describe('CreateTemplateForm', () => {
  let component: CreateTemplateForm;
  let fixture: ComponentFixture<CreateTemplateForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTemplateForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTemplateForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
