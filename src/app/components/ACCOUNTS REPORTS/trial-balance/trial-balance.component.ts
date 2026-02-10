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
      .GetTrialBalanceData(fdate, tdate, grouptype)
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

  pdfOrprint(type: string) {

  const fromDate: Date =
    this.TrialBalanceForm.get('fromdate')?.value ?? new Date();

  const toDate: Date =
    this.TrialBalanceForm.get('todate')?.value ?? new Date();

  this.commonService._downloadTrialBalanceReportsPdf(
    'Trial Balance',
    this.Trialbalancelst,
    ['Particulars', 'Debit', 'Credit'],
    {},
    'a4',
    this.groupType,
    this.commonService.getFormatDateGlobal(fromDate)??'',
    this.commonService.getFormatDateGlobal(toDate)??'',
    type,
    {
      debittotal: this.totaldebitamount,
      credittotal: this.totalcreditamount
    }
  );
}
}
