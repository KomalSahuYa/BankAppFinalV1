import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { AccountService } from '../../../../core/services/account.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { EmployeeResponse } from '../../../../core/models/account.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { trimmedRequiredValidator } from '../../../../core/validators/form-validators';
import { PermissionService } from '../../../../core/services/permission.service';

@Component({
  selector: 'app-clerk-management',
  templateUrl: './clerk-management.component.html'
})
export class ClerkManagementComponent implements OnInit {
  employees: EmployeeResponse[] = [];
  loading = false;
  isSubmitting = false;
  errorMessage = '';

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, trimmedRequiredValidator]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fullName: ['', [Validators.required, trimmedRequiredValidator]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly accountService: AccountService,
    private readonly apiErrorService: ApiErrorService,
    private readonly notificationService: NotificationService,
    public readonly permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    if (this.permissionService.canViewAllUsers()) {
      this.loadEmployees();
    }
  }

  createClerk(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.accountService
      .createEmployee({
        ...this.form.getRawValue(),
        username: this.form.controls.username.value.trim(),
        fullName: this.form.controls.fullName.value.trim(),
        role: 'CLERK'
      })
      .subscribe({
        next: () => {
          this.form.reset({ username: '', password: '', fullName: '' });
          this.notificationService.show('Clerk user created successfully.', 'success');
          this.loadEmployees();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = this.apiErrorService.getMessage(error);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
  }

  loadEmployees(): void {
    this.loading = true;
    this.accountService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
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
