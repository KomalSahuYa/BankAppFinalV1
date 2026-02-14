import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { DailyTransactionCount, DepositRequest, TransactionResponse, TransferRequest, WithdrawRequest } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly url = `${environment.apiBaseUrl}/transactions`;

  constructor(private readonly http: HttpClient) {}

  deposit(request: DepositRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.url}/deposit`, request);
  }

  withdraw(request: WithdrawRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.url}/withdraw`, request);
  }

  transfer(request: TransferRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.url}/transfer`, request);
  }

  createDeposit(accountNumber: string, amount: number, description?: string): Observable<TransactionResponse> {
    return this.deposit({ accountNumber, amount });
  }

  createWithdrawal(accountNumber: string, amount: number, description?: string): Observable<TransactionResponse> {
    return this.withdraw({ accountNumber, amount });
  }

  getHistory(accountNumber: string): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.url}/${accountNumber}`);
  }

  getPendingApprovals(): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.url}/pending`);
  }

  approve(id: number): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.url}/approve/${id}`, {});
  }

  reject(id: number): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.url}/reject/${id}`, {});
  }

  approveTransaction(transactionId: number): Observable<TransactionResponse> { return this.approve(transactionId); }
  rejectTransaction(transactionId: number, reason: string): Observable<TransactionResponse> { return this.reject(transactionId); }

  getTodayTransactions(): Observable<TransactionResponse[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.http.get<TransactionResponse[]>(`${this.url}/by-date`, { params: new HttpParams().set('date', today) });
  }

  getClerkTodayTransactions(clerkId: number): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.url}/clerk/${clerkId}/today`);
  }

  getClerkPendingApprovals(clerkId: number): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.url}/clerk/${clerkId}/pending`);
  }

  getRecentTransactions(limit = 10): Observable<TransactionResponse[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<TransactionResponse[]>(`${this.url}/recent`, { params });
  }

  getClerkRecentTransactions(clerkId: number, limit = 10): Observable<TransactionResponse[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<TransactionResponse[]>(`${this.url}/clerk/${clerkId}/recent`, { params });
  }

  getRecentApprovalRequests(limit = 5): Observable<TransactionResponse[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<TransactionResponse[]>(`${this.url}/approval-requests/recent`, { params });
  }

  getMonthlyTrend(months = 6): Observable<any[]> {
    const params = new HttpParams().set('months', months.toString());
    return this.http.get<any[]>(`${this.url}/trend/monthly`, { params });
  }

  getTransactionsByDate(date: string): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.url}/by-date`, { params: new HttpParams().set('date', date) });
  }

  getDailySummary(from?: string, to?: string): Observable<DailyTransactionCount[]> {
    let params = new HttpParams();
    if (from) {
      params = params.set('from', from);
    }
    if (to) {
      params = params.set('to', to);
    }

    return this.http.get<DailyTransactionCount[]>(`${this.url}/summary/daily`, { params });
  }

  needsApproval(amount: number): boolean {
    return amount > 200000;
  }
}
