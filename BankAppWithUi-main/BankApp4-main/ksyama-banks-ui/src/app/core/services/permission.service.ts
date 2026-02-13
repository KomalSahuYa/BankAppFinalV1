import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  constructor(private readonly authService: AuthService) {}

  canCreateAccount(): boolean { return this.authService.isManager() || this.authService.isClerk(); }
  canViewAllAccounts(): boolean { return this.authService.isManager() || this.authService.isClerk(); }
  canDeleteAccount(): boolean { return this.authService.isManager() || this.authService.isClerk(); }
  canUpdateAccount(): boolean { return this.authService.isManager() || this.authService.isClerk(); }

  canCreateUser(): boolean { return this.authService.isManager(); }
  canViewAllUsers(): boolean { return this.authService.isManager(); }
  canUpdateUser(): boolean { return this.authService.isManager(); }
  canDeleteUser(): boolean { return this.authService.isManager(); }

  canProcessDeposit(): boolean { return this.authService.isClerk() || this.authService.isManager(); }
  canProcessWithdrawal(): boolean { return this.authService.isClerk() || this.authService.isManager(); }

  canApproveWithdrawal(): boolean { return this.authService.isManager(); }
  canRejectWithdrawal(): boolean { return this.authService.isManager(); }

  canViewTransactionHistory(accountId?: string): boolean {
    if (this.authService.isManager()) {
      return true;
    }
    return this.authService.isClerk();
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
