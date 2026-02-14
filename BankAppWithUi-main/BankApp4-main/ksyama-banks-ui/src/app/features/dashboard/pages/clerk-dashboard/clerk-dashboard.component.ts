import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AccountService } from '../../../../core/services/account.service';
import { TransactionService } from '../../../../core/services/transaction.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { TransactionResponse } from '../../../../core/models/transaction.model';

@Component({
  selector: 'app-clerk-dashboard',
  templateUrl: './clerk-dashboard.component.html'
})
export class ClerkDashboardComponent implements OnInit {
  loading = false;
  errorMessage = '';
  totalAccounts = 0;
  todayTransactionCount = 0;
  dayCount = 0;
  monthCount = 0;
  yearCount = 0;

  constructor(
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService,
    private readonly apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    this.loadOverview();
  }

  get maxGraphCount(): number {
    return Math.max(this.dayCount, this.monthCount, this.yearCount, 1);
  }

  loadOverview(): void {
    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      accounts: this.accountService.getAccounts(),
      transactions: this.transactionService.getRecentTransactions(500)
    }).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: ({ accounts, transactions }) => {
        this.totalAccounts = accounts.length;
        const metrics = this.calculateTimeMetrics(transactions);
        this.dayCount = metrics.day;
        this.monthCount = metrics.month;
        this.yearCount = metrics.year;
        this.todayTransactionCount = metrics.day;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      }
    });
  }

  private calculateTimeMetrics(transactions: TransactionResponse[]): { day: number; month: number; year: number } {
    const now = new Date();
    const todayDate = now.toDateString();
    const month = now.getMonth();
    const year = now.getFullYear();

    let day = 0;
    let monthCount = 0;
    let yearCount = 0;

    transactions.forEach((transaction) => {
      const date = new Date(transaction.timestamp);
      if (Number.isNaN(date.getTime())) {
        return;
      }

      if (date.getFullYear() === year) {
        yearCount += 1;

        if (date.getMonth() === month) {
          monthCount += 1;
        }
      }

      if (date.toDateString() === todayDate) {
        day += 1;
      }
    });

    return { day, month: monthCount, year: yearCount };
  }
}
