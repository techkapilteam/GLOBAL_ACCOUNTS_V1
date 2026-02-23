import { CommonModule, DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Table, TableModule } from 'primeng/table';
import { CommonService } from '../../../services/common.service';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';

@Component({
  selector: 'app-trial-balance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    NgxDatatableModule, TableModule
  ],
  providers: [DatePipe],
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.css']
})
export class TrialBalanceComponent {

  TrialBalanceForm!: FormGroup;

  currencysymbol!: string;
  groupType = 'BETWEEN';
  showhideason = true;
  datelabel = 'From Date';
  showhidetable = false;
  dataisempty = false;
  totalcreditamount = 0;
  totaldebitamount = 0;
  TrialBalanceDifference = false;
  difference = 0;
  savebutton = 'Generate Report';
  withgrouping = false;

  fromdate!: Date;
  todate!: Date;

  Trialbalancelst: any[] = [];

  dpConfig: Partial<BsDatepickerConfig> = {};
  dppConfig: Partial<BsDatepickerConfig> = {};

  @ViewChild('dt') table!: Table;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private accountingService: AccountingReportsService
  ) {}

  ngOnInit(): void {

    this.currencysymbol = '₹',
      // this.commonService.datePickerPropertiesSetup('currencysymbol');

    this.dpConfig = {
      dateInputFormat:'DD-MMM-YYYY',
        // this.commonService.datePickerPropertiesSetup('dateInputFormat'),
      containerClass: 'theme-dark-blue',
        // this.commonService.datePickerPropertiesSetup('containerClass'),
      showWeekNumbers: false,
      maxDate: new Date()
    };

    this.dppConfig = {
      dateInputFormat:'DD-MMM-YYYY',
        // this.commonService.datePickerPropertiesSetup('dateInputFormat'),
      containerClass:'theme-dark-blue',
        // this.commonService.datePickerPropertiesSetup('containerClass'),
      showWeekNumbers: false,
      maxDate: new Date(),
      minDate: new Date()
    };

    this.fromdate = new Date();
    this.todate = new Date();

    this.TrialBalanceForm = this.fb.group({
      fromdate: [this.fromdate],
      todate: [this.todate],
      grouptype: ['BETWEEN']
    });

    this.GetTrialBalance(this.fromdate, this.todate, this.groupType);
  }

  checkboxChecked(event: any) {
    if (event.target.checked) {
      this.groupType = 'ASON';
      this.showhideason = false;
      this.datelabel = 'Date';
    } else {
      this.groupType = 'BETWEEN';
      this.showhideason = true;
      this.datelabel = 'From Date';
    }

    this.TrialBalanceForm.patchValue({
      grouptype: this.groupType,
      fromdate: new Date(),
      todate: new Date()
    });
  }

  withGrouping(event: any) {
    this.withgrouping = event.target.checked;
  }

  DateChange(event: Date) {
    this.dppConfig = {
      ...this.dppConfig,
      minDate: event
    };
  }

  GenerateReport() {

    this.savebutton = 'Processing...';

    const fromdate = this.TrialBalanceForm.value.fromdate;
    const todate =
      this.groupType === 'ASON'
        ? fromdate
        : this.TrialBalanceForm.value.todate;

    this.GetTrialBalance(fromdate, todate, this.groupType);
  }

  GetTrialBalance(fromdate: Date, todate: Date, grouptype: string) {

    const fdate = this.commonService.getFormatDateNormal(fromdate)??'';
    const tdate = this.commonService.getFormatDateNormal(todate)??'';

    this.accountingService
      .GetTrialBalanceData(fdate, tdate, grouptype,'accounts','KAPILCHITS','KLC01','global')
      .subscribe({
        next: (res: any[]) => {
          this.Trialbalancelst = res.filter(
            x => !(x.pdebitamount === 0 && x.pcreditamount === 0)
          );

          if (this.Trialbalancelst.length > 0) {
            this.TrialBalanceTotalCalculations();
            this.showhidetable = true;
            this.dataisempty = false;
          } else {
            this.totalcreditamount = 0;
            this.totaldebitamount = 0;
            this.showhidetable = false;
            this.dataisempty = true;
          }

          this.savebutton = 'Generate Report';
        },
        error: (err) => {
          this.commonService.showErrorMessage(err);
          this.savebutton = 'Generate Report';
        }
      });
  }

  TrialBalanceTotalCalculations() {

    this.totaldebitamount = this.Trialbalancelst
      .reduce((sum, c) => sum + c.pdebitamount, 0);

    this.totalcreditamount = this.Trialbalancelst
      .reduce((sum, c) => sum + c.pcreditamount, 0);

    if (
      Math.round(this.totaldebitamount * 100) !==
      Math.round(this.totalcreditamount * 100)
    ) {
      this.TrialBalanceDifference = true;
      this.difference = Math.abs(
        this.totaldebitamount - this.totalcreditamount
      );
    } else {
      this.TrialBalanceDifference = false;
    }
  }

  export(): void {

    const rows = this.Trialbalancelst.map(element => ({
      Type: element.pparentname,
      Particulars: element.paccountname,
      Debit:
        element.pdebitamount !== 0
          ? this.commonService.currencyformat(element.pdebitamount)
          : '',
      Credit:
        element.pcreditamount !== 0
          ? this.commonService.currencyformat(element.pcreditamount)
          : ''
    }));

    this.commonService.exportAsExcelFile(rows, 'TrialBalance');
  }
 pdfOrprint(printOrpdf: 'Print' | 'Pdf'): void {
  if (this.withgrouping) {
    this.generateGroupedReport(printOrpdf);
  } else {
    this.generateNormalReport(printOrpdf);
  }
}

private generateGroupedReport(printOrpdf: 'Print' | 'Pdf'): void {
  const rows: any[] = [];
  const reportName = 'Trial Balance';
  const gridHeaders = ['Particulars', 'Debit', 'Credit'];

  const fromDate = this.commonService.getFormatDateGlobal(
    this.TrialBalanceForm.controls['fromdate'].value
  );

  const toDate = this.commonService.getFormatDateGlobal(
    this.TrialBalanceForm.controls['todate'].value
  );

  const colWidthHeight = {
    paccountname: { cellWidth: 'auto' },
    pdebitamount: { cellWidth: 'auto' },
    pcreditamount: { cellWidth: 'auto' }
  };

  const returnGridData =
    this.commonService._groupwiseSummaryExportDataTrialBalance(
      this.Trialbalancelst,
      'pparentname',
      'pdebitamount',
      'pcreditamount'
    );

  returnGridData?.forEach((element: any) => {
    const debitAmount = this.formatAmount(element?.pdebitamount);
    const creditAmount = this.formatAmount(element?.pcreditamount);

    const row =
      element?.group !== undefined
        ? [element.group, element.paccountname, debitAmount, creditAmount]
        : [element.paccountname, debitAmount, creditAmount];

    rows.push(row);
  });

  this.pushTotals(rows);

  this.commonService._downloadTrialBalanceReportsPdf(
    reportName,
    rows,
    gridHeaders,
    colWidthHeight,
    'a4',
    this.getGroupType(),
    fromDate,
    toDate,
    printOrpdf,
    this.getGridTotals()
  );
}

private generateNormalReport(printOrpdf: 'Print' | 'Pdf'): void {
  const rows: any[] = [];
  const reportName = 'Trial Balance';
  const gridHeaders = ['Particulars', 'Debit', 'Credit'];

  const fromDate = this.commonService.getFormatDateGlobal(
    this.TrialBalanceForm.controls['fromdate'].value
  );

  const toDate = this.commonService.getFormatDateGlobal(
    this.TrialBalanceForm.controls['todate'].value
  );

  const colWidthHeight = {
    paccountname: { cellWidth: 'auto' },
    pdebitamount: { cellWidth: 'auto' },
    pcreditamount: { cellWidth: 'auto' }
  };

  this.Trialbalancelst?.forEach((element: any) => {
    rows.push([
      element?.paccountname,
      this.formatAmount(element?.pdebitamount),
      this.formatAmount(element?.pcreditamount)
    ]);
  });

  this.pushTotals(rows);

  this.commonService._downloadTrialBalanceReportsPdf(
    reportName,
    rows,
    gridHeaders,
    colWidthHeight,
    'a4',
    this.getGroupType(),
    fromDate,
    toDate,
    printOrpdf,
    this.getGridTotals()
  );
}


private formatAmount(value: number | null | undefined): string {
  if (!value) return '';

  let amount = this.commonService.currencyFormat(parseFloat(value.toString()));
  amount = this.commonService.convertAmountToPdfFormat(amount);

  const decimal = amount.split('.')[1];

  if (!decimal) return amount + '.00';
  if (decimal.length === 1) return amount + '0';

  return amount;
}

private getGroupType(): string {
  return this.groupType === 'BETWEEN' ? 'Between' : 'As On';
}

private getGridTotals(): any {
  const debitTotal = this.formatAmount(this.totaldebitamount);
  const creditTotal = this.formatAmount(this.totalcreditamount);

  return {
    debittotal: debitTotal,
    credittotal: creditTotal
  };
}

private pushTotals(rows: any[]): void {
  const totals = this.getGridTotals();

  rows.push([
    'Total',
    totals.debittotal,
    totals.credittotal
  ]);
}

}
