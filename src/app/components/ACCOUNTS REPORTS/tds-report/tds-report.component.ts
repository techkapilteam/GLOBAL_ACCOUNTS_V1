import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { Component,inject,OnInit } from '@angular/core';
import { FormsModule,FormBuilder, FormGroup,Validators, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';
import { CommonService } from '../../../services/common.service';
import { TdsService } from '../../../services/tds.service';
import { PageCriteria } from '../../../Models/pageCriteria';
import { TDSReportService } from '../../../services/Reports/tds-report.service';
import { NgSelectModule } from '@ng-select/ng-select';


@Component({
 selector: 'app-tdsreport',
  standalone: true,
  imports: [BsDatepickerModule, NgxDatatableModule, CommonModule, ReactiveFormsModule,TableModule,NgSelectModule],
  templateUrl: './tds-report.component.html',
  styleUrl: './tds-report.component.css',
  host: {
    ngSkipHydration: ''
  }
})
export class TdsReportComponent implements OnInit{
  dpConfig: Partial<BsDatepickerConfig> = {};
  dpConfig1: Partial<BsDatepickerConfig> = {};
  currencysymbol!: string;

  pageCriteria: PageCriteria = new PageCriteria();
  TdsReportForm!: FormGroup;

  disablesavebutton = false;
  savebutton = 'Show';
  summary = false;
  betweendate = true;
  dtTable = false;
  noDtTable = false;
  lblfromdate = 'From Date';
  mismatchInfo = false;

  tdssectiondata: any[] = [];
  tdsreportdata: any[] = [];
  Exceldata: any[] = [];
  mismatchInfoDetails: any[] = [];

  grouptype = 'Between';
  branchschema: string | null = null;

  ledgeramount = 0;
  paidamount = 0;
  tdscalculatedamount = 0;
  amount = 0;
  tdsamount = 0;
  reportpaidamount = 0;

  constructor(
    private fb: FormBuilder,
    private datepipe: DatePipe,
    private commonService: CommonService,
    private tdsreportservice: TDSReportService
  ) { }

  ngOnInit(): void {
    this.initializeDatePicker();
    this.initializeForm();
    this.setPageModel();
    this.getTDSSectionDetails();
    this.branchschema = sessionStorage.getItem('loginBranchSchemaname');
    this.currencysymbol = String(this.commonService.datePickerPropertiesSetup('currencysymbol'));
  }

  initializeDatePicker(): void {
    this.dpConfig = {
      maxDate: new Date(),
      dateInputFormat: 'DD-MMM-YYYY',
      // this.commonService.datePickerPropertiesSetup('dateInputFormat'),
      showWeekNumbers: false,
      containerClass: 'theme-dark-blue'
      // this.commonService.datePickerPropertiesSetup('containerClass')
    };
    // this.dpConfig = { ...config };
    // this.dpConfig1 = { ...config };
  }

  initializeForm(): void {
    this.TdsReportForm = this.fb.group({
      sectionid: [null, Validators.required],
      sectionname: [''],
      fromdate: [new Date()],
      todate: [new Date()],
      reportType: ['']
    });
  }

  setPageModel(): void {
    this.pageCriteria.pageSize = this.commonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }

  fromDate_Change(date: Date): void {
    this.dpConfig1 = { ...this.dpConfig1, minDate: date };
    this.tdsreportdata = [];
  }

  toDate_Change(date: Date): void {
    this.dpConfig = { ...this.dpConfig, maxDate: date };
    this.tdsreportdata = [];
  }

  getTDSSectionDetails(): void {
    this.tdsreportservice.getTDSSectionDetails()
      .subscribe(res => this.tdssectiondata = res || []);
  }

  onsectionidchange(event: any): void {
    if (!event) {
      this.TdsReportForm.patchValue({ sectionname: '' });
      return;
    }

    this.TdsReportForm.patchValue({
      sectionid: event.tblmsttdsid,
      sectionname: event.sectionname
    });

    this.tdsreportdata = [];
  }

  checkox(event: any): void {
    this.summary = event.target.checked;
    this.tdsreportdata = [];
  }

  oncheck(event: any): void {
    this.tdsreportdata = [];
    if (event.target.checked) {
      this.betweendate = false;
      this.grouptype = 'Ason';
      this.lblfromdate = 'Date';
    } else {
      this.betweendate = true;
      this.grouptype = 'Between';
      this.lblfromdate = 'From Date';
    }
  }

  mismatchcheckInfo(event: any): void {
    this.mismatchInfo = event.target.checked;
  }

  Show(): void {
    if (this.TdsReportForm.invalid) return;

    this.tdsreportdata = [];
    this.disablesavebutton = true;
    this.savebutton = 'Processing';

    const sectionid = this.TdsReportForm.value.sectionid;
    const fromdate = this.commonService.getFormatDateNormal(this.TdsReportForm.value.fromdate);
    const todate = this.commonService.getFormatDateNormal(this.TdsReportForm.value.todate);
    const reporttype = this.summary ? 'Summary' : 'Detail';

    if (!this.mismatchInfo) {
      this.tdsreportservice.getTDSReportDetails(
        this.commonService.getschemaname(),
        sectionid,
        fromdate,
        todate,
        this.grouptype,
        reporttype
      ).subscribe({
        next: (res) => {
          this.tdsreportdata = res || [];
          this.Exceldata = res || [];
          this.dtTable = this.tdsreportdata.length > 0;
          this.noDtTable = !this.dtTable;
          this.pageCriteria.totalrows = this.tdsreportdata.length;
          this.disablesavebutton = false;
          this.savebutton = 'Show';
        },
        error: () => {
          this.disablesavebutton = false;
          this.savebutton = 'Show';
        }
      });
    } else {
      this.tdsreportservice.getTDSReportDiffDetails(
        this.commonService.getschemaname(),
        sectionid,
        fromdate,
        todate
      ).subscribe(res => {
        this.mismatchInfoDetails = res || [];
        if (this.mismatchInfoDetails.length > 0) {
          this.exportdata();
        }
        this.disablesavebutton = false;
        this.savebutton = 'Show';
      });
    }
  }

  getAbsoluteValue(num: number): number {
    return Math.abs(num);
  }

  pdfOrprint(type: 'Pdf' | 'Print'): void {
    if (!this.tdsreportdata?.length) return;

    const rows: any[] = [];
    let reportname = '';
    let gridheaders: string[] = [];
    let colWidthHeight: any = {};

    if (this.summary) {
      reportname = 'TDS Report (Summary)';
      gridheaders = ['Agent Name','Agent Code','Pan Number','Paid Amount','TDS calculated Amount','Amount'];
      colWidthHeight = {
        0: { cellWidth: 'auto', halign: 'left' },
        1: { cellWidth: 'auto', halign: 'left' },
        2: { cellWidth: 'auto', halign: 'left' },
        3: { cellWidth: 'auto', halign: 'right' },
        4: { cellWidth: 'auto', halign: 'right' },
        5: { cellWidth: 'auto', halign: 'right' }
      };
    } else {
      reportname = 'TDS Report';
      gridheaders = ['Particulars','Pan Number','PAN Status','Agent Name','Agent Code','Transaction Date','Paid Amount','TDS calculated Amount','Amount','Effective JV','Subscriber Branch'];
      colWidthHeight = {
        0: { cellWidth: 35, halign: 'left' },
        1: { cellWidth: 'auto', halign: 'center' },
        2: { cellWidth: 'auto', halign: 'center' },
        3: { cellWidth: 'auto', halign: 'left' },
        4: { cellWidth: 'auto', halign: 'center' },
        5: { cellWidth: 20, halign: 'center' },
        6: { cellWidth: 20, halign: 'right' },
        7: { cellWidth: 'auto', halign: 'right' },
        8: { cellWidth: 20, halign: 'right' },
        9: { cellWidth: 'auto', halign: 'center' },
        10: { cellWidth: 'auto', halign: 'left' }
      };
    }

    const from = this.commonService.getFormatDateGlobal(this.TdsReportForm.value.fromdate);
    const to = this.commonService.getFormatDateGlobal(this.TdsReportForm.value.todate);

    this.amount = this.tdsreportdata.reduce((s, x) => s + (x.ledgeramount || 0), 0);
    this.tdsamount = this.tdsreportdata.reduce((s, x) => s + (x.tdscalculatedamount || 0), 0);
    this.reportpaidamount = this.tdsreportdata.reduce((s, x) => s + (x.paidamount || 0), 0);

    this.tdsreportdata.forEach(e => {
      const pannumber = e.pannumber || '--NA--';
      const branch = e.subscriberbranchname || '--NA--';
      const panstatus = e.panstatus || '--NA--';
      const transactiondate = e.transaction_date ? this.commonService.getFormatDateGlobal(e.transaction_date) : '';
      const ledger = this.commonService.convertAmountToPdfFormat(e.ledgeramount || 0);
      const tds = this.commonService.convertAmountToPdfFormat(e.tdscalculatedamount || 0);
      const paid = this.commonService.convertAmountToPdfFormat(e.paidamount || 0);

      if (this.summary) {
        rows.push([e.agentName, e.referalcode, pannumber, paid, tds, ledger]);
      } else {
        rows.push([e.paid_to, pannumber, panstatus, e.agentName, e.referalcode, transactiondate, paid, tds, ledger, e.effectedjvid, branch]);
      }
    });

    const totalRow = this.summary
      ? ['', '', 'Grand Total',
         this.commonService.convertAmountToPdfFormat(this.reportpaidamount),
         this.commonService.convertAmountToPdfFormat(this.tdsamount),
         this.commonService.convertAmountToPdfFormat(this.amount)]
      : ['', '', '', '', '', 'Grand Total',
         this.commonService.convertAmountToPdfFormat(this.reportpaidamount),
         this.commonService.convertAmountToPdfFormat(this.tdsamount),
         this.commonService.convertAmountToPdfFormat(this.amount)];

    rows.push(totalRow);

    this.commonService.downloadtdsaccountingpdf(
      reportname,
      this.grouptype,
      from,
      to,
      rows,
      gridheaders,
      colWidthHeight,
      'landscape',
      '',
      this.TdsReportForm.value.sectionname,
      to,
      type
    );
  }

  export(): void {
    const rows = this.tdsreportdata.map(e => ({
      'Agent Name': e.agentName,
      'Agent Code': e.referalcode,
      'Pan Number': e.pannumber || '--NA--',
      'Paid Amount': e.paidamount || 0,
      'TDS calculated Amount': e.tdscalculatedamount || 0,
      'Amount': e.ledgeramount || 0
    }));
    this.commonService.exportAsExcelFile(rows, this.summary ? 'TDS (Summary)' : 'TDS');
  }

  exportdata(): void {
    const rows = this.mismatchInfoDetails.map(e => ({
      'Transaction No.': e.voucherno,
      'Parent Name': e.paid_to,
      'Account Name': e.agentName,
      'Paid Amount': e.ledgeramount,
      'Tds Amount': e.tdscalculatedamount,
      'Amount': e.paidamount
    }));
    this.commonService.exportAsExcelFile(rows, 'tdsmismatch Information');
  }


}






