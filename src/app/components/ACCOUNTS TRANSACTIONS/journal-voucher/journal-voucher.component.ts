
import { CommonModule, CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { DataResult, State } from '@progress/kendo-data-query';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonService } from '../../../services/common.service';
import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';
import { SubscriberjvService } from '../../../services/Transactions/subscriber/subscriberjv.service';

@Component({
  selector: 'app-journal-voucher',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgSelectModule,
    NgIf,
    // CustomCurrencyPipe,
    BsDatepickerModule,
    ButtonModule,
    TableModule,
    CurrencyPipe

  ],

  templateUrl: './journal-voucher.component.html',
  styleUrl: './journal-voucher.component.css',
  providers: [CurrencyPipe]
})






export class JournalVoucherComponent implements OnInit {
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
  cashBalance: any;;
  bankBalance: any;;
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
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  disabletransactiondate: boolean = false;
  public selectableSettings!: SelectableSettings;
  public ppaymentdateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  constructor(private _FormBuilder: FormBuilder, private datepipe: DatePipe, private zone: NgZone, private _commonService: CommonService, private _routes: Router, private _AccountingTransactionsService: AccountingTransactionsService, private router: Router, private _SubscriberJVService: SubscriberjvService) {
    // this.ppaymentdateConfig.containerClass = this._commonService.datePickerPropertiesSetup('containerClass');
    // this.ppaymentdateConfig.showWeekNumbers = this._commonService.datePickerPropertiesSetup('showWeekNumbers');
    // this.ppaymentdateConfig.maxDate = new Date();
    // this.ppaymentdateConfig.dateInputFormat = this._commonService.datePickerPropertiesSetup('dateInputFormat');
    this.ppaymentdateConfig.maxDate = new Date();
    this.ppaymentdateConfig.containerClass = 'theme-dark-blue';
    this.ppaymentdateConfig.dateInputFormat = 'DD-MM-YYYY';
    this.ppaymentdateConfig.showWeekNumbers = false

  }
  paymentVoucherForm!: FormGroup;
  public gridView!: DataResult;

  ngOnInit() {
    debugger;
    console.log(this.paymentlistcolumnwiselist)
    this.currencySymbol = this._commonService.currencysymbol;
    if (this._commonService.comapnydetails != null)
      if (this._commonService.comapnydetails.pdatepickerenablestatus || this._commonService.comapnydetails.pfinclosingjvallowstatus) {
        this.disabletransactiondate = true
      }
      else {
        this.disabletransactiondate = false
      }
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
      schemaname: [this._commonService.getschemaname()],
      ptypeofpayment: [''],
      pChequenumber: [''],
      pchequedate: [''],
      pbankid: [''],

      pCreatedby: [this._commonService.getCreatedBy()],
      pipaddress: [this._commonService.getIpAddress()],
      pStatusname: [this._commonService.pStatusname],
      ptypeofoperation: [this._commonService.ptypeofoperation],

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
      ptypeofoperation: [this._commonService.ptypeofoperation],
      ptotalamount: [''],
    })
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
          if (formcontrol.validator)
            fromgroup.get(key)?.valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })


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
      // this._commonService.showErrorMessage(key);
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
      this.bankbookBalance = balancedetails;
    if (balancetype == 'PASSBOOK')
      this.bankpassbookBalance = balancedetails;
    if (balancetype == 'LEDGER')
      this.ledgerBalance = this.currencySymbol + ' ' + balancedetails;
    if (balancetype == 'SUBLEDGER')
      this.subledgerBalance = this.currencySymbol + ' ' + balancedetails;
    if (balancetype == 'PARTY')
      this.partyBalance = this.currencySymbol + ' ' + balancedetails;
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
  isgstapplicable_Checked(event: any) {
    let checked = event.target.checked;
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pisgstapplicable'].setValue(checked);
    // let group= this.paymentVoucherForm.get('ppaymentsslistcontrols');
    // group?.get('pisgstapplicable')?.setValue(checked);
    this.paymentVoucherForm.get('ppaymentsslistcontrols.pisgstapplicable')?.setValue(checked);
    this.isgstapplicableChange();
  }
  istdsapplicable_Checked(event: any) {
    let checked = event.target.checked;
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pistdsapplicable'].setValue(checked);
    this.paymentVoucherForm
      .get('ppaymentsslistcontrols.pistdsapplicable')
      ?.setValue(checked);

    this.istdsapplicableChange();
  }
  //   isgstapplicableChange() {


  //     // let data = this.paymentVoucherForm.get('ppaymentsslistcontrols').get('pisgstapplicable').value;
  //     let data = this.paymentVoucherForm.get('ppaymentsslistcontrols.pisgstapplicable')?.value;

  //     // let gstCalculationControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstcalculationtype'];
  //     // let gstpercentageControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstpercentage'];
  //     // let stateControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pState'];
  //     // let gstamountControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstamount'];


  //     let paymentControls = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
  //     let gstCalculationControl = paymentControls.get('pgstcalculationtype');
  // let gstpercentageControl = paymentControls.get('pgstpercentage');
  // let stateControl = paymentControls.get('pState');
  // let gstamountControl = paymentControls.get('pgstamount');


  //     //let gstno = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstno'];

  //     if (data) {
  //       this.showgst = true;
  //       if (this.disablegst == false)
  //         this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstcalculationtype'].setValue('INCLUDE')
  //       gstCalculationControl.setValidators(Validators.required);
  //       gstpercentageControl.setValidators(Validators.required);
  //       stateControl.setValidators(Validators.required);
  //       gstamountControl.setValidators(Validators.required);
  //     }
  //     else {
  //       gstCalculationControl.clearValidators();
  //       gstpercentageControl.clearValidators();
  //       stateControl.clearValidators();
  //       gstamountControl.clearValidators();
  //       //gstno.clearValidators();


  //       this.showgst = false;
  //       if (this.disablegst == false)
  //         this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstcalculationtype'].setValue('');
  //     }
  //     gstCalculationControl.updateValueAndValidity();
  //     gstpercentageControl.updateValueAndValidity();
  //     stateControl.updateValueAndValidity();
  //     gstamountControl.updateValueAndValidity();
  //     //gstno.updateValueAndValidity();
  //     this.claculategsttdsamounts();
  //   }
  isgstapplicableChange() {

    const data =
      this.paymentVoucherForm.get('ppaymentsslistcontrols.pisgstapplicable')?.value;

    const paymentControls =
      this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

    const gstCalculationControl = paymentControls.get('pgstcalculationtype');
    const gstpercentageControl = paymentControls.get('pgstpercentage');
    const stateControl = paymentControls.get('pState');
    const gstamountControl = paymentControls.get('pgstamount');

    if (data) {
      this.showgst = true;

      if (!this.disablegst) {
        gstCalculationControl?.setValue('INCLUDE');
      }

      gstCalculationControl?.setValidators([Validators.required]);
      gstpercentageControl?.setValidators([Validators.required]);
      stateControl?.setValidators([Validators.required]);
      gstamountControl?.setValidators([Validators.required]);

    } else {
      this.showgst = false;

      gstCalculationControl?.clearValidators();
      gstpercentageControl?.clearValidators();
      stateControl?.clearValidators();
      gstamountControl?.clearValidators();

      if (!this.disablegst) {
        gstCalculationControl?.setValue('');
      }
    }

    gstCalculationControl?.updateValueAndValidity();
    gstpercentageControl?.updateValueAndValidity();
    stateControl?.updateValueAndValidity();
    gstamountControl?.updateValueAndValidity();

    this.claculategsttdsamounts();
  }



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
  istdsapplicableChange() {

    const data =
      this.paymentVoucherForm.get('ppaymentsslistcontrols.pistdsapplicable')?.value;

    const paymentControls =
      this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

    const tdsCalculationControl = paymentControls.get('ptdscalculationtype');
    const tdspercentageControl = paymentControls.get('pTdsPercentage');
    const sectionControl = paymentControls.get('pTdsSection');
    const tdsamountControl = paymentControls.get('ptdsamount');

    if (data) {
      this.showtds = true;

      if (!this.disabletds) {
        tdsCalculationControl?.setValue('INCLUDE');
      }

      tdsCalculationControl?.setValidators([Validators.required]);
      tdspercentageControl?.setValidators([Validators.required]);
      sectionControl?.setValidators([Validators.required]);
      tdsamountControl?.setValidators([Validators.required]);

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


  getLoadData() {

    // this._AccountingTransactionsService.GetReceiptsandPaymentsLoadingData('JOURNAL VOUCHER', this._commonService.getschemaname()).subscribe((json:any) => {
    this._AccountingTransactionsService.GetReceiptsandPaymentsLoadingData2(
      'JOURNAL VOUCHER',
      this._commonService.getbranchname(),
      this._commonService.getschemaname(),
    this._commonService.getCompanyCode(),
  this._commonService.getBranchCode(),
'taxes')
.subscribe(
  {
    next:(json: any) => {

      //console.log(json)
      if (json != null) {

        this.banklist = json.banklist;
        this.modeoftransactionslist = json.modeofTransactionslist;
        this.typeofpaymentlist = this.gettypeofpaymentdata();
        this.ledgeraccountslist = json.accountslist;
        this.partylist = json.partylist;
        this.gstlist = json.gstlist;

        this.debitcardlist = json.bankdebitcardslist;

        this.setBalances('CASH', json.cashbalance);
        this.setBalances('BANK', json.bankbalance);
        //this.lstLoanTypes = json
        //this.titleDetails = json as string
        //this.titleDetails = eval("(" + this.titleDetails + ')');
        //this.titleDetails = this.titleDetails.FT;
      }
    },
      error:(error: any) => {

        this._commonService.showErrorMessage(error);
     
   } });
  }

  gettypeofpaymentdata(): any {

    let data = this.modeoftransactionslist.filter((payment: { ptranstype: any; ptypeofpayment: any }) => {
      return payment.ptranstype == payment.ptypeofpayment;
    });
    return data;
  }


  //   const data = this.modeoftransactionslist.filter(
  //   (payment: { ptranstype: any; ptypeofpayment: any }) =>
  //     payment.ptranstype === payment.ptypeofpayment
  // );

  // data is an array (empty if no matches)

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
  getbankname(cardnumber: any) {
    try {
      let data = this.debitcardlist.filter((debit: { pCardNumber: any }) => {
        return debit.pCardNumber == cardnumber;
      })[0];

      //       const data = this.debitcardlist.find(
      //   (debit:any) => debit.pCardNumber === cardnumber
      // );
      this.setBalances('BANKBOOK', data.pbankbookbalance);
      this.setBalances('PASSBOOK', data.ppassbookbalance);
      return data;
    } catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
  ledgerName_Change($event: any): void {
    debugger
    const pledgerid = $event.pledgerid;
    this.subledgeraccountslist = [];
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgerid'].setValue(null);
    this.paymentVoucherForm.get('ppaymentsslistcontrols.psubledgerid')?.setValue(null);
    this.paymentVoucherForm.get('ppaymentsslistcontrols.psubledgername')?.setValue('');
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgername'].setValue('');
    this.ledgerBalance = this.currencySymbol + ' 0.00' + ' Dr';
    this.subledgerBalance = this.currencySymbol + ' 0.00' + ' Dr';
    if (pledgerid && pledgerid != '') {
      const ledgername = $event.pledgername;
      let data = this.ledgeraccountslist.filter((ledger: { pledgerid: any }) => {
        return ledger.pledgerid == pledgerid;
      })[0];
      this.setBalances('LEDGER', data.accountbalance);
      this.GetSubLedgerData(pledgerid);
      // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pledgername'].setValue(ledgername);
      this.paymentVoucherForm.get('ppaymentsslistcontrols.pledgername')?.setValue(ledgername);
    }
    else {
      this.setBalances('LEDGER', 0);
      // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pledgername'].setValue('');
      this.paymentVoucherForm.get('ppaymentsslistcontrols.pledgername')?.setValue('');

    }
  }

  GetSubLedgerData(pledgerid: any) {
    debugger
    this._AccountingTransactionsService.GetSubLedgerData3(pledgerid,

      this._commonService.getbranchname(),
        this._commonService.getCompanyCode(),
        this._commonService.getbranchname(),
        this._commonService.getBranchCode(),
        this._commonService.getschemaname()
    ).subscribe(
      {
      next:(json: any) => {

      //console.log(json)
      if (json != null) {

        this.subledgeraccountslist = json;

        // let subLedgerControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgername'];
        // let subLedgerControl = <FormGroup>this.paymentVoucherForm.get('ppaymentsslistcontrols.psubledgername');

        const subLedgerControl = this.paymentVoucherForm
          .get('ppaymentsslistcontrols.psubledgername') as FormGroup;

        subLedgerControl?.patchValue({ someField: 'value' });



        if (this.subledgeraccountslist.length > 0) {
          this.showsubledger = true;
          subLedgerControl.setValidators(Validators.required);

        }
        else {
          subLedgerControl.clearValidators();

          this.showsubledger = false;
          this.paymentVoucherForm.get('ppaymentsslistcontrols.psubledgerid')?.setValue(pledgerid);
          this.paymentVoucherForm.get('ppaymentsslistcontrols.psubledgername')?.setValue(this.paymentVoucherForm.get('ppaymentsslistcontrols.pledgername')?.value);
          this.formValidationMessages['psubledgername'] = '';
        }
        subLedgerControl.updateValueAndValidity();
        //this.lstLoanTypes = json
        //this.titleDetails = json as string
        //this.titleDetails = eval("(" + this.titleDetails + ')');
        //this.titleDetails = this.titleDetails.FT;
      }
    },
     error: (error: any) => {

        this._commonService.showErrorMessage(error);
     
   }
   });
  }
  subledger_Change($event: any) {

    let psubledgerid
    if ($event != undefined) {
      psubledgerid = $event.psubledgerid;
    }
    this.subledgerBalance = this.currencySymbol + ' 0.00' + ' Dr';
    // if (psubledgerid && psubledgerid != '') {
    //   const subledgername = $event.psubledgername;

    //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgername'].setValue(subledgername);
    //   let data = this.subledgeraccountslist.filter(function (ledger) {
    //     return ledger.psubledgerid == psubledgerid;
    //   })[0];
    //   this.setBalances('SUBLEDGER', data.accountbalance);

    // }
    // else {

    //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psubledgername'].setValue('');
    //   this.setBalances('SUBLEDGER', 0);
    // }

    if (psubledgerid && psubledgerid !== '') {

      const subledgername = $event.psubledgername;

      // Get the FormControl safely
      const subLedgerControl = this.paymentVoucherForm.get('ppaymentsslistcontrols.psubledgername');

      subLedgerControl?.setValue(subledgername);

      // Use find() instead of filter()[0]
      const data = this.subledgeraccountslist.find(
        (ledger: any) => ledger.psubledgerid === psubledgerid
      );

      // Use optional chaining in case no match is found
      this.setBalances('SUBLEDGER', data?.accountbalance ?? 0);

    } else {

      const subLedgerControl = this.paymentVoucherForm.get('ppaymentsslistcontrols.psubledgername');

      subLedgerControl?.setValue('');
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
  GetBankDetailsbyId(pbankid: any) {

    this._AccountingTransactionsService.GetBankDetailsbyId(pbankid).
      subscribe({
        next: (json: any) => {

          //console.log(json)
          if (json != null) {

            this.upinameslist = json.bankupilist;
            this.chequenumberslist = json.chequeslist;
          }
        },
        error: (err: any) => {
          console.log('ERROR:', err);
          alert('API Error');
        }
      });




  }
  getBankBranchName(pbankid: any) {

    let data = this.banklist.filter((bank: { pbankid: any }) => {
      return bank.pbankid == pbankid;
    });
    this.paymentVoucherForm['controls']['pbranchname'].setValue(data[0].pbranchname);
    this.setBalances('BANKBOOK', data[0].pbankbalance);
    this.setBalances('PASSBOOK', data[0].pbankpassbookbalance);
  }

  tdsSection_Change($event: any): void {

    const ptdssection = $event.target.value;
    this.tdspercentagelist = [];
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsPercentage'].setValue('');
    this.paymentVoucherForm.get('ppaymentsslistcontrols.pTdsPercentage')?.setValue('');
    if (ptdssection && ptdssection != '') {

      this.gettdsPercentage(ptdssection);

    }
    this.GetValidationByControl(this.paymentVoucherForm, 'pTdsSection', true);
  }
  gettdsPercentage(ptdssection: any) {

    this.tdspercentagelist = this.tdslist.filter((tds: { pTdsSection: any }) => {
      return tds.pTdsSection == ptdssection;
    });
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

    const paymentControls = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

    paymentControls.get('pigstpercentage')?.setValue('');
    paymentControls.get('pcgstpercentage')?.setValue('');
    paymentControls.get('psgstpercentage')?.setValue('');
    paymentControls.get('putgstpercentage')?.setValue('');

    if (gstpercentage && gstpercentage != '') {

      this.getgstPercentage(gstpercentage);

    }
    this.GetValidationByControl(this.paymentVoucherForm, 'pgstpercentage', true);
    this.GetValidationByControl(this.paymentVoucherForm, 'pgstamount', true);
  }
  getgstPercentage(gstpercentage: any) {

    let data = this.gstlist.filter((tds: { pgstpercentage: any }) => {
      return tds.pgstpercentage == gstpercentage;
    });


    const paymentControls = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

    paymentControls.get('pigstpercentage')?.setValue(data[0].pigstpercentage);
    paymentControls.get('pcgstpercentage')?.setValue(data[0].pcgstpercentage);
    paymentControls.get('psgstpercentage')?.setValue(data[0].psgstpercentage);
    paymentControls.get('putgstpercentage')?.setValue(data[0].putgstpercentage);



    // const gstFields = ['pigstpercentage','pcgstpercentage','psgstpercentage','putgstpercentage'];

    // gstFields.forEach(field => {
    //   paymentControls.get(field)?.setValue(data[0][field]);
    // });


    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pigstpercentage'].setValue(data[0].pigstpercentage);
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pcgstpercentage'].setValue(data[0].pcgstpercentage);
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['psgstpercentage'].setValue(data[0].psgstpercentage);
    // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['putgstpercentage'].setValue(data[0].putgstpercentage);
    this.claculategsttdsamounts();

  }

  // partyName_Change($event: any): void {

  //   let ppartyid;
  //   if ($event != undefined) {
  //     ppartyid = $event.ppartyid;
  //   }
  //   this.statelist = [];
  //   this.tdssectionlist = [];
  //   this.tdspercentagelist = [];
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pStateId'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pState'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsSection'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pTdsPercentage'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyreferenceid'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyreftype'].setValue('');
  //   this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartypannumber'].setValue('');
  //   this.partyBalance = this.currencySymbol + ' 0.00' + ' Dr';
  //   if (ppartyid && ppartyid != '') {
  //     //const ledgername = $event.target.options[$event.target.selectedIndex].text;
  //     //this.getPartyDetailsbyid(ppartyid);
  //     //this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['ppartyname'].setValue(ledgername);
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

    const ppartyid = $event?.ppartyid;

    this.statelist = [];
    this.tdssectionlist = [];
    this.tdspercentagelist = [];

    const paymentControls = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

    // Reset controls safely
    ['pStateId', 'pState', 'pTdsSection', 'pTdsPercentage',
      'ppartyreferenceid', 'ppartyreftype', 'ppartypannumber'].forEach(field => {
        paymentControls.get(field)?.setValue('');
      });

    this.partyBalance = `${this.currencySymbol} 0.00 Dr`;

    if (ppartyid) {
      const partynamename = $event.ppartyname;
      paymentControls.get('ppartyname')?.setValue(partynamename);

      const data = this.partylist.find((x: any) => x.ppartyid === ppartyid);

      paymentControls.get('ppartyreferenceid')?.setValue(data?.ppartyreferenceid ?? '');
      paymentControls.get('ppartyreftype')?.setValue(data?.ppartyreftype ?? '');
      paymentControls.get('ppartypannumber')?.setValue(data?.ppartypannumber ?? '');

      this.getPartyDetailsbyid(ppartyid, partynamename);
      this.setenableordisabletdsgst(partynamename, 'PARTYCHANGE');

    } else {
      this.setBalances('PARTY', 0);
      paymentControls.get('ppartyname')?.setValue('');
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

    const paymentControls = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

    // Reset GST/TDS flags
    paymentControls.get('pistdsapplicable')?.setValue(false);
    paymentControls.get('pisgstapplicable')?.setValue(false);

    const data = this.paymentslist.find((x: any) => x.ppartyname === ppartyname);

    if (data) {
      this.disablegst = true;
      this.disabletds = true;

      paymentControls.get('pistdsapplicable')?.setValue(data.pistdsapplicable);
      paymentControls.get('pisgstapplicable')?.setValue(data.pisgstapplicable);
      paymentControls.get('pgstcalculationtype')?.setValue(data.pgstcalculationtype);
      paymentControls.get('ptdscalculationtype')?.setValue(data.ptdscalculationtype);

    } else {
      this.disablegst = false;
      this.disabletds = false;
    }

    if (changetype === 'PARTYCHANGE') {
      this.isgstapplicableChange();
      this.istdsapplicableChange();
    }
  }

  // getPartyDetailsbyid(ppartyid, partynamename) {

  //   this._AccountingTransactionsService.getPartyDetailsbyid(ppartyid).subscribe(json => {

  //     //console.log(json)
  //     if (json != null) {

  //       this.tdslist = json.lstTdsSectionDetails;
  //       let newdata = json.lstTdsSectionDetails.map(item => item.pTdsSection)
  //         .filter((value, index, self) => self.indexOf(value) === index)
  //       for (let i = 0; i < newdata.length; i++) {
  //         let object = { pTdsSection: newdata[i] }
  //         this.tdssectionlist.push(object);
  //       }
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
  getPartyDetailsbyid(ppartyid: string, partynamename: string): void {
    this._AccountingTransactionsService.getPartyDetailsbyid(ppartyid).subscribe(
      (json: any) => {
        if (!json) return;

        // Reset lists
        this.tdslist = json.lstTdsSectionDetails || [];
        this.tdssectionlist = [];
        this.statelist = json.statelist || [];

        // Get unique TDS sections
        const uniqueTdsSections = Array.from(
          new Set(this.tdslist.map((item: any) => item.pTdsSection))
        );

        // Push unique sections to tdssectionlist
        this.tdssectionlist = uniqueTdsSections.map(section => ({ pTdsSection: section }));

        // Update balances and recalculate GST/TDS
        this.setBalances('PARTY', json.accountbalance ?? 0);
        this.claculategsttdsamounts();
      },
      (error: any) => {
        this._commonService.showErrorMessage(error);
      }
    );
  }

  gsno_change() {
    this.GetValidationByControl(this.paymentVoucherForm, 'pgstno', true);
  }
  state_change($event: any) {

    const pstateid = $event.target.value;
    //this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgstpercentage'].setValue('');
    if (pstateid && pstateid != '') {


      const statename = $event.target.options[$event.target.selectedIndex].text;
      // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pState'].setValue(statename);
      this.paymentVoucherForm.get('ppaymentsslistcontrols.pState')?.setValue(statename);
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

      this.paymentVoucherForm.get('ppaymentsslistcontrols.pgsttype')?.setValue(data.pgsttype);
      // this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pgsttype'].setValue(data.pgsttype);
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
      this.paymentVoucherForm.get('ppaymentsslistcontrols.pState')?.setValue('');
    }
    this.GetValidationByControl(this.paymentVoucherForm, 'pState', true);
    this.formValidationMessages['pigstpercentage'] = '';
    this.claculategsttdsamounts();
  }
  GetStatedetailsbyId(pstateid: any): any {
    // return (this.statelist.filter( (tds:{pStateId:any}) =>{
    //   return tds.pStateId == pstateid;
    // }))[0];

    return this.statelist.find((tds: any) => tds.pStateId === pstateid);

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

  claculategsttdsamounts() {
    try {
      const paymentControls = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

      // Get paid amount based on type
      let paidamountStr = this.amounttype === 'Debit'
        ? paymentControls.get('pdebitamount')?.value
        : paymentControls.get('pcreditamount')?.value;

      // Convert to number safely
      let paidamount = paidamountStr ? parseFloat(paidamountStr.toString().replace(/,/g, "")) : 0;

      if (isNaN(paidamount)) paidamount = 0;

      let actualpaidamount = paidamount;

      // GST details
      const isgstapplicable = paymentControls.get('pisgstapplicable')?.value ?? false;
      const gsttype = paymentControls.get('pgsttype')?.value ?? '';
      const gstcalculationtype = paymentControls.get('pgstcalculationtype')?.value ?? '';

      // GST percentages
      const igstpercentage = parseFloat(paymentControls.get('pigstpercentage')?.value ?? '0');
      const cgstpercentage = parseFloat(paymentControls.get('pcgstpercentage')?.value ?? '0');
      const sgstpercentage = parseFloat(paymentControls.get('psgstpercentage')?.value ?? '0');
      const utgstpercentage = parseFloat(paymentControls.get('putgstpercentage')?.value ?? '0');

      // GST amounts
      let gstamount = 0, igstamount = 0, cgstamount = 0, sgstamount = 0, utgstamount = 0;

      if (isgstapplicable) {
        if (gstcalculationtype === 'INCLUDE') {
          if (gsttype === 'IGST') {
            igstamount = Math.round((paidamount * igstpercentage) / (100 + igstpercentage));
            actualpaidamount -= igstamount;
            gstamount = igstamount;
          } else if (gsttype === 'CGST,SGST') {
            cgstamount = Math.round((paidamount * cgstpercentage) / (100 + igstpercentage));
            sgstamount = Math.round((paidamount * sgstpercentage) / (100 + igstpercentage));
            actualpaidamount -= (cgstamount + sgstamount);
            gstamount = cgstamount + sgstamount;
          } else if (gsttype === 'CGST,UTGST') {
            cgstamount = Math.round((paidamount * cgstpercentage) / (100 + igstpercentage));
            utgstamount = Math.round((paidamount * utgstpercentage) / (100 + igstpercentage));
            actualpaidamount -= (cgstamount + utgstamount);
            gstamount = cgstamount + utgstamount;
          }
        } else if (gstcalculationtype === 'EXCLUDE') {
          if (gsttype === 'IGST') igstamount = Math.round((paidamount * igstpercentage) / 100);
          if (gsttype === 'CGST,SGST') {
            cgstamount = Math.round((paidamount * cgstpercentage) / 100);
            sgstamount = Math.round((paidamount * sgstpercentage) / 100);
          }
          if (gsttype === 'CGST,UTGST') {
            cgstamount = Math.round((paidamount * cgstpercentage) / 100);
            utgstamount = Math.round((paidamount * utgstpercentage) / 100);
          }
          gstamount = igstamount + cgstamount + sgstamount + utgstamount;
        }
      }

      // TDS details
      const istdsapplicable = paymentControls.get('pistdsapplicable')?.value ?? false;
      const tdscalculationtype = paymentControls.get('ptdscalculationtype')?.value ?? '';
      let tdspercentage = parseFloat(paymentControls.get('pTdsPercentage')?.value?.toString().replace(/,/g, '') ?? '0');
      if (isNaN(tdspercentage)) tdspercentage = 0;

      let tdsamount = 0;

      if (istdsapplicable) {
        if (tdscalculationtype === 'INCLUDE') {
          tdsamount = Math.round((gstcalculationtype === 'INCLUDE' ? actualpaidamount : paidamount) * tdspercentage / (100 + tdspercentage));
          actualpaidamount -= tdsamount;
        } else if (tdscalculationtype === 'EXCLUDE') {
          tdsamount = Math.round(paidamount * tdspercentage / 100);
        }
      }

      const totalamount = actualpaidamount + igstamount + cgstamount + sgstamount + utgstamount + tdsamount;

      // Set all amounts safely
      const amountFields = {
        pamount: actualpaidamount > 0 ? actualpaidamount : '',
        pgstamount: gstamount,
        pigstamount: igstamount,
        pcgstamount: cgstamount,
        psgstamount: sgstamount,
        putgstamount: utgstamount,
        ptdsamount: tdsamount,
        ptotalamount: totalamount,
        ptotaldebitamount: this.amounttype === 'Debit' ? totalamount : undefined,
        ptotalcreditamount: this.amounttype === 'Credit' ? totalamount : undefined
      };

      Object.entries(amountFields).forEach(([key, value]) => {
        if (value !== undefined) paymentControls.get(key)?.setValue(value);
      });

      this.formValidationMessages['pamount'] = '';

    } catch (e) {
      this._commonService.showErrorMessage(e);
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
        this._commonService.showWarningMessage('Ledgername, Party name  already exists in grid');
        isValid = false;
      }
    } catch (e) {
      this._commonService.showErrorMessage(e);
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

  //     let amount = this._commonService.removeCommasInAmount(this.paymentVoucherForm['controls']['ppaymentsslistcontrols']['controls']['pamount'].value);


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

  //     this._AccountingTransactionsService.GetSubLedgerRestrictedStatus(subcategoryid).subscribe(res => {
  //       debugger;
  //       let creditstatus = res[0].credit_restriction_status;
  //       let debitstatus = res[0].debit_restriction_status;
  //       if ((debitamount > 0 && debitstatus == false) || (creditamount > 0 && creditstatus == false)) {

  //         this._SubscriberJVService.GetdebitchitCheckbalance(accounthedadid, "", subcategoryid).subscribe(result => {
  //           debugger;
  //           this.debittotalamount = 0;
  //           this.credittotalamount = 0;

  //           if (amount <= parseFloat(result['balanceamount'].toString()) && Boolean(result['balancecheckstatus'].toString()) || amount <= parseFloat(result['balanceamount'].toString()) || ((result['balancecheckstatus'].toString())) == 'false') {
  //             //ADDED ON 19.05.2023
  //             //if (amount <= parseFloat(result['balanceamount'].toString()) || Boolean(result['balancecheckstatus'].toString())) {
  //             //this.paymentslist.push(control.value);
  //             let data = control.value;
  //             this.paymentslist = [...this.paymentslist, data]
  //             this.paymentslist.filter(data => {
  //               if (data.ptotalcreditamount != "") {
  //                 data.ptotalcreditamount = this._commonService.removeCommasForEntredNumber(data.ptotalcreditamount);
  //                 data.ptotalcreditamount = parseFloat(data.ptotalcreditamount);
  //                 this.credittotalamount = this.credittotalamount + data.ptotalcreditamount;
  //                 //this.credittotalamount = parseFloat(this.paymentslist.reduce((sum, c) => sum + c.ptotalcreditamount, 0));
  //               }
  //               if (data.ptotaldebitamount != "") {
  //                 data.ptotaldebitamount = this._commonService.removeCommasForEntredNumber(data.ptotaldebitamount);
  //                 data.ptotaldebitamount = parseFloat(data.ptotaldebitamount);
  //                 //this.debittotalamount = parseFloat(this.paymentslist.reduce((sum, c) => sum + c.ptotaldebitamount, 0));
  //                 this.debittotalamount = this.debittotalamount + data.ptotaldebitamount;
  //               }
  //             })
  //             console.log("Total Debit amount is:" + this.debittotalamount);
  //             console.log("Total credit amount is:" + this.credittotalamount);
  //             this.getpartyJournalEntryData();
  //             this.clearPaymentDetails1();
  //             this.getPaymentListColumnWisetotals();
  //             this.disableamounttype('');
  //             this.validateDebitCreditAmounts();
  //             this.showhidegrid = true;
  //           }
  //           else {
  //             this._commonService.showWarningMessage("Insufficient balance ");
  //           }
  //         })
  //       }
  //       else {

  //         if (debitamount > 0) {
  //           this._commonService.showWarningMessage("Debit Transaction Not Allowed ");

  //         }

  //         if (creditamount > 0) {
  //           this._commonService.showWarningMessage("Credit Transaction Not Allowed ");

  //         }

  //       }

  //     })
  //   }
  //   else {
  //     this.showhidegrid = false;
  //   }
  // }

  addPaymentDetails() {
    debugger;
    const paymentControls = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

    if (!this.validateaddPaymentDetails()) {
      this.showhidegrid = false;
      return;
    }

    const ledgerId = paymentControls.get('pledgerid')?.value;
    const subledgerId = paymentControls.get('psubledgerid')?.value;

    // Clean amount
    let amount = this._commonService.removeCommasInAmount(paymentControls.get('pamount')?.value) || 0;

    // Ensure numeric fields have defaults
    const numericFields: string[] = ['pStateId', 'pTdsPercentage', 'pgstpercentage'];
    numericFields.forEach(field => {
      const val = paymentControls.get(field)?.value;
      if (val === '' || val == null) paymentControls.get(field)?.setValue(0);
    });

    ['ptotaldebitamount', 'ptotalcreditamount'].forEach(field => {
      const val = paymentControls.get(field)?.value;
      if (val === '' || val == null || val === 0) paymentControls.get(field)?.setValue('');
    });

    const debitAmount = parseFloat(paymentControls.get('ptotaldebitamount')?.value || '0');
    const creditAmount = parseFloat(paymentControls.get('ptotalcreditamount')?.value || '0');

    // Check subledger restrictions
    this._AccountingTransactionsService.GetSubLedgerRestrictedStatus(subledgerId).subscribe(res => {
      const { credit_restriction_status, debit_restriction_status } = res[0];

      if ((debitAmount > 0 && !debit_restriction_status) || (creditAmount > 0 && !credit_restriction_status)) {
        this._SubscriberJVService.GetdebitchitCheckbalance(ledgerId, '', subledgerId).subscribe(result => {
          debugger;

          this.debittotalamount = 0;
          this.credittotalamount = 0;

          const balanceAmount = parseFloat(result.balanceamount?.toString() || '0');
          const balanceCheckStatus = result.balancecheckstatus?.toString() !== 'false';
          const numericAmount = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;

          if (numericAmount <= balanceAmount && balanceCheckStatus) {



            // if (amount <= balanceAmount && balanceCheckStatus) {
            // Add payment
            const data = paymentControls.value;
            this.paymentslist = [...this.paymentslist, data];

            // Calculate totals
            this.debittotalamount = this.paymentslist
              .reduce((sum: any, item: any) => sum + parseFloat(this._commonService.removeCommasForEntredNumber(item.ptotaldebitamount) || '0'), 0);

            this.credittotalamount = this.paymentslist
              .reduce((sum: any, item: any) => sum + parseFloat(this._commonService.removeCommasForEntredNumber(item.ptotalcreditamount) || '0'), 0);

            console.log("Total Debit amount:", this.debittotalamount);
            console.log("Total Credit amount:", this.credittotalamount);

            this.getpartyJournalEntryData();
            this.clearPaymentDetails1();
            this.getPaymentListColumnWisetotals();
            this.disableamounttype('');
            this.validateDebitCreditAmounts();
            this.showhidegrid = true;

          } else {
            this._commonService.showWarningMessage("Insufficient balance");
          }
        });
      } else {
        if (debitAmount > 0) this._commonService.showWarningMessage("Debit Transaction Not Allowed");
        if (creditAmount > 0) this._commonService.showWarningMessage("Credit Transaction Not Allowed");
      }
    });
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

    this.paymentslist.reduce((acc: any, item: any) => {
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


    let totalamount = this.paymentslist.reduce((sum: any, c: any) => sum + (this._commonService.removeCommasInAmount(c.pamount)), 0);
    this.paymentlistcolumnwiselist['pamount'] = (totalamount);


    totalamount = this.paymentslist.reduce((sum: any, c: any) => sum + (this._commonService.removeCommasInAmount(c.pgstamount)), 0);
    this.paymentlistcolumnwiselist['pgstamount'] = (totalamount);

    totalamount = this.paymentslist.reduce((sum: any, c: any) => sum + (this._commonService.removeCommasInAmount(c.ptdsamount)), 0);
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
    const paymentControls = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

    // Reset the form group
    paymentControls.reset();

    // Always reset GST/TDS flags
    ['pistdsapplicable', 'pisgstapplicable'].forEach(field => {
      paymentControls.get(field)?.setValue(false);
    });

    const fieldsToClear = [
      'pledgerid',
      'psubledgerid',
      'ppartyid',
      'pStateId',
      'pgstpercentage',
      'pTdsSection',
      'pTdsPercentage'
    ];

    fieldsToClear.forEach(field => {
      const control = paymentControls.get(field);
      if (control) {
        control.setValue(field.includes('id') ? null : '');
      }
    });

    // Reset balances
    this.setBalances('LEDGER', 0);
    this.setBalances('SUBLEDGER', 0);
    this.setBalances('PARTY', 0);

    // Trigger GST/TDS changes to update validators
    this.isgstapplicableChange();
    this.istdsapplicableChange();

    // Clear validation messages
    this.formValidationMessages = {};

    // Optionally, reset date if needed
    // this.paymentVoucherForm.get('pjvdate')?.setValue(new Date());

    // Reset any other UI flags
    this.showsubledger = true;
  }



  // clearPaymentDetails1() {

  //   const formControl = <FormGroup>this.paymentVoucherForm['controls']['ppaymentsslistcontrols'];
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
    const paymentControls = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

    // Reset GST/TDS flags
    paymentControls.get('pistdsapplicable')?.setValue(false);
    paymentControls.get('pisgstapplicable')?.setValue(false);

    // Reset specific fields (without ledger)
    const fieldsToClear = [
      'psubledgerid',
      'ppartyid',
      'pStateId',
      'pgstpercentage',
      'pTdsSection',
      'pTdsPercentage',
      'pdebitamount',
      'pcreditamount'
    ];

    fieldsToClear.forEach(field => {
      const control = paymentControls.get(field);
      if (control) {
        control.setValue(field.includes('id') ? null : '');
      }
    });

    // Reset balances except ledger
    this.setBalances('SUBLEDGER', 0);
    this.setBalances('PARTY', 0);

    // Trigger GST/TDS validator updates
    this.isgstapplicableChange();
    this.istdsapplicableChange();

    // Reset UI flags
    this.showsubledger = true;

    // Clear validation messages
    this.formValidationMessages = {};
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
      this._commonService.showErrorMessage(e);
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
      this.paymentVoucherForm['controls']['schemaname'].setValue(this._commonService.getschemaname());
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
      this._commonService.showErrorMessage(e);
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
        this.paymentVoucherForm['controls']['pCreatedby'].setValue(this._commonService.pCreatedby);
        this.paymentVoucherForm.controls['pipaddress'].setValue(this._commonService.getIpAddress())
        this.paymentVoucherForm.controls['schemaname'].setValue(this._commonService.getschemaname())
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
        let totaladebitmount = Number(parseFloat(this.paymentslist.reduce((sum: any, item: any) => sum + Number(item.ptotaldebitamount), 0)).toFixed(2));
        let totalacreditmount = Number(parseFloat(this.paymentslist.reduce((sum: any, item: any) => sum + Number(item.ptotalcreditamount), 0)).toFixed(2));
        // added on 05-03-2025 by Uday for vijayanagar issue end


        //let debittotalamount = this.paymentslist.reduce((sum, c) => (isNullOrEmptyString(sum) ? 0 : isNaN(sum) ? 0 : sum) + parseFloat((c.ptotaldebitamount).replace(/,/g, "")), 0)
        //let credittotalamount = this.paymentslist.reduce((sum, c) => (isNullOrEmptyString(sum) ? 0 : isNaN(sum) ? 0 : sum) + parseFloat((c.ptotalcreditamount).replace(/,/g, "")), 0)
        if (totaladebitmount != totalacreditmount) {
          this._commonService.showWarningMessage("Total Debit amount and Credit amount mismatch.");
          this.disablesavebutton = false;
          this.savebutton = 'Save';
        }
        else {
          let newdata = { pJournalVoucherlist: this.paymentslist };
          let paymentVoucherdata = Object.assign(this.paymentVoucherForm.value, newdata);
          paymentVoucherdata.pjvdate = this._commonService.getFormatDateNormal(paymentVoucherdata.pjvdate);
          let data = JSON.stringify(paymentVoucherdata);
          console.log(data);
          this._AccountingTransactionsService.saveJournalVoucher(data).subscribe((res: any) => {

            //if (res) {
            //  this._commonService.showInfoMessage("Saved sucessfully");
            // // this.clearPaymentVoucher();
            //  this._routes.navigate(['/JournalvoucherView'])
            //}
            if (res[0] == 'TRUE') {
              //this.JSONdataItem = res;
              this.disablesavebutton = false;
              this.savebutton = 'Save';
              this._commonService.showInfoMessage("Saved sucessfully");
              this.clearPaymentVoucher();
              // this._routes.navigate(['/JournalvoucherView']);
              //this._routes.navigate(['/Transactions/JournalVoucherView']);
              //this.router.navigate(['/Transactions/JournalVoucherView']);
              debugger;
              //window.open('/#/Reports/JournalVoucherReport?id=' + btoa(res[1] + ',' + 'Journal Voucher'));
              let receipt = btoa(res[1] + ',' + 'Journal Voucher');
              // this.router.navigate(['/Reports/JournalVoucherReport', receipt]);
              window.open('/#/JournalVoucherReport?id=' + receipt + '', "_blank");
            }

          },
            (error: any) => {
              //this.isLoading = false;
              this._commonService.showErrorMessage(error);
              this.disablesavebutton = false;
              this.savebutton = 'Save';
            });
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
  // disableamounttype(Amounttype:any) {


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


  disableamounttype(Amounttype: any) {
    const paymentControls = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
    const debitControl = paymentControls.get('pdebitamount') as FormControl;
    const creditControl = paymentControls.get('pcreditamount') as FormControl;
    const transtypeControl = paymentControls.get('ptranstype');
    const amountControl = paymentControls.get('pamount');

    const debitamount = debitControl.value;
    const creditamount = creditControl.value;

    if (!isNullOrEmptyString(debitamount)) {
      this.amounttype = Amounttype;
      this.readonlydebit = false;
      this.readonlycredit = true;

      transtypeControl?.setValue('Debit');
      amountControl?.setValue(debitamount);

      creditControl.clearValidators();
      creditControl.updateValueAndValidity();
      this.formValidationMessages['pcreditamount'] = '';

    } else if (!isNullOrEmptyString(creditamount)) {
      this.amounttype = Amounttype;
      this.readonlydebit = true;
      this.readonlycredit = false;

      transtypeControl?.setValue('Credit');
      amountControl?.setValue(creditamount);

      debitControl.clearValidators();
      debitControl.updateValueAndValidity();
      this.formValidationMessages['pdebitamount'] = '';

    } else {
      this.readonlydebit = false;
      this.readonlycredit = false;

      transtypeControl?.setValue('');
      amountControl?.setValue('');

      debitControl.setValidators([Validators.required]);
      debitControl.updateValueAndValidity();

      creditControl.setValidators([Validators.required]);
      creditControl.updateValueAndValidity();
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

  validateDebitCreditAmounts() {
    try {
      const paymentControls = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
      const debitControl = paymentControls.get('pdebitamount') as FormControl;
      const creditControl = paymentControls.get('pcreditamount') as FormControl;

      let debitCount = 0;
      let creditCount = 0;

      for (const item of this.paymentslist) {
        if (!isNullOrEmptyString(item.pdebitamount)) debitCount++;
        if (!isNullOrEmptyString(item.pcreditamount)) creditCount++;
      }

      if (debitCount > 1 && creditCount === 1) {
        this.readonlydebit = false;
        this.readonlycredit = true;
        creditControl.clearValidators();
        creditControl.updateValueAndValidity();
      }
      else if (creditCount > 1 && debitCount === 1) {
        this.readonlydebit = true;
        this.readonlycredit = false;
        debitControl.clearValidators();
        debitControl.updateValueAndValidity();
      }
      else {
        this.readonlydebit = false;
        this.readonlycredit = false;
      }
    } catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }




  public removeHandler(row: any, rowIndex: any) {
    debugger;
    this.credittotalamount = 0;
    this.debittotalamount = 0;
    //const index: number = this.paymentslist.indexOf(dataItem);
    const index: number = rowIndex;
    if (index !== -1) {
      this.paymentslist.splice(index, 1);
      this.paymentslist = [...this.paymentslist];
      this.paymentslist.filter((data: any) => {
        if (data.ptotalcreditamount != "") {
          data.ptotalcreditamount = this._commonService.removeCommasForEntredNumber(data.ptotalcreditamount);
          data.ptotalcreditamount = parseFloat(data.ptotalcreditamount);
          this.credittotalamount = this.credittotalamount + data.ptotalcreditamount;
          //this.credittotalamount = parseFloat(this.paymentslist.reduce((sub, c) => sub + c.ptotalcreditamount, 0));
        }
        if (data.ptotaldebitamount != "") {
          data.ptotaldebitamount = this._commonService.removeCommasForEntredNumber(data.ptotaldebitamount);
          data.ptotaldebitamount = parseFloat(data.ptotaldebitamount);
          //this.debittotalamount = parseFloat(this.paymentslist.reduce((sub, c) => sub + c.ptotaldebitamount, 0));
          this.debittotalamount = this.debittotalamount + data.ptotaldebitamount;
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
  uploadAndProgress(event: any, files: any) {
    var extention = event.target.value.substring(event.target.value.lastIndexOf('.') + 1);
    if (!this.validateFile(event.target.value)) {
      this._commonService.showWarningMessage("Upload jpg or png or jpeg files");
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
        formData.append('NewFileName', 'Journal Voucher' + '.' + files[i]["name"].split('.').pop());
      }
      // size = size / 1024;
      size = size / 1024
      this._commonService.fileUploadS3("Account", formData).subscribe((data: any) => {
        if (extention.toLowerCase() == 'pdf') {
          this.imageResponse.name = data[0];
          this.kycFileName = data[0];
          // this.kycFilePath = data[0];
        }
        else {
          this.kycFileName = data[0];
          this.imageResponse.name = data[0];
          let kycFilePath = data[0];
          let Filepath = this.kycFileName.split(".");
        }
        this.paymentVoucherForm.controls['pFilename'].setValue(this.kycFileName);
        // this.paymentVoucherForm.controls.pFileformat.setValue(kycFilePath);
        // this.paymentVoucherForm.controls.pFilepath.setValue(Filepath[1]);
      })
    }
  }

  /*
  *Validating the type of file uploaded
  */
  validateFile(fileName: any): any {
    try {
      debugger
      if (fileName == undefined || fileName == "") {
        return true
      }
      else {
        var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
        if (ext.toLowerCase() == 'jpg' || ext.toLowerCase() == 'png' || ext.toLowerCase() == 'jpeg') {

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

}

function isNullOrEmptyString(value: any): boolean {
  return value === null || value === undefined || value === '';
}
