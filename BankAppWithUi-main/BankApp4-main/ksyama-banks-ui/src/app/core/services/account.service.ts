import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  AccountCreateRequest,
  AccountFullResponse,
  AccountResponse,
  AccountUpdateRequest,
  EmployeeCreateRequest,
  EmployeeResponse
} from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly accountsUrl = `${environment.apiBaseUrl}/accounts`;
  private readonly employeesUrl = `${environment.apiBaseUrl}/employees`;

  constructor(private readonly http: HttpClient) {}

  getAccounts(): Observable<AccountResponse[]> {
    return this.http.get<AccountResponse[]>(this.accountsUrl);
  }

  createAccount(request: AccountCreateRequest): Observable<AccountResponse> {
    return this.http.post<AccountResponse>(this.accountsUrl, request);
  }

  updateAccount(accountNumber: string, request: AccountUpdateRequest): Observable<AccountResponse> {
    return this.http.put<AccountResponse>(`${this.accountsUrl}/${accountNumber}`, request);
  }

  getAccountFull(accountNumber: string): Observable<AccountFullResponse> {
    return this.http.get<AccountFullResponse>(`${this.accountsUrl}/${accountNumber}/full`);
  }

  getEmployees(): Observable<EmployeeResponse[]> {
    return this.http.get<EmployeeResponse[]>(this.employeesUrl);
  }

  createEmployee(request: EmployeeCreateRequest): Observable<EmployeeResponse> {
    return this.http.post<EmployeeResponse>(this.employeesUrl, request);
  }
}
