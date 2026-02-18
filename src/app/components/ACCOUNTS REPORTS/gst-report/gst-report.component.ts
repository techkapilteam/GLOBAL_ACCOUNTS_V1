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
}


