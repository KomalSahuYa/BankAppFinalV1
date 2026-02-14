import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, switchMap } from 'rxjs/operators';

import { TransactionService } from '../../../../core/services/transaction.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { positiveAmountValidator, trimmedRequiredValidator } from '../../../../core/validators/form-validators';
import { AccountService } from '../../../../core/services/account.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html'
})
export class TransferComponent {
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  readonly form = this.fb.nonNullable.group({
    fromAccount: ['', [Validators.required, trimmedRequiredValidator]],
    toAccount: ['', [Validators.required, trimmedRequiredValidator]],
    amount: [0, [Validators.required, Validators.min(0.01), positiveAmountValidator(0.01)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly transactionService: TransactionService,
    private readonly accountService: AccountService,
    private readonly apiErrorService: ApiErrorService,
    private readonly notificationService: NotificationService
  ) {}

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      fromAccount: this.form.controls.fromAccount.value.trim(),
      toAccount: this.form.controls.toAccount.value.trim(),
      amount: this.form.controls.amount.value
    };

    if (payload.fromAccount === payload.toAccount) {
      this.errorMessage = 'Transfer failed: source and destination account numbers must be different.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.accountService.getAccountByNumber(payload.fromAccount).pipe(
      switchMap((fromAccount) => {
        if (fromAccount.balance < payload.amount) {
          throw new Error(`Insufficient balance in ${payload.fromAccount}. Available balance is ${fromAccount.balance}.`);
        }
        return this.transactionService.transfer(payload);
      }),
      finalize(() => {
        this.isSubmitting = false;
      })
    ).subscribe({
      next: (response) => {
        this.successMessage = `Transfer successful. Transaction #${response.id} created.`;
        this.notificationService.show(this.successMessage, 'success');
        this.form.reset({ fromAccount: '', toAccount: '', amount: 0 });
      },
      error: (error: HttpErrorResponse | Error) => {
        this.errorMessage = error instanceof HttpErrorResponse
          ? this.apiErrorService.getMessage(error)
          : error.message;
      }
    });
  }
}
