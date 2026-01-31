import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonService } from '../../../services/common.service';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PageCriteria } from '../../../Models/pageCriteria';

@Component({
  selector: 'app-cheque-cancel',
  imports: [CommonModule, FormsModule, NgxDatatableModule, ReactiveFormsModule, BsDatepickerModule],
  standalone: true,
  templateUrl: './cheque-cancel.component.html',
  styleUrl: './cheque-cancel.component.css',
})
export class ChequeCancelComponent implements OnInit {
  private fb = inject(FormBuilder);
  private commonService = inject(CommonService);
  private accReportService = inject(AccountingReportsService);
  private datePipe = inject(DatePipe);
  FrmChequeCancel!: FormGroup;

  dpConfig: Partial<BsDatepickerConfig> = {};
  dpConfig1: Partial<BsDatepickerConfig> = {};

  loading = false;
  disablesavebutton = false;
  savebutton = 'Generate Report';


  gridData: any[] = [];
  pageCriteria = new PageCriteria();
  showHide = true;
  showicons = false;
  reportDateRange = '';
  currencysymbol: string;
  StartDate: Date | null = null;
  EndDate: Date | null = null;

  constructor() {
    this.currencysymbol = this.commonService.datePickerPropertiesSetup("currencysymbol") as string;

    this.dpConfig = {
      dateInputFormat: 'DD-MM-YYYY',
      containerClass: 'theme-default',
      maxDate: new Date()
    };

    this.dpConfig1 = { ...this.dpConfig };
  }

  ngOnInit(): void {
    this.FrmChequeCancel = this.fb.group({
      fromdate: [new Date(), Validators.required],
      todate: [new Date(), Validators.required]
    });

    this.pageCriteria.pageSize = 10;
  }

  get f() { return this.FrmChequeCancel.controls; }

  private getDummyChequeCancelData(): any[] {
    return [
      { pdepositeddate: new Date('2026-01-05'), preferencenumber: 'CHQ1001', ptotalreceivedamount: 12500, pbankname: 'HDFC Bank', preceiptid: 'RCPT-001', pchequedate: new Date('2026-01-02'), pparticulars: 'Signature mismatch' },
      { pdepositeddate: new Date('2026-01-15'), preferencenumber: 'CHQ1002', ptotalreceivedamount: 8400, pbankname: 'ICICI Bank', preceiptid: 'RCPT-002', pchequedate: new Date('2026-01-14'), pparticulars: 'Insufficient funds' },
      { pdepositeddate: new Date('2026-01-25'), preferencenumber: 'CHQ1003', ptotalreceivedamount: 15000, pbankname: 'SBI', preceiptid: 'RCPT-003', pchequedate: new Date('2026-01-22'), pparticulars: 'Account closed' }
    ];
  }
  updateFormattedDates() {
    this.StartDate = this.f['fromdate'].value ? new Date(this.f['fromdate'].value) : null;
    this.EndDate = this.f['todate'].value ? new Date(this.f['todate'].value) : null;
  }

  GetChequeCancelDetails() {
    const fromRaw = this.f['fromdate'].value;
    const toRaw = this.f['todate'].value;
    if (!fromRaw || !toRaw) return

    const fromDate = new Date(fromRaw);
    const toDate = new Date(toRaw);

    this.StartDate = fromDate;
    this.EndDate = toDate;

    this.loading = true;
    this.disablesavebutton = true;
    this.savebutton = 'Processing...';

    setTimeout(() => {
      const allData = this.getDummyChequeCancelData();

      this.gridData = allData.filter(d =>
        new Date(d.pdepositeddate) >= fromDate &&
        new Date(d.pdepositeddate) <= toDate
      );

      // this.reportDateRange = `Between : ${this.commonService.getFormatDateGlobal(fromDate)} And ${this.commonService.getFormatDateGlobal(toDate)}`;

      this.showicons = this.gridData.length > 0;
      this.showHide = this.gridData.length === 0;
      this.pageCriteria.totalrows = this.gridData.length;

      this.loading = false;
      this.disablesavebutton = false;
      this.savebutton = 'Generate Report';
    }, 800);
  }

  export(): void {

    if (!this.gridData || this.gridData.length === 0) {
      this.commonService.showWarningMessage('No records to export');
      return;
    }

    const rows = this.gridData.map(e => ({
      "Return Date": this.commonService.getFormatDateGlobal(e.pcleardate),
      "Cheque No.": e.preferencenumber,
      "Cheque Amt.": this.commonService.currencyformat(e.ptotalreceivedamount),
      "Bank Name": e.pbankname,
      "Receipt No.": e.preceiptid,
      "Receipt Date": this.commonService.getFormatDateGlobal(e.pchequedate),
      "Particulars": e.pparticulars,
      "Referred By": e.pbranchname || '--NA--'
    }));

    this.commonService.exportAsExcelFile(rows, 'Cheque_Cancel');
  }


  pdfOrprint(type: 'pdf' | 'print') {

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
      "Cancel Date",
      "Cheque No.",
      "Cheque Amt.",
      "Bank Name",
      "Receipt No.",
      "Receipt Date",
      "Particulars",
      "Referred By"
    ];

    this.accReportService._ChequeReturnCancelReportsPdf(
      "Cheque Cancel",
      rows,
      headers,
      {},
      "landscape",
      "Between",
      this.StartDate ? this.datePipe.transform(this.StartDate, 'dd-MM-yyyy') ?? '' : '',
      this.EndDate ? this.datePipe.transform(this.EndDate, 'dd-MM-yyyy') ?? '' : '',
      type
    );
  }


}
