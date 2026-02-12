import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { TransactionService } from '../../../../core/services/transaction.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html'
})
export class WithdrawComponent {
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

    this.transactionService.withdraw(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.successMessage = `Withdrawal request #${res.id} submitted with status ${res.status}.`;
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
