import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  AccountCreateRequest,
  AccountFullResponse,
  AccountResponse,
  AccountUpdateRequest,
  EmployeeCreateRequest,
  EmployeeUpdateRequest,
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

  getAllAccounts(): Observable<AccountResponse[]> {
    return this.getAccounts();
  }

  createAccount(request: AccountCreateRequest): Observable<AccountResponse> {
    return this.http.post<AccountResponse>(this.accountsUrl, request);
  }

  updateAccount(accountNumber: string, request: AccountUpdateRequest): Observable<AccountResponse> {
    return this.http.put<AccountResponse>(`${this.accountsUrl}/${accountNumber}`, request);
  }

  deleteAccount(accountNumber: string): Observable<void> {
    return this.http.delete<void>(`${this.accountsUrl}/${accountNumber}`);
  }

  deactivateAccount(id: number): Observable<void> {
    return this.http.put<void>(`${this.accountsUrl}/${id}/deactivate`, {});
  }

  getAccountById(id: number): Observable<AccountResponse> {
    return this.http.get<AccountResponse>(`${this.accountsUrl}/${id}`);
  }

  getAccountByNumber(accountNumber: string): Observable<AccountResponse> {
    return this.http.get<AccountResponse>(`${this.accountsUrl}/${accountNumber}`);
  }

  searchAccountsByName(name: string): Observable<AccountResponse[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<AccountResponse[]>(`${this.accountsUrl}/search`, { params });
  }

  getTopAccounts(limit = 5): Observable<AccountResponse[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<AccountResponse[]>(`${this.accountsUrl}/top`, { params });
  }

  validateAccountNumber(accountNumber: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.accountsUrl}/validate/${accountNumber}`);
  }

  getAccountFull(accountNumber: string): Observable<AccountFullResponse> {
    return this.http.get<AccountFullResponse>(`${this.accountsUrl}/${accountNumber}/full`);
  }

  checkAccountMobileExists(mobileNumber: string): Observable<boolean> {
    const params = new HttpParams().set('mobileNumber', mobileNumber);
    return this.http.get<boolean>(`${this.accountsUrl}/check-mobile`, { params });
  }

  getEmployees(): Observable<EmployeeResponse[]> {
    return this.http.get<EmployeeResponse[]>(this.employeesUrl);
  }

  createEmployee(request: EmployeeCreateRequest): Observable<EmployeeResponse> {
    return this.http.post<EmployeeResponse>(this.employeesUrl, request);
  }

  updateEmployee(id: number, request: EmployeeUpdateRequest): Observable<EmployeeResponse> {
    return this.http.put<EmployeeResponse>(`${this.employeesUrl}/${id}`, request);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.employeesUrl}/${id}`);
  }

  getAuditLogs(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiBaseUrl}/audit/logs`);
  }
}
