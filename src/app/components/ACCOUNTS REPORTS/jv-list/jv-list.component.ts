import { Component, ElementRef, OnInit, Output, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TreeTableModule } from 'primeng/treetable';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import { PageCriteria } from '../../../Models/pageCriteria';
import { finalize } from 'rxjs';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-jv-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule,
    NgxDatatableModule,
    TableModule,
    PaginatorModule,ReactiveFormsModule
  ],
  templateUrl: './jv-list.component.html',
  providers: [DatePipe]
})
export class JvListComponent implements OnInit {
  
   private fb = inject(FormBuilder);
  private router = inject(Router);
  private commonService = inject(CommonService);
  private jvReportService = inject(AccountingReportsService);

  @ViewChild('myTable') table!: any;
  @ViewChild('htmlData') htmlData!: ElementRef;

  @Output() printedDate: boolean = true;
   treeData: any[] = [];
  totalRecords: number = 0;

  dpConfig: Partial<BsDatepickerConfig> = {};
  dpConfig1: Partial<BsDatepickerConfig> = {};

  JvlistReportForm!: FormGroup;

  today: Date = new Date();
  savebutton = 'Generate Report';
  submitted = false;
  loading = false;
  isLoading = false;

  jvtype: string = '';
  startDate!: Date;
  endDate!: Date;

  jvlistData: any[] = [];
  jvlistDataa: any[] = [];

  currencysymbol: string = '';
  showHide = true;

  pageCriteria: PageCriteria = new PageCriteria();
  // commencementgridPage = new Page();

  constructor() {
    this.currencysymbol = '₹',
      // this.commonService.datePickerPropertiesSetup('currencysymbol');

    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
        // this.commonService.datePickerPropertiesSetup('dateInputFormat'),
      containerClass: 'theme-dark-blue',
        // this.commonService.datePickerPropertiesSetup('containerClass'),
      showWeekNumbers: false,
      maxDate: new Date()
    };

    this.dpConfig1 = {
      dateInputFormat: 'DD-MMM-YYYY',
        // this.commonService.datePickerPropertiesSetup('dateInputFormat'),
      containerClass: 'theme-dark-blue',
        // this.commonService.datePickerPropertiesSetup('containerClass'),
      showWeekNumbers: false,
      maxDate: new Date(),
      minDate: new Date()
    };
  }

  ngOnInit(): void {
    this.setPageModel();

    this.JvlistReportForm = this.fb.group({
      fromDate: [this.today, Validators.required],
      toDate: [this.today, Validators.required],
        // formName: ['',Validators.required],
      ptranstype: ['', Validators.required]
    });
  }

  setPageModel(): void {
    this.pageCriteria.pageSize = this.commonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }

  onFooterPageChange(event: any): void {
    this.pageCriteria.offset = event.page - 1;

    this.pageCriteria.currentPageRows =
      this.pageCriteria.totalrows < event.page * this.pageCriteria.pageSize
        ? this.pageCriteria.totalrows % this.pageCriteria.pageSize
        : this.pageCriteria.pageSize;
  }

  ToDateChange(event: Date): void {
    this.dpConfig1.minDate = event;
  }

  FromDateChange(event: Date): void {
    this.dpConfig.maxDate = event;
  }

  SelectTransactiontype(): void {
    this.jvlistData = [];
    this.jvlistDataa = [];
  }

  getjvListReports(): void {

    this.submitted = true;

    if (this.JvlistReportForm.invalid) {
      this.JvlistReportForm.markAllAsTouched();
      return;
    }

    this.jvlistData = [];
    this.jvlistDataa = [];
    this.loading = true;
    this.isLoading = true;
    this.savebutton = 'Processing';

    this.jvtype = this.JvlistReportForm.value.ptranstype;
    this.startDate = this.JvlistReportForm.value.fromDate;
    this.endDate = this.JvlistReportForm.value.toDate;

    const fromdate =
      this.commonService.getFormatDateNormal(this.startDate) || '';
    const todate =
      this.commonService.getFormatDateNormal(this.endDate) || '';

    this.jvReportService
      .GetJvListReportGroup(fromdate, todate, this.jvtype)
      .subscribe({
        next: (res: any[]) => {
          this.jvlistDataa = res.map(data => ({
            ...data,
            pcreditamount: parseFloat(data.pcreditamount).toFixed(2),
            pdebitamount:
              data.pdebitamount > 0
                ? parseFloat(data.pdebitamount).toFixed(2)
                : data.pdebitamount
          }));
        },
        error: err => this.showErrorMessage(err)
      });

    this.jvReportService
      .GetJvListReport(fromdate, todate, this.jvtype,'accounts','KAPILCHITS','KLC01','global')
      .pipe(finalize(() => {
        this.isLoading = false;
        this.loading = false;
        this.savebutton = 'Generate Report';
      }))
      .subscribe({
        next: (res: any[]) => {
          if (res.length > 0) {
            this.jvlistData = res;
            this.narrrationSepFn();
            this.showHide = false;
          } else {
            this.commonService.showInfoMessage('No Data');
            this.showHide = true;
          }
        },
        error: err => this.showErrorMessage(err)
      });
  }

  narrrationSepFn(): void {

    const transactionNos = [
      ...new Set(this.jvlistData.map(x => x.ptransactionno))
    ];

    transactionNos.forEach(jvNo => {

      const rows =
        this.jvlistData.filter(x => x.ptransactionno === jvNo);

      if (!rows.length) return;

      this.jvlistDataa.push({
        ptransactiondate: rows[0].ptransactiondate,
        ptransactionno: rows[0].ptransactionno,
        pparticulars: 'Narration: ' + rows[0].pdescription,
        pdebitamount: 0,
        pcreditamount: 0
      });
    });
  }

  pdfOrprint(printorpdf: 'Pdf' | 'Print'): void {

    const reportname = 'JV List';
    const gridheaders = ['Particulars', 'Debit Amount', 'Credit Amount'];
    const rows: any[] = [];

    const fromDate =
      this.commonService.getFormatDateGlobal(
        this.JvlistReportForm.value.fromDate
      )??'';

    const toDate =
      this.commonService.getFormatDateGlobal(
        this.JvlistReportForm.value.toDate
      )??'';

    const groupedData =
      this.commonService._MultipleGroupingGridExportData(
        this.jvlistData,
        'ptransactiondate',
        true
      );

    groupedData.forEach((element: any) => {
      if (element.ptransactionno !== undefined) {
        rows.push([
          element.pparticulars,
          this.commonService.currencyformat(element.pdebitamount),
          this.commonService.currencyformat(element.pcreditamount)
        ]);
      } else {
        rows.push([element.group]);
      }
    });

    this.commonService._JvListdownloadReportsPdf(
      reportname,
      rows,
      gridheaders,
      {},
      'landscape',
      'Between',
      fromDate,
      toDate,
      printorpdf 
    );
  }
  GetNameBasedOnvalue(value: any): string {
  let returnValue: string = '';

  if (value.parentId == null) {
    returnValue = this.commonService.getFormatDateGlobal(value.formOrModulename);

    value.pdebitamount = 0;
    value.pcreditamount = 0;
    value.balance = 0;
  } 
  else if (value.parentId < 30) {
    returnValue = value.formOrModulename;

    value.pdebitamount = 0;
    value.pcreditamount = 0;
  } 
  else if (value.parentId > 30) {
    if (value.pdebitamount !== 0 || value.pcreditamount !== 0) {
      returnValue = value.formOrModulename;
    } else {
      returnValue = value.formOrModulename;
    }
  }

  return returnValue;
}


  showErrorMessage(err: any): void {
    this.commonService.showErrorMessage(err);
  }

  showInfoMessage(msg: string): void {
    this.commonService.showInfoMessage(msg);
  }
}
