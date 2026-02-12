import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { TransactionService } from '../../../../core/services/transaction.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html'
})
export class DepositComponent {
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  readonly form = this.fb.nonNullable.group({
    accountNumber: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly transactionService: TransactionService,
    private readonly apiErrorService: ApiErrorService
  ) {}

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.transactionService.deposit(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.successMessage = `Deposit transaction #${res.id} completed.`;
        this.form.reset({ accountNumber: '', amount: 0 });
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
