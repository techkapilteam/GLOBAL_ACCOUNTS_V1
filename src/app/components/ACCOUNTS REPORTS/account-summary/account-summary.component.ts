import { CommonModule, DatePipe } from '@angular/common';
import { Component, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
//import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
//import { GroupDescriptor } from '@progress/kendo-data-query';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@Component({
  selector: 'app-account-summary',
  imports: [NgxDatatableModule,CommonModule,ReactiveFormsModule,BsDatepickerModule,FormsModule],
  standalone:true,
  providers:[DatePipe],
  templateUrl: './account-summary.component.html',
  styleUrl: './account-summary.component.css',
})
export class AccountSummaryComponent {

  // public groups: GroupDescriptor[] = [{
  //   field: 'pparentname', aggregates: [{ field: "pdebitamount", aggregate: "sum" }, { field: "pcreditamount", aggregate: "sum" }],
  // }];

  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dppConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  currencysymbol: any;
  public  AsOnDate:any;
  public Showhide = true;
 // pageCriteria: PageCriteria;
  @Output() printedDate: any;
  @ViewChild('myTable') table: any;
  //checkValidations: any;
  constructor(private datePipe: DatePipe, /*private _reportservice: AccountingReportsService*//*private _commonservice: CommonService*/ private fb: FormBuilder, private datepipe: DatePipe) {
    //this.currencysymbol = this._commonservice.datePickerPropertiesSetup("currencysymbol");
    //this.dpConfig.dateInputFormat = this._commonservice.datePickerPropertiesSetup("dateInputFormat");
   // this.dpConfig.containerClass = this._commonservice.datePickerPropertiesSetup("containerClass");
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.maxDate = new Date();

    this.dppConfig.maxDate = new Date();
    this.dppConfig.minDate = new Date();
   // this.dppConfig.dateInputFormat = this._commonservice.datePickerPropertiesSetup("dateInputFormat");
   // this.dppConfig.containerClass = this._commonservice.datePickerPropertiesSetup("containerClass");
    this.dppConfig.showWeekNumbers = false;
    //this.pageCriteria = new PageCriteria();
  }
  ledgeraccountslist: any;
  Accontsummaryform!: FormGroup;
  fromdate: any;
  date: any;
  FromDate: any;
  inbetween: any;
  id: any;
  hidegridcolumn = true;
  ledger = true;
  showdate = true;
  todate: any;
  selecteddate = true;
  validationforledger = false;
  validation = false;
  betweenfrom: any;
  caldebitamount: any;
  savebutton = "Generate Report"
  public isLoading = false;
  public loading = false;
  calcreditamount: any;
  betweento: any;
  showicons=false
  betweendates: any;
  totaldebitamount:any;
  totalcreditamount:any;
  gridData: any = [];
  accountid = [];
  accountsummaryvalidations: any = {};
  //commencementgridPage = new Page();
  startindex: any;
  endindex: any
  ngOnInit() {
    this.printedDate = true;
    this.setPageModel();
    this.Accontsummaryform = this.fb.group({
      dfromdate: [''],
      dtodate: [''],
      pledgerid: ['', Validators.required],
      date: ['']
    })
    this.totalcreditamount=0;
    this.totaldebitamount=0;
    this.FromDate = 'From Date'
    this.date = new Date();
    this.betweendates = "As On"
    this.inbetween = ""
    this.showdate = false;
    this.todate = "";
    this.FromDate = ''
    this.hidegridcolumn = false;
    this.ledger = true
    this.AsOnDate='T';
    this.Accontsummaryform['controls']['date'].setValue(true)
    this.Accontsummaryform['controls']['dfromdate'].setValue(this.date);
    this.Accontsummaryform['controls']['dtodate'].setValue(this.date);
    this.betweenfrom = this.datepipe.transform(this.date, "dd-MMM-yyyy");
   // this._reportservice.GetLedgerSummaryAccountList('ACCOUNT LEDGER').subscribe(json => {

      //let JSONDATA = json
      // console.log(json)
      //if (json != null) {
      //  this.ledgeraccountslist = json;
      }
    //},
  //     (error) => {
  //       this._commonservice.showErrorMessage(error);
  //     });
  //   this.BlurEventAllControll(this.Accontsummaryform);
  //   this.Showhide = true;
  // }

  setPageModel() {
    // this.pageCriteria.pageSize = this._commonservice.pageSize;
    // this.pageCriteria.offset = 0;
    // this.pageCriteria.pageNumber = 1;
    // this.pageCriteria.footerPageHeight = 50;
  }

  onFooterPageChange(event:any): void {
    // this.pageCriteria.offset = event.page - 1;
    // if (this.pageCriteria.totalrows < event.page * this.pageCriteria.pageSize) {
    //   this.pageCriteria.currentPageRows = this.pageCriteria.totalrows % this.pageCriteria.pageSize;
    // }
    // else {
    //   this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
    // }
  }
  checkfromdate() {


    // this.fromdate = this.Accontsummaryform['controls']['dfromdate'].value
    // this.fromdate = this.datepipe.transform(this.fromdate, "dd/MM/yyyy");
    // this.validationfordates()
    // if (this.fromdate > this.todate) {
    //   this.validation = true;
    // }
    // else {
    //   this.validation = false;
    // }

  }


  public ToDateChange(event:any) {

    this.dppConfig.minDate = event;
  }
  public FromDateChange(event:any) {
    this.dpConfig.maxDate = event;
    //this.CashBookReportForm['controls']['fromDate'].setValue(event)
  }


  checktodate() {

    // this.todate = this.Accontsummaryform['controls']['dtodate'].value
    // this.todate = this.datepipe.transform(this.todate, "dd/MM/yyyy");

    // this.validationfordates()
    // if (this.fromdate > this.todate) {
    //   this.validation = true;
    // }
    // else {
    //   this.validation = false;
    // }

  }
  validationfordates() {

    let isValid = true;


    if (this.selecteddate == true) {
      this.fromdate = this.Accontsummaryform.controls['dfromdate'].value
      this.todate = this.Accontsummaryform.controls['dfromdate'].value
    }
    else {
      this.fromdate = this.Accontsummaryform.controls['dfromdate'].value
      this.todate = this.Accontsummaryform.controls['dtodate'].value
    }
    this.fromdate = this.datepipe.transform(this.fromdate, "yyyy/MM/dd");
    this.todate = this.datepipe.transform(this.todate, "yyyy/MM/dd");
    return isValid
  }


  checkox(event:any) {
debugger;

    this.Accontsummaryform.controls['dfromdate'].setValue(new Date());
    this.Accontsummaryform.controls['dtodate'].setValue(new Date());
    // $("#MultiSelctdropdown").val(null).trigger('change')
    // $("#MultiSelctdropdown").val(null).trigger('change')
    this.Accontsummaryform.controls['pledgerid'].setValue(null);
    this.accountsummaryvalidations = {};
    this.gridData = []
    this.caldebitamount = 0;
    this.calcreditamount = 0;
    if (event.target.checked == false) {
      this.selecteddate = false
      this.showdate = true;
      this.betweendates = "Between"
      this.FromDate = 'From Date'
      this.inbetween = "And";
      this.validationfordates();
      this.betweenfrom = this.datepipe.transform(this.fromdate, "dd-MMM-yyyy");
      this.betweento = this.datepipe.transform(this.todate, "dd-MMM-yyyy");

      this.hidegridcolumn = true;
      this.AsOnDate='F';

    }
    else {
      this.AsOnDate='T';
      this.betweendates = "As On";
      this.inbetween = "";
      this.showdate = false;
      this.selecteddate = true;
      this.todate = "";
      this.FromDate = '';
      this.betweento = ""
      this.betweenfrom = this.datepipe.transform(this.date, "dd-MMM-yyyy");
      this.hidegridcolumn = false;
    }
  }
  generateaccountsummary() {

    this.validationfordates();

    // let dropdowndata = $("#MultiSelctdropdown").val();
    debugger;
    let isValid = true;
    if (this.checkValidations(this.Accontsummaryform, isValid)) {
      this.loading = true
      this.isLoading = true;
      this.savebutton = 'Processing';
      let dropdowndata = this.Accontsummaryform.controls['pledgerid'].value.toString();
      // this.validationforledger = false;
      this.accountid = dropdowndata
      this.caldebitamount = 0;
      this.calcreditamount = 0;
      this.betweenfrom = this.datepipe.transform(this.fromdate, "dd-MMM-yyyy");
      if (this.selecteddate == true) {
        this.betweento = ""
      }
      else {
        this.betweento = this.datepipe.transform(this.todate, "dd-MMM-yyyy");
      }
     // let fromdate = this._commonservice.getFormatDateNormal(this.Accontsummaryform['controls']['dfromdate'].value);
      //let todate = this._commonservice.getFormatDateNormal(this.Accontsummaryform['controls']['dtodate'].value);

      debugger;
      //
     // this._reportservice.GetLedgerSummary(fromdate, todate, this.accountid,this.AsOnDate,'').subscribe(res => {
        this.Showhide = false;
        this.loading = false
        this.isLoading = false;
        this.savebutton = 'Generate Report';
       // if (res.length != 0) {
          //this.Accontsummaryform.controls.pledgerid.setValue("")
          //this.BlurEventAllControll(this.Accontsummaryform);
          this.accountsummaryvalidations = {};
        }
       // this.gridData = res;
        if(this.gridData.length>0)
        {
          this.showicons=true
        }
        else{
          this.showicons=false
        }
        // this.totaldebitamount = this.gridData.reduce((sum, c) => sum + c.pdebitamount, 0);
        // this.totalcreditamount = this.gridData.reduce((sum, c) => sum + c.pdebitamount, 0);
        for (let i = 0; i < this.gridData.length; i++) {
          if (this.gridData[i].pdebitamount < 0) {
            let debitamount = Math.abs(this.gridData[i].pdebitamount)
            this.gridData[i].pdebitamount = debitamount
          }
          if (this.gridData[i].pcreditamount < 0) {
            let creditamount = Math.abs(this.gridData[i].pcreditamount)
            this.gridData[i].pcreditamount = creditamount
          }
          this.caldebitamount = this.caldebitamount + this.gridData[i].pdebitamount
          this.calcreditamount = this.calcreditamount + this.gridData[i].pcreditamount
          if (this.gridData[i].popeningbal < 0) {
            let openingbal = Math.abs(this.gridData[i].popeningbal).toFixed(2);
            //this.gridData[i].popeningbal = this._commonservice.currencyformat(openingbal) + ' ' + " Cr";
            this.gridData[i].pFormName=" Cr";
          }
          else if (this.gridData[i].popeningbal == 0) {
            this.gridData[i].popeningbal = 0
          }
          else {
            let popeningbal = (this.gridData[i].popeningbal).toFixed(2);
           // this.gridData[i].popeningbal = this._commonservice.currencyformat(popeningbal) + ' ' + " Dr";
            this.gridData[i].pFormName=" Dr";
          }
          if (this.gridData[i].pclosingbal < 0) {
            let closingbal = Math.abs(this.gridData[i].pclosingbal).toFixed(2);

           // this.gridData[i].pclosingbal = this._commonservice.currencyformat(closingbal) + ' ' + " Cr";
            this.gridData[i].pBalanceType=" Cr";
          }
          else if (this.gridData[i].pclosingbal == 0) {
            this.gridData[i].pclosingbal = 0
          }
          else {
           // this.gridData[i].pclosingbal = this._commonservice.currencyformat(this.gridData[i].pclosingbal) + ' ' + " Dr";
            this.gridData[i].pBalanceType=" Dr";
          }
        }
        this.gridData.filter((data:any) => {

          // let DateFormat = data.ptransactiondate.split(' ')[0];
          // DateFormat = this._commonservice.formatDateFromDDMMYYYY(DateFormat);
          // console.log(DateFormat);
          // data.ptransactiondate = this._commonservice.DateFormatForGrid(data.ptransactiondate);

        })
     // },
    //   (error) => {
    //     this._commonservice.showErrorMessage(error);
    //   })

    //   this.BlurEventAllControll(this.Accontsummaryform);
    //   this.accountsummaryvalidations = {};

    // }
    // else {
    //   this.isLoading = false;
    //   this.savebutton = 'Generate Report';
    // }
    // $("#MultiSelctdropdown").val(null).trigger('change')
  }
// Excel implimentation by Harsha 23-09-21
  export(): void{
    let rows: {
      "Ledger Name": any; Particulars: any; "Max Transaction Date": any;
      //"Debit Amount.": debitvalue,
      //"Credit Amount": creditvalue
      "Debit Amount.": any; "Credit Amount": any;
    }[] = [];
    this.gridData.forEach((element:any) => {

      let debitvalue = 0;
      let creditvalue = 0;
      let mintransactiondate;
  
      if (element.pdebitamount != 0) {
        // debitvalue = this._commonservice.currencyformat(element.pdebitamount);
        // debitvalue = this._commonservice.convertAmountToPdfFormat(debitvalue);
      }
      if (element.pcreditamount != 0) {
        // creditvalue = this._commonservice.currencyformat(element.pcreditamount);
        // creditvalue = this._commonservice.convertAmountToPdfFormat(creditvalue);
      }
      if (element.ptransactiondate == null) {
        mintransactiondate = "";
      }
      else {
        //mintransactiondate = this._commonservice.getFormatDateGlobal(element.ptransactiondate);
      }
      
      let dataobject;
      dataobject = {
        "Ledger Name": element.pparentname,
        "Particulars":element.paccountname,
        "Max Transaction Date":mintransactiondate,
        //"Debit Amount.": debitvalue,
        //"Credit Amount": creditvalue
        "Debit Amount.": element.pdebitamount,
        "Credit Amount": element.pcreditamount        
      }
      rows.push(dataobject);
    });
    //this._commonservice.exportAsExcelFile(rows, 'Account_Summary');
  }



  checkValidations(group: FormGroup, validate: boolean): boolean {

    try {
      Object.keys(group.controls).forEach((key: string) => {
        validate = this.GetValidationByControl(group, key, validate);
      })
    }
    catch (e) {
     // this.showErrorMessage(e);
      return false;
    }
    return validate;
  }
  GetValidationByControl(formGroup: FormGroup, key: string, validate: boolean): boolean {

    try {
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, validate)
        }
        else if (formcontrol.validator) {
          this.accountsummaryvalidations[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                //errormessage = this._commonservice.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.accountsummaryvalidations[key] += errormessage + ' ';
                validate = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
     // this.showErrorMessage(e);
      return false;
    }
    return validate;
  }
  showErrorMessage(errormsg: string) {

    //this._commonservice.showErrorMessage(errormsg);
  }

  // BlurEventAllControll(fromgroup: FormGroup) {
  //   try {
  //     Object.keys(fromgroup.controls).forEach((key: string) => {
  //       this.setBlurEvent(fromgroup, key);
  //     })
  //   }
  //   catch (e) {
  //     //this.showErrorMessage(e);
  //     return false;
  //   }
  // }

  BlurEventAllControll(fromgroup: FormGroup): boolean {
  try {
    Object.keys(fromgroup.controls).forEach((key: string) => {
      this.setBlurEvent(fromgroup, key);
    });
    return true; 
  }
  catch (e) {
    //this.showErrorMessage(e);
    return false;
  }
}



  // setBlurEvent(fromgroup: FormGroup, key: string) {
  //   try {
  //     let formcontrol;
  //     formcontrol = fromgroup.get(key);
  //     if (formcontrol) {
  //       if (formcontrol instanceof FormGroup) {
  //         this.BlurEventAllControll(formcontrol)
  //       }
  //       else {
  //         //if (formcontrol.validator)
  //          // fromgroup.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
  //       }
  //     }
  //   }
  //   catch (e) {
  //     //this.showErrorMessage(e);
  //     return false;
  //   }
  // }


  setBlurEvent(fromgroup: FormGroup, key: string): boolean {
  try {
    let formcontrol = fromgroup.get(key);

    if (formcontrol) {
      if (formcontrol instanceof FormGroup) {
        this.BlurEventAllControll(formcontrol);
      } else {
        // fromgroup.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
      }
    }
    return true;  
  } catch (e) {
    // this.showErrorMessage(e);
    return false;
  }
}


  pdfOrprint(printorpdf:any) {
    debugger;
    let rows = [];
    let rows1 = [];
    let openingbal;
    let debitamt;
    let creditamt;
    let closingbal;
    let mintransactiondate;
    let reportname = "Account Summary";
    let gridheaders = ["Particulars","Max Transaction Date", "Opening Balance", "Debit Amount", "Credit Amount", "Closing Balance"];
    let gridheaders1 = ["Particulars","Max Transaction Date", "Debit Amount", "Credit Amount"];
    //"Min Transaction Date" added on 02.04.2025

    let format = this.Accontsummaryform['controls']['dfromdate'].value;
    //let fromDate = this._commonservice.getFormatDateGlobal(format);

    let formattodate = this.Accontsummaryform['controls']['dtodate'].value;
   // let toDate = this._commonservice.getFormatDateGlobal(formattodate);


    let colWidthHeight :any;
   // let retungridData = this._commonservice._getGroupingGridExportData(this.gridData, "pparentname", false)
    debugger;
    // retungridData.forEach((element:any) => {
    //   debugger;
    //   let temp;
    //   let temp1;
    //   if(element.popeningbal!=0){
    //   openingbal = this._commonservice.convertAmountToPdfFormat(element.popeningbal)+element.pFormName;
    //   }
    //   else{
    //     openingbal ="";
    //   }
    //   if(element.pdebitamount!=0){
    //   debitamt = this._commonservice.convertAmountToPdfFormat(this._commonservice.currencyformat(element.pdebitamount));
    //   }
    //   else{
    //     debitamt="";
    //   }
    //   if(element.pcreditamount!=0){
    //     creditamt = this._commonservice.convertAmountToPdfFormat(this._commonservice.currencyformat(parseFloat(element.pcreditamount)));

    //   }
    //   else{
    //     creditamt="";
    //   }
    //   if(element.pclosingbal!=0)
    //   {
    //     closingbal = this._commonservice.convertAmountToPdfFormat(element.pclosingbal)+element.pBalanceType;
    //   }
    //   else{
    //     closingbal="";
    //   }
    //   if (element.ptransactiondate == null) {
    //     mintransactiondate = "";
    //   }
    //   else {
    //     mintransactiondate = this._commonservice.getFormatDateGlobal(element.ptransactiondate);
    //   }
    //   // let temp = [formatDate(element.ptransactiondate, 'dd-MM-yyyy', 'en-IN'), element.ptransactionno, element.pparticulars,element.pdescription, element.pdebitamount, element.pcreditamount, element.pclosingbal];
    //   if (element.group !== undefined) {
    //     temp = [element.group];
    //     temp1 = [element.group];
    //   }
    //   else {
    //     temp = [element.paccountname, mintransactiondate,openingbal, debitamt, creditamt, closingbal];
    //     temp1 = [element.paccountname,mintransactiondate,  debitamt, creditamt];
    //   }
    //   rows.push(temp);
    //   rows1.push(temp1);
    // });
    let totals;
    let grandtotals;
    // pass Type of Sheet Ex : a4 or lanscspe  
    if (this.AsOnDate == "T") { 
      colWidthHeight={
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto', halign: 'center' },
        2: { cellWidth: 'auto', halign: 'right' },
        3: { cellWidth: 'auto', halign: 'right' }
      }
    // totals=["Total",'',this._commonservice.convertAmountToPdfFormat(this.caldebitamount),this._commonservice.convertAmountToPdfFormat(this.calcreditamount)];
     grandtotals=[
      {content:"Grand Total",colSpan:2,styles: {halign: 'center'}},
      //{content:this._commonservice.convertAmountToPdfFormat(this.caldebitamount-this.calcreditamount),colSpan:3,styles: {halign: 'center'}}
    ];
      rows1.push(totals);
      rows1.push(grandtotals);
     //this._commonservice._downloadReportsPdfAccountSummaryason(reportname, rows1, gridheaders1, colWidthHeight, "a4", this.betweendates, fromDate, toDate, printorpdf);
    }
    else {
      colWidthHeight={
        0: { cellWidth: 'auto' , halign: 'left' },
        1: { cellWidth: 'auto', halign: 'center' },
        2: { cellWidth: 'auto', halign: 'right' },
        3: { cellWidth: 'auto', halign: 'right' },
        4: { cellWidth: 'auto', halign: 'right' },
        5: { cellWidth: 'auto', halign: 'right' },
      }
     // totals=["Total","","",this._commonservice.convertAmountToPdfFormat(this.caldebitamount),this._commonservice.convertAmountToPdfFormat(this.calcreditamount),""]
     grandtotals=[
      {content:"Grand Total",colSpan:1,styles: {halign: 'center'}},
      "",
      "",
    //  {content:this._commonservice.convertAmountToPdfFormat(this.caldebitamount-this.calcreditamount),colSpan:2,styles: {halign: 'center'}},
      ""];
      rows.push(totals);
      rows.push(grandtotals);
      //this._commonservice._downloadReportsPdfAccountSummary(reportname, rows, gridheaders, colWidthHeight, "landscape", this.betweendates, fromDate, toDate, printorpdf);
    }
  }


  toggleExpandGroup(group:any) {
    debugger;
    console.log('Toggled Expand Group!', group);
    this.table.groupHeader.toggleExpandGroup(group);
  }

  onDetailToggle(event:any) {
    console.log('Detail Toggled', event);
  }
  

  pdfOrPrint(type: 'Pdf' | 'Print') {
  console.log('Action:', type);
  
}
}





  


