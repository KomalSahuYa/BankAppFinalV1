import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AccountService } from '../../../../core/services/account.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-account-update',
  templateUrl: './account-update.component.html'
})
export class AccountUpdateComponent implements OnInit {
  accountNumber = '';
  holderName = '';
  panNumber = '';
  loading = false;
  isSubmitting = false;
  errorMessage = '';

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly accountService: AccountService,
    private readonly apiErrorService: ApiErrorService,
    private readonly notificationService: NotificationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.accountNumber = this.route.snapshot.paramMap.get('accountNumber') ?? '';
    if (!this.accountNumber) {
      this.errorMessage = 'Account number is missing.';
      return;
    }

    this.loadAccount();
  }

  loadAccount(): void {
    this.loading = true;
    this.errorMessage = '';

    this.accountService.getAccountByNumber(this.accountNumber).subscribe({
      next: (account) => {
        this.holderName = account.holderName;
        this.panNumber = account.panNumber;
        this.form.reset({ email: account.email, mobileNumber: account.mobileNumber });
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  update(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.accountService
      .updateAccount(this.accountNumber, {
        email: this.form.controls.email.value.trim().toLowerCase(),
        mobileNumber: this.form.controls.mobileNumber.value.trim()
      })
      .subscribe({
        next: () => {
          this.notificationService.show(`Account ${this.accountNumber} updated successfully.`, 'success');
          void this.router.navigate(['/accounts/list']);
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
