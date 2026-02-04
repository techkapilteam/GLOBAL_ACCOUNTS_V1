import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-account-ledger',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    BsDatepickerModule
  ],
  templateUrl: './account-ledger.component.html',
  providers: [DatePipe]
})
export class AccountLedgerComponent implements OnInit {

  private datePipe = inject(DatePipe);

  fromDate!: Date;
  toDate!: Date;
  dpConfig: Partial<BsDatepickerConfig> = {};

  ledgeraccountslist = [
    { pledgerid: 1, pledgername: 'BANK CHARGES' }
  ];
  subledgeraccountslist = [
    { psubledgerid: 11, psubledgername: 'ICICI Bank', pledgerid: 1 }
  ];

  filteredSubLedgers: any[] = [];

  selectedLedger: any;
  selectedsubledger: any;

  LedgerName = '';
  SubLedgerName = '';

  isNarrationChecked = false;
  showReport = false;

  gridView: any[] = [];

  // Columns with sorting disabled
  columns = [
    { name: 'Date', prop: 'date', sortable: false },
    { name: 'Txn No', prop: 'txnno', sortable: false },
    { name: 'Particulars', prop: 'particulars', sortable: false },
    { name: 'Debit', prop: 'debit', sortable: false },
    { name: 'Credit', prop: 'credit', sortable: false },
    { name: 'Balance', prop: 'balance', sortable: false }
  ];

  ngOnInit(): void {
    const today = new Date();
    this.fromDate = today;
    this.toDate = today;

    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      maxDate: today
    };
  }

  ledgerName_Change(id: number) {
    const ledger = this.ledgeraccountslist.find(x => x.pledgerid === id);
    this.LedgerName = ledger?.pledgername || '';
    this.filteredSubLedgers =
      this.subledgeraccountslist.filter(x => x.pledgerid === id);
  }

  subledgerName_Change(id: number) {
    const sub = this.filteredSubLedgers.find(x => x.psubledgerid === id);
    this.SubLedgerName = sub?.psubledgername || '';
  }

  generateReport() {
    if (!this.selectedLedger) {
      alert('Please select Ledger');
      return;
    }

    this.showReport = true;

    this.gridView = [
      {
        // date: '03-Feb-2026',
        txnno: '--NA--',
        particulars: this.isNarrationChecked ? 'Bank Charges – February' : 'Bank Charges',
        debit: '',
        credit: '',
        balance: '11,702.59 Dr'
      },
      {
        // date: '03-Feb-2026',
        txnno: 'TXN001',
        particulars: this.isNarrationChecked ? 'Bank Charges – February' : 'Bank Charges',
        debit: '250.00',
        credit: '',
        balance: '11,452.59 Dr'
      }
    ];
  }

  pdfOrPrint(type: 'Pdf' | 'Print') {
    if (type === 'Print') {
      window.print();
    } else {
      alert('PDF export not implemented in demo mode');
    }
  }

  exportExcel() {
    alert('Excel export not implemented in demo mode');
  }

  formatDate(date: Date | string | null): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
  }
}
