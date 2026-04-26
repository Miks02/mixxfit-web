import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCard } from './dashboard-card';

describe('DashboardCard', () => {
  let component: DashboardCard;
  let fixture: ComponentFixture<DashboardCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Card');
    fixture.componentRef.setInput('icon', 'faSolidBolt');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
