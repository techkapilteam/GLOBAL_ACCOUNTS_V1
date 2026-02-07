import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
    this.setDummyLedgers();
    this.loginbranchschema = 'DUMMY_SCHEMA';
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
      fromdate: [today],
      todate: [today]
    });
    this.gstReportType('receipts');
    this.blurEventAllControls(this.GstReportForm);
  }

  setPageModel() {
    this.pageCriteria.pageSize = 10;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }

  setDummyLedgers() {
    this.ledgeraccountslist = [
      { pledgername: 'GST Sales Ledger' },
      { pledgername: 'GST Purchase Ledger' },
      { pledgername: 'GST Output Ledger' }
    ];
  }

  gstReportType(value: string) {
    this.showreceipts = value === 'receipts';
    this.showpayments = value === 'payments';
    this.showhidegstreport = false;
    this.showhidegstsummary = false;
    this.showicons = false;
  }

  ledgerName_Change(event: any) {
    this.GstReportForm.patchValue({ pledgername: event?.pledgername || '' });
  }

  click_GstReport() {
    this.GstReportDetails = [];
    this.GstSummaryDetails = [];
    this.gstpaymentsdata = [];
    this.showhidegstsummary = false;
    this.showicons = false;

    if (this.showreceipts) {
      this.month = this.datePipe.transform(this.GstReportForm.value.month, "MMM-yyyy");

      this.GstReportDetails = [
        { groupcode: 'CH001', gstnumber: '29ABCDE1234F1Z5', accountname: 'ABC Traders', city: 'Bangalore', state: 'Karnataka', receiptamount: 15000 },
        { groupcode: 'CH002', gstnumber: '27PQRSX5678L1Z2', accountname: 'XYZ Enterprises', city: 'Mumbai', state: 'Maharashtra', receiptamount: 22000 }
      ];

      this.GSTExcel = this.GstReportDetails;
      this.showicons = true;
      this.showhidegstreport = true;

    } else {
      this.gstpaymentsdata = [
        {
          pgstvoucherno: 'GST001',
          vendorname: 'ABC Traders',
          state: 'Telangana',
          gstVoucherDate: new Date(),
          taxableAmount: 10000,
          cgstAmount: 900,
          sgstAmount: 900,
          igstAmount: 0,
          invoice_total_amount: 11800
        }
      ];
    }
  }

  click_GstSummary() {
    this.showhidegstreport = false;
    this.showicons = false;

    // this.GstSummaryDetails = [
    //   { companyname: 'ABC Traders', state: 'Karnataka', count: 5 },
    //   { companyname: 'XYZ Enterprises', state: 'Maharashtra', count: 3 }
    // ];

    this.GSTSummaryExcel = this.GstSummaryDetails;
    this.showhidegstsummary = true;
  }

  checkValidations(group: FormGroup, isValid: boolean): boolean {
    Object.keys(group.controls).forEach(key => {
      isValid = this.getValidationByControl(group, key, isValid);
    });
    return isValid;
  }

  getValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    const control = formGroup.get(key);
    if (!control) return isValid;

    if (control instanceof FormGroup) {
      return this.checkValidations(control, isValid);
    }

    this.GstReportValidationErrors[key] = '';

    if (control.invalid && (control.dirty || control.touched)) {
      isValid = false;
    }
    return isValid;
  }

  blurEventAllControls(group: FormGroup) {
    Object.keys(group.controls).forEach(key => {
      group.get(key)?.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.getValidationByControl(group, key, true));
    });
  }
}


