import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@Component({
  selector: 'app-trial-balance',
  standalone:true,
  imports: [NgxDatatableModule,ReactiveFormsModule,BsDatepickerModule,CurrencyPipe,DatePipe,CommonModule],
  providers: [CurrencyPipe, DatePipe],
  templateUrl: './trial-balance.component.html',
  styleUrl: './trial-balance.component.css',
})
export class TrialBalanceComponent {

  @Output() printedDate:any;
 currencysymbol:any;
 groupType:any;
 showhideason:any;
 datelabel:any;
 ShowAsOn:any;
 accountid:any;
 showhidetable:any;
 dataisempty:any;
 totalcreditamount:any;
TrialBalanceDifference:any;
difference:any;
savebutton = "Generate Report"
 totaldebitamount:any;
 public AsOnDate:any;
 showhideledgercolumns:any;
 ShowBetween:any;
 asondate:any;
 fromdate:any;
 todate:any;
 ledgersummarydetails:any=[];
 accountledgerdetails:any=[];
 Trialbalancelst:any=[];
 TrialBalanceForm!: FormGroup;
 mycurrencypipe:any;

 public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
 public dppConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
 @ViewChild('table') table:any;
 @ViewChild('table1') table1:any;
  withgrouping: any=false;
  constructor(/*private _commonservice:CommonServic*/private datepipe:DatePipe, private fb:FormBuilder, /*private _accountingreportservice:AccountingReportsService*/) {
    // this.currencysymbol = this._commonservice.datePickerPropertiesSetup("currencysymbol");
    // this.dpConfig.dateInputFormat = this._commonservice.datePickerPropertiesSetup("dateInputFormat");
    // this.dpConfig.containerClass = this._commonservice.datePickerPropertiesSetup("containerClass");   
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.maxDate = new Date(); 

    this.dppConfig.maxDate = new Date();    
    this.dppConfig.minDate = new Date();
    // this.dppConfig.dateInputFormat = this._commonservice.datePickerPropertiesSetup("dateInputFormat");
    // this.dppConfig.containerClass = this._commonservice.datePickerPropertiesSetup("containerClass");  
    this.dppConfig.showWeekNumbers = false;
   }

   onDetailToggle(event:any) {
    debugger;
    if(event.type=="row"){
    this.accountid=event.value.paccountid;
    let groupcode=event.value.groupcode;
    
    if(this.groupType=="ASON"){
      this.showhideledgercolumns=false;
      this.AsOnDate="T";
    }
    else{
      this.showhideledgercolumns=true;
      this.AsOnDate="F";
    }
    // let fdate=this.datepipe.transform(this.fromdate,'yyyy/MM/dd');
    // let tdate=this.datepipe.transform(this.todate,'yyyy/MM/dd')
   //let fdate=this._commonservice.getFormatDateNormal(this.fromdate)
  // let tdate=this._commonservice.getFormatDateNormal(this.todate);
    // this._accountingreportservice.GetLedgerSummary(fdate,tdate,event.value.paccountid,this.AsOnDate,groupcode).subscribe(res=>{
    //   debugger
    //    this.ledgersummarydetails=res;
    //    console.log(this.ledgersummarydetails)
    //    if(this.ledgersummarydetails.length!=0){
    //     for(let i=0;i<this.ledgersummarydetails.length;i++){
    //       if(this.ledgersummarydetails[i].pdebitamount==0 && this.ledgersummarydetails[i].pcreditamount==0){
    //         this.ledgersummarydetails.splice(i,1);
    //       }
    //     }
    //    this.ledgersummarydetails.filter(data=>{
    //      debugger
    //      if(data.popeningbal!=0){
    //         if(data.popeningbal<0){
    //           data.popeningbal=Math.abs(data.popeningbal);
    //           data['openingBalanceType']='Cr';
    //         }
    //         else{
    //           data['openingBalanceType']='Dr';
    //         }
    //      }
    //       if(data.pclosingbal!=0){
    //           if(data.pclosingbal<0){
    //           data.pclosingbal=Math.abs(data.pclosingbal);
    //           data['closingBalanceType']='Cr';
    //         }
    //         else{
    //           data['closingBalanceType']='Dr';
    //         }
    //      }
    //    })
    //   }
    // },
    (error: any) => {
      //this._commonservice.showErrorMessage(error);
    };
    }
  }

  toggleExpandRow(row: any) {
    debugger
    this.table.rowDetail.collapseAllRows();
    this.table.rowDetail.toggleExpandRow(row);
  }

 toggleCollapseRow(){
   this.table.rowDetail.collapseAllRows();
 }

  onDetailToggle1(event:any) {
    debugger
   if(event.type=="row"){
    //let fdate=this._commonservice.getFormatDateNormal(this.fromdate);
    //let tdate=this._commonservice.getFormatDateNormal(this.todate);
     if(this.groupType=="ASON"){
       let date=new Date("01-01-0001");
      // fdate=this._commonservice.getFormatDateNormal(date);
     }
    // this._accountingreportservice.GetLedgerReport(fdate,tdate,this.accountid,event.value.paccountid).subscribe(res=>{
        // this.accountledgerdetails=res;
        if(this.accountledgerdetails.length!=0){
          for(let i=0;i<this.accountledgerdetails.length;i++){
            if(this.accountledgerdetails[i].pdebitamount==0 && this.accountledgerdetails[i].pcreditamount==0){
              this.accountledgerdetails.splice(i,1);
            }
          }
        }
     (error: any) => {
      //this._commonservice.showErrorMessage(error);
    };
   }
  }

  toggleCollapseRow1(){
  this.table1.rowDetail.collapseAllRows();
  }

  toggleExpandRow1(row:any) {
    debugger
  this.table1.rowDetail.collapseAllRows();
    this.table1.rowDetail.toggleExpandRow(row);
  }

  toggleExpandGroup(group:any){
    debugger
  
    //this.table1.rowDetail.collapseAllRows();
    this.table.groupHeader.toggleExpandGroup(group);
    this.toggleCollapseRow1();
  }
  onDetailToggleGroup(event:any){
  debugger
  console.log(event)
  
  }

  ngOnInit(): void {
    this.dataisempty=false;
    this.datelabel="From Date";
    this.printedDate=true;
    this.groupType="BETWEEN";
    this.showhideason=true;
    this.ShowAsOn=false;
    this.showhidetable=false;
    this.ShowBetween=true;
    this.totaldebitamount=0;
    this.totalcreditamount=0;
    this.fromdate=new Date();
    this.todate=new Date();
    this.TrialBalanceForm=this.fb.group({
      fromdate:[new Date()],
      todate:[new Date()],
      grouptype:['BETWEEN']
    });
    this.GetTrialBalance(new Date(),new Date(),'BETWEEN')
  }

  checkboxChecked(event:any){
     if(event.target.checked==true){
        this.groupType="ASON";
        this.showhideason=false;
        this.datelabel="Date";
        this.TrialBalanceForm.controls['grouptype'].setValue("ASON");
        this.TrialBalanceForm.controls['fromdate'].setValue(new Date());
        this.TrialBalanceForm.controls['todate'].setValue(new Date());
     }
     else{
       this.groupType="BETWEEN";
       this.showhideason=true;
       this.datelabel="From Date";
       this.TrialBalanceForm.controls['grouptype'].setValue("BETWEEN");
       this.TrialBalanceForm.controls['fromdate'].setValue(new Date());
       this.TrialBalanceForm.controls['todate'].setValue(new Date());
       this.dppConfig.minDate = new Date();    
       }
  }
  withGrouping(event:any){
   
      this.withgrouping = event.target.checked;
    

  }
  DateChange(event:any){
    debugger
    this.dppConfig.minDate = event;
   this.TrialBalanceForm.controls['todate'].setValue(new Date());
  }

  GenerateReport(){
    debugger
    let fromdate;
    let todate;
   this.Trialbalancelst=[];
    if(this.groupType=="ASON"){
      this.ShowAsOn=true;
      this.ShowBetween=false;
       this.asondate=this.TrialBalanceForm.controls['fromdate'].value;
       this.fromdate=this.TrialBalanceForm.controls['fromdate'].value;
       this.todate=this.TrialBalanceForm.controls['fromdate'].value;
    }
    if(this.groupType=="BETWEEN"){
      this.ShowAsOn=false;
     this.ShowBetween=true;
      this.fromdate=this.TrialBalanceForm.controls['fromdate'].value;
      this.todate=this.TrialBalanceForm.controls['todate'].value;
    }
    this.savebutton = 'Processing';
    this.GetTrialBalance(this.fromdate,this.todate,this.groupType);
  }

  GetTrialBalance(fromdate: Date,todate: Date,grouptype: string){
    debugger
    try{
    //  fromdate=this._commonservice.getFormatDateNormal(fromdate);
    //todate=this._commonservice.getFormatDateNormal(todate);
      //this._accountingreportservice.GetTrialBalanceData(fromdate,todate,grouptype).subscribe(res=>{
           //this.Trialbalancelst=res;
           if(this.Trialbalancelst.length!=0){
             for(let i=0;i<this.Trialbalancelst.length;i++){
               if(this.Trialbalancelst[i].pdebitamount==0 && this.Trialbalancelst[i].pcreditamount==0){
                 this.Trialbalancelst.splice(i,1);
               }
             }
            /// this.TrialBalanceTotalCalculations();
             this.showhidetable=true;
             this.dataisempty=false;
             this.savebutton = 'Generate Report';
           }
           else{
             this.totalcreditamount=0;
             this.totaldebitamount=0;
             this.showhidetable=false;
             this.dataisempty=true;
             this.savebutton = 'Generate Report';
           }
          //})
    }
    catch (errormssg:any) {
     // this._commonservice.showErrorMessage(errormssg);
      this.savebutton = 'Generate Report';
    }
   
  }

  // TrialBalanceTotalCalculations(){
  //   debugger;
  //   this.totaldebitamount = this.Trialbalancelst.reduce((sum, c) => sum + c.pdebitamount, 0);
  //   this.totalcreditamount = this.Trialbalancelst.reduce((sum, c) => sum + c.pcreditamount, 0);
  //   // console.log(this.totaldebitamount+"-"+this.totalcreditamount);
  //    if(Math.round( this.totaldebitamount.toFixed(2))!=Math.round(  this.totalcreditamount.toFixed(2))){//added toFixed(2) on 22-05-2024
  //     this.TrialBalanceDifference=true;
  //      this.difference=Math.abs(this.totaldebitamount-this.totalcreditamount);
  //      this.difference=this.difference.toFixed(2);
  //   }
  //   else{
  //     this.TrialBalanceDifference=false;
  //   }
  // }
  
  // Excel implimentation by Harsha 23-09-21
export(): void{
  let rows: { Type: any; Particulars: any; Debit: number; Credit: number; }[] = [];
  this.Trialbalancelst.forEach((element:any) => {

    let debitamount = 0;
    let creditamount = 0;

    if (element.pdebitamount != 0) {
      // debitamount = this._commonservice.currencyformat(element.pdebitamount);
      // debitamount = this._commonservice.convertAmountToPdfFormat(debitamount);
    }
    if (element.pcreditamount != 0) {
      // creditamount = this._commonservice.currencyformat(element.pcreditamount);
      // creditamount = this._commonservice.convertAmountToPdfFormat(creditamount);
    }
    
    let dataobject;
    dataobject = {
      "Type": element.pparentname,
      "Particulars":element.paccountname,
      "Debit": debitamount,
      "Credit": creditamount
    }
    rows.push(dataobject);
  });
 // this._commonservice.exportAsExcelFile(rows, 'TrailBalance');
}
   pdfOrprint(printorpdf:any) {
     if(this.withgrouping){
      debugger;
      let rows = [];
      let reportname = "Trial Balance";
      let gridheaders = ["Particulars", "Debit", "Credit"];
  
  
     // let format = this.AccountLedger['controls']['fromDate'].value;
     // let fromDate = this._commonservice.getFormatDateGlobal(this.TrialBalanceForm.controls.fromdate.value);
  
    //  let formattodate = this.AccountLedger['controls']['toDate'].value;
     // let toDate = this._commonservice.getFormatDateGlobal(this.TrialBalanceForm.controls.todate.value);
  
  
      let colWidthHeight = {
        paccountname: { cellWidth: 'auto' }, pdebitamount: { cellWidth: 'auto' }, pcreditamount: { cellWidth: 'auto' }
      }
      //if grouped col is date then pass true else false;
      //let retungridData = this._commonservice._groupwiseSummaryExportDataTrialBalance(this.Trialbalancelst,"pparentname","pdebitamount","pcreditamount", false,this.withgrouping)
      debugger;
      //retungridData.forEach((element:any) => {
        let temp;
      //  let transdate = element.ptransactiondate;
       // let DateFormat3 = this._CommonService.getDateObjectFromDataBase(transdate);
       // let tansactiondate = this._commonservice.getFormatDateGlobal(element.transactiondate);
       let debitamount;
       let creditamount ;
       //if(element.pdebitamount == 0 || element.pdebitamount == undefined){
        // debitamount="";
       }
       else{
    //    debitamount = this._commonservice.currencyformat(parseFloat(element.pdebitamount));
    //    debitamount=this._commonservice.convertAmountToPdfFormat(debitamount);
    //    let amount=   debitamount.split(".")[1];
    //     if(amount == undefined){
    //       debitamount = debitamount + ".00";
    //     }else if(amount.length !=2){
    //       debitamount = debitamount + "0";
    //     }
    //    }
    //    if(element.pcreditamount == 0 || element.pcreditamount == undefined){
    //      creditamount="";
    //    }
    //    else{
    //     creditamount = this._commonservice.currencyformat(parseFloat(element.pcreditamount));
    //     creditamount=this._commonservice.convertAmountToPdfFormat(creditamount);
    //  let amount=   creditamount.split(".")[1];
    //     if(amount == undefined){
    //       creditamount = creditamount + ".00";
    //     }else if (amount.length != 2){
    //       creditamount = creditamount + "0";
    //     }
    //    }
    //    debugger
    //     if (element.group !== undefined) {
    //       temp = [element.group,element.paccountname, debitamount,creditamount];
    //     }
    //     else {
    //       temp = [element.paccountname, debitamount,creditamount];
    //     }
    //     rows.push(temp);
    //   });
    //   let grouptype;
    //   if(this.groupType=="BETWEEN"){
    //      grouptype="Between";
    //   }
    //  else{
    //    grouptype="As On";
    //  }
    //  let gridtotals={};
     
    //  gridtotals['debittotal']=this._commonservice.currencyformat(parseFloat(this.totaldebitamount));
    //  gridtotals['debittotal']=this._commonservice.convertAmountToPdfFormat(gridtotals['debittotal']);
    //  let gtdamount=   gridtotals['debittotal'].split(".")[1];
    //     if(gtdamount == undefined){
    //       gridtotals['debittotal'] = gridtotals['debittotal'] + ".00";
    //     }else if(gtdamount.length != 2){
    //       gridtotals['debittotal'] = gridtotals['debittotal'] + "0";
    //     }
    //  gridtotals['credittotal']=this._commonservice.currencyformat(parseFloat(this.totalcreditamount));
    //  gridtotals['credittotal']=this._commonservice.convertAmountToPdfFormat(gridtotals['credittotal']);
    //  let gtcamount=   gridtotals['credittotal'].split(".")[1];
    //     if(gtcamount == undefined){
    //       gridtotals['credittotal'] = gridtotals['credittotal'] + ".00";
    //     }else if(gtcamount.length != 2){
    //       gridtotals['credittotal'] = gridtotals['credittotal'] + "0";
    //     }
    //  let total=["                                                            Total",  gridtotals['debittotal'],  gridtotals['credittotal']];
    //  rows.push(total);
    //   // pass Type of Sheet Ex : a4 or lanscspe  
    //   this._commonservice._downloadTrialBalanceReportsPdf(reportname, rows, gridheaders, colWidthHeight, "a4", grouptype, fromDate, toDate, printorpdf,gridtotals);
  
    //  }
    //  else{
    //    this. pdfOrprint1(printorpdf)
    //  }
   
  }
  pdfOrprint1(printorpdf);{
    debugger;
    let rows = [];
    let reportname = "Trial Balance";
    let gridheaders = ["Particulars", "Debit", "Credit"];


   // let format = this.AccountLedger['controls']['fromDate'].value;
   // let fromDate = this._commonservice.getFormatDateGlobal(this.TrialBalanceForm.controls.fromdate.value);

  //  let formattodate = this.AccountLedger['controls']['toDate'].value;
    //let toDate = this._commonservice.getFormatDateGlobal(this.TrialBalanceForm.controls.todate.value);


    let colWidthHeight = {
      paccountname: { cellWidth: 'auto' }, pdebitamount: { cellWidth: 'auto' }, pcreditamount: { cellWidth: 'auto' }
    }
    //if grouped col is date then pass true else false;
    // let retungridData = this._commonservice._groupwiseSummaryExportDataTrialBalance(this.Trialbalancelst,"pparentname","pdebitamount","pcreditamount", false,this.withgrouping)
    debugger;
   this.Trialbalancelst.forEach((element:any) => {
      let temp;
    //  let transdate = element.ptransactiondate;
     // let DateFormat3 = this._CommonService.getDateObjectFromDataBase(transdate);
     // let tansactiondate = this._commonservice.getFormatDateGlobal(element.transactiondate);
     let debitamount;
     let creditamount ;
     if(element.pdebitamount == 0 || element.pdebitamount == undefined){
       debitamount="";
     }
     else{
    // debitamount = this._commonservice.currencyformat(parseFloat(element.pdebitamount));
    // debitamount=this._commonservice.convertAmountToPdfFormat(debitamount);
    // let amount=   debitamount.split(".")[1];
      // if(amount == undefined){
      //   debitamount = debitamount + ".00";
      // }else if(amount.length !=2){
      //   debitamount = debitamount + "0";
      // }
     }
     if(element.pcreditamount == 0 || element.pcreditamount == undefined){
       creditamount="";
     }
     else{
      // creditamount = this._commonservice.currencyformat(parseFloat(element.pcreditamount));
      // creditamount=this._commonservice.convertAmountToPdfFormat(creditamount);
  //  let amount=   creditamount.split(".")[1];
  //     if(amount == undefined){
  //       creditamount = creditamount + ".00";
  //     }else if(amount.length !=2){
  //       creditamount = creditamount + "0";
  //     }
     }
     debugger
      // if (element.group !== undefined) {
      //   temp = [element.group,element.paccountname, debitamount,creditamount];
      // }
      // else {
        temp = [element.paccountname, debitamount,creditamount];
      // }
      rows.push(temp);
    });
    let grouptype;
    if(this.groupType=="BETWEEN"){
       grouptype="Between";
    }
   else{
     grouptype="As On";
   }
   let gridtotals={};
   
  //  gridtotals['debittotal']=this._commonservice.currencyformat(parseFloat(this.totaldebitamount));
  //  gridtotals['debittotal']=this._commonservice.convertAmountToPdfFormat(gridtotals['debittotal']);
  //  let gtdamount=   gridtotals['debittotal'].split(".")[1];
  //     if(gtdamount == undefined){
  //       gridtotals['debittotal'] = gridtotals['debittotal'] + ".00";
  //     }else if(gtdamount.length != 2){
  //       gridtotals['debittotal'] = gridtotals['debittotal'] + "0";
  //     }
  //  gridtotals['credittotal']=this._commonservice.currencyformat(parseFloat(this.totalcreditamount));
  //  gridtotals['credittotal']=this._commonservice.convertAmountToPdfFormat(gridtotals['credittotal']);
  //  let gtcamount=   gridtotals['credittotal'].split(".")[1];
  //     if(gtcamount == undefined){
  //       gridtotals['credittotal'] = gridtotals['credittotal'] + ".00";
  //     }else if(gtcamount.length != 2){
  //       gridtotals['credittotal'] = gridtotals['credittotal'] + "0";
  //     }
  //  let total=["                                                            Total",  gridtotals['debittotal'],  gridtotals['credittotal']];
  //  rows.push(total);
  //   // pass Type of Sheet Ex : a4 or lanscspe  
  //   this._commonservice._downloadTrialBalanceReportsPdf(reportname, rows, gridheaders, colWidthHeight, "a4", grouptype, fromDate, toDate, printorpdf,gridtotals);

  }
  

}

getRowHeight(row?: any, index?: number): number {
 
  return row && row.hasDetails ? 100 : 50;
}
}



function pdfOrprint1(printorpdf: any) {
  throw new Error('Function not implemented.');
}





