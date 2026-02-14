import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import { CommonService } from '../../../services/common.service';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-account-summary',
  standalone: true,
  imports: [NgxDatatableModule, CommonModule, ReactiveFormsModule, BsDatepickerModule, FormsModule, TableModule,ButtonModule,MultiSelectModule],
  providers: [DatePipe],
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.css']
})
export class AccountSummaryComponent {

  // accountSummaryForm!: FormGroup;

  // ledgerList: any[] = [
  //   { pledgerid: '1', pledgername: 'Cash' },
  //   { pledgerid: '2', pledgername: 'Bank' },
  //   { pledgerid: '3', pledgername: 'Sales' }
  // ];

  // gridData: any[] = [];
  // currencySymbol = '$';
  // isLoading = false;

  // showAsOn = true;
  // saveButtonText = 'Generate Report';

  // asOnDate!: Date;
  // betweenFrom!: Date;
  // betweenTo!: Date;

  // dpConfig: Partial<BsDatepickerConfig> = {};

  // constructor(private fb: FormBuilder, private datePipe: DatePipe) { }

  // ngOnInit(): void {
  //   const today = new Date();

  //   this.dpConfig = {
  //     dateInputFormat: 'DD-MMM-YYYY',
  //     containerClass: 'theme-dark-blue',
  //     showWeekNumbers: false
  //   };

  //   this.accountSummaryForm = this.fb.group({
  //     asOnChecked: [true],
  //     fromDate: [today, Validators.required],
  //     toDate: [today, Validators.required],
  //     ledgerId: ['', Validators.required]
  //   }, { validators: this.dateRangeValidator() });

  //   this.accountSummaryForm.get('asOnChecked')?.valueChanges.subscribe(value => {
  //     this.showAsOn = value;
  //   });
  // }
  // dateRangeValidator(): ValidatorFn {
  //   return (group: AbstractControl): ValidationErrors | null => {
  //     const from = group.get('fromDate')?.value;
  //     const to = group.get('toDate')?.value;

  //     if (!from || !to) return null;

  //     return from > to ? { dateRangeInvalid: true } : null;
  //   };
  // }

  // generateReport() {

  //   if (this.accountSummaryForm.errors?.['dateRangeInvalid']) {
  //     alert('From Date should not be greater than To Date');
  //     return;
  //   }

  //   if (!this.accountSummaryForm.valid) return;


  //   this.isLoading = true;

  //   const ledgerName = this.ledgerList.find(
  //     l => l.pledgerid === this.accountSummaryForm.value.ledgerId
  //   )?.pledgername;

  //   if (this.showAsOn) {
  //     this.asOnDate = this.accountSummaryForm.value.fromDate;

  //     this.gridData = [
  //       {
  //         particulars: ledgerName,
  //         transactionDate: this.asOnDate,
  //         debitAmount: 500,
  //         creditAmount: 0
  //       },
  //       {
  //         particulars: ledgerName,
  //         transactionDate: this.asOnDate,
  //         debitAmount: 0,
  //         creditAmount: 200
  //       }
  //     ];
  //   } else {
  //     this.betweenFrom = this.accountSummaryForm.value.fromDate;
  //     this.betweenTo = this.accountSummaryForm.value.toDate;

  //     this.gridData = [
  //       {
  //         particulars: ledgerName,
  //         transactionDate: this.betweenFrom,
  //         openingBalance: 1000,
  //         debitAmount: 0,
  //         creditAmount: 0,
  //         closingBalance: 1000
  //       },
  //       {
  //         particulars: ledgerName,
  //         transactionDate: this.betweenFrom,
  //         openingBalance: 1000,
  //         debitAmount: 500,
  //         creditAmount: 0,
  //         closingBalance: 1500
  //       },
  //       {
  //         particulars: ledgerName,
  //         transactionDate: this.betweenTo,
  //         openingBalance: 1500,
  //         debitAmount: 0,
  //         creditAmount: 200,
  //         closingBalance: 1300
  //       }
  //     ];
  //   }

  //   this.isLoading = false;
  // }

  // formatDate(date: Date | string | null): string {
  //   if (!date) return '';
  //   return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
  // }
  accountSummaryForm!: FormGroup;

  ledgerAccountsList: any[] = [];
  gridData: any[] = [];

  loading = false;
  selectedDateMode = true;   
  asOnDateFlag = 'T';

  totalDebit = 0;
  totalCredit = 0;

  constructor(
    private fb: FormBuilder,
    private reportService: AccountingReportsService,
    private commonService: CommonService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {

    const today = new Date();

    this.accountSummaryForm = this.fb.group({
      fromDate: [today],
      toDate: [today],
      ledgerId: ['', Validators.required],
      asOn: [true]
    });

    this.loadLedgerAccounts();
  }

  // loadLedgerAccounts(): void {
  //   this.reportService
  //     .GetLedgerSummaryAccountList('ACCOUNT LEDGER')
  //     .subscribe({
  //       next: (res) => this.ledgerAccountsList = res ?? [],
  //       error: (err) => this.commonService.showErrorMessage(err)
  //     });
  // }
  loadLedgerAccounts(): void {
    this.reportService
      .GetLedgerSummaryAccountList('ACCOUNT LEDGER','accounts','KAPILCHITS','KLC01','global')
      .subscribe({
        next: (res) => this.ledgerAccountsList = res ?? [],
        error: (err) => this.commonService.showErrorMessage(err)
      });
  }

  onDateModeChange(): void {
    this.selectedDateMode = this.accountSummaryForm.value.asOn;
    this.asOnDateFlag = this.selectedDateMode ? 'T' : 'F';

    if (this.selectedDateMode) {
      this.accountSummaryForm.patchValue({
        toDate: this.accountSummaryForm.value.fromDate
      });
    }
  }

  generateReport(): void {

    if (this.accountSummaryForm.invalid) return;

    this.loading = true;
    this.gridData = [];
    this.totalDebit = 0;
    this.totalCredit = 0;

    const formValue = this.accountSummaryForm.value;

    const fromDate = this.commonService.getFormatDateNormal(formValue.fromDate)??'';
    const toDate = this.commonService.getFormatDateNormal(
      this.selectedDateMode ? formValue.fromDate : formValue.toDate
    )??'';

    this.reportService
      .GetLedgerSummary(fromDate, toDate, formValue.ledgerId, this.asOnDateFlag, '')
      .subscribe({
        next: (res) => {
          this.gridData = res ?? [];
          this.calculateTotals();
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.commonService.showErrorMessage(err);
        }
      });
  }

  calculateTotals(): void {

    this.gridData.forEach(item => {

      const debit = Math.abs(item.pdebitamount || 0);
      const credit = Math.abs(item.pcreditamount || 0);

      item.pdebitamount = debit;
      item.pcreditamount = credit;

      this.totalDebit += debit;
      this.totalCredit += credit;

      if (item.popeningbal < 0) {
        item.popeningbal =
          this.commonService.currencyformat(Math.abs(item.popeningbal)) + ' Cr';
      } else if (item.popeningbal > 0) {
        item.popeningbal =
          this.commonService.currencyformat(item.popeningbal) + ' Dr';
      }

      if (item.pclosingbal < 0) {
        item.pclosingbal =
          this.commonService.currencyformat(Math.abs(item.pclosingbal)) + ' Cr';
      } else if (item.pclosingbal > 0) {
        item.pclosingbal =
          this.commonService.currencyformat(item.pclosingbal) + ' Dr';
      }
    });
  }

  exportExcel(): void {

    const rows = this.gridData.map(element => ({
      'Ledger Name': element.pparentname,
      'Particulars': element.paccountname,
      'Debit Amount': element.pdebitamount,
      'Credit Amount': element.pcreditamount
    }));

    this.commonService.exportAsExcelFile(rows, 'Account_Summary');
  }

}
