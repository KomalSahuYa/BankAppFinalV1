import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { AccountService } from '../../../../core/services/account.service';
import { AccountResponse } from '../../../../core/models/account.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html'
})
export class AccountListComponent implements OnInit {
  accounts: AccountResponse[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private readonly accountService: AccountService,
    private readonly apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
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
