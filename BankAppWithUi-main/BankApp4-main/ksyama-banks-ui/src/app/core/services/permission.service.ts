import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  constructor(private readonly authService: AuthService) {}

  // Both operational roles can manage customer accounts.
  canCreateAccount(): boolean { return this.authService.isClerk() || this.authService.isManager(); }
  canViewAllAccounts(): boolean { return this.authService.isClerk() || this.authService.isManager(); }
  canDeleteAccount(): boolean { return this.authService.isClerk() || this.authService.isManager(); }
  canUpdateAccount(): boolean { return this.authService.isClerk() || this.authService.isManager(); }

  // Employee (clerk) management remains manager-only.
  canCreateUser(): boolean { return this.authService.isManager(); }
  canViewAllUsers(): boolean { return this.authService.isManager(); }
  canUpdateUser(): boolean { return this.authService.isManager(); }
  canDeleteUser(): boolean { return this.authService.isManager(); }

  canProcessDeposit(): boolean { return this.authService.isClerk() || this.authService.isManager(); }
  canProcessWithdrawal(): boolean { return this.authService.isClerk() || this.authService.isManager(); }

  canApproveWithdrawal(): boolean { return this.authService.isManager(); }
  canRejectWithdrawal(): boolean { return this.authService.isManager(); }

  canViewTransactionHistory(accountId?: string): boolean {
    return this.authService.isClerk() || this.authService.isManager();
  }

  canViewApprovalWorkflow(): boolean { return this.authService.isManager(); }
  canViewPendingApprovals(): boolean { return this.authService.isManager(); }

  canViewManagerDashboard(): boolean { return this.authService.isManager(); }
  canViewClerkDashboard(): boolean { return this.authService.isClerk(); }

  getUserRoleDisplay(): string {
    if (this.authService.isManager()) return 'Manager';
    if (this.authService.isClerk()) return 'Clerk';
    return 'Unknown';
  }
}
