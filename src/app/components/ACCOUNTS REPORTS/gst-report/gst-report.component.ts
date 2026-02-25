import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonService } from '../../../services/common.service';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import { TDSReportService } from '../../../services/Reports/tds-report.service';
import { PageCriteria } from '../../../Models/pageCriteria';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-gst-report',
  imports: [FormsModule,CommonModule,NgxDatatableModule,ReactiveFormsModule,NgSelectModule,BsDatepickerModule,TableModule],
  templateUrl: './gst-report.component.html',
  styleUrl: './gst-report.component.css',
})
export class GstReportComponent implements OnInit {
  private commonService = inject(CommonService);
  private reportService = inject(AccountingReportsService);
  private tdsReportService = inject(TDSReportService);
  private fb = inject(FormBuilder);
  private datePipe = inject(DatePipe);
  private destroyRef = inject(DestroyRef);

  @ViewChild('myTable') table: any;

  GstReportForm!: FormGroup;

  GstReportDetails: any[] = [];
  GstSummaryDetails: any[] = [];
  GstReportDetailsforAll: any[] = [];
  GSTExcel: any[] = [];
  GSTSummaryExcel: any[] = [];
  ledgeraccountslist: any[] = [];
  gstpaymentsdata: any[] = [];

  GstReportValidationErrors: any = {};
  currencysymbol: any;
  month: any;

  showicons = false;
  showhidegstreport = false;
  showhidegstsummary = false;
  showreceipts = true;
  showpayments = false;
  disablesavebutton = false;
  savebutton = "GST Print";
  loginbranchschema: any;

  pageCriteria = new PageCriteria();

  dpConfig: Partial<BsDatepickerConfig> = {};
  dpConfig1: Partial<BsDatepickerConfig> = {};
  dpConfig2: Partial<BsDatepickerConfig> = {};

  ngOnInit(): void {
    this.initDatePickers();
    this.setPageModel();
    this.buildForm();
    // this.setDummyLedgers();
    this.getLedger();
    this.loginbranchschema = sessionStorage.getItem('loginBranchSchemaname');
  }

  initDatePickers() {
    this.dpConfig = { dateInputFormat: 'MM/YYYY', containerClass: 'theme-default', showWeekNumbers: false, maxDate: new Date() };
    this.dpConfig1 = { dateInputFormat: 'DD/MM/YYYY', containerClass: 'theme-default', showWeekNumbers: false, maxDate: new Date() };
    this.dpConfig2 = { ...this.dpConfig1 };
    this.currencysymbol = '₹';
  }

  buildForm() {
    const today = new Date();
    const firstday = new Date(today.getFullYear(), today.getMonth(), 1);

    this.GstReportForm = this.fb.group({
      month: [firstday, Validators.required],
      pledgerid: [null, Validators.required],
      pledgername: [''],
      receiptsPayments: ['receipts'],
      fromdate: [today,Validators.required],
      todate: [today,Validators.required]
    },{ validators: this.dateRangeValidator() });
    this.gstReportType('receipts');
  }
  dateRangeValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {

   
    if (!this.showpayments) return null;

    const from = group.get('fromdate')?.value;
    const to = group.get('todate')?.value;

    if (!from || !to) return null;

    const fromTime = new Date(from).setHours(0,0,0,0);
    const toTime = new Date(to).setHours(0,0,0,0);

    return fromTime > toTime
      ? { dateRangeInvalid: true }
      : null;
  };
}

  setPageModel() {
    this.pageCriteria.pageSize = 10;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }

  // setDummyLedgers() {
  //   this.ledgeraccountslist = [
  //     { pledgername: 'GST Sales Ledger' },
  //     { pledgername: 'GST Purchase Ledger' },
  //     { pledgername: 'GST Output Ledger' }
  //   ];
  // }
  // getLedger() {
  //   this.reportService.GetGstLedgerAccountList('GST REPORT')
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe({
  //       next: res => this.ledgeraccountslist = res ?? [],
  //       error: err => this.commonService.showErrorMessage(err)
  //     });
  // }
  getLedger() {
    this.reportService.GetGstLedgerAccountList('GST REPORT','accounts','KAPILCHITS','KLC01')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => this.ledgeraccountslist = res ?? [],
        error: err => this.commonService.showErrorMessage(err)
      });
  }

  // gstReportType(value: string) {
  //   this.showreceipts = value === 'receipts';
  //   this.showpayments = value === 'payments';
  //   this.showhidegstreport = false;
  //   this.showhidegstsummary = false;
  //   this.showicons = false;
  // }

  ledgerName_Change(event: any) {
    this.GstReportForm.patchValue({ pledgername: event?.pledgername || '' });
  }

  click_GstReport(): void {

  this.GstReportDetails = [];
  this.GstSummaryDetails = [];
  this.GstReportDetailsforAll = [];

  if (this.showreceipts) {

    if (this.GstReportForm.invalid) {
      this.GstReportForm.markAllAsTouched();
      return;
    }

    this.disablesavebutton = true;
    this.savebutton = 'Processing';

    const fromdate: Date = this.GstReportForm.value.month;
    const ledgername = this.GstReportForm.value.pledgerid;

    const todate = new Date(fromdate.getFullYear(), fromdate.getMonth() + 1, 0);
    const from = this.commonService.getFormatDateNormal(fromdate);
    const to = this.commonService.getFormatDateNormal(todate);

    this.month = this.datePipe.transform(fromdate, 'MMM-yyyy');

    this.tdsReportService
      .getGstReportDetails(from, to, 'GST REPORT', ledgername)
      .subscribe({
        next: (res: any[]) => {

          if (ledgername === 'ALL') {
            this.handleSingleLedgerReport(res);
          } else {
            this.handleSingleLedgerReport(res);
          }

          this.disablesavebutton = false;
          this.savebutton = 'GST Print';
        },
        error: () => {
          this.disablesavebutton = false;
          this.savebutton = 'GST Print';
        }
      });

  } else {
    this.loadGstPayments();
  }
}
private handleSingleLedgerReport(res: any[]): void {

  this.GstReportDetails = res ?? [];
  this.GSTExcel = res ?? [];

  this.showicons = this.GstReportDetails.length > 0;
  this.showhidegstreport = true;
  this.showhidegstsummary = false;

  this.cleanObjectValues(this.GstReportDetails);
  this.updatePagination(this.GstReportDetails.length);
}
private cleanObjectValues(data: any[]): void {
  data.forEach(item => {
    Object.keys(item).forEach(key => {
      if (JSON.stringify(item[key]) === '{}') {
        item[key] = '';
      }
    });
  });
}
private loadGstPayments(): void {

  this.disablesavebutton = true;
  this.savebutton = 'Processing';
  this.gstpaymentsdata = [];

  const fromdate = this.commonService.getFormatDateNormal(this.GstReportForm.value.fromdate);
  const todate = this.commonService.getFormatDateNormal(this.GstReportForm.value.todate);
  const branchschema = this.loginbranchschema;

  this.tdsReportService.Getgstreport(branchschema, fromdate, todate)
    .subscribe({
      next: (result: any[]) => {
        this.gstpaymentsdata = result ?? [];
        this.updatePagination(this.gstpaymentsdata.length);
        this.disablesavebutton = false;
        this.savebutton = 'GST Print';
      },
      error: () => {
        this.disablesavebutton = false;
        this.savebutton = 'GST Print';
      }
    });
}
click_GstSummary(): void {

  this.GstReportDetails = [];
  this.GstSummaryDetails = [];

  if (!this.showreceipts) {
    this.commonService.showWarningMessage('No data');
    return;
  }

  if (this.GstReportForm.invalid) {
    this.GstReportForm.markAllAsTouched();
    return;
  }

  const fromdate: Date = this.GstReportForm.value.month;
  const todate = new Date(fromdate.getFullYear(), fromdate.getMonth() + 1, 0);

  const from = this.commonService.getFormatDateNormal(fromdate);
  const to = this.commonService.getFormatDateNormal(todate);
  const ledgername = this.GstReportForm.value.pledgerid;

  this.month = this.datePipe.transform(fromdate, 'MMM-yyyy');

  this.tdsReportService
    .getGstReportDetails(from, to, 'GST SUMMARY', ledgername)
    .subscribe((res: any[]) => {

      this.GstSummaryDetails = res ?? [];
      this.GSTSummaryExcel = res ?? [];

      this.showicons = this.GstSummaryDetails.length > 0;
      this.showhidegstreport = false;
      this.showhidegstsummary = true;

      this.updatePagination(this.GstSummaryDetails.length);
    });
}
private updatePagination(totalRows: number): void {

  this.pageCriteria.totalrows = totalRows;
  this.pageCriteria.TotalPages = Math.ceil(totalRows / this.pageCriteria.pageSize);

  this.pageCriteria.currentPageRows =
    totalRows < this.pageCriteria.pageSize
      ? totalRows
      : this.pageCriteria.pageSize;
}
gstReportType(type: string): void {

  this.GstReportDetails = [];
  this.GstSummaryDetails = [];
  this.gstpaymentsdata = [];
  this.showhidegstreport = false;

  if (type === 'receipts') {

    this.showreceipts = true;
    this.showpayments = false;

    this.GstReportForm.get('pledgerid')?.setValidators([Validators.required]);
    this.GstReportForm.get('fromdate')?.clearValidators();
    this.GstReportForm.get('todate')?.clearValidators();

  } else {

    this.showpayments = true;
    this.showreceipts = false;

    this.GstReportForm.patchValue({
      fromdate: new Date(),
      todate: new Date(),
      pledgerid: null
    });

    this.GstReportForm.get('fromdate')?.setValidators([Validators.required]);
    this.GstReportForm.get('todate')?.setValidators([Validators.required]);
    this.GstReportForm.get('pledgerid')?.clearValidators();
  }

  this.GstReportForm.updateValueAndValidity();
}
pdfOrprintGstSummary(printorpdf: 'Pdf' | 'Print'): void {

  const rows: any[] = [];
  const reportname = 'GST Summary';

  const gridheaders = [
    'Company',
    'State',
    'Trans Type',
    'From No.',
    'To No.',
    'Count'
  ];

  const colWidthHeight = {
    0: { cellWidth: 'auto', halign: 'left' },
    1: { cellWidth: 'auto', halign: 'left' },
    2: { cellWidth: 'auto', halign: 'left' },
    3: { cellWidth: 'auto', halign: 'left' },
    4: { cellWidth: 'auto', halign: 'left' },
    5: { cellWidth: 'auto', halign: 'left' }
  };

  this.GstSummaryDetails?.forEach(element => {
    rows.push([
      element.companyname,
      element.state,
      element.transtype,
      element.transactionfrom,
      element.transactionto,
      element.count
    ]);
  });

  this.commonService.downloadgstsummarypdf(
    reportname,
    this.month,
    rows,
    gridheaders,
    colWidthHeight,
    'a4',
    printorpdf
  );
}
pdfOrprint(printorpdf: 'Pdf' | 'Print'): void {

  const rows: any[] = [];
  const reportname = 'GST Report';

  const gridheaders = [
    'Chit No.', 'GST No.', 'Name', 'Area', 'City', 'State',
    'Subscriber Address', 'Transaction Date', 'Transaction No.',
    'Taxable Amount', 'IGST', 'CGST', 'SGST'
  ];

  const colWidthHeight = {
    0: { cellWidth: 20, halign: 'left' },
    1: { cellWidth: 20, halign: 'left' },
    2: { cellWidth: 23, halign: 'left' },
    3: { cellWidth: 22, halign: 'left' },
    4: { cellWidth: 23, halign: 'left' },
    5: { cellWidth: 18, halign: 'left' },
    6: { cellWidth: 'auto', halign: 'center' },
    7: { cellWidth: 'auto', halign: 'center' },
    8: { cellWidth: 'auto', halign: 'center' },
    9: { cellWidth: 15, halign: 'right' },
    10: { cellWidth: 15, halign: 'right' },
    11: { cellWidth: 15, halign: 'right' },
    12: { cellWidth: 15, halign: 'right' }
  };

  const returnGridData = this.commonService._getGroupingGridExportData(
    this.GstReportDetails,
    'parentname',
    false
  );

  returnGridData?.forEach((element: { gstnumber: string; chitreceiptdate: any; receiptamount: any; igstamount: any; cgstamount: any; sgstamount: any; group: undefined; groupcode: any; accountname: any; area: any; city: any; state: any; guarantoraddress: any; receiptnumber: any; }) => {

    const gstNumber =
      element.gstnumber && element.gstnumber !== '[object Object]'
        ? element.gstnumber
        : '--NA--';

    const transactionDate = element.chitreceiptdate
      ? this.commonService.getFormatDateGlobal(element.chitreceiptdate)
      : '';

    const taxableAmount = this.commonService.convertAmountToPdfFormat(
      this.commonService.currencyformat(Number(element.receiptamount || 0))
    );

    const igstAmount = this.commonService.convertAmountToPdfFormat(
      this.commonService.currencyformat(Number(element.igstamount || 0))
    );

    const cgstAmount = this.commonService.convertAmountToPdfFormat(
      this.commonService.currencyformat(Number(element.cgstamount || 0))
    );

    const sgstAmount = this.commonService.convertAmountToPdfFormat(
      this.commonService.currencyformat(Number(element.sgstamount || 0))
    );

    let temp: any[];

    if (element.group !== undefined) {
      temp = [
        element.group,
        element.groupcode,
        gstNumber,
        element.accountname,
        element.area,
        element.city,
        element.state,
        element.guarantoraddress,
        transactionDate,
        element.receiptnumber,
        taxableAmount,
        igstAmount,
        cgstAmount,
        sgstAmount
      ];
    } else if (element.groupcode && element.accountname) {
      temp = [
        element.groupcode,
        gstNumber,
        element.accountname,
        element.area,
        element.city,
        element.state,
        element.guarantoraddress,
        transactionDate,
        element.receiptnumber,
        taxableAmount,
        igstAmount,
        cgstAmount,
        sgstAmount
      ];
    } else {
      temp = [
        '', '', '', '', '', '', '', '',
        'Total',
        taxableAmount,
        igstAmount,
        cgstAmount,
        sgstAmount
      ];
    }

    rows.push(temp);
  });

  const grandtotal1 = this.GstReportDetails
    .reduce((sum, c) => sum + Number(c.receiptamount || 0), 0)
    .toFixed(2);

  const grandtotal2 = this.GstReportDetails
    .reduce((sum, c) => sum + Number(c.igstamount || 0), 0)
    .toFixed(2);

  const grandtotal3 = this.GstReportDetails
    .reduce((sum, c) => sum + Number(c.cgstamount || 0), 0)
    .toFixed(2);

  const grandtotal4 = this.GstReportDetails
    .reduce((sum, c) => sum + Number(c.sgstamount || 0), 0)
    .toFixed(2);

  const totalRow = [
    '', '', '', '', '', '', '', '',
    'Grand Total',
    this.commonService.convertAmountToPdfFormat(this.commonService.currencyFormat(grandtotal1)),
    this.commonService.convertAmountToPdfFormat(this.commonService.currencyFormat(grandtotal2)),
    this.commonService.convertAmountToPdfFormat(this.commonService.currencyFormat(grandtotal3)),
    this.commonService.convertAmountToPdfFormat(this.commonService.currencyFormat(grandtotal4))
  ];

  rows.push(totalRow);

  this.commonService.downloadgstprintpdf(
    reportname,
    this.month,
    rows,
    gridheaders,
    colWidthHeight,
    'landscape',
    printorpdf
  );
}
exportSummary(): void {

  const rows: any[] = [];

  this.GstSummaryDetails?.forEach(element => {
    rows.push({
      Company: element.companyname,
      State: element.state,
      'Transaction Type': element.transtype,
      'From No.': element.transactionfrom,
      'To No.': element.transactionto,
      Count: element.count
    });
  });

  this.commonService.exportAsExcelFile(rows, 'GSTSummary');
}
export(): void {

  const rows: any[] = [];

  this.GstReportDetails?.forEach(element => {

    const gstnumber =
      element.gstnumber && element.gstnumber !== '[object Object]'
        ? element.gstnumber
        : '--NA--';

    const datereceipt = element.chitreceiptdate
      ? this.commonService.getFormatDateGlobal(element.chitreceiptdate)
      : '';

    rows.push({
      'Parent Name': element.parentname,
      'GSTNo.': gstnumber,
      'Chit No.': element.groupcode,
      Name: element.accountname,
      Area: element.area,
      City: element.city,
      State: element.state,
      'Subscriber Name': element.guarantoraddress,
      'Transaction Date': datereceipt,
      'Transaction No.': element.receiptnumber,
      'Taxable Amount': Number(element.receiptamount || 0),
      IGST: Number(element.igstamount || 0),
      CGST: Number(element.cgstamount || 0),
      SGST: Number(element.sgstamount || 0)
    });
  });

  this.commonService.exportAsExcelFile(rows, 'GST');
}
}


