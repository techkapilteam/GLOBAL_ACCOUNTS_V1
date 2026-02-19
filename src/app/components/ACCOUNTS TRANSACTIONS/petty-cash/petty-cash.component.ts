import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';
import { CommonService } from '../../../services/common.service';
import { ValidationMessageComponent } from '../../../common/validation-message/validation-message.component';

@Component({
  selector: 'app-petty-cash',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    NgSelectModule,
    ValidationMessageComponent
  ],
  templateUrl: './petty-cash.component.html',
  providers: [DatePipe]
})
export class PettyCashComponent implements OnInit {

  // ---------------- UI Flags ----------------
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
  showgstamount = false;
  showigst = false;
  showcgst = false;
  showsgst = false;
  showutgst = false;
  showgstno = false;
  showsubledger = true;
  parties: any[] = [];
  ledgers: any[] = [];
  subLedgers: any[] = [];
  selectedLedger: number | string | null = null;
  selectedSubLedger: number | string | null = null;
  selectedParty: number | string | null = null;
  currencyCode: string = '₹';


  // Form fields
  amountPaid: number = 0;
  gstEnabled: boolean = false;
  tdsEnabled: boolean = false;

  // ---------------- Labels ----------------
  displayCardName = 'Debit Card';
  displaychequeno = 'Cheque No';
  currencySymbol: string = '';

  // ---------------- Lists ----------------
  banklist: any[] = [];
  modeoftransactionslist: any[] = [];
  typeofpaymentlist: any[] = [];
  ledgeraccountslist: any[] = [];
  subledgeraccountslist: any[] = [];
  partylist: any[] = [];
  gstlist: any[] = [];
  tdslist: any[] = [];
  tdssectionlist: any[] = [];
  tdspercentagelist: any[] = [];
  debitcardlist: any[] = [];
  statelist: any[] = [];
  chequenumberslist: any[] = [];
  upinameslist: any[] = [];
  upiidlist: any[] = [];
  paymentslist: any[] = [];
  paymentslist1: any[] = [];
  partyjournalentrylist: any[] = [];

  // ---------------- Balances ----------------
  cashBalance: number = 0;
  bankBalance: number = 0;
  bankbookBalance: number = 0;
  bankpassbookBalance: number = 0;
  ledgerBalance: number = 0;
  subledgerBalance: number = 0;
  partyBalance: number = 0;

  // ---------------- Other ----------------
  formValidationMessages: any = {};
  paymentlistcolumnwiselist: any = {};
  imageResponse: any = null;
  disablegst = false;
  disabletds = false;
  disableaddbutton = false;
  disablesavebutton = false;
  disabletransactiondate = false;
  addbutton = "Add";
  savebutton = "Save";
  kycFileName: string = '';

  JSONdataItem: any[] = [];

  gstnopattern = "^(0[1-9]|[1-2][0-9]|3[0-9])([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}([a-zA-Z0-9]){1}([a-zA-Z]){1}([a-zA-Z0-9]){1}?";

  public ppaymentdateConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'DD/MMM/YYYY',
    containerClass: 'theme-default',
    showWeekNumbers: false
  };

  paymentVoucherForm!: FormGroup;
  checkValidations: any;

  constructor(
    private _FormBuilder: FormBuilder,
    private datepipe: DatePipe,
    private zone: NgZone,
    private _commonService: CommonService,
    private router: Router,
    private _AccountingTransactionsService: AccountingTransactionsService
  ) {
    //   this.ppaymentdateConfig.containerClass = this._commonService.datePickerPropertiesSetup('containerClass');
    //   this.ppaymentdateConfig.showWeekNumbers = this._commonService.datePickerPropertiesSetup('showWeekNumbers');
    //   this.ppaymentdateConfig.maxDate = new Date();
    //   this.ppaymentdateConfig.dateInputFormat = this._commonService.datePickerPropertiesSetup('dateInputFormat');
    this.ppaymentdateConfig.maxDate = new Date();
    this.ppaymentdateConfig.containerClass = 'theme-dark-blue';
    this.ppaymentdateConfig.dateInputFormat = 'DD-MMM-YYYY';
    this.ppaymentdateConfig.showWeekNumbers = false;

  }


  ngOnInit(): void {

    this.currencySymbol = this._commonService.currencysymbol || '';

    if (this._commonService.comapnydetails != null)
      this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;

    this.paymentVoucherForm = this._FormBuilder.group({
      ppaymentid: [''],
      schemaname: [this._commonService.getschemaname()],
      ppaymentdate: [new Date(), Validators.required], // ← set default to today
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
    });

    // Optional: Ensure the datepicker sees the current date
    this.paymentVoucherForm.get('ppaymentdate')?.setValue(new Date());

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
      pistdsapplicable: [false],
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
      ptotalamount: [''],
    });
  }

  BlurEventAllControll(fromgroup: FormGroup) {
    Object.keys(fromgroup.controls).forEach((key: string) => {
      const control = fromgroup.get(key);
      if (control instanceof FormGroup) {
        this.BlurEventAllControll(control);
      } else if (control?.validator) {
        control.valueChanges.subscribe(() => {
          this.GetValidationByControl(fromgroup, key);
        });
      }
    });
  }

  GetValidationByControl(formGroup: FormGroup, key: string) {
    const control = formGroup.get(key);
    if (!control) return;

    this.formValidationMessages[key] = '';

    if (control.invalid && (control.dirty || control.touched)) {
      for (const errorkey in control.errors) {
        const label = key;
        const message = this._commonService.getValidationMessage(control, errorkey, label, key, '');
        this.formValidationMessages[key] += message + ' ';
      }
    }
  }

  setBalances(balancetype: string, balanceamount: any): void {

    if (balanceamount === null || balanceamount === undefined || balanceamount === '') {
      balanceamount = 0;
    }

    const numericAmount = Number(balanceamount) || 0;

    let balancedetails: string = '';

    if (numericAmount < 0) {
      balancedetails =
        this._commonService.currencyFormat(Math.abs(numericAmount).toFixed(2)) + ' Cr';
    } else {
      balancedetails =
        this._commonService.currencyFormat(numericAmount.toFixed(2)) + ' Dr';
    }


    switch (balancetype) {

      case 'CASH': {
        this.cashBalance = Number(balancedetails) || 0;
        break;
      }

      case 'BANK': {
        this.bankBalance = Number(balancedetails) || 0;
        break;
      }

      case 'BANKBOOK': {
        this.bankbookBalance = Number(balancedetails) || 0;
        break;
      }

      case 'PASSBOOK': {
        this.bankpassbookBalance = Number(balancedetails) || 0;
        break;
      }

      case 'LEDGER': {
        this.ledgerBalance = Number(balancedetails) || 0;
        break;
      }

      case 'SUBLEDGER': {
        this.subledgerBalance = Number(balancedetails) || 0;
        break;
      }

      case 'PARTY': {
        this.partyBalance = Number(balancedetails) || 0;
        break;
      }

      default:
        break;
    }


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
    this.GetValidationByControl(this.paymentVoucherForm, 'ptypeofpayment');
  }
  // Called when GST checkbox is clicked
  isgstapplicable_Checked(): void {
    const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
    if (!subForm) return;

    // Reset state if needed
    subForm.get('pStateId')?.setValue('');
    if (typeof this.gst_clear === 'function') {
      this.gst_clear();
    }

    const ppartyname = subForm.get('ppartyname')?.value;
    const griddata = (this.paymentslist || []).filter((x: any) => x.ppartyname == ppartyname);

    if (griddata.length > 0) {
      subForm.get('pisgstapplicable')?.setValue(griddata[0].pisgstapplicable);
    }

    // Call change handler
    this.isgstapplicableChange();
  }

  // Called when TDS checkbox is clicked
  istdsapplicable_Checked(): void {
    const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
    if (!subForm) return;

    const ppartyname = subForm.get('ppartyname')?.value;
    const griddata = (this.paymentslist || []).filter((x: any) => x.ppartyname == ppartyname);

    if (griddata.length > 0) {
      subForm.get('pistdsapplicable')?.setValue(griddata[0].pistdsapplicable);
    }

    // Call change handler
    this.istdsapplicableChange();
  }

  // Handles GST checkbox value change
  isgstapplicableChange(): void {
    const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
    if (!subForm) return;

    const data = subForm.get('pisgstapplicable')?.value;

    const gstCalculationControl = subForm.get('pgstcalculationtype');
    const gstpercentageControl = subForm.get('pgstpercentage');
    const stateControl = subForm.get('pStateId'); // fixed from pState to pStateId
    const gstamountControl = subForm.get('pgstamount');

    if (data) {
      this.showgst = true; // <-- template will now check showgst

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

    if (typeof this.claculategsttdsamounts === 'function') {
      this.claculategsttdsamounts();
    }
  }

  // Handles TDS checkbox value change
  istdsapplicableChange(): void {
    const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
    if (!subForm) return;

    const data = subForm.get('pistdsapplicable')?.value;

    const tdsCalculationControl = subForm.get('ptdscalculationtype');
    const tdspercentageControl = subForm.get('pTdsPercentage');
    const sectionControl = subForm.get('pTdsSection');
    const tdsamountControl = subForm.get('ptdsamount');

    if (data) {
      this.showtds = true;

      if (!this.disabletds) {
        tdsCalculationControl?.setValue('INCLUDE');
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

    if (typeof this.claculategsttdsamounts === 'function') {
      this.claculategsttdsamounts();
    }
  }

  getLoadData() {

    this._AccountingTransactionsService.GetReceiptsandPaymentsLoadingDatapettycash('PAYMENT VOUCHER', this._commonService.getschemaname()).subscribe(json => {
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
        //this.lstLoanTypes = json
        //this.titleDetails = json as string
        //this.titleDetails = eval("(" + this.titleDetails + ')');
        //this.titleDetails = this.titleDetails.FT;
      }
    },
      (error) => {

        this._commonService.showErrorMessage(error);
      });
  }

  gettypeofpaymentdata(): any {

    const data = (this.modeoftransactionslist || []).filter((payment: any) => {
      return payment.ptranstype != payment.ptypeofpayment;
    });

    return data;
  }

  trackByFn(index: number, item: any) {
    return index; // or item.id
  }

  bankName_Change($event: any): void {

    const pbankid = $event?.target?.value;

    this.upinameslist = [];
    this.chequenumberslist = [];

    this.paymentVoucherForm.get('pChequenumber')?.setValue('');
    this.paymentVoucherForm.get('pUpiname')?.setValue('');
    this.paymentVoucherForm.get('pUpiid')?.setValue('');

    if (pbankid && pbankid !== '') {

      const bankname =
        $event?.target?.options?.[$event.target.selectedIndex]?.text || '';

      this.GetBankDetailsbyId(pbankid);
      this.getBankBranchName(pbankid);

      this.paymentVoucherForm.get('pbankname')?.setValue(bankname);

    } else {

      this.paymentVoucherForm.get('pbankname')?.setValue('');
    }

    this.GetValidationByControl(this.paymentVoucherForm, 'pbankname');
    this.formValidationMessages['pChequenumber'] = '';
  }

  chequenumber_Change(): void {
    this.GetValidationByControl(this.paymentVoucherForm, 'pChequenumber');
  }

  debitCard_Change(): void {

    const cardNumber = this.paymentVoucherForm.get('pCardNumber')?.value;

    const data = this.getbankname(cardNumber);

    if (data) {
      this.paymentVoucherForm.get('pbankname')?.setValue(data.pbankname);
      this.paymentVoucherForm.get('pbankid')?.setValue(data.pbankid);
    }

    this.GetValidationByControl(this.paymentVoucherForm, 'pCardNumber');
  }

  getbankname(cardnumber: any) {

    try {

      const data = (this.debitcardlist || []).filter((debit: any) => {
        return debit.pCardNumber == cardnumber;
      })[0];

      if (data) {
        this.getBankBranchName(data.pbankid);
      }

      return data;

    } catch (e) {
      this._commonService.showErrorMessage(e);
      return null;
    }
  }

  ledgerName_Change($event: any): void {
    const pledgerid = $event?.pledgerid;

    const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
    if (!subForm) return;

    // Reset subledger selection
    this.subledgeraccountslist = [];
    subForm.get('psubledgerid')?.setValue(null);
    subForm.get('psubledgername')?.setValue('');

    // Reset balances to 0 (numbers)
    this.ledgerBalance = 0;
    this.subledgerBalance = 0;

    if (pledgerid) {
      const ledgername = $event.pledgername;

      const data = (this.ledgeraccountslist || []).find((ledger: any) => ledger.pledgerid == pledgerid);
      if (data) {
        this.setBalances('LEDGER', data.accountbalance); // accountbalance should be numeric
      }

      this.GetSubLedgerData(pledgerid);

      subForm.get('pledgername')?.setValue(ledgername);
    } else {
      this.setBalances('LEDGER', 0);
      subForm.get('pledgername')?.setValue('');
    }
  }

  GetSubLedgerData(pledgerid: any): void {
    this._AccountingTransactionsService.GetSubLedgerData(pledgerid,'accounts','KAPILCHITS','accounts','KLC01','global').subscribe(
      (json: any) => {
        if (!json) return;

        this.subledgeraccountslist = json;
        const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
        if (!subForm) return;

        const subLedgerControl = subForm.get('psubledgername');

        if (this.subledgeraccountslist.length > 0) {
          this.showsubledger = true;
          subLedgerControl?.setValidators(Validators.required);
        } else {
          subLedgerControl?.clearValidators();
          this.showsubledger = false;

          subForm.get('psubledgerid')?.setValue(pledgerid);
          subForm.get('psubledgername')?.setValue(subForm.get('pledgername')?.value);
          this.formValidationMessages['psubledgername'] = '';
        }

        subLedgerControl?.updateValueAndValidity();
      },
      (error) => {
        this._commonService.showErrorMessage(error);
      }
    );
  }


  subledger_Change($event: any): void {
    const psubledgerid = $event?.psubledgerid;

    const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
    if (!subForm) return;

    // Reset balance to 0 (number)
    this.subledgerBalance = 0;

    if (psubledgerid) {
      const subledgername = $event.psubledgername;
      subForm.get('psubledgername')?.setValue(subledgername);

      const data = (this.subledgeraccountslist || []).find(
        (ledger: any) => ledger.psubledgerid === psubledgerid
      );

      if (data) {
        this.setBalances('SUBLEDGER', data.accountbalance); // accountbalance should be numeric
      }
    } else {
      subForm.get('psubledgername')?.setValue('');
      this.setBalances('SUBLEDGER', 0);
    }

    this.GetValidationByControl(this.paymentVoucherForm, 'psubledgername');
  }


  upiName_Change($event: any): void {

    const upiname = $event?.target?.value;

    this.upiidlist = (this.upinameslist || []).filter((res: any) => {
      return res.pUpiname == upiname;
    });

    this.GetValidationByControl(this.paymentVoucherForm, 'pUpiname');
  }

  upid_change(): void {
    this.GetValidationByControl(this.paymentVoucherForm, 'pUpiid');
  }

  GetBankDetailsbyId(pbankid: any): void {

    this._AccountingTransactionsService.GetBankDetailsbyId(pbankid).subscribe(
      (json: any) => {

        if (json != null) {

          this.upinameslist = json.bankupilist || [];
          this.chequenumberslist = json.chequeslist || [];
        }
      },
      (error) => {
        this._commonService.showErrorMessage(error);
      }
    );
  }


  getBankBranchName(pbankid: any): void {

    const data = (this.banklist || []).filter((bank: any) => {
      return bank.pbankid == pbankid;
    })[0];

    if (!data) return;

    this.paymentVoucherForm.get('pbranchname')?.setValue(data.pbranchname);

    this.setBalances('BANKBOOK', data.pbankbalance);
    this.setBalances('PASSBOOK', data.pbankpassbookbalance);
  }

  setenableordisabletdsgst(ppartyname: any, changetype: any): void {

    const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
    if (!subForm) return;

    subForm.get('pistdsapplicable')?.setValue(false);
    subForm.get('pisgstapplicable')?.setValue(false);

    const data = (this.paymentslist || []).filter(x => x.ppartyname == ppartyname);

    if (data && data.length > 0) {

      this.disablegst = true;
      this.disabletds = true;

      subForm.get('pistdsapplicable')?.setValue(data[0].pistdsapplicable);
      subForm.get('pisgstapplicable')?.setValue(data[0].pisgstapplicable);
      subForm.get('pgstcalculationtype')?.setValue(data[0].pgstcalculationtype);
      subForm.get('ptdscalculationtype')?.setValue(data[0].ptdscalculationtype);

    } else {

      this.disablegst = false;
      this.disabletds = false;
    }

    // FIXED: was assignment (=)
    if (changetype === 'PARTYCHANGE') {
      this.isgstapplicableChange();
      this.istdsapplicableChange();
    }
  }

  tdsSection_Change($event: any): void {

    const ptdssection = $event?.target?.value;

    const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
    if (!subForm) return;

    this.tdspercentagelist = [];
    subForm.get('pTdsPercentage')?.setValue('');

    if (ptdssection && ptdssection !== '') {
      this.gettdsPercentage(ptdssection);
    }

    this.GetValidationByControl(this.paymentVoucherForm, 'pTdsSection');
  }

  gettdsPercentage(ptdssection: any): void {

    this.tdspercentagelist = (this.tdslist || []).filter((tds: any) => {
      return tds.pTdsSection == ptdssection;
    });

    this.claculategsttdsamounts();
  }

  tds_Change($event: any): void {

    this.GetValidationByControl(this.paymentVoucherForm, 'pTdsPercentage');
    this.GetValidationByControl(this.paymentVoucherForm, 'ptdsamount');

    this.claculategsttdsamounts();
  }

  gst_Change($event: any): void {

    const gstpercentage = $event?.target?.value;

    const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
    if (!subForm) return;

    subForm.get('pigstpercentage')?.setValue('');
    subForm.get('pcgstpercentage')?.setValue('');
    subForm.get('psgstpercentage')?.setValue('');
    subForm.get('putgstpercentage')?.setValue('');

    if (gstpercentage && gstpercentage !== '') {
      this.getgstPercentage(gstpercentage);
    }

    this.GetValidationByControl(this.paymentVoucherForm, 'pgstpercentage');
    this.GetValidationByControl(this.paymentVoucherForm, 'pgstamount',);
  }

  getgstPercentage(gstpercentage: any): void {

    const data = (this.gstlist || []).filter((gst: any) => {
      return gst.pgstpercentage == gstpercentage;
    })[0];

    if (!data) return;

    const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
    if (!subForm) return;

    subForm.get('pigstpercentage')?.setValue(data.pigstpercentage);
    subForm.get('pcgstpercentage')?.setValue(data.pcgstpercentage);
    subForm.get('psgstpercentage')?.setValue(data.psgstpercentage);
    subForm.get('putgstpercentage')?.setValue(data.putgstpercentage);

    this.claculategsttdsamounts();
  }

  partyName_Change($event: any): void {
    const ppartyid = $event?.ppartyid;

    const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
    if (!subForm) return;

    // Reset related lists and form controls
    this.statelist = [];
    this.tdssectionlist = [];
    this.tdspercentagelist = [];
    this.paymentslist1 = [];
    this.paymentslist = [];

    subForm.patchValue({
      pStateId: '',
      pState: '',
      pTdsSection: '',
      pTdsPercentage: '',
      ppartyreferenceid: '',
      ppartyreftype: '',
      ppartypannumber: ''
    });

    // Reset balance to 0 (number)
    this.partyBalance = 0;

    if (ppartyid) {
      const partynamename = $event.ppartyname;
      subForm.get('ppartyname')?.setValue(partynamename);

      const data = (this.partylist || []).find(x => x.ppartyid === ppartyid);
      if (!data) return;

      subForm.patchValue({
        ppartyreferenceid: data.ppartyreferenceid,
        ppartyreftype: data.ppartyreftype,
        ppartypannumber: data.ppartypannumber
      });

      this.getPartyDetailsbyid(ppartyid, partynamename);
      this.setenableordisabletdsgst(partynamename, 'PARTYCHANGE');
    } else {
      this.setBalances('PARTY', 0);
      subForm.get('ppartyname')?.setValue('');
    }
  }


  getPartyDetailsbyid(ppartyid: any, pStateId: any): void {
    this._AccountingTransactionsService.getPartyDetailsbyid(ppartyid, pStateId).subscribe(
        (json: any) => {
          if (!json) return;
          this.tdslist = json.lstTdsSectionDetails || [];
          const newdata = this.tdslist
            .map(item => item.pTdsSection)
            .filter((value, index, self) =>
              self.indexOf(value) === index
            );

          this.tdssectionlist = [];

          for (let i = 0; i < newdata.length; i++) {
            this.tdssectionlist.push({
              pTdsSection: newdata[i]
            });
          }

          this.statelist = json.statelist || [];

          this.claculategsttdsamounts();
          this.setBalances('PARTY', json.accountbalance);
        },
        (error) => {
          this._commonService.showErrorMessage(error);
        }
      );
  }


  gsno_change(): void {
    this.GetValidationByControl(this.paymentVoucherForm, 'pgstno');
  }

  gst_clear(): void {

    const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
    if (!subForm) return;

    subForm.get('pigstpercentage')?.setValue('');
    subForm.get('pcgstpercentage')?.setValue('');
    subForm.get('psgstpercentage')?.setValue('');
    subForm.get('putgstpercentage')?.setValue('');
    subForm.get('pgstpercentage')?.setValue('');
    subForm.get('pgstno')?.setValue('');
  }

  state_change($event: any): void {

    const pstateid = $event?.target?.value;

    const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
    if (!subForm) return;

    this.gst_clear();

    if (pstateid && pstateid !== '') {

      const statename =
        $event?.target?.options?.[$event.target.selectedIndex]?.text || '';

      subForm.get('pState')?.setValue(statename);

      const gstno = statename.split('-')[1];
      this.showgstno = !gstno;

      const data = this.GetStatedetailsbyId(pstateid);
      if (!data) return;

      this.showgstamount = true;
      this.showigst = false;
      this.showcgst = false;
      this.showsgst = false;
      this.showutgst = false;

      subForm.get('pgsttype')?.setValue(data.pgsttype);

      if (data.pgsttype === 'IGST') {
        this.showigst = true;
      } else {
        this.showcgst = true;
        if (data.pgsttype === 'CGST,SGST') this.showsgst = true;
        if (data.pgsttype === 'CGST,UTGST') this.showutgst = true;
      }

    } else {
      subForm.get('pState')?.setValue('');
    }

    this.GetValidationByControl(this.paymentVoucherForm, 'pState');
    this.formValidationMessages['pigstpercentage'] = '';

    this.claculategsttdsamounts();
  }

  GetStatedetailsbyId(pstateid: any): any {

    return (this.statelist || []).filter((state: any) => {
      return state.pStateId == pstateid;
    })[0];
  }
  pamount_change(): void {
    this.claculategsttdsamounts();
  }

  claculategsttdsamounts(): void {
    try {
      const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
      if (!subForm) return;

      let paidAmount = subForm.get('pactualpaidamount')?.value;
      if (!paidAmount) paidAmount = 0;
      else paidAmount = parseFloat(this._commonService.removeCommasInAmount(paidAmount.toString()));

      if (isNaN(paidAmount)) paidAmount = 0;

      let actualPaidAmount = paidAmount;

      // GST values
      const isGstApplicable = subForm.get('pisgstapplicable')?.value;
      const gstType = subForm.get('pgsttype')?.value;
      const gstCalculationType = subForm.get('pgstcalculationtype')?.value;

      let igstPercentage = parseFloat(subForm.get('pigstpercentage')?.value) || 0;
      let cgstPercentage = parseFloat(subForm.get('pcgstpercentage')?.value) || 0;
      let sgstPercentage = parseFloat(subForm.get('psgstpercentage')?.value) || 0;
      let utgstPercentage = parseFloat(subForm.get('putgstpercentage')?.value) || 0;

      let igstAmount = 0, cgstAmount = 0, sgstAmount = 0, utgstAmount = 0, gstAmount = 0;

      if (isGstApplicable) {
        if (gstCalculationType === 'INCLUDE') {
          gstAmount = parseFloat(((paidAmount * igstPercentage) / (100 + igstPercentage)).toFixed(2));

          if (gstType === 'IGST') {
            igstAmount = Math.ceil(gstAmount);
            actualPaidAmount -= igstAmount;
          } else if (gstType === 'CGST,SGST') {
            cgstAmount = Math.ceil(gstAmount) / 2;
            sgstAmount = Math.ceil(gstAmount) / 2;
            actualPaidAmount -= (cgstAmount + sgstAmount);
          } else if (gstType === 'CGST,UTGST') {
            cgstAmount = Math.ceil(gstAmount) / 2;
            utgstAmount = Math.ceil(gstAmount) / 2;
            actualPaidAmount -= (cgstAmount + utgstAmount);
          }
        } else if (gstCalculationType === 'EXCLUDE') {
          gstAmount = parseFloat(((paidAmount * igstPercentage) / 100).toFixed(2));

          if (gstType === 'IGST') igstAmount = Math.ceil(gstAmount);
          else if (gstType === 'CGST,SGST') {
            cgstAmount = Math.ceil(gstAmount) / 2;
            sgstAmount = Math.ceil(gstAmount) / 2;
          } else if (gstType === 'CGST,UTGST') {
            cgstAmount = Math.ceil(gstAmount) / 2;
            utgstAmount = Math.ceil(gstAmount) / 2;
          }
        }
      }

      // TDS values
      const isTdsApplicable = subForm.get('pistdsapplicable')?.value;
      const tdsCalculationType = subForm.get('ptdscalculationtype')?.value;
      let tdsPercentage = parseFloat(subForm.get('pTdsPercentage')?.value) || 0;
      let tdsAmount = 0;

      if (isTdsApplicable) {
        if (tdsCalculationType === 'INCLUDE') {
          tdsAmount = Math.ceil(
            (gstCalculationType === 'INCLUDE' ? actualPaidAmount : paidAmount) * tdsPercentage / (100 + tdsPercentage)
          );
          actualPaidAmount -= tdsAmount;
        } else if (tdsCalculationType === 'EXCLUDE') {
          tdsAmount = Math.ceil(
            (gstCalculationType === 'INCLUDE' ? actualPaidAmount : paidAmount) * tdsPercentage / 100
          );
          actualPaidAmount -= tdsAmount;
        }
      }

      gstAmount = igstAmount + cgstAmount + sgstAmount + utgstAmount;
      let totalAmount = actualPaidAmount + gstAmount;

      // Update Form
      subForm.get('pamount')?.setValue(actualPaidAmount > 0 ? actualPaidAmount : '');
      subForm.get('pgstamount')?.setValue(gstAmount);
      subForm.get('pigstamount')?.setValue(igstAmount);
      subForm.get('pcgstamount')?.setValue(cgstAmount);
      subForm.get('psgstamount')?.setValue(sgstAmount);
      subForm.get('putgstamount')?.setValue(utgstAmount);
      subForm.get('ptdsamount')?.setValue(tdsAmount);
      subForm.get('ptotalamount')?.setValue(parseFloat(totalAmount.toFixed(2)));

      this.formValidationMessages['pamount'] = '';
    } catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }

  validateaddPaymentDetails(): boolean {
    let isValid = true;

    const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
    if (!subForm) return false;

    try {
      const verifyAmount = subForm.get('pactualpaidamount')?.value;
      if (verifyAmount === 0) subForm.get('pactualpaidamount')?.setValue('');

      isValid = this.checkValidations(subForm, isValid);

      const ledgerName = subForm.get('pledgername')?.value;
      const subledgerName = subForm.get('psubledgername')?.value;
      const subledgerId = subForm.get('psubledgerid')?.value;
      const partyId = subForm.get('ppartyid')?.value;

      const gridData = this.paymentslist || [];
      let count = 0, fixedCount = 0, bankCount = 0;

      for (let i = 0; i < gridData.length; i++) {
        if (ledgerName === "FIXED DEPOSIT RECEIPTS-CHITS" && gridData.length > 0) {
          count = 1;
          fixedCount = 1;
          break;
        }

        if ((gridData[i].pledgername === "FIXED DEPOSIT RECEIPTS-CHITS") ||
          (gridData[i].pledgername === ledgerName && gridData[i].psubledgername === subledgerName && gridData[i].ppartyid === partyId)) {
          if (gridData[i].pledgername === "FIXED DEPOSIT RECEIPTS-CHITS") fixedCount = 1;
          count = 1;
          break;
        }

        for (let j = 0; j < this.banklist.length; j++) {
          if (this.banklist[j].paccountid === gridData[i].psubledgerid || this.banklist[j].paccountid === subledgerId) {
            count = 1;
            bankCount = 1;
            break;
          }
        }
      }

      if (count === 1) {
        if (fixedCount === 1) this._commonService.showWarningMessage('Fixed deposit receipts accepts only one record in the grid');
        else if (bankCount === 1) this._commonService.showWarningMessage('Bank Accounts only one record in the grid');
        else this._commonService.showWarningMessage('Ledger, subledger and party already exists in the grid.');
        isValid = false;
      }

    } catch (e) {
      this._commonService.showErrorMessage(e);
    }

    return isValid;
  }
  addPaymentDetails() {
    this.disableaddbutton = true;
    this.addbutton = "Processing";

    const control = <FormGroup>this.paymentVoucherForm.get('ppaymentsslistcontrols');

    if (this.validateaddPaymentDetails()) {

      // Ensure default values
      const stateId = control.get('pStateId')?.value || 0;
      control.get('pStateId')?.setValue(stateId);

      const tdsPercentage = control.get('pTdsPercentage')?.value || 0;
      control.get('pTdsPercentage')?.setValue(tdsPercentage);

      const gstPercentage = control.get('pgstpercentage')?.value || 0;
      control.get('pgstpercentage')?.setValue(gstPercentage);

      // Prepare data for grid
      const data = {
        ppartyname: control.get('ppartyname')?.value,
        pledgername: control.get('pledgername')?.value,
        psubledgername: control.get('psubledgername')?.value,
        ptotalamount: this._commonService.removeCommasInAmount(control.get('ptotalamount')?.value),
        pamount: this._commonService.removeCommasInAmount(control.get('pamount')?.value),
        pgstcalculationtype: control.get('pgstcalculationtype')?.value,
        pTdsSection: control.get('pTdsSection')?.value,
        pgstpercentage: gstPercentage,
        ptdsamount: this._commonService.removeCommasInAmount(control.get('ptdsamount')?.value)
      };

      this.paymentslist1 = [...this.paymentslist1, data];
      this.paymentslist.push(control.value);

      // Refresh dependent data
      this.getpartyJournalEntryData();
      this.clearPaymentDetailsparticular();
      this.getPaymentListColumnWisetotals();
    }

    this.disableaddbutton = false;
    this.addbutton = "Add";
  }

  clearPaymentDetailsparticular() {
    const control = <FormGroup>this.paymentVoucherForm.get('ppaymentsslistcontrols');

    this.showsubledger = true;
    control.get('pistdsapplicable')?.setValue(false);
    control.get('pisgstapplicable')?.setValue(false);
    control.get('psubledgerid')?.setValue(null);

    control.get('pStateId')?.setValue('');
    control.get('pgstpercentage')?.setValue('');
    control.get('pTdsSection')?.setValue('');
    control.get('pTdsPercentage')?.setValue('');
    control.get('pactualpaidamount')?.setValue('');

    this.setBalances('SUBLEDGER', 0);

    this.showgst = false;
    this.showtds = false;
    this.disablegst = false;
    this.disabletds = true;
    this.showgstno = false;
    this.formValidationMessages = {};
  }

  getPaymentListColumnWisetotals() {
    this.paymentlistcolumnwiselist['ptotalamount'] = this.paymentslist.reduce((sum, c) => sum + parseFloat(c.ptotalamount || 0), 0);
    this.paymentlistcolumnwiselist['pamount'] = this.paymentslist.reduce((sum, c) => sum + parseFloat(c.pamount || 0), 0);
    this.paymentlistcolumnwiselist['pgstamount'] = this.paymentslist.reduce((sum, c) => sum + parseFloat(c.pgstamount || 0), 0);
    this.paymentlistcolumnwiselist['ptdsamount'] = this.paymentslist.reduce((sum, c) => sum + parseFloat(c.ptdsamount || 0), 0);
  }

  clearPaymentDetails() {
    const control = <FormGroup>this.paymentVoucherForm.get('ppaymentsslistcontrols');
    control.reset();

    this.showsubledger = true;
    control.get('pistdsapplicable')?.setValue(false);
    control.get('pisgstapplicable')?.setValue(false);
    control.get('pledgerid')?.setValue(null);
    control.get('psubledgerid')?.setValue(null);
    control.get('ppartyid')?.setValue(null);
    control.get('pStateId')?.setValue('');
    control.get('pgstpercentage')?.setValue('');
    control.get('pTdsSection')?.setValue('');
    control.get('pTdsPercentage')?.setValue('');

    this.setBalances('LEDGER', 0);
    this.setBalances('SUBLEDGER', 0);
    this.setBalances('PARTY', 0);

    this.istdsapplicable_Checked();
    this.isgstapplicable_Checked();

    this.formValidationMessages = {};
  }

  cleartranstypeDetails() {
    this.chequenumberslist = [];
    this.paymentVoucherForm.get('pbankid')?.setValue('');
    this.paymentVoucherForm.get('pbankname')?.setValue('');
    this.paymentVoucherForm.get('pCardNumber')?.setValue('');
    this.paymentVoucherForm.get('ptypeofpayment')?.setValue('');
    this.paymentVoucherForm.get('pbranchname')?.setValue('');
    this.paymentVoucherForm.get('pUpiname')?.setValue('');
    this.paymentVoucherForm.get('pUpiid')?.setValue('');
    this.paymentVoucherForm.get('pChequenumber')?.setValue('');

    this.formValidationMessages = {};
    this.setBalances('BANKBOOK', 0);
    this.setBalances('PASSBOOK', 0);
  }

  validatesavePaymentVoucher(): boolean {
    let isValid = true;
    try {
      // Run all form validations
      isValid = this.checkValidations(this.paymentVoucherForm, isValid);

      // Ensure at least one payment record
      if (!this.paymentslist || this.paymentslist.length === 0) {
        this.showWarningMessage('Add at least one record to the grid!');
        isValid = false;
      }

      // Check CASH payment against available balance
      const modOfPayment = this.paymentVoucherForm.get('pmodofpayment')?.value;
      if (modOfPayment === 'CASH') {
        // Clean cashBalance string and convert to number
        const rawBalance = (this.cashBalance || '0').toString().trim().replace(/[^\d.-]/g, '');
        const numericCashBalance = Number(this._commonService.removeCommasInAmount(rawBalance)) || 0;

        // Get paid amount as number
        const paidvalue = Number(this.paymentVoucherForm.get('ptotalpaidamount')?.value) || 0;

        if (paidvalue > numericCashBalance) {
          this._commonService.showWarningMessage('Insufficient Cash Balance');
          isValid = false;
        }
      }
    } catch (e: any) {
      this._commonService.showErrorMessage(e.message || e);
    }

    return isValid;
  }


  clearPaymentVoucher() {
    try {
      // Reset lists and form
      this.paymentslist = [];
      this.paymentslist1 = [];
      this.paymentVoucherForm.reset();
      this.cleartranstypeDetails();
      this.clearPaymentDetails();

      // Default mode and date
      this.paymentVoucherForm.get('pmodofpayment')?.setValue('CASH');
      this.modeofPaymentChange();
      this.paymentVoucherForm.get('ppaymentdate')?.setValue(new Date());

      // Reset UI state and balances as numbers
      this.formValidationMessages = {};
      this.paymentlistcolumnwiselist = {};
      this.bankbookBalance = 0;
      this.bankpassbookBalance = 0;
      this.ledgerBalance = 0;
      this.subledgerBalance = 0;
      this.partyBalance = 0;
      this.partyjournalentrylist = [];
      this.imageResponse = { name: '', fileType: 'imageResponse', contentType: '', size: 0 };
    } catch (e: any) {
      this._commonService.showErrorMessage(e.message || e);
    }
  }

  savePaymentVoucher() {
    this.disablesavebutton = true;
    this.savebutton = 'Processing';

    try {
      // Set total paid amount
      const totalPaid = this.paymentslist.reduce((sum, c) => sum + parseFloat(c.ptotalamount || 0), 0);
      this.paymentVoucherForm.get('ptotalpaidamount')?.setValue(totalPaid);

      if (!this.validatesavePaymentVoucher()) {
        this.disablesavebutton = false;
        this.savebutton = 'Save';
        return;
      }

      if (!confirm("Do You Want To Save ?")) {
        this.disablesavebutton = false;
        this.savebutton = 'Save';
        return;
      }

      // If payment mode is CASH, ensure bank id is 0
      if (this.paymentVoucherForm.get('pmodofpayment')?.value === 'CASH') {
        this.paymentVoucherForm.get('pbankid')?.setValue(0);
      }

      // Merge payments list with form data
      const paymentVoucherdata = {
        ...this.paymentVoucherForm.value,
        ppaymentslist: this.paymentslist
      };

      // Format dates
      paymentVoucherdata.ppaymentdate = this._commonService.getFormatDateNormal(paymentVoucherdata.ppaymentdate);
      paymentVoucherdata.pchequedate = this._commonService.getFormatDateNormal(paymentVoucherdata.pchequedate);

      const data = JSON.stringify(paymentVoucherdata);

      this._AccountingTransactionsService.savePettyCash(data).subscribe(
        res => {
          if (res[0] === 'TRUE') {
            this.JSONdataItem = res;
            this._commonService.showInfoMessage("Saved successfully");

            this.clearPaymentVoucher();
            this.ngOnInit();

            const receipt = btoa(res[1] + ',' + 'Petty Cash');
            window.open('/#/PaymentVoucherReport?id=' + receipt, "_blank");
          }

          this.disablesavebutton = false;
          this.savebutton = 'Save';
        },
        error => {
          this._commonService.showErrorMessage(error);
          this.disablesavebutton = false;
          this.savebutton = 'Save';
        }
      );

    } catch (e) {
      this._commonService.showErrorMessage(e);
      this.disablesavebutton = false;
      this.savebutton = 'Save';
    }
  }
  getpartyJournalEntryData() {
    try {
      const ledgerNames = [...new Set(this.paymentslist.map(p => p.pledgername))];
      const tdsJournalEntries: { type: string; accountname: any; debitamount: any; creditamount: any; }[] = [];
      this.partyjournalentrylist = [];

      ledgerNames.forEach((ledger, index) => {
        // Total amount + TDS for this ledger
        const journalAmount = this.paymentslist
          .filter(p => p.pledgername === ledger)
          .reduce((sum, p) => sum + this._commonService.removeCommasInAmount(p.pamount) + this._commonService.removeCommasInAmount(p.ptdsamount), 0);

        this.partyjournalentrylist.push({ type: 'Payment Voucher', accountname: ledger, debitamount: journalAmount, creditamount: '' });

        // TDS entries per section
        const tdsData = this.paymentslist.filter(p => p.pledgername === ledger);
        const tdsSections = [...new Set(tdsData.map(p => p.pTdsSection))];

        tdsSections.forEach(section => {
          const tdsAmount = tdsData
            .filter(p => p.pTdsSection === section)
            .reduce((sum, p) => sum + this._commonService.removeCommasInAmount(p.ptdsamount), 0);

          tdsJournalEntries.push({
            type: `Journal Voucher${index + 1}`,
            accountname: `TDS-${section} RECEIVABLE`,
            debitamount: tdsAmount,
            creditamount: ''
          });
        });

        const totalTds = tdsData.reduce((sum, p) => sum + this._commonService.removeCommasInAmount(p.ptdsamount), 0);
        if (totalTds > 0) {
          tdsJournalEntries.push({
            type: `Journal Voucher${index + 1}`,
            accountname: ledger,
            debitamount: '',
            creditamount: totalTds
          });
        }
      });

      // GST entries
      const gstAccounts = ['pigstamount', 'pcgstamount', 'psgstamount', 'putgstamount'];
      const gstNames = ['P-IGST', 'P-CGST', 'P-SGST', 'P-UTGST'];
      gstAccounts.forEach((field, i) => {
        const amount = this.paymentslist.reduce((sum, p) => sum + this._commonService.removeCommasInAmount(p[field] || 0), 0);
        if (amount > 0) {
          this.partyjournalentrylist.push({ type: 'Payment Voucher', accountname: gstNames[i], debitamount: amount, creditamount: '' });
        }
      });

      // Total paid amount & cash/bank entry
      const totalPaid = this.paymentslist.reduce((sum, p) => sum + this._commonService.removeCommasInAmount(p.ptotalamount), 0);
      if (totalPaid > 0) {
        this.paymentVoucherForm.get('ptotalpaidamount')?.setValue(totalPaid);
        const accountName = this.paymentVoucherForm.get('pmodofpayment')?.value === 'CASH' ? 'PETTY CASH' : 'BANK';
        this.partyjournalentrylist.push({ type: 'Payment Voucher', accountname: accountName, debitamount: '', creditamount: totalPaid });
      }

      // Append TDS entries at the end
      this.partyjournalentrylist = [...this.partyjournalentrylist, ...tdsJournalEntries];
      this.loadgrid();
    } catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
  loadgrid() {
    throw new Error('Method not implemented.');
  }

  removeHandler(rowIndex: number) {
    if (!this.paymentslist || !this.paymentslist1) return; // safety check

    if (rowIndex >= 0 && rowIndex < this.paymentslist.length) {
      // Remove from arrays
      this.paymentslist.splice(rowIndex, 1);
      this.paymentslist1.splice(rowIndex, 1);
      this.paymentslist1 = [...this.paymentslist1];

      // Recalculate total paid amount
      const totalPaid = this.paymentslist.reduce((sum: number, p: any) => sum + parseFloat(p.ptotalamount || '0'), 0);
      this.paymentVoucherForm.get('ptotalpaidamount')?.setValue(totalPaid);

      // Call dependent methods safely
      if (this.getpartyJournalEntryData) this.getpartyJournalEntryData();
      if (this.clearPaymentDetails) this.clearPaymentDetails();
      if (this.getPaymentListColumnWisetotals) this.getPaymentListColumnWisetotals();
    }
  }

  uploadAndProgress(event: Event) {
    try {
      const target = event.target as HTMLInputElement;
      const file = target?.files?.[0];
      if (!file || !this.validateFile(file.name)) {
        this.showWarningMessage("Upload jpg, png, or pdf files only");
        return;
      }

      // Read file for preview
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageResponse = {
          name: file.name,
          fileType: "imageResponse",
          contentType: file.type,
          size: file.size
        };
      };

      // Prepare form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('NewFileName', `Payment Voucher.${file.name.split('.').pop()}`);

      // Upload
      this._commonService.fileUploadS3("Account", formData).subscribe((data: any) => {
        if (!data?.length) return;
        this.kycFileName = data[0];
        this.imageResponse.name = data[0];
        this.paymentVoucherForm.get('pFilename')?.setValue(this.kycFileName);
      }, (error: any) => {
        this.showErrorMessage(error);
      });
    } catch (e: any) {
      this.showErrorMessage(e.message || e);
    }
  }

  validateFile(fileName: string): boolean {
    if (!fileName) return true;
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ['jpg', 'png', 'pdf'].includes(ext || '');
  }

  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }

  showWarningMessage(errormsg: string) {
    this._commonService.showWarningMessage(errormsg);
  }

  // Getter for pgstno form control
  get pgstno() {
    return this.paymentVoucherForm.get('pgstno');
  }
  saveJournalVoucher(): void {
    console.log('Save Journal Voucher clicked');

    // TODO: Implement your actual save logic here
    // Example:
    // if (this.paymentVoucherForm.valid) {
    //   this._AccountingTransactionsService.saveVoucher(this.paymentVoucherForm.value).subscribe(...);
    // }
  }
}
