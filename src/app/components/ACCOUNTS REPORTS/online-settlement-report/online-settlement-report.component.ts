import { Component, ViewChild, OnInit, inject } from '@angular/core';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDatatableModule, ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CommonService } from '../../../services/common.service';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';
import { PageCriteria } from '../../../Models/pageCriteria';

@Component({
  selector: 'app-online-settlement',
  standalone: true,
  imports: [BsDatepickerModule, FormsModule, NgxDatatableModule, CommonModule,TableModule,ReactiveFormsModule],
  templateUrl: './online-settlement-report.component.html',
  styleUrl: './online-settlement-report.component.css',
})
export class OnlineSettlementReportComponent {
private commonService = inject(CommonService);
  private accountingService = inject(AccountingTransactionsService);
  private reportService = inject(AccountingReportsService);
  private fb = inject(FormBuilder);

  @ViewChild('myTable') table: any;

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  GridData: any[] = [];
  PaytmList: any[] = [];
  Amttotal = 0;

  disablesavebutton = false;
  savebutton = 'Show';

  disableviewbutton = false;
  viewbutton = 'View';

  pageCriteria = new PageCriteria();

  dpConfig: Partial<BsDatepickerConfig> = {};
  dpConfig1: Partial<BsDatepickerConfig> = {};

  onlinecollectionreportFrom!: FormGroup<{
    fromdate: any;
    todate: any;
    paytmname: any;
  }>;

  ngOnInit(): void {
    this.initDatePickers();
    this.initForm();
    this.setPageModel();
    this.loadPaytmBanks();
  }

  initDatePickers() {
    this.dpConfig = {
      dateInputFormat: this.commonService.datePickerPropertiesSetup('dateInputFormat'),
      containerClass: 'theme-dark-blue',
      // this.commonService.datePickerPropertiesSetup('containerClass'),
      showWeekNumbers: false,
      maxDate: new Date()
    };

    this.dpConfig1 = {
      ...this.dpConfig,
      minDate: new Date()
    };
  }

  initForm() {
    this.onlinecollectionreportFrom = this.fb.nonNullable.group({
      fromdate: [new Date(), Validators.required],
      todate: [new Date(), Validators.required],
      paytmname: ['', Validators.required]
    });
  }

  loadPaytmBanks() {
    this.accountingService
      .GetPayTmBanksList(this.commonService.getschemaname())
      .subscribe(res => this.PaytmList = res || []);
  }

  DateChange(date: Date) {
    this.dpConfig1 = { ...this.dpConfig1, minDate: date };
    this.onlinecollectionreportFrom.controls.todate.setValue(new Date());
  }

  Show() {
    if (this.onlinecollectionreportFrom.invalid) {
      this.onlinecollectionreportFrom.markAllAsTouched();
      return;
    }

    this.disablesavebutton = true;
    this.savebutton = 'Processing';

    const { fromdate, todate, paytmname } = this.onlinecollectionreportFrom.value;

    const from = this.commonService.getFormatDateNormal(fromdate);
    const to = this.commonService.getFormatDateNormal(todate);

    this.accountingService
      .GetUPIClearedData_SettlementReport(from, to, paytmname)
      .subscribe({
        next: (res: any) => {
          this.GridData = res?.pchequesOnHandlist ?? [];
          this.calculateTotal();
          this.disablesavebutton = false;
          this.savebutton = 'Show';
        },
        error: () => {
          this.disablesavebutton = false;
          this.savebutton = 'Show';
        }
      });
  }

  calculateTotal() {
    this.Amttotal = this.GridData.reduce((sum, x) => sum + (x.ptotalreceivedamount || 0), 0);
  }

  export(): void {
    const rows = this.GridData.map(element => ({
      "Chit Receipt No": element.chitReceiptNo,
      "Transaction No": element.transactionNo,
      "Transaction Date": this.commonService.getFormatDateGlobal(element.transactiondate),
      "Reference No": element.pChequenumber,
      "Cheque Date": this.commonService.getFormatDateGlobal(element.pchequedate),
      "Amount": this.commonService.currencyformat(element.ptotalreceivedamount),
      "Chit No.": `${element.chitgroupcode} - ${element.ticketno}`,
      "Receipt Date": this.commonService.getFormatDateGlobal(element.preceiptdate),
      "Deposited Date": this.commonService.getFormatDateGlobal(element.pdepositeddate),
      "Receipt Id": element.preceiptid,
      "Party": element.ppartyname
    }));

    this.commonService.exportAsExcelFile(rows, 'Online Settlement Report');
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

  toggleExpandGroup(group: any) {
    this.table?.groupHeader?.toggleExpandGroup(group);
  }

  onDetailToggle(event: any) {
    console.log('Detail Toggled', event);
  }

}


