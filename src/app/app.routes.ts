import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ScreenViewComponent } from './components/screen-view/screen-view.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { authGuard } from './guards/auth.guard';
import { BankConfigComponent } from './components/ACCOUNTS CONFIG/bank-config/bank-config.component';
import { ChequeManagementComponent } from './components/ACCOUNTS CONFIG/cheque-management/cheque-management.component';
import { BankConfigViewComponent } from './components/ACCOUNTS CONFIG/bank-config-view/bank-config-view.component';
import { GeneralReceiptCancelComponent } from './components/ACCOUNTS TRANSACTIONS/general-receipt-cancel/general-receipt-cancel.component';
import { JvListComponent } from './components/ACCOUNTS REPORTS/jv-list/jv-list.component';
import { OnlineReceiptsComponent } from './components/ACCOUNTS TRANSACTIONS/online-receipts/online-receipts.component';
import { PettycashReceiptCancelComponent } from './components/ACCOUNTS TRANSACTIONS/pettycash-receipt-cancel/pettycash-receipt-cancel.component';
import { ChequesIssuedComponent } from './components/ACCOUNTS TRANSACTIONS/cheques-issued/cheques-issued.component';
import { BankTransferComponent } from './components/ACCOUNTS TRANSACTIONS/bank-transfer/bank-transfer.component';
import { BrsComponent } from './components/ACCOUNTS REPORTS/brs/brs.component';
import { BrsStatementsComponent } from './components/ACCOUNTS REPORTS/brs-statements/brs-statements.component';
import { TrialBalanceComponent } from './components/ACCOUNTS REPORTS/trial-balance/trial-balance.component';
import { ChequesOnhandComponent } from './components/ACCOUNTS TRANSACTIONS/cheques-onhand/cheques-onhand.component';
import { AccountSummaryComponent } from './components/ACCOUNTS REPORTS/account-summary/account-summary.component';
import { TdsJvComponent } from './components/ACCOUNTS TRANSACTIONS/tds-jv/tds-jv.component';
import { CashOnhandComponent } from './components/ACCOUNTS TRANSACTIONS/cash-onhand/cash-onhand.component';
import { JournalVoucherComponent } from './components/ACCOUNTS TRANSACTIONS/journal-voucher/journal-voucher.component';

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
        path: 'accounts/accounts-config/bank-config-view',
        component: BankConfigViewComponent
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
        path: 'accounts/accounts-transactions/general-receipt-cancel',
        component: GeneralReceiptCancelComponent
      },
      {
        path: 'accounts/accounts-transactions/cheques-issued',
        component: ChequesIssuedComponent
      },
      {
        path: 'accounts/accounts-transactions/cheques-onhand',
        component: ChequesOnhandComponent
      },
      {
        path: 'accounts/accounts-transactions/pettycash-receipt-cancel',
        component: PettycashReceiptCancelComponent
      },
      {
        path: 'accounts/accounts-transactions/online-receipts',
        component: OnlineReceiptsComponent
      },
      {
        path: 'accounts/accounts-transactions/bank-transfer',
        component: BankTransferComponent
      },
      {
        path: 'accounts/accounts-transactions/tds-jv',
        component: TdsJvComponent
      },
      {
        path: 'accounts/accounts-transactions/cash-onhand',
        component: CashOnhandComponent
      },
      {
        path: 'accounts/accounts-transactions/journal-voucher',
        component: JournalVoucherComponent
      },
      {
        path: 'accounts/accounts-transactions/:screen',
        component: ScreenViewComponent
      },
      {
        path: 'accounts/accounts-reports/jv-list',
        component: JvListComponent
      },
      {
        path: 'accounts/accounts-reports/brs-statements',
        component: BrsStatementsComponent
      },
      {
        path: 'accounts/accounts-reports/trial-balance',
        component: TrialBalanceComponent
      },
      {
        path: 'accounts/accounts-reports/brs',
        component: BrsComponent
      },
      {
        path: 'accounts/accounts-reports/account-summary',
        component: AccountSummaryComponent
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
