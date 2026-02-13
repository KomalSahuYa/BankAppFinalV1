import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { TransactionService } from '../../../../core/services/transaction.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { positiveAmountValidator, trimmedRequiredValidator } from '../../../../core/validators/form-validators';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html'
})
export class DepositComponent {
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  readonly form = this.fb.nonNullable.group({
    accountNumber: ['', [Validators.required, trimmedRequiredValidator]],
    amount: [0, [Validators.required, Validators.min(0.01), positiveAmountValidator(0.01)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly transactionService: TransactionService,
    private readonly apiErrorService: ApiErrorService,
    private readonly notificationService: NotificationService
  ) {}



  refreshSection(): void {
    if (this.isSubmitting) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.form.reset({ accountNumber: '', amount: 0 });
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      accountNumber: this.form.controls.accountNumber.value.trim(),
      amount: this.form.controls.amount.value
    };

    const confirmed = window.confirm(`Confirm deposit of ₹${payload.amount.toLocaleString('en-IN')} to account ${payload.accountNumber}?`);
    if (!confirmed) {
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.transactionService.deposit(payload).subscribe({
      next: (res) => {
        this.successMessage = `Deposit transaction #${res.id} completed.`;
        this.notificationService.show(this.successMessage, 'success');
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
