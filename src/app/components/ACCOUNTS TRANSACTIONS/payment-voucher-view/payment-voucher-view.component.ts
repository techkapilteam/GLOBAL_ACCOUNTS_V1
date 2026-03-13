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
import { ValidationMessageComponent } from 'src/app/common/validation-message/validation-message.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-payment-voucher-view',
  templateUrl: './payment-voucher-view.component.html',
  imports: [CommonModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    BsDatepickerModule,
    CurrencyPipe,
    NgSelectModule,
    TableModule, ValidationMessageComponent, ButtonModule
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
  subledgeraccountslist: any[] = [];
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
  paymentslist: any[] = [];
  paymentslist1: any[] = [];
  gridView1: any;
  cashBalance: any;

  bankBalance: any; cashRestrictAmount: any;
  bankexists!: boolean;
  groups: any[] = [];
  bankbookBalance: any;
  bankbarnchdummy: any;
  psubledgerid1: any;

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
    this.paymentVoucherForm
      .get('ppaymentsslistcontrols.pgstcalculationtype')
      ?.valueChanges.subscribe(() => {
        this.claculategsttdsamounts();
      });

  }
  addppaymentsslistcontrols(): FormGroup {
    return this._FormBuilder.group({

      psubledgerid: [null],
      // psubledgername: [this.psubledgerid1],
      psubledgername: [''],
      // psubledgername: [''],
      // pledgerid: [null],
      pledgerid: [null, Validators.required],

      pledgername: ['', Validators.required],
      pamount: [''],
      pactualpaidamount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      // pactualpaidamount: ['', Validators.required],
      pgsttype: [''],
      pisgstapplicable: [false],
      // pisgstapplicable: [false, Validators.required],
      pgstcalculationtype: [''],
      pgstpercentage: [''],
      pgstamount: [''],
      pigstamount: [''],
      pcgstamount: [''],
      psgstamount: [''],
      putgstamount: [''],
      ppartyname: ['', Validators.required],
      // ppartyid: [null],
      ppartyid: [null, Validators.required],
      ppartyreftype: [''],
      ppartyreferenceid: [''],
      ppartypannumber: [''],
      pistdsapplicable: [false],
      // pistdsapplicable: [false, Validators.required],
      pgstno: [''],
      // pgstno: new FormControl('', Validators.pattern(this.gstnopattern)),
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
        next: (json: any) => {
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
    const pbankid = $event.pbankid;
    const bankname = $event.pbankname;


    // this.paymentVoucherForm['controls']['pbankname'].setValue(bankname);
    // this.paymentVoucherForm['controls']['pbranchname'].setValue($event.pbranchname);

    this.upinameslist = [];
    this.chequenumberslist = [];
    this.paymentVoucherForm['controls']['pChequenumber'].setValue('');
    this.paymentVoucherForm['controls']['pUpiname'].setValue('');
    this.paymentVoucherForm['controls']['pUpiid'].setValue('');
    if (pbankid && pbankid != '') {
      // const bankname = $event.target.options[$event.target.selectedIndex].text;
      this.GetBankDetailsbyId(pbankid);
      this.getBankBranchName(pbankid);
      this.paymentVoucherForm['controls']['pbankname'].setValue(bankname);

    }
    else {

      this.paymentVoucherForm['controls']['pbankname'].setValue('');
    }

    this.GetValidationByControl(this.paymentVoucherForm, 'pbankname', true);
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
    debugger
    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');

    const pledgerid = $event?.pledgerid;

    // reset lists
    this.subledgeraccountslist = [];
    // this.paymentslist1 = [];
    this.partyjournalentrylist = [];
    //  this.paymentslist = [];

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


  GetSubLedgerData(pledgerid: any): void {
    debugger

    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');

    this._AccountingTransactionsService
      .GetSubLedgerData3(pledgerid,
        this._commonService.getbranchname(),
        this._commonService.getCompanyCode(),
        this._commonService.getbranchname(),
        this._commonService.getBranchCode(),
        this._commonService.getschemaname()

      )
      .subscribe(
        {
          next: (json: any) => {

            if (!json) {
              return;
            }


            this.subledgeraccountslist = json.map((item: any) => ({
              subledgername: item.psubledgername,
              subledgerid: item.psubledgerid,
              accountbalance: item.accountbalance

            }));
            console.log('subledgeraccountslist :', this.subledgeraccountslist);
            const subLedgerControl = group?.get('psubledgername');
            // const subLedgerControl = this.psubledgerid1;

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



  subledger_Change($event: any): void {
    debugger
    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');

    // const psubledgerid = $event?.psubledgerid;
    const psubledgerid = $event.subledgerid;
    // this.psubledgerid1 = $event?.psubledgerid;

    this.subledgerBalance = '';

    if (psubledgerid) {

      // const subledgername = $event.psubledgername;

      // group?.get('psubledgername')?.setValue(subledgername);
      group?.get('psubledgerid')?.setValue(psubledgerid);

      // const data = this.subledgeraccountslist.find(
      //   (ledger: { psubledgerid: any; accountbalance: number }) =>
      //     ledger.psubledgerid === psubledgerid
      // );
      const data = this.subledgeraccountslist.find(
        (ledger: any) => ledger.subledgerid === psubledgerid
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



  getBankBranchName(pbankid: any) {
    debugger
    const bank = this.banklist.find(
      (res: { pbankid: any }) => res.pbankid == pbankid
    );

    if (!bank) {
      console.warn('Bank not found for id:', pbankid);
      return;
    }

    this.paymentVoucherForm.controls['pbranchname'].setValue(bank.pbranchname);
    this.setBalances('BANKBOOK', bank.pbankbalance);
    this.setBalances('PASSBOOK', bank.pbankpassbookbalance);
  }



  tdsSection_Change(event: any): void {
    debugger
    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');
    // const ptdssection = $event?.target?.value;
    const ptdssection = event.pTdsSection;

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
    debugger
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

  //   const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');
  //   const gstpercentage = $event?.target?.value;

  //   // reset GST percentage fields
  //   group?.get('pigstpercentage')?.setValue('');
  //   group?.get('pcgstpercentage')?.setValue('');
  //   group?.get('psgstpercentage')?.setValue('');
  //   group?.get('putgstpercentage')?.setValue('');

  //   if (gstpercentage) {
  //     this.getgstPercentage(gstpercentage);
  //   }

  //   this.GetValidationByControl(this.paymentVoucherForm, 'pgstpercentage', true);
  //   this.GetValidationByControl(this.paymentVoucherForm, 'pgstamount', true);
  // }
  gst_Change($event: any): void {

    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');
    const gstpercentage = $event;

    // Reset GST percentage split fields
    group?.get('pigstpercentage')?.setValue('');
    group?.get('pcgstpercentage')?.setValue('');
    group?.get('psgstpercentage')?.setValue('');
    group?.get('putgstpercentage')?.setValue('');

    if (gstpercentage) {
      this.getgstPercentage(gstpercentage);
      this.claculategsttdsamounts();
    }
    else {
      const gstFields = [
        'pgstamount',
        'pigstamount',
        'pcgstamount',
        'psgstamount',
        'putgstamount',
        'pamount',
        'ptotalamount'
      ];

      gstFields.forEach(field => {
        group?.get(field)?.setValue(null);
      });
    }

    this.GetValidationByControl(this.paymentVoucherForm, 'pgstpercentage', true);
    this.GetValidationByControl(this.paymentVoucherForm, 'pgstamount', true);
  }

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




  partyName_Change($event: any): void {
    debugger
    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');
    const ppartyid = $event?.ppartyid;

    // reset everything
    this.availableAmount = 0;
    this.statelist = [];
    this.tdssectionlist = [];
    this.tdspercentagelist = [];
    //  this.paymentslist1 = [];
    this.partyjournalentrylist = [];
    // this.paymentslist = [];
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
      .GetCashRestrictAmountpercontact1(
        'PAYMENT VOUCHER',
        'KGMS',
        this._commonService.getbranchname(),
        ppartyid,
        trans_date,
        this._commonService.getCompanyCode(),
        this._commonService.getschemaname(),
        this._commonService.getBranchCode()
      )
      .subscribe((amt: number) => {
        this.availableAmount = this.cashRestrictAmount - amt;
      });

    if (ppartyid) {

      const partynamename = $event.ppartyname;

      group?.get('ppartyname')?.setValue(partynamename);

      const data = this.partylist.find(
        (x: any) =>
          x.ppartyid === ppartyid
      );

      if (data) {
        group?.get('ppartyreferenceid')?.setValue(data.ppartyreferenceid);
        group?.get('ppartyreftype')?.setValue(data.ppartyreftype);
        // group?.get('ppartypannumber')?.setValue(data.ppartypannumber);
        group?.get('ppartypannumber')?.setValue(data.pan_no);
      }

      this.getPartyDetailsbyid(ppartyid, partynamename);
      this.setenableordisabletdsgst(partynamename, 'PARTYCHANGE');
      this.disablegst = false;

    } else {
      this.setBalances('PARTY', 0);
      group?.get('ppartyname')?.setValue('');
      this.disablegst = true;
    }
  }

  GetBankDetailsbyId(pbankid: any) {
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
            this.bankbarnchdummy = json.bank_branch
            // this.paymentVoucherForm['controls']['pbranchname'].setValue(this.bankbarnchdummy);
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



  setenableordisabletdsgst(ppartyname: any, changetype: string) {
    debugger

    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

    // reset
    group.patchValue({
      pistdsapplicable: false,
      pisgstapplicable: false,
      pgstcalculationtype: '',
      ptdscalculationtype: ''
    });

    // get matched array
    const matchedArray: any[] = this.paymentslist.filter((x: any) => x.ppartyname === ppartyname);

    // if array has an item
    if (matchedArray && matchedArray.length > 0) {
      const data = matchedArray[0]; // first match

      this.disablegst = true;
      this.disabletds = true;

      group.patchValue({
        pistdsapplicable: data.pistdsapplicable,
        pisgstapplicable: data.pisgstapplicable,
        pgstcalculationtype: data.pgstcalculationtype,
        ptdscalculationtype: data.ptdscalculationtype
      });

    } else {
      this.disablegst = false;
      this.disabletds = false;
    }

    if (changetype === 'PARTYCHANGE') {
      this.isgstapplicableChange();
      this.istdsapplicableChange();
    }
  }

  getPartyDetailsbyid(
    ppartyid: any,
    pStateId: any
  ): void {
    debugger

    this._AccountingTransactionsService
      .getPartyDetailsbyid(
        ppartyid,
        this._commonService.getbranchname(),
        this._commonService.getBranchCode(),
        this._commonService.getCompanyCode(),
        this._commonService.getschemaname(),
        'taxes'
      )
      .subscribe(
        (json: any) => {

          if (!json) return;

          // Clear previous data
          this.tdssectionlist = [];

          this.tdslist = json.lstTdsSectionDetails || [];

          // Extract unique TDS sections
          const uniqueSections =
            this.tdslist
              .map((item: any) => item.pTdsSection)
              .filter((value: any, index: number, self: any[]) =>
                self.indexOf(value) === index
              );

          this.tdssectionlist =
            uniqueSections.map((section: any) => ({
              pTdsSection: section
            }));

          this.statelist = json.statelist || [];

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



  gst_clear(): void {
    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');

    group?.get('pigstpercentage')?.setValue('');
    group?.get('pcgstpercentage')?.setValue('');
    group?.get('psgstpercentage')?.setValue('');
    group?.get('putgstpercentage')?.setValue('');
    group?.get('pgstpercentage')?.setValue('');
    group?.get('pgstno')?.setValue('');
  }



  state_change($event: any): void {
    debugger

    const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');
    const pstateid = $event.pStateId;
    const gst = $event.gstnumber;

    this.gst_clear();

    if (pstateid) {

      // get state name from selected option
      // const statename = $event.target.options[$event.target.selectedIndex]?.text;
      const statename = $event.pState;
      group?.get('pState')?.setValue(statename);

      // show/hide GST number based on state
      // const gstno = statename?.split('-')[1];
      // this.showgstno = !gstno;




      //  let gstno = statename.split('-')[1];
      //  let gstno = statename;
      if (gst) {
        //gstnoControl.clearValidators();
        this.showgstno = false;
      }
      else {
        this.showgstno = true;
        //gstnoControl.setValidators(Validators.required);
      }

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






  claculategsttdsamounts(): void {
    try {

      const group = this.paymentVoucherForm.get('ppaymentsslistcontrols');

      const safeNumber = (val: any): number =>
        parseFloat((val || '0').toString().replace(/,/g, '')) || 0;

      // =======================
      // Paid Amount
      // =======================
      let paidamount = safeNumber(group?.get('pactualpaidamount')?.value);
      let actualpaidamount = paidamount;

      // =======================
      // GST Details
      // =======================
      const isgstapplicable = group?.get('pisgstapplicable')?.value;
      const gsttype = group?.get('pgsttype')?.value;
      const gstcalculationtype = group?.get('pgstcalculationtype')?.value;
      let gstpercentage = safeNumber(group?.get('pgstpercentage')?.value);

      let gstamount = 0;
      let igstamount = 0;
      let cgstamount = 0;
      let sgstamount = 0;
      let utgstamount = 0;

      // if (isgstapplicable && gstpercentage > 0) {
      if (gstpercentage > 0) {

        if (gstcalculationtype === 'INCLUDE') {
          gstamount = parseFloat(
            ((paidamount * gstpercentage) / (100 + gstpercentage)).toFixed(2)
          );
          actualpaidamount = paidamount - gstamount;
        }

        else if (gstcalculationtype === 'EXCLUDE') {
          gstamount = parseFloat(
            ((paidamount * gstpercentage) / 100).toFixed(2)
          );
        }

        // Split GST
        if (gsttype === 'IGST') {
          igstamount = gstamount;
        }
        else if (gsttype === 'CGST,SGST') {
          cgstamount = parseFloat((gstamount / 2).toFixed(2));
          sgstamount = parseFloat((gstamount / 2).toFixed(2));
        }
        else if (gsttype === 'CGST,UTGST') {
          cgstamount = parseFloat((gstamount / 2).toFixed(2));
          utgstamount = parseFloat((gstamount / 2).toFixed(2));
        }
      }

      // =======================
      // TDS Details
      // =======================
      const istdsapplicable = group?.get('pistdsapplicable')?.value;
      const tdscalculationtype = group?.get('ptdscalculationtype')?.value;
      let tdspercentage = safeNumber(group?.get('pTdsPercentage')?.value);

      let tdsamount = 0;

      if (istdsapplicable && tdspercentage > 0) {

        if (tdscalculationtype === 'INCLUDE') {
          tdsamount = parseFloat(
            ((actualpaidamount * tdspercentage) / (100 + tdspercentage)).toFixed(2)
          );
          actualpaidamount -= tdsamount;
        }

        else if (tdscalculationtype === 'EXCLUDE') {
          tdsamount = parseFloat(
            ((actualpaidamount * tdspercentage) / 100).toFixed(2)
          );
          actualpaidamount -= tdsamount;
        }
      }

      // =======================
      // Final Totals
      // =======================
      const totalamount = parseFloat(
        (actualpaidamount + gstamount).toFixed(2)
      );

      // =======================
      // Update Form Controls
      // =======================
      group?.get('pamount')?.setValue(actualpaidamount > 0 ? actualpaidamount : '');
      group?.get('pgstamount')?.setValue(gstamount);
      group?.get('pigstamount')?.setValue(igstamount);
      group?.get('pcgstamount')?.setValue(cgstamount);
      group?.get('psgstamount')?.setValue(sgstamount);
      group?.get('putgstamount')?.setValue(utgstamount);
      group?.get('ptdsamount')?.setValue(tdsamount);
      group?.get('ptotalamount')?.setValue(totalamount);

      this.formValidationMessages['pamount'] = '';

    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }





  // validateaddPaymentDetails(currentRow?: any): boolean {
  //   debugger
  //   console.log("Validating row:", currentRow);  // Debugging
  //   let isValid = true;
  //   const group = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

  //   try {
  //     let verifyamount = group?.get('pactualpaidamount')?.value;
  //     if (verifyamount === 0) group?.get('pactualpaidamount')?.setValue('');

  //     isValid = this.checkValidations(group, isValid);

  //     const ledgername = group?.get('pledgername')?.value;
  //     const subledgerid = group?.get('psubledgerid')?.value;
  //     const selectedSubledger = this.subledgeraccountslist.find(
  //       (x: any) => x.subledgerid === subledgerid
  //     );
  //     const subledgername = selectedSubledger?.subledgername;
  //     const partyid = group?.get('ppartyid')?.value;

  //     const griddata = [...this.paymentslist];  // Make sure it's cloning correctly

  //     console.log("Grid data before validation:", griddata);  // Debugging

  //     let count = 0, fixed_count = 0, bank_count = 0;

  //     for (let i = 0; i < griddata.length; i++) {
  //       if (ledgername === "FIXED DEPOSIT RECEIPTS-CHITS" && griddata.length > 0) {
  //         count = fixed_count = 1;
  //         break;
  //       }

  //       if (griddata[i].pledgername === ledgername && griddata[i].psubledgername === subledgername && griddata[i].ppartyid === partyid) {
  //         count = 1;
  //         break;
  //       }

  //       for (let j = 0; j < this.banklist.length; j++) {
  //         if (this.banklist[j].paccountid === griddata[i].psubledgerid || this.banklist[j].paccountid === subledgerid) {
  //           count = bank_count = 1;
  //           break;
  //         }
  //       }
  //     }

  //     if (count === 1) {
  //       if (fixed_count === 1) this._commonService.showWarningMessage('Fixed deposit receipts accepts only one record in the grid');
  //       else if (bank_count === 1) this._commonService.showWarningMessage('Bank Accounts only one record in the grid');
  //       else this._commonService.showWarningMessage('Ledger, subledger and party already exists in the grid.');
  //       isValid = false;
  //     }

  //   } catch (e) {
  //     this._commonService.showErrorMessage(e);
  //   }

  //   return isValid;
  // }
  validateaddPaymentDetails(currentRow: any): boolean {
    let isValid = true;

    try {
      // Extract details from currentRow instead of form
      const ledgername = currentRow.pledgername;
      const subledgername = currentRow.psubledgername;
      const subledgerid = currentRow.psubledgerid;
      const partyid = currentRow.ppartyid;

      const griddata = this.paymentslist;

      let count = 0;
      let fixed_count = 0;
      let bank_count = 0;

      for (let i = 0; i < griddata.length; i++) {
        const row = griddata[i];

        // Skip the exact same object (or you can skip by matching unique keys if needed)
        if (row === currentRow) continue;

        // Fixed deposit condition
        if (ledgername === "FIXED DEPOSIT RECEIPTS-CHITS" && griddata.length > 0) {
          count = 1;
          fixed_count = 1;
          break;
        }

        // Check duplicates
        if (
          row.pledgername === "FIXED DEPOSIT RECEIPTS-CHITS" ||
          (
            row.pledgername === ledgername &&
            row.psubledgername === subledgername &&
            row.ppartyid === partyid
          )
        ) {
          if (row.pledgername === "FIXED DEPOSIT RECEIPTS-CHITS") {
            fixed_count = 1;
          }
          count = 1;
          break;
        }

        // Bank list check
        for (let j = 0; j < this.banklist.length; j++) {
          if (
            this.banklist[j].paccountid === row.psubledgerid ||
            this.banklist[j].paccountid === subledgerid
          ) {
            count = 1;
            bank_count = 1;
            break;
          }
        }
      }

      if (count === 1) {
        if (fixed_count === 1)
          this._commonService.showWarningMessage('Fixed deposit receipts accepts only one record in the grid');
        else if (bank_count === 1)
          this._commonService.showWarningMessage('Bank Accounts only one record in the grid');
        else
          this._commonService.showWarningMessage('Ledger, subledger and party already exists in the grid.');
        isValid = false;
      }
    } catch (e) {
      this._commonService.showErrorMessage(e);
      isValid = false;
    }

    return isValid;
  }


  addPaymentDetails(): void {
    debugger
    this.disableaddbutton = true;
    this.addbutton = "Processing";

    const control = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

console.log('ontoels',control);



    if (control.invalid) {
      control.markAllAsTouched();
      control.updateValueAndValidity();

      this._commonService.showWarningMessage('Please fill all required fields');
      this.disableaddbutton = false;
      this.addbutton = "Add";
      return;
    }

    const accountheadid = control.get('pledgerid')?.value;
    const subledgerid = control.get('psubledgerid')?.value;

    // const selectedSubledger = this.subledgeraccountslist.find(
    //   (x: any) => x.subledgerid === subledgerid
    // );
    const selectedSubledger = this.subledgeraccountslist?.find(
      (x: any) => x.subledgerid === subledgerid
    ) || null;

    // Prepare current row
    const currentRow = {
      ppartyname: control.get('ppartyname')?.value,
      pledgername: control.get('pledgername')?.value,
      psubledgerid: selectedSubledger?.subledgerid ?? subledgerid,
      psubledgername: selectedSubledger?.subledgername ?? control.get('pledgername')?.value,
      // psubledgername: selectedSubledger?.subledgername || null,
      // ?? control.get('psubledgername')?.value
      ptotalamount: parseFloat(this._commonService.removeCommasInAmount(control.get('ptotalamount')?.value ?? '0')),
      pamount: parseFloat(this._commonService.removeCommasInAmount(control.get('pamount')?.value ?? '0')),
      pgstcalculationtype: control.get('pgstcalculationtype')?.value,
      pTdsSection: control.get('pTdsSection')?.value,
      pgstpercentage: parseFloat(control.get('pgstpercentage')?.value ?? '0'),
      ptdsamount: parseFloat(this._commonService.removeCommasInAmount(control.get('ptdsamount')?.value ?? '0')),
      ppartyid: control.get('ppartyid')?.value,
      // pChequenumber: control.get('pChequenumber')?.value ?? null
    };

    // Validate BEFORE adding
    if (!this.validateaddPaymentDetails(currentRow)) {
      this.disableaddbutton = false;
      this.addbutton = "Add";
      return;
    }

    // Continue balance check, etc...
    const paidamount = parseFloat(this._commonService.removeCommasInAmount(control.get('pactualpaidamount')?.value ?? '0'));

    this._SubscriberJVService.GetdebitchitCheckbalance(
      this._commonService.getbranchname(),
      accountheadid,
      36,
      subledgerid,
      this._commonService.getschemaname(),
      this._commonService.getCompanyCode(),
      this._commonService.getBranchCode()
    ).subscribe(result => {

      const balancecheckstatus = result?.balancecheckstatus;
      const balanceamount = parseFloat(result?.balanceamount ?? '0');

      if (balancecheckstatus && paidamount > balanceamount) {
        this._commonService.showWarningMessage("Enter the amount less or equal to subledger amount");
        this.disableaddbutton = false;
        this.addbutton = "Add";
        return;
      }

      // Set defaults
      if (!control.get('pStateId')?.value) control.get('pStateId')?.setValue(0);
      if (!control.get('pTdsPercentage')?.value) control.get('pTdsPercentage')?.setValue(0);
      if (!control.get('pgstpercentage')?.value) control.get('pgstpercentage')?.setValue(0);

      // Only push AFTER all validation and balance checks pass
      this.paymentslist.push(currentRow);
      this.paymentslist1 = [...this.paymentslist1, currentRow];

      this.getpartyJournalEntryData();
      this.clearPaymentDetailsparticular();
      this.getPaymentListColumnWisetotals();

      control.reset();
      control.markAsUntouched();
      control.markAsPristine();
      control.updateValueAndValidity();

      this.disableaddbutton = false;
      this.addbutton = "Add";

    }, error => {
      this._commonService.showErrorMessage(error);
      this.disableaddbutton = false;
      this.addbutton = "Add";
    });
  }
  // addPaymentDetails(): void {
  //   debugger
  //   this.disableaddbutton = true;
  //   this.addbutton = "Processing";

  //   const control = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

  //   // Prepare current row first (needed for validation)
  //   const accountheadid = control.get('pledgerid')?.value;
  //   const subledgerid = control.get('psubledgerid')?.value;
  //   console.log('subledgeraccountslist',this.subledgeraccountslist);

  //   const selectedSubledger = this.subledgeraccountslist.find(
  //     (x: any) => x.subledgerid === subledgerid,
  //   );
  // console.log('selectedSubledger',selectedSubledger);

  //   const currentRow = {
  //     ppartyname: control.get('ppartyname')?.value,
  //     pledgername: control.get('pledgername')?.value,
  //     // psubledgerid: subledgerid,
  //     // psubledgername: selectedSubledger?.subledgername,
  //       psubledgerid: selectedSubledger?.subledgerid,
  //   psubledgername: selectedSubledger?.subledgername,
  //     ptotalamount: parseFloat(this._commonService.removeCommasInAmount(control.get('ptotalamount')?.value ?? '0')),
  //     pamount: parseFloat(this._commonService.removeCommasInAmount(control.get('pamount')?.value ?? '0')),
  //     pgstcalculationtype: control.get('pgstcalculationtype')?.value,
  //     pTdsSection: control.get('pTdsSection')?.value,
  //     pgstpercentage: parseFloat(control.get('pgstpercentage')?.value ?? '0'),
  //     ptdsamount: parseFloat(this._commonService.removeCommasInAmount(control.get('ptdsamount')?.value ?? '0')),
  //     ppartyid: control.get('ppartyid')?.value
  //   };

  //    // After validation, push the new row into the paymentslist
  //   this.paymentslist.push(currentRow);
  //   this.paymentslist1 = [...this.paymentslist1, currentRow];
  //   // First, validate the current row (including the newly added row)
  //   if (!this.validateaddPaymentDetails(currentRow)) {
  //     this.disableaddbutton = false;
  //     this.addbutton = "Add";
  //     return;
  //   }



  //   // Now, perform other operations like checking the balance
  //   const paidamount = parseFloat(this._commonService.removeCommasInAmount(control.get('pactualpaidamount')?.value ?? '0'));

  //   this._SubscriberJVService.GetdebitchitCheckbalance(
  //     this._commonService.getbranchname(),
  //     accountheadid, 36, subledgerid,
  //     this._commonService.getschemaname(),
  //     this._commonService.getCompanyCode(),
  //     this._commonService.getBranchCode()
  //   ).subscribe(result => {
  //     const balancecheckstatus = result?.balancecheckstatus;
  //     const balanceamount = parseFloat(result?.balanceamount ?? '0');

  //     if (balancecheckstatus && paidamount > balanceamount) {
  //       this._commonService.showWarningMessage("Enter the amount less or equal to subledger amount");
  //       this.disableaddbutton = false;
  //       this.addbutton = "Add";
  //       return;
  //     }

  //     // Set defaults for state, TDS, GST
  //     if (!control.get('pStateId')?.value) control.get('pStateId')?.setValue(0);
  //     if (!control.get('pTdsPercentage')?.value) control.get('pTdsPercentage')?.setValue(0);
  //     if (!control.get('pgstpercentage')?.value) control.get('pgstpercentage')?.setValue(0);

  //     // Refresh UI
  //     this.getpartyJournalEntryData();
  //     this.clearPaymentDetailsparticular();
  //     this.getPaymentListColumnWisetotals();

  //     this.disableaddbutton = false;
  //     this.addbutton = "Add";
  //   }, (error) => {
  //     this._commonService.showErrorMessage(error);
  //     this.disableaddbutton = false;
  //     this.addbutton = "Add";
  //   });
  // }






  getPaymentListColumnWisetotals() {

    const safeNumber = (value: any) =>
      parseFloat((value || '0').toString().replace(/,/g, '')) || 0;

    this.paymentlistcolumnwiselist['ptotalamount'] =
      this.paymentslist.reduce((sum: number, c: any) => sum + safeNumber(c.ptotalamount), 0);

    this.paymentlistcolumnwiselist['pamount'] =
      this.paymentslist.reduce((sum: number, c: any) => sum + safeNumber(c.pamount), 0);

    this.paymentlistcolumnwiselist['pgstamount'] =
      this.paymentslist.reduce((sum: number, c: any) => sum + safeNumber(c.pgstamount), 0);

    this.paymentlistcolumnwiselist['ptdsamount'] =
      this.paymentslist.reduce((sum: number, c: any) => sum + safeNumber(c.ptdsamount), 0);

  }


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





  //   savePaymentVoucher() {
  //     debugger;

  //     this.disablesavebutton = true;
  //     this.savebutton = 'Processing';
  //     let count = 0;

  //     // Calculate total paid amount
  //     // const totalPaid = this.paymentslist.reduce((sum, c) => sum + parseFloat(c.ptotalamount ?? 0), 0);
  //     const totalPaid = this.paymentslist.reduce((sum: number, c: any) => sum + parseFloat(c.ptotalamount ?? 0), 0);

  //     this.paymentVoucherForm.controls['ptotalpaidamount'].setValue(totalPaid);

  //     if (!this.validatesavePaymentVoucher()) {
  //       this.disablesavebutton = false;
  //       this.savebutton = 'Save';
  //       return;
  //     }

  //     // Collect subledger IDs
  //     // const accountIds = this.paymentslist.map(p => p.psubledgerid).join(',');

  //     const accountIds = this.paymentslist.map((p: any) => p.psubledgerid).join(',');

  //     let trans_date = this.paymentVoucherForm.controls['ppaymentdate'].value;
  //     trans_date = this._commonService.getFormatDateNormal(trans_date);

  //     this._AccountingTransactionsService.GetCashAmountAccountWise(
  //       "PAYMENT VOUCHER",
  //       this._commonService.getbranchname(),
  //       accountIds,
  //       trans_date, this._commonService.getschemaname(),
  //       this._commonService.getCompanyCode(),
  //       this._commonService.getBranchCode()
  //     )
  //       .subscribe(result => {
  //         debugger;

  //         // Check Cash restriction for Cash payment
  //         if (this.paymentVoucherForm.controls['pmodofpayment'].value === 'CASH' && !this.bankexists) {
  //           for (const payment of this.paymentslist) {
  //             const amount = parseFloat(this._commonService.removeCommasInAmount(payment.ptotalamount).toString());

  //             // const matchingResult = result.find(r => r.psubledgerid === payment.psubledgerid);
  //             const matchingResult = result.find((r: any) => r.psubledgerid === (payment as any).psubledgerid);

  //             if (matchingResult) {
  //               const totalAmount = matchingResult.accountbalance + amount;
  //               if (parseFloat(this.cashRestrictAmount.toString()) < totalAmount) {
  //                 count = 1;
  //                 break;
  //               }
  //             }
  //           }
  //         }

  //         if (count !== 0) {
  //           this._commonService.showWarningMessage(
  //             `Subledger per day Cash transactions limit below ${this._commonService.currencysymbol}${this._commonService.currencyformat(this.cashRestrictAmount)} only`
  //           );
  //           this.disablesavebutton = false;
  //           this.savebutton = 'Save';
  //           return;
  //         }

  //         if (!confirm("Do You Want To Save ?")) {
  //           this.disablesavebutton = false;
  //           this.savebutton = 'Save';
  //           return;
  //         }

  //         // Prepare Payment Voucher data
  //         if (this.paymentVoucherForm.controls['pmodofpayment'].value === 'CASH') {
  //           this.paymentVoucherForm.controls['pbankid'].setValue(0);
  //         }

  //         this.paymentVoucherForm.controls['pipaddress'].setValue(this._commonService.getIpAddress());
  //         this.paymentVoucherForm.controls['pCreatedby'].setValue(this._commonService.getCreatedBy());

  //         const paymentVoucherData = {
  //           ...this.paymentVoucherForm.value,
  //           ppaymentslist: this.paymentslist
  //         };

  //         // Format dates
  //         paymentVoucherData.ppaymentdate = this._commonService.getFormatDateNormal(paymentVoucherData.ppaymentdate);
  //         paymentVoucherData.pchequedate = this._commonService.getFormatDateNormal(paymentVoucherData.pchequedate);
  // console.log('save data :',paymentVoucherData);

  //         // Save via service
  //         this._AccountingTransactionsService.savePaymentVoucher(paymentVoucherData)
  //           .subscribe({
  //             next: (res: any) => {
  //               debugger;
  //               if (res[0] === 'TRUE') {
  //                 this.JSONdataItem = res;
  //                 this.disablesavebutton = false;
  //                 this.savebutton = 'Save';
  //                 this._commonService.showInfoMessage("Saved successfully");
  //                 this.clearPaymentVoucher();

  //                 const receipt = btoa(`${res[1]},Payment Voucher`);
  //                 window.open(`/#/PaymentVoucherReport?id=${receipt}`, "_blank");
  //               } else {
  //                 this.disablesavebutton = false;
  //                 this.savebutton = 'Save';
  //                 this._commonService.showErrorMessage("Error while saving..!");
  //               }
  //             },
  //             error: (err) => {
  //               this._commonService.showErrorMessage(err);
  //               this.disablesavebutton = false;
  //               this.savebutton = 'Save';
  //             }
  //           });
  //       });
  //   }

  // savePaymentVoucher() {

  //   this.disablesavebutton = true;
  //   this.savebutton = 'Processing';
  //   let count = 0;

  //   // Calculate total paid amount
  //   const totalPaid = this.paymentslist.reduce((sum: number, c: any) =>
  //     sum + parseFloat(c.ptotalamount ?? 0), 0);

  //   this.paymentVoucherForm.controls['ptotalpaidamount'].setValue(totalPaid);

  //   // Validate form
  //   if (!this.validatesavePaymentVoucher()) {
  //     this.disablesavebutton = false;
  //     this.savebutton = 'Save';
  //     return;
  //   }

  //   // Collect subledger ids
  //   const accountIds = this.paymentslist.map((p: any) => p.psubledgerid).join(',');

  //   // Format date
  //   let trans_date = this.paymentVoucherForm.controls['ppaymentdate'].value;
  //   trans_date = this._commonService.getFormatDateNormal(trans_date);

  //   this._AccountingTransactionsService.GetCashAmountAccountWise(
  //     "PAYMENT VOUCHER",
  //     this._commonService.getbranchname(),
  //     accountIds,
  //     trans_date,
  //     this._commonService.getschemaname(),
  //     this._commonService.getCompanyCode(),
  //     this._commonService.getBranchCode()
  //   ).subscribe(result => {

  //     // CASH restriction check (same as old code)
  //     if (this.paymentVoucherForm.controls['pmodofpayment'].value === 'CASH' && !this.bankexists) {

  //       for (let i = 0; i < this.paymentslist.length; i++) {

  //         let amount = parseFloat(
  //           this._commonService.removeCommasInAmount(this.paymentslist[i].ptotalamount).toString()
  //         );

  //         for (let j = 0; j < result.length; j++) {

  //           if (this.paymentslist[i].psubledgerid == result[j].psubledgerid) {

  //             let amt1 = result[j].accountbalance + amount;

  //             if (parseFloat(this.cashRestrictAmount) < parseFloat(amt1)) {
  //               count = 1;
  //             }
  //           }

  //         }
  //       }

  //     }

  //     if (count !== 0) {

  //       this._commonService.showWarningMessage(
  //         'Subledger per day Cash transactions limit below ' +
  //         this._commonService.currencysymbol +
  //         this._commonService.currencyformat(this.cashRestrictAmount) +
  //         " only"
  //       );

  //       this.disablesavebutton = false;
  //       this.savebutton = 'Save';
  //       return;
  //     }

  //     if (!confirm("Do You Want To Save ?")) {
  //       this.disablesavebutton = false;
  //       this.savebutton = 'Save';
  //       return;
  //     }

  //     // CASH payment → bankid = 0
  //     if (this.paymentVoucherForm.controls['pmodofpayment'].value === 'CASH') {
  //       this.paymentVoucherForm.controls['pbankid'].setValue(0);
  //     }

  //     // Set common fields
  //     this.paymentVoucherForm.controls['pipaddress']
  //       .setValue("192.168.1.101");
  //     // this.paymentVoucherForm.controls['pipaddress']
  //     //   .setValue(this._commonService.getipaddress());

  //     this.paymentVoucherForm.controls['pCreatedby']
  //       .setValue(1);
  //     // this.paymentVoucherForm.controls['pCreatedby']
  //     //   .setValue(this._commonService.getcreatedby());

  //     // Create payload (FULL FORM DATA LIKE OLD CODE)
  //     const payload = {

  //       global_schema: this._commonService.getschemaname(),
  //       branch_schema: this._commonService.getbranchname(),
  //       company_code: this._commonService.getCompanyCode(),
  //       branch_code: this._commonService.getBranchCode(),

  //       ...this.paymentVoucherForm.value,   // sends full form like old code

  //       ppaymentdate: this._commonService.getFormatDateNormal(
  //         this.paymentVoucherForm.value.ppaymentdate
  //       ),

  //       pchequedate: this._commonService.getFormatDateNormal(
  //         this.paymentVoucherForm.value.pchequedate
  //       ),

  //       ptotalpaidamount: totalPaid,

  //       ppaymentslistcontrols: [...this.paymentslist]  // full list
  //     };

  //     console.log("Final Payload", payload);

  //     // Save API
  //     this._AccountingTransactionsService.savePaymentVoucher(payload)
  //       .subscribe({

  //         next: (res: any) => {

  //           if (res[0] === 'TRUE') {

  //             this.JSONdataItem = res;

  //             this.disablesavebutton = false;
  //             this.savebutton = 'Save';

  //             this._commonService.showInfoMessage("Saved successfully");

  //             this.clearPaymentVoucher();

  //             const receipt = btoa(res[1] + ',' + 'Payment Voucher');

  //             window.open('/#/PaymentVoucherReport?id=' + receipt, "_blank");

  //           }
  //           else {

  //             this.disablesavebutton = false;
  //             this.savebutton = 'Save';

  //             this._commonService.showErrorMessage("Error while saving..!");

  //           }

  //         },

  //         error: (error) => {

  //           this._commonService.showErrorMessage(error);

  //           this.disablesavebutton = false;
  //           this.savebutton = 'Save';

  //         }

  //       });

  //   });

  // }
  //working
  // savePaymentVoucher() {
  //   this.disablesavebutton = true;
  //   this.savebutton = 'Processing';
  //   let count = 0;

  //   // Calculate total paid amount
  //   const totalPaid = this.paymentslist.reduce((sum: number, c: any) => sum + parseFloat(c.ptotalamount ?? 0), 0);
  //   this.paymentVoucherForm.controls['ptotalpaidamount'].setValue(totalPaid);

  //   // Validate the payment voucher form
  //   if (!this.validatesavePaymentVoucher()) {
  //     this.disablesavebutton = false;
  //     this.savebutton = 'Save';
  //     return;
  //   }

  //   // Collect subledger IDs
  //   const accountIds = this.paymentslist.map((p: any) => p.psubledgerid).join(',');

  //   // Format transaction date
  //   let trans_date = this.paymentVoucherForm.controls['ppaymentdate'].value;
  //   trans_date = this._commonService.getFormatDateNormal(trans_date);

  //   // Get Cash Amount Account Wise (via subscribe)
  //   this._AccountingTransactionsService.GetCashAmountAccountWise(
  //     "PAYMENT VOUCHER",
  //     this._commonService.getbranchname(),
  //     accountIds,
  //     trans_date,
  //     this._commonService.getschemaname(),
  //     this._commonService.getCompanyCode(),
  //     this._commonService.getBranchCode()
  //   ).subscribe(result => {
  //     // Check Cash restriction for Cash payment
  //     if (this.paymentVoucherForm.controls['pmodofpayment'].value === 'CASH' && !this.bankexists) {
  //       for (const payment of this.paymentslist) {
  //         const amount = parseFloat(this._commonService.removeCommasInAmount(payment.ptotalamount).toString());
  //         const matchingResult = result.find((r: any) => r.psubledgerid === (payment as any).psubledgerid);

  //         if (matchingResult) {
  //           const totalAmount = matchingResult.accountbalance + amount;
  //           if (parseFloat(this.cashRestrictAmount.toString()) < totalAmount) {
  //             count = 1;
  //             break;
  //           }
  //         }
  //       }
  //     }

  //     if (count !== 0) {
  //       this._commonService.showWarningMessage(
  //         `Subledger per day Cash transactions limit below ${this._commonService.currencysymbol}${this._commonService.currencyformat(this.cashRestrictAmount)} only`
  //       );
  //       this.disablesavebutton = false;
  //       this.savebutton = 'Save';
  //       return;
  //     }

  //     // Confirm the save action
  //     if (!confirm("Do You Want To Save ?")) {
  //       this.disablesavebutton = false;
  //       this.savebutton = 'Save';
  //       return;
  //     }

  //     // Prepare Payment Voucher data for the backend
  //     if (this.paymentVoucherForm.controls['pmodofpayment'].value === 'CASH') {
  //       this.paymentVoucherForm.controls['pbankid'].setValue(0);
  //     }

  //     // Set common fields
  //     this.paymentVoucherForm.controls['pipaddress'].setValue(this._commonService.getIpAddress());
  //     this.paymentVoucherForm.controls['pCreatedby'].setValue(this._commonService.getCreatedBy());

  //     // const paymentVoucherData = {
  //     //   global_schema: this._commonService.getschemaname(),  // Add schema info
  //     //   branch_schema: this._commonService.getbranchname(),  // Add branch schema info
  //     //   company_code: this._commonService.getCompanyCode(),  // Add company code
  //     //   branch_code: this._commonService.getBranchCode(),    // Add branch code
  //     //   pbankid: 0,  // Assuming pbankid is zero for 'CASH'
  //     //   // pCreatedby: this._commonService.getCreatedBy(),
  //     //   pCreatedby: 1,
  //     //   // pipaddress: this._commonService.getIpAddress(),
  //     //   pipaddress: "192.168.1.101",
  //     //   pjvdate: this._commonService.getFormatDateNormal(this.paymentVoucherForm.controls['ppaymentdate'].value),
  //     //   pmodofpayment: this.paymentVoucherForm.controls['pmodofpayment'].value,
  //     //   bank_id: 0,  // Assuming zero if not applicable
  //     //   ptotalpaidamount: totalPaid,
  //     //   pChequenumber: this.paymentVoucherForm.controls['pChequenumber'].value || '',
  //     //   pnarration: this.paymentVoucherForm.controls['pnarration'].value || '',
  //     //   pUpiname: this._commonService.getCreatedBy(),  // Assuming Upiname is created by
  //     //   subscriberjoinedbranchid: 0,  // Assuming 0 if not applicable
  //     //   ppaymentsslistcontrols: this.paymentslist.map(payment => ({
  //     //     ppartyid: payment.ppartyid,
  //     //     psubledgerid: payment.psubledgerid,
  //     //     pamount: payment.ptotalamount,
  //     //     pistdsapplicable: payment.pistdsapplicable || false,  // Assuming it to be false if not applicable
  //     //     pTdsSection: payment.pTdsSection || '',
  //     //     ptdsamount: payment.ptdsamount || 0,
  //     //     pisgstapplicable: payment.pisgstapplicable || false,  // Assuming it to be false if not applicable
  //     //     ptdscalculationtype: payment.ptdscalculationtype || '',
  //     //     ppartyreferenceid: payment.ppartyreferenceid || '',
  //     //     ppartyname: payment.ppartyname || ''
  //     //   }))
  //     // };



  //     const paymentVoucherData = {
  //       global_schema: this._commonService.getschemaname(),
  //       branch_schema: this._commonService.getbranchname(),
  //       company_code: this._commonService.getCompanyCode(),
  //       branch_code: this._commonService.getBranchCode(),

  //       pbankid: this.paymentVoucherForm.controls['pmodofpayment'].value === 'CASH'
  //         ? 0
  //         : this.paymentVoucherForm.controls['pbankid'].value || 0,

  //       pCreatedby: 1,
  //       pipaddress: "192.168.1.101",

  //       pjvdate: this._commonService.getFormatDateNormal(
  //         this.paymentVoucherForm.controls['ppaymentdate'].value
  //       ),

  //       pmodofpayment: this.paymentVoucherForm.controls['pmodofpayment'].value,
  //       bank_id: this.paymentVoucherForm.controls['pbankid'].value || 0,
  //       ptotalpaidamount: totalPaid,

  //       pChequenumber: this.paymentVoucherForm.controls['pChequenumber'].value || '',
  //       pnarration: this.paymentVoucherForm.controls['pnarration'].value || '',
  //       pUpiname: this._commonService.getCreatedBy(),
  //       subscriberjoinedbranchid: 0,

  //       ppaymentsslistcontrols: this.paymentslist.map((payment: any) => ({
  //         ppartyid: payment.ppartyid || 0,
  //         psubledgerid: payment.psubledgerid || 0,
  //         pamount: Number(payment.pamount || payment.ptotalamount || 0),
  //         pistdsapplicable: payment.pistdsapplicable ?? false,
  //         pTdsSection: payment.pTdsSection || '',
  //         ptdsamount: Number(payment.ptdsamount || 0),
  //         pisgstapplicable: payment.pisgstapplicable ?? false,
  //         ptdscalculationtype: payment.ptdscalculationtype || '',
  //         ppartyreferenceid: payment.ppartyreferenceid || '',
  //         ppartyname: payment.ppartyname || ''
  //       })),

  //       // ✅ Fields from ModeofPaymentDTO / ReceiptsDTO required by API
  //       formname: null,
  //       ppaymentid: null,
  //       ppaymentdate: this.paymentVoucherForm.controls['ppaymentdate'].value || null,
  //       ppaymentslist: [],
  //       pFilename: null,
  //       pFilepath: null,
  //       pFileformat: null,
  //       totalreceivedamount: totalPaid,
  //       receiptid: null,
  //       parentaccountname: null,

  //       contactid: null,
  //       contactname: null,

  //       chitgroupid: null,
  //       groupcode: null,
  //       ticketno: null,
  //       ChallanaNo: null,
  //       pparentid: null,
  //       pAccountName: null,
  //       pContactReferenceId: null,
  //       pPanNumber: null,
  //       radioButtonValue: null,
  //       checkedChitScheme: null,
  //       toChitNo: null,
  //       payableValue: null,
  //       pinstallment_no: null,
  //       pchequeno_scheme: null,
  //       pchequedate_scheme: null,
  //       Bank_name: null,
  //       pchequeEntryid: null,

  //       contactpaytype: null,
  //       contactbankname: null,
  //       contactbankaccno: null,
  //       contactbankbranch: null,
  //       contactbankifsc: null,

  //       // ModeofPaymentDTO fields
  //       pUpiid: null,
  //       pRecordid: null,
  //       pAccountnumber: null,
  //       pBankName: null,
  //       pBankconfigurationId: null,
  //       pdepositbankid: null,
  //       pdepositbankname: null,
  //       pchequedate: null,
  //       pchequedepositdate: null,
  //       pchequecleardate: null,
  //       ptranstype: null,
  //       ptypeofpayment: null,
  //       pCardNumber: null,
  //       pbranchname: null,
  //       branchid: null,
  //     };


  //     // const paymentVoucherData = {
  //     //   global_schema: this._commonService.getschemaname(),
  //     //   branch_schema: this._commonService.getbranchname(),
  //     //   company_code: this._commonService.getCompanyCode(),
  //     //   branch_code: this._commonService.getBranchCode(),

  //     //   pbankid: this.paymentVoucherForm.controls['pmodofpayment'].value === 'CASH'
  //     //     ? 0
  //     //     : this.paymentVoucherForm.controls['pbankid'].value || 0,

  //     //   pCreatedby: 1,
  //     //   // pCreatedby: this._commonService.getCreatedBy(),
  //     //   // pipaddress: this._commonService.getIpAddress(),
  //     //   pipaddress: "192.168.1.101",

  //     //   pjvdate: this._commonService.getFormatDateNormal(
  //     //     this.paymentVoucherForm.controls['ppaymentdate'].value
  //     //   ),

  //     //   pmodofpayment: this.paymentVoucherForm.controls['pmodofpayment'].value,

  //     //   bank_id: this.paymentVoucherForm.controls['pbankid'].value || 0,

  //     //   ptotalpaidamount: totalPaid,

  //     //   pChequenumber: this.paymentVoucherForm.controls['pChequenumber'].value || '',
  //     //   pnarration: this.paymentVoucherForm.controls['pnarration'].value || '',
  //     //   pUpiname: this._commonService.getCreatedBy(),

  //     //   subscriberjoinedbranchid: 0,

  //     //   ppaymentsslistcontrols: this.paymentslist.map((payment: any) => ({
  //     //     ppartyid: payment.ppartyid || 0,
  //     //     psubledgerid: payment.psubledgerid || 0,
  //     //     pamount: Number(payment.pamount || payment.ptotalamount || 0),

  //     //     pistdsapplicable: payment.pistdsapplicable ?? false,
  //     //     pTdsSection: payment.pTdsSection || '',
  //     //     ptdsamount: Number(payment.ptdsamount || 0),

  //     //     pisgstapplicable: payment.pisgstapplicable ?? false,

  //     //     ptdscalculationtype: payment.ptdscalculationtype || '',

  //     //     ppartyreferenceid: payment.ppartyreferenceid || '',
  //     //     ppartyname: payment.ppartyname || ''
  //     //   }))
  //     // };

  //     console.log('Payload to be sent:', paymentVoucherData);

  //     // Save via service
  //     this._AccountingTransactionsService.savePaymentVoucher(paymentVoucherData)
  //       .subscribe({
  //         next: (res: any) => {
  //           if (res[0] === 'TRUE') {
  //             this.JSONdataItem = res;
  //             this.disablesavebutton = false;
  //             this.savebutton = 'Save';
  //             this._commonService.showInfoMessage("Saved successfully");
  //             this.clearPaymentVoucher();

  //             const receipt = btoa(`${res[1]},Payment Voucher`);
  //             window.open(`/#/PaymentVoucherReport?id=${receipt}`, "_blank");
  //           } else {
  //             this.disablesavebutton = false;
  //             this.savebutton = 'Save';
  //             this._commonService.showErrorMessage("Error while saving..!");
  //           }
  //         },
  //         error: (err) => {
  //           this._commonService.showErrorMessage(err);
  //           this.disablesavebutton = false;
  //           this.savebutton = 'Save';
  //         }
  //       });
  //   });
  // }
savePaymentVoucher() {
  debugger;
  this.disablesavebutton = true;
  this.savebutton = 'Processing';
  let count = 0;

  this.paymentVoucherForm['controls']['ptotalpaidamount'].setValue(
    this.paymentslist.reduce((sum: number, c: any) => sum + parseFloat(c.ptotalamount ?? 0), 0)
  );

  if (!this.validatesavePaymentVoucher()) {
    this.disablesavebutton = false;
    this.savebutton = 'Save';
    return;
  }

  const accountIds = this.paymentslist.map((p: any) => p.psubledgerid).join(',');
  let trans_date = this._commonService.getFormatDateNormal(
    this.paymentVoucherForm.controls['ppaymentdate'].value
  );

  this._AccountingTransactionsService.GetCashAmountAccountWise(
    "PAYMENT VOUCHER",
    this._commonService.getbranchname(),
    accountIds,
    trans_date,
    this._commonService.getschemaname(),
    this._commonService.getCompanyCode(),
    this._commonService.getBranchCode()
  ).subscribe(result => {
    debugger;

    if (this.paymentVoucherForm.controls['pmodofpayment'].value === 'CASH' && !this.bankexists) {
      for (let i = 0; i < this.paymentslist.length; i++) {
        let amount = parseFloat(
          this._commonService.removeCommasInAmount(this.paymentslist[i].ptotalamount).toString()
        );
        for (let j = 0; j < result.length; j++) {
          if (this.paymentslist[i].psubledgerid == result[j].psubledgerid) {
            let amt1 = result[j].accountbalance + amount;
            if (parseFloat(this.cashRestrictAmount) < parseFloat(amt1)) {
              count = 1;
            }
          }
        }
      }
    }

    if (count !== 0) {
      this._commonService.showWarningMessage(
        'Subledger per day Cash transactions limit below ' +
        this._commonService.currencysymbol +
        this._commonService.currencyformat(this.cashRestrictAmount) + " only"
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

    if (this.paymentVoucherForm.controls['pmodofpayment'].value === 'CASH') {
      this.paymentVoucherForm['controls']['pbankid'].setValue(0);
    }

    this.paymentVoucherForm.controls['pipaddress'].setValue("192.168.2.177");
    this.paymentVoucherForm.controls['pCreatedby'].setValue(1);
    // this.paymentVoucherForm.controls['pipaddress'].setValue(this._commonService.getipaddress());
    // this.paymentVoucherForm.controls['pCreatedby'].setValue(this._commonService.getcreatedby());

    const formValue = this.paymentVoucherForm.value;
    console.log("paymmnet list",this.paymentslist);
    

    const paymentVoucherData = {

      // ── Schema / Branch ──────────────────────────────────────
      global_schema:          this._commonService.getschemaname(),
      branch_schema:          this._commonService.getbranchname(),
      company_code:          "KAPILAGRO",
      branch_code:            "KAG01",
      // company_code:           this._commonService.getCompanyCode(),
      // branch_code:            this._commonService.getBranchCode(),

      // ── Core Payment Fields ──────────────────────────────────
      ppaymentid:             formValue.ppaymentid || "",
      ppaymentdate:           this._commonService.getFormatDateNormal(formValue.ppaymentdate) || "",
      pjvdate:                this._commonService.getFormatDateNormal(formValue.ppaymentdate) || "",
      pmodofpayment:          formValue.pmodofpayment || "",
      ptotalpaidamount:       formValue.ptotalpaidamount || 0,
      pnarration:             formValue.pnarration || "",
      subscriberjoinedbranchid: 0,
      bank_id:                 2,
      // bank_id:                formValue.pbankid || 2,

      // ── Bank / Cheque / UPI Fields ───────────────────────────
      pbankid:                 2,
      // pbankid:                formValue.pbankid || 2,
      pBankName:              formValue.pbankname || "",
      pbranchname:            formValue.pbranchname || "",
      ptranstype:             formValue.ptranstype || "",
      ptypeofpayment:         formValue.ptypeofpayment || "",
      pChequenumber:          String(formValue.pChequenumber || ""),
      pchequedate:            this._commonService.getFormatDateNormal(formValue.pchequedate) || "",
      pchequedepositdate:     "",
      pchequecleardate:       "",
      pCardNumber:            formValue.pCardNumber || "",
      pUpiname:               formValue.pUpiname || "",
      pUpiid:                 formValue.pUpiid || "",
      pRecordid:              "",
      pBankconfigurationId:   "",
      pdepositbankid:         "",
      pdepositbankname:       "",
      pAccountnumber:         "",
      branchid:               "2",

      // ── User / System Fields ─────────────────────────────────
      pCreatedby:             formValue.pCreatedby || 1,
      pipaddress:             formValue.pipaddress || "",

      // ── File Fields ──────────────────────────────────────────
      pFilename:              formValue.pDocStorePath || "",
      pFilepath:              "",
      pFileformat:            "",

      // ── Receipt / Contact Fields ─────────────────────────────
      formname:               "",
      totalreceivedamount:    formValue.ptotalpaidamount?.toString() || "0",
      receiptid:              "",
      parentaccountname:      "",
      contactid:              "",
      contactname:            "",
      contactpaytype:         "",
      contactbankname:        "",
      contactbankaccno:       "",
      contactbankbranch:      "",
      contactbankifsc:        "",

      // ── Chit / Scheme Fields ─────────────────────────────────
      chitgroupid:            "",
      groupcode:              "",
      ticketno:               "",
      ChallanaNo:             "",
      challanaNo:             "",
      pparentid:              "",
      pAccountName:           "",
      pContactReferenceId:    "",
      pPanNumber:             "",
      radioButtonValue:       "",
      checkedChitScheme:      "",
      toChitNo:               "",
      payableValue:           "",
      pinstallment_no:        "",
      pchequeno_scheme:       "",
      pchequedate_scheme:     "",
      Bank_name:              "",
      bank_name:              "",
      pchequeEntryid:         "",

      // ── ppaymentsslistcontrols (mapped grid rows) ────────────
      ppaymentsslistcontrols: this.paymentslist.map((payment: any) => ({
        ppartyid:             payment.ppartyid || 0,
        psubledgerid:         payment.psubledgerid || 0,
        pamount:              Number(payment.pamount || payment.ptotalamount || 0),
        pistdsapplicable:     payment.pistdsapplicable ?? false,
        pTdsSection:          payment.pTdsSection || "",
        ptdsamount:           Number(payment.ptdsamount || 0),
        pisgstapplicable:     payment.pisgstapplicable ?? false,
        ptdscalculationtype:  payment.ptdscalculationtype || "",
        ppartyreferenceid:    payment.ppartyreferenceid || "",
        ppartyname:           payment.ppartyname || ""
      })),

      // ── ppaymentslist (full swagger fields) ──────────────────
      ppaymentslist: this.paymentslist.map((payment: any) => ({
        id:                     payment.id?.toString() || "",
        text:                   payment.text || "",
        psubledgerid:           payment.psubledgerid?.toString() || "",
        psubledgername:         payment.psubledgername || "",
        pledgerid:              payment.pledgerid?.toString() || "",
        pledgername:            payment.pledgername || "",
        ptranstype:             payment.ptranstype || "",
        accountbalance:         payment.accountbalance?.toString() || "0",
        pAccounttype:           payment.pAccounttype || "",
        legalcellReceipt:       payment.legalcellReceipt || "",
        pbranchcode:            payment.pbranchcode || "",
        pbranchtype:            payment.pbranchtype || "",
        groupcode:              payment.groupcode || "",
        pamount:                payment.pamount?.toString() || "0",
        pgsttype:               payment.pgsttype || "",
        pgstcalculationtype:    payment.pgstcalculationtype || "",
        pgstpercentage:         payment.pgstpercentage?.toString() || "0",
        pigstamount:            payment.pigstamount?.toString() || "0",
        pcgstamount:            payment.pcgstamount?.toString() || "0",
        psgstamount:            payment.psgstamount?.toString() || "0",
        putgstamount:           payment.putgstamount?.toString() || "0",
        pState:                 payment.pState || "",
        pStateId:               payment.pStateId?.toString() || "",
        pgstno:                 payment.pgstno || "",
        pgstamount:             payment.pgstamount?.toString() || "0",
        pigstpercentage:        payment.pigstpercentage?.toString() || "0",
        pcgstpercentage:        payment.pcgstpercentage?.toString() || "0",
        psgstpercentage:        payment.psgstpercentage?.toString() || "0",
        putgstpercentage:       payment.putgstpercentage?.toString() || "0",
        pactualpaidamount:      payment.pamount?.toString() || "0",
        ptotalamount:           payment.ptotalamount?.toString() || "0",
        pisgstapplicable:       payment.pisgstapplicable?.toString() || "false",
        ptdsamountindividual:   payment.ptdsamountindividual?.toString() || "0",
        pTdsSection:            payment.pTdsSection || "",
        pTdsPercentage:         payment.pTdsPercentage?.toString() || "0",
        preferencetext:         payment.preferencetext || "",
        pgstnumber:             payment.pgstnumber || "",
        ppartyname:             payment.ppartyname || "",
        ppartyid:               payment.ppartyid?.toString() || "",
        ppartyreferenceid:      payment.ppartyreferenceid || "",
        ppartyreftype:          payment.ppartyreftype || "",
        pistdsapplicable:       payment.pistdsapplicable?.toString() || "false",
        ptdsamount:             payment.ptdsamount?.toString() || "0",
        ptdscalculationtype:    payment.ptdscalculationtype || "",
        ptdsaccountId:          payment.ptdsaccountId?.toString() || "",
        ppartypannumber:        payment.ppartypannumber || "",
        ptdsrefjvnumber:        payment.ptdsrefjvnumber || "",
        ledgeramount:           payment.ledgeramount?.toString() || "0",
        totalreceivedamount:    payment.totalreceivedamount?.toString() || "0",
        pFilename:              payment.pFilename || "",
        agentcode:              payment.agentcode || "",
        ticketno:               payment.ticketno || "",
        chitgroupid:            payment.chitgroupid || "",
        schemesubscriberid:     payment.schemesubscriberid || "",
        interbranchsubledgerid: payment.interbranchsubledgerid || "",
        interbranchid:          payment.interbranchid || "",
        pformname:              payment.pformname || "",
        paccountname:           payment.paccountname || "",
        pgstvoucherno:          payment.pgstvoucherno || "",
        pChequenumber:          String(payment.pChequenumber || ""),
      })),
    };

    console.log('Final Payload:', JSON.stringify(paymentVoucherData));

    this._AccountingTransactionsService.savePaymentVoucher(paymentVoucherData).subscribe({
      next: (res: any) => {
        debugger;
        if (res.success === true) {
          this.JSONdataItem = res;
          this.disablesavebutton = false;
          this.savebutton = 'Save';
          this._commonService.showInfoMessage("Saved successfully");
          this.clearPaymentVoucher();

          // const receipt = btoa(res.voucherNo + ',' + 'Payment Voucher');
          // window.open('/#/PaymentVoucherReport?id=' + receipt, "_blank");
          const receipt = btoa(res.voucherNo + ',' + 'Payment Voucher');
const encodedForUrl = encodeURIComponent(receipt);
// window.open('/#/PaymentVoucherReport/' + encodedForUrl, "_blank");
          // window.open('/#/PaymentVoucherReport/' + receipt, "_blank");
          const url = this.router.serializeUrl(
            this.router.createUrlTree(['/PaymentVoucherReport', encodedForUrl])
          );

          window.open(url, '_blank');
        } else {
          this.disablesavebutton = false;
          this.savebutton = 'Save';
          this._commonService.showErrorMessage("Error while saving..!");
        }
      },
      error: (error) => {
        this._commonService.showErrorMessage(error);
        this.disablesavebutton = false;
        this.savebutton = 'Save';
      }
    });
  });
}




  getpartyJournalEntryData() {
    try {

      const tdsJournalEntries: any[] = [];
      this.partyjournalentrylist = [];

      // Get unique ledger names
      const ledgerNames = [...new Set(
        this.paymentslist
          .map((item: any) => item.pledgername)
          .filter((name: any) => name)
      )];

      let journalIndex = 1;

      // 🔹 Process each ledger
      for (const ledger of ledgerNames) {

        const ledgerPayments = this.paymentslist
          .filter((p: any) => p.pledgername === ledger);

        // Total debit (Payment + TDS)
        const ledgerDebit = ledgerPayments.reduce((sum: number, p: any) =>
          sum + Number
            (this._commonService.removeCommasInAmount(p.pamount) || 0) +
          Number(this._commonService.removeCommasInAmount(p.ptdsamount) || 0),
          0
        );

        // Push ledger debit entry
        this.partyjournalentrylist.push({
          type: 'Payment Voucher',
          accountname: ledger,
          debitamount: ledgerDebit,
          creditamount: 0
        });

        // 🔹 TDS Section Wise
        const tdsSections = [...new Set(
          ledgerPayments
            .map((p: any) => p.pTdsSection)
            .filter((section: any) => section)
        )];

        for (const section of tdsSections) {

          const tdsAmount = ledgerPayments
            .filter((p: any) => p.pTdsSection === section)
            .reduce((sum: number, p: any) =>
              sum + Number(this._commonService.removeCommasInAmount(p.ptdsamount) || 0),
              0
            );

          if (tdsAmount > 0) {
            tdsJournalEntries.push({
              type: `Journal Voucher ${journalIndex}`,
              accountname: `TDS-${section} RECEIVABLE`,
              debitamount: tdsAmount,
              creditamount: 0
            });
          }
        }

        // 🔹 Ledger Credit for total TDS
        const totalTDS = ledgerPayments.reduce((sum: number, p: any) =>
          sum + Number(this._commonService.removeCommasInAmount(p.ptdsamount) || 0),
          0
        );

        if (totalTDS > 0) {
          tdsJournalEntries.push({
            type: `Journal Voucher ${journalIndex}`,
            accountname: ledger,
            debitamount: 0,
            creditamount: totalTDS
          });
        }

        journalIndex++;
      }

      // 🔹 GST Entries
      const gstConfig = [
        { key: 'pigstamount', name: 'P-IGST' },
        { key: 'pcgstamount', name: 'P-CGST' },
        { key: 'psgstamount', name: 'P-SGST' },
        { key: 'putgstamount', name: 'P-UTGST' }
      ];

      gstConfig.forEach(gst => {

        const totalGST = this.paymentslist.reduce((sum: number, p: any) =>
          sum + Number(this._commonService.removeCommasInAmount(p[gst.key]) || 0),
          0
        );

        if (totalGST > 0) {
          this.partyjournalentrylist.push({
            type: 'Payment Voucher',
            accountname: gst.name,
            debitamount: totalGST,
            creditamount: 0
          });
        }
      });

      // 🔹 Total Paid Amount
      const totalPaid = this.paymentslist.reduce((sum: number, p: any) =>
        sum + Number(this._commonService.removeCommasInAmount(p.ptotalamount) || 0),
        0
      );

      if (totalPaid > 0) {

        this.paymentVoucherForm.controls['ptotalpaidamount'].setValue(totalPaid);

        const accountName =
          this.paymentVoucherForm.controls['pmodofpayment'].value === 'CASH'
            ? 'CASH ON HAND'
            : 'BANK';

        this.partyjournalentrylist.push({
          type: 'Payment Voucher',
          accountname: accountName,
          debitamount: 0,
          creditamount: totalPaid
        });
      }

      // 🔹 Append TDS Journal Entries at end
      this.partyjournalentrylist = [
        ...this.partyjournalentrylist,
        ...tdsJournalEntries
      ];

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
  gstChange(event: any) {
    this.showgst = event.target.checked
  }



  allowNumberOnly(event: KeyboardEvent) {
    const allowedChars = '0123456789.';
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;

    // Allow control keys (backspace, tab, arrows, delete)
    if (
      event.key === 'Backspace' || event.key === 'Tab' ||
      event.key === 'ArrowLeft' || event.key === 'ArrowRight' ||
      event.key === 'Delete'
    ) {
      return; // allow
    }

    // Allow only one decimal point
    if (event.key === '.' && currentValue.includes('.')) {
      event.preventDefault();
      return;
    }

    // Block any key that is not digit or dot
    if (!allowedChars.includes(event.key)) {
      event.preventDefault();
    }
  }
}

