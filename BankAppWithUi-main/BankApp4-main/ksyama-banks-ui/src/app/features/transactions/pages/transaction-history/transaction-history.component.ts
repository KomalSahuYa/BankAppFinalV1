import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { TransactionService } from '../../../../core/services/transaction.service';
import { TransactionResponse } from '../../../../core/models/transaction.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html'
})
export class TransactionHistoryComponent {
  loading = false;
  errorMessage = '';
  transactions: TransactionResponse[] = [];

  readonly form = this.fb.nonNullable.group({
    accountNumber: ['', Validators.required]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly transactionService: TransactionService,
    private readonly apiErrorService: ApiErrorService
  ) {}

  search(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.transactionService.getHistory(this.form.controls.accountNumber.value).subscribe({
      next: (rows) => {
        this.transactions = rows;
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
