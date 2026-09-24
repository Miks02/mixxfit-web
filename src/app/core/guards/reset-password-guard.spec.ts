import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap, provideRouter, Router, UrlTree } from '@angular/router';

import { resetPasswordGuard } from './reset-password-guard';

describe('resetPasswordGuard', () => {
  const executeGuard = (queryParams: Record<string, string>) => {
    const route = { queryParamMap: convertToParamMap(queryParams) } as ActivatedRouteSnapshot;
    return TestBed.runInInjectionContext(() => resetPasswordGuard(route, {} as any));
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('should allow navigation when token and userId are present', () => {
    expect(executeGuard({ token: 'abc', userId: '1' })).toBe(true);
  });

  it('should redirect to /forgot-password when token is missing', () => {
    const result = executeGuard({ userId: '1' }) as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/forgot-password');
  });

  it('should redirect to /forgot-password when userId is missing', () => {
    const result = executeGuard({ token: 'abc' }) as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/forgot-password');
  });
});
