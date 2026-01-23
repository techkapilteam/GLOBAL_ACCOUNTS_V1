import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Screen {
  id: string;
  name: string;
  route: string;
  icon?: string;
}

export interface SubModule {
  id: string;
  name: string;
  icon?: string;
  screens: Screen[];
}

export interface Module {
  id: string;
  name: string;
  icon?: string;
  subModules: SubModule[];
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private selectedModuleSubject = new BehaviorSubject<Module | null>(null);
  private selectedSubModuleSubject = new BehaviorSubject<SubModule | null>(null);
  private selectedScreenSubject = new BehaviorSubject<Screen | null>(null);

  public selectedModule$: Observable<Module | null> = this.selectedModuleSubject.asObservable();
  public selectedSubModule$: Observable<SubModule | null> = this.selectedSubModuleSubject.asObservable();
  public selectedScreen$: Observable<Screen | null> = this.selectedScreenSubject.asObservable();

  private modulesData: Module[] = [
    {
      id: 'accounts',
      name: 'Accounts',
      icon: '💼',
      subModules: [
        {
          id: 'accounts-config',
          name: 'Accounts Config',
          icon: '👥',
          screens: [
            { id: 'bank-config', name: 'Bank Configuration', route: '/dashboard/accounts/accounts-config/bank-config' },
            { id: 'cheque-management', name: 'Cheque Management', route: '/dashboard/accounts/accounts-config/cheque-management' }

          ]
        },
        {
          id: 'accounts-transactions',
          name: 'Accounts Transactions',
          icon: '🏦',
          screens: [
            { id: 'general-receipt-report', name: 'General Receipt', route: '/dashboard/accounts/accounts-transactions/general-receipt-report' },
            { id: 'payment-voucher', name: 'Payment Voucher', route: '/dashboard/accounts/accounts-transactions/payment-voucher' },
            { id: 'payment-voucher-view', name: 'Payment Voucher view', route: '/dashboard/accounts/accounts-transactions/payment-voucher-view' },
            { id: 'petty-cash', name: 'Petty Cash', route: '/dashboard/accounts/accounts-transactions/petty-cash' },
            { id: 'cheques-onhand', name: 'Cheques On Hand', route: '/dashboard/accounts/accounts-transactions/cheques-onhand' },
            { id: 'cheques-inbank', name: 'Cheques In Bank', route: '/dashboard/accounts/accounts-transactions/cheques-inbank' },
            { id: 'cheques-issued', name: 'Cheques Issued', route: '/dashboard/accounts/accounts-transactions/cheques-issued' },
            { id: 'general-receipt-cancel', name: 'General Receipt Cancel', route: '/dashboard/accounts/accounts-transactions/general-receipt-cancel' },
            { id: 'pettycash-receipt-cancel', name: 'Petty Cash Receipt Cancel', route: '/dashboard/accounts/accounts-transactions/pettycash-receipt-cancel' },
            { id: 'journal-voucher', name: 'Journal Voucher', route: '/dashboard/accounts/accounts-transactions/journal-voucher' },
            { id: 'journal-voucher-view', name: 'Journal Voucher view', route: '/dashboard/accounts/accounts-transactions/journal-voucher-view' },
            { id: 'cash-onhand', name: 'Cash On Hand', route: '/dashboard/accounts/accounts-transactions/cash-onhand' },
            { id: 'tds-jv', name: 'TDS Journal Voucher', route: '/dashboard/accounts/accounts-transactions/tds-jv' },
            { id: 'online-settlement', name: 'Online Settlement', route: '/dashboard/accounts/accounts-transactions/online-settlement' },
            { id: 'online-receipts', name: 'Online Receipts', route: '/dashboard/accounts/accounts-transactions/online-receipts' },
            { id: 'bank-transfer', name: 'Bank Transfer', route: '/dashboard/accounts/accounts-transactions/bank-transfer' },
          ]
        },
        {
          id: 'accounts-reports',
          name: 'Accounts Reports',
          icon: '📊',
          screens: [
            { id: 'account-ledger', name: 'Account Ledger', route: '/dashboard/accounts/accounts-reports/account-ledger' },
            { id: 'cash-book', name: 'Cash Book', route: '/dashboard/accounts/accounts-reports/cash-book' },
            { id: 'bank-book', name: 'Bank Book', route: '/dashboard/accounts/accounts-reports/bank-book' },
            { id: 'day-book', name: 'Day Book', route: '/dashboard/accounts/accounts-reports/day-book' },
            { id: 'jv-list', name: 'JV List', route: '/dashboard/accounts/accounts-reports/jv-list' },
            { id: 'brs', name: 'BRS', route: '/dashboard/accounts/accounts-reports/brs' },
            { id: 'brs-statements', name: 'BRS Statements', route: '/dashboard/accounts/accounts-reports/brs-statements' },
            { id: 'account-summary', name: 'Account Summary', route: '/dashboard/accounts/accounts-reports/account-summary' },
            { id: 'trial-balance', name: 'Trial Balance', route: '/dashboard/accounts/accounts-reports/trial-balance' },
            { id: 'comparison-tb', name: 'Comparison TB', route: '/dashboard/accounts/accounts-reports/comparison-tb' },
            { id: 'cheque-cancel', name: 'Cheque Cancel', route: '/dashboard/accounts/accounts-reports/cheque-cancel' },
            { id: 'cheque-return', name: 'Cheque Return', route: '/dashboard/accounts/accounts-reports/cheque-return' },
            { id: 'issued-cheque', name: 'Issued Cheque', route: '/dashboard/accounts/accounts-reports/issued-cheque' },
            {id: 'receipts-and-payments', name: 'Receipts and Payments', route: '/dashboard/accounts/accounts-reports/receipts-and-payments' },
            { id: 'cheque-enquiry', name: 'Cheque Enquiry', route: '/dashboard/accounts/accounts-reports/cheque-enquiry' },
            { id: 'gst-report', name: 'GST Report', route: '/dashboard/accounts/accounts-reports/gst-report' },
            //{ id: 'trial-balance', name: 'Trial Balance', route: '/dashboard/accounts/accounts-reports/trial-balance' },
            { id: 'tds-report', name: 'TDS Report', route: '/dashboard/accounts/accounts-reports/tds-report' },
            { id: 're-print', name: 'Re-Print', route: '/dashboard/accounts/accounts-reports/re-print' },
            { id: 'pending-transfer', name: 'Pending Transfer', route: '/dashboard/accounts/accounts-reports/pending-transfer' },
            { id: 'online-settlement-report', name: 'Online Settlement Report', route: '/dashboard/accounts/accounts-reports/online-settlement-report' },
            { id: ' schedule-tb', name: 'Schedule TB', route: '/dashboard/accounts/accounts-reports/schedule-tb' },
          ]
        }
      ]
    },
    {
      id: 'inventory',
      name: 'Inventory',
      icon: '💳',
      subModules: [
        {
          id: 'deposits',
          name: 'Deposits',
          icon: '⬇️',
          screens: [
            { id: 'cash-deposit', name: 'Cash Deposit', route: '/dashboard/inventory/deposits/cash-deposit' },
            { id: 'cheque-deposit', name: 'Cheque Deposit', route: '/dashboard/inventory/deposits/cheque-deposit' },
            { id: 'online-deposit', name: 'Online Deposit', route: '/dashboard/inventory/deposits/online-deposit' }
          ]
        },
        {
          id: 'withdrawals',
          name: 'Withdrawals',
          icon: '⬆️',
          screens: [
            { id: 'cash-withdrawal', name: 'Cash Withdrawal', route: '/dashboard/inventory/withdrawals/cash-withdrawal' },
            { id: 'online-transfer', name: 'Online Transfer', route: '/dashboard/inventory/withdrawals/online-transfer' },
            { id: 'cheque-withdrawal', name: 'Cheque Withdrawal', route: '/dashboard/inventory/withdrawals/cheque-withdrawal' }
          ]
        },
        {
          id: 'transfers',
          name: 'Transfers',
          icon: '🔄',
          screens: [
            { id: 'internal-transfer', name: 'Internal Transfer', route: '/dashboard/inventory/transfers/internal-transfer' },
            { id: 'external-transfer', name: 'External Transfer', route: '/dashboard/inventory/transfers/external-transfer' },
            { id: 'scheduled-transfer', name: 'Scheduled Transfer', route: '/dashboard/inventory/transfers/scheduled-transfer' }
          ]
        }
      ]
    },
    {
      id: 'hrms',
      name: 'HRMS',
      icon: '📊',
      subModules: [
        {
          id: 'financial-reports',
          name: 'Financial Reports',
          icon: '📈',
          screens: [
            { id: 'balance-sheet', name: 'Balance Sheet', route: '/dashboard/hrms/financial-reports/balance-sheet' },
            { id: 'profit-loss', name: 'Profit & Loss', route: '/dashboard/hrms/financial-reports/profit-loss' },
            { id: 'cash-flow', name: 'Cash Flow Statement', route: '/dashboard/hrms/financial-reports/cash-flow' },
            { id: 'trial-balance', name: 'Trial Balance', route: '/dashboard/hrms/financial-reports/trial-balance' }
          ]
        },
        {
          id: 'transaction-reports',
          name: 'Transaction Reports',
          icon: '📋',
          screens: [
            { id: 'daily-transactions', name: 'Daily Transactions', route: '/dashboard/hrms/transaction-reports/daily-transactions' },
            { id: 'monthly-summary', name: 'Monthly Summary', route: '/dashboard/hrms/transaction-reports/monthly-summary' },
            { id: 'audit-trail', name: 'Audit Trail', route: '/dashboard/hrms/transaction-reports/audit-trail' }
          ]
        },
        {
          id: 'customer-reports',
          name: 'Customer Reports',
          icon: '👤',
          screens: [
            { id: 'customer-list', name: 'Customer List', route: '/dashboard/hrms/customer-reports/customer-list' },
            { id: 'customer-activity', name: 'Customer Activity', route: '/dashboard/hrms/customer-reports/customer-activity' },
            { id: 'kyc-reports', name: 'KYC Reports', route: '/dashboard/hrms/customer-reports/kyc-reports' }
          ]
        }
      ]
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: '⚙️',
      subModules: [
        {
          id: 'user-management',
          name: 'User Management',
          icon: '👨‍💼',
          screens: [
            { id: 'manage-users', name: 'Manage Users', route: '/dashboard/settings/user-management/manage-users' },
            { id: 'roles-permissions', name: 'Roles & Permissions', route: '/dashboard/settings/user-management/roles-permissions' },
            { id: 'user-activity', name: 'User Activity Log', route: '/dashboard/settings/user-management/user-activity' }
          ]
        },
        {
          id: 'system-config',
          name: 'System Configuration',
          icon: '🔧',
          screens: [
            { id: 'general-settings', name: 'General Settings', route: '/dashboard/settings/system-config/general-settings' },
            { id: 'email-config', name: 'Email Configuration', route: '/dashboard/settings/system-config/email-config' },
            { id: 'backup-restore', name: 'Backup & Restore', route: '/dashboard/settings/system-config/backup-restore' }
          ]
        }
      ]
    }
  ];

  constructor() { }

  getModules(): Module[] {
    return this.modulesData;
  }

  selectModule(module: Module): void {
    this.selectedModuleSubject.next(module);
    this.selectedSubModuleSubject.next(null);
    this.selectedScreenSubject.next(null);
  }

  selectSubModule(subModule: SubModule): void {
    this.selectedSubModuleSubject.next(subModule);
    this.selectedScreenSubject.next(null);
  }

  selectScreen(screen: Screen): void {
    this.selectedScreenSubject.next(screen);
  }

  getSelectedModule(): Module | null {
    return this.selectedModuleSubject.value;
  }

  getSelectedSubModule(): SubModule | null {
    return this.selectedSubModuleSubject.value;
  }

  getSelectedScreen(): Screen | null {
    return this.selectedScreenSubject.value;
  }
}
