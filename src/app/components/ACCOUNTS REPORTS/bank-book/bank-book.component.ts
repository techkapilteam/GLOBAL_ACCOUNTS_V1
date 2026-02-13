import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';
import { CommonService } from '../../../services/common.service';
import { BankBookService } from '../../../services/Transactions/AccountingReports/bank-book.service';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import { PageCriteria } from '../../../Models/pageCriteria';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';

@Component({
  selector: 'app-bank-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    BsDatepickerModule,
    TableModule, ReactiveFormsModule
  ],
  templateUrl: './bank-book.component.html',
  providers: [DatePipe]
})
export class BankBookComponent implements OnInit {

  //   private datePipe = inject(DatePipe);

  //   bankName = '';
  //   showTable = false;

  //   fromDate: Date | null = null;
  //   toDate: Date | null = null;
  //   validateDates() {

  //   if (this.fromDate && this.toDate) {

  //     const fromTime = new Date(this.fromDate).setHours(0,0,0,0);
  //     const toTime = new Date(this.toDate).setHours(0,0,0,0);

  //     if (fromTime > toTime) {
  //       alert('From Date should not be greater than To Date');    
  //       const today = new Date();
  //       today.setHours(0,0,0,0);
  //       this.toDate = today;
  //     }
  //   }
  // }

  //   dpConfig: Partial<BsDatepickerConfig> = {};

  //   rows = [
  //     { txnNo: 'TXN001', particulars: new Date('2026-01-01'), narration: 'CR001', receipts: 1000, payments: 0, balance: 5000 },
  //     { txnNo: 'TXN002', particulars: new Date('2026-01-02'), narration: 'CR002', receipts: 0, payments: 500, balance: 4500 },
  //     { txnNo: 'TXN003', particulars: new Date('2026-01-03'), narration: 'CR003', receipts: 2000, payments: 0, balance: 6500 },
  //     { txnNo: 'TXN004', particulars: new Date('2026-01-04'), narration: 'CR004', receipts: 0, payments: 1000, balance: 5500 }
  //   ];

  //   ngOnInit(): void {
  //     const today = new Date();
  //     this.fromDate = today;
  //     this.toDate = today;

  //     this.dpConfig = {
  //       dateInputFormat: 'DD-MMM-YYYY',
  //       containerClass: 'theme-dark-blue',
  //       showWeekNumbers: false,
  //       maxDate: new Date()
  //     };
  //   }

  //   generateReport() {
  //     if (!this.fromDate || !this.toDate || !this.bankName) {
  //       alert('Please Select From Date, To Date And Bank Name.');
  //       return;
  //     }
  //     this.showTable = true;
  //   }

  //   pdfOrprint(type: 'Pdf' | 'Print') {
  //     if (type === 'Print') {
  //       window.print();
  //     } else {
  //       alert('PDF export not implemented in demo mode');
  //     }
  //   }

  //   exportExcel() {
  //     alert('Excel export not implemented in demo mode');
  //   }

  //   formatDate(date: Date | string | null): string {
  //     if (!date) return '';
  //     return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
  //   }
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private datePipe = inject(DatePipe);
  private commonService = inject(CommonService);
  private bankBookService = inject(BankBookService);
  private reportService = inject(AccountingReportsService);
  private destroyRef = inject(DestroyRef);
  private _AccountingTransactionsService = inject(AccountingTransactionsService);

  bankBookForm = this.fb.nonNullable.group({
    fromDate: [new Date(), Validators.required],
    toDate: [new Date(), Validators.required],
    pbankname: ['', Validators.required]
  }, { validators: this.dateRangeValidator() });

  dateRangeValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {

      const from = group.get('fromDate')?.value;
      const to = group.get('toDate')?.value;

      if (from && to && new Date(from) > new Date(to)) {
        return { dateRangeInvalid: true };
      }
      return null;
    };
  }

  loading = false;
  saveButton = 'Generate Report';
  gridView: any[] = [];
  bankData: any[] = [];
  selectedBankName = '';
  showReport = false;

  pageCriteria = new PageCriteria();
  dpConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'DD-MMM-YYYY',
    containerClass: 'theme-dark-blue',
    showWeekNumbers: false,
    maxDate: new Date()
  };

  ngOnInit(): void {
    this.loadBankNames();
    // this.getLoadData();
  }

   loadBankNames() {
    debugger;
    this.bankBookService.GetBankNames(
      this.commonService.getschemaname(),
      this.commonService.getbranchname(),
      this.commonService.getCompanyCode(),
      this.commonService.getBranchCode())
      .subscribe({
        next: (res: any) => {
          console.log(res)
          this.bankData = res;
          alert('hello');

          console.log('SUCCESS:', res);
        },
        error: (err: any) => {
          console.log('ERROR:', err);
          alert('API Error');
        }
      });
  }
  //   getLoadData() {this._AccountingTransactionsService.GetReceiptsandPaymentsLoadingData1(
  //   this.commonService.getschemaname(),
  //   this.commonService.getbranchname(),
  //    this.commonService.getCompanyCode(),
  //   this.commonService.getBranchCode()

  // ).subscribe({
  //   next: (res: any) => {
  //      this.bankData = res;
  //      alert('hello');});

  //     console.log('SUCCESS:', res);
  //   },
  //   error: (err: any) => {
  //     console.log('ERROR:', err);
  //     alert('API Error');
  //   }
  // 
  // }

  onBankChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedBankName = select.options[select.selectedIndex].text;
  }

  getBankBookReports(): void {

    if (this.bankBookForm.invalid) {
      this.bankBookForm.markAllAsTouched();
      return;
    }

    const { fromDate, toDate, pbankname = '' } = this.bankBookForm.value;
    if (this.bankBookForm.errors?.['dateRangeInvalid']) {
      alert('From Date should not be greater than To Date');
      return;
    }

    this.loading = true;
    this.saveButton = 'Processing';

    const from = this.commonService.getFormatDateGlobal(fromDate) ?? "";
    const to = this.commonService.getFormatDateGlobal(toDate) ?? '';

    this.bankBookService
      .GetBankBookReportbyDates(from, to, pbankname)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.gridView = res;
          this.showReport = true;
          this.loading = false;
          this.saveButton = 'Generate Report';
        },
        error: err => {
          this.commonService.showErrorMessage(err);
          this.loading = false;
          this.saveButton = 'Generate Report';
        }
      });
  }

  pdfOrPrint(type: 'pdf' | 'print'): void {

    const { fromDate, toDate } = this.bankBookForm.value;

    const rows = this.gridView.map(item => ({
      "Transaction Date": this.commonService.getFormatDateGlobal(item.ptransactiondate),
      "Transaction No.": item.ptransactionno || '--NA--',
      "Particulars": item.pparticulars,
      "Narration": item.pdescription,
      "Receipts": item.pdebitamount,
      "Payments": item.pcreditamount,
      "Balance": item.popeningbal
    }));

    this.reportService._BankBookReportsPdf(
      'Bank Book',
      rows,
      [],
      {},
      'landscape',
      'Between',
      this.commonService.getFormatDateGlobal(fromDate) ?? '',
      this.commonService.getFormatDateGlobal(toDate) ?? '',
      type,
      this.selectedBankName
    );
  }

  export(): void {

    const rows = this.gridView.map(item => ({
      "Transaction Date": this.commonService.getFormatDateGlobal(item.ptransactiondate),
      "Transaction No.": item.ptransactionno,
      "Particulars": item.pparticulars,
      "Narration": item.pdescription,
      "Receipts": item.pdebitamount,
      "Payments": item.pcreditamount,
      "Balance": item.popeningbal
    }));

    this.commonService.exportAsExcelFile(rows, 'BankBook');
  }
  expandedRows: { [key: string]: boolean } = {};

  toggleRow(row: any): void {
    const key = row.ptransactionno;

    this.expandedRows[key] = !this.expandedRows[key];

    if (this.expandedRows[key] && !row.details) {
      this.reportService
        .GetTransTypeDetails(row.ptransactionno)
        .subscribe((res: any) => {
          row.details = res;
        });
    }
  }

}
