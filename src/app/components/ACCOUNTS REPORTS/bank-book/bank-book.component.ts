import { Component, OnInit, ViewChild, Output, Pipe, PipeTransform } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
//import { NgxLoadingModule } from 'ngx-loading';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
// Dummy import for CompanyDetailsComponent (comment if not available)
// import { CompanyDetailsComponent } from '../company-details/company-details.component';

@Pipe({
  name: 'dateformat',
  standalone: true
})
export class DateformatPipe implements PipeTransform {
  private datePipe = new DatePipe('en-US');
  transform(value: any, format: string = 'dd-MMM-yyyy'): any {
    if (!value) return '';
    return this.datePipe.transform(value, format);
  }
}


@Pipe({
  name: 'currencypipe',
  standalone: true
})
export class CurrencypipePipe implements PipeTransform {
  transform(value: number, symbol: string = '₹', decimal: number = 2): string {
    if (value === null || value === undefined) return '';
    return symbol + ' ' + value.toFixed(decimal);
  }
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    //NgxLoadingModule,
    BsDatepickerModule,
    // CompanyDetailsComponent, // comment if not available
    DateformatPipe,
    CurrencypipePipe
  ],
  templateUrl:'./bank-book.component.html',
  styleUrls: ['./bank-book.component.css']
})
export class BankBookComponent implements OnInit {
  @Output() printedDate: any;
  @ViewChild('myTable') table: any;

 
  public submitted = false;
  public BanknBookReportForm: FormGroup = new FormGroup({});
  public selectedbank: string = '';
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public today: Date = new Date();
  public startDate: any = new Date();
  public endDate: any = new Date();
  public startDates: any;
  public endDates: any;
  public bankData: any[] = [];
  public bankname: any;
  public gridView: any[] = [];
  public savebutton = 'Generate Report';
  public isLoading = false;
  public loading = false;
  public Showhide = true;
  public currencysymbol = '₹';
 
  public pageCriteria = {
    pageSize: 10,
    offset: 0,
    totalRows: 0,
    currentPageRows: 0
  };

  
  get pageSize(): number {
    return this.pageCriteria.pageSize;
  }

  get offset(): number {
    return this.pageCriteria.offset;
  }

  constructor(
    private datePipe: DatePipe,
    private _routes: Router,
    private formbuilder: FormBuilder
    // private _CommonService: CommonService,
    // private _bankBookService: BankBookService,
    // private _transReportservice: AccountingReportsService
  ) {
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.maxDate = new Date();
    this.dpConfig1.maxDate = new Date();
    this.dpConfig1.minDate = new Date();
    this.dpConfig1.showWeekNumbers = false;
  }

  ngOnInit() {
    this.printedDate = true;

    this.startDates = this.datePipe.transform(this.startDate, "dd-MMM-yyyy");
    this.endDates = this.datePipe.transform(this.endDate, "dd-MMM-yyyy");
    this.startDate = this.datePipe.transform(this.startDate, "yyyy-MM-dd");
    this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd");

    this.BanknBookReportForm = this.formbuilder.group({
      fromDate: [this.today, Validators.required],
      toDate: [this.today, Validators.required],
      pbankname: ['', Validators.required]
    });

    this.Showhide = true;

   
    this.bankData = [
      { pbankaccountid: '1', pbankname: 'State Bank' },
      { pbankaccountid: '2', pbankname: 'HDFC Bank' },
      { pbankaccountid: '3', pbankname: 'ICICI Bank' }
    ];

   
    this.gridView = [
      {
        ptransactionno: '1001',
        ptransactiondate: '2026-01-20',
        pparticulars: 'Cash Deposit',
        pdescription: 'Deposit to bank',
        pdebitamount: 1000,
        pcreditamount: 0,
        popeningbal: 1000,
        pBalanceType: 'Cr'
      },
      {
        ptransactionno: '1002',
        ptransactiondate: '2026-01-20',
        pparticulars: 'Payment',
        pdescription: 'Utility Bill',
        pdebitamount: 0,
        pcreditamount: 500,
        popeningbal: 500,
        pBalanceType: 'Cr'
      }
    ];

   
    this.pageCriteria.totalRows = this.gridView.length;
  }

  
  get f(): any {
    return this.BanknBookReportForm.controls;
  }

  public ToDateChange(event: any) {
    this.dpConfig1.minDate = event;
  }

  public FromDateChange(event: any) {
    this.dpConfig.maxDate = event;
  }

  Bankname(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedbank = target.options[target.selectedIndex].text;
  }

  public getbankBookReports() {
    this.submitted = true;
    if (this.BanknBookReportForm.valid) {
      this.loading = true;
      this.isLoading = true;
      this.savebutton = 'Processing';
      try {
        const pbankname = this.BanknBookReportForm.get('pbankname')?.value;
        this.startDate = this.BanknBookReportForm.get('fromDate')?.value;
        this.endDate = this.BanknBookReportForm.get('toDate')?.value;

        // this._bankBookService.GetBankBookReportbyDates(this.startDate, this.endDate, pbankname)
        //   .subscribe(res => {
        //     this.Showhide = false;
        //     this.bankname = this.selectedbank;
        //     this.gridView = res;
        //     this.isLoading = false;
        //     this.savebutton = 'Generate Report';
        //     this.loading = false;
        //   });
      } catch (e) {
        this.isLoading = false;
        this.savebutton = 'Generate Report';
        this.loading = false;
      }
    }
  }

  pdfOrprint(printOrPdf: string) {
    const rows: any[] = [];
    const reportname = "Bank Book";
    const gridheaders = ["Transaction No.", "Particulars", "Narration", "Receipts", "Payments", "Balance"];

    this.gridView.forEach(element => {
      const temp = [
        element.ptransactionno || '--NA--',
        element.pparticulars,
        element.pdescription,
        element.pdebitamount || '',
        element.pcreditamount || '',
        element.popeningbal || ''
      ];
      rows.push(temp);
    });

    // if (printOrPdf === 'Pdf') {
    //   this._transReportservice._BankBookReportsPdf(reportname, rows, gridheaders, {}, "landscape", "Between", this.startDate, this.endDate, 'Pdf', this.bankname);
    // } else {
    //   this._transReportservice._BankBookReportsPdf(reportname, rows, gridheaders, {}, "landscape", "Between", this.startDate, this.endDate, 'Print', this.bankname);
    // }
  }

  export(): void {
    const rows: any[] = [];
    this.gridView.forEach(element => {
      rows.push({
        "Transaction No.": element.ptransactionno,
        "Particulars": element.pparticulars,
        "Narration": element.pdescription,
        "Receipts": element.pdebitamount || 0,
        "Payments": element.pcreditamount || 0,
        "Balance": element.popeningbal || 0
      });
    });

    // this._CommonService.exportAsExcelFile(rows, 'BankBook');
  }

  toggleExpandGroup(group: any) {
    group.expanded = !group.expanded;
  }

  onDetailToggle(event: any) {
  
  }

  click(row: any) {
    
  }

  
  onFooterPageChange(event: any) {
    this.pageCriteria.offset = event.page;
    this.pageCriteria.pageSize = event.size;

    const start = this.pageCriteria.offset * this.pageCriteria.pageSize;
    const end = start + this.pageCriteria.pageSize;
    this.pageCriteria.currentPageRows = this.gridView.slice(start, end).length;
  }
}
