import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { DepositComponent } from './pages/deposit/deposit.component';
import { WithdrawComponent } from './pages/withdraw/withdraw.component';
import { TransactionHistoryComponent } from './pages/transaction-history/transaction-history.component';
import { PendingApprovalsComponent } from './pages/pending-approvals/pending-approvals.component';

@NgModule({
  declarations: [DepositComponent, WithdrawComponent, TransactionHistoryComponent, PendingApprovalsComponent],
  imports: [CommonModule, ReactiveFormsModule, TransactionsRoutingModule, SharedModule]
})
export class TransactionsModule {}
