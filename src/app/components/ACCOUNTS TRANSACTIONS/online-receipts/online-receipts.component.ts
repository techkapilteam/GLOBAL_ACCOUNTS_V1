import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { ChitTransactionsService } from '../../../services/chit-transactions.service';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-online-receipts',
  imports: [CurrencyPipe,BsDatepickerModule,CommonModule],
  templateUrl: './online-receipts.component.html',
  styleUrl: './online-receipts.component.css'
})



export class OnlineReceiptsComponent implements OnInit {
  data: any = [];
  data1: any = [];
  PaytmAutoreceiptCount: any = []
  public onlineprocessingform !: FormGroup
  savebutton = "Online Update"
  Cashfreesavebutton: any = "Online Update"
  savebutton1 = "SQL Dumped"
  savebutton2 = "Paytm Receipt"
  disablesavebutton: any = false;
  disablesavebutton1: any = false;
  disablesavebutton2: any = false;
  todate: any;
  fromdate: any
  isdisabled: boolean = false;
  isdisabled1: boolean = true;
  isdisabled2: boolean = false;
  CashFreedisabled: boolean = false;
  iscompleted: boolean = false;
  iscompleted2: boolean = false;
  iscompleted1: boolean = false;
  CashFreecompleted: boolean = false;
  brachid: any
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  currencysymbol: any;
  RaisesaveForm!: FormGroup;
  onlineformvalidation: any;
  isvalidate: any;
  formName: any = '';
  pendingcount: any
  pendingamt: any
  clearedcount: any
  clearedamt: any
  companydetails: any;
  paymentmode: any;
  Cashfreedisablesavebutton: boolean = false;

today:Date=new Date();
  constructor(private commonservice: CommonService, private chittransactionservice: ChitTransactionsService, private _fb: FormBuilder) {
    this.currencysymbol = this.commonservice.datePickerPropertiesSetup("currencysymbol");
    // this.dpConfig.dateInputFormat = this.commonservice.datePickerPropertiesSetup("dateInputFormat");
    // this.dpConfig.containerClass = this.commonservice.datePickerPropertiesSetup("containerClass");
    
     this.dpConfig.maxDate = new Date();
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig.showWeekNumbers = false;

    this.dpConfig1.maxDate = new Date();
    this.dpConfig1.minDate = new Date();
     this.dpConfig1.containerClass = 'theme-dark-blue';
    this.dpConfig1.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig1.showWeekNumbers = false;
    // this.dpConfig1.dateInputFormat = this.commonservice.datePickerPropertiesSetup("dateInputFormat");
    // this.dpConfig1.containerClass = this.commonservice.datePickerPropertiesSetup("containerClass");

  }

  ngOnInit(): void {
    this.brachid = this.commonservice.getbrachid()
    this.onlineprocessingform = this._fb.group({
      fromdate: [this.today, Validators.required],
      date2: [this.today, Validators.required],
      date1: [this.today, Validators.required],
      Cashfreefromdate: [this.today, Validators.required],
      // todate: [new Date(), Validators.required],
    })

    this.onlineformvalidation = {}
    this.dpConfig.maxDate = new Date();
    this.getmonth();
    this.getPaytmAutoreceiptCount()
  }
  DateChange(event: any) {

    //this.dpConfig.minDate = event;
    //this.onlineprocessingform['controls']['fromdate'].setValue(new Date());
  }
  DateChange1(event: any) {
    // this.onlineprocessingform.controls.date2.setValue(event);
    this.getPaytmAutoreceiptCount()
  }
  getmonth() {
    // this.companydetails=  JSON.parse(sessionStorage.getItem('companydetails'));
    this.companydetails = JSON.parse('');
    let days = this.companydetails.ponlineprocessbackdatedays;

    let newmonth = new Date()
    this.onlineprocessingform['controls']['fromdate'].setValue(new Date());
    //let firstdayofcurrentmonth = new Date(newmonth.getFullYear(), newmonth.getMonth(), -(days));
    newmonth.setDate(newmonth.getDate() - days);

    debugger
    //this.dpConfig.minDate = firstdayofcurrentmonth;
    this.dpConfig.minDate = newmonth;
    //this.dpConfig.minDate = new Date(2025, 2, 20)
  }
  getPaytmAutoreceiptCount() {
    this.PaytmAutoreceiptCount = [];
    this.pendingcount = 0
    this.pendingamt = 0
    this.clearedcount = 0
    this.clearedamt = 0
    this.paymentmode;

    // let paytmreceiptdate = this.commonservice.getFormatDateNormal(this.onlineprocessingform.controls.date2.value);
    // this.chittransactionservice.getPaytmAutoreceiptCount(this.brachid,'OFFLINE',paytmreceiptdate).subscribe(res => {
    //   this.PaytmAutoreceiptCount=res
    //   this.PaytmAutoreceiptCount.forEach(element => {
    //      this.paymentmode=element.paymentmode
    //     if(element.trstatus=='Y'){
    //       this.clearedcount=element.count
    //       this.clearedamt=element.sum
    //     }
    //     if(element.trstatus=='N'){
    //       this.pendingcount=element.count
    //       this.pendingamt=element.sum
    //     }
    //   });
    //   if(this.pendingcount==0){
    //     this.isdisabled1=true;
    //   }else{
    //     this.isdisabled1=false;
    //   }
    // })

  }
  onlineupdatedata():any {

    try {
      debugger;
      if (this.validateonlineForm()) {

        let fromdate = this.onlineprocessingform.controls['fromdate'].value;
        console.log(fromdate)
        if (this.onlineprocessingform.controls['fromdate'].value) {
          fromdate = this.commonservice.getFormatDateGlobal(fromdate);
        }
        else {
          fromdate = "null";
        }
        this.onlineupdate()
      }
    }
    catch (e: any) {
      this.commonservice.showErrorMessage(e);
      return false;
    }
  }

  onlineupdatedataCashfree() :any{
    debugger
    try {
      debugger;
      if (this.validateonlineForm()) {

        let Cashfreefromdate = this.onlineprocessingform.controls['Cashfreefromdate'].value;
        console.log(Cashfreefromdate)
        if (this.onlineprocessingform.controls['Cashfreefromdate'].value) {
          Cashfreefromdate = this.commonservice.getFormatDateGlobal(Cashfreefromdate);
        }
        else {
          Cashfreefromdate = "null";
        }
        this.updatestatusCashfree()
      }

    }

    catch (e: any) {
      this.commonservice.showErrorMessage(e);
      return false;
    }
  }

  onlineupdate() {
    this.savebutton = "Processing"
    this.disablesavebutton = true;
    // let transdate = this.commonservice.getFormatDateNormal(this.onlineprocessingform.controls.fromdate.value);
    // this.chittransactionservice.updatestatuspatm(transdate).subscribe(res => {
    //   this.data = res
    //   this.savebutton = "Online Update"
    //   this.disablesavebutton = false;
    //   this.commonservice.showSuccessMessage();
    //   this.isdisabled=false;
    //   this.isdisabled1=true;
    //   this.isdisabled2=true;
    //   this.iscompleted1=true;
    //   this.CashFreedisabled=true;


    // },
    //   (error) => {
    //     this.commonservice.showErrorMessage(error);
    //     this.savebutton = "Online Update"
    //     this.disablesavebutton = false;
    //   });

  }
  updatestatusCashfree() {
    this.Cashfreesavebutton = "Processing"
    this.Cashfreedisablesavebutton = true;
    // let transdate = this.commonservice.getFormatDateNormal(this.onlineprocessingform.controls.Cashfreefromdate.value);
    // this.chittransactionservice.updatestatusCashfree(transdate).subscribe(res => {
    //   this.data = res
    //   this.Cashfreesavebutton = "Online Update"
    //   this.Cashfreedisablesavebutton = false;
    //   this.commonservice.showSuccessMessage();
    //   this.isdisabled=false;
    //   this.isdisabled1=true;
    //   this.CashFreedisabled=true;
    //   this.CashFreecompleted=true;


    // },
    //   (error) => {
    //     this.commonservice.showErrorMessage(error);
    //     this.Cashfreesavebutton = "Online Update"
    //     this.Cashfreedisablesavebutton = false;
    //   });


  }


  sqldumpeddata():any {
    try {
      debugger;
      if (this.validateonlineForm()) {

        let fromdate1 = this.onlineprocessingform.controls['date1'].value;
        console.log(fromdate1)
        if (this.onlineprocessingform.controls['date1'].value) {
          fromdate1 = this.commonservice.getFormatDateGlobal(fromdate1);
        }
        else {
          fromdate1 = "null";
        }
        this.showsqldumpeddata()
      }

    }

    catch (e: any) {
      this.commonservice.showErrorMessage(e);
      return false;
    }
  }

  showsqldumpeddata() {
    this.savebutton1 = "Processing"
    this.disablesavebutton1 = true
    // let transactiondate = this.commonservice.getFormatDateNormal(this.onlineprocessingform.controls.date1.value);
    // this.chittransactionservice.gettransations('OFFLINE', transactiondate).subscribe(json => {
    //   this.data1 = json
    //   this.savebutton1 = "SQL Dumped"
    //   this.disablesavebutton1 = false;
    //   this.commonservice.showSuccessMessage();
    //   this.isdisabled1=false;
    //   this.isdisabled=true;
    //   this.isdisabled2=true;
    //   this.iscompleted=true;
    //   this.CashFreedisabled=true;

    // },
    //   (error) => {
    //     this.commonservice.showErrorMessage(error);
    //     this.savebutton1 = "SQL Dumped"
    //     this.disablesavebutton1 = false;
    //   });
  }

  paytmreceipt():any {
    try {
      debugger;
      if (this.validateonlineForm()) {

        let fromdate2 = this.onlineprocessingform.controls['date2'].value;
        console.log(fromdate2)
        if (this.onlineprocessingform.controls['date2'].value) {
          fromdate2 = this.commonservice.getFormatDateGlobal(fromdate2);
        }
        else {
          fromdate2 = "null";
        }
        this.show()
      }

    }

    catch (e: any) {
      this.commonservice.showErrorMessage(e);
      return false;
    }
  }
  show() {
    this.savebutton2 = "Processing"
    this.disablesavebutton2 = true
    let branchschema = this.commonservice.getschemaname()
    //  let fromdate = this.commonservice.getFormatDateNormal(this.onlineprocessingform.controls.date2.value);
    //   this.chittransactionservice.getpaytmautoreceipt(fromdate,'GLOBAL').subscribe(json=>{
    //     this.data1 = json
    //     this.savebutton2 = "Paytm Receipt"
    //     this.disablesavebutton2 = false;
    //     this.commonservice.showSuccessMessage();
    //     this.getPaytmAutoreceiptCount()
    //     if(this.pendingcount==0){
    //       this.isdisabled1=true;
    //     }else{
    //       this.isdisabled1=false;
    //     }

    //     this.isdisabled=true;

    //     this.isdisabled2=true;
    //     this.iscompleted2=true
    //   },
    //   (error) => {

    //     this.commonservice.showErrorMessage(error);
    //     this.savebutton2= "Paytm Receipt"
    //     this.disablesavebutton2= false;
    //   });
  }


  //validation starts
  BlurEventAllControll(fromgroup: FormGroup):any {
    debugger;
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
    }
    catch (e: any) {
      this.showErrorMessage(e);
      return false;
    }
  }
  checkValidations(group: FormGroup, isValid: boolean): boolean {
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e: any) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    try {
      let formcontrol;
      formcontrol = formGroup.get(key);;

      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          // if (key != 'FamilyControls')
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.onlineformvalidation[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                //errormessage = this.commonservice.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.onlineformvalidation[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e: any) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  setBlurEvent(fromgroup: FormGroup, key: string):any {
    try {
      let formcontrol;
      formcontrol = this.RaisesaveForm.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.BlurEventAllControll(formcontrol)
        }
        else {

          const control = this.RaisesaveForm.get(key);

          if (control && control.validator) {
            control.valueChanges.subscribe(data => {
              this.GetValidationByControl(fromgroup, key, true);
            });
          }

          // if (formcontrol.validator)
          //   this.RaisesaveForm.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup,key, true) })
        }
      }


    }
    catch (e: any) {
      this.showErrorMessage(e);
      return false;
    }
  }
  showErrorMessage(errormsg: string) {
    this.commonservice.showErrorMessage(errormsg);
  }
  // validateSaveDeatails(control: FormGroup): boolean {
  //   let isValid = true;
  //   try {
  //     isValid = this.checkValidations(control, isValid);

  //   } catch (e) {
  //     this.showErrorMessage(e);

  //   }
  //   return isValid;
  // }
  validateonlineForm() {
    try {
      this.formName = 'DocumentsForm';
      this.isvalidate = true;
      if (this.checkValidations(this.onlineprocessingform, this.isvalidate)) {
        return true;
      }
      else {
        return false;
      }
    }
    catch (e:any) {
      this.commonservice.showErrorMessage(e);
      return false;
    }



  }
}

