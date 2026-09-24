import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { QueryClient, provideTanStackQuery } from '@tanstack/angular-query-experimental';

import { ResetPassword } from './reset-password';

describe('ResetPassword', () => {
  let component: ResetPassword;
  let fixture: ComponentFixture<ResetPassword>;

  beforeEach(async () => {
    vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} });

    await TestBed.configureTestingModule({
      imports: [ResetPassword],
      providers: [provideRouter([]), provideHttpClient(), provideTanStackQuery(new QueryClient())],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should flag mismatching passwords', () => {
    component.form.setValue({ password: 'secret1', confirmedPassword: 'secret2' });

    expect(component.form.hasError('passwordMismatch')).toBe(true);
  });

  it('should accept matching passwords of at least 6 characters', () => {
    component.form.setValue({ password: 'secret1', confirmedPassword: 'secret1' });

    expect(component.form.valid).toBe(true);
  });
});
