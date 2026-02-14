import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-ledger',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    BsDatepickerModule,TableModule,ReactiveFormsModule
  ],
  templateUrl: './account-ledger.component.html',
  providers: [DatePipe]
})
export class AccountLedgerComponent implements OnInit {

  private fb = inject(FormBuilder);
  private reportService = inject(AccountingReportsService);
  private transactionService = inject(AccountingTransactionsService);
  private commonService = inject(CommonService);
  private datePipe = inject(DatePipe);
  private router = inject(Router);
accountLedgerForm!: FormGroup;
  fromDate: Date | null = null;
toDate: Date | null = null;
today = new Date();

  ledgeraccountslist: any[] = [];
  subledgeraccountslist: any[] = [];
  gridView: any[] = [];

  isLoading = false;
  isNarrationChecked = false;

  totaldebitamount = 0;
  totalcreditamount = 0;
  totalbalanceamount = 0;
  dpConfig: Partial<BsDatepickerConfig> = {};

  // ledgeraccountslist = [
  //   { pledgerid: 1, pledgername: 'BANK CHARGES' }
  // ];
  // subledgeraccountslist = [
  //   { psubledgerid: 11, psubledgername: 'ICICI Bank', pledgerid: 1 }
  // ];

  filteredSubLedgers: any[] = [];

  selectedLedger: any;
  selectedsubledger: any;

  LedgerName = '';
  SubLedgerName = '';

  showReport = false;


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
    // const today = new Date();
    // this.fromDate = today;
    // this.toDate = today;

    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      maxDate: this.today
    };
    this.initForm();
    this.loadLedgers();
  }
  private initForm(): void {
    this.accountLedgerForm = this.fb.group({
      pledgerid: [null, Validators.required],
      psubledgerid: [null],
      fromDate: [this.today, Validators.required],
      toDate: [this.today, Validators.required]
    }, { validators: this.dateRangeValidator });
  }
   private dateRangeValidator(group: FormGroup) {
    const from = group.get('fromDate')?.value;
    const to = group.get('toDate')?.value;

    if (from && to && new Date(from) > new Date(to)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }
  private loadLedgers(): void {
    this.reportService.GetLedgerAccountList('ACCOUNT LEDGER')
      .subscribe({
        next: (res) => this.ledgeraccountslist = res ?? [],
        error: (err) => this.commonService.showErrorMessage(err)
      });
  }

  // ledgerName_Change(id: number) {
  //   const ledger = this.ledgeraccountslist.find(x => x.pledgerid === id);
  //   this.LedgerName = ledger?.pledgername || '';
  //   this.filteredSubLedgers =
  //     this.subledgeraccountslist.filter(x => x.pledgerid === id);
  // }

  // subledgerName_Change(id: number) {
  //   const sub = this.filteredSubLedgers.find(x => x.psubledgerid === id);
  //   this.SubLedgerName = sub?.psubledgername || '';
  // }
  onLedgerChange(event: any): void {
    const ledgerId = event?.pledgerid;

    this.subledgeraccountslist = [];

    if (!ledgerId) return;

    this.transactionService.GetSubLedgerData(ledgerId
      
    )
      .subscribe({
        next: (res) => this.subledgeraccountslist = res ?? [],
        error: (err) => this.commonService.showErrorMessage(err)
      });
  }

  // generateReport() {
  //   if (!this.selectedLedger) {
  //     alert('Please select Ledger');
  //     return;
  //   }

  //   this.showReport = true;

  //   this.gridView = [
  //     {
  //       // date: '03-Feb-2026',
  //       txnno: '--NA--',
  //       particulars: this.isNarrationChecked ? 'Bank Charges – February' : 'Bank Charges',
  //       debit: '',
  //       credit: '',
  //       balance: '11,702.59 Dr'
  //     },
  //     {
  //       // date: '03-Feb-2026',
  //       txnno: 'TXN001',
  //       particulars: this.isNarrationChecked ? 'Bank Charges – February' : 'Bank Charges',
  //       debit: '250.00',
  //       credit: '',
  //       balance: '11,452.59 Dr'
  //     }
  //   ];
  // }
  generateReport(): void {

    if (this.accountLedgerForm.invalid) {
      this.accountLedgerForm.markAllAsTouched();
      return;
    }

    const { pledgerid, psubledgerid, fromDate, toDate } = this.accountLedgerForm.value;

    this.isLoading = true;

    const formattedFrom = this.commonService.getFormatDateGlobal(fromDate)??'';
    const formattedTo = this.commonService.getFormatDateGlobal(toDate)??'';

    this.reportService.GetLedgerReport(
      formattedFrom,
      formattedTo,
      pledgerid,
      psubledgerid || 0
    ).subscribe({
      next: (res) => {
        this.gridView = res ?? [];
        this.calculateTotals();
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
  private calculateTotals(): void {
    this.totaldebitamount = this.gridView
      .reduce((sum, x) => sum + (x.pdebitamount || 0), 0);

    this.totalcreditamount = this.gridView
      .reduce((sum, x) => sum + (x.pcreditamount || 0), 0);

    this.totalbalanceamount = this.gridView
      .reduce((sum, x) => sum + (x.popeningbal || 0), 0);
  }
  checkNarration(event: any): void {
    this.isNarrationChecked = event.target.checked;
  }


  // pdfOrPrint(type: 'Pdf' | 'Print') {
  //   if (type === 'Print') {
  //     window.print();
  //   } else {
  //     alert('PDF export not implemented in demo mode');
  //   }
  // }
  pdfOrPrint(printOrPdf: 'Print' | 'Pdf'): void {
  debugger;

  const { SubLedgerName, LedgerName, gridView, isNarrationChecked } = this;

  const reportName = 'Account Ledger';
  const subReportName = SubLedgerName
    ? `${LedgerName} (${SubLedgerName})`
    : `${LedgerName}`;

  const gridHeaders: string[] = [
    'Transaction No.',
    'Particulars',
    'Debit',
    'Credit',
    'Balance'
  ];

  const fromDateControl = this.accountLedgerForm?.controls?.['fromDate']?.value;
  const toDateControl = this.accountLedgerForm?.controls?.['toDate']?.value;

  const fromDate = this.commonService.getFormatDateGlobal(fromDateControl);
  const toDate = this.commonService.getFormatDateGlobal(toDateControl);

  const colWidthHeight = {
    ptransactiondate: { cellWidth: 'auto' },
    ptransactionno: { cellWidth: 'auto' },
    pparticulars: { cellWidth: 25 },
    pdebitamount: { cellWidth: 'auto' },
    pcreditamount: { cellWidth: 'auto' },
    popeningbal: { cellWidth: 'auto' }
  };

  const groupedData = this.commonService._getGroupingGridExportData(
    gridView,
    'ptransactiondate',
    true
  );

  const rows: (string | number)[][] = groupedData.map((element: any) => {
    const {
      ptransactiondate,
      ptransactionno,
      pparticulars,
      pdebitamount,
      pcreditamount,
      popeningbal,
      pBalanceType,
      group
    } = element;

    const formattedOpeningBal =
      this.commonService.convertAmountToPdfFormat(
        this.commonService.currencyformat(popeningbal)
      ) + ` ${pBalanceType}`;

    const debitAmt =
      pdebitamount && pdebitamount !== 0
        ? this.commonService.convertAmountToPdfFormat(
            this.commonService.currencyformat(pdebitamount)
          )
        : '';

    const creditAmt =
      pcreditamount && pcreditamount !== 0
        ? this.commonService.convertAmountToPdfFormat(
            this.commonService.currencyformat(
              parseFloat(pcreditamount).toFixed(2)
            )
          )
        : '';

    return group !== undefined
      ? [group, ptransactionno, pparticulars, debitAmt, creditAmt, formattedOpeningBal]
      : [ptransactionno, pparticulars, debitAmt, creditAmt, formattedOpeningBal];
  });

  this.reportService._AccountLedgerReportsPdfforpettycash(
    reportName,
    subReportName,
    rows,
    gridHeaders,
    colWidthHeight,
    'a4',
    'Between',
    fromDate,
    toDate,
    printOrPdf,
    isNarrationChecked
  );
}


  // exportExcel() {
  //   alert('Excel export not implemented in demo mode');
  // }
  exportToExcel(): void {
    const rows = this.gridView.map(x => ({
      "Transaction Date": this.commonService.getFormatDateGlobal(x.ptransactiondate),
      "Transaction No": x.ptransactionno,
      "Particulars": x.pparticulars,
      "Debit": x.pdebitamount,
      "Credit": x.pcreditamount,
      "Balance": x.popeningbal
    }));

    this.commonService.exportAsExcelFile(rows, 'Account_Ledger');
  }

  formatDate(date: Date | string | null): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
  }
   validateDates() {

  if (this.fromDate && this.toDate) {

    const fromTime = new Date(this.fromDate).setHours(0,0,0,0);
    const toTime = new Date(this.toDate).setHours(0,0,0,0);

    if (fromTime > toTime) {
      alert('From Date should not be greater than To Date');
     this.toDate = new Date();
    }
  }
}
}

