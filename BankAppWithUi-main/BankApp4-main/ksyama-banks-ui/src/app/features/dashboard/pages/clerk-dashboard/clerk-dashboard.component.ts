import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { AccountService } from '../../../../core/services/account.service';
import { TransactionService } from '../../../../core/services/transaction.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { AccountResponse } from '../../../../core/models/account.model';

@Component({
  selector: 'app-clerk-dashboard',
  templateUrl: './clerk-dashboard.component.html'
})
export class ClerkDashboardComponent implements OnInit {
  loading = false;
  errorMessage = '';
  accounts: AccountResponse[] = [];
  todayTransactionCount = 0;

  constructor(
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService,
    private readonly apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    this.loadOverview();
  }

  get accountNumbersDisplay(): string {
    return this.accounts.map((account) => account.accountNumber).join(', ');
  }

  loadOverview(): void {
    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      accounts: this.accountService.getAccounts(),
      transactions: this.transactionService.getTodayTransactions()
    }).subscribe({
      next: ({ accounts, transactions }) => {
        this.accounts = accounts;
        this.todayTransactionCount = transactions.length;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
