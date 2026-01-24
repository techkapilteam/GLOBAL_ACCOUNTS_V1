// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-journal-voucher',
//   imports: [],
//   templateUrl: './journal-voucher.component.html',
//   styleUrl: './journal-voucher.component.css',
// })
// export class JournalVoucherComponent {

// }


import { CommonModule, DatePipe } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-journal-voucher',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgSelectModule,
    // CustomCurrencyPipe,
    BsDatepickerModule,
],
  templateUrl: './journal-voucher.component.html',
  styleUrl: './journal-voucher.component.css',
})

export class JournalVoucherComponent  {
  showModeofPayment = false;
  showTypeofPayment = false;
  showtranstype = false;
  showbankcard = true;
  showbranch = true;
  showfinancial = true;
  showupi = false;
  showchequno = true;
  showgst = true;
  showtds = true;
  showgstandtds = false;
  imageResponse: any;
  currencySymbol: any;
  readonlydebit = false;
  readonlycredit = false;
  showgstamount = false;
  showigst = false;
  showcgst = false;
  showsgst = false;
  showutgst = false;
  showgstno = false;
  showhidegrid = false;
  showsubledger = true;
  formValidationMessages: any;
  paymentlistcolumnwiselist: any;
  displayCardName = 'Debit Card';
  displaychequeno = 'Cheque No';
  //schemaname: any;
  kycFileName: any;

  banklist: any;
  modeoftransactionslist: any;
  typeofpaymentlist: any;
  ledgeraccountslist: any;
  subledgeraccountslist: any;
  partylist: any;
  gstlist: any;
  tdslist: any;
  tdssectionlist: any;
  tdspercentagelist: any;
  debitcardlist: any;
  statelist: any;
  chequenumberslist: any;
  upinameslist: any;
  upiidlist: any;
  paymentslist: any;
  debittotalamount: any;
  credittotalamount: any;
  cashBalance: any;
  isDisabled!: boolean;

  bankBalance: any;


  bankbookBalance: any;;
  bankpassbookBalance: any;;
  ledgerBalance: any;;
  subledgerBalance: any;;
  partyBalance: any;;
  partyjournalentrylist: any;
  amounttype: any;
  disablegst!: boolean;
  disabletds = false;
  disablesavebutton = false;
  savebutton = "Save";
  hidefootertemplate: any;
  // public gridState: State = {
  //   sort: [],
  //   skip: 0,
  //   take: 10
  // };
  disabletransactiondate = false;
  // public selectableSettings: SelectableSettings;
   public ppaymentdateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  constructor(
    private _FormBuilder: FormBuilder,
     private datepipe: DatePipe, 
     private zone: NgZone,
      // private _commonService: CommonService,
       private _routes: Router,
        // private _AccountingTransactionsService: AccountingTransactionsService,
         private router: Router, 
        //  private _SubscriberJVService: SubscriberJVService
        ) {
    // this.ppaymentdateConfig.containerClass = this._commonService.datePickerPropertiesSetup('containerClass');
    // this.ppaymentdateConfig.showWeekNumbers = this._commonService.datePickerPropertiesSetup('showWeekNumbers');
     this.ppaymentdateConfig.maxDate = new Date();
    // this.dpConfig.maxDate = new Date();
    // this.ppaymentdateConfig = { ...this.dpConfig };
    // this.ppaymentdateConfig.dateInputFormat = this._commonService.datePickerPropertiesSetup('dateInputFormat');
  }
  paymentVoucherForm!: FormGroup;
  // public gridView: DataResult;

  ngOnInit() {
    debugger;
    console.log(this.paymentlistcolumnwiselist)
    // this.currencySymbol = this._commonService.currencysymbol;
    // if (this._commonService.comapnydetails != null)
    // if(this._commonService.comapnydetails.pdatepickerenablestatus || this._commonService.comapnydetails.pfinclosingjvallowstatus){
    //   this.disabletransactiondate=true
    // }
    // else{
    //   this.disabletransactiondate=false
    // }
    console.log(this.disabletransactiondate);
      // this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus; 
    this.paymentslist = [];
    this.formValidationMessages = {};
    this.hidefootertemplate = true;
    this.paymentVoucherForm = this._FormBuilder.group({
      ppaymentid: [''],
      pjvdate: ['', Validators.required],
      ptotalpaidamount: [''],
      pnarration: ['', Validators.required],
      pmodofpayment: ['CASH'],
      pbankname: [''],
      pbranchname: [''],
      ptranstype: [''],
      pCardNumber: [''],
      pUpiname: [''],
      pUpiid: [''],
      // schemaname: [this._commonService.getschemaname()],
      ptypeofpayment: [''],
      pChequenumber: [''],
      pchequedate: [''],
      pbankid: [''],

      // pCreatedby: [this._commonService.getcreatedby()],
      // pipaddress: [this._commonService.getipaddress()],
      // pStatusname: [this._commonService.pStatusname],
      // ptypeofoperation: [this._commonService.ptypeofoperation],
  pCreatedby: [''],
      pipaddress: [''],
      pStatusname: [''],
      ptypeofoperation: [''],


      ppaymentsslistcontrols: this.addppaymentsslistcontrols(),
      pFilename: [''],
      pFilepath: [''],
      pFileformat: [''],

      pDocStorePath: ['']
    })




    this.isgstapplicableChange();
    this.istdsapplicableChange();
    let date = new Date();
    this.paymentVoucherForm['controls']['pjvdate'].setValue(date);
    this.getLoadData();
    this.BlurEventAllControll(this.paymentVoucherForm);
  }
  addppaymentsslistcontrols(): FormGroup {
    return this._FormBuilder.group({
      psubledgerid: [null],
      psubledgername: [''],
      pledgerid: [null],
      pledgername: ['', Validators.required],
      pamount: [''],
      pactualpaidamount: [''],
      pgsttype: [''],
      pisgstapplicable: [false],
      pgstcalculationtype: [''],
      pgstpercentage: [''],
      pgstamount: [''],
      pigstamount: [''],
      pcgstamount: [''],
      psgstamount: [''],
      putgstamount: [''],
      ppartyname: ['', Validators.required],
      ppartyid: [null],
      ppartyreftype: [''],
      ppartyreferenceid: [''],
      ppartypannumber: [''],
      pistdsapplicable: [false],
      pgstno: [''],
      pTdsSection: [''],
      pTdsPercentage: [''],
      ptdsamount: [''],
      ptdscalculationtype: [''],
      ppannumber: [''],
      pState: [''],
      pStateId: [''],
      pdebitamount: ['', Validators.required],
      pcreditamount: ['', Validators.required],
      pigstpercentage: [''],
      pcgstpercentage: [''],
      psgstpercentage: [''],
      putgstpercentage: [''],
      ptotalcreditamount: [''],
      ptotaldebitamount: [''],
      ptranstype: [''],
      ptypeofoperation: [''],
      // ptypeofoperation: [this._commonService.ptypeofoperation],
      ptotalamount: [''],
    })
  }

  BlurEventAllControll(fromgroup: FormGroup):void {

    try {

      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })

    }
    catch (e) {
      // this._commonService.showErrorMessage(e);
     // return false;
    }
  }
  setBlurEvent(fromgroup: FormGroup, key: string):void {

    try {
      let formcontrol;

      formcontrol = fromgroup.get(key);


      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {

          this.BlurEventAllControll(formcontrol)
        }
        // else {
        //   if (formcontrol.validator)
        //     fromgroup.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
        // }
        else{
           if (formcontrol.validator) 
        formcontrol.valueChanges.subscribe(() => {
          this.GetValidationByControl(fromgroup, key, true);
        });
        }
      }

    }
    catch (e) {
      // this._commonService.showErrorMessage(e);
    //  return false;
    }



  }

  checkValidations(group: FormGroup, isValid: boolean): boolean {

    try {

      Object.keys(group.controls).forEach((key: string) => {

        isValid = this.GetValidationByControl(group, key, isValid);
        console.log(key + ":" + isValid);
      })

    }
    catch (e) {
      //this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {

    try {
      let formcontrol;

      formcontrol = formGroup.get(key);
      if (!formcontrol)
        formcontrol = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols'].get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          if (key != 'ppaymentsslistcontrols')
            this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.formValidationMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;

            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;

            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                // errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.formValidationMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }

          }
        }
      }
    }
    catch (e) {
      // this._commonService.showErrorMessage(key);
      return false;
    }
    return isValid;
  }

  // setBalances(balancetype, balanceamount) {

  //   let balancedetails;
  //   if (parseFloat(balanceamount) < 0) {
  //     // balancedetails = this._commonService.currencyFormat(Math.abs(balanceamount).toFixed(2)) + ' Cr';
  //   }
  //   else if (parseFloat(balanceamount) >= 0) {
  //     // balancedetails = this._commonService.currencyFormat((balanceamount).toFixed(2)) + ' Dr';
  //   }

  //   if (balancetype == 'CASH')
  //     this.cashBalance = balancedetails;
  //   if (balancetype == 'BANK')
  //     this.bankBalance = balancedetails;
  //   if (balancetype == 'BANKBOOK')
  //     this.bankbookBalance = balancedetails;
  //   if (balancetype == 'PASSBOOK')
  //     this.bankpassbookBalance = balancedetails;
  //   if (balancetype == 'LEDGER')
  //     this.ledgerBalance = this.currencySymbol + ' ' + balancedetails;
  //   if (balancetype == 'SUBLEDGER')
  //     this.subledgerBalance = this.currencySymbol + ' ' + balancedetails;
  //   if (balancetype == 'PARTY')
  //     this.partyBalance = this.currencySymbol + ' ' + balancedetails;
  // }
  setBalances(balancetype: string, balanceamount: number | string): void {

  let balancedetails: string = '';

  const amount = Number(balanceamount);

  // if (amount < 0) {
  //   balancedetails =
  //      this._commonService.currencyFormat(Math.abs(amount).toFixed(2)) + ' Cr';
  // } else {
  //   balancedetails =
  //      this._commonService.currencyFormat(amount.toFixed(2)) + ' Dr';
  // }

  switch (balancetype) {
    case 'CASH':
      this.cashBalance = balancedetails;
      break;

    case 'BANK':
      this.bankBalance = balancedetails;
      break;

    case 'BANKBOOK':
      this.bankbookBalance = balancedetails;
      break;

    case 'PASSBOOK':
      this.bankpassbookBalance = balancedetails;
      break;

    case 'LEDGER':
      this.ledgerBalance = `${this.currencySymbol} ${balancedetails}`;
      break;

    case 'SUBLEDGER':
      this.subledgerBalance = `${this.currencySymbol} ${balancedetails}`;
      break;

    case 'PARTY':
      this.partyBalance = `${this.currencySymbol} ${balancedetails}`;
      break;
  }
}



  addModeofpaymentValidations() {

    let modeofpaymentControl = <FormGroup>this.paymentVoucherForm['controls']['pmodofpayment'];
    let transtypeControl = <FormGroup>this.paymentVoucherForm['controls']['ptranstype'];
    let bankControl = <FormGroup>this.paymentVoucherForm['controls']['pbankname'];
    let chequeControl = <FormGroup>this.paymentVoucherForm['controls']['pChequenumber'];
    let cardControl = <FormGroup>this.paymentVoucherForm['controls']['pCardNumber'];
    let typeofpaymentControl = <FormGroup>this.paymentVoucherForm['controls']['ptypeofpayment'];
    let branchnameControl = <FormGroup>this.paymentVoucherForm['controls']['pbranchname'];

    let UpinameControl = <FormGroup>this.paymentVoucherForm['controls']['pUpiname'];
    let UpiidControl = <FormGroup>this.paymentVoucherForm['controls']['pUpiid'];

    if (this.showModeofPayment == true) {
      modeofpaymentControl.setValidators(Validators.required);
      bankControl.setValidators(Validators.required);
      chequeControl.setValidators(Validators.required);
      if (this.showtranstype) {
        transtypeControl.setValidators(Validators.required);
      }
      else {
        transtypeControl.clearValidators();
      }
      if (this.showbankcard) {
        //bankControl.setValidators(Validators.required);
        cardControl.clearValidators();
      }
      else {
        cardControl.setValidators(Validators.required);
        //bankControl.clearValidators();
      }
      if (this.showTypeofPayment) {
        typeofpaymentControl.setValidators(Validators.required);
      }
      else {
        typeofpaymentControl.clearValidators();
      }
      if (this.showbranch) {
        branchnameControl.setValidators(Validators.required);
      }
      else {
        branchnameControl.clearValidators();
      }
      //if (this.showfinancial) {
      //  bankControl.setValidators(Validators.required);
      //}
      //else {

      //  if (this.showbankcard) {
      //    bankControl.setValidators(Validators.required);         
      //  }
      //  else {          
      //    bankControl.clearValidators();
      //  }
      //}

      /////

      if (this.showupi) {
        UpinameControl.setValidators(Validators.required);
        UpiidControl.setValidators(Validators.required);
      }
      else {
        UpinameControl.clearValidators();
        UpiidControl.clearValidators();
      }
    }
    else {
      modeofpaymentControl.clearValidators();
      bankControl.clearValidators();
      chequeControl.clearValidators();
    }


    modeofpaymentControl.updateValueAndValidity();
    transtypeControl.updateValueAndValidity();
    cardControl.updateValueAndValidity();
    bankControl.updateValueAndValidity();
    chequeControl.updateValueAndValidity();
    typeofpaymentControl.updateValueAndValidity();
    branchnameControl.updateValueAndValidity();

    UpinameControl.updateValueAndValidity();
    UpiidControl.updateValueAndValidity();
  }
  transofPaymentChange() {

    this.displayCardName = 'Debit Card';
    this.showTypeofPayment = false;
    this.showbranch = false;
    this.showfinancial = false;
    this.showchequno = false;
    this.showbankcard = true;
    this.displaychequeno = 'Reference No';
    if (this.paymentVoucherForm.controls['ptranstype'].value == "CHEQUE") {
      this.showbankcard = true;
      this.displaychequeno = 'Cheque No';
      this.showbranch = true;
      this.showchequno = true;
    }
    else if (this.paymentVoucherForm.controls['ptranstype'].value == "ONLINE") {
      this.showbankcard = true;
      this.showTypeofPayment = true;
      this.showfinancial = false;
    }
    else if (this.paymentVoucherForm.controls['ptranstype'].value == "DEBIT CARD") {
      this.showbankcard = false;
      this.showfinancial = true;
    }
    else {
      this.displayCardName = 'Credit Card';
      this.showbankcard = false;
      this.showfinancial = true;
    }
    this.addModeofpaymentValidations();
    //  this.cleartranstypeDetails();
  }
  typeofPaymentChange() {

    if (this.paymentVoucherForm.controls['ptypeofpayment'].value == 'UPI') {
      this.showupi = true;
    }
    else {
      this.showupi = false;
    }

    this.GetValidationByControl(this.paymentVoucherForm, 'ptypeofpayment', true);
  }
  // isgstapplicable_Checked(event:any) {
  //   let checked = event.target.checked;
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pisgstapplicable'].setValue(checked);
  //   this.isgstapplicableChange();
  // }
  // istdsapplicable_Checked(event) {
  //   let checked = event.target.checked;
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pistdsapplicable'].setValue(checked);

  //   this.istdsapplicableChange();
  // }
  isgstapplicable_Checked(event: Event): void {
  const checked = (event.target as HTMLInputElement).checked;

  this.paymentVoucherForm
    .get('ppaymentsslistcontrols.pisgstapplicable')
    ?.setValue(checked);

  this.istdsapplicableChange();
}

istdsapplicable_Checked(event: Event): void {
  const checked = (event.target as HTMLInputElement).checked;

  this.paymentVoucherForm
    .get('ppaymentsslistcontrols.pistdsapplicable')
    ?.setValue(checked);

  this.istdsapplicableChange();
}

isgstapplicableChange(): void {
  const group = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
  if (!group) return;

  const data = group.get('pisgstapplicable')?.value;

  const gstCalculationControl = group.get('pgstcalculationtype');
  const gstpercentageControl = group.get('pgstpercentage');
  const stateControl = group.get('pState');
  const gstamountControl = group.get('pgstamount');

  if (!gstCalculationControl || !gstpercentageControl || !stateControl || !gstamountControl) {
    return;
  }

  if (data) {
    this.showgst = true;

    if (!this.disablegst) {
      gstCalculationControl.setValue('INCLUDE');
    }

    gstCalculationControl.setValidators(Validators.required);
    gstpercentageControl.setValidators(Validators.required);
    stateControl.setValidators(Validators.required);
    gstamountControl.setValidators(Validators.required);
  } else {
    this.showgst = false;

    if (!this.disablegst) {
      gstCalculationControl.setValue('');
    }

    gstCalculationControl.clearValidators();
    gstpercentageControl.clearValidators();
    stateControl.clearValidators();
    gstamountControl.clearValidators();
  }

  gstCalculationControl.updateValueAndValidity();
  gstpercentageControl.updateValueAndValidity();
  stateControl.updateValueAndValidity();
  gstamountControl.updateValueAndValidity();

  this.claculategsttdsamounts();
}

istdsapplicableChange(): void {

  const group = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
  if (!group) return;

  const data = group.get('pistdsapplicable')?.value;

  const tdsCalculationControl = group.get('ptdscalculationtype');
  const tdsPercentageControl = group.get('pTdsPercentage');
  const sectionControl = group.get('pTdsSection');
  const tdsAmountControl = group.get('ptdsamount');

  if (data) {
    this.showtds = true;

    if (!this.disabletds) {
      tdsCalculationControl?.setValue('INCLUDE');
    }

    tdsCalculationControl?.setValidators(Validators.required);
    tdsPercentageControl?.setValidators(Validators.required);
    sectionControl?.setValidators(Validators.required);
    tdsAmountControl?.setValidators(Validators.required);

  } else {
    this.showtds = false;

    if (!this.disabletds) {
      tdsCalculationControl?.setValue('');
    }

    tdsCalculationControl?.clearValidators();
    tdsPercentageControl?.clearValidators();
    sectionControl?.clearValidators();
    tdsAmountControl?.clearValidators();
  }

  // Update validity for all controls
  tdsCalculationControl?.updateValueAndValidity();
  tdsPercentageControl?.updateValueAndValidity();
  sectionControl?.updateValueAndValidity();
  tdsAmountControl?.updateValueAndValidity();

  // Recalculate GST/TDS amounts
  this.claculategsttdsamounts();
}

  // isgstapplicableChange() {


  //   let data = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pisgstapplicable').value;

  //   let gstCalculationControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstcalculationtype'];
  //   let gstpercentageControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstpercentage'];
  //   let stateControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pState'];
  //   let gstamountControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstamount'];
  //   //let gstno = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstno'];

  //   if (data) {
  //     this.showgst = true;
  //     if (this.disablegst == false)
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstcalculationtype'].setValue('INCLUDE')
  //     gstCalculationControl.setValidators(Validators.required);
  //     gstpercentageControl.setValidators(Validators.required);
  //     stateControl.setValidators(Validators.required);
  //     gstamountControl.setValidators(Validators.required);
  //   }
  //   else {
  //     gstCalculationControl.clearValidators();
  //     gstpercentageControl.clearValidators();
  //     stateControl.clearValidators();
  //     gstamountControl.clearValidators();
  //     //gstno.clearValidators();


  //     this.showgst = false;
  //     if (this.disablegst == false)
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstcalculationtype'].setValue('');
  //   }
  //   gstCalculationControl.updateValueAndValidity();
  //   gstpercentageControl.updateValueAndValidity();
  //   stateControl.updateValueAndValidity();
  //   gstamountControl.updateValueAndValidity();
  //   //gstno.updateValueAndValidity();
  //   this.claculategsttdsamounts();
  // }


  // istdsapplicableChange() {


  //   let data = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pistdsapplicable').value;

  //   let tdsCalculationControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptdscalculationtype'];
  //   let tdspercentageControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsPercentage'];
  //   let sectionControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsSection'];
  //   let tdsamountControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptdsamount'];

  //   if (data) {
  //     this.showtds = true;
  //     if (this.disabletds == false)
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptdscalculationtype'].setValue('INCLUDE');
  //     tdsCalculationControl.setValidators(Validators.required);
  //     tdspercentageControl.setValidators(Validators.required);
  //     sectionControl.setValidators(Validators.required);
  //     tdsamountControl.setValidators(Validators.required);
  //   }
  //   else {
  //     this.showtds = false;
  //     if (this.disabletds == false)
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptdscalculationtype'].setValue('')
  //     tdsCalculationControl.clearValidators();
  //     tdspercentageControl.clearValidators();
  //     sectionControl.clearValidators();
  //     tdsamountControl.clearValidators();
  //   }

  //   tdsCalculationControl.updateValueAndValidity();
  //   tdspercentageControl.updateValueAndValidity();
  //   sectionControl.updateValueAndValidity();
  //   tdsamountControl.updateValueAndValidity();

  //   this.claculategsttdsamounts();

  // }

  getLoadData() {

    // this._AccountingTransactionsService.GetReceiptsandPaymentsLoadingData('JOURNAL VOUCHER', this._commonService.getschemaname()).subscribe(json => {

    //   //console.log(json)
    //   if (json != null) {

    //     this.banklist = json.banklist;
    //     this.modeoftransactionslist = json.modeofTransactionslist;
    //     this.typeofpaymentlist = this.gettypeofpaymentdata();
    //     this.ledgeraccountslist = json.accountslist;
    //     this.partylist = json.partylist;
    //     this.gstlist = json.gstlist;

    //     this.debitcardlist = json.bankdebitcardslist;

    //     this.setBalances('CASH', json.cashbalance);
    //     this.setBalances('BANK', json.bankbalance);
    //     //this.lstLoanTypes = json
    //     //this.titleDetails = json as string
    //     //this.titleDetails = eval("(" + this.titleDetails + ')');
    //     //this.titleDetails = this.titleDetails.FT;
    //   }
    // },
    //   (error) => {

    //     this._commonService.showErrorMessage(error);
    //   });
  }

  // gettypeofpaymentdata(): any {

  //   let data = this.modeoftransactionslist.filter(function(payment) {
  //     return payment.ptranstype == payment.ptypeofpayment;
  //   });
  //   return data;
  // }


gettypeofpaymentdata(): any[] {
  return this.modeoftransactionslist.filter(
    (payment: any) => payment.ptranstype === payment.ptypeofpayment
  );
}



  trackByFn(index: any, item: any) {
    return index; // or item.id
  }
  bankName_Change($event: any): void {

    const pbankid = $event.target.value;
    this.upinameslist = [];
    this.chequenumberslist = [];
    this.paymentVoucherForm['controls']['pUpiname'].setValue('');
    this.paymentVoucherForm['controls']['pUpiid'].setValue('');
    if (pbankid && pbankid != '') {
      const bankname = $event.target.options[$event.target.selectedIndex].text;
      this.GetBankDetailsbyId(pbankid);
      this.getBankBranchName(pbankid);
      this.paymentVoucherForm['controls']['pbankname'].setValue(bankname);

    }
    else {

      this.paymentVoucherForm['controls']['pbankname'].setValue('');
    }

    this.GetValidationByControl(this.paymentVoucherForm, 'pbankname', true);
    this.formValidationMessages['pChequenumber'] = '';
  }
  chequenumber_Change() {

    this.GetValidationByControl(this.paymentVoucherForm, 'pChequenumber', true);
  }
  debitCard_Change() {

    let data = this.getbankname(this.paymentVoucherForm.controls['pCardNumber'].value);
    this.paymentVoucherForm['controls']['pbankname'].setValue(data.pbankname);
    this.paymentVoucherForm['controls']['pbankid'].setValue(data.pbankid);
    this.GetValidationByControl(this.paymentVoucherForm, 'pCardNumber', true);
  }
  // getbankname(cardnumber) {
  //   try {
  //     let data = this.debitcardlist.filter(function(debit) {
  //       return debit.pCardNumber == cardnumber;
  //     })[0];
  //     this.setBalances('BANKBOOK', data.pbankbookbalance);
  //     this.setBalances('PASSBOOK', data.ppassbookbalance);
  //     return data;
  //   } catch (e) {
  //     // this._commonService.showErrorMessage(e);
  //   }
  // }
  getbankname(cardnumber: string): any {
  const data = this.debitcardlist.find(
    (debit: any) => debit.pCardNumber === cardnumber
  );

  if (!data) return null;

  this.setBalances('BANKBOOK', data.pbankbookbalance);
  this.setBalances('PASSBOOK', data.ppassbookbalance);

  return data;
}

  ledgerName_Change($event: any): void {
    debugger
    const pledgerid = $event.pledgerid;
    this.subledgeraccountslist = [];

    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgerid'].setValue(null);
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgername'].setValue('');
    
    this.paymentVoucherForm
  .get('ppaymentsslistcontrols.psubledgerid')
  ?.setValue(null);

this.paymentVoucherForm
  .get('ppaymentsslistcontrols.psubledgername')
  ?.setValue('');

    this.ledgerBalance = this.currencySymbol + ' 0.00' + ' Dr';
    this.subledgerBalance = this.currencySymbol + ' 0.00' + ' Dr';
    if (pledgerid && pledgerid != '') {
      const ledgername = $event.pledgername;
      let data = this.ledgeraccountslist.filter(function(ledger: { pledgerid: any; }) {
        return ledger.pledgerid == pledgerid;
      })[0];
      this.setBalances('LEDGER', data.accountbalance);
      this.GetSubLedgerData(pledgerid);
       this.paymentVoucherForm
  .get('ppaymentsslistcontrols.pledgername')
  ?.setValue(ledgername);
      //this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pledgername'].setValue(ledgername);
    }
    else {
      this.setBalances('LEDGER', 0);
       this.paymentVoucherForm
  .get('ppaymentsslistcontrols.pledgername')
  ?.setValue('');
      //this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pledgername'].setValue('');
    }
  }

  GetSubLedgerData(pledgerid: any) {
    debugger
    // this._AccountingTransactionsService.GetSubLedgerData(pledgerid).subscribe(json => {

    //   //console.log(json)
    //   if (json != null) {

    //     this.subledgeraccountslist = json;

    //     let subLedgerControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgername'];
    //     if (this.subledgeraccountslist.length > 0) {
    //       this.showsubledger = true;
    //       subLedgerControl.setValidators(Validators.required);

    //     }
    //     else {
    //       subLedgerControl.clearValidators();

    //       this.showsubledger = false;
    //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgerid'].setValue(pledgerid);
    //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgername'].setValue(this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pledgername').value);
    //       this.formValidationMessages['psubledgername'] = '';
    //     }
    //     subLedgerControl.updateValueAndValidity();
    //     //this.lstLoanTypes = json
    //     //this.titleDetails = json as string
    //     //this.titleDetails = eval("(" + this.titleDetails + ')');
    //     //this.titleDetails = this.titleDetails.FT;
    //   }
    // },
    //   (error) => {

    //     this._commonService.showErrorMessage(error);
    //   });
  }
  subledger_Change($event:any) {

    let psubledgerid
    if ($event != undefined) {
      psubledgerid = $event.psubledgerid;
    }
    this.subledgerBalance = this.currencySymbol + ' 0.00' + ' Dr';
    if (psubledgerid && psubledgerid != '') {
      const subledgername = $event.psubledgername;

      // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgername'].setValue(subledgername);

         this.paymentVoucherForm
  .get('ppaymentsslistcontrols.psubledgername')
  ?.setValue('');
      let data = this.subledgeraccountslist.filter(function(ledger: { psubledgerid: any; }) {
        return ledger.psubledgerid == psubledgerid;
      })[0];
      this.setBalances('SUBLEDGER', data.accountbalance);

    }
    else {

      this.paymentVoucherForm
  .get('ppaymentsslistcontrols.psubledgername')
  ?.setValue('');
      // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgername'].setValue('');
      this.setBalances('SUBLEDGER', 0);
    }
    this.GetValidationByControl(this.paymentVoucherForm, 'psubledgername', true);
  }
  upiName_Change($event: any): void {

    const districtid = $event.target.value;

    if (districtid && districtid != '') {
      const districtname = $event.target.options[$event.target.selectedIndex].text;

      //this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue(districtname);
      //this.contactForm['controls']['pAddressControls']['controls']['pDistrictId'].setValue(districtid);
    }
    else {

      //this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue('');
    }
    this.GetValidationByControl(this.paymentVoucherForm, 'pUpiname', true);
  }
  upid_change() {
    this.GetValidationByControl(this.paymentVoucherForm, 'pUpiid', true);

  }
  GetBankDetailsbyId(pbankid:any) {

    // this._AccountingTransactionsService.GetBankDetailsbyId(pbankid).subscribe(json => {

    //   //console.log(json)
    //   if (json != null) {

    //     this.upinameslist = json.bankupilist;
    //     this.chequenumberslist = json.chequeslist;


    //     //this.lstLoanTypes = json
    //     //this.titleDetails = json as string
    //     //this.titleDetails = eval("(" + this.titleDetails + ')');
    //     //this.titleDetails = this.titleDetails.FT;
    //   }
    // },
    //   (error) => {

    //     this._commonService.showErrorMessage(error);
    //   });
  }
  getBankBranchName(pbankid: any) {

    // let data = this.banklist.filter(function(bank) {
    //   return bank.pbankid == pbankid;
    // });
    let data = this.banklist.filter(
  (bank: any) => bank.pbankid === pbankid
);

    this.paymentVoucherForm['controls']['pbranchname'].setValue(data[0].pbranchname);
    this.setBalances('BANKBOOK', data[0].pbankbalance);
    this.setBalances('PASSBOOK', data[0].pbankpassbookbalance);
  }

  tdsSection_Change($event: any): void {

    const ptdssection = $event.target.value;
    this.tdspercentagelist = [];
     this.paymentVoucherForm
  .get('ppaymentsslistcontrols.pTdsPercentage')
  ?.setValue('');
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsPercentage'].setValue('');
    if (ptdssection && ptdssection != '') {

      this.gettdsPercentage(ptdssection);

    }
    this.GetValidationByControl(this.paymentVoucherForm, 'pTdsSection', true);
  }
  gettdsPercentage(ptdssection:any) {

    // this.tdspercentagelist = this.tdslist.filter(function(tds) {
    //   return tds.pTdsSection == ptdssection;
    // });
this.tdspercentagelist = this.tdslist.filter(
  (item: any) => item.pTdsSection === ptdssection
);

    this.claculategsttdsamounts();
  }
  tds_Change($event: any): void {
    this.GetValidationByControl(this.paymentVoucherForm, 'pTdsPercentage', true);
    this.GetValidationByControl(this.paymentVoucherForm, 'ptdsamount', true);
    this.claculategsttdsamounts();
  }
  gst_Change($event: any): void {

    const gstpercentage = $event.target.value;

    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pigstpercentage'].setValue('');
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcgstpercentage'].setValue('');
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psgstpercentage'].setValue('');
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['putgstpercentage'].setValue('');

let group = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

group.get('pigstpercentage')?.setValue('');
group.get('pcgstpercentage')?.setValue('');
group.get('psgstpercentage')?.setValue('');
group.get('putgstpercentage')?.setValue('');


    if (gstpercentage && gstpercentage != '') {

      this.getgstPercentage(gstpercentage);

    }
    this.GetValidationByControl(this.paymentVoucherForm, 'pgstpercentage', true);
    this.GetValidationByControl(this.paymentVoucherForm, 'pgstamount', true);
  }
  getgstPercentage(gstpercentage:any) {

    // let data = this.gstlist.filter(function(tds) {
    //   return tds.pgstpercentage == gstpercentage;
    // });
  let data = this.gstlist.filter(
  (item: any) => item.pTdsSection === gstpercentage
);

    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pigstpercentage'].setValue(data[0].pigstpercentage);
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcgstpercentage'].setValue(data[0].pcgstpercentage);
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psgstpercentage'].setValue(data[0].psgstpercentage);
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['putgstpercentage'].setValue(data[0].putgstpercentage);
   const group = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
const gstData = data[0];

if (group && gstData) {
  group.get('pigstpercentage')?.setValue(gstData.pigstpercentage);
  group.get('pcgstpercentage')?.setValue(gstData.pcgstpercentage);
  group.get('psgstpercentage')?.setValue(gstData.psgstpercentage);
  group.get('putgstpercentage')?.setValue(gstData.putgstpercentage);
}

   
    this.claculategsttdsamounts();

  }

  partyName_Change($event: any): void {

    let ppartyid;
    if ($event != undefined) {
      ppartyid = $event.ppartyid;
    }
    this.statelist = [];
    this.tdssectionlist = [];
    this.tdspercentagelist = [];
    this.paymentVoucherForm.get('ppaymentsslistcontrols.pStateId')?.setValue('');
this.paymentVoucherForm.get('ppaymentsslistcontrols.pState')?.setValue('');
this.paymentVoucherForm.get('ppaymentsslistcontrols.pTdsSection')?.setValue('');
this.paymentVoucherForm.get('ppaymentsslistcontrols.pTdsPercentage')?.setValue('');
this.paymentVoucherForm.get('ppaymentsslistcontrols.ppartyreferenceid')?.setValue('');
this.paymentVoucherForm.get('ppaymentsslistcontrols.ppartyreftype')?.setValue('');
this.paymentVoucherForm.get('ppaymentsslistcontrols.ppartypannumber')?.setValue('');

    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pStateId'].setValue('');
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pState'].setValue('');
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsSection'].setValue('');
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsPercentage'].setValue('');
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyreferenceid'].setValue('');
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyreftype'].setValue('');
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartypannumber'].setValue('');
    this.partyBalance = this.currencySymbol + ' 0.00' + ' Dr';
    if (ppartyid && ppartyid != '') {
      //const ledgername = $event.target.options[$event.target.selectedIndex].text;
      //this.getPartyDetailsbyid(ppartyid);
      //this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyname'].setValue(ledgername);
      const partynamename = $event.ppartyname;
      // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyname'].setValue(partynamename);
      // let data = (this.partylist.filter(x => x.ppartyid == ppartyid))[0];
      // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyreferenceid'].setValue(data.ppartyreferenceid);
      // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyreftype'].setValue(data.ppartyreftype);
      // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartypannumber'].setValue(data.ppartypannumber);


const group = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

group.get('ppartyname')?.setValue(partynamename);

const data = this.partylist.find((x: { ppartyid: any; }) => x.ppartyid === ppartyid);

if (data) {
  group.get('ppartyreferenceid')?.setValue(data.ppartyreferenceid);
  group.get('ppartyreftype')?.setValue(data.ppartyreftype);
  group.get('ppartypannumber')?.setValue(data.ppartypannumber);
} else {
  
  group.get('ppartyreferenceid')?.setValue('');
  group.get('ppartyreftype')?.setValue('');
  group.get('ppartypannumber')?.setValue('');
}

      this.getPartyDetailsbyid(ppartyid, partynamename);
      this.setenableordisabletdsgst(partynamename, 'PARTYCHANGE');
    }
    else {
      this.setBalances('PARTY', 0);
      // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyname'].setValue('');
          this.paymentVoucherForm.get('ppaymentsslistcontrols.ppartyname')?.setValue('');

    }
  }
  // setenableordisabletdsgst(ppartyname, changetype) {


  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pistdsapplicable'].setValue(false);
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pisgstapplicable'].setValue(false);
  //   let data = this.paymentslist.filter(x => x.ppartyname == ppartyname);
  //   if (data != null) {
  //     if (data.length > 0) {

  //       this.disablegst = true;
  //       this.disabletds = true;

  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pistdsapplicable'].setValue(data[0].pistdsapplicable);
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pisgstapplicable'].setValue(data[0].pisgstapplicable);
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstcalculationtype'].setValue(data[0].pgstcalculationtype)
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptdscalculationtype'].setValue(data[0].ptdscalculationtype)
  //     }
  //     else {
  //       this.disablegst = false;
  //       this.disabletds = false;
  //     }
  //   }
  //   else {
  //     this.disablegst = false;
  //     this.disabletds = false;
  //   }
  //   if (changetype = 'PARTYCHANGE') {
  //     this.isgstapplicableChange();
  //     this.istdsapplicableChange();
  //   }
  // }
  setenableordisabletdsgst(ppartyname: string, changetype: string) {

  const group = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
  if (!group) return;

  // Reset TDS/GST flags
  group.get('pistdsapplicable')?.setValue(false);
  group.get('pisgstapplicable')?.setValue(false);

  // Find the payment data for the party
  const data = this.paymentslist.find((x: { ppartyname: string; }) => x.ppartyname === ppartyname);

  if (data) {
    this.disablegst = true;
    this.disabletds = true;

    group.get('pistdsapplicable')?.setValue(data.pistdsapplicable);
    group.get('pisgstapplicable')?.setValue(data.pisgstapplicable);
    group.get('pgstcalculationtype')?.setValue(data.pgstcalculationtype);
    group.get('ptdscalculationtype')?.setValue(data.ptdscalculationtype);

  } else {
    this.disablegst = false;
    this.disabletds = false;
  }

  // Call change handlers only if type is PARTYCHANGE
  if (changetype === 'PARTYCHANGE') {
    this.isgstapplicableChange();
    this.istdsapplicableChange();
  }
}

  getPartyDetailsbyid(ppartyid: any, partynamename: any) {

    // this._AccountingTransactionsService.getPartyDetailsbyid(ppartyid).subscribe(json => {

    //   //console.log(json)
    //   if (json != null) {

    //     this.tdslist = json.lstTdsSectionDetails;
    //     let newdata = json.lstTdsSectionDetails.map(item => item.pTdsSection)
    //       .filter((value, index, self) => self.indexOf(value) === index)
    //     for (let i = 0; i < newdata.length; i++) {
    //       let object = { pTdsSection: newdata[i] }
    //       this.tdssectionlist.push(object);
    //     }
    //     this.statelist = json.statelist;
    //     this.claculategsttdsamounts();
    //     this.setBalances('PARTY', json.accountbalance);

    //     //this.lstLoanTypes = json
    //     //this.titleDetails = json as string
    //     //this.titleDetails = eval("(" + this.titleDetails + ')');
    //     //this.titleDetails = this.titleDetails.FT;
    //   }
    // },
    //   (error) => {

    //     // this._commonService.showErrorMessage(error);
    //   });
  }
  gsno_change() {
    this.GetValidationByControl(this.paymentVoucherForm, 'pgstno', true);
  }
  state_change(event:any) {

    const pstateid = event.target.value;
    //this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstpercentage'].setValue('');
    if (pstateid && pstateid != '') {


      const statename = event.target.options[event.target.selectedIndex].text;
       this.paymentVoucherForm.get('ppaymentsslistcontrols.pState')?.setValue(statename);
      // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pState'].setValue(statename);
      //let gstnoControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstno'];

      let gstno = statename.split('-')[1];
      if (gstno) {
        //gstnoControl.clearValidators();
        this.showgstno = false;
      }
      else {
        this.showgstno = true;
        //  gstnoControl.setValidators(Validators.required);
      }
      //gstnoControl.updateValueAndValidity();

      let data = this.GetStatedetailsbyId(pstateid);

      this.showgstamount = true;
      this.showigst = false;
      this.showcgst = false;
      this.showsgst = false;
      this.showutgst = false;

      // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgsttype'].setValue(data.pgsttype);
      this.paymentVoucherForm.get('ppaymentsslistcontrols.pgsttype')?.setValue(data.pgsttype);
      if (data.pgsttype == 'IGST')
        this.showigst = true;
      else {
        this.showcgst = true;
        if (data.pgsttype == 'CGST,SGST')
          this.showsgst = true;
        if (data.pgsttype == 'CGST,UTGST')
          this.showutgst = true;
      }
    }
    else {

      // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pState'].setValue('');
            this.paymentVoucherForm.get('ppaymentsslistcontrols.pgsttype')?.setValue('');

    }
    this.GetValidationByControl(this.paymentVoucherForm, 'pState', true);
    this.formValidationMessages['pigstpercentage'] = '';
    this.claculategsttdsamounts();
  }
GetStatedetailsbyId(pstateid: any): any {
  return this.statelist.find((tds: { pStateId: any; }) => tds.pStateId === pstateid);
}

  pamount_change() {

    //let paidamount = parseFloat(this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pamount').value);

    //if (isNaN(paidamount))
    //  paidamount = 0;

    //this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pactualpaidamount'].setValue(paidamount);
    debugger;
    this.claculategsttdsamounts();
  }
  // claculategsttdsamounts() {

  //   try {

  //     let paidamount;
  //     let typeofamount = "";
  //     let typeoftotalamount = "";
  //     if (this.amounttype == 'Debit') {
  //       paidamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pdebitamount').value;
  //       if (isNullOrEmptyString(paidamount))
  //         paidamount = 0;
  //       else
  //         paidamount = parseFloat(paidamount.toString().replace(/,/g, ""));
  //       typeoftotalamount = 'ptotaldebitamount';

  //     }
  //     if (this.amounttype == 'Credit') {

  //       paidamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pcreditamount').value;
  //       if (isNullOrEmptyString(paidamount))
  //         paidamount = 0;
  //       else
  //         paidamount = parseFloat(paidamount.toString().replace(/,/g, ""));
  //       typeoftotalamount = 'ptotalcreditamount';
  //     }


  //     //paidamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get(typeofamount).value;
  //     if (isNaN(paidamount) || paidamount == null)
  //       paidamount = 0;
  //     else
  //       paidamount = parseFloat(paidamount.toString().replace(/,/g, ""));
  //     let actualpaidamount = paidamount;
  //     let isgstapplicable = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pisgstapplicable').value;
  //     let gsttype = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pgsttype').value;
  //     let gstcalculationtype = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pgstcalculationtype').value;

  //     let igstpercentage = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pigstpercentage').value;
  //     if (isNaN(igstpercentage))
  //       igstpercentage = 0;
  //     let cgstpercentage = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pcgstpercentage').value;
  //     if (isNaN(cgstpercentage))
  //       cgstpercentage = 0;
  //     let sgstpercentage = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('psgstpercentage').value;
  //     if (isNaN(sgstpercentage))
  //       sgstpercentage = 0;
  //     let utgstpercentage = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('putgstpercentage').value;
  //     if (isNaN(utgstpercentage))
  //       utgstpercentage = 0;

  //     let gstamount = 0;
  //     let igstamount = 0;
  //     let cgstamount = 0;
  //     let sgstamount = 0;
  //     let utgstamount = 0;
  //     let totalamount = 0;


  //     if (isgstapplicable) {
  //       if (gstcalculationtype == 'INCLUDE') {
  //         gstamount = Math.round((paidamount * igstpercentage) / (100 + igstpercentage));
  //         if (gsttype == 'IGST') {
  //           igstamount = Math.round((paidamount * igstpercentage) / (100 + igstpercentage));
  //           actualpaidamount = paidamount - igstamount;
  //         }

  //         else if (gsttype == 'CGST,SGST') {
  //           cgstamount = Math.round((paidamount * cgstpercentage) / (100 + igstpercentage));
  //           sgstamount = Math.round((paidamount * sgstpercentage) / (100 + igstpercentage));

  //           actualpaidamount = paidamount - (cgstamount + sgstamount);
  //         }
  //         else if (gsttype == 'CGST,UTGST') {
  //           cgstamount = Math.round((paidamount * cgstpercentage) / (100 + igstpercentage));
  //           utgstamount = Math.round((paidamount * utgstpercentage) / (100 + igstpercentage));
  //           actualpaidamount = paidamount - (cgstamount + utgstamount);
  //         }
  //       }
  //       else if (gstcalculationtype == 'EXCLUDE') {
  //         gstamount = Math.round((paidamount * igstpercentage) / (100));
  //         if (gsttype == 'IGST') {
  //           igstamount = Math.round((paidamount * igstpercentage) / (100));
  //         }
  //         else if (gsttype == 'CGST,SGST') {
  //           cgstamount = Math.round((paidamount * cgstpercentage) / (100));
  //           sgstamount = Math.round((paidamount * sgstpercentage) / (100));

  //         }
  //         else if (gsttype == 'CGST,UTGST') {
  //           cgstamount = Math.round((paidamount * cgstpercentage) / (100));
  //           utgstamount = Math.round((paidamount * utgstpercentage) / (100));
  //         }
  //         actualpaidamount = paidamount;
  //       }
  //     }

  //     let tdscalculationtype = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('ptdscalculationtype').value;
  //     let istdsapplicable = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pistdsapplicable').value;
  //     let tdspercentage = parseFloat(this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pTdsPercentage').value.toString().replace(/,/g, ""));

  //     if (isNaN(tdspercentage))
  //       tdspercentage = 0;

  //     let tdsamount = 0;

  //     if (istdsapplicable) {
  //       if (tdscalculationtype == 'INCLUDE') {
  //         if (gstcalculationtype == 'INCLUDE') {
  //           tdsamount = Math.round((actualpaidamount * tdspercentage) / (100 + tdspercentage));
  //         }
  //         else {
  //           tdsamount = Math.round((paidamount * tdspercentage) / (100 + tdspercentage));
  //         }
  //         actualpaidamount = actualpaidamount - tdsamount;

  //       }
  //       else if (tdscalculationtype == 'EXCLUDE') {
  //         tdsamount = Math.round((paidamount * tdspercentage) / (100));

  //         actualpaidamount = actualpaidamount;
  //       }
  //     }

  //     if (isNaN(gstamount))
  //       gstamount = 0;
  //     if (isNaN(igstamount))
  //       igstamount = 0;
  //     if (isNaN(cgstamount))
  //       cgstamount = 0;
  //     if (isNaN(sgstamount))
  //       sgstamount = 0;
  //     if (isNaN(utgstamount))
  //       utgstamount = 0;
  //     if (isNaN(tdsamount))
  //       tdsamount = 0;

  //     totalamount = actualpaidamount + sgstamount + igstamount + cgstamount + utgstamount + tdsamount;
  //     if (isNaN(totalamount))
  //       totalamount = 0;


  //     if (actualpaidamount > 0)
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pamount'].setValue((actualpaidamount));
  //     else
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pamount'].setValue('');

  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstamount'].setValue((gstamount));
  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pigstamount'].setValue((igstamount));
  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcgstamount'].setValue((cgstamount));
  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psgstamount'].setValue((sgstamount));
  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['putgstamount'].setValue((utgstamount));
  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptdsamount'].setValue((tdsamount));
  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptotalamount'].setValue((totalamount));
  //     if (this.amounttype == 'Debit') {
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptotaldebitamount'].setValue((totalamount));
  //     }
  //     if (this.amounttype == 'Credit') {
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptotalcreditamount'].setValue((totalamount));
  //     }

  //     this.formValidationMessages['pamount'] = '';

  //     //if (typeofamount != '') {
  //     //  this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls'][typeoftotalamount].setValue((totalamount));
  //     ////  let Pamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pamount').value;
  //     // // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls'][typeofamount].setValue(Pamount);
  //     //  //let amount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get(typeofamount).value;
  //     //  //let gstamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pgstamount').value;
  //     //  //let tdsamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('ptdsamount').value;

  //     //  //amount = parseFloat(amount.toString().replace(/,/g, ""));
  //     //  //gstamount = parseFloat(gstamount.toString().replace(/,/g, ""));
  //     //  //tdsamount = parseFloat(tdsamount.toString().replace(/,/g, ""));

  //     //  //let totaldamount = amount + gstamount + tdsamount;
  //     //  //if (isNaN(totaldamount))
  //     //  //  totaldamount = '';



  //     //}
  //   } catch (e) {
  //     this._commonService.showErrorMessage(e);
  //   }
  // }
  claculategsttdsamounts(): void {
  try {
    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
    if (!group) return;

    // Get paid amount
    let paidAmountStr = this.amounttype === 'Debit'
      ? group.get('pdebitamount')?.value
      : group.get('pcreditamount')?.value;

    let paidAmount = paidAmountStr && !isNullOrEmptyString(paidAmountStr)
      ? parseFloat(paidAmountStr.toString().replace(/,/g, ''))
      : 0;

      
    if (isNaN(paidAmount)) paidAmount = 0;

    let actualPaidAmount = paidAmount;

    // GST values
    const isGstApplicable = group.get('pisgstapplicable')?.value;
    const gstType = group.get('pgsttype')?.value;
    const gstCalcType = group.get('pgstcalculationtype')?.value;

    const igstPercentage = parseFloat(group.get('pigstpercentage')?.value ?? '0');
    const cgstPercentage = parseFloat(group.get('pcgstpercentage')?.value ?? '0');
    const sgstPercentage = parseFloat(group.get('psgstpercentage')?.value ?? '0');
    const utgstPercentage = parseFloat(group.get('putgstpercentage')?.value ?? '0');

    let gstAmount = 0, igstAmount = 0, cgstAmount = 0, sgstAmount = 0, utgstAmount = 0;

    if (isGstApplicable) {
      if (gstCalcType === 'INCLUDE') {
        if (gstType === 'IGST') {
          igstAmount = Math.round((paidAmount * igstPercentage) / (100 + igstPercentage));
          actualPaidAmount -= igstAmount;
          gstAmount = igstAmount;
        } else if (gstType === 'CGST,SGST') {
          cgstAmount = Math.round((paidAmount * cgstPercentage) / (100 + igstPercentage));
          sgstAmount = Math.round((paidAmount * sgstPercentage) / (100 + igstPercentage));
          actualPaidAmount -= (cgstAmount + sgstAmount);
          gstAmount = cgstAmount + sgstAmount;
        } else if (gstType === 'CGST,UTGST') {
          cgstAmount = Math.round((paidAmount * cgstPercentage) / (100 + igstPercentage));
          utgstAmount = Math.round((paidAmount * utgstPercentage) / (100 + igstPercentage));
          actualPaidAmount -= (cgstAmount + utgstAmount);
          gstAmount = cgstAmount + utgstAmount;
        }
      } else if (gstCalcType === 'EXCLUDE') {
        if (gstType === 'IGST') igstAmount = Math.round((paidAmount * igstPercentage) / 100);
        else if (gstType === 'CGST,SGST') {
          cgstAmount = Math.round((paidAmount * cgstPercentage) / 100);
          sgstAmount = Math.round((paidAmount * sgstPercentage) / 100);
        } else if (gstType === 'CGST,UTGST') {
          cgstAmount = Math.round((paidAmount * cgstPercentage) / 100);
          utgstAmount = Math.round((paidAmount * utgstPercentage) / 100);
        }
        gstAmount = igstAmount + cgstAmount + sgstAmount + utgstAmount;
      }
    }

    
    const isTdsApplicable = group.get('pistdsapplicable')?.value;
    const tdsCalcType = group.get('ptdscalculationtype')?.value;
    const tdsPercentage = parseFloat(group.get('pTdsPercentage')?.value?.toString().replace(/,/g, '') ?? '0');
    let tdsAmount = 0;

    if (isTdsApplicable && tdsPercentage > 0) {
      if (tdsCalcType === 'INCLUDE') {
        tdsAmount = gstCalcType === 'INCLUDE'
          ? Math.round((actualPaidAmount * tdsPercentage) / (100 + tdsPercentage))
          : Math.round((paidAmount * tdsPercentage) / (100 + tdsPercentage));
        actualPaidAmount -= tdsAmount;
      } else if (tdsCalcType === 'EXCLUDE') {
        tdsAmount = Math.round((paidAmount * tdsPercentage) / 100);
      }
    }


    const totalAmount = actualPaidAmount + igstAmount + cgstAmount + sgstAmount + utgstAmount + tdsAmount;

  
    group.get('pamount')?.setValue(actualPaidAmount > 0 ? actualPaidAmount : '');
    group.get('pgstamount')?.setValue(gstAmount);
    group.get('pigstamount')?.setValue(igstAmount);
    group.get('pcgstamount')?.setValue(cgstAmount);
    group.get('psgstamount')?.setValue(sgstAmount);
    group.get('putgstamount')?.setValue(utgstAmount);
    group.get('ptdsamount')?.setValue(tdsAmount);
    group.get('ptotalamount')?.setValue(totalAmount);

    if (this.amounttype === 'Debit') group.get('ptotaldebitamount')?.setValue(totalAmount);
    if (this.amounttype === 'Credit') group.get('ptotalcreditamount')?.setValue(totalAmount);

    this.formValidationMessages['pamount'] = '';

  } catch (e) {
    // this._commonService.showErrorMessage(e);
  }
}

  validateaddPaymentDetails(): boolean {
    debugger;
    let isValid: boolean = true;
    const formControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols'];
    try {
      isValid = this.checkValidations(formControl, isValid)
      let ledgername = formControl.controls['pledgername'].value;
      let subledgername = formControl.controls['psubledgername'].value;
      let partyname = formControl.controls['ppartyname'].value;

      let griddata = this.paymentslist;

      let count = 0;


      for (let i = 0; i < griddata.length; i++) {
        if (griddata[i].pledgername == ledgername && griddata[i].psubledgername == subledgername && griddata[i].ppartyname == partyname) {
          count = 1;
          break;
        }

      }
      if (count == 1) {
        // this._commonService.showWarningMessage('Ledgername, Party name  already exists in grid');
        isValid = false;
      }
    } catch (e) {
      // this._commonService.showErrorMessage(e);
    }
    //this.formValidationMessages['pdebitamount'] = 'required';
    //this.formValidationMessages['pcreditamount'] = 'required';

    return isValid;
  }
  // addPaymentDetails() {
  //   debugger;
  //   const control = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols'];
  //   if (this.validateaddPaymentDetails()) {
  //     let accounthedadid = this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pledgerid'].value;
  //     let subcategoryid = this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgerid'].value;
  //     //let amount = this._commonService.removeCommasInAmount(this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pactualpaidamount'].value);

  //     // let amount = this._commonService.removeCommasInAmount(this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pamount'].value);


  //     let stateid = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pStateId').value;
  //     if (stateid == "" || stateid == null)
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pStateId'].setValue(0);

  //     let tdspercentage = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pTdsPercentage').value;
  //     if (tdspercentage == "" || tdspercentage == null)
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsPercentage'].setValue(0);

  //     let gstpercentage = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pgstpercentage').value;
  //     if (gstpercentage == "" || gstpercentage == null)
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstpercentage'].setValue(0);

  //     let debitamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('ptotaldebitamount').value;
  //     if (debitamount == "" || debitamount == null || debitamount == 0)
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptotaldebitamount'].setValue('');

  //     let creditamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('ptotalcreditamount').value;
  //     if (creditamount == "" || creditamount == null || creditamount == 0)
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptotalcreditamount'].setValue('');

  //     // this._AccountingTransactionsService.GetSubLedgerRestrictedStatus(subcategoryid).subscribe(res => {
  //     //   debugger;
  //     //   let creditstatus = res[0].credit_restriction_status;
  //     //   let debitstatus = res[0].debit_restriction_status;
  //     //   if ((debitamount > 0 && debitstatus == false) || (creditamount > 0 && creditstatus == false)) {

  //     //     this._SubscriberJVService.GetdebitchitCheckbalance(accounthedadid, "", subcategoryid).subscribe(result => {
  //     //       debugger;
  //     //       this.debittotalamount = 0;
  //     //        this.credittotalamount = 0;
            
  //     //        if (amount <= parseFloat(result['balanceamount'].toString()) && Boolean(result['balancecheckstatus'].toString()) || amount <= parseFloat(result['balanceamount'].toString()) || ((result['balancecheckstatus'].toString()))=='false') {
  //     //         //ADDED ON 19.05.2023
  //     //       //if (amount <= parseFloat(result['balanceamount'].toString()) || Boolean(result['balancecheckstatus'].toString())) {
  //     //         //this.paymentslist.push(control.value);
  //     //         let data = control.value;
  //     //         this.paymentslist = [...this.paymentslist, data]
  //     //         this.paymentslist.filter(data => {
  //     //           if (data.ptotalcreditamount != "") {
  //     //             data.ptotalcreditamount = this._commonService.removeCommasForEntredNumber(data.ptotalcreditamount);
  //     //             data.ptotalcreditamount = parseFloat(data.ptotalcreditamount);
  //     //             this.credittotalamount= this.credittotalamount + data.ptotalcreditamount;
  //     //             //this.credittotalamount = parseFloat(this.paymentslist.reduce((sum, c) => sum + c.ptotalcreditamount, 0));
  //     //           }
  //     //           if (data.ptotaldebitamount != "") {
  //     //             data.ptotaldebitamount = this._commonService.removeCommasForEntredNumber(data.ptotaldebitamount);
  //     //             data.ptotaldebitamount = parseFloat(data.ptotaldebitamount);
  //     //             //this.debittotalamount = parseFloat(this.paymentslist.reduce((sum, c) => sum + c.ptotaldebitamount, 0));
  //     //             this.debittotalamount= this.debittotalamount + data.ptotaldebitamount;
  //     //           }
  //     //         })
  //     //       console.log("Total Debit amount is:"+this.debittotalamount);
  //     //       console.log("Total credit amount is:"+this.credittotalamount);
  //     //         this.getpartyJournalEntryData();
  //     //         this.clearPaymentDetails1();
  //     //         this.getPaymentListColumnWisetotals();
  //     //         this.disableamounttype('');
  //     //         this.validateDebitCreditAmounts();
  //     //         this.showhidegrid = true;
  //     //       }
  //     //       else {
  //     //         this._commonService.showWarningMessage("Insufficient balance ");
  //     //       }
  //     //     })
  //     //   }
  //     //   else {

  //     //     if (debitamount > 0) {
  //     //       this._commonService.showWarningMessage("Debit Transaction Not Allowed ");

  //     //     }

  //     //     if (creditamount > 0) {
  //     //       this._commonService.showWarningMessage("Credit Transaction Not Allowed ");

  //     //     }

  //     //   }

  //     // })
  //   }
  //   else {
  //     this.showhidegrid = false;
  //   }
  // }
  addPaymentDetails() {
  debugger;
  const control = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

  if (!this.validateaddPaymentDetails()) {
    this.showhidegrid = false;
    return;
  }


  let ledgerId = control.get('pledgerid')?.value;
  let subledgerId = control.get('psubledgerid')?.value;

  if (!control.get('pStateId')?.value) {
    control.get('pStateId')?.setValue(0);
  }
  if (!control.get('pTdsPercentage')?.value) {
    control.get('pTdsPercentage')?.setValue(0);
  }
  if (!control.get('pgstpercentage')?.value) {
    control.get('pgstpercentage')?.setValue(0);
  }

  let debitAmount = control.get('ptotaldebitamount')?.value;
  if (!debitAmount || debitAmount === 0) {
    control.get('ptotaldebitamount')?.setValue('');
  }
  const creditAmount = control.get('ptotalcreditamount')?.value;
  if (!creditAmount || creditAmount === 0) {
    control.get('ptotalcreditamount')?.setValue('');
  }

  
  /*
  this._AccountingTransactionsService.GetSubLedgerRestrictedStatus(subledgerId).subscribe(res => {
    debugger;
    const creditStatus = res[0].credit_restriction_status;
    const debitStatus = res[0].debit_restriction_status;

    if ((debitAmount > 0 && !debitStatus) || (creditAmount > 0 && !creditStatus)) {
      this._SubscriberJVService.GetdebitchitCheckbalance(ledgerId, "", subledgerId).subscribe(result => {
        debugger;
        this.debittotalamount = 0;
        this.credittotalamount = 0;

        // You might want to define and fetch 'amount' properly here
        if (amount <= parseFloat(result['balanceamount'].toString()) && 
            (Boolean(result['balancecheckstatus'].toString()) || (result['balancecheckstatus'].toString() === 'false'))) {
          // Add current payment control value to payments list
          const data = control.value;
          this.paymentslist = [...this.paymentslist, data];

          // Calculate totals
          this.paymentslist.forEach(item => {
            if (item.ptotalcreditamount) {
              let credit = this._commonService.removeCommasForEntredNumber(item.ptotalcreditamount);
              credit = parseFloat(credit);
              this.credittotalamount += credit;
            }
            if (item.ptotaldebitamount) {
              let debit = this._commonService.removeCommasForEntredNumber(item.ptotaldebitamount);
              debit = parseFloat(debit);
              this.debittotalamount += debit;
            }
          });

          console.log("Total Debit amount is:" + this.debittotalamount);
          console.log("Total Credit amount is:" + this.credittotalamount);

          this.getpartyJournalEntryData();
          this.clearPaymentDetails1();
          this.getPaymentListColumnWisetotals();
          this.disableamounttype('');
          this.validateDebitCreditAmounts();
          this.showhidegrid = true;
        } else {
          this._commonService.showWarningMessage("Insufficient balance ");
        }
      });
    } else {
      if (debitAmount > 0) {
        this._commonService.showWarningMessage("Debit Transaction Not Allowed ");
      }
      if (creditAmount > 0) {
        this._commonService.showWarningMessage("Credit Transaction Not Allowed ");
      }
    }
  });
  */
}

  getPaymentListColumnWisetotals() {
    

    let totaladebitmount = 0;
    this.hidefootertemplate = false;
    let totalacreditmount = 0;
    this.paymentlistcolumnwiselist = {};
    //totaladebitmount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.ptotaldebitamount).replace(/,/g, "")), 0);
    //if (isNaN(totaladebitmount)) { totaladebitmount = ""; }
    //if (totaladebitmount==0) { totaladebitmount = ""; }
    //else { totaladebitmount = (totaladebitmount); }


    //this.paymentlistcolumnwiselist['ptotaldebitamount'] = totaladebitmount;

    //totalacreditmount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.ptotalcreditamount).replace(/,/g, "")), 0);
    //if (isNaN(totalacreditmount)) { totalacreditmount = ""; } if (totalacreditmount == 0) { totalacreditmount = ""; } else { totalacreditmount = (totalacreditmount);}

    //this.paymentlistcolumnwiselist['ptotalcreditamount'] = totalacreditmount;

    this.paymentslist.reduce((acc: any, item: { ptotaldebitamount: string; ptotalcreditamount: string; }) => {
      totaladebitmount += isNullOrEmptyString(item.ptotaldebitamount) ? parseFloat('0') : parseFloat(item.ptotaldebitamount.replace(/,/g, ""));
      totalacreditmount += isNullOrEmptyString(item.ptotalcreditamount) ? parseFloat('0') : parseFloat(item.ptotalcreditamount.replace(/,/g, ""));
    }, 0);
    if (totaladebitmount != 0) {
      totaladebitmount = (totaladebitmount);
    }
    if (totalacreditmount != 0) {
      totalacreditmount = (totalacreditmount);
    }
    this.paymentlistcolumnwiselist['ptotaldebitamount'] = totaladebitmount.toFixed(2);
    this.paymentlistcolumnwiselist['ptotalcreditamount'] = totalacreditmount.toFixed(2);


    let totalamount = this.paymentslist.reduce((sum: any, c: { pamount: any; }) => sum + (c.pamount), 0);
    this.paymentlistcolumnwiselist['pamount'] = (totalamount);


    // totalamount = this.paymentslist.reduce((sum, c) => sum + (this._commonService.removeCommasInAmount(c.pgstamount)), 0);
    totalamount = this.paymentslist.reduce((sum: any, c: { pgstamount: any; }) => sum + (c.pgstamount), 0);
    this.paymentlistcolumnwiselist['pgstamount'] = (totalamount);

    totalamount = this.paymentslist.reduce((sum: any, c: { ptdsamount: any; }) => sum + (c.ptdsamount), 0);
    // totalamount = this.paymentslist.reduce((sum, c) => sum + (this._commonService.removeCommasInAmount(c.ptdsamount)), 0);
    this.paymentlistcolumnwiselist['ptdsamount'] = (totalamount);
  }
  // clearPaymentDetails() {

  //   const formControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols'];
  //   formControl.reset();
  //   this.showsubledger = true;
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pistdsapplicable'].setValue(false);
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pisgstapplicable'].setValue(false);


  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pledgerid'].setValue(null);
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgerid'].setValue(null);
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyid'].setValue(null);
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pStateId'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstpercentage'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsSection'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsPercentage'].setValue('');
  //   this.setBalances('LEDGER', 0);
  //   this.setBalances('SUBLEDGER', 0);
  //   this.setBalances('PARTY', 0);
  //   this.isgstapplicableChange();
  //   this.istdsapplicableChange();
  //   this.formValidationMessages = {};
  //   let date = new Date();
  //   //this.paymentVoucherForm['controls']['pjvdate'].setValue(date);
  //   this.formValidationMessages = {};

  // }

  clearPaymentDetails() {
  const formControl = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

  formControl.reset();

  this.showsubledger = true;

  formControl.get('pistdsapplicable')?.setValue(false);
  formControl.get('pisgstapplicable')?.setValue(false);

  formControl.get('pledgerid')?.setValue(null);
  formControl.get('psubledgerid')?.setValue(null);
  formControl.get('ppartyid')?.setValue(null);
  formControl.get('pStateId')?.setValue('');
  formControl.get('pgstpercentage')?.setValue('');
  formControl.get('pTdsSection')?.setValue('');
  formControl.get('pTdsPercentage')?.setValue('');

  this.setBalances('LEDGER', 0);
  this.setBalances('SUBLEDGER', 0);
  this.setBalances('PARTY', 0);

  this.isgstapplicableChange();
  this.istdsapplicableChange();

  this.formValidationMessages = {};

  
}


  // clearPaymentDetails1() {

  //   let formControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols'];
  //   //formControl.reset();
  //   this.showsubledger = true;
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pistdsapplicable'].setValue(false);
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pisgstapplicable'].setValue(false);


  //   //this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pledgerid'].setValue(null);
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgerid'].setValue(null);
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyid'].setValue(null);
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pStateId'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstpercentage'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsSection'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsPercentage'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pdebitamount'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcreditamount'].setValue('');

  //   //this.setBalances('LEDGER', 0);
  //   this.setBalances('SUBLEDGER', 0);
  //   this.setBalances('PARTY', 0);
  //   this.isgstapplicableChange();
  //   this.istdsapplicableChange();
  //   this.formValidationMessages = {};
  //   let date = new Date();
  //   //this.paymentVoucherForm['controls']['pjvdate'].setValue(date);
  //   this.formValidationMessages = {};

  // }
clearPaymentDetails1() {
  const formControl = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

  this.showsubledger = true;

  formControl.get('pistdsapplicable')?.setValue(false);
  formControl.get('pisgstapplicable')?.setValue(false);

  // Leave pledgerid intact (commented out in original)
  // formControl.get('pledgerid')?.setValue(null);

  formControl.get('psubledgerid')?.setValue(null);
  formControl.get('ppartyid')?.setValue(null);
  formControl.get('pStateId')?.setValue('');
  formControl.get('pgstpercentage')?.setValue('');
  formControl.get('pTdsSection')?.setValue('');
  formControl.get('pTdsPercentage')?.setValue('');
  formControl.get('pdebitamount')?.setValue('');
  formControl.get('pcreditamount')?.setValue('');

  // this.setBalances('LEDGER', 0); // commented out intentionally
  this.setBalances('SUBLEDGER', 0);
  this.setBalances('PARTY', 0);

  this.isgstapplicableChange();
  this.istdsapplicableChange();

  this.formValidationMessages = {};


  // const date = new Date();
  // this.paymentVoucherForm.get('pjvdate')?.setValue(date);
}


  validatesaveJournalVoucher(): boolean {

    let isValid: boolean = true;
    try {
      isValid = this.checkValidations(this.paymentVoucherForm, isValid);
      if (this.paymentslist.length == 0) {
        //this.showErrorMessage('Loan type, loan name and charge name already exists in grid');
        isValid = false;
      }
    } catch (e) {
      // this._commonService.showErrorMessage(e);
    }


    return isValid;
  }
  clearPaymentVoucher() {
    debugger
    try {
      this.paymentslist = [];
      this.paymentVoucherForm.reset();
      this.showhidegrid = false;
      this.clearPaymentDetails();



      let date = new Date();
      this.paymentVoucherForm['controls']['pjvdate'].setValue(date);
      // this.paymentVoucherForm['controls']['schemaname'].setValue(this._commonService.getschemaname());
      this.paymentVoucherForm['controls']['schemaname'].setValue('');
      this.formValidationMessages = {};
      this.paymentlistcolumnwiselist = undefined;
      this.cashBalance = '0';
      this.bankBalance = '0';
      this.bankbookBalance = '0';
      this.bankpassbookBalance = '0';
      this.ledgerBalance = this.currencySymbol + ' 0.00' + ' Dr';;
      this.subledgerBalance = this.currencySymbol + ' 0.00' + ' Dr';;
      this.partyBalance = this.currencySymbol + ' 0.00' + ' Dr';;
      this.partyjournalentrylist = [];
    } catch (e) {
      // this._commonService.showErrorMessage(e);
    }
  }
  saveJournalVoucher() {
    debugger;

    if (this.validatesaveJournalVoucher()) {
      if (confirm('Do Your Want to Save ?')) {

        this.disablesavebutton = true;
        this.savebutton = 'Processing';
        let bankid = this.paymentVoucherForm.controls['pbankid'].value;
        if (bankid == "" || bankid == null)
          this.paymentVoucherForm['controls']['pbankid'].setValue(0);
        this.paymentVoucherForm['controls']['ptotalpaidamount'].setValue(0);
        // this.paymentVoucherForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
        this.paymentVoucherForm['controls']['pCreatedby'].setValue('');
        this.paymentVoucherForm.controls['pipaddress'].setValue('')
        // this.paymentVoucherForm.controls.pipaddress.setValue(this._commonService.getipaddress())
        // this.paymentVoucherForm.controls.pipaddress.setValue(this._commonService.getipaddress())
        this.paymentVoucherForm.controls['schemaname'].setValue('')
        // this.paymentVoucherForm.controls.schemaname.setValue(this._commonService.getschemaname())
        // let totaladebitmount = 0;
        // let totalacreditmount = 0;


        // commented on 05-03-2025 by Uday for vijayanagar issue start
        //this.paymentslist.reduce((acc, item) => {
          //totaladebitmount += isNullOrEmptyString(item.ptotaldebitamount) ? parseFloat('0') : parseFloat(item.ptotaldebitamount.replace(/,/g, ""));
          //totalacreditmount += isNullOrEmptyString(item.ptotalcreditamount) ? parseFloat('0') : parseFloat(item.ptotalcreditamount.replace(/,/g, ""));
          //totaladebitmount += isNullOrEmptyString(item.ptotaldebitamount) ? parseFloat('0') : parseFloat(this._commonService.removeCommasInAmount(item.ptotaldebitamount).toString());
          //totalacreditmount += isNullOrEmptyString(item.ptotalcreditamount) ? parseFloat('0') : parseFloat(this._commonService.removeCommasInAmount(item.ptotalcreditamount).toString());
         
        //}, 0);
        // commented on 05-03-2025 by Uday for vijayanagar issue end
        // added on 05-03-2025 by Uday for vijayanagar issue start
        let totaladebitmount = Number(parseFloat(this.paymentslist.reduce((sum: number,item: { ptotaldebitamount: any; })=> sum + Number(item.ptotaldebitamount),0)).toFixed(2));
        let totalacreditmount = Number(parseFloat(this.paymentslist.reduce((sum: number,item: { ptotalcreditamount: any; })=> sum + Number(item.ptotalcreditamount),0)).toFixed(2));
        // added on 05-03-2025 by Uday for vijayanagar issue end


        //let debittotalamount = this.paymentslist.reduce((sum, c) => (isNullOrEmptyString(sum) ? 0 : isNaN(sum) ? 0 : sum) + parseFloat((c.ptotaldebitamount).replace(/,/g, "")), 0)
        //let credittotalamount = this.paymentslist.reduce((sum, c) => (isNullOrEmptyString(sum) ? 0 : isNaN(sum) ? 0 : sum) + parseFloat((c.ptotalcreditamount).replace(/,/g, "")), 0)
        if (totaladebitmount != totalacreditmount) {
          // this._commonService.showWarningMessage("Total Debit amount and Credit amount mismatch.");
          this.disablesavebutton = false;
          this.savebutton = 'Save';
        }
        else {
          let newdata = { pJournalVoucherlist: this.paymentslist };
          let paymentVoucherdata = Object.assign(this.paymentVoucherForm.value, newdata);
          // paymentVoucherdata.pjvdate = this._commonService.getFormatDateNormal(paymentVoucherdata.pjvdate);
          paymentVoucherdata.pjvdate = paymentVoucherdata.pjvdate;
          let data = JSON.stringify(paymentVoucherdata);
          console.log(data);
          // this._AccountingTransactionsService.saveJournalVoucher(data).subscribe((res: string[]) => {

          //   //if (res) {
          //   //  this._commonService.showInfoMessage("Saved sucessfully");
          //   // // this.clearPaymentVoucher();
          //   //  this._routes.navigate(['/JournalvoucherView'])
          //   //}
          //   if (res[0] == 'TRUE') {
          //     //this.JSONdataItem = res;
          //     this.disablesavebutton = false;
          //     this.savebutton = 'Save';
          //     this._commonService.showInfoMessage("Saved sucessfully");
          //     this.clearPaymentVoucher();
          //     // this._routes.navigate(['/JournalvoucherView']);
          //     //this._routes.navigate(['/Transactions/JournalVoucherView']);
          //     //this.router.navigate(['/Transactions/JournalVoucherView']);
          //     debugger;
          //     //window.open('/#/Reports/JournalVoucherReport?id=' + btoa(res[1] + ',' + 'Journal Voucher'));
          //     let receipt = btoa(res[1] + ',' + 'Journal Voucher');
          //     // this.router.navigate(['/Reports/JournalVoucherReport', receipt]);
          //     window.open('/#/JournalVoucherReport?id=' + receipt + '', "_blank");
          //   }

          // },
          //   (error: any) => {
          //     //this.isLoading = false;
          //     this._commonService.showErrorMessage(error);
          //     this.disablesavebutton = false;
          //     this.savebutton = 'Save';
          //   });
        }
      }
    }

  }
  getpartyJournalEntryData() {

    let dataobject = { accountname: '', debitamount: '', creditamount: '' }
    this.partyjournalentrylist = [];
    //this.partyjournalentrylist.push(dataobject);
    if (this.paymentVoucherForm.controls['pmodofpayment'].value == "CASH") {
      dataobject = { accountname: 'To MAIN CASH', debitamount: '', creditamount: '1000' }
    }
    else {
      dataobject = { accountname: 'To BANK', debitamount: '', creditamount: '20000' }
    }
    this.partyjournalentrylist.push(dataobject);
  }
  // disableamounttype(Amounttype: string) {


  //   let debitamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pdebitamount').value;
  //   let creditamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pcreditamount').value;

  //   if (!isNullOrEmptyString(debitamount)) {

  //     this.amounttype = Amounttype;
  //     this.readonlydebit = false;
  //     this.readonlycredit = true;
  //     let creditamountControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcreditamount'];
  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptranstype'].setValue('Debit');
  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pamount'].setValue(debitamount);
  //     creditamountControl.clearValidators();
  //     creditamountControl.updateValueAndValidity();
  //     this.formValidationMessages['pcreditamount'] = '';
  //     //this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcreditamount'].clearValidators();
  //     //this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcreditamount'].updateValueAndValidity();

  //   }
  //   else if (!isNullOrEmptyString(creditamount)) {
  //     this.amounttype = Amounttype;
  //     this.readonlydebit = true;
  //     this.readonlycredit = false;
  //     let debitamountControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pdebitamount'];
  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptranstype'].setValue('Credit');
  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pamount'].setValue(creditamount);
  //     debitamountControl.clearValidators();
  //     debitamountControl.updateValueAndValidity();
  //     this.formValidationMessages['pdebitamount'] = '';
  //     //this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pdebitamount'].clearValidators();
  //     //this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pdebitamount'].updateValueAndValidity();

  //   }
  //   else {
  //     //setValidators(Validators.required);
  //     this.readonlydebit = false;
  //     this.readonlycredit = false;
  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptranstype'].setValue('');
  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pamount'].setValue('');
  //     <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pdebitamount'].setValidators(Validators.required);
  //     <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcreditamount'].setValidators(Validators.required);

  //   }
  //   this.validateDebitCreditAmounts();
  // }
  disableamounttype(Amounttype: string) {
  const paymentControls = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

  const debitamount = paymentControls.get('pdebitamount')?.value;
  const creditamount = paymentControls.get('pcreditamount')?.value;

  const debitControl = paymentControls.get('pdebitamount');
  const creditControl = paymentControls.get('pcreditamount');
  const transtypeControl = paymentControls.get('ptranstype');
  const amountControl = paymentControls.get('pamount');

  if (!isNullOrEmptyString(debitamount)) {
    this.amounttype = Amounttype;
    this.readonlydebit = false;
    this.readonlycredit = true;

    transtypeControl?.setValue('Debit');
    amountControl?.setValue(debitamount);

    creditControl?.clearValidators();
    creditControl?.updateValueAndValidity();
    this.formValidationMessages['pcreditamount'] = '';

  } else if (!isNullOrEmptyString(creditamount)) {
    this.amounttype = Amounttype;
    this.readonlydebit = true;
    this.readonlycredit = false;

    transtypeControl?.setValue('Credit');
    amountControl?.setValue(creditamount);

    debitControl?.clearValidators();
    debitControl?.updateValueAndValidity();
    this.formValidationMessages['pdebitamount'] = '';

  } else {
    // Both amounts empty: enable both inputs and set validators
    this.readonlydebit = false;
    this.readonlycredit = false;

    transtypeControl?.setValue('');
    amountControl?.setValue('');

    debitControl?.setValidators(Validators.required);
    debitControl?.updateValueAndValidity();

    creditControl?.setValidators(Validators.required);
    creditControl?.updateValueAndValidity();
  }

  this.validateDebitCreditAmounts();
}

  // validateDebitCreditAmounts() {

  //   let isValid: boolean = true;
  //   let debitamountcount = 0;
  //   let creditamountcount = 0;
  //   let griddata = this.paymentslist;
  //   try {
  //     for (let i = 0; i < griddata.length; i++) {
  //       if (!isNullOrEmptyString(griddata[i].pdebitamount)) {
  //         debitamountcount = debitamountcount + 1;
  //       }
  //       if (!isNullOrEmptyString(griddata[i].pcreditamount)) {
  //         creditamountcount = creditamountcount + 1;
  //       }
  //     }
  //     if (debitamountcount > 1 && creditamountcount == 1) {
  //       this.readonlydebit = false;
  //       this.readonlycredit = true;
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcreditamount'].clearValidators();
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcreditamount'].updateValueAndValidity();


  //     }
  //     else if (creditamountcount > 1 && debitamountcount == 1) {
  //       this.readonlydebit = true;
  //       this.readonlycredit = false;
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pdebitamount'].clearValidators();
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pdebitamount'].updateValueAndValidity();

  //     }

  //   } catch (e) {
  //     this._commonService.showErrorMessage(e);
  //   }

  // }
  validateDebitCreditAmounts(): void {

  let debitamountcount = 0;
  let creditamountcount = 0;
  const griddata = this.paymentslist;

  try {
    // Count how many debit and credit entries are non‑empty
    griddata.forEach((item: { pdebitamount: any; pcreditamount: any; }) => {
      if (!isNullOrEmptyString(item.pdebitamount)) {
        debitamountcount++;
      }
      if (!isNullOrEmptyString(item.pcreditamount)) {
        creditamountcount++;
      }
    });

    const paymentControls = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
    const debitControl = paymentControls.get('pdebitamount');
    const creditControl = paymentControls.get('pcreditamount');

    if (debitamountcount > 1 && creditamountcount === 1) {
      this.readonlydebit = false;
      this.readonlycredit = true;

      // Clear validators on credit field
      creditControl?.clearValidators();
      creditControl?.updateValueAndValidity();

    } else if (creditamountcount > 1 && debitamountcount === 1) {
      this.readonlydebit = true;
      this.readonlycredit = false;

      // Clear validators on debit field
      debitControl?.clearValidators();
      debitControl?.updateValueAndValidity();
    }

  } catch (e) {
    console.error(e); // Log error instead of failing silently
  }
}

  public removeHandler(row: any, rowIndex: number) {
    debugger;
    this.credittotalamount = 0;
    this.debittotalamount = 0;
    //const index: number = this.paymentslist.indexOf(dataItem);
    const index: number = rowIndex;
    if (index !== -1) {
      this.paymentslist.splice(index, 1);
      this.paymentslist = [...this.paymentslist];
      this.paymentslist.filter((data: { ptotalcreditamount: string | number; ptotaldebitamount: string | number; }) => {
        if (data.ptotalcreditamount != "") {
          // data.ptotalcreditamount = this._commonService.removeCommasForEntredNumber(data.ptotalcreditamount);
          // data.ptotalcreditamount = parseFloat(data.ptotalcreditamount);
          data.ptotalcreditamount = data.ptotalcreditamount;
          data.ptotalcreditamount = data.ptotalcreditamount;
          this.credittotalamount = this.credittotalamount + data.ptotalcreditamount;
          //this.credittotalamount = parseFloat(this.paymentslist.reduce((sub, c) => sub + c.ptotalcreditamount, 0));
        }
        if (data.ptotaldebitamount != "") {
          // data.ptotaldebitamount = this._commonService.removeCommasForEntredNumber(data.ptotaldebitamount);
          // data.ptotaldebitamount = parseFloat(data.ptotaldebitamount);
                    data.ptotaldebitamount = data.ptotaldebitamount;
          data.ptotaldebitamount = data.ptotaldebitamount
          //this.debittotalamount = parseFloat(this.paymentslist.reduce((sub, c) => sub + c.ptotaldebitamount, 0));
          this.debittotalamount= this.debittotalamount + data.ptotaldebitamount;
        }
      })
    }
    if (this.paymentslist.length == 0) {
      this.showhidegrid = false;
    }
    else {
      this.showhidegrid = true;
    }
    this.disableamounttype('');
    this.getPaymentListColumnWisetotals();

  }
  // uploadAndProgress(event: any, files: string | any[]) {
  //   var extention = event.target.value.substring(event.target.value.lastIndexOf('.') + 1);
  //   if (!this.validateFile(event.target.value)) {
  //     // this._commonService.showWarningMessage("Upload jpg or png or jpeg files");
  //   }
  //   else {
  //     let file = event.target.files[0];
  //     this.imageResponse;
  //     if (event && file) {
  //       let reader = new FileReader();
  //       reader.readAsDataURL(file);
  //       reader.onload = e => {
  //         this.imageResponse = {
  //           name: file.name,
  //           fileType: "imageResponse",
  //           contentType: file.type,
  //           size: file.size,

  //         };
  //       };
  //     }
  //     let fname = "";
  //     if (files.length === 0) {
  //       return;
  //     }
  //     var size = 0;
  //     const formData = new FormData();
  //     for (var i = 0; i < files.length; i++) {
  //       size += files[i].size;
  //       fname = files[i].name
  //       formData.append(files[i].name, files[i]);
  //       formData.append('NewFileName', 'Journal Voucher' + '.' + files[i]["name"].split('.').pop());
  //     }
  //     // size = size / 1024;
  //     size = size / 1024
  //     // this._commonService.fileUploadS3("Account",formData).subscribe((data: any[]) => {
  //     //   if (extention.toLowerCase() == 'pdf') {
  //     //     this.imageResponse.name = data[0];
  //     //     this.kycFileName = data[0];
  //     //     // this.kycFilePath = data[0];
  //     //   }
  //     //   else {
  //     //     this.kycFileName = data[0];
  //     //     this.imageResponse.name = data[0];
  //     //     let kycFilePath = data[0];
  //     //     let Filepath = this.kycFileName.split(".");
  //     //   }
  //     //   this.paymentVoucherForm.controls.pFilename.setValue(this.kycFileName);
  //     //   // this.paymentVoucherForm.controls.pFileformat.setValue(kycFilePath);
  //     //   // this.paymentVoucherForm.controls.pFilepath.setValue(Filepath[1]);
  //     // })
  //   }
  // }

uploadAndProgress(event: any) {
  const files: FileList | null = event.target.files;
  if (!files || files.length === 0) return;

  const file = files[0];
  const extension = file.name.split('.').pop()?.toLowerCase();

  // if (!this.validateFile(file.name)) {
  //   // optional warning
  //   return;
  // }

  // Build imageResponse directly
  const reader = new FileReader();
  reader.onload = () => {
    this.imageResponse = {
      name: file.name,
      fileType: 'imageResponse',
      contentType: file.type,
      size: file.size
    };
  };
  reader.readAsDataURL(file);

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    formData.append(f.name, f);
    formData.append(
      'NewFileName',
      `Journal Voucher.${f.name.split('.').pop()}`
    );
  }

  // TODO: Upload code
  // this._commonService.fileUploadS3('Account', formData).subscribe(...)
}

  /*
  *Validating the type of file uploaded
  */
  validateFile(fileName: string | undefined):void {
    try {
      debugger
      if (fileName == undefined || fileName == "") {
        //return true
      }
      else {
        var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
        if (ext.toLowerCase() == 'jpg' || ext.toLowerCase() == 'png' || ext.toLowerCase() == 'jpeg') {

         // return true
        }
      }
    //  return false
    }
    catch (e) {
      this.showErrorMessage('');
    }
  }
  showErrorMessage(errormsg: string) {
    // this._commonService.showErrorMessage(errormsg);
  }

}
// function isNullOrEmptyString(paidAmountStr: any) {
//   throw new Error('Function not implemented.');
// }
function isNullOrEmptyString(value: any): boolean {
  return value === null || value === undefined || value === '';
}
