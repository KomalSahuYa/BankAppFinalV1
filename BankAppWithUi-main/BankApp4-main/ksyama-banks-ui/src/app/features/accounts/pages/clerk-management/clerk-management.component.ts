import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

import { AccountService } from '../../../../core/services/account.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { EmployeeResponse } from '../../../../core/models/account.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { trimmedRequiredValidator } from '../../../../core/validators/form-validators';
import { PermissionService } from '../../../../core/services/permission.service';

@Component({
  selector: 'app-clerk-management',
  templateUrl: './clerk-management.component.html',
  styleUrls: ['./clerk-management.component.scss']
})
export class ClerkManagementComponent implements OnInit {
  employees: EmployeeResponse[] = [];
  loading = false;
  isSubmitting = false;
  actionInProgress = false;
  errorMessage = '';
  editingEmployeeId: number | null = null;
  employeeToDelete: EmployeeResponse | null = null;

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, trimmedRequiredValidator]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fullName: ['', [Validators.required, trimmedRequiredValidator]]
  });

  readonly editForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, trimmedRequiredValidator]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly accountService: AccountService,
    private readonly apiErrorService: ApiErrorService,
    private readonly notificationService: NotificationService,
    public readonly permissionService: PermissionService
  ) {}

  get clerks(): EmployeeResponse[] {
    return this.employees.filter((employee) => employee.role === 'CLERK');
  }

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
      .pipe(finalize(() => {
        this.isSubmitting = false;
      }))
      .subscribe({
        next: () => {
          this.form.reset({ username: '', password: '', fullName: '' });
          this.notificationService.show('Clerk user created successfully.', 'success');
          this.loadEmployees();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = this.apiErrorService.getMessage(error);
        }
      });
  }

  loadEmployees(): void {
    this.loading = true;
    this.accountService.getEmployees().pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      }
    });
  }

  startEdit(employee: EmployeeResponse): void {
    this.editingEmployeeId = employee.id;
    this.editForm.reset({ fullName: employee.fullName });
  }

  cancelEdit(): void {
    this.editingEmployeeId = null;
    this.editForm.reset({ fullName: '' });
  }

  updateEmployee(employee: EmployeeResponse): void {
    if (this.editForm.invalid || this.actionInProgress) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.actionInProgress = true;
    this.errorMessage = '';
    this.accountService
      .updateEmployee(employee.id, {
        fullName: this.editForm.controls.fullName.value.trim(),
        role: employee.role
      })
      .pipe(finalize(() => {
        this.actionInProgress = false;
      }))
      .subscribe({
        next: () => {
          this.notificationService.show('Employee updated successfully.', 'success');
          this.cancelEdit();
          this.loadEmployees();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = this.apiErrorService.getMessage(error);
        }
      });
  }

  askDeleteEmployee(employee: EmployeeResponse): void {
    if (!this.actionInProgress) {
      this.employeeToDelete = employee;
    }
  }

  cancelDelete(): void {
    this.employeeToDelete = null;
  }

  confirmDeleteEmployee(): void {
    if (!this.employeeToDelete || this.actionInProgress) {
      return;
    }

    const employee = this.employeeToDelete;
    this.employeeToDelete = null;
    this.actionInProgress = true;
    this.errorMessage = '';

    this.accountService.deleteEmployee(employee.id).pipe(finalize(() => {
      this.actionInProgress = false;
    })).subscribe({
      next: () => {
        this.notificationService.show('Employee deleted successfully.', 'success');
        this.cancelEdit();
        this.loadEmployees();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.apiErrorService.getMessage(error);
      }
    });
  }
}
