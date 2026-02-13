import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cash-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    BsDatepickerModule,
    TableModule,ReactiveFormsModule
  ],
  templateUrl: './cash-book.component.html',
  providers: [DatePipe]
})
export class CashBookComponent implements OnInit {

  // private datePipe = inject(DatePipe);

  // transactionType = '';
  // showTable = false;

  // fromDate: Date | null = null;
  // toDate: Date | null = null;

  // validateDates() {

  //   if (this.fromDate && this.toDate) {

  //     const fromTime = new Date(this.fromDate).setHours(0, 0, 0, 0);
  //     const toTime = new Date(this.toDate).setHours(0, 0, 0, 0);

  //     if (fromTime > toTime) {
  //       alert('From Date should not be greater than To Date');
  //       this.toDate = new Date();
  //     }
  //   }
  // }

  // dpConfig: Partial<BsDatepickerConfig> = {};

  // // Static Data
  // rows = [
  //   { txnNo: 'TXC001', particulars: new Date('2026-01-01'), narration: 'Opening Balance', receipts: 10000, payments: 0, balance: 10000 },
  //   { txnNo: 'TXC002', particulars: new Date('2026-01-02'), narration: 'Cash Sale', receipts: 5000, payments: 0, balance: 15000 },
  //   { txnNo: 'TXC003', particulars: new Date('2026-01-03'), narration: 'Office Expenses', receipts: 0, payments: 2000, balance: 13000 },
  //   { txnNo: 'TXC004', particulars: new Date('2026-01-04'), narration: 'Cash Received', receipts: 3000, payments: 0, balance: 16000 }
  // ];

  // ngOnInit(): void {
  //   const today = new Date();
  //   this.fromDate = today;
  //   this.toDate = today;

  //   this.dpConfig = {
  //     dateInputFormat: 'DD-MMM-YYYY',
  //     containerClass: 'theme-dark-blue',
  //     showWeekNumbers: false,
  //     maxDate: new Date()
  //   };
  // }

  // generateReport() {
  //   if (!this.fromDate || !this.toDate || !this.transactionType) {
  //     alert('Please select From Date, To Date, and Transaction Type.');
  //     return;
  //   }
  //   this.showTable = true;
  // }

  // pdfOrprint(type: 'Pdf' | 'Print') {
  //   if (type === 'Print') {
  //     window.print();
  //   } else {
  //     alert('PDF export not implemented in demo mode');
  //   }
  // }

  // exportExcel() {
  //   alert('Excel export not implemented in demo mode');
  // }

  // formatDate(date: Date | string | null): string {
  //   if (!date) return '';
  //   return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
  // }
  private fb = inject(FormBuilder);
  private reportService = inject(AccountingReportsService);
  private commonService = inject(CommonService);
  private datePipe = inject(DatePipe);
  private router = inject(Router);

  cashBookForm!: FormGroup;

  today = new Date();
  isLoading = false;
  showicons = false;

  gridView: any[] = [];
  temppsubarray: any[] = [];

  ptranstype = 'BOTH';
  currencysymbol: string;

  dpConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'DD-MMM-YYYY',
    containerClass:'theme-dark-blue',
    showWeekNumbers: false,
    maxDate: new Date()
  };

  constructor() {
    this.currencysymbol ='₹'
      // this.commonService.datePickerPropertiesSetup("currencysymbol");
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.cashBookForm = this.fb.group({
      fromDate: [this.today, Validators.required],
      toDate: [this.today, Validators.required],
      ptranstype: ['BOTH', Validators.required]
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

  generateReport(): void {

    if (this.cashBookForm.invalid) {
      this.cashBookForm.markAllAsTouched();
      return;
    }

    const { fromDate, toDate, ptranstype } = this.cashBookForm.value;

    this.isLoading = true;

    const formattedFrom = this.commonService.getFormatDateGlobal(fromDate)??'';
    const formattedTo = this.commonService.getFormatDateGlobal(toDate)??'';

    this.reportService
      .GetCashBookReportbyDates(formattedFrom, formattedTo, ptranstype)
      .subscribe({
        next: (res: any) => {
          this.temppsubarray = res?.plstcashbookdata ?? [];
          this.gridView = [...this.temppsubarray];
          this.showicons = this.gridView.length > 0;
          this.isLoading = false;
        },
        error: (err) => {
          this.commonService.showErrorMessage(err);
          this.isLoading = false;
        }
      });
  }

  onFilter(value: string): void {

    if (!value) {
      this.gridView = [...this.temppsubarray];
      return;
    }

    const filterValue = value.toLowerCase();

    this.gridView = this.temppsubarray.filter(x =>
      x.ptransactiondate?.toString().toLowerCase().includes(filterValue) ||
      x.ptransactionno?.toString().includes(filterValue) ||
      x.pparticulars?.toLowerCase().includes(filterValue) ||
      x.pdescription?.toLowerCase().includes(filterValue)
    );
  }

  clickTransNo(data: any): void {

    const receipt = btoa(data.ptransactionno);

    switch (data.pFormName) {

      case 'GENERAL VOUCHER':
        window.open(`/#/GeneralReceiptReports?id=${receipt}`);
        break;

      case 'PAYMENT VOUCHER':
        window.open(`/#/PaymentVoucherReports?id=${receipt}`);
        break;

      case 'JOURNAL VOUCHER':
        window.open(`/#/JournalvoucherReport?id=${receipt}`);
        break;
    }
  }

  export(): void {

    const rows = this.gridView.map(element => ({

      "Transaction Date":
        this.commonService.getFormatDateGlobal(element.ptransactiondate),

      "Transaction No.":
        element.ptransactionno || '--NA--',

      "Particulars":
        element.pparticulars,

      "Narration":
        element.pdescription || '--NA--',

      "Receipts":
        element.pdebitamount || '',

      "Payments":
        element.pcreditamount || '',

      "Balance":
        element.pclosingbal
          ? `${element.pclosingbal} ${element.pBalanceType}`
          : ''
    }));

    this.commonService.exportAsExcelFile(rows, 'Cash_Book');
  }

  pdfOrPrint(type: 'Pdf' | 'Print'): void {

    const { fromDate, toDate } = this.cashBookForm.value;

    const formattedFrom =
      this.commonService.getFormatDateGlobal(fromDate)??'';

    const formattedTo =
      this.commonService.getFormatDateGlobal(toDate)??'';

    const headers = [
      "Transaction No.",
      "Particulars",
      "Narration",
      "Receipts",
      "Payments",
      "Balance"
    ];

    const rows = this.gridView.map(x => ([
      x.ptransactionno || '--NA--',
      x.pparticulars,
      x.pdescription || '--NA--',
      x.pdebitamount || '',
      x.pcreditamount || '',
      x.pclosingbal
        ? `${x.pclosingbal} ${x.pBalanceType}`
        : ''
    ]));

    this.reportService._CashBookReportsPdf(
      "Cash Book",
      rows,
      headers,
      {},
      "landscape",
      "Between",
      formattedFrom,
      formattedTo,
      type
    );
  }
}
