import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableModule } from 'primeng/table';
import { PageCriteria } from '../../../Models/pageCriteria';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { BankBookService } from '../../../services/Transactions/AccountingReports/bank-book.service';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';

@Component({
  selector: 'app-brs-statements',
  standalone: true,
  imports: [NgxDatatableModule, ReactiveFormsModule, CommonModule, BsDatepickerModule, NgSelectModule, TableModule],
  providers: [DatePipe],
  templateUrl: './brs-statements.component.html',
  styleUrls: ['./brs-statements.component.css']
})
export class BrsStatementsComponent {

  // form!: FormGroup;
  // bankType: 'CREDIT' | 'DEBIT' | null = null;
  // gridView: any[] = [];

  // dpConfig: Partial<BsDatepickerConfig> = {};

  // bankData = [
  //   { id: 1, name: 'HDFC Bank' },
  //   { id: 2, name: 'ICICI Bank' },
  //   { id: 3, name: 'SBI Bank' }
  // ];

  // constructor(private fb: FormBuilder, private datePipe: DatePipe) { }

  // ngOnInit(): void {
  //   const today = new Date();

  //   this.dpConfig = {
  //     dateInputFormat: 'DD-MMM-YYYY',
  //     containerClass: 'theme-dark-blue',
  //     showWeekNumbers: false
  //   };

  //   this.form = this.fb.group({
  //     bankId: [''],
  //     fromDate: [today],
  //     toDate: [today]
  //   }, { validators: this.dateRangeValidator() });
  // }
  // dateRangeValidator(): ValidatorFn {
  //   return (group: AbstractControl): ValidationErrors | null => {

  //     const from = group.get('fromDate')?.value;
  //     const to = group.get('toDate')?.value;

  //     const fromTime = new Date(from).setHours(0, 0, 0, 0);
  //     const toTime = new Date(to).setHours(0, 0, 0, 0);

  //     return fromTime > toTime
  //       ? { dateRangeInvalid: true }
  //       : null;
  //   };
  // }

  // onBankTypeChange(type: 'CREDIT' | 'DEBIT') {
  //   this.bankType = type;
  //   this.gridView = [];
  // }

  // getReport() {
  //   this.form.markAllAsTouched();

  //   if (this.form.errors?.['dateRangeInvalid']) {
  //     alert('From Date should not be greater than To Date');
  //     return;
  //   }

  //   if (this.form.invalid) return;
  //   if (this.bankType === 'CREDIT') {
  //     this.gridView = [
  //       {
  //         receiptDate: new Date(),
  //         receiptNo: 'RC001',
  //         amount: 5000,
  //         chequeNo: 'CH123',
  //         chequeDate: new Date(),
  //         depositDate: new Date(),
  //         clearedDate: new Date(),
  //         particular: 'Customer Deposit'
  //       }
  //     ];
  //   } else {
  //     this.gridView = [
  //       {
  //         transDate: new Date(),
  //         transNo: 'TR001',
  //         chequeNo: 'CH789',
  //         amount: 2500,
  //         clearedDate: new Date(),
  //         particular: 'Office Expense'
  //       }
  //     ];
  //   }
  // }

  // formatDate(date: Date | string | null): string {
  //   if (!date) return '';
  //   return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
  // }

  // pdfOrprint(type: string) {
  //   console.log(type);
  // }

  // export() {
  //   console.log('Excel Export');
  // }

  // exportExcel() {
  //   alert('Excel export not implemented in demo mode');
  // }
  loading = false;
  BrsStatementsReport!: FormGroup<{
  fromDate: FormControl<Date | null>;
  toDate: FormControl<Date | null>;
  pbankname: FormControl<string | null>;
  branchschema: FormControl<string | null>;
  Bank: FormControl<string | null>;
}>;

  today: Date = new Date();
  selectedbank: any;

  dpConfig: Partial<BsDatepickerConfig> = {};
  dpConfig1: Partial<BsDatepickerConfig> = {};

  currencysymbol: any;
  pageCriteria!: PageCriteria;

  savebutton = 'Show';
  disablesavebutton = false;

  bankData: any[] = [];
  GridData: any[] = [];

  totalAmount = 0;
  reportName!: string;

  BankCreditShow = false;
  BankDebitShow = false;
  startDate!: string;
  endDate!: string;
  pissuedate!: string | null;
  pclearDate!: string | null;
  public submitted = false;
get f() { return this.BrsStatementsReport.controls; }

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private fb: FormBuilder,
    private _CommonService: CommonService,
    private _bankBookService: BankBookService,
    private _accountingReportsservice: AccountingReportsService
  ) {

    this.currencysymbol =
      this._CommonService.datePickerPropertiesSetup('currencysymbol');

    this.dpConfig = {
      dateInputFormat:'DD-MMM-YYYY',
        // this._CommonService.datePickerPropertiesSetup('dateInputFormat'),
      containerClass:'theme-dark-blue',
        // this._CommonService.datePickerPropertiesSetup('containerClass'),
      showWeekNumbers: false,
      maxDate: new Date()
    };

    this.dpConfig1 = {
      dateInputFormat:'DD-MMM-YYYY',
        // this._CommonService.datePickerPropertiesSetup('dateInputFormat'),
      containerClass:'theme-dark-blue',
        // this._CommonService.datePickerPropertiesSetup('containerClass'),
      showWeekNumbers: false,
      maxDate: new Date(),
      minDate: new Date()
    };

    this.pageCriteria = new PageCriteria();
  }

  ngOnInit(): void {

    this.setPageModel();

    this.BrsStatementsReport = this.fb.group({
  fromDate: this.fb.control<Date | null>(this.today),
  toDate: this.fb.control<Date | null>(this.today),
  pbankname: this.fb.control<string | null>(null),
  branchschema: this.fb.control<string | null>(null),
  Bank: this.fb.control<string | null>('CREDIT')
});

    this.bankBookDetails();
    this.relesechange('CREDIT');
  }

  bankBookDetails(): void {
    this._bankBookService.GetBankNames().subscribe({
      next: (res: any) => {
        this.bankData = res;
      },
      error: (err) => this.showErrorMessage(err)
    });
  }

  ToDateChange(event: any): void {
    this.dpConfig1 = {
      ...this.dpConfig1,
      minDate: event
    };
  }

  FromDateChange(event: any): void {
    this.dpConfig = {
      ...this.dpConfig,
      maxDate: event
    };
  }

  Bankname(args: any): void {
    this.selectedbank =
      args.target.options[args.target.selectedIndex].text;
  }

  relesechange(type: string): void {

    this.GridData = [];

    if (type === 'CREDIT') {
      this.BankCreditShow = true;
      this.BankDebitShow = false;
      this.reportName = 'BANK CREDIT DETAILS';
    } else {
      this.BankCreditShow = false;
      this.BankDebitShow = true;
      this.reportName = 'BANK DEBIT DETAILS';
    }
  }

  Show(): void {

    this.disablesavebutton = true;
    this.savebutton = 'Processing';

    const fromDate = this._CommonService.getFormatDateNormal(
      this.BrsStatementsReport.value.fromDate
    )??'';

    const toDate = this._CommonService.getFormatDateNormal(
      this.BrsStatementsReport.value.toDate
    )??'';

    const bankid = this.BrsStatementsReport.value.pbankname??'';
    const transtype = this.BrsStatementsReport.value.Bank??'';
    const branchschema = this._CommonService.getschemaname();

    this._bankBookService
      .GetBrsReportBankDebitsBankCredits(
        fromDate,
        toDate,
        bankid,
        transtype,
        branchschema
      )
      .subscribe({
        next: (res: any[]) => {

          this.GridData = res || [];
          this.totalAmount = this.GridData.reduce(
            (sum, c) => sum + parseFloat(c.ptotalamount || 0),
            0
          );

          this.updatePagination();

          this.disablesavebutton = false;
          this.savebutton = 'Show';
        },
        error: () => {
          this.disablesavebutton = false;
          this.savebutton = 'Show';
        }
      });
  }

  updatePagination(): void {
    this.pageCriteria.totalrows = this.GridData.length;
    this.pageCriteria.CurrentPage = 1;
    this.pageCriteria.offset = 0;

    this.pageCriteria.TotalPages =
      Math.ceil(this.pageCriteria.totalrows / this.pageCriteria.pageSize);
  }

  setPageModel(): void {
    this.pageCriteria.pageSize = this._CommonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }

  onPrimePageChange(event: any): void {
    this.pageCriteria.offset = event.first / event.rows;
    this.pageCriteria.CurrentPage =
      this.pageCriteria.offset + 1;
  }

  showErrorMessage(err: string): void {
    this._CommonService.showErrorMessage(err);
  }
  pdfOrprintCredit(printorpdf: any) {
    debugger;
    let rows = [];
    let reportname = this.reportName;
    let gridheaders = ["Receipt Date", "Receipt No", "Amount", "Cheque No ", "Cheque Date", "Deposit Date", "Cleared Date","Particular"];
    
    let fromDate = this._CommonService.getFormatDateGlobal(this.BrsStatementsReport.controls['fromDate'].value);
    let toDate = this._CommonService.getFormatDateGlobal(this.BrsStatementsReport.controls['toDate'].value);
    this.startDate = fromDate;
    this.endDate = toDate;
    let colWidthHeight = {
            0: { cellWidth: 'auto', halign: 'center' },
            1: { cellWidth: 22, halign: 'left' },
            2: { cellWidth: 20, halign: 'right' },
            3: { cellWidth: 25, halign: 'left' },
            4: { cellWidth: 'auto', halign: 'center' },
            5: { cellWidth: 'auto', halign: 'center' },
            6: { cellWidth: 'auto', halign: 'center' },
            7: { cellWidth: 'auto', halign: 'left' },
          }

    this.GridData.forEach(element => {
      debugger;
      let temp = [];
      let ptotalamount = this._CommonService.convertAmountToPdfFormat(element.ptotalamount);

      if (element.pissuedate) {
        this.pissuedate = String(this._CommonService.getDateObjectFromDataBase(element.pissuedate))
        this.pissuedate = this._CommonService.getFormatDateGlobal(element.pissuedate);
      }
      else {
        this.pissuedate = "--NA--";
      }
      if (element.pissuedate) {
        this.pissuedate = String(this._CommonService.getDateObjectFromDataBase(element.pissuedate))
        this.pissuedate = this._CommonService.getFormatDateGlobal(element.pissuedate);
      }
      else {
        this.pissuedate = "--NA--";
      }


      if (element.pclearDate !='[object Object]') {
        this.pclearDate = String(this._CommonService.getDateObjectFromDataBase(element.pclearDate))
        this.pclearDate = this._CommonService.getFormatDateGlobal(element.pclearDate);
      }
      else {
        this.pclearDate = "--NA--";
      }
     
      temp = [this.pissuedate, element.ptransactionno, ptotalamount, element.preferencenumber?element.preferencenumber:"--NA--", element.preferencenumber!=''?this.pissuedate:'-NA-', element.preferencenumber!=''?this.pissuedate:'-NA-', this.pclearDate, element.pparticulars];
      rows.push(temp);
    });

    let temp = ["", "Total",  this._CommonService.convertAmountToPdfFormat(this.totalAmount), "","", "", "",""]
    rows.push(temp);
    this._CommonService._downloadReportsPdf(reportname, rows, gridheaders, colWidthHeight, "a4", "Between", this.startDate, this.endDate, printorpdf);
  }

  pdfOrprintDebit(printorpdf: any) {

    let rows = [];
    let reportname = this.reportName;
    let gridheaders = ["Trans Date", "Trans No", "Cheque No", "Amount", "Cleared Date", "Particular"];
    
    let fromDate = this._CommonService.getFormatDateGlobal(this.BrsStatementsReport.controls['fromDate'].value);
    let toDate = this._CommonService.getFormatDateGlobal(this.BrsStatementsReport.controls['toDate'].value);
    this.startDate = fromDate;
    this.endDate = toDate;
    let colWidthHeight = {
  0: { cellWidth: 'auto', halign: 'center' },
  1: { cellWidth: 22, halign: 'left' },
  2: { cellWidth: 20, halign: 'right' },
  3: { cellWidth: 25, halign: 'left' },
  4: { cellWidth: 'auto', halign: 'center' },
  5: { cellWidth: 'auto', halign: 'center' },
  6: { cellWidth: 'auto', halign: 'center' },
  7: { cellWidth: 'auto', halign: 'left' }
};

    this.GridData.forEach(element => {

      let temp = [];
      let ptotalamount = this._CommonService.convertAmountToPdfFormat(element.ptotalamount);
     
      if (element.pissuedate) {
        this.pissuedate = String(this._CommonService.getDateObjectFromDataBase(element.pissuedate))
        this.pissuedate = this._CommonService.getFormatDateGlobal(element.pissuedate);
      }
      else {
        this.pissuedate = "--NA--";
      }
      if (element.pclearDate !='[object Object]') {
        this.pclearDate = String(this._CommonService.getDateObjectFromDataBase(element.pclearDate))
        this.pclearDate = this._CommonService.getFormatDateGlobal(element.pclearDate);
      }
      else {
        this.pclearDate = "--NA--";
      }
     
      temp = [this.pissuedate,element.ptransactionno, element.preferencenumber, ptotalamount, this.pclearDate, element.pparticulars?element.pparticulars:"--NA--"];
      rows.push(temp);
    });
   
    let temp = ["", "Total","",  this._CommonService.convertAmountToPdfFormat(this.totalAmount), "", "", "",""]
    rows.push(temp);
      this._CommonService._downloadReportsPdf(reportname, rows, gridheaders, colWidthHeight, "a4", "Between", this.startDate, this.endDate, printorpdf);
 


  }

    exportBankDebit(): void {
      let rows: any[] = [];  
      this.GridData.forEach(element => {
        debugger;
        let ptotalamount = this._CommonService.convertAmountToPdfFormat(element.ptotalamount);
        let pclearDate = element.pclearDate !='[object Object]'?this._CommonService.getFormatDateGlobal(element.pclearDate):'--NA--';
        let pissuedate = this._CommonService.getFormatDateGlobal(element.pissuedate);
        //let temp;
        let dataobject;
        dataobject = {
          "Trans Date":pissuedate,
          "Trans No":element.ptransactionno,
          "Cheque No":element.preferencenumber,
          "Amount":ptotalamount,
          "Cleared Date":pclearDate,
          "Particular":element.pparticulars?element.pparticulars:"--NA--",
       
        }
        rows.push(dataobject);
      });
      this._CommonService.exportAsExcelFile(rows, 'BankDebit');
    } 

    exportBankCredit(): void {
      let rows: any[] = [];  
      this.GridData.forEach(element => {
        debugger;
        let ptotalamount = this._CommonService.convertAmountToPdfFormat(element.ptotalamount);
        let pclearDate = element.pclearDate !='[object Object]'?this._CommonService.getFormatDateGlobal(element.pclearDate):'--NA--';
        let pissuedate = this._CommonService.getFormatDateGlobal(element.pissuedate);
        let DepositDate = this._CommonService.getFormatDateGlobal(element.pissuedate);
        let ReceiptDate = this._CommonService.getFormatDateGlobal(element.pissuedate);
        //let temp;
        let dataobject;
        dataobject = {
          "Receipt Date":pissuedate,
          "Receipt No":  element.ptransactionno,
          "Amount":ptotalamount,
          "Cheque No ":element.preferencenumber?element.preferencenumber:"--NA--",
          "Cheque Date":element.preferencenumber!=''?pissuedate:'-NA-',
          "Deposit Date":element.preferencenumber!=''?pissuedate:'-NA-',
          "Cleared Date":pclearDate,
          "Particular": element.pparticulars,
       
        }
        rows.push(dataobject);
      });
      this._CommonService.exportAsExcelFile(rows, 'BankCredit');
    } 
}
