import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { TransactionService } from '../../../../core/services/transaction.service';
import { TransactionResponse } from '../../../../core/models/transaction.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { trimmedRequiredValidator } from '../../../../core/validators/form-validators';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html'
})
export class TransactionHistoryComponent {
  loading = false;
  errorMessage = '';
  hasSearched = false;
  transactions: TransactionResponse[] = [];
  page = 1;
  readonly pageSize = 8;

  readonly form = this.fb.nonNullable.group({
    accountNumber: ['', [Validators.required, trimmedRequiredValidator]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly transactionService: TransactionService,
    private readonly apiErrorService: ApiErrorService
  ) {}

  search(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.hasSearched = true;
    this.transactions = [];

    this.transactionService.getHistory(this.form.controls.accountNumber.value.trim()).subscribe({
      next: (rows) => {
        this.transactions = rows;
        this.page = 1;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  get pagedTransactions(): TransactionResponse[] {
    const start = (this.page - 1) * this.pageSize;
    return this.transactions.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.transactions.length / this.pageSize));
  }

  nextPage(): void {
    this.page = Math.min(this.totalPages, this.page + 1);
  }

  prevPage(): void {
    this.page = Math.max(1, this.page - 1);
  }

  getStatusClass(status: string): string {
    if (status === 'APPROVED') return 'bg-success-subtle text-success-emphasis';
    if (status === 'PENDING_APPROVAL') return 'bg-warning-subtle text-warning-emphasis';
    if (status === 'REJECTED') return 'bg-danger-subtle text-danger-emphasis';
    return 'bg-secondary-subtle';
  }
}
