import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  DepositRequest,
  TransactionResponse,
  TransferRequest,
  WithdrawRequest
} from '../models/transaction.model';

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
}
