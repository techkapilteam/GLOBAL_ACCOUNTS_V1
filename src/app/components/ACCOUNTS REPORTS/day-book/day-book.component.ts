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
      dfromdate: [new Date()],
      dtodate: [new Date()],
      branch_code: ['']
    });

    this.loginBranchschema = sessionStorage.getItem('loginBranchSchemaname') ?? '';

    this.loadBranches();
    this.setPageModel();
  }

  private loadBranches(): void {
    this.chitService
      .getCAOBranchlist(this.loginBranchschema)
      .subscribe((res: any[]) => this.kgmsBranchList = res || []);
  }

  private setPageModel(): void {
    this.pageCriteria.pageSize = this.commonService.pageSize;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.offset = 0;
  }

  getDayBookData(): void {

    const fromDate = this.commonService.getFormatDateNormal(
      this.dayBookForm.get('dfromdate')?.value 
    )?? '';

    const toDate = this.commonService.getFormatDateNormal(
      this.dayBookForm.value.dtodate
    )?? '';

    this.loading = true;
    this.receiptsAmount = 0;
    this.paymentsAmount = 0;

    this.reportService
      .GetDayBook(fromDate, toDate, 'T')
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
  pdfOrprint(type: 'Pdf' | 'Print'): void {

  if (!this.gridData?.length) {
    return;
  }

  const doc = new jsPDF('landscape');

  const fromDate = this.datePipe.transform(
    this.dayBookForm.value.dfromdate,
    'dd-MMM-yyyy'
  );

  const toDate = this.datePipe.transform(
    this.dayBookForm.value.dtodate,
    'dd-MMM-yyyy'
  );

  doc.setFontSize(14);
  doc.text('Day Book Report', 14, 15);

  doc.setFontSize(10);
  doc.text(`From: ${fromDate}  To: ${toDate}`, 14, 22);

  let startY = 30;

  const rows = this.gridData.map(item => ([
    item.prcpttransactionno ?? '',
    item.prcptparticulars ?? '',
    item.prcptaccountname ?? '',
    item.prcptdebitamount
      ? `${this.currencysymbol} ${Number(item.prcptdebitamount).toFixed(2)}`
      : '',
    item.ptransactionno ?? '',
    item.pparticulars ?? '',
    item.paccountname ?? '',
    item.pcreditamount
      ? `${this.currencysymbol} ${Number(item.pcreditamount).toFixed(2)}`
      : ''
  ]));

  (doc as any).autoTable({
    head: [[
      'Transaction No',
      'Particulars',
      'Type',
      'Amount',
      'Transaction No',
      'Particulars',
      'Type',
      'Amount'
    ]],
    body: rows,
    startY,
    styles: { fontSize: 8 },
    theme: 'grid'
  });

  if (type === 'Pdf') {
    doc.save('DayBookReport.pdf');
  } else {
    window.open(doc.output('bloburl'), '_blank');
  }
}
GetChequeonHandDetails(): void {

  const today = this.commonService.getFormatDateNormal(new Date());

  this.loading = true;

  this.reportTransService
    .GetChequesOnHand(today)
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: (res: any[]) => {

        if (res && res.length > 0) {

          this.gridDataCheques = res;

          this.ChequesAmount = this.gridDataCheques
            .reduce((sum, c) => sum + Number(c.ptotalreceivedamount || 0), 0);

          // this.pdfOrprintChequesOnHand('Pdf');

        } else {
          alert('No Data To Display');
        }
      },
      error: (err) => {
        this.commonService.showErrorMessage(err);
      }
    });

}
}
