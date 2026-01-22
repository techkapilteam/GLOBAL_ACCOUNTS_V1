import { CommonModule, DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-brs-statements',
  standalone:true,
  imports: [NgxDatatableModule,ReactiveFormsModule,CommonModule,BsDatepickerModule],
   providers: [ DatePipe],
  templateUrl: './brs-statements.component.html',
  styleUrl: './brs-statements.component.css',
})
export class BrsStatementsComponent {

  public loading = false;
  public BrsStatementsReport!: FormGroup;
  public today: Date = new Date();
  public selectedbank: any;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  currencysymbol: any;
 // pageCriteria: PageCriteria;
  showhidetable: any;
 

  ColumnMode = ColumnMode;
  @ViewChild('myTable') table: any;
  public submitted = false;
  savebutton = 'Show';
 public disablesavebutton = false;

  //bankData!: [];
bankData: any[] = [];
 //GridData: any;
 GridData: any = [];
  endDate: any;
  startDate: any;
  fromDate: any;
  toDate: any;
  Bank!: boolean;
  reportName!: string;
  branchschema: any;

  GetBrsReportBankDebitsBankCredits: any;
  BankCreditShow!: boolean;
  BankDebitShow!: boolean;
  fromdate!: string;
  todate: any;
  pissuedate: any;
  pclearDate: any;
  pdepositdate: any;
  preferencenumber: any;
  totalAmount!: number;


  constructor(private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder,/* private _CommonService: CommonService*//* private _bankBookService: BankBookService*//*private _accountingReportsservice: AccountingReportsService*/) {

    //this.currencysymbol = this._CommonService.datePickerPropertiesSetup("currencysymbol");

    //this.dpConfig.dateInputFormat = this._CommonService.datePickerPropertiesSetup("dateInputFormat");
    //this.dpConfig.containerClass = this._CommonService.datePickerPropertiesSetup("containerClass");
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.maxDate = new Date();

    this.dpConfig1.maxDate = new Date();
    this.dpConfig1.minDate = new Date();
    //this.dpConfig1.dateInputFormat = this._CommonService.datePickerPropertiesSetup("dateInputFormat");
    //this.dpConfig1.containerClass = this._CommonService.datePickerPropertiesSetup("containerClass");
    this.dpConfig1.showWeekNumbers = false;
   // this.pageCriteria = new PageCriteria();
  }

  ngOnInit(): void {
    this.submitted = false;
    this.showhidetable = true;
    
    this.setPageModel();

    this.BrsStatementsReport = this.formbuilder.group({
      fromDate: [this.today, Validators.required],
      toDate: [this.today, Validators.required],
      pbankname: ['', Validators.required],
      branchschema: [''],

      Bank: ['']
      
    })
    this.bankBookDetails();
  }
  get f() { return this.BrsStatementsReport.controls; }

  public bankBookDetails() {
    debugger
    // this._bankBookService.GetBankNames().subscribe(res: => {
    //   this.bankData = res;
    //   // console.log(res);
    // },
    //   (error) => {
    //     this.showErrorMessage(error);
    //   });
  }


  public ToDateChange(event:any) {
    this.dpConfig1.minDate = event;
  }
  
  public FromDateChange(event:any) {
    this.dpConfig.maxDate = event;
    //this.BanknBookReportForm['controls']['fromDate'].setValue(event)
  }

  Bankname(args:any) {

    this.selectedbank = args.target.options[args.target.selectedIndex].text

  }

  // public getBrsStatementsReports() {
  //   debugger
  //   this.submitted = true;
  //   if (this.BrsStatementsReport.valid) {
  //     this.savebutton = "Processing";
  //   }
  // }
  public showErrorMessage(errormsg: string) {
    //this._CommonService.showErrorMessage(errormsg);
  }
  relesechange(type:any) { 
    debugger
    if(type == "CREDIT"){
      this.BankCreditShow = true;
      this.BankDebitShow = false;
      this.GridData = [];
      this.reportName = "BANK CREDIT DETAILS"
    }
    else if(type == "DEBIT"){
      this.BankCreditShow = false;
      this.BankDebitShow = true;
      this.GridData = [];
      this.reportName = "BANK DEBIT DETAILS"
    }
   
  }
  Show() {
   this.disablesavebutton = true;
    this.savebutton = "Processing";

      debugger;
        let fromDate = this.BrsStatementsReport.controls['fromDate'].value;
        let toDate = this.BrsStatementsReport.controls['toDate'].value;
        //fromDate = this._CommonService.getFormatDateNormal(fromDate);
        //toDate = this._CommonService.getFormatDateNormal(toDate);
       let bankid = this.BrsStatementsReport.controls['pbankname'].value;
       let transtype = this.BrsStatementsReport.controls['Bank'].value;
      // let branchschema = this._CommonService.getschemaname();

        // this._bankBookService.GetBrsReportBankDebitsBankCredits(fromDate, toDate, bankid,transtype,branchschema).subscribe(res => {
        //   debugger;
        //   this.disablesavebutton = false;
        //   this.savebutton = "Show";
        //   this.GridData = res;
        //   this.totalAmount = this.GridData.reduce((sum, c) => sum + parseFloat(c.ptotalamount), 0);
        //   debugger
          
        //   // this.GridData = this.GridData.reverse(); 
        //   let value
        //   this.pageCriteria.totalrows = this.GridData.length;
        //   this.pageCriteria.TotalPages=1;
        //   this.pageCriteria.CurrentPage=1;
        //   if (this.pageCriteria.totalrows > 10) {
        //     value = this.pageCriteria.totalrows / 10;
        //     if (value.toString().includes('.')) {
        //       this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / 10).toString()) + 1;
        //     }
        //     else {
        //       this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / 10).toString());
        //     }
        //   }
        //   if (this.GridData.length < this.pageCriteria.pageSize) {
        //     this.pageCriteria.currentPageRows = this.GridData.length;
        //   }
        //   else {
        //     this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
        //   }

        //   console.log(this.GridData)
        // }, error => {
        //   this.disablesavebutton = false;
        //   this.savebutton = "Show";
        // })
     
    
  }
 
  
  setPageModel() {
    // this.pageCriteria.pageSize = this._CommonService.pageSize;
    // this.pageCriteria.offset = 0;
    // this.pageCriteria.pageNumber = 1;
    // this.pageCriteria.footerPageHeight = 50;
  }
  onFooterPageChange(event:any): void {
    // this.pageCriteria.offset = event.page - 1;
    // this.pageCriteria.CurrentPage = event.page;
    // if (this.pageCriteria.totalrows < event.page * this.pageCriteria.pageSize) {
    //   this.pageCriteria.currentPageRows = this.pageCriteria.totalrows % this.pageCriteria.pageSize;
    }
  //   else {
  //     this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
  //   }
  // }
 
  pdfOrprintCredit(printorpdf: any) {
    debugger;
    let rows = [];
    let reportname = this.reportName;
    let gridheaders = ["Receipt Date", "Receipt No", "Amount", "Cheque No ", "Cheque Date", "Deposit Date", "Cleared Date","Particular"];
    
    //let fromDate = this._CommonService.getFormatDateGlobal(this.BrsStatementsReport.controls.fromDate.value);
    //let toDate = this._CommonService.getFormatDateGlobal(this.BrsStatementsReport.controls.toDate.value);
    this.startDate = this.fromDate;
    this.endDate = this.toDate;
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

    this.GridData.forEach((element:any) => {
      debugger;
      let temp = [];
      //let ptotalamount = this._CommonService.convertAmountToPdfFormat(element.ptotalamount);

      if (element.pissuedate) {
        //this.pissuedate = this._CommonService.getDateObjectFromDataBase(element.pissuedate)
        //this.pissuedate = this._CommonService.getFormatDateGlobal(element.pissuedate);
      }
      else {
        this.pissuedate = "--NA--";
      }
      if (element.pissuedate) {
       // this.pissuedate = this._CommonService.getDateObjectFromDataBase(element.pissuedate)
        //this.pissuedate = this._CommonService.getFormatDateGlobal(element.pissuedate);
      }
      else {
        this.pissuedate = "--NA--";
      }


      if (element.pclearDate !='[object Object]') {
        //this.pclearDate = this._CommonService.getDateObjectFromDataBase(element.pclearDate)
       // this.pclearDate = this._CommonService.getFormatDateGlobal(element.pclearDate);
      }
      else {
        this.pclearDate = "--NA--";
      }
     
     // temp = [this.pissuedate, element.ptransactionno, ptotalamount, element.preferencenumber?element.preferencenumber:"--NA--", element.preferencenumber!=''?this.pissuedate:'-NA-', element.preferencenumber!=''?this.pissuedate:'-NA-', this.pclearDate, element.pparticulars];
      //rows.push(temp);
    });

   // let temp = ["", "Total",  this._CommonService.convertAmountToPdfFormat(this.totalAmount), "","", "", "",""]
   // rows.push(temp);
   // this._CommonService._downloadReportsPdf(reportname, rows, gridheaders, colWidthHeight, "a4", "Between", this.startDate, this.endDate, printorpdf);
  }

  pdfOrprintDebit(printorpdf: any) {
    debugger;
    let rows = [];
    let reportname = this.reportName;
    let gridheaders = ["Trans Date", "Trans No", "Cheque No", "Amount", "Cleared Date", "Particular"];
    
   // let fromDate = this._CommonService.getFormatDateGlobal(this.BrsStatementsReport.controls.fromDate.value);
   // let toDate = this._CommonService.getFormatDateGlobal(this.BrsStatementsReport.controls.toDate.value);
    this.startDate = this.fromDate;
    this.endDate = this.toDate;
    let colWidthHeight = {
            0: { cellWidth: 'auto', halign: 'center' },
            1: { cellWidth: 'auto', halign: 'left' },
            2: { cellWidth: 'auto', halign: 'left' },
            3: { cellWidth: 'auto', halign: 'right' },
            4: { cellWidth: 'auto', halign: 'center' },
            5: { cellWidth: 'auto', halign: 'left' },
          }

    this.GridData.forEach((element:any) => {
      debugger;
      let temp = [];
      //let ptotalamount = this._CommonService.convertAmountToPdfFormat(element.ptotalamount);
     
      if (element.pissuedate) {
       // this.pissuedate = this._CommonService.getDateObjectFromDataBase(element.pissuedate)
       // this.pissuedate = this._CommonService.getFormatDateGlobal(element.pissuedate);
      }
      else {
        this.pissuedate = "--NA--";
      }
      if (element.pclearDate !='[object Object]') {
        //this.pclearDate = this._CommonService.getDateObjectFromDataBase(element.pclearDate)
        //this.pclearDate = this._CommonService.getFormatDateGlobal(element.pclearDate);
      }
      else {
        this.pclearDate = "--NA--";
      }
     
      //temp = [this.pissuedate,element.ptransactionno, element.preferencenumber, ptotalamount, this.pclearDate, element.pparticulars?element.pparticulars:"--NA--"];
      //rows.push(temp);
    });
   
    // let temp = ["", "Total","",  this._CommonService.convertAmountToPdfFormat(this.totalAmount), "", "", "",""]
    // rows.push(temp);
    //   this._CommonService._downloadReportsPdf(reportname, rows, gridheaders, colWidthHeight, "a4", "Between", this.startDate, this.endDate, printorpdf);
 


  }

    exportBankDebit(): void {
      let rows: { "Trans Date": any; "Trans No": any; "Cheque No": any; Amount: any; "Cleared Date": any; Particular: any; }[] = [];  
      this.GridData.forEach((element: { ptotalamount: any; pclearDate: string; pissuedate: any; ptransactionno: any; preferencenumber: any; pparticulars: any; }) => {
        debugger;
       // let ptotalamount = this._CommonService.convertAmountToPdfFormat(element.ptotalamount);
        //let pclearDate = element.pclearDate !='[object Object]'?this._CommonService.getFormatDateGlobal(element.pclearDate):'--NA--';
        //let pissuedate = this._CommonService.getFormatDateGlobal(element.pissuedate);
        //let temp;
        let dataobject;
        dataobject = {
          //"Trans Date":pissuedate,
          "Trans No":element.ptransactionno,
          "Cheque No":element.preferencenumber,
          //"Amount":ptotalamount,
          //"Cleared Date":pclearDate,
          "Particular":element.pparticulars?element.pparticulars:"--NA--",
       
        }
       // rows.push(dataobject);
      });
     // this._CommonService.exportAsExcelFile(rows, 'BankDebit');
    } 

    exportBankCredit(): void {
      let rows: { "Receipt Date": any; "Receipt No": any; Amount: any; "Cheque No ": any; "Cheque Date": any; "Deposit Date": any; "Cleared Date": any; Particular: any; }[] = [];  
      this.GridData.forEach((element: { ptotalamount: any; pclearDate: string; pissuedate: any; ptransactionno: any; preferencenumber: string; pparticulars: any; }) => {
        debugger;
        //let ptotalamount = this._CommonService.convertAmountToPdfFormat(element.ptotalamount);
       // let pclearDate = element.pclearDate !='[object Object]'?this._CommonService.getFormatDateGlobal(element.pclearDate):'--NA--';
       // let pissuedate = this._CommonService.getFormatDateGlobal(element.pissuedate);
       // let DepositDate = this._CommonService.getFormatDateGlobal(element.pissuedate);
        //let ReceiptDate = this._CommonService.getFormatDateGlobal(element.pissuedate);
        //let temp;
        let dataobject;
        dataobject = {
         // "Receipt Date":pissuedate,
          "Receipt No":  element.ptransactionno,
          //"Amount":ptotalamount,
          "Cheque No ":element.preferencenumber?element.preferencenumber:"--NA--",
         // "Cheque Date":element.preferencenumber!=''?pissuedate:'-NA-',
        //  "Deposit Date":element.preferencenumber!=''?pissuedate:'-NA-',
         // "Cleared Date":pclearDate,
          "Particular": element.pparticulars,
       
        }
       // rows.push(dataobject);
      });
      //this._CommonService.exportAsExcelFile(rows, 'BankCredit');
    } 


}

 





