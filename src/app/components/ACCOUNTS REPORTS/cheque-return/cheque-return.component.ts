import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonService } from '../../../services/common.service';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PageCriteria } from '../../../Models/pageCriteria';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-cheque-return',
  standalone:true,
  imports: [FormsModule,CommonModule,NgxDatatableModule,ReactiveFormsModule,BsDatepickerModule,TableModule],
  templateUrl: './cheque-return.component.html',
  styleUrl: './cheque-return.component.css',
})
export class ChequeReturnComponent implements OnInit {

  private fb = inject(FormBuilder);
  private datePipe = inject(DatePipe);
  private router = inject(Router);
  private commonService = inject(CommonService);
  private accReportService = inject(AccountingReportsService);

  printedDate = true;
  fromDate: Date | null = null;
  toDate: Date | null = null;
  showReport: boolean = false;
  chequeReturnRows: any[] = [];

  FrmChequeReturn!: FormGroup<{
    fromdate: FormControl<Date | null>,
    todate: FormControl<Date | null>
  }>;

  dpConfig: Partial<BsDatepickerConfig> = {};
  dpConfig1: Partial<BsDatepickerConfig> = {};

  savebutton = 'Generate Report';
  loading = false;
  isLoading = false;
  showicons = false;
  showHide = true;
  validation = false;

  StartDate!: string | null;
  EndDate!: string | null;

  gridData: any[] = [];
  currencysymbol!: string;

  pageCriteria = new PageCriteria();

  ngOnInit(): void {
    this.initializeDatePickers();
    this.buildForm();
    this.setPageModel();
    this.updateFormattedDates();
    
  }

  // ------------------ INIT ------------------

  private buildForm() {
    const today = new Date();

    this.FrmChequeReturn = this.fb.group({
      fromdate: [today, Validators.required],
      todate: [today, Validators.required]
    }) as any;
  }

  private initializeDatePickers() {
    this.currencysymbol = String(this.commonService.datePickerPropertiesSetup("currencysymbol"));

    this.dpConfig = {
      dateInputFormat: String(this.commonService.datePickerPropertiesSetup("dateInputFormat")),
      containerClass: String(this.commonService.datePickerPropertiesSetup("containerClass")),
      showWeekNumbers: false,
      maxDate: new Date()
    };

    this.dpConfig1 = {
      ...this.dpConfig
    };
  }

  setPageModel() {
    this.pageCriteria.pageSize = this.commonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }

  get f() {
    return this.FrmChequeReturn.controls;
  }

  updateFormattedDates() {
    this.StartDate = this.datePipe.transform(this.f.fromdate.value, 'dd-MMM-yyyy');
    this.EndDate = this.datePipe.transform(this.f.todate.value, 'dd-MMM-yyyy');
  }

  // ------------------ DUMMY DATA ------------------

  private getDummyChequeReturnData(): any[] {
    return [
      {
        pcleardate: new Date('2026-01-05'),
        preferencenumber: 'CHQ2001',
        ptotalreceivedamount: 9000,
        pbankname: 'HDFC Bank',
        preceiptid: 'RCPT-010',
        pchequedate: new Date('2026-01-02'),
        pparticulars: 'Cheque bounced',
        pbranchname: 'Hyderabad'
      },
      {
        pcleardate: new Date('2026-01-15'),
        preferencenumber: 'CHQ2002',
        ptotalreceivedamount: 12000,
        pbankname: 'SBI',
        preceiptid: 'RCPT-011',
        pchequedate: new Date('2026-01-13'),
        pparticulars: 'Signature mismatch',
        pbranchname: 'Mumbai'
      },
      {
        pcleardate: new Date('2026-01-25'),
        preferencenumber: 'CHQ2003',
        ptotalreceivedamount: 7000,
        pbankname: 'ICICI Bank',
        preceiptid: 'RCPT-012',
        pchequedate: new Date('2026-01-20'),
        pparticulars: 'Funds not available',
        pbranchname: 'Chennai'
      }
    ];
  }

  // ------------------ FETCH REPORT (DUMMY) ------------------

  GetChequeReturnDetails() {
    const from = this.f.fromdate.value!;
    const to = this.f.todate.value!;

    this.loading = this.isLoading = true;
    this.savebutton = 'Processing';
    this.updateFormattedDates();

    setTimeout(() => {
      const allData = this.getDummyChequeReturnData();

      this.gridData = allData.filter(d =>
        new Date(d.pcleardate) >= from &&
        new Date(d.pcleardate) <= to
      );

      this.showicons = this.gridData.length > 0;
      this.showHide = this.gridData.length === 0;

      this.updatePagination();

      this.loading = this.isLoading = false;
      this.savebutton = 'Generate Report';
    }, 800);
  }

  // ------------------ PAGINATION ------------------

  onFooterPageChange(event: any): void {
    this.pageCriteria.offset = event.page - 1;
    this.pageCriteria.CurrentPage = event.page;
  }

  private updatePagination() {
    this.pageCriteria.totalrows = this.gridData.length;
    this.pageCriteria.TotalPages = Math.ceil(this.gridData.length / this.pageCriteria.pageSize);
    this.pageCriteria.currentPageRows = Math.min(this.gridData.length, this.pageCriteria.pageSize);
  }

  // ------------------ EXPORT EXCEL ------------------

  export(): void {
    const rows = this.gridData.map(e => ({
      "Return Date": this.commonService.getFormatDateGlobal(e.pcleardate),
      "Cheque No.": e.preferencenumber,
      "Cheque Amt.": this.commonService.currencyformat(e.ptotalreceivedamount),
      "Bank Name": e.pbankname,
      "Receipt No.": e.preceiptid,
      "Receipt Date": this.commonService.getFormatDateGlobal(e.pchequedate),
      "Particulars": e.pparticulars,
      "Referred By": e.pbranchname
    }));

    this.commonService.exportAsExcelFile(rows, 'Cheque_Return');
  }

  // ------------------ PDF / PRINT ------------------

  pdfOrprint(type: 'Pdf' | 'Print') {

    if (!this.gridData || this.gridData.length === 0) {
      this.commonService.showWarningMessage('No records to export');
      return;
    }

    const rows = this.gridData.map(e => ([
      this.commonService.getFormatDateGlobal(e.pcleardate),
      e.preferencenumber,
      this.commonService.convertAmountToPdfFormat(
        this.commonService.currencyformat(e.ptotalreceivedamount)
      ),
      e.pbankname,
      e.preceiptid,
      this.commonService.getFormatDateGlobal(e.pchequedate),
      e.pparticulars,
      e.pbranchname || '--NA--'
    ]));

    const headers = [
      "Return Date",
      "Cheque No.",
      "Cheque Amt.",
      "Bank Name",
      "Receipt No.",
      "Receipt Date",
      "Particulars",
      "Referred By"
    ];

    this.accReportService._ChequeReturnCancelReportsPdf(
      "Cheque Return",
      rows,
      headers,
      {},
      "landscape",
      "Between",
      this.StartDate ?? '',
      this.EndDate ?? '',
      type   
    );
  }}
