import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickTipsCard } from './quick-tips-card';

describe('QuickTipsCard', () => {
  let component: QuickTipsCard;
  let fixture: ComponentFixture<QuickTipsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickTipsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickTipsCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
