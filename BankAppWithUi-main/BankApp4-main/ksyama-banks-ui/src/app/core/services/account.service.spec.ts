import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { AccountService } from './account.service';
import { environment } from '../../../environments/environment';

describe('AccountService', () => {
  let service: AccountService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(AccountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call delete endpoint using account number path', () => {
    service.deleteAccount('ACC-123').subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/accounts/ACC-123`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should call employee update endpoint with payload', () => {
    service.updateEmployee(7, { fullName: 'Test User', role: 'CLERK' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/employees/7`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ fullName: 'Test User', role: 'CLERK' });
    req.flush({ id: 7, fullName: 'Test User', role: 'CLERK', username: 't', isActive: true });
  });
});
