import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';
import { PageCriteria } from 'src/app/Models/pageCriteria';
import { AccountReportsService } from 'src/app/services/account-reports.service';
import { CommonService } from 'src/app/services/common.service';
import { AccountingReportsService } from 'src/app/services/Transactions/AccountingReports/accounting-reports.service';
import { BankBookService } from 'src/app/services/Transactions/AccountingReports/bank-book.service';

@Component({
  selector: 'app-bank-entries',
  imports: [CommonModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    TableModule,
    DatePipe],
  templateUrl: './bank-entries.component.html',
  styleUrl: './bank-entries.component.css',
})
export class BankEntriesComponent implements OnInit {

  @Output() printedDate: any;
  @ViewChild('myTable') table: any;

  public BanknBookReportForm!: FormGroup;

  pageCriteria: PageCriteria = new PageCriteria();

  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  public today: Date = new Date();
  public startDate: any = new Date();
  public endDate: any = new Date();

  public gridView: any[] = [];
  public pagedData: any[] = [];

  public Showhide = true;

  public loading = false;
  public pdfLoading = false;
  public isLoading = false;

  public savebutton = 'Generate Report';

  public SummeryChecked = false;
  public isSummeryChecked: any = '';

  currencysymbol: any;

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private formbuilder: FormBuilder,
    private _CommonService: CommonService,
    private _bankBookService: BankBookService,
    private verificationService: AccountReportsService,
    // private verificationService: VerificationService
  ) {

    this.currencysymbol = this._CommonService.datePickerPropertiesSetup("currencysymbol");

    this.dpConfig.dateInputFormat = this._CommonService.datePickerPropertiesSetup("dateInputFormat");
    this.dpConfig.containerClass = 'theme-dark-blue';
    // this._CommonService.datePickerPropertiesSetup("containerClass");
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.maxDate = new Date();

    this.dpConfig1.maxDate = new Date();
    this.dpConfig1.minDate = new Date();
    this.dpConfig1.dateInputFormat = this._CommonService.datePickerPropertiesSetup("dateInputFormat");
    this.dpConfig1.containerClass = 'theme-dark-blue'
    this._CommonService.datePickerPropertiesSetup("containerClass");

  }

  ngOnInit(): void {

    this.printedDate = true;
    this.setPageModel();

    this.BanknBookReportForm = this.formbuilder.group({
      fromDate: [this.today, Validators.required],
      toDate: [this.today, Validators.required]
    });

  }

  setPageModel(): void {

    this.pageCriteria.pageSize = this._CommonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.CurrentPage = 1;
    this.pageCriteria.footerPageHeight = 50;
    this.pageCriteria.totalrows = 0;
    this.pageCriteria.TotalPages = 0;

  }

  updatePagedData(): void {

    if (!this.gridView || this.gridView.length === 0) {
      this.pagedData = [];
      return;
    }

    const startIndex = (this.pageCriteria.CurrentPage - 1) * this.pageCriteria.pageSize;
    const endIndex = Math.min(startIndex + this.pageCriteria.pageSize, this.gridView.length);

    this.pagedData = this.gridView.slice(startIndex, endIndex);

  }

  onFooterPageChange(event: any): void {

    this.pageCriteria.CurrentPage = event.page;
    this.pageCriteria.offset = (event.page - 1) * this.pageCriteria.pageSize;

    this.updatePagedData();

  }

  public ToDateChange(event: any): void {
    this.dpConfig1.minDate = event;
  }

  public FromDateChange(event: any): void {
    this.dpConfig.maxDate = event;
  }

  CheckSummery(event: any): void {

    if (event.target.checked) {

      this.pagedData = [];
      this.gridView = [];

      this.SummeryChecked = true;
      this.isSummeryChecked = 'S';

    } else {

      this.pagedData = [];
      this.gridView = [];

      this.SummeryChecked = false;
      this.isSummeryChecked = '';

    }

  }

  public getbankBookReports(): void {

    if (!this.BanknBookReportForm.valid) {
      return;
    }

    this.loading = true;
    this.isLoading = true;
    this.savebutton = 'Processing';

    const pbankname = '';

    this.startDate = this.BanknBookReportForm.controls['fromDate'].value;
    this.endDate = this.BanknBookReportForm.controls['toDate'].value;

    let fromdate = this._CommonService.getFormatDateNormal(this.startDate);
    let todate = this._CommonService.getFormatDateNormal(this.endDate);

    this._bankBookService.GetBankEntriesDetails2(
      fromdate,
      todate,
      pbankname,
      this.isSummeryChecked
    ).subscribe(res => {

      this.Showhide = false;

      this.gridView = res;

      this.pageCriteria.totalrows = this.gridView.length;
      this.pageCriteria.TotalPages = Math.ceil(this.gridView.length / this.pageCriteria.pageSize);

      this.pageCriteria.CurrentPage = 1;
      this.pageCriteria.offset = 0;

      this.updatePagedData();

      this.loading = false;
      this.isLoading = false;
      this.savebutton = 'Generate Report';

    },
    (error) => {

      this.showErrorMessage(error);

      this.loading = false;
      this.isLoading = false;
      this.savebutton = 'Generate Report';

    });

  }

  // async pdfOrprint(printorpdf: string) {

  //   this.pdfLoading = true;

  //   try {

  //     let rows: any[] = [];

  //     this.gridView.forEach(element => {

  //       let datereceipt = this._CommonService.getFormatDateGlobal(element.transdate);

  //       rows.push([
  //         element.recordid || "--NA--",
  //         datereceipt || "--NA--",
  //         element.transaNo || "--NA--",
  //         element.particulars || "--NA--",
  //         element.debit || "",
  //         element.credit || "",
  //         element.balance || "",
  //         element.balancetype || "--NA--"
  //       ]);

  //     });

  //     let fromDate = this._CommonService.getFormatDateGlobal(
  //       this.BanknBookReportForm.controls['fromDate'].value
  //     );

  //     let toDate = this._CommonService.getFormatDateGlobal(
  //       this.BanknBookReportForm.controls['toDate'].value
  //     );

  //     this.verificationService.downloadKgmsOutwardReportsData(
  //       "Bank Entries Details",
  //       rows,
  //       [],
  //       {},
  //       "a4",
  //       'Pdf',
  //       fromDate,
  //       toDate,
  //       "Between"
  //     );

  //     this.pdfLoading = false;

  //   } catch (error) {

  //     this.pdfLoading = false;
  //     this.showErrorMessage("Failed to generate PDF");

  //   }

  // }
  async pdfOrprint(printorpdf: string) {

  this.pdfLoading = true;

  try {

    let rows: any[] = [];
    let slNo = 1; 

    this.gridView.forEach(element => {

      let datereceipt = this._CommonService.getFormatDateGlobal(element.transactionDate);

      rows.push([
        slNo++,                        
        datereceipt        || "--NA--",
        (element.transactionNo && element.transactionNo !== '0') 
      ? element.transactionNo   : "--NA--",
        element.particulars|| "--NA--",
        element.debitamount      || "",
        element.creditamount     || "",
        element.balance    || "",
        element.balancetype|| "--NA--"
      ]);

    });

    const headers = [
      "Sl No.",
      "Transaction Date",
      "Transaction No.",
      "Particulars",
      "Debit Amount",
      "Credit Amount",
      "Balance",
      "Balance Type"
    ];

    const colWidths = {
      0: { cellWidth: 12, halign: 'center' },   
      1: { cellWidth: 25, halign: 'center' },  
      2: { cellWidth: 22, halign: 'center' },   
      3: { cellWidth: 65 },                    
      4: { cellWidth: 22, halign: 'right' },    
      5: { cellWidth: 22, halign: 'right' },   
      6: { cellWidth: 15, halign: 'right' },  
      7: { cellWidth: 17, halign: 'center' },   
    };
    // Total: 12+25+22+65+22+22+15+17 = 200 ... adjusted below for 10mm left margin

    let fromDate = this._CommonService.getFormatDateGlobal(
      this.BanknBookReportForm.controls['fromDate'].value
    );

    let toDate = this._CommonService.getFormatDateGlobal(
      this.BanknBookReportForm.controls['toDate'].value
    );

    this.verificationService.downloadKgmsOutwardReportsData(
      "Bank Entries Details",
      rows,
      headers,
      colWidths,
      "a4",
      printorpdf === 'Print' ? 'Print' : 'Pdf',
      fromDate,
      toDate,
      "Between"
    );

    this.pdfLoading = false;

  } catch (error) {

    this.pdfLoading = false;
    this.showErrorMessage("Failed to generate PDF");

  }

}

  export(): void {

    let rows: any[] = [];

    this.gridView.forEach(element => {

      let datereceipt = this._CommonService.getFormatDateGlobal(element.transdate);

      rows.push({
        "Transaction Date": datereceipt,
        "Transaction No.": element.transactionNo,
        "Particulars": element.particulars,
        "Debit Amount": element.debitamount,
        "Credit Amount": element.creditamount,
        "Balance": element.balance,
        "Balance Type": element.balancetype
      });

    });

    this._CommonService.exportAsExcelFile(rows, 'Bank Entries Details');

  }

  public showErrorMessage(errormsg: any) {
    this._CommonService.showErrorMessage(errormsg);
  }

  public showInfoMessage(msg: string) {
    this._CommonService.showInfoMessage(msg);
  }

}
