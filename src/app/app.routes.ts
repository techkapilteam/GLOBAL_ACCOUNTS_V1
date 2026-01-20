import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ScreenViewComponent } from './components/screen-view/screen-view.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { authGuard } from './guards/auth.guard';
import { BankConfigComponent } from './components/ACCOUNTS CONFIG/bank-config/bank-config.component';
import { ChequeManagementComponent } from './components/ACCOUNTS CONFIG/cheque-management/cheque-management.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'accounts/accounts-config/bank-config',
        component: BankConfigComponent
      },
      {
        path: 'accounts/accounts-config/cheque-management',
        component: ChequeManagementComponent
      },
      {
        path: 'accounts/accounts-config/create-account',
        component: CreateAccountComponent
      },
      {
        path: 'accounts/accounts-config/:screen',
        component: ScreenViewComponent
      },
      {
        path: 'accounts/accounts-transactions/:screen',
        component: ScreenViewComponent
      },
      {
        path: 'accounts/accounts-reports/:screen',
        component: ScreenViewComponent
      },
      {
        path: 'transactions/deposits/:screen',
        component: ScreenViewComponent
      },
      {
        path: 'transactions/withdrawals/:screen',
        component: ScreenViewComponent
      },
      {
        path: 'transactions/transfers/:screen',
        component: ScreenViewComponent
      },
      {
        path: 'reports/financial-reports/:screen',
        component: ScreenViewComponent
      },
      {
        path: 'reports/transaction-reports/:screen',
        component: ScreenViewComponent
      },
      {
        path: 'reports/customer-reports/:screen',
        component: ScreenViewComponent
      },
      {
        path: 'settings/user-management/:screen',
        component: ScreenViewComponent
      },
      {
        path: 'settings/system-config/:screen',
        component: ScreenViewComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
