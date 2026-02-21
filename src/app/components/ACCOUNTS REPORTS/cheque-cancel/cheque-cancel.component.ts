import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonService } from '../../../services/common.service';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PageCriteria } from '../../../Models/pageCriteria';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';
@Component({
  selector: 'app-cheque-cancel',
  imports: [CommonModule,TableModule, FormsModule, NgxDatatableModule, ReactiveFormsModule, BsDatepickerModule],
  standalone: true,
  templateUrl: './cheque-cancel.component.html',
  styleUrl: './cheque-cancel.component.css',
})
export class ChequeCancelComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private datePipe = inject(DatePipe);
  private commonService = inject(CommonService);
  private reportService = inject(AccountingTransactionsService);
  private accReportService = inject(AccountingReportsService);

  FrmChequeCancel!: FormGroup<{
    fromdate: FormGroup<any> | any;
    todate: FormGroup<any> | any;
  }>;

  dpConfig: Partial<BsDatepickerConfig> = {};
  dpConfig1: Partial<BsDatepickerConfig> = {};

  savebutton = 'Generate Report';
  loading = false;
  isLoading = false;
  disablesavebutton = false;

  StartDate!: Date;
  EndDate!: Date;
  validation = false;

  gridData: any[] = [];
  pageCriteria = new PageCriteria();
  showHide = true;
  showicons = false;
  currencysymbol: string;

  constructor() {
    this.currencysymbol = '₹';
    // this.commonService.datePickerPropertiesSetup("currencysymbol");

    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      // this.commonService.datePickerPropertiesSetup("dateInputFormat"),
      containerClass: 'theme-dark-blue',
      // this.commonService.datePickerPropertiesSetup("containerClass"),
      showWeekNumbers: false,
      maxDate: new Date()
    };

    this.dpConfig1 = {
      ...this.dpConfig,
      minDate: new Date()
    };
  }

  ngOnInit(): void {
    this.FrmChequeCancel = this.fb.group({
      fromdate: [new Date(), Validators.required],
      todate: [new Date(), Validators.required]
    });

    this.setPageModel();
  }

  get f() {
    return this.FrmChequeCancel.controls;
  }

  private updateDates() {
    this.StartDate = this.f.fromdate.value;
    this.EndDate = this.f.todate.value;
    this.validation = this.StartDate > this.EndDate;
  }

  FromDateChange(date: Date) {
    this.dpConfig.maxDate = date;
    this.updateDates();

    if (this.validation) {
      this.commonService.showWarningMessage('From date cannot be greater than To date');
    }
  }

  ToDateChange(date: Date) {
    this.dpConfig1.minDate = date;
    this.updateDates();
  }

  setPageModel() {
    this.pageCriteria.pageSize = this.commonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }

  onFooterPageChange(event: any): void {
    this.pageCriteria.offset = event.page - 1;
    this.pageCriteria.CurrentPage = event.page;
  }

  GetChequeCancelDetails() {
    // if (this.validation) return;
    debugger;

    const startdate = this.commonService.getFormatDateNormal(this.f.fromdate.value);
    const enddate = this.commonService.getFormatDateNormal(this.f.todate.value);

    this.loading = this.isLoading = true;
    this.savebutton = 'Processing';
    this.disablesavebutton = true;

    this.reportService.GetChequeCancelDetails(startdate, enddate,'accounts','global','KAPILCHITS','KLC01').subscribe({
      next: (res: any[]) => {
        this.gridData = res || [];
        this.showicons = this.gridData.length > 0;

        this.pageCriteria.totalrows = this.gridData.length;
        this.pageCriteria.currentPageRows = Math.min(this.pageCriteria.pageSize, this.gridData.length);

        this.showHide = false;
      },
      error: (err) => this.commonService.showErrorMessage(err),
      complete: () => {
        this.loading = this.isLoading = false;
        this.savebutton = 'Generate Report';
        this.disablesavebutton = false;
      }
    });
  }

  export(): void {
    const rows = this.gridData.map(element => ({
      "Cancel Date": this.commonService.getFormatDateGlobal(element.pdepositeddate),
      "Cheque No.": element.preferencenumber,
      "Cheque Amt.": this.commonService.convertAmountToPdfFormat(
        this.commonService.currencyformat(element.ptotalreceivedamount || 0)
      ),
      "Bank Name": element.pbankname,
      "Receipt No.": element.preceiptid,
      "Receipt Date": this.commonService.getFormatDateGlobal(element.pchequedate),
      "Particulars": element.pparticulars
    }));

    this.commonService.exportAsExcelFile(rows, 'Cheque_Cancel');
  }

  pdfOrprint(printorpdf: 'Pdf' | 'Print') {
    const fromDate = this.commonService.getFormatDateGlobal(this.f.fromdate.value);
    const toDate = this.commonService.getFormatDateGlobal(this.f.todate.value);

    const rows = this.gridData.map(e => ([
      this.commonService.getFormatDateGlobal(e.depositedDate),
      e.referenceNumber,
      this.commonService.currencyformat(e.totalReceivedAmount),
      e.bankName,
      e.receiptNumber,
      this.commonService.getFormatDateGlobal(e.receiptDate),
      e.particulars
    ]));

    const headers = ["Cancel Date", "Cheque No.", "Cheque Amt.", "Bank Name", "Receipt No.", "Receipt Date", "Particulars"];

    this.accReportService._ChequeReturnCancelReportsPdf(
      "Cheque Cancel",
      rows,
      headers,
      {},
      "landscape",
      "Between",
      fromDate,
      toDate,
      printorpdf
    );
  }

}
