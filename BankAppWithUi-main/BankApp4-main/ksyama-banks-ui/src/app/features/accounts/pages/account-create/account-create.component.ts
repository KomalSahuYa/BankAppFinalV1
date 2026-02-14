import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AccountService } from '../../../../core/services/account.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { positiveAmountValidator, trimmedRequiredValidator } from '../../../../core/validators/form-validators';
import { AccountResponse } from '../../../../core/models/account.model';

@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html'
})
export class AccountCreateComponent implements OnInit {
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  confirmDialogOpen = false;

  private existingAccounts: AccountResponse[] = [];
  mobileExists = false;

  readonly form = this.fb.nonNullable.group({
    holderName: ['', [Validators.required, trimmedRequiredValidator]],
    panNumber: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)]],
    email: ['', [Validators.required, Validators.email]],
    mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    initialBalance: [0, [Validators.required, Validators.min(0.01), positiveAmountValidator(0.01)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly accountService: AccountService,
    private readonly apiErrorService: ApiErrorService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadExistingAccounts();

    this.form.controls.panNumber.valueChanges.subscribe((value) => {
      this.form.controls.panNumber.setValue(value.toUpperCase(), { emitEvent: false });
      this.applyDuplicateValidation();
    });

    this.form.controls.email.valueChanges.subscribe((value) => {
      this.form.controls.email.setValue(value.toLowerCase(), { emitEvent: false });
      this.applyDuplicateValidation();
    });

    this.form.controls.mobileNumber.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      const mobile = value.trim();
      if (!/^[0-9]{10}$/.test(mobile)) {
        this.mobileExists = false;
        return;
      }

      this.accountService.checkAccountMobileExists(mobile).subscribe((exists) => {
        this.mobileExists = exists;
        this.setDuplicateError(this.form.controls.mobileNumber, exists);
      });
    });
  }

  openConfirmDialog(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.applyDuplicateValidation();
    if (this.form.controls.panNumber.hasError('duplicate') || this.form.controls.email.hasError('duplicate') || this.form.controls.mobileNumber.hasError('duplicate')) {
      this.errorMessage = 'PAN number, email, or mobile number already exists. Please provide unique details.';
      return;
    }

    this.confirmDialogOpen = true;
  }

  closeConfirmDialog(): void {
    this.confirmDialogOpen = false;
  }

  submit(): void {
    this.confirmDialogOpen = false;

    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.accountService
      .createAccount({
        holderName: this.form.controls.holderName.value.trim(),
        panNumber: this.form.controls.panNumber.value.trim().toUpperCase(),
        email: this.form.controls.email.value.trim().toLowerCase(),
        mobileNumber: this.form.controls.mobileNumber.value.trim(),
        initialBalance: this.form.controls.initialBalance.value
      })
      .pipe(finalize(() => {
        this.isSubmitting = false;
      }))
      .subscribe({
        next: (response) => {
          this.successMessage = `Account ${response.accountNumber} created successfully.`;
          this.notificationService.show(this.successMessage, 'success');
          this.resetForm();
          this.loadExistingAccounts();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = this.apiErrorService.getMessage(error);
        }
      });
  }

  resetForm(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.form.reset({ holderName: '', panNumber: '', email: '', mobileNumber: '', initialBalance: 0 });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private loadExistingAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.existingAccounts = accounts;
        this.applyDuplicateValidation();
      }
    });
  }

  private applyDuplicateValidation(): void {
    const pan = this.form.controls.panNumber.value.trim().toUpperCase();
    const email = this.form.controls.email.value.trim().toLowerCase();

    const panExists = this.existingAccounts.some((account) => account.panNumber?.toUpperCase() === pan);
    const emailExists = this.existingAccounts.some((account) => account.email?.toLowerCase() === email);

    this.setDuplicateError(this.form.controls.panNumber, panExists);
    this.setDuplicateError(this.form.controls.email, emailExists);
  }

  private setDuplicateError(control: AbstractControl, hasDuplicate: boolean): void {
    const errors = control.errors ?? {};

    if (hasDuplicate) {
      control.setErrors({ ...errors, duplicate: true });
      return;
    }

    if (!errors['duplicate']) {
      return;
    }

    const { duplicate, ...remainingErrors } = errors;
    control.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
  }
}
