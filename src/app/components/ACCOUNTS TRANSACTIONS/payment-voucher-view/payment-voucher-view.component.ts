import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { CommonService } from '../../../services/common.service';
import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';
import { SubscriberjvService } from '../../../services/Transactions/subscriber/subscriberjv.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-payment-voucher-view',
  templateUrl: './payment-voucher-view.component.html',
  imports: [CommonModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    BsDatepickerModule,
    CurrencyPipe,
    NgSelectModule,
    TableModule
  ],

  styleUrls: ['./payment-voucher-view.component.css'],
  providers: [DecimalPipe, CurrencyPipe]
})
export class PaymentVoucherViewComponent implements OnInit {
  currencyCode = 'INR';

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
  imageResponse: any;
  showgstamount = false;
  showigst = false;
  showcgst = false;
  showsgst = false;
  showutgst = false;
  showgstno = false;
  showsubledger = true;
  formValidationMessages: any;
  paymentlistcolumnwiselist: any;
  displayCardName = 'Debit Card';
  displaychequeno = 'Cheque No';

  banklist: any;
  modeoftransactionslist: any[] = [];
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
  chequenumberslist: any[] = [];
  upinameslist: any;
  upiidlist: any;
  paymentslist: any;
  paymentslist1: any;
  gridView1: any;
  cashBalance: any;

  bankBalance: any; cashRestrictAmount: any;
  bankexists!: boolean;
  groups: any[] = [];
  bankbookBalance: any;
  bankbarnchdummy: any;
  ;
  bankpassbookBalance: any;;
  ledgerBalance: any;;
  subledgerBalance: any;;
  partyBalance: any;;
  partyjournalentrylist: any;
  currencySymbol: any;

  disablegst!: boolean;
  disabletds = false;
  disableaddbutton = false;
  addbutton = "Add";
  disablesavebutton = false;
  savebutton = "Save";
  kycFileName: any;

  JSONdataItem: any = [];
  availableAmount: any
gstnopattern = "^(0[1-9]|[1-2][0-9]|3[0-9])([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}([a-zA-Z0-9]){1}([a-zA-Z]){1}([a-zA-Z0-9]){1}?";
  public selectableSettings!: SelectableSettings;
  public ppaymentdateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  disabletransactiondate = false;
  constructor(private _FormBuilder: FormBuilder, private datepipe: DatePipe,
    private zone: NgZone, private _commonService: CommonService, private router: Router,
    private _AccountingTransactionsService: AccountingTransactionsService,
    private _SubscriberJVService: SubscriberjvService) {




    this.ppaymentdateConfig.maxDate = new Date();
    this.ppaymentdateConfig.containerClass = 'theme-dark-blue';
    this.ppaymentdateConfig.dateInputFormat = 'DD-MMM-YYYY';
    this.ppaymentdateConfig.showWeekNumbers = false;
}
  paymentVoucherForm!: FormGroup;
   ngOnInit(): void {

    this.currencySymbol = this._commonService.currencysymbol;
    if (this._commonService.comapnydetails != null)
      this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;
    this.disablegst = true;
    this.paymentlistcolumnwiselist = {};
    this.paymentslist = [];
    this.paymentslist1 = [];
    this.gridView1 = [];
    this.formValidationMessages = {};
    this.paymentVoucherForm = this._FormBuilder.group({
      ppaymentid: [''],
      schemaname: [this._commonService.getschemaname()],
      ppaymentdate: ['', Validators.required],
      ptotalpaidamount: [''],
      pnarration: ['', Validators.required],
      pmodofpayment: ['CASH'],
      pbankname: [''],
      pbranchname: [''],
      ptranstype: ['CHEQUE', Validators.required],
      pCardNumber: [''],
      pUpiname: [''],
      pUpiid: [''],

      ptypeofpayment: [''],
      pChequenumber: [''],
      pchequedate: [''],
      pbankid: [''],
      pCreatedby: [this._commonService.getCreatedBy()],
      pStatusname: [this._commonService.pStatusname],
      ptypeofoperation: [this._commonService.ptypeofoperation],
      pipaddress: [this._commonService.getIpAddress()],

      ppaymentsslistcontrols: this.addppaymentsslistcontrols(),
      pDocStorePath: ['']
    })
    this.modeofPaymentChange();

    this.isgstapplicableChange();
    this.istdsapplicableChange();
    let date = new Date();
    this.paymentVoucherForm['controls']['ppaymentdate'].setValue(date);

    this.getLoadData();
    // this.getledgerdata();
    this.BlurEventAllControll(this.paymentVoucherForm);

  }
  addppaymentsslistcontrols(): FormGroup {
    return this._FormBuilder.group({

      psubledgerid: [null],
      psubledgername: [''],
      pledgerid: [null],

      pledgername: ['', Validators.required],
      pamount: [''],
      pactualpaidamount: ['', Validators.required],
      pgsttype: [''],
      pisgstapplicable: [false, Validators.required],
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
      pistdsapplicable: [false, Validators.required],
      pgstno: new FormControl('', Validators.pattern(this.gstnopattern)),
      pTdsSection: [''],
      pTdsPercentage: [''],
      ptdsamount: [''],
      ptdscalculationtype: [''],
      ppannumber: [''],
      pState: [''],
      pStateId: [''],

      pigstpercentage: [''],
      pcgstpercentage: [''],
      psgstpercentage: [''],
      putgstpercentage: [''],
      ptypeofoperation: [this._commonService.ptypeofoperation],
      ptotalamount: [''],
    })
  }
  public groupChange(groups: any[]
    ): void {
    this.groups = groups;
    this.loadgrid();
  }
  private loadgrid(): void {

  }
  BlurEventAllControll(fromgroup: FormGroup): any {

    try {

      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })

    }
    catch (e) {
      this._commonService.showErrorMessage(e);
      return false;
    }
  }
  setBlurEvent(fromgroup: FormGroup, key: string): any {

    try {
      let formcontrol;

      formcontrol = fromgroup.get(key);


      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.BlurEventAllControll(formcontrol)
        }
        else {
          if (formcontrol.validator) {
            fromgroup.get(key)?.valueChanges.subscribe(() => {
              this.GetValidationByControl(fromgroup, key, true);
            });
          }
        }

      }
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
      return false;
    }
  }
  checkValidations(group: FormGroup, isValid: boolean): boolean {

    try {

      Object.keys(group.controls).forEach((key: string) => {

        isValid = this.GetValidationByControl(group, key, isValid);
        //console.log(key+":"+isValid);
      })

    }
    catch (e) {
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

            let errormessage;

            for (const errorkey in formcontrol.errors) {
              lablename = (document.getElementById(key) as HTMLInputElement).title;

              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.formValidationMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }

          }
        }
      }
    }
    catch (e) {
      return false;
    }
    return isValid;
  }
  setBalances(balancetype: any, balanceamount: any) {

    let balancedetails;
    if (parseFloat(balanceamount) < 0) {
      balancedetails = this._commonService.currencyFormat(Math.abs(balanceamount).toFixed(2)) + ' Cr';
    }
    else if (parseFloat(balanceamount) >= 0) {
      balancedetails = this._commonService.currencyFormat((balanceamount).toFixed(2)) + ' Dr';
    }

    if (balancetype == 'CASH')
      this.cashBalance = balancedetails;
    if (balancetype == 'BANK')
      this.bankBalance = balancedetails;
    if (balancetype == 'BANKBOOK')
      this.bankbookBalance = this.currencySymbol + ' ' + balancedetails;
    if (balancetype == 'PASSBOOK')
      this.bankpassbookBalance = this.currencySymbol + ' ' + balancedetails;
    if (balancetype == 'LEDGER')
      this.ledgerBalance = this.currencySymbol + ' ' + balancedetails;
    if (balancetype == 'SUBLEDGER')
      this.subledgerBalance = this.currencySymbol + ' ' + balancedetails;
    if (balancetype == 'PARTY')
      this.partyBalance = this.currencySymbol + ' ' + balancedetails;
  }
  modeofPaymentChange() {

    if (this.paymentVoucherForm.controls['pmodofpayment'].value == "CASH") {
      this.paymentVoucherForm['controls']['pbankid'].setValue(0);
      //this.paymentVoucherForm['controls']['pChequenumber'].setValue(0);
      this.showModeofPayment = false;
      this.showtranstype = false;

    }
    else if (this.paymentVoucherForm.controls['pmodofpayment'].value == "BANK") {
      this.paymentVoucherForm['controls']['ptranstype'].setValue('CHEQUE');
      this.showModeofPayment = true;
      this.showtranstype = true;
    }
    else {
      this.showModeofPayment = true;
      this.showtranstype = false;
    }
    this.transofPaymentChange();
    this.getpartyJournalEntryData();

  }
  addModeofpaymentValidations() {

    let modeofpaymentControl = <FormGroup>this.paymentVoucherForm['controls']['pmodofpayment'];
    let transtypeControl = <FormGroup>this.paymentVoucherForm['controls']['ptranstype'];
    let bankControl = <FormGroup>this.paymentVoucherForm['controls']['pbankname'];
    let chequeControl = <FormGroup>this.paymentVoucherForm['controls']['pChequenumber'];
    let cardControl = <FormGroup>this.paymentVoucherForm['controls']['pCardNumber'];
    let typeofpaymentControl = <FormGroup>this.paymentVoucherForm['controls']['ptypeofpayment'];
    //let branchnameControl = <FormGroup>this.paymentVoucherForm['controls']['pbranchname'];

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
      //if (this.showbranch) {
      //    branchnameControl.setValidators(Validators.required);
      //}
      //else {
      //    branchnameControl.clearValidators();
      //}
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

      UpinameControl.clearValidators();
      UpiidControl.clearValidators();
      typeofpaymentControl.clearValidators();
    }


    modeofpaymentControl.updateValueAndValidity();
    transtypeControl.updateValueAndValidity();
    cardControl.updateValueAndValidity();
    bankControl.updateValueAndValidity();
    chequeControl.updateValueAndValidity();
    typeofpaymentControl.updateValueAndValidity();
    //branchnameControl.updateValueAndValidity();

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
    this.showupi = false;
    this.displaychequeno = 'Reference No.';
    if (this.paymentVoucherForm.controls['ptranstype'].value == "CHEQUE") {
      this.showbankcard = true;
      this.displaychequeno = 'Cheque No.';
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
    this.cleartranstypeDetails();
  }
  typeofPaymentChange() {
    debugger;
    let UpinameControl = <FormGroup>this.paymentVoucherForm['controls']['pUpiname'];
    let UpiidControl = <FormGroup>this.paymentVoucherForm['controls']['pUpiid'];
    if (this.paymentVoucherForm.controls['ptypeofpayment'].value == 'UPI') {
      this.showupi = true;
      UpinameControl.setValidators(Validators.required);
      UpiidControl.setValidators(Validators.required);
    }
    else {
      this.showupi = false;
      UpinameControl.clearValidators();
      UpiidControl.clearValidators();
    }
    UpinameControl.updateValueAndValidity();
    UpiidControl.updateValueAndValidity();
    this.GetValidationByControl(this.paymentVoucherForm, 'ptypeofpayment', true);
  }
  
  isgstapplicable_Checked(): void {
    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');

    group?.get('pStateId')?.setValue('');
    this.gst_clear();

    const partyName = group?.get('ppartyname')?.value;

    // const existing = this.paymentslist.find(
    //   x => x.ppartyname === partyName
    // );
    const existing = this.paymentslist.find(
      (x: any) => x.ppartyname === partyName
    );


    if (existing) {
      group
        ?.get('pisgstapplicable')
        ?.setValue(existing.pisgstapplicable);
    }

    this.isgstapplicableChange();
  }


  // istdsapplicable_Checked() {
  //   debugger;
  //   let ppartyname = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('ppartyname').value;
  //   let checkexistingcount = 0;

  //   let griddata = this.paymentslist.filter(x => x.ppartyname == ppartyname);
  //   if (griddata != null) {
  //     if (griddata.length > 0) {
  //       checkexistingcount = 1;
  //     }
  //   }
  //   if (checkexistingcount == 1) {
  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pistdsapplicable'].setValue(griddata[0].pistdsapplicable);

  //   }
  //   this.istdsapplicableChange();

  // }


  istdsapplicable_Checked(): void {
    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');

    const partyName = group?.get('ppartyname')?.value;
    if (!partyName) {
      this.istdsapplicableChange();
      return;
    }

    const existing = this.paymentslist.find(
      (x: { ppartyname: string; pistdsapplicable?: boolean }) =>
        x.ppartyname === partyName
    );

    if (existing) {
      group
        ?.get('pistdsapplicable')
        ?.setValue(existing.pistdsapplicable);
    }

    this.istdsapplicableChange();
  }

  // isgstapplicableChange() {


  //   let data = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pisgstapplicable').value;

  //   let gstCalculationControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstcalculationtype'];
  //   let gstpercentageControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstpercentage'];
  //   let stateControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pState'];
  //   let gstamountControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstamount'];

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


  //     this.showgst = false;
  //     if (this.disablegst == false)
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstcalculationtype'].setValue('');
  //   }
  //   gstCalculationControl.updateValueAndValidity();
  //   gstpercentageControl.updateValueAndValidity();
  //   stateControl.updateValueAndValidity();
  //   gstamountControl.updateValueAndValidity();

  //   this.claculategsttdsamounts();

  // }



  isgstapplicableChange(): void {

    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');

    const data = group?.get('pisgstapplicable')?.value;

    const gstCalculationControl = group?.get('pgstcalculationtype');
    const gstpercentageControl = group?.get('pgstpercentage');
    const stateControl = group?.get('pState');
    const gstamountControl = group?.get('pgstamount');

    if (data) {
      this.showgst = true;

      if (!this.disablegst) {
        gstCalculationControl?.setValue('INCLUDE');
      }

      gstCalculationControl?.setValidators(Validators.required);
      gstpercentageControl?.setValidators(Validators.required);
      stateControl?.setValidators(Validators.required);
      gstamountControl?.setValidators(Validators.required);
    } else {
      this.showgst = false;

      if (!this.disablegst) {
        gstCalculationControl?.setValue('');
      }

      gstCalculationControl?.clearValidators();
      gstpercentageControl?.clearValidators();
      stateControl?.clearValidators();
      gstamountControl?.clearValidators();
    }

    gstCalculationControl?.updateValueAndValidity();
    gstpercentageControl?.updateValueAndValidity();
    stateControl?.updateValueAndValidity();
    gstamountControl?.updateValueAndValidity();

    this.claculategsttdsamounts();
  }

  // istdsapplicableChange() {
  //   debugger;
  //   let data = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pistdsapplicable').value;

  //   let tdsCalculationControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptdscalculationtype'];
  //   let tdspercentageControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsPercentage'];
  //   let sectionControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsSection'];
  //   let tdsamountControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptdsamount'];

  //   if (data) {
  //     this.showtds = true;
  //     if (this.disabletds == false)
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptdscalculationtype'].setValue('EXCLUDE');
  //     // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptdscalculationtype'].setValue('INCLUDE');
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
  istdsapplicableChange(): void {

    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');

    const data = group?.get('pistdsapplicable')?.value;

    const tdsCalculationControl = group?.get('ptdscalculationtype');
    const tdspercentageControl = group?.get('pTdsPercentage');
    const sectionControl = group?.get('pTdsSection');
    const tdsamountControl = group?.get('ptdsamount');

    if (data) {
      this.showtds = true;

      if (!this.disabletds) {
        tdsCalculationControl?.setValue('EXCLUDE');
      }

      tdsCalculationControl?.setValidators(Validators.required);
      tdspercentageControl?.setValidators(Validators.required);
      sectionControl?.setValidators(Validators.required);
      tdsamountControl?.setValidators(Validators.required);
    } else {
      this.showtds = false;

      if (!this.disabletds) {
        tdsCalculationControl?.setValue('');
      }

      tdsCalculationControl?.clearValidators();
      tdspercentageControl?.clearValidators();
      sectionControl?.clearValidators();
      tdsamountControl?.clearValidators();
    }

    tdsCalculationControl?.updateValueAndValidity();
    tdspercentageControl?.updateValueAndValidity();
    sectionControl?.updateValueAndValidity();
    tdsamountControl?.updateValueAndValidity();

    this.claculategsttdsamounts();
  }







  

  // getledgerdata(){
  //   this.getLoadData()
  // }

  getLoadData() {



    debugger;
    
    // this._AccountingTransactionsService.GetBankNames(

    //   this._commonService.getschemaname(),
    //   this._commonService.getbranchname(),
    //   this._commonService.getCompanyCode(),
    //   this._commonService.getBranchCode()

    // ).subscribe({
    //   next: (res: any) => {
        
    //     this.banklist = res;
        

    //     this.typeofpaymentlist = this.gettypeofpaymentdata();
    //     console.log('SUCCESS:', res);
    //     alert('hello');
    //   },
    //   error: (err: any) => {
    //     console.log('ERROR:', err);
    //     alert('API Error');
    //   }
    // });

    //GetReceiptsandPaymentsLoadingData

    this._AccountingTransactionsService.GetReceiptsandPaymentsLoadingData2
    ('PAYMENT VOUCHER',
       this._commonService.getbranchname(),
      this._commonService.getschemaname(),
    this._commonService.getCompanyCode(),
  this._commonService.getBranchCode(),
'taxes')
    .subscribe({
      next:(json:any) => {
                debugger;
                //console.log(json)
                if (json != null) {

                    this.banklist = json.banklist;
                    this.modeoftransactionslist = json.modeofTransactionslist;
                    this.typeofpaymentlist = this.gettypeofpaymentdata();
                    this.ledgeraccountslist = json.accountslist;
                    this.partylist = json.partylist;
                    this.gstlist = json.gstlist;

                    this.debitcardlist = json.bankdebitcardslist;
                    // console.log(this.debitcardlist);
                    this.setBalances('CASH', json.cashbalance);
                    this.setBalances('BANK', json.bankbalance);
                    console.log(json);
                    this.cashRestrictAmount = json.cashRestrictAmount;
                    //this.lstLoanTypes = json
                    //this.titleDetails = json as string
                    //this.titleDetails = eval("(" + this.titleDetails + ')');
                    //this.titleDetails = this.titleDetails.FT;
                }
            },
                error: (error) => {

                    this._commonService.showErrorMessage(error);
                }
                  });
                
              


    // this._AccountingTransactionsService
    //   .GetLedgerData1(
    //     'PAYMENT VOUCHER',
    //     this._commonService.getbranchname(),
    //     this._commonService.getCompanyCode(),
    //     this._commonService.getBranchCode(),
    //     this._commonService.getschemaname()



    //   )
    //   .subscribe({
    //     next: (json: any) => {
    //       debugger;

    //       if (json) {
    //         console.log('Full Response:', json);

    //         this.ledgeraccountslist = json.map((item: any) => item.pledgername)
    //         console.log('ledgeraccountslist :', this.ledgeraccountslist);

           
    //         this.typeofpaymentlist = this.gettypeofpaymentdata();
    //         this.partylist = json.partylist;
    //         this.gstlist = json.gstlist;
    //         this.debitcardlist = json.bankdebitcardslist;

    //         this.setBalances('CASH', json.cashbalance);
    //         this.setBalances('BANK', json.bankbalance);

    //         this.cashRestrictAmount = json.cashRestrictAmount;
    //       }
    //     },
    //     error: (error: any) => {
    //       this._commonService.showErrorMessage(error);
    //     }
    //   });

  
              }


  gettypeofpaymentdata(): any[] {
    return this.modeoftransactionslist.filter(
      (payment: { ptranstype: string; ptypeofpayment: string }) =>
        payment.ptranstype !== payment.ptypeofpayment
    );
  }

  // trackByFn(index: any, item: any) {
  //   return index; // or item.id
  // }
  bankName_Change($event: any): void {
    debugger;
    // const pbankid = $event.target.value;
    const pbankid = $event.bankAccountId;



    this.upinameslist = [];
    this.chequenumberslist = [];
    this.paymentVoucherForm['controls']['pChequenumber'].setValue('');
    this.paymentVoucherForm['controls']['pUpiname'].setValue('');
    this.paymentVoucherForm['controls']['pUpiid'].setValue('');
    if (pbankid && pbankid != '') {
      // const bankname = $event.target.options[$event.target.selectedIndex].text;
      this.GetBankDetailsbyId(pbankid);
      // this.getchaquenumber(pbankid);
      //  this.getBankBranchName(pbankid);
      // this.paymentVoucherForm['controls']['pbankname'].setValue(bankname);

    }
    else {

      this.paymentVoucherForm['controls']['pbankname'].setValue('');
    }

    // this.GetValidationByControl(this.paymentVoucherForm, 'pbankname', true);
    // this.formValidationMessages['pChequenumber'] = '';
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
  // getbankname(cardnumber: any) {
  //   try {
  //     debugger;
  //     let data = this.debitcardlist.filter(function (debit) {
  //       return debit.pCardNumber == cardnumber;
  //     })[0];
  //     this.getBankBranchName(data.pbankid);
  //     return data;
  //   } catch (e) {
  //     this._commonService.showErrorMessage(e);
  //   }
  // }


  getbankname(cardnumber: any) {
    const data = this.debitcardlist.find(
      (debit: { pCardNumber: any; pbankid: any }) =>
        debit.pCardNumber === cardnumber
    );

    if (data) {
      this.getBankBranchName(data.pbankid);
      return data;
    }

    return null;
  }


  ledgerName_Change($event: any): void {

    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');

    const pledgerid = $event?.pledgerid;

    // reset lists
    this.subledgeraccountslist = [];
    this.paymentslist1 = [];
    this.partyjournalentrylist = [];
    this.paymentslist = [];

    // reset form controls
    group?.get('psubledgerid')?.setValue(null);
    group?.get('psubledgername')?.setValue('');
    group?.get('pledgername')?.setValue('');

    // reset balances
    this.ledgerBalance = `${this.currencySymbol} 0.00 Dr`;
    this.subledgerBalance = `${this.currencySymbol} 0.00 Dr`;

    if (pledgerid) {

      const ledgername = $event.pledgername;

      const data = this.ledgeraccountslist.find(
        (ledger: { pledgerid: any; accountbalance: number }) =>
          ledger.pledgerid === pledgerid
      );

      if (data) {
        this.setBalances('LEDGER', data.accountbalance);
      }

      this.GetSubLedgerData(pledgerid);
      group?.get('pledgername')?.setValue(ledgername);

    } else {
      this.setBalances('LEDGER', 0);
    }
  }

  // GetSubLedgerData(pledgerid) {

  //   this._AccountingTransactionsService.GetSubLedgerData(pledgerid).subscribe(json => {

  //     //console.log(json)
  //     if (json != null) {

  //       this.subledgeraccountslist = json;

  //       let subLedgerControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgername'];
  //       if (this.subledgeraccountslist.length > 0) {
  //         this.showsubledger = true;
  //         subLedgerControl.setValidators(Validators.required);
  //       }
  //       else {
  //         subLedgerControl.clearValidators();
  //         this.showsubledger = false;
  //         this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgerid'].setValue(pledgerid);
  //         this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgername'].setValue(this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pledgername').value);
  //         this.formValidationMessages['psubledgername'] = '';
  //       }
  //       subLedgerControl.updateValueAndValidity();
  //       //this.lstLoanTypes = json
  //       //this.titleDetails = json as string
  //       //this.titleDetails = eval("(" + this.titleDetails + ')');
  //       //this.titleDetails = this.titleDetails.FT;
  //     }
  //   },
  //     (error) => {

  //       this._commonService.showErrorMessage(error);
  //     });
  // }
  GetSubLedgerData(pledgerid: any): void {
    debugger

    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');

    this._AccountingTransactionsService
      .GetSubLedgerDataACCOUNTS(pledgerid,
        this._commonService.getbranchname(),
        this._commonService.getCompanyCode(),
        this._commonService.getBranchCode(),
        this._commonService.getschemaname()

      )
      .subscribe(
        {
          next: (json: any) => {

            if (!json) {
              return;
            }

            // this.subledgeraccountslist = json;

            this.subledgeraccountslist = json.map((item: any) => item.psubledgername)
            console.log('subledgeraccountslist :', this.subledgeraccountslist);
            const subLedgerControl = group?.get('psubledgername');

            if (this.subledgeraccountslist.length > 0) {
              this.showsubledger = true;
              subLedgerControl?.setValidators(Validators.required);
            } else {
              this.showsubledger = false;

              subLedgerControl?.clearValidators();

              group?.get('psubledgerid')?.setValue(pledgerid);
              subLedgerControl?.setValue(
                group?.get('pledgername')?.value
              );

              this.formValidationMessages['psubledgername'] = '';
            }

            subLedgerControl?.updateValueAndValidity();
          },
          error: (error: any) => {
            this._commonService.showErrorMessage(error);
          }
        });
  }

  // subledger_Change($event) {
  //   let psubledgerid;
  //   if ($event != undefined) {
  //     psubledgerid = $event.psubledgerid;
  //   }
  //   this.subledgerBalance = '';
  //   if (psubledgerid && psubledgerid != '') {
  //     const subledgername = $event.psubledgername;
  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgername'].setValue(subledgername);
  //     let data = this.subledgeraccountslist.filter(function (ledger) {
  //       return ledger.psubledgerid == psubledgerid;
  //     })[0];
  //     this.setBalances('SUBLEDGER', data.accountbalance);

  //   }
  //   else {

  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgername'].setValue('');
  //     this.setBalances('SUBLEDGER', 0);
  //   }
  //   this.GetValidationByControl(this.paymentVoucherForm, 'psubledgername', true);
  // }

  subledger_Change($event: any): void {

    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');

    const psubledgerid = $event?.psubledgerid;

    this.subledgerBalance = '';

    if (psubledgerid) {

      const subledgername = $event.psubledgername;

      group?.get('psubledgername')?.setValue(subledgername);

      const data = this.subledgeraccountslist.find(
        (ledger: { psubledgerid: any; accountbalance: number }) =>
          ledger.psubledgerid === psubledgerid
      );

      if (data) {
        this.setBalances('SUBLEDGER', data.accountbalance);
      }

    } else {
      group?.get('psubledgername')?.setValue('');
      this.setBalances('SUBLEDGER', 0);
    }

    this.GetValidationByControl(
      this.paymentVoucherForm,
      'psubledgername',
      true
    );
  }

  // upiName_Change($event: any): void {
  //   debugger;
  //   const upiname = $event.target.value;
  //   this.upiidlist = this.upinameslist.filter(res => {
  //     return res.pUpiname == upiname;
  //   })


  //   this.GetValidationByControl(this.paymentVoucherForm, 'pUpiname', true);
  // }


  upiName_Change($event: any): void {

    const upiname = $event?.target?.value;

    this.upiidlist = this.upinameslist.filter(
      (res: { pUpiname: any }) => res.pUpiname === upiname
    );

    this.GetValidationByControl(
      this.paymentVoucherForm,
      'pUpiname',
      true
    );
  }

  upid_change() {
    this.GetValidationByControl(this.paymentVoucherForm, 'pUpiid', true);

  }
 GetBankDetailsbyId(pbankid:any) {


debugger


   this._AccountingTransactionsService.GetBankDetailsbyId1(pbankid,
    this._commonService.getbranchname(),
      this._commonService.getschemaname(),
      
      this._commonService.getCompanyCode(),
      this._commonService.getBranchCode()
    ).
      subscribe({
        next: (json: any) => {
          //console.log(json)
          if (json != null) {


             this.upinameslist = json.bankupilist;
                this.chequenumberslist = json.chequeslist;
            this.bankbarnchdummy = json[0].bank_branch
            this.paymentVoucherForm['controls']['pbranchname'].setValue(this.bankbarnchdummy);
            this.upinameslist = json.bankupilist;
            // this.chequenumberslist = json.chequeslist;

          }
        },
        error: (err: any) => {
          console.log('ERROR:', err);
          alert('API Error');
        }
      });

      
    }

  getBankBranchName(pbankid: any) {
    debugger
    let data = this.banklist.filter(
      (res: { pbankid: any }) =>
        res.pbankid == pbankid
    );


    this.paymentVoucherForm['controls']['pbranchname'].setValue(data[0].pbranchname);
    this.setBalances('BANKBOOK', data[0].pbankbalance);
    this.setBalances('PASSBOOK', data[0].pbankpassbookbalance);
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

  setenableordisabletdsgst(ppartyname: any, changetype: string): void {

    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');

    // reset GST/TDS
    group?.get('pistdsapplicable')?.setValue(false);
    group?.get('pisgstapplicable')?.setValue(false);

    const data = this.paymentslist.find(
      (x: { ppartyname: any; pistdsapplicable: boolean; pisgstapplicable: boolean; pgstcalculationtype: any; ptdscalculationtype: any }) =>
        x.ppartyname === ppartyname
    );

    if (data) {
      this.disablegst = true;
      this.disabletds = true;

      group?.get('pistdsapplicable')?.setValue(data.pistdsapplicable);
      group?.get('pisgstapplicable')?.setValue(data.pisgstapplicable);
      group?.get('pgstcalculationtype')?.setValue(data.pgstcalculationtype);
      group?.get('ptdscalculationtype')?.setValue(data.ptdscalculationtype);

    } else {
      this.disablegst = false;
      this.disabletds = false;
    }

    if (changetype === 'PARTYCHANGE') {
      this.isgstapplicableChange();
      this.istdsapplicableChange();
    }
  }

  // tdsSection_Change($event: any): void {

  //   const ptdssection = $event.target.value;
  //   this.tdspercentagelist = [];
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsPercentage'].setValue('');
  //   if (ptdssection && ptdssection != '') {

  //     this.gettdsPercentage(ptdssection);

  //   }
  //   this.GetValidationByControl(this.paymentVoucherForm, 'pTdsSection', true);
  // }

  tdsSection_Change($event: any): void {

    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');
    const ptdssection = $event?.target?.value;

    this.tdspercentagelist = [];
    group?.get('pTdsPercentage')?.setValue('');

    if (ptdssection) {
      this.gettdsPercentage(ptdssection);
    }

    this.GetValidationByControl(
      this.paymentVoucherForm,
      'pTdsSection',
      true
    );
  }

  gettdsPercentage(ptdssection: any) {

    this.tdspercentagelist = this.tdslist.filter((res: { pTdsSection: any }) =>
      res.pTdsSection == ptdssection
    );
    this.claculategsttdsamounts();
  }
  tds_Change($event: any): void {
    this.GetValidationByControl(this.paymentVoucherForm, 'pTdsPercentage', true);
    this.GetValidationByControl(this.paymentVoucherForm, 'ptdsamount', true);
    this.claculategsttdsamounts();
  }
  // gst_Change($event: any): void {

  //   const gstpercentage = $event.target.value;

  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pigstpercentage'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcgstpercentage'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psgstpercentage'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['putgstpercentage'].setValue('');

  //   if (gstpercentage && gstpercentage != '') {

  //     this.getgstPercentage(gstpercentage);

  //   }
  //   this.GetValidationByControl(this.paymentVoucherForm, 'pgstpercentage', true);
  //   this.GetValidationByControl(this.paymentVoucherForm, 'pgstamount', true);
  // }

  gst_Change($event: any): void {

    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');
    const gstpercentage = $event?.target?.value;

    // reset GST percentage fields
    group?.get('pigstpercentage')?.setValue('');
    group?.get('pcgstpercentage')?.setValue('');
    group?.get('psgstpercentage')?.setValue('');
    group?.get('putgstpercentage')?.setValue('');

    if (gstpercentage) {
      this.getgstPercentage(gstpercentage);
    }

    this.GetValidationByControl(this.paymentVoucherForm, 'pgstpercentage', true);
    this.GetValidationByControl(this.paymentVoucherForm, 'pgstamount', true);
  }

  // getgstPercentage(gstpercentage) {

  //   let data = this.gstlist.filter(function (tds) {
  //     return tds.pgstpercentage == gstpercentage;
  //   });

  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pigstpercentage'].setValue(data[0].pigstpercentage);
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcgstpercentage'].setValue(data[0].pcgstpercentage);
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psgstpercentage'].setValue(data[0].psgstpercentage);
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['putgstpercentage'].setValue(data[0].putgstpercentage);
  //   this.claculategsttdsamounts();

  // }
  getgstPercentage(gstpercentage: any): void {

    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');

    const data = this.gstlist.find(
      (tds: { pgstpercentage: any; pigstpercentage: any; pcgstpercentage: any; psgstpercentage: any; putgstpercentage: any }) =>
        tds.pgstpercentage === gstpercentage
    );

    if (data) {
      group?.get('pigstpercentage')?.setValue(data.pigstpercentage);
      group?.get('pcgstpercentage')?.setValue(data.pcgstpercentage);
      group?.get('psgstpercentage')?.setValue(data.psgstpercentage);
      group?.get('putgstpercentage')?.setValue(data.putgstpercentage);
    }

    this.claculategsttdsamounts();
  }


  // partyName_Change($event: any): void {
  //   this.availableAmount = 0
  //   let ppartyid;
  //   if ($event != undefined) {
  //     ppartyid = $event.ppartyid;
  //   }
  //   this.statelist = [];
  //   this.tdssectionlist = [];
  //   this.tdspercentagelist = [];
  //   this.paymentslist1 = [];
  //   this.partyjournalentrylist = [];
  //   this.paymentslist = [];
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pStateId'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pState'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsSection'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsPercentage'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyreferenceid'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyreftype'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartypannumber'].setValue('');
  //   this.partyBalance = '';
  //   let trans_date = this.paymentVoucherForm.controls.ppaymentdate.value;
  //   trans_date = this._commonService.getFormatDateNormal(trans_date);
  //   let amt = 0
  //   this._AccountingTransactionsService.GetCashRestrictAmountpercontact('PAYMENT VOUCHER', this._commonService.getschemaname(), ppartyid, trans_date).subscribe(json => {
  //     amt = json
  //     this.availableAmount = this.cashRestrictAmount - amt

  //   })
  //   if (ppartyid && ppartyid != '') {
  //     const partynamename = $event.ppartyname;

  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyname'].setValue(partynamename);
  //     let data = (this.partylist.filter(x => x.ppartyid == ppartyid))[0];
  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyreferenceid'].setValue(data.ppartyreferenceid);
  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyreftype'].setValue(data.ppartyreftype);
  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartypannumber'].setValue(data.ppartypannumber);
  //     this.getPartyDetailsbyid(ppartyid, partynamename);
  //     this.setenableordisabletdsgst(partynamename, 'PARTYCHANGE');
  //   }
  //   else {
  //     this.setBalances('PARTY', 0);
  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyname'].setValue('');
  //   }
  // }


  partyName_Change($event: any): void {

    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');
    const ppartyid = $event?.ppartyid;

    // reset everything
    this.availableAmount = 0;
    this.statelist = [];
    this.tdssectionlist = [];
    this.tdspercentagelist = [];
    this.paymentslist1 = [];
    this.partyjournalentrylist = [];
    this.paymentslist = [];
    this.partyBalance = '';

    group?.get('pStateId')?.setValue('');
    group?.get('pState')?.setValue('');
    group?.get('pTdsSection')?.setValue('');
    group?.get('pTdsPercentage')?.setValue('');
    group?.get('ppartyreferenceid')?.setValue('');
    group?.get('ppartyreftype')?.setValue('');
    group?.get('ppartypannumber')?.setValue('');

    // get transaction date formatted
    let trans_date = this._commonService.getFormatDateNormal(
      this.paymentVoucherForm.get('ppaymentdate')?.value
    );

    // get restricted cash amount
    this._AccountingTransactionsService
      .GetCashRestrictAmountpercontact(
        'PAYMENT VOUCHER',
        this._commonService.getschemaname(),
        ppartyid,
        trans_date
      )
      .subscribe((amt: number) => {
        this.availableAmount = this.cashRestrictAmount - amt;
      });

    if (ppartyid) {

      const partynamename = $event.ppartyname;

      group?.get('ppartyname')?.setValue(partynamename);

      const data = this.partylist.find(
        (x: { ppartyid: any; ppartyreferenceid: any; ppartyreftype: any; ppartypannumber: any }) =>
          x.ppartyid === ppartyid
      );

      if (data) {
        group?.get('ppartyreferenceid')?.setValue(data.ppartyreferenceid);
        group?.get('ppartyreftype')?.setValue(data.ppartyreftype);
        group?.get('ppartypannumber')?.setValue(data.ppartypannumber);
      }

      this.getPartyDetailsbyid(ppartyid, partynamename);
      this.setenableordisabletdsgst(partynamename, 'PARTYCHANGE');

    } else {
      this.setBalances('PARTY', 0);
      group?.get('ppartyname')?.setValue('');
    }
  }

  // getPartyDetailsbyid(ppartyid, partynamename) {

  //   this._AccountingTransactionsService.getPartyDetailsbyid(ppartyid).subscribe(json => {

  //     //console.log(json);
  //     if (json != null) {

  //       this.tdslist = json.lstTdsSectionDetails;
  //       let newdata = json.lstTdsSectionDetails.map(item => item.pTdsSection)
  //         .filter((value, index, self) => self.indexOf(value) === index)
  //       for (let i = 0; i < newdata.length; i++) {
  //         let object = { pTdsSection: newdata[i] }
  //         this.tdssectionlist.push(object);
  //       }
  //       // console.log(json.statelist);
  //       this.statelist = json.statelist;
  //       this.claculategsttdsamounts();
  //       this.setBalances('PARTY', json.accountbalance);

  //       //this.lstLoanTypes = json
  //       //this.titleDetails = json as string
  //       //this.titleDetails = eval("(" + this.titleDetails + ')');
  //       //this.titleDetails = this.titleDetails.FT;
  //     }
  //   },
  //     (error) => {

  //       this._commonService.showErrorMessage(error);
  //     });
  // }



  getPartyDetailsbyid(ppartyid: any, partynamename: string): void {

    this._AccountingTransactionsService.getPartyDetailsbyid(ppartyid)
      .subscribe(
        (json: any) => {

          if (!json) return;

          this.tdslist = json.lstTdsSectionDetails;

          // extract unique TDS sections
          const newdata = json.lstTdsSectionDetails
            .map((item: { pTdsSection: any }) => item.pTdsSection)
            .filter((value: any, index: number, self: any[]) => self.indexOf(value) === index);

          this.tdssectionlist = newdata.map((section: any) => ({ pTdsSection: section }));

          this.statelist = json.statelist;
          this.claculategsttdsamounts();
          this.setBalances('PARTY', json.accountbalance);
        },
        (error: any) => {
          this._commonService.showErrorMessage(error);
        }
      );
  }

  gsno_change() {
    this.GetValidationByControl(this.paymentVoucherForm, 'pgstno', true);
  }
  // gst_clear() {
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pigstpercentage'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcgstpercentage'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psgstpercentage'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['putgstpercentage'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstpercentage'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstno'].setValue('');
  // }


  gst_clear(): void {
    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');

    group?.get('pigstpercentage')?.setValue('');
    group?.get('pcgstpercentage')?.setValue('');
    group?.get('psgstpercentage')?.setValue('');
    group?.get('putgstpercentage')?.setValue('');
    group?.get('pgstpercentage')?.setValue('');
    group?.get('pgstno')?.setValue('');
  }

  // state_change($event:any) {

  //   const pstateid = $event.target.value;

  //   this.gst_clear();





  //   if (pstateid && pstateid != '') {


  //     const statename = $event.target.options[$event.target.selectedIndex].text;
  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pState'].setValue(statename);
  //     //let gstnoControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstno'];

  //     let gstno = statename.split('-')[1];
  //     if (gstno) {
  //       //gstnoControl.clearValidators();
  //       this.showgstno = false;
  //     }
  //     else {
  //       this.showgstno = true;
  //       //gstnoControl.setValidators(Validators.required);
  //     }
  //     //gstnoControl.updateValueAndValidity();

  //     let data = this.GetStatedetailsbyId(pstateid);

  //     this.showgstamount = true;
  //     this.showigst = false;
  //     this.showcgst = false;
  //     this.showsgst = false;
  //     this.showutgst = false;

  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgsttype'].setValue(data.pgsttype);
  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstno'].setValue(data.gstnumber);
  //     if (data.pgsttype == 'IGST')
  //       this.showigst = true;
  //     else {
  //       this.showcgst = true;
  //       if (data.pgsttype == 'CGST,SGST')
  //         this.showsgst = true;
  //       if (data.pgsttype == 'CGST,UTGST')
  //         this.showutgst = true;
  //     }
  //   }
  //   else {

  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pState'].setValue('');
  //   }
  //   this.GetValidationByControl(this.paymentVoucherForm, 'pState', true);
  //   this.formValidationMessages['pigstpercentage'] = '';
  //   this.claculategsttdsamounts();
  // }


  state_change($event: any): void {

    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');
    const pstateid = $event?.target?.value;

    this.gst_clear();

    if (pstateid) {

      // get state name from selected option
      const statename = $event.target.options[$event.target.selectedIndex]?.text;
      group?.get('pState')?.setValue(statename);

      // show/hide GST number based on state
      const gstno = statename?.split('-')[1];
      this.showgstno = !gstno;

      // get state details
      const data = this.GetStatedetailsbyId(pstateid);

      this.showgstamount = true;
      this.showigst = false;
      this.showcgst = false;
      this.showsgst = false;
      this.showutgst = false;

      group?.get('pgsttype')?.setValue(data?.pgsttype);
      group?.get('pgstno')?.setValue(data?.gstnumber);

      if (data?.pgsttype === 'IGST') {
        this.showigst = true;
      } else {
        this.showcgst = true;
        if (data?.pgsttype === 'CGST,SGST') this.showsgst = true;
        if (data?.pgsttype === 'CGST,UTGST') this.showutgst = true;
      }

    } else {
      group?.get('pState')?.setValue('');
    }

    this.GetValidationByControl(this.paymentVoucherForm, 'pState', true);
    this.formValidationMessages['pigstpercentage'] = '';
    this.claculategsttdsamounts();
  }

  GetStatedetailsbyId(pstateid: any): any {
    return (this.statelist.filter((tds: { pStateId: any }) =>
      tds.pStateId == pstateid
    ))[0];




  }
  pamount_change() {

    //let paidamount = parseFloat(this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pamount').value.toString());

    //if (isNaN(paidamount))
    //    paidamount = 0;

    //this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pactualpaidamount'].setValue(paidamount);

    this.claculategsttdsamounts();
  }
  // claculategsttdsamounts() {
  //   debugger;
  //   try {

  //     let paidamount = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pactualpaidamount').value;
  //     if (isNullOrEmptyString(paidamount))
  //       paidamount = 0;
  //     else
  //       paidamount = parseFloat(this._commonService.removeCommasInAmount(paidamount.toString()).toString());

  //     if (isNaN(paidamount))
  //       paidamount = 0;

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
  //         gstamount = parseFloat(((paidamount * igstpercentage) / (100 + igstpercentage)).toFixed(2));//math.round
  //         if (gsttype == 'IGST') {
  //           igstamount = Math.ceil(gstamount);
  //           // igstamount = parseFloat(((paidamount * igstpercentage) / (100 + igstpercentage)).toFixed(2));//math.round
  //           actualpaidamount = paidamount - igstamount;
  //         }

  //         else if (gsttype == 'CGST,SGST') {
  //           cgstamount = Math.ceil(gstamount) / 2;
  //           sgstamount = Math.ceil(gstamount) / 2;
  //           // cgstamount = parseFloat(((paidamount * cgstpercentage) / (100 + igstpercentage)).toFixed(2));
  //           // sgstamount = parseFloat(((paidamount * sgstpercentage) / (100 + igstpercentage)).toFixed(2));

  //           actualpaidamount = paidamount - (cgstamount + sgstamount);
  //         }
  //         else if (gsttype == 'CGST,UTGST') {
  //           cgstamount = Math.ceil(gstamount) / 2;
  //           utgstamount = Math.ceil(gstamount) / 2;
  //           // cgstamount = parseFloat(((paidamount * cgstpercentage) / (100 + igstpercentage)).toFixed(2));
  //           // utgstamount = parseFloat(((paidamount * utgstpercentage) / (100 + igstpercentage)).toFixed(2));
  //           actualpaidamount = paidamount - (cgstamount + utgstamount);
  //         }
  //       }
  //       else if (gstcalculationtype == 'EXCLUDE') {
  //         gstamount = parseFloat(((paidamount * igstpercentage) / (100)).toFixed(2));//math.round
  //         if (gsttype == 'IGST') {
  //           igstamount = Math.ceil(gstamount);
  //           // igstamount = parseFloat(((paidamount * igstpercentage) / (100)).toFixed(2));//math.round
  //         }
  //         else if (gsttype == 'CGST,SGST') {
  //           cgstamount = Math.ceil(gstamount) / 2;
  //           sgstamount = Math.ceil(gstamount) / 2;
  //           // cgstamount = parseFloat(((paidamount * cgstpercentage) / (100)).toFixed(2));
  //           // sgstamount = parseFloat(((paidamount * sgstpercentage) / (100)).toFixed(2));

  //         }
  //         else if (gsttype == 'CGST,UTGST') {
  //           cgstamount = Math.ceil(gstamount) / 2;
  //           utgstamount = Math.ceil(gstamount) / 2;
  //           // cgstamount = parseFloat(((paidamount * cgstpercentage) / (100)).toFixed(2));
  //           // utgstamount = parseFloat(((paidamount * utgstpercentage) / (100)).toFixed(2));
  //         }
  //         actualpaidamount = paidamount;
  //       }
  //     }

  //     let tdscalculationtype = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('ptdscalculationtype').value;
  //     let istdsapplicable = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pistdsapplicable').value;
  //     let tdspercentage = parseFloat(this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pTdsPercentage').value.toString());

  //     if (isNaN(tdspercentage))
  //       tdspercentage = 0;

  //     let tdsamount = 0;

  //     if (istdsapplicable) {
  //       if (tdscalculationtype == 'INCLUDE') {
  //         if (gstcalculationtype == 'INCLUDE') {
  //           tdsamount = Math.ceil((actualpaidamount * tdspercentage) / (100 + tdspercentage));
  //         }
  //         else {
  //           tdsamount = Math.ceil((paidamount * tdspercentage) / (100 + tdspercentage));
  //         }
  //         actualpaidamount = actualpaidamount - tdsamount;

  //       }
  //       else if (tdscalculationtype == 'EXCLUDE') {

  //         if (gstcalculationtype == 'INCLUDE') {
  //           tdsamount = Math.ceil((actualpaidamount * tdspercentage) / (100));
  //         }
  //         else
  //           tdsamount = Math.ceil((paidamount * tdspercentage) / (100));

  //         //actualpaidamount = actualpaidamount;
  //         actualpaidamount = actualpaidamount - tdsamount;

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


  //     gstamount = sgstamount + igstamount + cgstamount + utgstamount;
  //     totalamount = actualpaidamount + sgstamount + igstamount + cgstamount + utgstamount;
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

  //     this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ptotalamount'].setValue(parseFloat(totalamount.toFixed(2)));//math.round

  //     this.formValidationMessages['pamount'] = '';
  //   } catch (e) {
  //     this._commonService.showErrorMessage(e);
  //   }
  // }


  claculategsttdsamounts(): void {
    try {
      const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');

      // Paid amount
      let paidamount: number = parseFloat(this._commonService.removeCommasInAmount(group?.get('pactualpaidamount')?.value ?? '0'));
      if (isNaN(paidamount)) paidamount = 0;

      let actualpaidamount = paidamount;

      // GST details
      const isgstapplicable = group?.get('pisgstapplicable')?.value;
      const gsttype = group?.get('pgsttype')?.value;
      const gstcalculationtype = group?.get('pgstcalculationtype')?.value;

      let igstpercentage = parseFloat(group?.get('pigstpercentage')?.value ?? '0');
      let cgstpercentage = parseFloat(group?.get('pcgstpercentage')?.value ?? '0');
      let sgstpercentage = parseFloat(group?.get('psgstpercentage')?.value ?? '0');
      let utgstpercentage = parseFloat(group?.get('putgstpercentage')?.value ?? '0');

      igstpercentage = isNaN(igstpercentage) ? 0 : igstpercentage;
      cgstpercentage = isNaN(cgstpercentage) ? 0 : cgstpercentage;
      sgstpercentage = isNaN(sgstpercentage) ? 0 : sgstpercentage;
      utgstpercentage = isNaN(utgstpercentage) ? 0 : utgstpercentage;

      // Initialize amounts
      let gstamount = 0, igstamount = 0, cgstamount = 0, sgstamount = 0, utgstamount = 0, totalamount = 0;

      if (isgstapplicable) {
        if (gstcalculationtype === 'INCLUDE') {
          gstamount = parseFloat(((paidamount * igstpercentage) / (100 + igstpercentage)).toFixed(2));

          if (gsttype === 'IGST') {
            igstamount = Math.ceil(gstamount);
            actualpaidamount -= igstamount;
          } else if (gsttype === 'CGST,SGST') {
            cgstamount = Math.ceil(gstamount) / 2;
            sgstamount = Math.ceil(gstamount) / 2;
            actualpaidamount -= (cgstamount + sgstamount);
          } else if (gsttype === 'CGST,UTGST') {
            cgstamount = Math.ceil(gstamount) / 2;
            utgstamount = Math.ceil(gstamount) / 2;
            actualpaidamount -= (cgstamount + utgstamount);
          }
        } else if (gstcalculationtype === 'EXCLUDE') {
          gstamount = parseFloat(((paidamount * igstpercentage) / 100).toFixed(2));
          if (gsttype === 'IGST') igstamount = Math.ceil(gstamount);
          else if (gsttype === 'CGST,SGST') { cgstamount = Math.ceil(gstamount) / 2; sgstamount = Math.ceil(gstamount) / 2; }
          else if (gsttype === 'CGST,UTGST') { cgstamount = Math.ceil(gstamount) / 2; utgstamount = Math.ceil(gstamount) / 2; }
        }
      }

      // TDS details
      const istdsapplicable = group?.get('pistdsapplicable')?.value;
      const tdscalculationtype = group?.get('ptdscalculationtype')?.value;
      let tdspercentage = parseFloat(group?.get('pTdsPercentage')?.value ?? '0');
      if (isNaN(tdspercentage)) tdspercentage = 0;

      let tdsamount = 0;

      if (istdsapplicable) {
        if (tdscalculationtype === 'INCLUDE') {
          tdsamount = Math.ceil((actualpaidamount * tdspercentage) / (gstcalculationtype === 'INCLUDE' ? (100 + tdspercentage) : (100 + tdspercentage)));
          actualpaidamount -= tdsamount;
        } else if (tdscalculationtype === 'EXCLUDE') {
          tdsamount = Math.ceil((actualpaidamount * tdspercentage) / (gstcalculationtype === 'INCLUDE' ? 100 : 100));
          actualpaidamount -= tdsamount;
        }
      }

      gstamount = sgstamount + igstamount + cgstamount + utgstamount;
      totalamount = actualpaidamount + gstamount;

      // Update form controls
      group?.get('pamount')?.setValue(actualpaidamount > 0 ? actualpaidamount : '');
      group?.get('pgstamount')?.setValue(gstamount);
      group?.get('pigstamount')?.setValue(igstamount);
      group?.get('pcgstamount')?.setValue(cgstamount);
      group?.get('psgstamount')?.setValue(sgstamount);
      group?.get('putgstamount')?.setValue(utgstamount);
      group?.get('ptdsamount')?.setValue(tdsamount);
      group?.get('ptotalamount')?.setValue(parseFloat(totalamount.toFixed(2)));

      this.formValidationMessages['pamount'] = '';

    } catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }

  // validateaddPaymentDetails(): boolean {
  //   debugger;
  //   let isValid: boolean = true;
  //   const formControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols'];
  //   try {
  //     let verifyamount = this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pactualpaidamount'].value;
  //     if (verifyamount == 0) {
  //       this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pactualpaidamount'].setValue('')
  //     }
  //     isValid = this.checkValidations(formControl, isValid)
  //     let ledgername = formControl.controls.pledgername.value;
  //     let subledgername = formControl.controls.psubledgername.value;
  //     let subledgerid = formControl.controls.psubledgerid.value;
  //     let partyid = formControl.controls.ppartyid.value;

  //     let griddata = this.paymentslist;

  //     let count = 0;
  //     let fixed_count = 0;
  //     let bank_count = 0;

  //     for (let i = 0; i < griddata.length; i++) {
  //       if (ledgername == "FIXED DEPOSIT RECEIPTS-CHITS" && griddata.length > 0) {
  //         count = 1;
  //         fixed_count = 1;
  //         break;
  //       }

  //       if ((griddata[i].pledgername == "FIXED DEPOSIT RECEIPTS-CHITS") || (griddata[i].pledgername == ledgername && griddata[i].psubledgername == subledgername && griddata[i].ppartyid == partyid)) {
  //         if (griddata[i].pledgername == "FIXED DEPOSIT RECEIPTS-CHITS") {
  //           fixed_count = 1;
  //         }
  //         count = 1;
  //         break;
  //       }
  //       for (let j = 0; j < this.banklist.length; j++) {
  //         if (this.banklist[j].paccountid == griddata[i].psubledgerid || this.banklist[j].paccountid == subledgerid) {
  //           count = 1;
  //           bank_count = 1;
  //           break;
  //         }
  //       }
  //       // for (let j = 0; j < this.banklist.length; j++) {
  //       //     if (this.banklist[j].paccountid == subledgerid) {
  //       //         count = 1;
  //       //         bank_count = 1;
  //       //         break;
  //       //     }
  //       // }
  //     }
  //     if (count == 1) {
  //       if (fixed_count == 1)
  //         this._commonService.showWarningMessage('Fixed deposit receipts accepts only one record in the grid');
  //       else if (bank_count == 1)
  //         this._commonService.showWarningMessage('Bank Accounts only one record in the grid');
  //       else
  //         this._commonService.showWarningMessage('Ledger,subledger and party already exists in the grid.');
  //       isValid = false;
  //     }
  //   } catch (e) {
  //     this._commonService.showErrorMessage(e);
  //   }


  //   return isValid;
  // }



  validateaddPaymentDetails(): boolean {
    let isValid = true;
    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

    try {
      let verifyamount = group?.get('pactualpaidamount')?.value;
      if (verifyamount === 0) group?.get('pactualpaidamount')?.setValue('');

      isValid = this.checkValidations(group, isValid);

      const ledgername = group?.get('pledgername')?.value;
      const subledgername = group?.get('psubledgername')?.value;
      const subledgerid = group?.get('psubledgerid')?.value;
      const partyid = group?.get('ppartyid')?.value;

      const griddata = this.paymentslist;
      let count = 0, fixed_count = 0, bank_count = 0;

      for (let i = 0; i < griddata.length; i++) {
        if (ledgername === "FIXED DEPOSIT RECEIPTS-CHITS" && griddata.length > 0) {
          count = fixed_count = 1;
          break;
        }

        if (griddata[i].pledgername === ledgername && griddata[i].psubledgername === subledgername && griddata[i].ppartyid === partyid) {
          count = 1;
          break;
        }

        for (let j = 0; j < this.banklist.length; j++) {
          if (this.banklist[j].paccountid === griddata[i].psubledgerid || this.banklist[j].paccountid === subledgerid) {
            count = bank_count = 1;
            break;
          }
        }
      }

      if (count === 1) {
        if (fixed_count === 1) this._commonService.showWarningMessage('Fixed deposit receipts accepts only one record in the grid');
        else if (bank_count === 1) this._commonService.showWarningMessage('Bank Accounts only one record in the grid');
        else this._commonService.showWarningMessage('Ledger, subledger and party already exists in the grid.');
        isValid = false;
      }

    } catch (e) {
      this._commonService.showErrorMessage(e);
    }

    return isValid;
  }

  // addPaymentDetails() {
  //   debugger;
  //   this.disableaddbutton = true;
  //   this.addbutton = "Processing";
  //   const control = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols'];
  //   if (this.validateaddPaymentDetails()) {
  //     let accounthedadid = this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pledgerid'].value;
  //     let subcategoryid = this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgerid'].value;
  //     let paidamount = this._commonService.removeCommasInAmount(this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pactualpaidamount'].value);
  //     this._SubscriberJVService.GetdebitchitCheckbalance(accounthedadid, "", subcategoryid).subscribe(result => {

  //       debugger;
  //       if (result['balancecheckstatus']) {
  //         if (paidamount <= parseFloat(result['balanceamount'].toString())) {
  //           let stateid = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pStateId').value;
  //           if (stateid == "" || stateid == null)
  //             this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pStateId'].setValue(0);

  //           let tdspercentage = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pTdsPercentage').value;
  //           if (tdspercentage == "" || tdspercentage == null)
  //             this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsPercentage'].setValue(0);

  //           let gstpercentage = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pgstpercentage').value;
  //           if (gstpercentage == "" || gstpercentage == null)
  //             this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstpercentage'].setValue(0);

  //           let data = {
  //             ppartyname: control.controls.ppartyname.value,

  //             pledgername: control.controls.pledgername.value,
  //             psubledgername: control.controls.psubledgername.value,
  //             ptotalamount: this._commonService.removeCommasInAmount(control.controls.ptotalamount.value),
  //             pamount: this._commonService.removeCommasInAmount(control.controls.pamount.value),
  //             pgstcalculationtype: control.controls.pgstcalculationtype.value,
  //             pTdsSection: control.controls.pTdsSection.value,
  //             pgstpercentage: gstpercentage,
  //             ptdsamount: this._commonService.removeCommasInAmount(control.controls.ptdsamount.value)
  //           }
  //           this.paymentslist1 = [...this.paymentslist1, data]

  //           this.paymentslist.push(control.value);


  //           this.getpartyJournalEntryData();
  //           // this.clearPaymentDetails();
  //           this.clearPaymentDetailsparticular();
  //           this.getPaymentListColumnWisetotals();
  //         } else {
  //           this._commonService.showWarningMessage("Enter the amount less or equal to  subledger amount");
  //         }

  //       } else {
  //         let stateid = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pStateId').value;
  //         if (stateid == "" || stateid == null)
  //           this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pStateId'].setValue(0);

  //         let tdspercentage = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pTdsPercentage').value;
  //         if (tdspercentage == "" || tdspercentage == null)
  //           this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsPercentage'].setValue(0);

  //         let gstpercentage = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pgstpercentage').value;
  //         if (gstpercentage == "" || gstpercentage == null)
  //           this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstpercentage'].setValue(0);

  //         let data = {
  //           ppartyname: control.controls.ppartyname.value,

  //           pledgername: control.controls.pledgername.value,
  //           psubledgername: control.controls.psubledgername.value,
  //           ptotalamount: this._commonService.removeCommasInAmount(control.controls.ptotalamount.value),
  //           pamount: this._commonService.removeCommasInAmount(control.controls.pamount.value),
  //           pgstcalculationtype: control.controls.pgstcalculationtype.value,
  //           pTdsSection: control.controls.pTdsSection.value,
  //           pgstpercentage: gstpercentage,
  //           ptdsamount: this._commonService.removeCommasInAmount(control.controls.ptdsamount.value)
  //         }
  //         this.paymentslist1 = [...this.paymentslist1, data]

  //         this.paymentslist.push(control.value);


  //         this.getpartyJournalEntryData();
  //         // this.clearPaymentDetails();
  //         this.clearPaymentDetailsparticular();
  //         this.getPaymentListColumnWisetotals();
  //       }
  //       // if (paidamount <= parseFloat(result['balanceamount'].toString()) || Boolean(result['balancecheckstatus'].toString())) {

  //       //     let stateid = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pStateId').value;
  //       //     if (stateid == "" || stateid == null)
  //       //         this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pStateId'].setValue(0);

  //       //     let tdspercentage = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pTdsPercentage').value;
  //       //     if (tdspercentage == "" || tdspercentage == null)
  //       //         this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsPercentage'].setValue(0);

  //       //     let gstpercentage = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pgstpercentage').value;
  //       //     if (gstpercentage == "" || gstpercentage == null)
  //       //         this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstpercentage'].setValue(0);

  //       //     let data = {
  //       //         ppartyname: control.controls.ppartyname.value,

  //       //         pledgername: control.controls.pledgername.value,
  //       //         psubledgername: control.controls.psubledgername.value,
  //       //         ptotalamount: this._commonService.removeCommasInAmount(control.controls.ptotalamount.value),
  //       //         pamount: this._commonService.removeCommasInAmount(control.controls.pamount.value),
  //       //         pgstcalculationtype: control.controls.pgstcalculationtype.value,
  //       //         pTdsSection: control.controls.pTdsSection.value,
  //       //         pgstpercentage: gstpercentage,
  //       //         ptdsamount: this._commonService.removeCommasInAmount(control.controls.ptdsamount.value)
  //       //     }
  //       //     this.paymentslist1 = [...this.paymentslist1, data]

  //       //     this.paymentslist.push(control.value);


  //       //     this.getpartyJournalEntryData();
  //       //     // this.clearPaymentDetails();
  //       //     this.clearPaymentDetailsparticular();
  //       //     this.getPaymentListColumnWisetotals();
  //       // }
  //       // else {
  //       //     this._commonService.showWarningMessage("Insufficient balance ");
  //       // }
  //     })
  //   }
  //   this.disableaddbutton = false;
  //   this.addbutton = "Add";
  // }



  addPaymentDetails(): void {
    this.disableaddbutton = true;
    this.addbutton = "Processing";

    const control = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

    if (!this.validateaddPaymentDetails()) {
      this.disableaddbutton = false;
      this.addbutton = "Add";
      return;
    }

    const accountheadid = control.get('pledgerid')?.value;
    const subcategoryid = control.get('psubledgerid')?.value;
    let paidamount = parseFloat(this._commonService.removeCommasInAmount(control.get('pactualpaidamount')?.value ?? '0'));
    // let paidamount = parseFloat(
    //   this._commonService.removeCommasInAmount(
    //     String(control.get('pactualpaidamount')?.value ?? '0')
    //   )
    // );
    this._SubscriberJVService.GetdebitchitCheckbalance(accountheadid, "", subcategoryid).subscribe(result => {
      const balancecheckstatus = result?.balancecheckstatus;
      const balanceamount = parseFloat(result?.balanceamount ?? '0');

      if (balancecheckstatus && paidamount > balanceamount) {
        this._commonService.showWarningMessage("Enter the amount less or equal to subledger amount");
        this.disableaddbutton = false;
        this.addbutton = "Add";
        return;
      }

      // Set defaults for state, TDS, GST
      if (!control.get('pStateId')?.value) control.get('pStateId')?.setValue(0);
      if (!control.get('pTdsPercentage')?.value) control.get('pTdsPercentage')?.setValue(0);
      if (!control.get('pgstpercentage')?.value) control.get('pgstpercentage')?.setValue(0);

      const data = {
        ppartyname: control.get('ppartyname')?.value,
        pledgername: control.get('pledgername')?.value,
        psubledgername: control.get('psubledgername')?.value,
        ptotalamount: parseFloat(this._commonService.removeCommasInAmount(control.get('ptotalamount')?.value ?? '0')),
        pamount: parseFloat(this._commonService.removeCommasInAmount(control.get('pamount')?.value ?? '0')),
        pgstcalculationtype: control.get('pgstcalculationtype')?.value,
        pTdsSection: control.get('pTdsSection')?.value,
        pgstpercentage: parseFloat(control.get('pgstpercentage')?.value ?? '0'),
        ptdsamount: parseFloat(this._commonService.removeCommasInAmount(control.get('ptdsamount')?.value ?? '0'))
      };

      // Update payments list
      this.paymentslist1 = [...this.paymentslist1, data];
      this.paymentslist.push(control.value);

      // Refresh UI
      this.getpartyJournalEntryData();
      this.clearPaymentDetailsparticular();
      this.getPaymentListColumnWisetotals();

      this.disableaddbutton = false;
      this.addbutton = "Add";
    }, (error) => {
      this._commonService.showErrorMessage(error);
      this.disableaddbutton = false;
      this.addbutton = "Add";
    });
  }

  // getPaymentListColumnWisetotals() {
  //   debugger;
  //   let totalamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.ptotalamount)), 0);
  //   this.paymentlistcolumnwiselist['ptotalamount'] = (totalamount);

  //   totalamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.pamount)), 0);
  //   this.paymentlistcolumnwiselist['pamount'] = (totalamount);


  //   totalamount = this.paymentslist.reduce((sum, c) => sum + (parseFloat(c.pgstamount)), 0);
  //   this.paymentlistcolumnwiselist['pgstamount'] = (totalamount);

  //   totalamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.ptdsamount)), 0);
  //   this.paymentlistcolumnwiselist['ptdsamount'] = (totalamount);
  // }

  getPaymentListColumnWisetotals(): void {
    const sum = (key: keyof typeof this.paymentslist[0]) =>
      this.paymentslist.reduce((acc: number, c: any) => acc + parseFloat(c[key] ?? 0), 0);

    this.paymentlistcolumnwiselist['ptotalamount'] = sum('ptotalamount');
    this.paymentlistcolumnwiselist['pamount'] = sum('pamount');
    this.paymentlistcolumnwiselist['pgstamount'] = sum('pgstamount');
    this.paymentlistcolumnwiselist['ptdsamount'] = sum('ptdsamount');
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
  //   this.istdsapplicable_Checked();
  //   this.isgstapplicable_Checked();

  //   this.formValidationMessages = {};

  // }
  clearPaymentDetails() {
    const control = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

    control.reset();
    this.showsubledger = true;
    control.patchValue({
      pistdsapplicable: false,
      pisgstapplicable: false
    });

    control.patchValue({
      pledgerid: null,
      psubledgerid: null,
      ppartyid: null
    });

    control.patchValue({
      pStateId: '',
      pgstpercentage: '',
      pTdsSection: '',
      pTdsPercentage: ''
    });

    this.setBalances('LEDGER', 0);
    this.setBalances('SUBLEDGER', 0);
    this.setBalances('PARTY', 0);

    this.istdsapplicable_Checked();
    this.isgstapplicable_Checked();

    this.formValidationMessages = {};
  }

  // clearPaymentDetailsparticular() {

  //   const formControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols'];
  //   // formControl.reset();
  //   this.showsubledger = true;
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pistdsapplicable'].setValue(false);
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pisgstapplicable'].setValue(false);

  //   // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pledgerid'].setValue(null);
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgerid'].setValue(null);
  //   // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyid'].setValue(null);


  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pStateId'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstpercentage'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsSection'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsPercentage'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pactualpaidamount'].setValue('');
  //   // this.setBalances('LEDGER', 0);
  //   this.setBalances('SUBLEDGER', 0);
  //   // this.setBalances('PARTY', 0);
  //   // this.istdsapplicable_Checked();
  //   // this.isgstapplicable_Checked();
  //   this.showgst = false;
  //   this.showtds = false;
  //   this.disablegst = false;
  //   this.disabletds = true;
  //   this.showgstno = false;
  //   this.formValidationMessages = {};

  // }

  clearPaymentDetailsparticular() {
    const control = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

    this.showsubledger = true;
    this.showgst = false;
    this.showtds = false;
    this.disablegst = false;
    this.disabletds = true;
    this.showgstno = false;

    control.patchValue({
      pistdsapplicable: false,
      pisgstapplicable: false
    });

    control.patchValue({
      psubledgerid: null
    });

    control.patchValue({
      pStateId: '',
      pgstpercentage: '',
      pTdsSection: '',
      pTdsPercentage: '',
      pactualpaidamount: ''
    });

    this.setBalances('SUBLEDGER', 0);

    this.formValidationMessages = {};
  }

  cleartranstypeDetails() {
    this.chequenumberslist = [];
    this.paymentVoucherForm['controls']['pbankid'].setValue('');
    this.paymentVoucherForm['controls']['pbankname'].setValue('');
    this.paymentVoucherForm['controls']['pCardNumber'].setValue('');
    this.paymentVoucherForm['controls']['ptypeofpayment'].setValue('');
    this.paymentVoucherForm['controls']['pbranchname'].setValue('');
    this.paymentVoucherForm['controls']['pUpiname'].setValue('');
    this.paymentVoucherForm['controls']['pUpiid'].setValue('');
    this.paymentVoucherForm['controls']['pChequenumber'].setValue('');
    this.formValidationMessages = {};
    this.setBalances('BANKBOOK', 0);
    this.setBalances('PASSBOOK', 0);
  }
  validatesavePaymentVoucher(): boolean {
    debugger;
    let isValid: boolean = true;
    try {
      isValid = this.checkValidations(this.paymentVoucherForm, isValid);
      if (this.paymentslist.length == 0) {
        this.showWarningMessage('add atleast one record to the grid !')
        //this.showErrorMessage('Loan type, loan name and charge name already exists in grid');
        isValid = false;
      }
      if (this.paymentVoucherForm.controls['pmodofpayment'].value == 'CASH') {
        if (this.cashBalance.indexOf('D') > -1) {
          let cashvalue = this.cashBalance.split('D')[0];

          cashvalue = (this._commonService.removeCommasInAmount(cashvalue));
          // let paidvalue = this.paymentVoucherForm.controls['ptotalpaidamount'].value;
          // if (!isNullOrEmptyString(paidvalue))
          //   paidvalue = parseFloat(paidvalue.toString());
          // else
          //   paidvalue = 0;
          // if (parseFloat(paidvalue) > parseFloat(cashvalue)) {
          //   this._commonService.showWarningMessage('Insufficient Cash Balance');
          //   isValid = false;
          // }

          let paidvalue = this.paymentVoucherForm.controls['ptotalpaidamount'].value;

          // Replace isNullOrEmptyString check
          if (paidvalue !== null && paidvalue !== undefined && paidvalue.toString().trim() !== '') {
            paidvalue = parseFloat(paidvalue.toString());
          } else {
            paidvalue = 0;
          }

          if (paidvalue > parseFloat(cashvalue)) {
            this._commonService.showWarningMessage('Insufficient Cash Balance');
            isValid = false;
          }

          if (isValid) {
            this.bankexists = false;
            for (let i = 0; i < this.paymentslist.length; i++) {
              for (let j = 0; j < this.banklist.length; j++) {
                if (this.banklist[j].paccountid == this.paymentslist[i].psubledgerid) {
                  this.bankexists = true;
                  break;
                }
              }
            }
            // if (!isNullOrEmptyString(this.cashRestrictAmount))
            //   this.cashRestrictAmount = parseFloat(this.cashRestrictAmount.toString());


            if (this.cashRestrictAmount !== null && this.cashRestrictAmount !== undefined && this.cashRestrictAmount.toString().trim() !== '') {
              this.cashRestrictAmount = parseFloat(this.cashRestrictAmount.toString());
            }

            else
              this.cashRestrictAmount = 0;

            if (parseFloat(this.cashRestrictAmount) > 0 && this.bankexists == false) {
              if (parseFloat(this.availableAmount) <= parseFloat(paidvalue)) {
                //this._commonService.showWarningMessage('Cash transactions limit below ' + this._commonService.currencysymbol + "" + this._commonService.currencyformat(this.cashRestrictAmount) + " only");
                this._commonService.showWarningMessage('Cash transactions limit below ' + this._commonService.currencysymbol + "" + this._commonService.currencyformat(this.cashRestrictAmount) + "" + ' Avaialble Amount ' + this._commonService.currencysymbol + this._commonService.currencyformat(this.availableAmount) + " only for this Party");
                isValid = false;
              }
            }
          }
        }
        else {
          this._commonService.showWarningMessage('Insufficient Cash Balance');
          isValid = false;
        }
      }
    } catch (e) {
      this._commonService.showErrorMessage(e);
    }


    return isValid;
  }



  clearPaymentVoucher() {

    try {
      this.paymentslist = [];
      this.paymentslist1 = [];
      this.paymentVoucherForm.reset();
      this.cleartranstypeDetails();
      this.clearPaymentDetails();
      this.paymentVoucherForm['controls']['pmodofpayment'].setValue('CASH');
      this.paymentVoucherForm['controls']['ptranstype'].setValue('CHEQUE');
      this.paymentVoucherForm['controls']['schemaname'].setValue(this._commonService.getschemaname());

      this.modeofPaymentChange();

      let date = new Date();
      this.paymentVoucherForm['controls']['ppaymentdate'].setValue(date);
      this.formValidationMessages = {};
      this.paymentlistcolumnwiselist = {};

      this.bankbookBalance = '0';
      this.bankpassbookBalance = '0';
      this.ledgerBalance = '0';
      this.subledgerBalance = '0';
      this.partyBalance = '0';
      this.partyjournalentrylist = [];
      this.imageResponse = {
        name: '',
        fileType: "imageResponse",
        contentType: '',
        size: 0,

      };
    } catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }

  // savePaymentVoucher() {
  //   debugger;

  //   this.disablesavebutton = true;
  //   this.savebutton = 'Processing';
  //   let count = 0;
  //   this.paymentVoucherForm['controls']['ptotalpaidamount'].setValue(this.paymentslist.reduce((sum, c) => sum + parseFloat((c.ptotalamount)), 0));
  //   if (this.validatesavePaymentVoucher()) {
  //     let acc = [];
  //     let data = this.paymentslist.map(re => {
  //       return acc.push(re.psubledgerid);
  //     });
  //     let accountid = acc.join(',');
  //     let trans_date = this.paymentVoucherForm.controls.ppaymentdate.value;
  //     trans_date = this._commonService.getFormatDateNormal(trans_date);
  //     this._AccountingTransactionsService.GetCashAmountAccountWise("PAYMENT VOUCHER", accountid, trans_date).subscribe(result => {
  //       console.log(result);
  //       debugger;
  //       if (this.paymentVoucherForm.controls.pmodofpayment.value == 'CASH' && this.bankexists == false) {

  //         for (let i = 0; i < this.paymentslist.length; i++) {
  //           let amount = parseFloat(this._commonService.removeCommasInAmount(this.paymentslist[i].ptotalamount).toString());
  //           for (let j = 0; j < result.length; j++) {
  //             if (this.paymentslist[i].psubledgerid == result[j].psubledgerid) {
  //               let amt1 = (result[j].accountbalance) + (amount);
  //               if (parseFloat(this.cashRestrictAmount) < parseFloat(amt1)) {
  //                 count = 1;
  //               }
  //             }
  //           }
  //         }
  //       }
  //       if (count == 0) {
  //         if (confirm("Do You Want To Save ?")) {
  //           //let bankid = this.paymentVoucherForm.controls.pbankid.value;
  //           //if (bankid == "" || bankid == null)
  //           //    this.paymentVoucherForm['controls']['pbankid'].setValue(0);
  //           debugger;
  //           if (this.paymentVoucherForm.controls.pmodofpayment.value == 'CASH') {
  //             this.paymentVoucherForm['controls']['pbankid'].setValue(0);
  //           }
  //           this.paymentVoucherForm.controls.pipaddress.setValue(this._commonService.getipaddress());
  //           this.paymentVoucherForm.controls.pCreatedby.setValue(this._commonService.getcreatedby());
  //           let newdata = { ppaymentslist: this.paymentslist };
  //           let paymentVoucherdata = Object.assign(this.paymentVoucherForm.value, newdata);
  //           // console.log(paymentVoucherdata);
  //           paymentVoucherdata.ppaymentdate = this._commonService.getFormatDateNormal(paymentVoucherdata.ppaymentdate);
  //           paymentVoucherdata.pchequedate = this._commonService.getFormatDateNormal(paymentVoucherdata.pchequedate);



  //           debugger;
  //           let data = JSON.stringify(paymentVoucherdata);
  //           console.log(data);

  //           this._AccountingTransactionsService.savePaymentVoucher(data).subscribe(res => {
  //             debugger;
  //             if (res[0] == 'TRUE') {
  //               debugger;
  //               this.JSONdataItem = res;
  //               console.log(this.JSONdataItem)
  //               this.disablesavebutton = false;
  //               this.savebutton = 'Save';
  //               this._commonService.showInfoMessage("Saved sucessfully");
  //               this.clearPaymentVoucher();
  //               //this.router.navigate(['/Transactions/PaymentVoucherView']);

  //               // this.router.navigate(['/PsInfo/PaymentVoucherReport']);
  //               debugger
  //               // window.open('http://localhost:4200/#/PaymentVoucherReport',"_blank");
  //               // window.open('/#/PaymentVoucherReport?id=' + btoa(res[1] + ',' + 'Payment Voucher'));
  //               let receipt = btoa(res[1] + ',' + 'Payment Voucher');
  //               //  this.router.navigate(['/Reports/PaymentVoucherReport', receipt]);
  //               window.open('/#/PaymentVoucherReport?id=' + receipt + '', "_blank");
  //             }
  //             else {
  //               this.disablesavebutton = false;
  //               this.savebutton = 'Save';
  //               this._commonService.showErrorMessage("Error while saving..!");
  //             }

  //           },
  //             (error) => {
  //               //this.isLoading = false;
  //               this._commonService.showErrorMessage(error);
  //               this.disablesavebutton = false;
  //               this.savebutton = 'Save';
  //             });
  //           //let MVNo="MV9/20"

  //           // window.open('/#/PaymentVoucherReport?id=' + btoa(res[1] + ',' + 'Payment Voucher'));
  //         }
  //         else {
  //           this.disablesavebutton = false;
  //           this.savebutton = 'Save';
  //         }
  //       }
  //       else {
  //         this._commonService.showWarningMessage('Subledger per day Cash transactions limit below ' + this._commonService.currencysymbol + "" + this._commonService.currencyformat(this.cashRestrictAmount) + " only");
  //         this.disablesavebutton = false;
  //         this.savebutton = 'Save';
  //       }
  //     });
  //   }
  //   else {
  //     this.disablesavebutton = false;
  //     this.savebutton = 'Save';
  //   }
  // }



  savePaymentVoucher() {
    debugger;

    this.disablesavebutton = true;
    this.savebutton = 'Processing';
    let count = 0;

    // Calculate total paid amount
    // const totalPaid = this.paymentslist.reduce((sum, c) => sum + parseFloat(c.ptotalamount ?? 0), 0);
    const totalPaid = this.paymentslist.reduce((sum: number, c: any) => sum + parseFloat(c.ptotalamount ?? 0), 0);

    this.paymentVoucherForm.controls['ptotalpaidamount'].setValue(totalPaid);

    if (!this.validatesavePaymentVoucher()) {
      this.disablesavebutton = false;
      this.savebutton = 'Save';
      return;
    }

    // Collect subledger IDs
    // const accountIds = this.paymentslist.map(p => p.psubledgerid).join(',');

    const accountIds = this.paymentslist.map((p: any) => p.psubledgerid).join(',');

    let trans_date = this.paymentVoucherForm.controls['ppaymentdate'].value;
    trans_date = this._commonService.getFormatDateNormal(trans_date);

    this._AccountingTransactionsService.GetCashAmountAccountWise("PAYMENT VOUCHER", accountIds, trans_date)
      .subscribe(result => {
        debugger;

        // Check Cash restriction for Cash payment
        if (this.paymentVoucherForm.controls['pmodofpayment'].value === 'CASH' && !this.bankexists) {
          for (const payment of this.paymentslist) {
            const amount = parseFloat(this._commonService.removeCommasInAmount(payment.ptotalamount).toString());

            // const matchingResult = result.find(r => r.psubledgerid === payment.psubledgerid);
            const matchingResult = result.find((r: any) => r.psubledgerid === (payment as any).psubledgerid);

            if (matchingResult) {
              const totalAmount = matchingResult.accountbalance + amount;
              if (parseFloat(this.cashRestrictAmount.toString()) < totalAmount) {
                count = 1;
                break;
              }
            }
          }
        }

        if (count !== 0) {
          this._commonService.showWarningMessage(
            `Subledger per day Cash transactions limit below ${this._commonService.currencysymbol}${this._commonService.currencyformat(this.cashRestrictAmount)} only`
          );
          this.disablesavebutton = false;
          this.savebutton = 'Save';
          return;
        }

        if (!confirm("Do You Want To Save ?")) {
          this.disablesavebutton = false;
          this.savebutton = 'Save';
          return;
        }

        // Prepare Payment Voucher data
        if (this.paymentVoucherForm.controls['pmodofpayment'].value === 'CASH') {
          this.paymentVoucherForm.controls['pbankid'].setValue(0);
        }

        this.paymentVoucherForm.controls['pipaddress'].setValue(this._commonService.getIpAddress());
        this.paymentVoucherForm.controls['pCreatedby'].setValue(this._commonService.getCreatedBy());

        const paymentVoucherData = {
          ...this.paymentVoucherForm.value,
          ppaymentslist: this.paymentslist
        };

        // Format dates
        paymentVoucherData.ppaymentdate = this._commonService.getFormatDateNormal(paymentVoucherData.ppaymentdate);
        paymentVoucherData.pchequedate = this._commonService.getFormatDateNormal(paymentVoucherData.pchequedate);

        // Save via service
        this._AccountingTransactionsService.savePaymentVoucher(paymentVoucherData)
          .subscribe({
            next: (res: any) => {
              debugger;
              if (res[0] === 'TRUE') {
                this.JSONdataItem = res;
                this.disablesavebutton = false;
                this.savebutton = 'Save';
                this._commonService.showInfoMessage("Saved successfully");
                this.clearPaymentVoucher();

                const receipt = btoa(`${res[1]},Payment Voucher`);
                window.open(`/#/PaymentVoucherReport?id=${receipt}`, "_blank");
              } else {
                this.disablesavebutton = false;
                this.savebutton = 'Save';
                this._commonService.showErrorMessage("Error while saving..!");
              }
            },
            error: (err) => {
              this._commonService.showErrorMessage(err);
              this.disablesavebutton = false;
              this.savebutton = 'Save';
            }
          });
      });
  }

  // getpartyJournalEntryData() {
  //   debugger;
  //   try {
  //     let dataobject;
  //     let journalentryamount;
  //     let tdsjournalentrylist = [];
  //     let ledgerdata = this.paymentslist.map(item => item.pledgername)
  //       .filter((value, index, self) => self.indexOf(value) === index)

  //     let tdssectionwisedata;

  //     this.partyjournalentrylist = [];

  //     let index = 1;
  //     for (let i = 0; i < ledgerdata.length; i++) {

  //       journalentryamount = this.paymentslist
  //         .filter(c => c.pledgername === ledgerdata[i]).reduce((sum, c) => (sum + (this._commonService.removeCommasInAmount(c.pamount)) + (this._commonService.removeCommasInAmount(c.ptdsamount))), 0);
  //       dataobject = { type: 'Payment Voucher', accountname: ledgerdata[i], debitamount: (journalentryamount), creditamount: '' }
  //       this.partyjournalentrylist = [...this.partyjournalentrylist, dataobject];
  //       //   this.partyjournalentrylist.push(dataobject);

  //       let tdsdata = this.paymentslist.filter(c => c.pledgername === ledgerdata[i]);
  //       tdssectionwisedata = tdsdata.map(item => item.pTdsSection)
  //         .filter((value, index, self) => self.indexOf(value) === index)

  //       for (let j = 0; j < tdssectionwisedata.length; j++) {
  //         journalentryamount = tdsdata
  //           .filter(c => c.pTdsSection === tdssectionwisedata[j]).reduce((sum, c) => sum + (this._commonService.removeCommasInAmount(c.ptdsamount)), 0);
  //         dataobject = { type: 'Journal Voucher' + index, accountname: 'TDS-' + tdssectionwisedata[j] + ' RECIVABLE', debitamount: (journalentryamount), creditamount: '' }
  //         tdsjournalentrylist.push(dataobject);
  //       }

  //       journalentryamount = tdsdata.reduce((sum, c) => sum + (this._commonService.removeCommasInAmount(c.ptdsamount)), 0);
  //       if (journalentryamount > 0) {
  //         dataobject = { type: 'Journal Voucher' + index, accountname: ledgerdata[i], debitamount: '', creditamount: (journalentryamount) }
  //         tdsjournalentrylist.push(dataobject);
  //       }
  //       index = index + 1;
  //     }

  //     journalentryamount = this.paymentslist.reduce((sum, c) => sum + (this._commonService.removeCommasInAmount(c.pigstamount)), 0);
  //     if (journalentryamount > 0) {
  //       dataobject = { type: 'Payment Voucher', accountname: 'P-IGST', debitamount: (journalentryamount), creditamount: '' }
  //       //   this.partyjournalentrylist.push(dataobject);
  //       this.partyjournalentrylist = [...this.partyjournalentrylist, dataobject];

  //     }
  //     journalentryamount = this.paymentslist.reduce((sum, c) => sum + (this._commonService.removeCommasInAmount(c.pcgstamount)), 0);
  //     if (journalentryamount > 0) {
  //       dataobject = { type: 'Payment Voucher', accountname: 'P-CGST', debitamount: (journalentryamount), creditamount: '' }
  //       //   this.partyjournalentrylist.push(dataobject);
  //       this.partyjournalentrylist = [...this.partyjournalentrylist, dataobject];

  //     }
  //     journalentryamount = this.paymentslist.reduce((sum, c) => sum + (this._commonService.removeCommasInAmount(c.psgstamount)), 0);
  //     if (journalentryamount > 0) {
  //       dataobject = { type: 'Payment Voucher', accountname: 'P-SGST', debitamount: (journalentryamount), creditamount: '' }
  //       //   this.partyjournalentrylist.push(dataobject);
  //       this.partyjournalentrylist = [...this.partyjournalentrylist, dataobject];

  //     }
  //     journalentryamount = this.paymentslist.reduce((sum, c) => sum + (this._commonService.removeCommasInAmount(c.putgstamount)), 0);
  //     if (journalentryamount > 0) {
  //       dataobject = { type: 'Payment Voucher', accountname: 'P-UTGST', debitamount: (journalentryamount), creditamount: '' }
  //       //   this.partyjournalentrylist.push(dataobject);
  //       this.partyjournalentrylist = [...this.partyjournalentrylist, dataobject];

  //     }

  //     journalentryamount = this.paymentslist.reduce((sum, c) => sum + (this._commonService.removeCommasInAmount(c.ptotalamount)), 0);
  //     if (journalentryamount > 0) {
  //       this.paymentVoucherForm['controls']['ptotalpaidamount'].setValue((journalentryamount));
  //       if (this.paymentVoucherForm.controls.pmodofpayment.value == "CASH") {
  //         dataobject = {
  //           type: 'Payment Voucher', accountname: 'CASH ON HAND', debitamount: '', creditamount: (journalentryamount.toFixed(2))
  //         }
  //       }
  //       else {
  //         dataobject = { type: 'Payment Voucher', accountname: 'BANK', debitamount: '', creditamount: (journalentryamount.toFixed(2)) }
  //       }
  //       //   this.partyjournalentrylist.push(dataobject);
  //       this.partyjournalentrylist = [...this.partyjournalentrylist, dataobject];

  //     }
  //     //for (let i = 0; i < tdsjournalentrylist.length; i++) {
  //     //  this.partyjournalentrylist.push(tdsjournalentrylist[i]);
  //     //}

  //     this.loadgrid();
  //   } catch (e) {
  //     this._commonService.showErrorMessage(e);
  //   }
  // }


  getpartyJournalEntryData() {
    debugger;
    try {
      const tdsJournalEntries: any[] = [];
      const ledgerNames = [...new Set(this.paymentslist.map((item: any) => item.pledgername))];
      this.partyjournalentrylist = [];
      let journalIndex = 1;

      // Process each ledger
      for (const ledger of ledgerNames) {
        const ledgerPayments = this.paymentslist.filter((p: any) => p.pledgername === ledger);

        // Total debit amount for the ledger (payment + TDS)
        const ledgerDebit = ledgerPayments.reduce(
          (sum: number, p: any) => sum + this._commonService.removeCommasInAmount(p.pamount) + this._commonService.removeCommasInAmount(p.ptdsamount),
          0
        );

        // Push ledger debit entry
        this.partyjournalentrylist.push({
          type: 'Payment Voucher',
          accountname: ledger,
          debitamount: ledgerDebit,
          creditamount: ''
        });

        // Process TDS per section
        const tdsSections = [...new Set(ledgerPayments.map((p: any) => p.pTdsSection))];
        for (const section of tdsSections) {
          const tdsAmount = ledgerPayments
            .filter((p: any) => p.pTdsSection === section)
            .reduce((sum: number, p: any) => sum + this._commonService.removeCommasInAmount(p.ptdsamount), 0);

          if (tdsAmount > 0) {
            tdsJournalEntries.push({
              type: `Journal Voucher${journalIndex}`,
              accountname: `TDS-${section} RECEIVABLE`,
              debitamount: tdsAmount,
              creditamount: ''
            });
          }
        }

        // Ledger credit for total TDS
        const totalTDS = ledgerPayments.reduce(
          (sum: number, p: any) => sum + this._commonService.removeCommasInAmount(p.ptdsamount),
          0
        );
        if (totalTDS > 0) {
          tdsJournalEntries.push({
            type: `Journal Voucher${journalIndex}`,
            accountname: ledger,
            debitamount: '',
            creditamount: totalTDS
          });
        }

        journalIndex++;
      }

      // Add GST entries if present
      const gstTypes = ['pigstamount', 'pcgstamount', 'psgstamount', 'putgstamount'];
      const gstNames = ['P-IGST', 'P-CGST', 'P-SGST', 'P-UTGST'];

      gstTypes.forEach((key, idx) => {
        const totalGST = this.paymentslist.reduce(
          (sum: number, p: any) => sum + this._commonService.removeCommasInAmount(p[key]),
          0
        );
        if (totalGST > 0) {
          this.partyjournalentrylist.push({
            type: 'Payment Voucher',
            accountname: gstNames[idx],
            debitamount: totalGST,
            creditamount: ''
          });
        }
      });

      // Total paid amount
      const totalPaid = this.paymentslist.reduce(
        (sum: number, p: any) => sum + this._commonService.removeCommasInAmount(p.ptotalamount),
        0
      );
      if (totalPaid > 0) {
        this.paymentVoucherForm.controls['ptotalpaidamount'].setValue(totalPaid);

        const accountName = this.paymentVoucherForm.controls['pmodofpayment'].value === 'CASH' ? 'CASH ON HAND' : 'BANK';
        this.partyjournalentrylist.push({
          type: 'Payment Voucher',
          accountname: accountName,
          debitamount: '',
          creditamount: totalPaid.toFixed(2)
        });
      }

      // Append TDS journal entries
      this.partyjournalentrylist = [...this.partyjournalentrylist, ...tdsJournalEntries];

      this.loadgrid();
    } catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }



  //dataItem
  public removeHandler(rowIndex: any) {
    debugger;
    //const index: number = this.paymentslist.indexOf(value);
    const index: number = rowIndex;
    if (index !== -1) {
      this.paymentslist.splice(index, 1);
      this.paymentslist1.splice(index, 1);
      this.paymentslist1 = [...this.paymentslist1];
    }
    let journalentryamount = this.paymentslist.reduce(
      (sum: number, c: any) => sum + parseFloat(c.ptotalamount ?? 0),
      0
    );
    // let journalentryamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.ptotalamount)), 0);
    this.paymentVoucherForm['controls']['ptotalpaidamount'].setValue((journalentryamount));
    this.getpartyJournalEntryData();
    this.clearPaymentDetailsparticular();
    this.getPaymentListColumnWisetotals();
  }

  uploadAndProgress(event: any, files: any) {
    debugger;
    var extention = event.target.value.substring(event.target.value.lastIndexOf('.') + 1);
    if (!this.validateFile(event.target.value)) {
      this._commonService.showWarningMessage("Upload jpg or png or pdf files");
    }
    else {
      let file = event.target.files[0];
      this.imageResponse;
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
        formData.append('NewFileName', 'Payment Voucher' + '.' + files[i]["name"].split('.').pop());
      }
      //size = size / 1024;
      size = size / 1024
      this._commonService.fileUploadS3("Account", formData).subscribe(data => {
        if (extention.toLowerCase() == 'pdf') {
          this.imageResponse.name = data[0];
          this.kycFileName = data[0];
          // this.kycFilePath = data[0];
        }
        else {
          this.kycFileName = data[0];
          this.imageResponse.name = data[0];
          //let kycFilePath = data[0];
          // let Filepath = kycFileName.split(".");
        }
        this.paymentVoucherForm.controls['pFilename'].setValue(this.kycFileName);
        // this.paymentVoucherForm.controls.pFileformat.setValue(kycFilePath);
        // this.paymentVoucherForm.controls.pFilepath.setValue(Filepath[1]);
      })
    }
  }
  validateFile(fileName: any): any {
    try {
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
    catch (e: any) {
      this.showErrorMessage(e);
    }
  }
  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }
  showWarningMessage(errormsg: string) {
    this._commonService.showWarningMessage(errormsg);
  }
  get pgstno() {
    debugger;
    return this.paymentVoucherForm.get('pgstno');
  }

}

// import { CommonModule, DecimalPipe } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// @Component({
//   selector: 'app-payment-voucher-view',
//   templateUrl: './payment-voucher-view.component.html',
//   styleUrls: ['./payment-voucher-view.component.css'],
//   imports: [CommonModule,
//     ReactiveFormsModule,
//     NgxDatatableModule,
//     BsDatepickerModule
//   ],
//   providers: [DecimalPipe]
// })
// export class PaymentVoucherViewComponent implements OnInit {

//   disabletransactiondate = false;
//   public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
//    public ppaymentdateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
//   today: Date = new Date();

//   // Payment Mode
//   paymentMode: 'CASH' | 'BANK' = 'CASH';

//   // Bank Instrument Type
//   bankType: 'CHEQUE' | 'ONLINE' | 'DEBIT' | 'CREDIT' = 'CHEQUE';

//   // GST / TDS toggles
//   gstEnabled: boolean = false;
//   tdsEnabled: boolean = false;

//   // Dummy Data
//   payment = {
//     amountPaid: 5000,
//     party: 'Party A',
//     ledger: 'Ledger A',
//     subLedger: 'Sub Ledger A',
//   };

//   // Dummy grid data
//   paymentslist1: any[] = [];
//   partyjournalentrylist: any[] = [];

//   // Reactive Form
//   paymentVoucherForm!: FormGroup;
//   journalform!: FormGroup;

//   constructor(private fb: FormBuilder) {
//     this.dpConfig.maxDate = new Date();
//     this.dpConfig.containerClass = 'theme-dark-blue';
//     this.dpConfig.dateInputFormat = 'DD-MMM-YYYY';
//     this.dpConfig.showWeekNumbers = false;



//      this.ppaymentdateConfig.maxDate = new Date();
//     this.ppaymentdateConfig.containerClass = 'theme-dark-blue';
//     this.ppaymentdateConfig.dateInputFormat = 'DD-MMM-YYYY';
//     this.ppaymentdateConfig.showWeekNumbers = false;
//   }

//   ngOnInit(): void {
//     // this.today = new Date().toISOString().substring(0, 10);

//     this.paymentVoucherForm = this.fb.group({
//       todate: [this.today],
//       ppaymentdate:[new Date,Validators.required],
//       pisgstapplicable: [false],
//       pgstcalculationtype: ['INCLUDE'],
//       pStateId: [''],
//       pgstno: [''],
//       pgstpercentage: [0],
//       pgstamount: [0],
//       pigstpercentage: [0],
//       pigstamount: [0],
//       pcgstpercentage: [0],
//       pcgstamount: [0],
//       psgstpercentage: [0],
//       psgstamount: [0],
//       putgstpercentage: [0],
//       putgstamount: [0],

//       pistdsapplicable: [false],
//       ptdscalculationtype: ['INCLUDE'],
//       pTdsSection: [''],
//       pTdsPercentage: [0],
//       ptdsamount: [0],
//       pnarration: [''],
//       pDocStorePath: [''],
//       ppaymentsslistcontrols: this.fb.group({
//         pgstamount: [0],
//         pigstpercentage: [0],
//         pigstamount: [0],
//         pcgstpercentage: [0],
//         pcgstamount: [0],
//         psgstpercentage: [0],
//         psgstamount: [0],
//         putgstpercentage: [0],
//         putgstamount: [0],
//         ptdsamount: [0]
//       }),


//     });

//     this.paymentslist1 = [
//       { ppartyname: 'Party A', pledgername: 'Ledger A', psubledgername: 'Sub Ledger A', ptotalamount: 5000, pamount: 5000, pgstcalculationtype: '', pTdsSection: '', pgstpercentage: 0, ptdsamount: 0 }
//     ];

//     this.partyjournalentrylist = [
//       { accountname: 'Party A', debitamount: 5000, creditamount: 0 },
//       { accountname: 'Bank', debitamount: 0, creditamount: 5000 }
//     ];
//   }

//   setPaymentMode(mode: 'CASH' | 'BANK') {
//     this.paymentMode = mode;
//     if (mode === 'BANK') {
//       this.bankType = 'CHEQUE';
//     }
//   }

//   setBankType(type: 'CHEQUE' | 'ONLINE' | 'DEBIT' | 'CREDIT') {
//     this.bankType = type;
//   }

//   isgstapplicable_Checked() {
//     this.gstEnabled = !this.gstEnabled;
//   }

//   istdsapplicable_Checked() {
//     this.tdsEnabled = !this.tdsEnabled;
//   }

//   claculategsttdsamounts() {
//     // Dummy calculation for GST/TDS
//     const baseAmount = this.payment.amountPaid;

//     if (this.gstEnabled) {
//       const gstPercent = this.paymentVoucherForm.get('pgstpercentage')?.value || 0;
//       const gstAmount = (baseAmount * gstPercent) / 100;
//       this.paymentVoucherForm.patchValue({
//         pgstamount: gstAmount,
//         pigstpercentage: gstPercent,
//         pigstamount: gstAmount
//       });
//     }

//     if (this.tdsEnabled) {
//       const tdsPercent = this.paymentVoucherForm.get('pTdsPercentage')?.value || 0;
//       const tdsAmount = (baseAmount * tdsPercent) / 100;
//       this.paymentVoucherForm.patchValue({
//         ptdsamount: tdsAmount
//       });
//     }
//   }

//   clearPaymentDetails() {
//     this.paymentVoucherForm.reset({
//       pisgstapplicable: false,
//       pgstcalculationtype: 'INCLUDE',
//       pStateId: '',
//       pgstno: '',
//       pgstpercentage: 0,
//       pgstamount: 0,
//       pistdsapplicable: false,
//       ptdscalculationtype: 'INCLUDE',
//       pTdsSection: '',
//       pTdsPercentage: 0,
//       ptdsamount: 0,
//       pnarration: '',
//       pDocStorePath: ''
//     });

//     this.gstEnabled = false;
//     this.tdsEnabled = false;
//   }

//   addPaymentDetails() {
//     alert('Payment Added (Dummy)');
//   }

//   savePaymentVoucher() {
//     alert('Saved (Dummy)');
//   }

//   removeHandler(rowIndex: number) {
//     this.paymentslist1.splice(rowIndex, 1);
//   }
//   saveJournalVoucher() {

//   }
//   clearPaymentVoucher() { }
//   uploadAndProgress($event: any) { }
// }




// import { GroupDescriptor, DataResult, State } from '@progress/kendo-data-query';
// import { SelectableSettings } from '@progress/kendo-angular-grid';
// import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
// import { SubscriberJVService } from 'src/app/Services/Transactions/subscriber/subscriberjv.service';
// import { parse } from 'path';
// import { DataResult, GroupDescriptor, State } from '@progress/kendo-data-query';

  // selector: 'app-payment-voucher',
  // templateUrl: './payment-voucher.component.html'


  
  // accountid: any;

  
  // public gridState: State = {
  //   sort: [],
  //   skip: 0,
  //   take: 10
  // };
  
    // this.ppaymentdateConfig.containerClass = this._commonService.datePickerPropertiesSetup('containerClass');
    // this.ppaymentdateConfig.showWeekNumbers = this._commonService.datePickerPropertiesSetup('showWeekNumbers');
    // this.ppaymentdateConfig.maxDate = new Date();
    // this.ppaymentdateConfig.dateInputFormat = this._commonService.datePickerPropertiesSetup('dateInputFormat');
  
  // public groups: GroupDescriptor[] = [{ field: 'type' }];


  // public gridView!: DataResult;
 
    // GroupDescriptor[]
  
      //this.showErrorMessage(e);
     
      //this._commonService.showErrorMessage(key);
      