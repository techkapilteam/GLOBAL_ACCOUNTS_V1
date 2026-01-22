import { CommonModule, DatePipe } from '@angular/common';
import { Component, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-brs',
  standalone:true,
  imports: [BsDatepickerModule,ReactiveFormsModule,CommonModule,CommonModule,NgxDatatableModule],
  templateUrl: './brs.component.html',
  styleUrl: './brs.component.css',
   providers: [ DatePipe]
})
export class BrsComponent {

  public loading = false;
  public BRStatmentForm!: FormGroup;
  public submitted = false;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public paymentVouecherServicesData: any;
  public today: Date = new Date();
  public bankData: any;
  public gridView: any;
  public startDate: any;
  public bankname: any;
  @Output() printedDate: any;
  @ViewChild('myTable') table: any;
  public pBankBookBalance: any;
  public bankBalance: any;
  public show = false;
  public BalanceBRS: any;
  public chequesdepositedbutnotcrediteddecimal: any;
  public chequesdepositedbutnotcredited: any;
  public CHEQUESISSUEDBUTNOTCLEAREDdecimal: any;
  public CHEQUESISSUEDBUTNOTCLEARED: any;
  public Balanceasperbankbook: any;
  public BalanceAsperBankBook: any;
  public savebutton = 'Generate Report';
  public isLoading = false;
  public pBankBookBalancenagitive: any;
  currencysymbol: any;
  public Showhide = true;
 // pageCriteria: PageCriteria;
  public BrsBalance: any;
  public BankBalance: any = [];
  public aggregates: any[] = [{ field: 'ptotalreceivedamount', aggregate: 'sum' }];
  //public groups: GroupDescriptor[] = [{ field: 'pGroupType', aggregates: this.aggregates }];
  totaldeposit:any;
  totalissued:any;
  chequesInfo: any;
  ChequesInfoDetails: any;
  public selectedvalues: any = []
  dbdate:any;
  imageResponse: any;
  kycFileName: any;
  kycFilePath: any;
  brstatement: any;
  constructor(private datePipe: DatePipe, private _routes: Router, private formbuilder: FormBuilder, /*private _CommonService: CommonService*//*private _bankBookService: BankBookService*//*private brstatement: BrStatementService*/) {
   // this.currencysymbol = this._CommonService.datePickerPropertiesSetup("currencysymbol");
    //this.dpConfig.dateInputFormat = this._CommonService.datePickerPropertiesSetup("dateInputFormat");
    //this.dpConfig.containerClass = this._CommonService.datePickerPropertiesSetup("containerClass");
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.maxDate = new Date();

   // this.dpConfig1.dateInputFormat = this._CommonService.datePickerPropertiesSetup("dateInputFormat");
   // this.dpConfig1.containerClass = this._CommonService.datePickerPropertiesSetup("containerClass");
    this.dpConfig1.showWeekNumbers = false;
    this.dpConfig1.maxDate = new Date();

   // this.pageCriteria = new PageCriteria();
  }
 // commencementgridPage = new Page();
  startindex: any;
  endindex: any
  roleid: string='';

  ngOnInit() {
    this.dbdate = sessionStorage.getItem("Dbtime");
    this.printedDate = true;
    this.setPageModel();
    this.submitted = false;
    this.BRStatmentForm = this.formbuilder.group({
      fromDate: [new Date(this.dbdate)],
      toDate:[new Date()],
      pbankname: ['', Validators.required],
      pbankbalance: [0],
      pFilename: [''],
    })
    this.bankBookDetails();
    this.Showhide = true;
   // this.roleid = sessionStorage.getItem("roleid"); 
    if(!this.chequesInfo){
      //this.dpConfig.minDate = new Date(new Date(this.dbdate).setDate(new Date(this.dbdate).getDate()-3));
      if (this.roleid == '2') {
        //this.dpConfig.minDate = new Date(new Date(this.dbdate).setDate(new Date(this.dbdate).getDate())-30);
      }
      else {
        this.dpConfig.minDate = new Date(new Date(this.dbdate).setDate(new Date(this.dbdate).getDate()-3));
      }
    }
  }

  setPageModel() {
    // this.pageCriteria.pageSize = this._CommonService.pageSize;
    // this.pageCriteria.offset = 0;
    // this.pageCriteria.pageNumber = 1;
    // this.pageCriteria.footerPageHeight = 50;
  }
  ChequesInfo(event:any){
    this.chequesInfo = event.target.checked;
    this.BRStatmentForm.controls['fromDate'].setValue(new Date());
    if(event.target.checked){
      //this.dpConfig.minDate = null;
    }else{
      this.dpConfig.minDate = new Date(new Date(this.dbdate).setDate(new Date(this.dbdate).getDate()-3));
    }
    this.BRStatmentForm.controls['pbankbalance'].setValue(0)
    this.BRStatmentForm.controls['pFilename'].setValue('')
  }
  onFooterPageChange(event:any): void {
    //  this.pageCriteria.offset = event.page - 1;
    //  if (this.pageCriteria.totalrows < event.page * this.pageCriteria.pageSize) {
    //   this.pageCriteria.currentPageRows = this.pageCriteria.totalrows % this.pageCriteria.pageSize;
    //  }
    // else {
    //   this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
    // }
  }
  get f() { return this.BRStatmentForm.controls; }

  public showErrorMessage(errormsg: string) {
   // this._CommonService.showErrorMessage(errormsg);
  }

  public showInfoMessage(errormsg: string) {
    //this._CommonService.showInfoMessage(errormsg);
  }

  //----------------VALIDATION----------------------- //
  public checkValidations(group: FormGroup, isValid: boolean): boolean {
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e) {
      //this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  public GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    try {
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.paymentVouecherServicesData[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
              //  errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.paymentVouecherServicesData[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }

    catch (e) {
      //this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }

  // public BlurEventAllControll(fromgroup: FormGroup) {
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

  public BlurEventAllControll(fromgroup: FormGroup): boolean {
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


  // public setBlurEvent(fromgroup: FormGroup, key: string) {
  //   try {
  //     let formcontrol;
  //     formcontrol = fromgroup.get(key);
  //     if (formcontrol) {
  //       if (formcontrol instanceof FormGroup) {
  //         this.BlurEventAllControll(formcontrol)
  //       }
  //       // else {
  //       //   if (formcontrol.validator)
  //       //     //fromgroup.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
  //       // }
  //     }
  //   }
  //   catch (e) {
  //     //this.showErrorMessage(e);
  //     return false;
  //   }
  // }

  public setBlurEvent(fromgroup: FormGroup, key: string): boolean {
  try {
    const formcontrol = fromgroup.get(key);
    if (formcontrol) {
      if (formcontrol instanceof FormGroup) {
        this.BlurEventAllControll(formcontrol);
      }
      
    }
    return true; 
  }
  catch (e) {
    //this.showErrorMessage(e);
    return false; 
  }
}



  public bankBookDetails() {
    // this._bankBookService.GetBankNames().subscribe(res => {

    //   this.bankData = res;
    // },
      // (error) => {
      //   this.showErrorMessage(error);
      // });
  }

  public getBRStatmentReports() {

    this.gridView = [];
    this.bankname = '';
    this.startDate = '';
    this.show = false;
    this.submitted = true;
    if (this.BRStatmentForm.valid) {
      this.loading = true;
      this.isLoading = true;
      this.savebutton = 'Processing';
      try {

        this.BRStatmentForm.value;
        //let fromDate = this._CommonService.getFormatDateNormal(this.BRStatmentForm['controls']['fromDate'].value);
       // let todate = this._CommonService.getFormatDateNormal(this.BRStatmentForm['controls']['toDate'].value);
        let pbankname = this.BRStatmentForm['controls']['pbankname'].value;
        let filterResult: any = this.bankData.filter((u:any) =>
          u.pbankaccountid == pbankname);

        this.bankname = filterResult[0].pbankname
        // this.bankname = this.bankData.filter(item => item.pbankaccountid === pbankname);

        this.startDate = this.BRStatmentForm['controls']['fromDate'].value;
        if(!this.chequesInfo){
        this.brstatement.GetBRSBankbalance(/*fromDate*/ pbankname).subscribe((res:any) => {
          if (res) {
            debugger;
            //this.pBankBookBalance=res;
            this.BankBalance = res;
            console.log(this.BankBalance);
            let TotalAmount = this.BankBalance[0]['pBankBookBalance'];
            this.BrsBalance = TotalAmount < 0 ? '(' + Math.abs(TotalAmount).toFixed(2) + ')' : TotalAmount.toFixed(2);
            if (TotalAmount < 0) {
             // this.BalanceBRS = '(' + this._CommonService.currencyformat(Math.abs(TotalAmount).toFixed(2)) + ')';
            }
            else {
             // this.BalanceBRS = this._CommonService.currencyformat(Math.abs(TotalAmount).toFixed(2));
              //this._CommonService.convertAmountToPdfFormat(this._CommonService.currencyformat(TotalAmount));
            }
          }
        });
       
        this.brstatement.GetBrStatementReportbyDates(/*fromDate*/pbankname).subscribe((res:any) => {
          this.Showhide = false;
          this.gridView = res;
          console.log(res);
          if (this.gridView != '') {
            let TotalAmount = this.gridView[0]['pBankBookBalance'];
            console.log(TotalAmount);
            this.totaldeposit = 0;
            this.totalissued = 0;
            this.gridView.filter((item:any) => {
              if(item.pGroupType === 'CHEQUES ISSUED BUT NOT CLEARED'){
                this.totalissued = this.totalissued + item.ptotalreceivedamount;
              }
              if(item.pGroupType === 'CHEQUES DEPOSITED BUT NOT CREDITED'){
                this.totaldeposit =  this.totaldeposit + item.ptotalreceivedamount;

              }
            })
            console.log("Deposit :"+this.totaldeposit + "Issued : "+ this.totalissued);
            debugger;
            this.chequesdepositedbutnotcredited = this.gridView.filter((item:any) => item.pGroupType === 'CHEQUES DEPOSITED BUT NOT CREDITED')
              .reduce((chequesdepositedbutnotcredited:any, current:any) => chequesdepositedbutnotcredited + current.ptotalreceivedamount, 0);

            this.CHEQUESISSUEDBUTNOTCLEARED = this.gridView.filter((item:any) => item.pGroupType === 'CHEQUES ISSUED BUT NOT CLEARED')
              .reduce((CHEQUESISSUEDBUTNOTCLEARED:any, current:any) => CHEQUESISSUEDBUTNOTCLEARED + current.ptotalreceivedamount, 0);
              
            
              let bankblnce = TotalAmount - this.chequesdepositedbutnotcredited + this.CHEQUESISSUEDBUTNOTCLEARED;

            this.Balanceasperbankbook = bankblnce < 0 ? '(' + Math.abs(bankblnce).toFixed(2) + ')' : bankblnce.toFixed(2);

            this.pBankBookBalance = TotalAmount < 0 ? '(' + Math.abs(TotalAmount).toFixed(2) + ')' : TotalAmount.toFixed(2);
            console.log(this.pBankBookBalance);
            // this.Balanceasperbankbook=this.Balanceasperbankbook).toFixed(2);
            // this.pBankBookBalance=this._CommonService.currencyformat(this.pBankBookBalance);
            if (TotalAmount < 0) {
              //this.bankBalance = '(' + this._CommonService._convertAmountToPdfFormat(this._CommonService.currencyformat(Math.abs(TotalAmount).toFixed(2))) + ')';
            }
            else {
              //this.bankBalance = this._CommonService._convertAmountToPdfFormat(this._CommonService.currencyformat(Math.abs(this.pBankBookBalance).toFixed(2)))
              
              //this._CommonService.convertAmountToPdfFormat(this._CommonService.currencyformat(this.pBankBookBalance));
            }

            if (bankblnce < 0) {
             // this.BalanceAsperBankBook = '(' + this._CommonService._convertAmountToPdfFormat(this._CommonService.currencyformat(Math.abs(bankblnce).toFixed(2))) + ')';
            }
            else {
             // this.BalanceAsperBankBook = this._CommonService._convertAmountToPdfFormat(this._CommonService.currencyformat(Math.abs(this.Balanceasperbankbook).toFixed(2)));
              
              //this._CommonService.convertAmountToPdfFormat(this._CommonService.currencyformat(this.Balanceasperbankbook));
            }
            this.BRStatmentForm['controls']['pbankbalance'].setValue(this.gridView[0]['pbankbalance']);
            this.savebutton = 'Generate Report';
            this.show = true;
            this.isLoading = false;
            this.loading = false;
            this.gridView.filter((data:any) => {
              let DateFormat = data.ptransactiondate.split(' ')[0];
              console.log(DateFormat);
              //data.ptransactiondate=this._CommonService.DateFormatForGrid(DateFormat);    
            })

          } else {
            this.savebutton = 'Generate Report';
            debugger;
            this.show = true;
            this.isLoading = false;
            this.loading = false;
            this.pBankBookBalance = this.BrsBalance;
            this.CHEQUESISSUEDBUTNOTCLEARED = 0;
            this.chequesdepositedbutnotcredited = 0;
            this.Balanceasperbankbook = this.BrsBalance;
          }
        },
          (error:any) => {
            this.showErrorMessage(error);
            this.isLoading = false;
            this.savebutton = 'Generate Report';
            this.loading = false;
          });
        }else{
          this.brstatement.GetBrStatementReportbyDatesChequesInfo(/*fromDate*//*todate*/pbankname).subscribe((res:any) => {
               this.ChequesInfoDetails = res;
               this.savebutton = 'Generate Report';
               //this.show = true;
               this.isLoading = false;
               this.loading = false;
               debugger
               if(parseInt(res.length)>0){
               this.export();
               }
               else{
                // this._CommonService.showWarningMessage('BRS Cheques Info No Data to Display.')
               }               
          });
        }

      } catch (e) {
        //this.showErrorMessage(e);
        this.isLoading = false;
        this.savebutton = 'Generate Report';
        this.loading = false;
      }
    }
  }

  export(): void {
    let rows:any= [];
    
    this.ChequesInfoDetails.forEach((element:any) => {
      debugger;
     // let datereceipt = this._CommonService.getFormatDateGlobal(element.ptransactiondate);
      let chitvalue=0;
      let bidpayableamount=0;
      let total_received_amount=0;
      
      
  
      if (element.total_received_amount != 0) {
       // total_received_amount = this._CommonService.currencyformat(element.total_received_amount);
       // total_received_amount = this._CommonService.convertAmountToPdfFormat(total_received_amount);
      }
     
     // let cleardate = this._CommonService.getFormatDateGlobal(element.clear_date);
      
     // let receiptdate = this._CommonService.getFormatDateGlobal(element.receiptdate);
      //let chequedate = this._CommonService.getFormatDateGlobal(element.chequedate);
      let transDate = element.transaction_date.split(" ")[0]
     // let transaction_date=this._CommonService.getFormatDateGlobal(transDate);
      let transTime = element.ptransactionTime;
      let User  = element.pUserName;
      let BankName = element.pBankName;
      let temp;
      let dataobject;
      dataobject = {
        "Branch Name":element.pBranchName,
        "Contact Name":element.contact_name,
        "Self Cheque Status": element.selfchequestatus,
       // "Receipt Date": receiptdate,
        "Total Received Amount": total_received_amount,

        "Mode Of Receipt":element.modeof_receipt,
        "Reference Number": element.reference_number,
        "Reference text": element.preferencetext,

        //"chequedate": chequedate,

        "Deposit Status":element.deposit_status,

        "Cheque Bank":element.cheque_bank,
        "Receipt Branch Name":element.receipt_branch_name,
        "Received From":element.received_form,

        "Transaction No.": element.transaction_no,
       // "Transaction Date":transaction_date,
        "Chit Receipt Number": element.chit_receipt_number,
        //"Cleared / Cancel / Returned Date":cleardate,
        "DateTime":transTime,
        "UserName":User,
        "BankName":BankName
      }
      rows.push(dataobject);
    });
    
  //  this._CommonService.exportAsExcelFile(rows, 'BRS Cheques Info');
    

  }
  pdfOrprint(printorpdf:any) {

    // if (this.gridView.length > 0) {
    let rows:any = [];
    let reportname = "BRS";
    let gridheaders = ["Transaction Date", "Cheque No.", "Particulars", "Amount"];

    let BankBalance;
    let balanceperbankbook;

    let format = this.BRStatmentForm['controls']['fromDate'].value;
    //let fromDate = this._CommonService.getFormatDateGlobal(format);

   // let chequeissued = this._CommonService.convertAmountToPdfFormat(this._CommonService.currencyformat(this.CHEQUESISSUEDBUTNOTCLEARED));

    


    // let formattodate= this.datePipe.transform(this.BRStatmentForm['controls']['toDate'].value, "dd-MM-yyyy");
    // let toDate =this._CommonService.dateFormatForGrid(DateFormat1);
    let toDate = new Date();

    let colWidthHeight = {
      ptransactiondate: { cellWidth: 'auto' }, pChequeNumber: { cellWidth: 'auto' }, pparticulars: { cellWidth: 'auto' }, pGroupType: { cellWidth: 'auto' }, ptotalreceivedamount: { cellWidth: 'auto' }
    }
    //let retungridData = this._CommonService._groupwiseSummaryBRS(this.gridView, "pGroupType","ptotalreceivedamount", false)

    // retungridData.forEach(element => {
    //   let temp;
    //   let particulars;
    //   let transdate = element.ptransactiondate;
    //   //let  DateFormat3= this._CommonService.getDateObjectFromDataBase(transdate);
    //   let tansactiondate = this._CommonService.getFormatDateGlobal(transdate);
    //   let totamAmt;
    //   if(element.pparticulars){
    //     particulars =element.pparticulars;
    //  }
    // else{
    //  particulars = "--NA--"
    // }
    //   if(element.ptotalreceivedamount !== 0){
    //      totamAmt = this._CommonService.convertAmountToPdfFormat(element.ptotalreceivedamount);
    //   }
    //  else{
    //   totamAmt = this._CommonService.convertAmountToPdfFormat(0);
    //  }
    //   // let temp = [formatDate(element.ptransactiondate, 'dd-MM-yyyy', 'en-IN'), element.ptransactionno, element.pparticulars,element.pdescription, element.pdebitamount, element.pcreditamount, element.pclosingbal];

    //   if (element.group !== undefined) {
    //     temp = [element.group, tansactiondate, element.pChequeNumber, particulars, totamAmt];
    //   }
    //   else {
    //     temp = [tansactiondate, element.pChequeNumber, particulars, totamAmt];
    //   }
    //   rows.push(temp);
    // });
    // pass Type of Sheet Ex : a4 or lanscspe  
 
    if (this.gridView != '') {
      BankBalance = this.bankBalance
      balanceperbankbook = this.BalanceAsperBankBook;
    }
    else {
      BankBalance = this.BalanceBRS;
      balanceperbankbook = this.BalanceBRS;
    }

    if (this.chequesdepositedbutnotcredited == 0) {
     // this.chequesdepositedbutnotcrediteddecimal = this._CommonService.convertAmountToPdfFormat(0)+ ".00";
    }
    else {
     // this.chequesdepositedbutnotcrediteddecimal = this._CommonService.currencyformat(Math.abs(this.chequesdepositedbutnotcredited).toFixed(2));
    }
    debugger
    console.log(this.CHEQUESISSUEDBUTNOTCLEARED)
    if (this.CHEQUESISSUEDBUTNOTCLEARED == 0) {
    //  this.CHEQUESISSUEDBUTNOTCLEAREDdecimal = this._CommonService.convertAmountToPdfFormat(0)+ ".00";
    }
    else {
    //  this.CHEQUESISSUEDBUTNOTCLEAREDdecimal = this._CommonService.currencyformat(Math.abs(this.CHEQUESISSUEDBUTNOTCLEARED).toFixed(2));
    }
  

   
   // this._CommonService._downloadBRSReportsPdf(reportname, rows, gridheaders, colWidthHeight, "a4", "As On", fromDate, toDate, BankBalance, this.chequesdepositedbutnotcrediteddecimal, this.CHEQUESISSUEDBUTNOTCLEAREDdecimal, balanceperbankbook, printorpdf,this.bankname);
    // }
    // else {
    //   this._CommonService.showInfoMessage("No Data");
    // }
  }
  // export(): void {
  //   let rows = [];
  //   let BankBalance;
  //   let balanceperbankbook;
  //   // if (this.gridView != '') {
  //   //   BankBalance = this.bankBalance;
  //   //   balanceperbankbook = this.BalanceAsperBankBook;
  //   // }
  //   // else {
  //   //   BankBalance = this.BalanceBRS;
  //   //   balanceperbankbook = this.BalanceBRS;
  //   // }

  //   // let retungridData = this._CommonService._groupwiseSummaryBRS(this.gridView, "pGroupType","ptotalreceivedamount", false)

  //   this.gridView.forEach(element => {
  //     let temp;
  //     let particulars;
  //     let transdate = element.ptransactiondate;
  //     //let  DateFormat3= this._CommonService.getDateObjectFromDataBase(transdate);
  //     let tansactiondate = this._CommonService.getFormatDateGlobal(transdate);
  //     let totamAmt;
  //     if(element.pparticulars){
  //       particulars =element.pparticulars;
  //    }
  //   else{
  //    particulars = "--NA--"
  //   }
  //     if(element.ptotalreceivedamount !== 0){
  //        totamAmt = this._CommonService.convertAmountToPdfFormat(element.ptotalreceivedamount);
  //     }
  //    else{
  //     totamAmt = this._CommonService.convertAmountToPdfFormat(0);
  //    }
  //    let dataobject;
  //    dataobject = {
  //      "Transaction Date": tansactiondate,
  //      "Cheque No.": element.pChequeNumber,
  //      "Particulars": particulars,
  //      "Amount": totamAmt,
  //    }
  //    rows.push(dataobject);
  //     // let temp = [formatDate(element.ptransactiondate, 'dd-MM-yyyy', 'en-IN'), element.ptransactionno, element.pparticulars,element.pdescription, element.pdebitamount, element.pcreditamount, element.pclosingbal];

  //     // if (element.group !== undefined) {
  //     //   temp = [element.group, tansactiondate, element.pChequeNumber, particulars, totamAmt];
  //     // }
  //     // else {
  //       // temp = [tansactiondate, element.pChequeNumber, particulars, totamAmt];
  //     // }
     
  //   });

    
  //   this._CommonService.exportAsExcelFile(rows, 'BRS');

  // }
  toggleExpandGroup(group:any) {

    console.log('Toggled Expand Group!', group);
    this.table.groupHeader.toggleExpandGroup(group);
  }

  onDetailToggle(event:any) {
    console.log('Detail Toggled', event.key);
  }
  saveWithPrint(){
    debugger;
   if(this.BRStatmentForm['controls']['pFilename'].value!=''){
    this.gridView;
    this.selectedvalues = [];
   // let date = this._CommonService.getFormatDateNormal(this.BRStatmentForm['controls']['fromDate'].value);

    let newArray =  this.gridView.map((obj:any) => {
      delete obj.pparentname;
      delete obj.ptransactionno;
      delete obj.pdescription;
      //delete obj.prebateamount;
      delete obj.popeningbal1;
      delete obj.pclosingbal1;
      delete obj.pdebitamount;
      delete obj.pcreditamount;
      delete obj.popeningbal;
      delete obj.pclosingbal;
      delete obj.pcashtotal;
      delete obj.pchequetotal;
      delete obj.pmodeoftransaction;
      delete obj.paccountname;
      delete obj.paccountid;
      delete obj.pparentid;
      delete obj.pBalanceType;
      delete obj.pgrouprecordid;
      delete obj.precordid;
      delete obj.lstBRSDto;
      delete obj.lstBRSDto1;
      delete obj.pFormName;
      //obj.pdatdate = this.BRStatmentForm['controls']['fromDate'].value;
      return obj;
      
    });
    if (confirm("Do you want to save ?")) {
    // this.brstatement.Getbrscount(/*date*/this.BRStatmentForm.controls['pbankname'].value,this._CommonService.getschemaname()).subscribe(res => {
    //   let count = res;

    //   if(count == 0){
    //     let selectedItemsdata =[];
    // //    if(newArray.ptransactiondate != null ){
    //     for(let i=0; i<newArray.length; i++){
    //         let data ={
    //           "pgrouptype":newArray[i].pGroupType,
    //           //"pchequedate": this.datePipe.transform(this._CommonService.formatDateFromDDMMYYYY(newArray[i].ptransactiondate), 'yyyy/MM/dd'),        
    //           "pchequedate": newArray[i].ptransactiondate,        
    //           "preferencenumber": newArray[i].pChequeNumber,
    //           "pparticulars": newArray[i].pparticulars,
    //           "pbankname": newArray[i].pBankName,
    //           "pbranchname": newArray[i].pBranchName,
    //           "pamount": newArray[i].ptotalreceivedamount,
    //           "pbankid": + this.BRStatmentForm['controls']['pbankname'].value,
    //           "pbrsdate":this.datePipe.transform(this.BRStatmentForm['controls']['fromDate'].value, 'yyyy-MM-dd'),"pbankbalance": this._CommonService.removeCommasForEntredNumber(this.BRStatmentForm['controls']['pbankbalance'].value),
    //           "ptypeofoperation": 'CREATE',
    //           "schemaname":this._CommonService.getschemaname(),
    //           'pFilename':this.BRStatmentForm['controls']['pFilename'].value
              
    //         }
    //         selectedItemsdata.push(data)
      
    //       }
    //  //   }

    //       console.log(selectedItemsdata);
 

    //  let data = {
    //   "_BrsDTO": selectedItemsdata
    //  }
    //  let brsData = JSON.stringify(data)
    //  this.brstatement.saveBRS(brsData).subscribe(res => {
    // if(res){
    //   this.selectedvalues += date + '@' + JSON.stringify(this.gridView) + '@' + this.startDate + '@' + this.bankname + '@' + this.pBankBookBalance + '@' + this.chequesdepositedbutnotcredited + '@' + this.CHEQUESISSUEDBUTNOTCLEARED + '@' + this.Balanceasperbankbook + '@' + this.BRStatmentForm['controls']['pbankbalance'].value;
    //      let receipt = btoa(this.selectedvalues);

    //   //   window.open('/#/BRSPreview?id=' + receipt);
    //   //this.print();
    //   this.BRStatmentForm['controls']['pbankbalance'].setValue(0);
    //   this._CommonService.showSuccessMessage();
    // }

    //  })
    //   }

    //   if(count > 0){
    //     let selectedItemsdata =[];
    //  //   if(newArray.ptransactiondate != null){
    //     for(let i=0; i<newArray.length; i++){
    //         let data ={
    //           "pgrouptype":newArray[i].pGroupType,
    //           //"pchequedate": this.datePipe.transform(this._CommonService.formatDateFromDDMMYYYY(newArray[i].ptransactiondate), 'yyyy/MM/dd'),        
    //           "pchequedate": newArray[i].ptransactiondate,
    //           "preferencenumber": newArray[i].pChequeNumber,
    //           "pparticulars": newArray[i].pparticulars,
    //           "pbankname": newArray[i].pBankName,
    //           "pbranchname": newArray[i].pBranchName,
    //           "pamount": newArray[i].ptotalreceivedamount,
    //           "pbankid": + this.BRStatmentForm['controls']['pbankname'].value,
    //           "pbrsdate":this.datePipe.transform(this.BRStatmentForm['controls']['fromDate'].value, 'yyyy-MM-dd'),"pbankbalance": this._CommonService.removeCommasForEntredNumber(this.BRStatmentForm['controls']['pbankbalance'].value),
    //           "ptypeofoperation": 'UPDATE',
    //           "schemaname":this._CommonService.getschemaname(),
              
    //         }
    //         selectedItemsdata.push(data)
      
    //       }
    //   //  }

    //       console.log(selectedItemsdata);
 

    //  let data = {
    //   "_BrsDTO": selectedItemsdata
    //  }
    //  let brsData = JSON.stringify(data)
    //  this.brstatement.saveBRS(brsData).subscribe(res => {
    // if(res){

    //        this.selectedvalues += date + '@' + JSON.stringify(this.gridView) + '@' + this.startDate + '@' + this.bankname + '@' + this.pBankBookBalance + '@' + this.chequesdepositedbutnotcredited + '@' + this.CHEQUESISSUEDBUTNOTCLEARED + '@' + this.Balanceasperbankbook + '@' + this.BRStatmentForm['controls']['pbankbalance'].value;
    //      let receipt = btoa(this.selectedvalues);

    // //     window.open('/#/BRSPreview?id=' + receipt);
    //   //this.print();
    //   this.BRStatmentForm['controls']['pbankbalance'].setValue(0);
    //   this._CommonService.showSuccessMessage();
    // }

    //  })
    //   }


    // })
  }
  }else{
    //this._CommonService.showWarningMessage('Upload Document Required')
  }

  }
  fromdateChange($event:any){
    this.dpConfig1.minDate = new Date($event);
    //$("#toDate").prop("disabled",false);
    //$("#toDate").prop("disabled",false);
    this.BRStatmentForm.controls['toDate'].setValue(new Date());
  }
  validateFile(fileName:any) {
    debugger
    if (fileName == undefined || fileName == "") {
      return true
    }
    else {
      var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
      if (ext.toLowerCase() == 'jpg' || ext.toLowerCase() == 'png' || ext.toLowerCase() == 'pdf') {

        return true
      }
    }
    return false
  }
  uploadAndProgress(event: any, files:any) {
    debugger;
    var extention = event.target.value.substring(event.target.value.lastIndexOf('.') + 1);
    if (!this.validateFile(event.target.value)) {
      //this._CommonService.showWarningMessage("Upload jpg , png or pdf files");
    }
    else if(((event.target.files[0].size/1024)/1024)>30){
      //this._CommonService.showWarningMessage("File Size Maximum Allowed 30Mb Only !");
    }
    else {
      let file = event.target.files[0];
      if (event && file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
          this.imageResponse = {
            name: file.name,
            fileType: "imageResponse",
            contentType: file.type,
            size: file.size,

          };
        };
      }
      let fname = "";
      if (files.length === 0) {
        return;
      }
      var size = 0;
      const formData = new FormData();
      for (var i = 0; i < files.length; i++) {
        size += files[i].size;
        fname = files[i].name
        formData.append(files[i].name, files[i]);
        formData.append('NewFileName', 'BRS' + '.' + files[i]["name"].split('.').pop());
      }
      size = Math.round((size / 1024)/1024);//converted to mb
      
        // this._CommonService.fileUploadS3("BPO",formData).subscribe(data => {
        //   debugger;
        //   if (extention.toLowerCase() == 'pdf') {
        //     this.imageResponse.name = data[0];
        //     this.kycFileName = data[0];
        //     this.kycFilePath = data[0];
        //   }
        //   else {
        //     this.kycFileName = data[0];
        //     this.imageResponse.name = data[0];
        //     // this.kycFilePath = data[0];
        //     //let Filepath = this.kycFileName.split(".");
        //     //console.log(Filepath[1])
        //   }
        //   this.BRStatmentForm.controls.pFilename.setValue(this.kycFileName);
        //   //  this.GeneralReceiptForm.controls.pFileformat.setValue(Filepath[1]);
        //   //   this.GeneralReceiptForm.controls.pFilepath.setValue(this.kycFilePath);
        // })
     
    }
  }
}






