import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../../../core/services/transaction.service';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html'
})
export class ManagerDashboardComponent implements OnInit {
  pendingCount = 0;

  constructor(private readonly transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionService.getPendingApprovals().subscribe({
      next: (pending) => {
        this.pendingCount = pending.length;
      }
    });
  }
}
