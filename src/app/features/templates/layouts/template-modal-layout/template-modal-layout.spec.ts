import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateModalLayout } from './template-modal-layout';

describe('TemplateModalLayout', () => {
  let component: TemplateModalLayout;
  let fixture: ComponentFixture<TemplateModalLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateModalLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateModalLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
