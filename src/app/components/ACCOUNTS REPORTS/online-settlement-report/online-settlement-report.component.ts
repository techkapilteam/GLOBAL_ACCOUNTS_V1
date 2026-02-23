import { Component, ViewChild, OnInit, inject } from '@angular/core';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CommonService } from '../../../services/common.service';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';
import { PageCriteria } from '../../../Models/pageCriteria';

@Component({
  selector: 'app-online-settlement',
  standalone: true,
  imports: [BsDatepickerModule, FormsModule, CommonModule, TableModule, ReactiveFormsModule],
  templateUrl: './online-settlement-report.component.html',
  styleUrl: './online-settlement-report.component.css',
})
export class OnlineSettlementReportComponent implements OnInit {
  @ViewChild('myTable') table: any;

  onlinecollectionreportForm!: FormGroup;

  GridData: any[] = [];
  GetUPIClearedData_SummaryReport: any[] = [];

  PaytmList: any[] = [];

  disablesavebutton = false;
  disableviewbutton = false;

  savebutton = 'Show';
  viewbutton = 'View';

  dpConfig: Partial<BsDatepickerConfig> = {};
  dpConfig1: Partial<BsDatepickerConfig> = {};

  pageCriteria = new PageCriteria();

  Amttotal = 0;
  currencysymbol: any;

  constructor(
    private fb: FormBuilder,
    private _commonService: CommonService,
    private _accountingtransaction: AccountingTransactionsService,
    private _legalServices: AccountingReportsService
  ) { }

  ngOnInit(): void {

    this.currencysymbol =
      this._commonService.datePickerPropertiesSetup('currencysymbol');

    this.dpConfig = {
      dateInputFormat:
        this._commonService.datePickerPropertiesSetup('dateInputFormat').toString(),
      containerClass: 'theme-dark-blue',
      // this._commonService.datePickerPropertiesSetup('containerClass'),
      showWeekNumbers: false,
      maxDate: new Date()
    };

    this.dpConfig1 = {
      ...this.dpConfig,
      minDate: new Date()
    };

    this.setPageModel();

    this.onlinecollectionreportForm = this.fb.group({
      fromdate: [new Date(), Validators.required],
      todate: [new Date(), Validators.required],
      paytmname: ['', Validators.required]
    });

    this.loadPaytmList();
  }

  loadPaytmList(): void {
    // this._accountingtransaction
    //   .GetPayTmBanksList(this._commonService.getschemaname())
    //   .subscribe(res => {
    //     this.PaytmList = res || [];
    //   });
    this._accountingtransaction
      .GetPayTmBanksList('accounts','KAPILCHITS','KP')
      .subscribe(res => {
        this.PaytmList = res || [];
      });
  }

  setPageModel(): void {
    this.pageCriteria.pageSize = this._commonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }

  DateChange(event: Date): void {
    this.dpConfig1.minDate = event;
    this.onlinecollectionreportForm.get('todate')?.setValue(new Date());
  }

  Show(): void {

    if (this.onlinecollectionreportForm.invalid) {
      this.onlinecollectionreportForm.markAllAsTouched();
      return;
    }

    this.disablesavebutton = true;
    this.savebutton = 'Processing...';

    const { fromdate, todate, paytmname } =
      this.onlinecollectionreportForm.value;

    const formattedFrom =
      this._commonService.getFormatDateNormal(fromdate);
    const formattedTo =
      this._commonService.getFormatDateNormal(todate);

    this._accountingtransaction
      .GetUPIClearedData_SettlementReport(formattedFrom, formattedTo, paytmname)
      .subscribe({
        next: (res: any) => {

          this.GridData = res?.pchequesOnHandlist || [];
          this.GetUPIClearedData_SummaryReport = this.GridData;

          this.Amttotal = this.GridData.reduce(
            (sum, x) => sum + (x.ptotalreceivedamount || 0),
            0
          );

          this.pageCriteria.totalrows = this.GridData.length;
          this.disablesavebutton = false;
          this.savebutton = 'Show';
        },
        error: () => {
          this.disablesavebutton = false;
          this.savebutton = 'Show';
        }
      });
  }

  export(): void {

    const rows = this.GridData.map(element => ({
      "Chit Receipt No": element.chitReceiptNo,
      "Transaction No": element.transactionNo,
      "Transaction Date":
        this._commonService.getFormatDateGlobal(element.transactiondate),
      "Reference No": element.pChequenumber,
      "Cheque Date":
        this._commonService.getFormatDateGlobal(element.pchequedate),
      "Amount":
        this._commonService.currencyformat(element.ptotalreceivedamount),
      "Chit No.": `${element.chitgroupcode} - ${element.ticketno}`,
      "Receipt Date":
        this._commonService.getFormatDateGlobal(element.preceiptdate),
      "Deposited Date":
        this._commonService.getFormatDateGlobal(element.pdepositeddate),
      "Receipt Id": element.preceiptid,
      "Party": element.ppartyname
    }));

    this._commonService.exportAsExcelFile(rows, 'Online Settlement Report');
  }

  View(): void {

    if (this.onlinecollectionreportForm.invalid) {
      this.onlinecollectionreportForm.markAllAsTouched();
      return;
    }

    this.disableviewbutton = true;
    this.viewbutton = 'Processing...';

    const fromDate =
      this._commonService.getFormatDate1(
        this.onlinecollectionreportForm.value.fromdate
      );

    const toDate =
      this._commonService.getFormatDate1(
        this.onlinecollectionreportForm.value.todate
      );

    this._commonService
      .GetUPIClearedData_SummaryReport(fromDate, toDate)
      .subscribe({
        next: (res: any[]) => {

          if (!res?.length) {
            alert('No data found.');
            this.disableviewbutton = false;
            this.viewbutton = 'View';
            return;
          }

          const excelRows = res.map(element => ({
            "Date":
              this._commonService.getFormatDate1(element.ptransactiondate),
            "Cash Receipt Count": element.pcashreceiptcnt,
            "Cash Settled Count": element.pcashsettlleedcnt,
            "Paytm Receipt Count": element.ppaytmreceiptcnt,
            "Paytm Settled Count": element.ppaytmsettlleedcnt,
            "Cash Receipt Amount": element.pcashreceiptamt,
            "Cash Settled Amount": element.pcashsettlleedamt,
            "Paytm Receipt Amount": element.ppaytmreceiptamt,
            "Paytm Settled Amount": element.ppaytmsettlleedamt,
            "Difference Count": element.pdiffcount,
            "Difference Amount": element.pdiffamount
          }));

          this._commonService.exportAsExcelFile(
            excelRows,
            'Online Settlement Report'
          );

          this.disableviewbutton = false;
          this.viewbutton = 'View';
        },
        error: () => {
          this.disableviewbutton = false;
          this.viewbutton = 'View';
        }
      });
  }
  pdfOrprint(type: 'Pdf' | 'Print'): void {

  if (this.onlinecollectionreportForm.invalid) {
    this.onlinecollectionreportForm.markAllAsTouched();
    return;
  }

  const fromDate = this._commonService.getFormatDateGlobal(
    this.onlinecollectionreportForm.value.fromdate
  );

  const toDate = this._commonService.getFormatDateGlobal(
    this.onlinecollectionreportForm.value.todate
  );

  const selectedId = this.onlinecollectionreportForm.value.paytmname;

  const selectedBank = this.PaytmList?.find(
    x => x.paccountid === selectedId
  );

  const UPI = selectedBank ? `for ${selectedBank.accountName}` : '';

  const reportName = `Online Settlement Report ${UPI}`;

  const gridHeaders = [
    'S No.',
    'Chit Receipt No',
    'Transaction No',
    'Transaction Date',
    'Reference No.',
    'Cheque Date',
    'Amount',
    'Chit No.',
    'Receipt Date',
    'Deposited Date',
    'Receipt Id',
    'Party'
  ];

  const colWidthHeight: any = {
    0: { cellWidth: 'auto', halign: 'center' },
    1: { cellWidth: 'auto', halign: 'center' },
    2: { cellWidth: 'auto', halign: 'center' },
    3: { cellWidth: 'auto', halign: 'center' },
    4: { cellWidth: 'auto', halign: 'left' },
    5: { cellWidth: 'auto', halign: 'center' },
    6: { cellWidth: 'auto', halign: 'right' },
    7: { cellWidth: 'auto', halign: 'center' },
    8: { cellWidth: 'auto', halign: 'center' },
    9: { cellWidth: 'auto', halign: 'center' },
    10: { cellWidth: 'auto', halign: 'center' },
    11: { cellWidth: 'auto', halign: 'left' }
  };

  const rows = this.GridData.map((element, index) => {

    return [
      index + 1,
      element.chitReceiptNo,
      element.transactionNo,
      this._commonService.getFormatDateGlobal(element.transactiondate),
      element.pChequenumber,
      this._commonService.getFormatDateGlobal(element.pchequedate),
      this._commonService.currencyformat(element.ptotalreceivedamount),
      `${element.chitgroupcode}-${element.ticketno}`,
      this._commonService.getFormatDateGlobal(element.preceiptdate),
      this._commonService.getFormatDateGlobal(element.pdepositeddate),
      element.preceiptid,
      element.ppartyname
    ];
  });

  rows.push([
    '',
    '',
    '',
    '',
    '',
    'Grand Total:',
    this._commonService.currencyFormat(this.Amttotal),
    '',
    '',
    '',
    '',
    ''
  ]);

  this._commonService._OnlineSettlementReportPdf(
    reportName,
    rows,
    gridHeaders,
    colWidthHeight,
    'landscape',
    'Between',
    fromDate,
    toDate,
    type,
    ''
  );
}
trackByPaccountId(index: number, bank: any): number {
  return bank.paccountid;
}

}


