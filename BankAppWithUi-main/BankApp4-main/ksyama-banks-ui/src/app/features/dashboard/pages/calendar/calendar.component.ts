import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { TransactionService } from '../../../../core/services/transaction.service';
import { DailyTransactionCount, TransactionResponse } from '../../../../core/models/transaction.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit {
  loading = false;
  errorMessage = '';
  dailyCounts: DailyTransactionCount[] = [];
  selectedDate = '';
  selectedTransactions: TransactionResponse[] = [];

  constructor(
    private readonly transactionService: TransactionService,
    private readonly apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    this.loadCalendar();
  }

  loadCalendar(): void {
    this.loading = true;
    this.transactionService.getDailySummary().subscribe({
      next: (rows) => {
        this.dailyCounts = rows;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  selectDate(date: string): void {
    this.selectedDate = date;
    this.transactionService.getTransactionsByDate(date).subscribe({
      next: (rows) => {
        this.selectedTransactions = rows;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      }
    });
  }
}
