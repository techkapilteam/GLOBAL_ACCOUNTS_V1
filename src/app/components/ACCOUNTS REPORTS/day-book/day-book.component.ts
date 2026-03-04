import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';
import { PageCriteria } from '../../../Models/pageCriteria';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';
import { ChitTransactionsService } from '../../../services/chit-transactions.service';
import { CommonService } from '../../../services/common.service';
import { finalize } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-day-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    BsDatepickerModule,TableModule,NgSelectModule
  ],
  templateUrl: './day-book.component.html',
  styleUrls: ['./day-book.component.css'],
  providers: [DatePipe]
})
export class DayBookComponent implements OnInit {

//   private fb = inject(FormBuilder);
//   private datePipe = inject(DatePipe);

//   Daybook!: FormGroup;
//   isSingleDate = true;
//   showGrid = false;

//   today = new Date();
//   dpConfig: Partial<BsDatepickerConfig> = {};

//   transactions: any[] = [];
//   bankSummary: any[] = [];

//   StartDate: Date | null = null;
//   EndDate: Date | null = null;
  
//   isKgmsChecked = false;

//   constructor() {
//     this.dpConfig = {
//       dateInputFormat: 'DD-MMM-YYYY',
//       containerClass: 'theme-dark-blue',
//       showWeekNumbers: false
//     };
//   }

//   ngOnInit(): void {
//     this.Daybook = this.fb.group({
//       date: [true],
//       dfromdate: [this.today, Validators.required],
//       dtodate: [this.today, Validators.required],
//       branch: ['']
//     },{ validators: this.dateRangeValidator() });
//   }
//   dateRangeValidator(): ValidatorFn {
//   return (group: AbstractControl): ValidationErrors | null => {

//     if (this.isSingleDate) return null;

//     const from = group.get('dfromdate')?.value;
//     const to = group.get('dtodate')?.value;

//     if (!from || !to) return null;

//     const fromTime = new Date(from).setHours(0,0,0,0);
//     const toTime = new Date(to).setHours(0,0,0,0);

//     return fromTime > toTime
//       ? { dateRangeInvalid: true }
//       : null;
//   };
// }

//   checkox(event: any) {
//     this.isSingleDate = event.target.checked;
//   }

//   toggleKgmsGenerate(event: any) {
//     this.isKgmsChecked = event.target.checked;
//   }

//   checkboxx(event: any) {}

//   private validateInputs(): boolean {
//     if (this.isSingleDate) {
//       if (!this.Daybook.value.dfromdate) {
//         alert('Please select Date');
//         return false;
//       }
//     } else {
//       if (!this.Daybook.value.dfromdate || !this.Daybook.value.dtodate) {
//         alert('Please select From Date and To Date');
//         return false;
//       }
//     }
//     return true;
//   }
  

//   private loadGrid() {
//     this.showGrid = true;

//     this.StartDate = new Date(this.Daybook.value.dfromdate);
//     this.EndDate = this.isSingleDate
//       ? this.StartDate
//       : new Date(this.Daybook.value.dtodate);
   
//     this.transactions = [
//       { rTxn: 'R001', rPart: 'Cash Receipt', rType: 'Cash', amount: 5000, pTxn: 'P001', pPart: 'Office Expense', pType: 'Cash' },
//       { rTxn: 'R002', rPart: 'Online Receipt', rType: 'Online', amount: 12000, pTxn: 'P002', pPart: 'Bank Transfer', pType: 'Online' }
//     ];

//     this.bankSummary = [
//       { bank: this.Daybook.value.branch, opening: '₹ 9,89,39,559.97 Dr', receipts: '₹ 12,000', payments: '₹ 5,000', closing: '₹ 9,89,46,559.97 Dr' }
//     ];
//   }

//   getdaybookdata() {
//     this.Daybook.markAllAsTouched();

//   if (this.Daybook.errors?.['dateRangeInvalid']) {
//     alert('From Date should not be greater than To Date');
//     return;
//   }

//   if (this.Daybook.invalid) return;
//     if (this.validateInputs()) {
//       this.loadGrid();
//     } else {
//       this.showGrid = false;
//     }
//   }

//   GetChequeonHandDetails() {
//     this.showGrid = false;
//     this.transactions = [];
//     this.bankSummary = [];

//     setTimeout(() => {
//       this.loadGrid();
//       this.showGrid = true;
//     }, 50);
//   }

//   getsummaryReport() {
  
//     if (!this.Daybook.value.branch) {
//       alert('Please select Branch');
//       this.showGrid = false;
//       return;
//     }
   
//     this.showGrid = false;
//     this.transactions = [];
//     this.bankSummary = [];
    
//     setTimeout(() => {
//       this.loadGrid();
//       this.showGrid = true;
//     }, 50);
//   }

//   formatDate(date: Date | string | null): string {
//     if (!date) return '';
//     return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
//   }

 
//   pdfOrprint(type: 'Pdf' | 'Print') {
//     if (type === 'Print') {
//       window.print();
//     } else {
//       alert('PDF export not implemented');
//     }
//   }
@ViewChild('myTable') table: any;
gridDataCheques: any[] = [];
ChequesAmount: number = 0;
  dayBookForm!: FormGroup;
  pageCriteria = new PageCriteria();
  dpConfig: Partial<BsDatepickerConfig> = {};
  dppConfig: Partial<BsDatepickerConfig> = {};
  showdate:any;

  gridData: any[] = [];
  totalBalanceGrid: any[] = [];
  kgmsBranchList: any[] = [];

  loading = false;
  receiptsAmount = 0;
  paymentsAmount = 0;
  currencysymbol: string;

  loginBranchschema!: string;
kgms: boolean = false;
dte:boolean=false;
  EndDate!: string | null;
  StartDate!: string | null;
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private reportService: AccountingReportsService,
    private reportTransService: AccountingTransactionsService,
    private chitService: ChitTransactionsService,
    private commonService: CommonService
  ) {
    this.currencysymbol = '₹'
    // this.commonService.datePickerPropertiesSetup("currencysymbol");

    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      // this.commonService.datePickerPropertiesSetup("dateInputFormat"),
      containerClass: 'theme-dark-blue',
      // this.commonService.datePickerPropertiesSetup("containerClass"),
      maxDate: new Date(),
      showWeekNumbers: false
    };

    this.dppConfig = { ...this.dpConfig };
  }

  ngOnInit(): void {

    this.dayBookForm = this.fb.group({
      date:[new Date()],
      dfromdate: [new Date()],
      dtodate: [new Date()],
      branch_code: ['']
    }, { validators: this.dateRangeValidator });

    this.loginBranchschema = sessionStorage.getItem('loginBranchSchemaname') ?? '';

    this.loadBranches();
    this.setPageModel();
  }
  private dateRangeValidator(group: FormGroup) {
const from = group.get('dfromdate')?.value;
const to = group.get('dtodate')?.value;

if (from && to && new Date(from) > new Date(to)) {
return { dateRangeInvalid: true };
}
return null;
}
onDateToggle(): void {
  if (this.dte) {
    this.dayBookForm.patchValue({
      dtodate: null
    });
  } else {
    this.dayBookForm.patchValue({
      dtodate: new Date()
    });
  }
}

  private loadBranches(): void {
    // this.chitService
    //   .getCAOBranchlist(this.loginBranchschema)
    //   .subscribe((res: any[]) => this.kgmsBranchList = res || []);
    this.chitService
      .getCAOBranchlist('accounts','global','KAPILCHITS','KLC01')
      .subscribe((res: any[]) => this.kgmsBranchList = res || []);
  }
  get f() {
    return this.dayBookForm.controls;
  }
  updateFormattedDates() {
    this.StartDate = this.datePipe.transform(this.f['dfromdate'].value, 'dd-MMM-yyyy');
    this.EndDate = this.datePipe.transform(this.f['dtodate'].value, 'dd-MMM-yyyy');
  }

  private setPageModel(): void {
    this.pageCriteria.pageSize = this.commonService.pageSize;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.offset = 0;
  }

  getDayBookData(): void {
    debugger
    this.updateFormattedDates();

    const fromDate = this.commonService.getFormatDateNormal(
      this.dayBookForm.get('dfromdate')?.value 
    )?? '';

    // const toDate = this.commonService.getFormatDateNormal(
    //   this.dayBookForm.value.dtodate
    // )?? '';
    const toDateControl = this.dayBookForm.get('dtodate')?.value;

let toDate: string;
  let asOnFlag: string;

  if (toDateControl) {
    toDate =
      this.commonService.getFormatDateNormal(toDateControl) || '';
    asOnFlag = 'F';
  } else {
    toDate = fromDate;     
    asOnFlag = 'T';
  }

    this.loading = true;
    this.receiptsAmount = 0;
    this.paymentsAmount = 0;

    this.reportService
      .GetDayBook(fromDate, toDate, asOnFlag,'accounts','KLC01','KAPILCHITS','global')
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res: any) => {
          this.gridData = res?.plstdaybookdata ?? [];
          this.totalBalanceGrid = res?.plstdaybooktotals ?? [];

          this.calculateTotals();
          this.formatBalances();
        },
        error: (err) => this.commonService.showErrorMessage(err)
      });
  }

  private calculateTotals(): void {
    this.receiptsAmount = this.gridData
      .reduce((sum, item) => sum + Number(item.prcptdebitamount || 0), 0);

    this.paymentsAmount = this.gridData
      .reduce((sum, item) => sum + Number(item.pcreditamount || 0), 0);
  }

  private formatBalances(): void {
    this.totalBalanceGrid.forEach(item => {

      const opening = Number(item.popeningbal || 0);
      const closing = Number(item.pclosingbal || 0);

      item.popeningbal = opening === 0
        ? ''
        : `${Math.abs(opening).toFixed(2)} ${opening < 0 ? 'Cr' : 'Dr'}`;

      item.pclosingbal = closing === 0
        ? ''
        : `${Math.abs(closing).toFixed(2)} ${closing < 0 ? 'Cr' : 'Dr'}`;
    });
  }

  getSummaryReport(): void {

    const fromDate = this.commonService.getFormatDateNormal(
      this.dayBookForm.value.dfromdate
    )??'';

    const toDate = this.commonService.getFormatDateNormal(
      this.dayBookForm.value.dtodate
    )??'';

    let branchCode = this.dayBookForm.value.branch_code || '';

    this.loading = true;

    this.chitService
      .GetkgmsCollectionReport(
        this.loginBranchschema,
        branchCode,
        fromDate,
        toDate,
        'Summary'
      )
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res: any[]) => {
          if (!res?.length) {
            alert('No Data To Display');
            return;
          }

          this.exportKgmsReport(res);
        },
        error: (err: any) => this.commonService.showErrorMessage(err)
      });
  }

  private exportKgmsReport(data: any[]): void {

    const rows = data.map(item => ({
      'Branch Name': item.pbranchname,
      'Cash': item.pcash_total ?? 0,
      'Cheque': item.pcheque_total ?? 0,
      'Online': item.ponlie_total ?? 0,
      'Grand Total': item.pgrandtotal ?? 0
    }));

    this.commonService.exportAsExcelFile(rows, 'KGMS WISE COLLECTION REPORT');
  }
  pdfOrprint(printorpdf: 'Pdf' | 'Print'): void {

  const firstgridrows: any[] = [];
  const secondgridrows: any[] = [];

  const Firstreportname = 'Day Book';
  const Secondreportname = '';

  const firstgridheaders: string[] = [
    'Transaction\nNo.',
    'Particulars',
    'Type',
    'Amount ',
    'Transaction\nNo.',
    'Particulars',
    'Type  ',
    'Amount  '
  ];

  const format = this.dayBookForm.controls['dfromdate'].value;
  const fromDate = this.commonService.getFormatDateGlobal(format);

  const formattodate = this.dayBookForm.controls['dtodate'].value;
  const toDate = this.commonService.getFormatDateGlobal(formattodate);

  // if (fromDate && toDate) {
  //   this.showdate = 'Between';
  // } else if (fromDate && !toDate) {
  //   this.showdate = 'As On';
  // } else {
  //   this.showdate = '';
  // }
  if (this.dte) {
  this.showdate = 'As On';
} else {
  this.showdate = 'Between';
}

  const FirstcolWidthHeight: any = {
    0: { cellWidth: 'auto', halign: 'center' },
    1: { cellWidth: 'auto', halign: 'left' },
    2: { cellWidth: 'auto' },
    3: { cellWidth: 'auto', halign: 'right' },
    4: { cellWidth: 'auto' },
    5: { cellWidth: 'auto', halign: 'left' },
    6: { cellWidth: 'auto', halign: 'left' },
    7: { cellWidth: 'auto', halign: 'right' }
  };

  const retungridData = this.commonService._getGroupingGridExportData(
    this.gridData,
    'prcpttransactiondate',
    true
  );

  retungridData.forEach((element: any) => {

    let debitamount = '';
    let paycreditamt = '';
    

    if (element.prcptdebitamount !== 0) {
      // debitamount = this.commonService.currencyformat(parseFloat(element.prcptdebitamount));
      debitamount = this.commonService.convertAmountToPdfFormat(parseFloat(element.prcptdebitamount));
    }

    if (element.pcreditamount !== 0) {
      // paycreditamt = this.commonService.currencyformat(element.pcreditamount);
      paycreditamt = this.commonService.convertAmountToPdfFormat(parseFloat(element.pcreditamount));
    }
    

    // let temp: any[];

    if (element.group) {
      firstgridrows.push([
        element.group,
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ]);
      return;
    }

    const temp = [
      element.prcpttransactionno ?? '',
      element.prcptparticulars ?? '',
      element.prcptaccountname ?? '',
      debitamount,
      element.ptransactionno ?? '',
      element.pparticulars ?? '',
      element.paccountname ?? '',
      paycreditamt
    ];

    firstgridrows.push(temp);
  });

  const secondgridheaders: string[] = [
    'Bank Name',
    'Opening Balance',
    'Receipts',
    'Payments',
    'Closing Balance'
  ];

  const SecondcolWidthHeight: any = {
    paccountname: { cellWidth: 'auto' },
    popeningbal: { cellWidth: 'auto' },
    pdebitamount: { cellWidth: 'auto' },
    pcreditamount: { cellWidth: 'auto' },
    pclosingbal: { cellWidth: 'auto' }
  };

  this.totalBalanceGrid.forEach((element: any) => {

    let openingbal = '';
    let debitamt = '';
    let creditamt = '';
    let closingbal = '';
    
    const openingVal = parseFloat(element.popeningbal);
  if (!isNaN(openingVal) && openingVal !== 0) {
    openingbal = this.commonService.convertAmountToPdfFormat(openingVal);
  }

  if (Number(element.pdebitamount) > 0) {
    debitamt = this.commonService.convertAmountToPdfFormat(
      parseFloat(element.pdebitamount)
    );
  }

  if (Number(element.pcreditamount) > 0) {
    creditamt = this.commonService.convertAmountToPdfFormat(
      parseFloat(element.pcreditamount)
    );
  }

    if (element.pclosingbal && element.pclosingbal !== '') {
    closingbal = element.pclosingbal;
  }

    const temp = [
      element.paccountname ??'',
      openingbal,
      debitamt,
      creditamt,
      closingbal
    ];

    secondgridrows.push(temp);
  });

  const Receiptamt = this.commonService.convertAmountToPdfFormat(
    String(Number(this.receiptsAmount ?? 0))
  );

  const paymentamt = this.commonService.convertAmountToPdfFormat(
    String(Number(this.paymentsAmount ?? 0))
  );

  this.commonService._downloadDayBookReportsPdf(
    Firstreportname,
    firstgridrows,
    firstgridheaders,
    FirstcolWidthHeight,
    'landscape',
    this.showdate,
    fromDate,
    toDate,
    Secondreportname,
    secondgridrows,
    secondgridheaders,
    SecondcolWidthHeight,
    Receiptamt,
    paymentamt,
    printorpdf
  );
}
GetChequeonHandDetails(): void {

  const today = this.commonService.getFormatDateNormal(new Date());

  this.loading = true;

  this.reportTransService
    // .GetChequesOnHand(today)
    .GetChequesOnHand(today,'accounts','global','KAPILCHITS','KLC01')
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: (res: any[]) => {

        if (res && res.length > 0) {

          this.gridDataCheques = res;

          this.ChequesAmount = this.gridDataCheques
            .reduce((sum, c) => sum + Number(c.receiptAmount || 0), 0);

          this.pdfOrprintChequesOnHand('Pdf');

        } else {
          alert('No Data To Display');
        }
      },
      error: (err) => {
        this.commonService.showErrorMessage(err);
      }
    });

}
pdfOrprintChequesOnHand(printOrPdf: 'Print' | 'Pdf'): void {

  const rows: any[] = [];
  const reportName = 'Cheques On Hand';

  const gridHeaders: string[] = [
    'Receipt Date',
    'Received From',
    'Cheque No.',
    'Cheque Amount',
    'Cheque Date',
    'Bank Name',
    'Receipt Amount'
  ];

  const today = new Date();
  const fromDate = this.commonService.getFormatDateGlobal(
  this.dayBookForm.get('dfromdate')?.value 
);

  const toDate =
    this.commonService.getFormatDateGlobal(
      this.dayBookForm.get('dtodate')?.value
    );

  const colWidthHeight = {
    0: { cellWidth: 22 },
    1: { cellWidth: 70 },
    2: { cellWidth: 38 },
    3: { cellWidth: 35, halign: 'left' },
    4: { cellWidth: 22 },
    5: { cellWidth: 48 },
    6: { cellWidth: 35, halign: 'left' }
  };
  this.ChequesAmount = 0;

  this.gridDataCheques?.forEach((element: any) => {
  const clearDate = this.commonService.getFormatDateGlobal(element?.chitReceiptDate);
  const chequeDate = element?.chequeDate
    ? this.commonService.getFormatDateGlobal(element.chequeDate)
    : '';

  // let 
  const chequeAmt = this.commonService.currencyformat(element?.receiptAmount);
  // chequeAmt = this.commonService.convertAmountToPdfFormat(chequeAmt);

  const receiptAmt = this.commonService.currencyformat(element?.totalReceivedAmount);
this.ChequesAmount += element?.receiptAmount || 0;
  rows.push([
    clearDate,
    element?.name,
    element?.referenceNumber,
    chequeAmt,
    chequeDate,
    element?.bankName,
    receiptAmt
  ]);
});
  const chequesAmt =
    // this.commonService.convertAmountToPdfFormat(
      this.commonService.currencyformat(this.ChequesAmount)
    // );

  this.commonService._downloadChequesOnHandReportsPdf(
    reportName,
    rows,
    gridHeaders,
    colWidthHeight,
    'landscape',
    'As On',
    fromDate,
    toDate,
    printOrPdf,
    chequesAmt
  );
}
}
