import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, merge, Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';

import { PermissionService } from '../../../core/services/permission.service';
import { TransactionService } from '../../../core/services/transaction.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {
  pendingCount = 0;
  private readonly destroy$ = new Subject<void>();

  constructor(
    public readonly permissionService: PermissionService,
    private readonly transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    if (!this.permissionService.canViewApprovalWorkflow()) {
      return;
    }

    merge(interval(30000), this.transactionService.approvalsUpdated$).pipe(
      startWith(0),
      switchMap(() => this.transactionService.getPendingApprovals()),
      takeUntil(this.destroy$)
    ).subscribe((rows) => {
      this.pendingCount = rows.length;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
