import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './shared/components/layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardHomeComponent } from './features/dashboard/pages/dashboard-home.component';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule) },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardHomeComponent },
      { path: 'transactions', loadChildren: () => import('./features/transactions/transactions.module').then((m) => m.TransactionsModule) },
      { path: 'accounts', loadChildren: () => import('./features/accounts/accounts.module').then((m) => m.AccountsModule) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
