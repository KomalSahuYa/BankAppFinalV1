import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { ManagerGuard } from './core/guards/manager.guard';
import { RoleGuard } from './core/guards/role.guard';
import { DashboardHomeComponent } from './features/dashboard/pages/dashboard-home.component';
import { CalendarComponent } from './features/dashboard/pages/calendar/calendar.component';
import { ProfileComponent } from './features/dashboard/pages/profile/profile.component';
import { LayoutComponent } from './shared/components/layout/layout.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule) },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardHomeComponent },
      { path: 'dashboard/calendar', component: CalendarComponent },
      { path: 'dashboard/profile', component: ProfileComponent },
      { path: 'transactions', loadChildren: () => import('./features/transactions/transactions.module').then((m) => m.TransactionsModule) },
      {
        path: 'manager',
        canActivate: [ManagerGuard],
        children: [
          { path: 'dashboard', component: DashboardHomeComponent },
          { path: 'accounts', redirectTo: '/accounts/list', pathMatch: 'full' },
          { path: 'users', redirectTo: '/accounts/clerks', pathMatch: 'full' },
          { path: 'approvals', redirectTo: '/transactions/pending', pathMatch: 'full' }
        ]
      },
      {
        path: 'clerk',
        canActivate: [RoleGuard],
        data: { roles: ['CLERK'] },
        children: [
          { path: 'dashboard', component: DashboardHomeComponent },
          { path: 'deposit', redirectTo: '/transactions/deposit', pathMatch: 'full' },
          { path: 'withdrawal', redirectTo: '/transactions/withdraw', pathMatch: 'full' },
          { path: 'transactions', redirectTo: '/transactions/history', pathMatch: 'full' }
        ]
      },
      { path: 'accounts', loadChildren: () => import('./features/accounts/accounts.module').then((m) => m.AccountsModule) },
      { path: 'unauthorized', component: DashboardHomeComponent },
      { path: '**', redirectTo: '/dashboard' }
    ]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
