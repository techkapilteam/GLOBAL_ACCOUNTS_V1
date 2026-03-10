import { Component, NgModule, OnInit } from '@angular/core';
import { State, GroupDescriptor, DataResult } from '@progress/kendo-data-query';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { BsDatepickerConfig, BsDatepickerModule, DatepickerDateCustomClasses } from 'ngx-bootstrap/datepicker';
import { AccountingMasterService } from '../../../services/accounting-master.service';
import { SubscriberjvService } from '../../../services/Transactions/subscriber/subscriberjv.service';
import { Observable } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'primeng/api';
import { NgSelectModule } from '@ng-select/ng-select';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ValidationMessageComponent } from '../../../common/validation-message/validation-message.component';
import { TableModule } from 'primeng/table';
import { HttpParams } from '@angular/common/http';


function alphabetsOnlyValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    return /^[a-zA-Z\s]+$/.test(control.value.toString().trim())
        ? null : { alphabetsOnly: true };
}

function digitsOnlyValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    return /^[0-9]+$/.test(control.value.toString().replace(/,/g, ''))
        ? null : { digitsOnly: true };
}

/** Alphanumeric  →  cheque / reference numbers */
function alphanumericValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    return /^[a-zA-Z0-9]+$/.test(control.value.toString().trim())
        ? null : { alphanumeric: true };
}

/** Exactly 16 digits  →  card number */
function cardNumberValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    return /^\d{16}$/.test(control.value.toString().replace(/\s/g, ''))
        ? null : { cardNumber: true };
}

/** Positive number with up to 2 decimal places  →  amount fields */
function positiveAmountValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const val = parseFloat(control.value.toString().replace(/,/g, ''));
    if (isNaN(val)) return { positiveAmount: true };
    return val > 0 ? null : { positiveAmount: true };
}

/** Number 0–100  →  GST % / TDS % */
function percentageValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value === null || control.value === '') return null;
    const val = parseFloat(control.value.toString());
    if (isNaN(val)) return { percentage: true };
    return val >= 0 && val <= 100 ? null : { percentage: true };
}


@Component({
    selector: 'app-general-receipt-new',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        NgxDatatableModule, SharedModule, NgSelectModule,
        TableModule, ValidationMessageComponent, BsDatepickerModule, CurrencyPipe, RouterModule
    ],
    templateUrl: './general-receipt-new.component.html'
})
export class GeneralReceiptNewComponent implements OnInit {

    showModeofPayment = false;
    GeneralReceiptForm!: FormGroup;
    myDateValue: Date | undefined;
    bsValue = new Date();
    public submitted = false;
    gridshowhide: any;
    dateCustomClasses: DatepickerDateCustomClasses[] | undefined;
    public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    public bankshowhide: boolean = false;
    public walletshowhide: boolean = false;
    public chequeshowhide: boolean = false;
    public onlineshowhide: boolean = false;
    public DebitShowhide: boolean = false;
    public creditShowhide: boolean = false;
    public banklist: any;
    public modeoftransactionslist: any;
    paymentlistcolumnwiselist: any;
    currencySymbol: any;
    public typeofpaymentlist: any;
    public ledgeraccountslist: any;
    public partylist: any;
    public gstlist: any;
    public debitcardlist: any;
    public tdssectionlist: any;
    public statelist: any;
    public showgst = true;
    public showtds = true;
    public chequenumberslist: any;
    public upinameslist: any;
    public Modeofpayment: any;
    public Transtype: any;
    public DepositBankDisable: boolean = false;
    public SwitchDisable: boolean = true;
    public subledgeraccountslist: any;
    public showigst = false;
    public showcgst = false;
    public showsgst = false;
    public showutgst = false;
    public showgstno = false;
    public showgstamount = false;
    public showsubledger: boolean = true;
    public today: Date = new Date();
    public cashBalance: string = '';
    public bankBalance: string = '';
    public bankbookBalance: string = '';
    public bankpassbookBalance: string = '';
    public ledgerBalance: string = '';
    public subledgerBalance: string = '';
    public partyBalance: string = '';
    currencyCode!: 'INR';
    public WalletBalance: number = 0;
    public paymentslist: any = 0;
    public paymentslist1: any;
    public partyjournalentrylist: any;
    public gridState: State = { sort: [], skip: 0, take: 10 };
    public disablesavebutton = false;
    public savebutton = 'Save';
    public selectableSettings: SelectableSettings | undefined;
    public TempGSTtype: any = '';
    public TempModeofReceipt: any = '';
    public groups: GroupDescriptor[] = [{ field: 'accountname' }];
    public formValidationMessages: any;
    public gridView: DataResult | undefined;
    public showupi: boolean = false;
    public tdspercentagelist: any;
    public tdslist: any;
    public temporaryamount: number = 0;
    public imageResponse: any;
    public kycFileName: any;
    public kycFilePath: any;
    public data: any;
    public TempgstshowInclude: boolean = true;
    public TempgstshowExclude: boolean = true;
    public tempState: any = '';
    public tempgstno: any = '';
    disabletransactiondate = false;
    public banksList: any;

    // GST No. pattern
    gstnopattern = '^(0[1-9]|[1-2][0-9]|3[0-9])([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}([a-zA-Z0-9]){1}([a-zA-Z]){1}([a-zA-Z0-9]){1}?';

    cashRestrictAmount: any;
    bankexists: boolean | undefined;
    availableAmount: any;
    this: any;

    public Bankbuttondata: any = [
        { id: 1, type: 'Cheque', chequeshowhide: true, onlineshowhide: false, DebitShowhide: false, creditShowhide: false },
        { id: 2, type: 'Online', chequeshowhide: false, onlineshowhide: true, DebitShowhide: false, creditShowhide: false },
        { id: 3, type: 'Debit Card', chequeshowhide: false, onlineshowhide: false, DebitShowhide: true, creditShowhide: false },
        { id: 4, type: 'Credit Card', chequeshowhide: false, onlineshowhide: false, DebitShowhide: false, creditShowhide: true }
    ];
    public Paymentbuttondata: any = [
        { id: 1, type: 'Cash', bankshowhide: false, walletshowhide: false },
        { id: 2, type: 'Bank', bankshowhide: true, walletshowhide: false },
        { id: 3, type: 'Wallet', bankshowhide: false, walletshowhide: true }
    ];

    public JSONdataItem: any = [];
    pAmountSum: any; pTotalAMountSum: any; pGstAmountSum: any; fileName: any;

    constructor(
        private _CommonService: CommonService,
        public datepipe: DatePipe,
        private _FormBuilder: FormBuilder,
        private _Accountservice: AccountingTransactionsService,
        private _commonService: CommonService,
        private _routes: Router,
        private _accountingmasterserive: AccountingMasterService,
        private router: Router,
        private _SubscriberJVService: SubscriberjvService,
        private _AccountingTransactionsService: AccountingTransactionsService
    ) {
        this.dpConfig.maxDate = new Date();
        this.dpConfig.containerClass = 'theme-dark-blue';
        this.dpConfig.dateInputFormat = 'DD-MMM-YYYY';
        this.dpConfig.showWeekNumbers = false;
        this.dpConfig1.maxDate = new Date();
        this.dpConfig1.containerClass = 'theme-dark-blue';
        this.dpConfig1.dateInputFormat = 'DD-MMM-YYYY';
        this.dpConfig1.showWeekNumbers = false;
        if (this._commonService.comapnydetails != null)
            this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;
    }

    pAccountnumber_change() { this.formValidationMessages['pAccountnumber'] = ''; }

    ngOnInit(): void {
        this.currencySymbol = this._commonService.currencysymbol;
        this.partyBalance = this.currencySymbol + ' 0.00 Dr';
        this.ledgerBalance = this.currencySymbol + ' 0.00 Dr';
        this.subledgerBalance = this.currencySymbol + ' 0.00 Dr';
        this.bankpassbookBalance = this.currencySymbol + ' 0.00 Dr';
        this.bankbookBalance = this.currencySymbol + ' 0.00 Dr';
        this.paymentlistcolumnwiselist = { ptotalamount: 0, pamount: 0, pgstamount: 0 };
        this.formValidationMessages = {};
        this.paymentslist = [];
        this.paymentslist1 = [];
        this.gridshowhide = false;

        this.GeneralReceiptForm = this._FormBuilder.group({
            preceiptid: [''],

            // REQUIRED — date picker
            preceiptdate: ['', [Validators.required]],

            // REQUIRED — radio selection
            pmodofreceipt: ['CASH', [Validators.required]],

            ptotalreceivedamount: [0],

            // REQUIRED + STRING (max 250 chars)
            pnarration: ['', [Validators.required, Validators.maxLength(250)]],

            ppartyname: [''],

            // REQUIRED — dropdown
            ppartyid: [null, [Validators.required]],

            pistdsapplicable: [false],

            // TDS Section — required set dynamically by tdsvalidation()
            pTdsSection: [''],

            // TDS % — NUMERIC 0–100 (required set dynamically)
            pTdsPercentage: [0, [percentageValidator]],

            ptdsamount: [0],
            ptdscalculationtype: [''],
            ppartypannumber: [''],

            // Bank name — STRING (alphabets + spaces)
            pbankname: ['', [alphabetsOnlyValidator]],

            // Branch name — STRING (required + alphabets, set fully in validation())
            pbranchname: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/), Validators.maxLength(30)]],

            schemaname: [this._commonService.getschemaname()],
            ptranstype: [''],
            ptypeofpayment: [null],

            // Account number — NUMERIC digits only, 9–18 digits (required set in validation())
            pAccountnumber: ['', [Validators.required, digitsOnlyValidator, Validators.minLength(9), Validators.maxLength(40)]],

            // Cheque/Reference No — ALPHANUMERIC (required set in validation())
            pChequenumber: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],

            pchequedate: [this.today],
            pbankid: [null],

            // Card number — exactly 16 DIGITS (required set in validation())
            pCardNumber: ['', [cardNumberValidator]],

            pdepositbankid: [null],
            pdepositbankname: [''],
            pRecordid: [0],
            pUpiname: [''],
            pUpiid: [''],
            pstatename: [''],
            pCreatedby: [this._commonService.getCreatedBy()],
            pModifiedby: [0],
            pStatusid: [''],
            pStatusname: [this._commonService.pStatusname],
            pEffectfromdate: [''],
            pEffecttodate: [''],
            ptypeofoperation: [this._commonService.ptypeofoperation],
            ppartyreferenceid: [''],
            ppartyreftype: [''],
            preceiptslist: this.preceiptslist(),
            pFilename: [''],
            pFilepath: [''],
            pFileformat: [''],
            pipaddress: [this._CommonService.getIpAddress()],
            pDocStorePath: ['']
        });

        this.GeneralReceiptForm.get('pTdsPercentage')?.valueChanges.subscribe(() => this.claculateTDSamount());
        this.GeneralReceiptForm.get('ptdscalculationtype')?.valueChanges.subscribe(() => this.claculateTDSamount());
        this.GeneralReceiptForm.get('pistdsapplicable')?.valueChanges.subscribe(() => this.claculateTDSamount());

        let date = new Date();
        this.GeneralReceiptForm['controls']['preceiptdate'].setValue(date);
        this.Paymenttype('Cash');
        this.getLoadData();
        this.isgstapplicableChange();
        this.istdsapplicableChange();
        this.BlurEventAllControll(this.GeneralReceiptForm);
        sessionStorage.removeItem('schemaNameForReportCall');
    }

    trackByFn(index: number, item: any): any { return item?.pBankId || index; }

    // ─── preceiptslist sub-FormGroup ─────────────────────────────────────────
    preceiptslist(): FormGroup {
        return this._FormBuilder.group({
            pisgstapplicable: [false],
            pState: [''],
            pStateId: [''],

            // GST % — NUMERIC 0–100 (required set dynamically by gstvalidation())
            pgstpercentage: [0, [percentageValidator]],

            pamount: [0], pgsttype: [''], pgstcalculationtype: [''],
            pigstamount: [0], pcgstamount: [0], psgstamount: [0], putgstamount: [0],
            psubledgerid: [null], psubledgername: [''],

            // Ledger — required set dynamically in addPaymentDetails()
            pledgerid: [null], pledgername: [''],

            pCreatedby: [this._commonService.pCreatedby],
            pStatusname: [this._commonService.pStatusname],
            pModifiedby: [0], pStatusid: [''],
            pEffectfromdate: [''], pEffecttodate: [''],
            ptypeofoperation: [this._commonService.ptypeofoperation],
            pgstamount: [0],

            // GST No — pattern validated (STRING with specific pattern)
            pgstno: new FormControl('', [Validators.pattern(this.gstnopattern)]),
            pigstpercentage: [''], pcgstpercentage: [''], psgstpercentage: [''], putgstpercentage: [''],
            pactualpaidamount: ['', [Validators.required, positiveAmountValidator, Validators.pattern(/^[0-9,]+(\.[0-9]{1,2})?$/)]],
            ptotalamount: [0]
        });
    }
    numberOnly(event: any) {
        let charCode = event.which ? event.which : event.keyCode;

        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
            return false;
        }

        return true;
    }
    branchNameChange(event: any) {

        let value = event.target.value;
        value = value.replace(/[^a-zA-Z ]/g, '');
        value = value.toLowerCase().replace(/\b\w/g, function (char: string) {
            return char.toUpperCase();
        });

        this.GeneralReceiptForm.get('pbranchname')?.setValue(value, { emitEvent: false });

    }
    get pgstno() { return this.GeneralReceiptForm.get('pgstno'); }

    public groupChange(groups: GroupDescriptor[]): void { this.groups = groups; this.loadgrid(); }
    private loadgrid(): void {
        let data = this.partyjournalentrylist;
        this.partyjournalentrylist = [...this.partyjournalentrylist, data];
    }

    // ─── Key-press guards ────────────────────────────────────────────────────
    allowNumbersOnly(event: KeyboardEvent) {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode >= 48 && charCode <= 57) return true;
        if (charCode === 46) return true;
        event.preventDefault(); return false;
    }

    /** Digits only — for account number / card number fields */
    allowDigitsOnly(event: KeyboardEvent): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if ((charCode >= 48 && charCode <= 57) || [8, 9, 37, 39, 46].includes(charCode)) return true;
        event.preventDefault(); return false;
    }

    /** Alphabets + space — for name / branch fields */
    allowAlphabetsOnly(event: KeyboardEvent): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (
            (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) ||
            charCode === 32 || charCode === 8 || charCode === 9 || charCode === 37 || charCode === 39
        ) return true;
        event.preventDefault(); return false;
    }

    allowIndianAmount(event: KeyboardEvent) {
        const input = event.target as HTMLInputElement;
        const value = input.value.replace(/,/g, '');
        const charCode = event.which ? event.which : event.keyCode;
        if ([8, 9, 37, 39, 46].includes(charCode)) return true;
        if (charCode >= 48 && charCode <= 57) {
            const parts = value.split('.');
            if (parts[0].length >= 13 && input.selectionStart === input.selectionEnd) { event.preventDefault(); return false; }
            if (parts.length > 1 && parts[1].length >= 2) { event.preventDefault(); return false; }
            return true;
        }
        if (charCode === 46) { if (value.includes('.')) { event.preventDefault(); return false; } return true; }
        if (charCode === 44) { event.preventDefault(); return false; }
        event.preventDefault(); return false;
    }

    formatIndianAmount() {
        const control = this.GeneralReceiptForm.get('preceiptslist.pactualpaidamount');
        if (!control?.value) return;
        let numberValue = Number(control.value.toString().replace(/,/g, ''));
        if (!isNaN(numberValue))
            control.setValue(numberValue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 }), { emitEvent: false });
    }

    removeCommas() {
        const control = this.GeneralReceiptForm.get('preceiptslist.pactualpaidamount');
        if (!control?.value) return;
        control.setValue(control.value.toString().replace(/,/g, ''), { emitEvent: false });
    }

    // ─── GST helpers ─────────────────────────────────────────────────────────
    gst_Change($event: any) {
        if (!$event) {
            this.GeneralReceiptForm.get('preceiptslist.pgstpercentage')?.setValue('');
            ['pigstpercentage', 'pcgstpercentage', 'psgstpercentage', 'putgstpercentage',
                'pgstamount', 'pigstamount', 'pcgstamount', 'psgstamount', 'putgstamount'].forEach(k =>
                    this.GeneralReceiptForm.get(`preceiptslist.${k}`)?.setValue(0));
            return;
        }
        const gstpercentage = $event.pgstpercentage ? $event.pgstpercentage : $event;
        ['pigstpercentage', 'pcgstpercentage', 'psgstpercentage', 'putgstpercentage'].forEach(k =>
            this.GeneralReceiptForm.get(`preceiptslist.${k}`)?.setValue(''));
        ['pgstamount', 'pigstamount', 'pcgstamount', 'psgstamount', 'putgstamount'].forEach(k =>
            this.GeneralReceiptForm.get(`preceiptslist.${k}`)?.setValue(0));
        if (gstpercentage && gstpercentage !== '') this.getgstPercentage(gstpercentage);
        this.claculategsttdsamounts();
        this.claculateTDSamount();
    }

    getgstPercentage(gstpercentage: any) {
        let data = this.gstlist.filter((tds: { pgstpercentage: any }) => tds.pgstpercentage == gstpercentage);
        this.GeneralReceiptForm.get('preceiptslist.pigstpercentage')?.setValue(data[0].pigstpercentage);
        this.GeneralReceiptForm.get('preceiptslist.pcgstpercentage')?.setValue(data[0].pcgstpercentage);
        this.GeneralReceiptForm.get('preceiptslist.psgstpercentage')?.setValue(data[0].psgstpercentage);
        this.GeneralReceiptForm.get('preceiptslist.putgstpercentage')?.setValue(data[0].putgstpercentage);
        this.claculategsttdsamounts();
    }

    partyName_Change($event: any): void {
        debugger;
        this.availableAmount = 0;
        this.tempState = ''; this.tempgstno = ''; this.TempGSTtype = ''; this.TempModeofReceipt = '';
        this.TempgstshowInclude = true; this.TempgstshowExclude = true;
        this.showtds = false;
        let ppartyid: any;
        if ($event != undefined) ppartyid = $event.ppartyid;
        this.statelist = []; this.tdssectionlist = []; this.tdspercentagelist = [];
        this.clearPaymentDetails();
        this.GeneralReceiptForm['controls']['pistdsapplicable'].setValue(false);
        this.paymentslist = []; this.paymentslist1 = []; this.partyjournalentrylist = [];
        this.GeneralReceiptForm.get('preceiptslist.pStateId')?.setValue('');
        this.GeneralReceiptForm.get('preceiptslist.pState')?.setValue('');
        this.GeneralReceiptForm.controls['pTdsSection'].setValue('');
        this.GeneralReceiptForm.controls['pTdsPercentage'].setValue(0);
        this.GeneralReceiptForm.controls['ppartyreferenceid'].setValue('');
        this.GeneralReceiptForm.controls['ppartyreftype'].setValue('');
        this.GeneralReceiptForm.controls['ppartypannumber'].setValue('');
        this.partyBalance = this.currencySymbol + ' 0.00 Dr';
        let trans_date = this.GeneralReceiptForm.controls['preceiptdate'].value;
        trans_date = this._commonService.getFormatDateNormal(trans_date);
        this._Accountservice.GetCashRestrictAmountpercontact1(
            'GENERAL RECEIPT', 'KGMS', this._CommonService.getbranchname(), ppartyid, trans_date,
            this._CommonService.getCompanyCode(), this._CommonService.getschemaname(), this._CommonService.getBranchCode()
        ).subscribe(
            (res: any) => { const amt = Number(res) || 0; this.availableAmount = (Number(this.cashRestrictAmount) || 0) - amt; },
            (error: any) => this._commonService.showErrorMessage(error)
        );
        if (ppartyid && ppartyid !== '') {
            const ledgername = $event.ppartyname; const pStateId = $event.pStateId;
            this.getPartyDetailsbyid(ppartyid, pStateId);
            this.GeneralReceiptForm.controls['ppartyname'].setValue(ledgername);
            this.GeneralReceiptForm.controls['pstatename'].setValue($event.pstatename);
            const selectedParty = this.partylist.find((x: any) => x.ppartyid == ppartyid);
            if (selectedParty) {
                this.GeneralReceiptForm.controls['ppartyreferenceid'].setValue(selectedParty.ppartyreferenceid);
                this.GeneralReceiptForm.controls['ppartyreftype'].setValue(selectedParty.ppartyreftype);
                this.GeneralReceiptForm.controls['ppartypannumber'].setValue(selectedParty.ppartypannumber);
            }
        } else {
            this.setBalances('PARTY', 0); this.GeneralReceiptForm.controls['ppartyname'].setValue('');
        }
    }

    getPartyDetailsbyid(ppartyid: any, pStateId: any) {
        debugger;
        this._Accountservice.getPartyDetailsbyid(
            ppartyid, this._commonService.getbranchname(), this._commonService.getBranchCode(),
            this._commonService.getCompanyCode(), this._commonService.getschemaname(), 'taxes'
        ).subscribe(
            (json: any) => {
                if (json != null) {
                    this.tdslist = json.lstTdsSectionDetails;
                    let newdata = json.lstTdsSectionDetails.map((item: any) => item.pTdsSection)
                        .filter((value: any, index: any, self: any) => self.indexOf(value) === index);
                    for (let i = 0; i < newdata.length; i++) this.tdssectionlist.push({ pTdsSection: newdata[i] });
                    this.statelist = json.statelist;
                    this.claculategsttdsamounts(); this.claculateTDSamount();
                    this.setBalances('PARTY', json.accountbalance);
                }
            },
            (error) => this._commonService.showErrorMessage(error)
        );
    }

    setBalances(balancetype: string, balanceamount: string | number): void {
        const amount = Number(balanceamount) || 0;
        const formattedAmount = this._CommonService.currencyFormat(Math.abs(amount).toFixed(2));
        const balanceDetails = amount < 0 ? `${formattedAmount} Cr` : `${formattedAmount} Dr`;
        switch (balancetype) {
            case 'CASH': this.cashBalance = balanceDetails; break;
            case 'BANK': this.bankBalance = balanceDetails; break;
            case 'BANKBOOK': this.bankbookBalance = `${this.currencySymbol} ${balanceDetails}`; break;
            case 'PASSBOOK': this.bankpassbookBalance = `${this.currencySymbol} ${balanceDetails}`; break;
            case 'LEDGER': this.ledgerBalance = `${this.currencySymbol} ${balanceDetails}`; break;
            case 'SUBLEDGER': this.subledgerBalance = `${this.currencySymbol} ${balanceDetails}`; break;
            case 'PARTY': this.partyBalance = `${this.currencySymbol} ${balanceDetails}`; break;
        }
    }

    // ─── Payment type toggling ────────────────────────────────────────────────
    public Paymenttype(type: string) {
        for (var n = 0; n < this.Paymentbuttondata.length; n++) {
            if (this.Paymentbuttondata[n].type === type) {
                this.bankshowhide = this.Paymentbuttondata[n].bankshowhide;
                this.walletshowhide = this.Paymentbuttondata[n].walletshowhide;
            }
        }
        this.GeneralReceiptForm.controls['pbankname'].setValue('');
        this.GeneralReceiptForm.controls['pChequenumber'].setValue('');
        this.GeneralReceiptForm.controls['pchequedate'].setValue(this.today);
        this.GeneralReceiptForm.controls['pdepositbankname'].setValue('');
        this.GeneralReceiptForm.controls['ptypeofpayment'].setValue('');
        this.GeneralReceiptForm.controls['pbranchname'].setValue('');
        this.GeneralReceiptForm.controls['pCardNumber'].setValue('');
        this.GeneralReceiptForm.controls['pAccountnumber'].setValue('');
        if (type == 'Bank') {
            this.GeneralReceiptForm.controls['ptranstype'].setValue('Cheque');
            this.Banktype('Cheque');
            this.Modeofpayment = type;
        } else {
            this.GeneralReceiptForm.controls['ptranstype'].setValue('');
            ['pdepositbankname', 'pbankid', 'pChequenumber', 'ptypeofpayment', 'pbranchname', 'pCardNumber', 'pchequedate', 'pAccountnumber']
                .forEach(f => { this.GeneralReceiptForm.controls[f].clearValidators(); this.GeneralReceiptForm.controls[f].updateValueAndValidity(); });
            this.chequeshowhide = false; this.onlineshowhide = false;
            this.creditShowhide = false; this.DebitShowhide = false;
            this.Modeofpayment = type; this.Transtype = '';
            this.DepositBankDisable = false;
            this.GeneralReceiptForm.controls['ptranstype'].setValue('');
        }
    }

    public Banktype(type: string) {
        debugger;
        this.validation(type);
        this.GeneralReceiptForm.controls['pbankid'].setValue(null);
        this.GeneralReceiptForm.controls['pChequenumber'].setValue('');
        this.GeneralReceiptForm.controls['pchequedate'].setValue(this.today);
        this.GeneralReceiptForm.controls['pdepositbankid'].setValue(null);
        this.GeneralReceiptForm.controls['ptypeofpayment'].setValue(null);
        this.GeneralReceiptForm.controls['pbranchname'].setValue('');
        this.GeneralReceiptForm.controls['pCardNumber'].setValue('');
        this.GeneralReceiptForm.controls['pAccountnumber'].setValue('');
        this.Transtype = type;
        for (var n = 0; n < this.Bankbuttondata.length; n++) {
            if (this.Bankbuttondata[n].type === type) {
                this.chequeshowhide = this.Bankbuttondata[n].chequeshowhide;
                this.onlineshowhide = this.Bankbuttondata[n].onlineshowhide;
                this.creditShowhide = this.Bankbuttondata[n].creditShowhide;
                this.DebitShowhide = this.Bankbuttondata[n].DebitShowhide;
            }
        }
        this.GeneralReceiptForm.controls['pdepositbankid'].setValue('');
        this.GeneralReceiptForm.controls['pdepositbankname'].setValue('');
        if (type == 'Online') {
            this.GeneralReceiptForm.controls['ptypeofpayment'].setValue('');
            this.DepositBankDisable = true;
        } else {
            this.GeneralReceiptForm.controls['ptypeofpayment'].setValue(type);
            if (type == 'Debit Card' || type == 'Credit Card') {
                let DepositBankDisable: any;
                let Modeofpayment = this.GeneralReceiptForm.controls['pmodofreceipt'].value.toUpperCase();
                let trantype = this.Transtype.toUpperCase();
                type = type.toUpperCase();
                this.modeoftransactionslist.filter((Data: any) => {
                    if (Data.ptypeofpayment == type && Data.pmodofPayment == Modeofpayment && Data.ptranstype == trantype) {
                        if (Data.pchqonhandstatus == 'Y') DepositBankDisable = true;
                        else if (Data.pchqonhandstatus == 'N') DepositBankDisable = false;
                    }
                });
                const DepositBankIDControl = <FormGroup>this.GeneralReceiptForm['controls']['pdepositbankid'];
                this.DepositBankDisable = this.DepositBankDisable;
                if (this.DepositBankDisable) DepositBankIDControl.clearValidators();
                else DepositBankIDControl.setValidators(Validators.required);
                DepositBankIDControl.updateValueAndValidity();
            }
        }
        this.bankbookBalance = this.currencySymbol + ' 0.00 Dr';
        this.bankpassbookBalance = this.currencySymbol + ' 0.00 Dr';
    }

    deleteRow(index: number): void {
        if (index === undefined || index === null) return;
        this.paymentslist.splice(index, 1);
        this.paymentslist = [...this.paymentslist];
        if (this.getpartyJournalEntryData) this.getpartyJournalEntryData();
        if (this.getPaymentListColumnWisetotals) this.getPaymentListColumnWisetotals();
    }

    // ─── Dynamic bank-field validation (called on every Banktype() switch) ───
    validation(type: string) {
        debugger;
        this.formValidationMessages = {};
        const ChequeControl = this.GeneralReceiptForm.controls['pChequenumber'];
        const ChequeDateControl = this.GeneralReceiptForm.controls['pchequedate'];
        const TypeofPaymentControl = this.GeneralReceiptForm.controls['ptypeofpayment'];
        const BankControl = this.GeneralReceiptForm.controls['pbankid'];
        const CardNumberControl = this.GeneralReceiptForm.controls['pCardNumber'];
        const DepositBankControl = this.GeneralReceiptForm.controls['pdepositbankid'];
        const AccountControl = this.GeneralReceiptForm.controls['pAccountnumber'];
        const BranchControl = this.GeneralReceiptForm.controls['pbranchname'];

        DepositBankControl.clearValidators();

        // Cheque/Ref No — REQUIRED + ALPHANUMERIC
        ChequeControl.setValidators([Validators.required, alphanumericValidator]);
        TypeofPaymentControl.setValidators([Validators.required]);

        if (type == 'Online' || type == 'Cheque') {
            ChequeDateControl.setValidators([Validators.required]);
            BankControl.setValidators([Validators.required]);
            CardNumberControl.clearValidators();
        } else {
            ChequeDateControl.clearValidators();
            BankControl.clearValidators();
            // Card — REQUIRED + exactly 16 digits
            CardNumberControl.setValidators([Validators.required, cardNumberValidator]);
        }

        if (type == 'Cheque') {
            // Account — REQUIRED + digits only + 9–18 length
            AccountControl.setValidators([Validators.required, digitsOnlyValidator, Validators.minLength(9), Validators.maxLength(18)]);
            // Branch — REQUIRED + alphabets only
            BranchControl.setValidators([Validators.required, alphabetsOnlyValidator]);
        } else {
            AccountControl.clearValidators();
            BranchControl.clearValidators();
        }

        [AccountControl, ChequeDateControl, ChequeControl, TypeofPaymentControl,
            BankControl, CardNumberControl, DepositBankControl, BranchControl].forEach(c => c.updateValueAndValidity());
    }

    typeofPaymentChange(args: any) {
        debugger;
        this.GetValidationByControl(this.GeneralReceiptForm, 'ptypeofpayment', true);
        let type = args.target.options[args.target.selectedIndex].text;
        if (this.Transtype != '') {
            this.GeneralReceiptForm.controls['pdepositbankid'].setValue('');
            this.GeneralReceiptForm.controls['pdepositbankname'].setValue('');
            let DepositBankDisable: any;
            let Modeofpayment = this.GeneralReceiptForm.controls['pmodofreceipt'].value.toUpperCase();
            let trantype = this.Transtype.toUpperCase();
            this.modeoftransactionslist.filter((Data: any) => {
                if (Data.ptypeofpayment == type && Data.pmodofPayment == Modeofpayment && Data.ptranstype == trantype) {
                    if (Data.pchqonhandstatus == 'Y') DepositBankDisable = true;
                    else if (Data.pchqonhandstatus == 'N') DepositBankDisable = false;
                }
            });
            const pUpinameControl = <FormGroup>this.GeneralReceiptForm['controls']['pUpiname'];
            if (trantype == 'ONLINE' && type == 'UPI') {
                this.showupi = true;
                this._commonService.GetGlobalUPINames().subscribe(
                    (json: null) => { if (json != null) this.upinameslist = json; },
                    (error: any) => this._commonService.showErrorMessage(error)
                );
                pUpinameControl.setValidators(Validators.required);
            } else {
                this.showupi = false;
                pUpinameControl.clearValidators();
            }
            const DepositBankIDControl = <FormGroup>this.GeneralReceiptForm['controls']['pdepositbankid'];
            this.DepositBankDisable = this.DepositBankDisable;
            if (this.DepositBankDisable) DepositBankIDControl.clearValidators();
            else DepositBankIDControl.setValidators(Validators.required);
            DepositBankIDControl.updateValueAndValidity();
        }
    }

    bankName_Change($event: any): void {
        const pbankid = $event;
        this.upinameslist = []; this.chequenumberslist = [];
        this.GeneralReceiptForm.get('pUpiname')?.setValue('');
        this.GeneralReceiptForm.get('pUpiid')?.setValue('');
        if (pbankid && pbankid !== '') {
            this.getBankBranchName(pbankid);
            const selectedBank = this.banklist.find((x: any) => x.pbankid == pbankid);
            if (selectedBank) this.GeneralReceiptForm.get('pbankname')?.setValue(selectedBank.pbankname);
        } else {
            this.GeneralReceiptForm.get('pbankname')?.setValue('');
        }
    }

    getBankBranchName(pbankid: any): void {
        if (!pbankid) {
            this.GeneralReceiptForm.controls['pbranchname'].setValue('');
            this.setBalances('BANKBOOK', 0); this.setBalances('PASSBOOK', 0); return;
        }
        const selectedBank = this.banklist.find((bank: any) => bank.pbankid === pbankid);
        if (selectedBank) {
            this.GeneralReceiptForm.controls['pbranchname'].setValue(selectedBank.pbranchname || '');
            this.setBalances('BANKBOOK', selectedBank.pbankbalance || 0);
            this.setBalances('PASSBOOK', selectedBank.pbankpassbookbalance || 0);
        }
    }

    addvalidations(): boolean {
        this.formValidationMessages = {};
        let isValid = true;
        isValid = this.GetValidationByControl(this.GeneralReceiptForm, 'ppartyid', isValid);
        if (isValid) {
            let verifyamount = this.GeneralReceiptForm.get('preceiptslist.pactualpaidamount')?.value;
            if (verifyamount == 0) this.GeneralReceiptForm.get('preceiptslist.pactualpaidamount')?.setValue('');
            const formControl = <FormGroup>this.GeneralReceiptForm['controls']['preceiptslist'];
            isValid = this.checkValidations(formControl, isValid);
            if (isValid) {
                this.BlurEventAllControll(formControl);
                let ledgerid = formControl.controls['pledgerid'].value;
                let subledgerid = formControl.controls['psubledgerid'].value;
                let griddata = this.paymentslist;
                let count = 0, bank_count = 0;
                for (let i = 0; i < griddata.length; i++) {
                    if (griddata[i].pledgerid == ledgerid && griddata[i].psubledgerid == subledgerid) { count = 1; break; }
                    for (let j = 0; j < this.banklist.length; j++) {
                        if (this.banklist[j].paccountid == griddata[i].psubledgerid || this.banklist[j].paccountid == subledgerid) { count = 1; bank_count = 1; break; }
                    }
                }
                if (count == 1) {
                    this._commonService.showWarningMessage(bank_count == 1 ? 'Bank Accounts only one record in the grid' : 'Ledger & Sub Ledger is already exists');
                    isValid = false;
                }
            }
        }
        return isValid;
    }

    addPaymentDetails(): void {
        debugger;
        const ledgerControl = this.GeneralReceiptForm.get('preceiptslist.pledgerid');
        const subLedgerControl = this.GeneralReceiptForm.get('preceiptslist.psubledgerid');
        const actualAmountControl = this.GeneralReceiptForm.get('preceiptslist.pactualpaidamount');

        ledgerControl?.setValidators(Validators.required);
        // Amount — REQUIRED + POSITIVE + NUMERIC
        actualAmountControl?.setValidators([
            Validators.required, positiveAmountValidator,
            Validators.pattern(/^[0-9,]+(\.[0-9]{1,2})?$/)
        ]);
        ledgerControl?.updateValueAndValidity();
        actualAmountControl?.updateValueAndValidity();

        if (!this.addvalidations()) return;

        const accountHeadId = ledgerControl?.value;
        const subCategoryId = subLedgerControl?.value;
        const paidAmount = Number(this._commonService.removeCommasInAmount(actualAmountControl?.value)) || 0;

        this._SubscriberJVService.GetdebitchitCheckbalance(
            this._commonService.getbranchname(), accountHeadId, 36, subCategoryId,
            this._commonService.getschemaname(), this._commonService.getCompanyCode(), this._commonService.getBranchCode()
        ).subscribe({
            next: (result: any) => {
                const balanceAmount = Number(this._commonService.removeCommasInAmount(result?.balanceamount)) || 0;
                const balanceCheckStatus = result?.balancecheckstatus === true || result?.balancecheckstatus === 'true';
                if (paidAmount >= balanceAmount || balanceCheckStatus) {
                    const control = this.GeneralReceiptForm.get('preceiptslist') as FormGroup;
                    control.patchValue({ pCreatedby: this._commonService.pCreatedby, pModifiedby: this._commonService.pCreatedby });
                    const formValue = control.value;
                    const cleanedData = {
                        ...formValue,
                        pamount: Number(this._commonService.removeCommasInAmount(formValue.pamount)) || 0,
                        pgstamount: Number(this._commonService.removeCommasInAmount(formValue.pgstamount)) || 0,
                        ptotalamount: Number(this._commonService.removeCommasInAmount(formValue.ptotalamount)) || 0,
                        pgstpercentage: Number(formValue.pgstpercentage) || 0,
                        pisgstapplicable: formValue.pisgstapplicable === true
                    };
                    this.temporaryamount = Number(this.temporaryamount) || 0;
                    this.temporaryamount += cleanedData.pamount;
                    this.paymentslist = [...this.paymentslist, cleanedData];
                    this.gridshowhide = true;
                    this.claculateTDSamount();
                    this.getpartyJournalEntryData();
                    this.getPaymentListColumnWisetotals();
                    this.clearPaymentDetails1();
                    this.formValidationMessages = {};
                } else {
                    this._commonService.showWarningMessage('Insufficient balance');
                }
            },
            error: (err) => this._commonService.showErrorMessage(err)
        });
    }

    getPaymentListColumnWisetotals(): void {
        this.paymentlistcolumnwiselist['ptotalamount'] = this.paymentslist.reduce((s: number, c: any) => s + (Number(c.ptotalamount) || 0), 0);
        this.paymentlistcolumnwiselist['pamount'] = this.paymentslist.reduce((s: number, c: any) => s + (Number(c.pamount) || 0), 0);
        this.paymentlistcolumnwiselist['pgstamount'] = this.paymentslist.reduce((s: number, c: any) => s + (Number(c.pgstamount) || 0), 0);
    }

    clearPaymentDetails(): void {
        const control = this.GeneralReceiptForm.get('preceiptslist') as FormGroup;
        control.reset();
        control.patchValue({ pisgstapplicable: this.TempModeofReceipt || false, pStatusname: this._commonService.pStatusname });
        this.showsubledger = true; this.showgstno = false;
        this.subledgeraccountslist = [];
        this.ledgerBalance = `${this.currencySymbol} 0.00 Dr`;
        this.subledgerBalance = `${this.currencySymbol} 0.00 Dr`;
        this.formValidationMessages = {};
    }

    clearPaymentDetails1(): void {
        const control = this.GeneralReceiptForm.get('preceiptslist') as FormGroup;
        const currentLedger = control.get('pledgerid')?.value;
        const currentLedgerName = control.get('pledgername')?.value;
        control.reset();
        if (this.showsubledger) control.patchValue({ pledgerid: currentLedger, pledgername: currentLedgerName });
        control.patchValue({ pisgstapplicable: this.TempModeofReceipt || false, pStatusname: this._commonService.pStatusname });
        this.showgstno = false;
        this.ledgerBalance = `${this.currencySymbol} 0.00 Dr`;
        this.subledgerBalance = `${this.currencySymbol} 0.00 Dr`;
        this.formValidationMessages = {};
    }

    editHandler(event: Event, row: any, rowIndex: number): void { console.log('Edit clicked:', row, rowIndex); }

    getSum(field: string): number {
        return this.paymentslist1.reduce((sum: number, item: any) => sum + Number(item[field] || 0), 0);
    }

    validatesaveGeneralReceipt(): boolean {
        let isValid: boolean = true;
        try {
            isValid = this.checkValidations(this.GeneralReceiptForm, isValid);
            if (this.paymentslist.length === 0) { isValid = false; return isValid; }
            if (this.GeneralReceiptForm.controls['pmodofreceipt'].value === 'CASH') {
                let receiptValue = this.paymentslist.reduce((sum: number, c: { ptotalamount: string }) => sum + (parseFloat(c.ptotalamount) || 0), 0);
                this.bankexists = this.paymentslist.some((payment: { psubledgerid: any }) =>
                    this.banklist.some((bank: { paccountid: any }) => bank.paccountid === payment.psubledgerid));
                let cashRestrict = parseFloat(this.cashRestrictAmount?.toString() || '0');
                let available = parseFloat(this.availableAmount?.toString() || '0');
                if (cashRestrict > 0 && !this.bankexists && available <= receiptValue) {
                    this._commonService.showWarningMessage(
                        `Cash transactions limit below ${this._commonService.currencysymbol}${this._commonService.currencyformat(cashRestrict)}. ` +
                        `Available Amount ${this._commonService.currencysymbol}${this._commonService.currencyformat(available)} only for this Party.`
                    );
                    isValid = false;
                }
            }
        } catch (e) { this._commonService.showErrorMessage(e); isValid = false; }
        return isValid;
    }

    saveGeneralReceipt(): void {
        debugger;
        let date = this.datepipe.transform(this.GeneralReceiptForm.controls['pchequedate'].value, 'dd-MM-yyyy');
        let count = 0;
        this.disablesavebutton = true;
        this.savebutton = 'Processing';
        const accountIds = this.paymentslist.map((x: any) => x.psubledgerid).filter((x: any) => x).join(',');
        const trans_date = this._commonService.getFormatDateNormal(this.GeneralReceiptForm.controls['preceiptdate'].value);
        this._Accountservice.GetCashAmountAccountWise(
            'GENERAL RECEIPT', this._CommonService.getbranchname(), accountIds, trans_date,
            this._CommonService.getschemaname(), this._CommonService.getCompanyCode(), this._CommonService.getBranchCode()
        ).subscribe((result: any[]) => {
            if (this.GeneralReceiptForm.controls['pmodofreceipt'].value === 'C' && this.bankexists === false) {
                for (let i = 0; i < this.paymentslist.length; i++) {
                    const amount = Number(this._commonService.removeCommasInAmount(this.paymentslist[i].ptotalamount || 0));
                    for (let j = 0; j < result.length; j++) {
                        if (this.paymentslist[i].psubledgerid == result[j].psubledgerid) {
                            const finalAmount = Number(result[j].accountbalance || 0) + amount;
                            if (Number(this.cashRestrictAmount || 0) <= finalAmount) { count = 1; break; }
                        }
                    }
                    if (count === 1) break;
                }
            }
            if (count !== 0) {
                this._commonService.showWarningMessage('Subledger per day Cash transactions limit below ' +
                    this._commonService.currencysymbol + this._commonService.currencyformat(this.cashRestrictAmount));
                this.disablesavebutton = false; this.savebutton = 'Save'; return;
            }
            if (!confirm('Do You Want to Save ?')) { this.disablesavebutton = false; this.savebutton = 'Save'; return; }
            const totalamount = Number(this._commonService.removeCommasInAmount(this.paymentlistcolumnwiselist?.ptotalamount || 0));
            // let payload: any = {
            //     ...this.GeneralReceiptForm.value,
            //     pStatusid: '', pStatusname: '', pEffectfromdate: '', pEffecttodate: '', pipaddress: '',
            //     global_schema: this._commonService.getschemaname(), branch_schema: this._commonService.getbranchname(),
            //     companycode: this._commonService.getCompanyCode(), branchcode: this._commonService.getBranchCode(),
            //     branchid: this._commonService.getbrachid() || 1,
            //     pCreatedby: this._commonService.getCreatedBy() || 0, pModifiedby: 0, ptypeofoperation: 'CREATE',
            //     preceiptid: '', preceiptno: 'string', preceiptdate: trans_date,
            //     pmodofreceipt: this.GeneralReceiptForm.value.pmodofreceipt || '',
            //     ptotalreceivedamount: totalamount || 0, pnarration: this.GeneralReceiptForm.value.pnarration || '',
            //     ppartyname: this.GeneralReceiptForm.value.ppartyname || '',
            //     ppartyid: this.GeneralReceiptForm.value.ppartyid || 0,
            //     pistdsapplicable: this.GeneralReceiptForm.value.pistdsapplicable || false,
            //     pTdsSectionId: this.GeneralReceiptForm.get('pTdsSection')?.value || 0,
            //     pTdsPercentage: this.GeneralReceiptForm.value.pTdsPercentage || 0,
            //     ptdsamount: this.GeneralReceiptForm.value.ptdsamount || 0,
            //     pTdsSection: this.GeneralReceiptForm.get('pTdsSection')?.value || 0,
            //     pchequedate: date, pbankid: this.GeneralReceiptForm.value.pbankid || 0,
            //     pRecordid: 0, pDocStorePath: '',
            //     preceiptslist: this.paymentslist.map((x: any) => ({
            //         psubledgerid: x.psubledgerid || 0, psubledgername: x.psubledgername || '',
            //         pledgerid: x.pledgerid || 0, pledgername: x.pledgername || '',
            //         id: '', text: '', ptranstype: '', accountbalance: '',
            //         pamount: this._commonService.removeCommasInAmount(x.pamount || 0),
            //         pgsttype: x.pgsttype || '', pgstcalculationtype: x.pgstcalculationtype || '',
            //         pgstpercentage: x.pgstpercentage || 0,
            //         pigstamount: x.pigstamount || 0, pcgstamount: x.pcgstamount || 0,
            //         psgstamount: x.psgstamount || 0, putgstamount: x.putgstamount || 0,
            //         pState: x.pState || '', pStateId: x.pStateId || 0, pgstno: 0,
            //         pisgstapplicable: x.pisgstapplicable || false,
            //         pgstamount: x.pgstamount || 0, pactualpaidamount: x.pactualpaidamount || 0,
            //         ptotalamount: x.ptotalamount || 0
            //     }))
            // };


            let payload: any = {

                ...this.GeneralReceiptForm.value,

                pStatusid: "",
                pStatusname: "",
                pEffectfromdate: "",
                pEffecttodate: "",
                pipaddress: "",

                global_schema: this._commonService.getschemaname(),
                branch_schema: this._commonService.getbranchname(),

                companycode: this._commonService.getCompanyCode(),
                branchcode: this._commonService.getBranchCode(),
                branchid: this._commonService.getbrachid() || 1,

                pCreatedby: this._commonService.getCreatedBy() || 0,
                pModifiedby: 0,
                ptypeofoperation: "CREATE",

                preceiptid: "",
                preceiptno: "string",
                preceiptdate: trans_date,

                pmodofreceipt: this.GeneralReceiptForm.value.pmodofreceipt || "",

                ptotalreceivedamount: totalamount || 0,
                pnarration: this.GeneralReceiptForm.value.pnarration || "",

                ppartyname: this.GeneralReceiptForm.value.ppartyname || "",
                ppartyid: this.GeneralReceiptForm.value.ppartyid || 0,
                ppartypannumber: "",
                ppartyreftype: "",
                ppartyreferenceid: "",

                pistdsapplicable: this.GeneralReceiptForm.value.pistdsapplicable || false,
                pTdsSectionId: this.GeneralReceiptForm.get('pTdsSection')?.value || 0,
                pTdsPercentage: this.GeneralReceiptForm.value.pTdsPercentage || 0,
                ptdsamount: this.GeneralReceiptForm.value.ptdsamount || 0,
                ptdscalculationtype: "",

                ptdsaccountid: 0,
                // pTdsSectionId: this.GeneralReceiptForm.value.pTdsSectionId || 0,
                pTdsSection: this.GeneralReceiptForm.get('pTdsSection')?.value || 0,
                // this.GeneralReceiptForm.controls.pTdsSection.value

                pFilename: "",
                pFilepath: "",
                pFileformat: "",

                pdepositeddate: "",
                pCleardate: "",

                preceiptrecordid: 0,
                groupcode: "",
                pchequestatus: "",
                preferencetext: "",

                formname: "General Receipt",
                chitpaymentid: 0,
                adjustmentid: 0,

                pBankName: this.GeneralReceiptForm.value.pBankName || "",
                pbranchname: this.GeneralReceiptForm.value.pbranchname || "",
                ptranstype: this.GeneralReceiptForm.value.ptranstype || "",
                ptypeofpayment: this.GeneralReceiptForm.value.ptypeofpayment || "",

                pChequenumber: this.GeneralReceiptForm.value.pChequenumber || "",
                // pchequedate: this.GeneralReceiptForm.value.pchequedate || "",
                pchequedate: date,

                pchequedepositdate: "",
                pchequecleardate: "",

                pbankid: this.GeneralReceiptForm.value.pbankid || 0,

                pCardNumber: "",
                pdepositbankid: 0,
                pdepositbankname: "",
                pAccountnumber: this.GeneralReceiptForm.value.pAccountnumber || "",
                challanaNo: "",

                pRecordid: 0,
                pUpiname: "",
                pUpiid: 0,
                pBankconfigurationId: "",

                pDocStorePath: "",

                preceiptslist: this.paymentslist.map((x: any) => ({

                    psubledgerid: x.psubledgerid || 0,
                    psubledgername: x.psubledgername || "",
                    pledgerid: x.pledgerid || 0,
                    pledgername: x.pledgername || "",

                    id: "",
                    text: "",
                    ptranstype: "",
                    accountbalance: "",
                    pAccounttype: "",
                    legalcellReceipt: "",
                    pbranchcode: "",
                    pbranchtype: "",
                    groupcode: "",
                    chitgroupid: "",

                    pamount: this._commonService.removeCommasInAmount(x.pamount || 0),

                    pgsttype: x.pgsttype || "",
                    pgstcalculationtype: x.pgstcalculationtype || "",
                    pgstpercentage: x.pgstpercentage || 0,

                    pigstamount: x.pigstamount || 0,
                    pcgstamount: x.pcgstamount || 0,
                    psgstamount: x.psgstamount || 0,
                    putgstamount: x.putgstamount || 0,

                    pState: x.pState || "",
                    pStateId: x.pStateId || 0,
                    pgstno: 0,

                    pisgstapplicable: x.pisgstapplicable || false,

                    ptdsamountindividual: x.ptdsamountindividual || 0,
                    pTdsSection: x.pTdsSection || "",
                    pTdsPercentage: x.pTdsPercentage || 0,

                    preferencetext: "",

                    pgstamount: x.pgstamount || 0,
                    pigstpercentage: x.pigstpercentage || 0,
                    pcgstpercentage: x.pcgstpercentage || 0,
                    psgstpercentage: x.psgstpercentage || 0,
                    putgstpercentage: x.putgstpercentage || 0,

                    pactualpaidamount: x.pactualpaidamount || 0,
                    ptotalamount: x.ptotalamount || 0

                }))
            };
            console.log('Swagger Payload:', payload);
            this._Accountservice.saveGeneralReceipt(payload).subscribe(
                (res: any) => {
                    if (res === true) {
                        this._commonService.showInfoMessage('Saved successfully');
                        const receipt = btoa(payload.preceiptid + ',General Receipt,,' + this._commonService.getschemaname());
                        window.open('/#/GeneralReceiptReport?id=' + receipt, '_blank');
                        this.ClearGenerealReceipt();
                    }
                    this.disablesavebutton = false; this.savebutton = 'Save';
                },
                (error) => { this._commonService.showErrorMessage(error); this.disablesavebutton = false; this.savebutton = 'Save'; }
            );
        },
            (error) => { this._commonService.showErrorMessage(error); this.disablesavebutton = false; this.savebutton = 'Save'; });
    }

    getpartyJournalEntryData() {
        debugger;
        try {
            let journalentryamount: any;
            this.partyjournalentrylist = [];
            const ledgerdata = this.paymentslist.map((item: { pledgername: any }) => item.pledgername)
                .filter((value: any, index: any, self: any) => self.indexOf(value) === index);
            for (let i = 0; i < ledgerdata.length; i++) {
                journalentryamount = this.paymentslist
                    .filter((c: { pledgername: any }) => c.pledgername === ledgerdata[i])
                    .reduce((sum: any, c: { pamount: any }) => sum + (this._commonService.removeCommasInAmount(c.pamount)), 0);
                this.partyjournalentrylist = [...this.partyjournalentrylist,
                { type: 'General Receipt', accountname: ledgerdata[i], debitamount: journalentryamount, creditamount: '' }];
            }
            [{ f: 'pigstamount', n: 'C-IGST' }, { f: 'pcgstamount', n: 'C-CGST' },
            { f: 'psgstamount', n: 'C-SGST' }, { f: 'putgstamount', n: 'C-UTGST' }].forEach(({ f, n }) => {
                journalentryamount = this.paymentslist.reduce((sum: any, c: any) => sum + (this._commonService.removeCommasInAmount(c[f])), 0);
                if (journalentryamount > 0)
                    this.partyjournalentrylist = [...this.partyjournalentrylist,
                    { type: 'General Receipt', accountname: n, debitamount: journalentryamount, creditamount: '' }];
            });
            journalentryamount = this.paymentslist.reduce((sum: any, c: { ptotalamount: any }) => sum + (this._commonService.removeCommasInAmount(c.ptotalamount)), 0);
            if (journalentryamount > 0) {
                this.GeneralReceiptForm['controls']['ptotalreceivedamount'].setValue(journalentryamount);
                const accountname = this.GeneralReceiptForm.controls['pmodofreceipt'].value == 'CASH' ? 'CASH ON HAND' : 'BANK';
                this.partyjournalentrylist = [...this.partyjournalentrylist,
                { type: 'General Receipt', accountname, debitamount: '', creditamount: journalentryamount }];
            }
        } catch (e) { this._commonService.showErrorMessage(e); }
    }

    public removeHandler(row: { pamount: any }, rowIndex: number) {
        debugger;
        let tempamount = this._commonService.removeCommasInAmount(row.pamount);
        this.temporaryamount -= +tempamount;
        if (rowIndex !== -1) {
            this.paymentslist.splice(rowIndex, 1);
            this.paymentslist1.splice(rowIndex, 1);
            this.paymentslist1 = [...this.paymentslist1];
        }
        if (this.paymentslist.length == 0) {
            this.tempState = ''; this.tempgstno = ''; this.TempGSTtype = '';
            this.TempModeofReceipt = false; this.gridshowhide = false;
            this.clearPaymentDetails();
        }
        this.getpartyJournalEntryData();
        this.getPaymentListColumnWisetotals();
    }

    public getLoadData() {
        this._Accountservice.GetReceiptsandPaymentsLoadingData2(
            'GENERAL RECEIPT', this._commonService.getbranchname(),
            this._commonService.getschemaname(), this._commonService.getCompanyCode(),
            this._commonService.getBranchCode(), 'taxes'
        ).subscribe({
            next: (json: any) => {
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
                    this.cashRestrictAmount = json.cashRestrictAmount;
                }
            },
            error: (error) => this._commonService.showErrorMessage(error)
        });
    }

    GetGlobalBanks(): Observable<any[]> {
        const params = new HttpParams().set('GlobalSchema', 'global');
        return this._CommonService.getAPI('/Accounts/GetGlobalBanks', params, 'YES');
    }

    public gettypeofpaymentdata(): any {
        return this.modeoftransactionslist.filter((payment: { ptranstype: any; ptypeofpayment: any }) =>
            payment.ptranstype != payment.ptypeofpayment);
    }

    tdsSection_Change(event: any): void {
        debugger;
        let group = this.GeneralReceiptForm.get('ppaymentsslistcontrols');
        let pTdsSection = event?.pTdsSection;
        this.tdspercentagelist = [];
        group?.get('pTdsPercentage')?.setValue('');
        group?.get('ptdsamount')?.setValue('');
        if (pTdsSection) this.gettdsPercentage(pTdsSection);
        this.GetValidationByControl(this.GeneralReceiptForm, 'pTdsSection', true);
    }

    gettdsPercentage(ptdssection: any) {
        debugger;
        this.tdspercentagelist = this.tdslist.filter((res: { pTdsSection: any }) => res.pTdsSection == ptdssection);
        this.claculategsttdsamounts();
    }

    tdsPercentage_Change(): void {
        const group = this.GeneralReceiptForm.get('ppaymentsslistcontrols');
        group?.get('ptdsamount')?.setValue('');
        this.claculateTDSamount();
        this.GetValidationByControl(this.GeneralReceiptForm, 'pTdsPercentage', true);
    }

    isgstapplicableChange() {
        debugger;
        this.GeneralReceiptForm.get('preceiptslist.pStateId')?.setValue('');
        this.gst_clear();
        let data = this.GeneralReceiptForm.get('preceiptslist')?.get('pisgstapplicable')?.value;
        let gstControl = <FormGroup>this.GeneralReceiptForm.get('preceiptslist.pgstno');
        let stateControl = <FormGroup>this.GeneralReceiptForm.get('preceiptslist.pStateId');
        if (this.TempGSTtype != '') {
            if (this.TempGSTtype == 'INCLUDE') { this.TempgstshowExclude = false; this.TempgstshowInclude = true; }
            else { this.TempgstshowExclude = true; this.TempgstshowInclude = false; }
            stateControl.setValue(this.tempState);
            gstControl.setValue(this.tempgstno);
            let stateData = this.GetStatedetailsbyId(this.tempState);
            this.showgstamount = true;
            this.showigst = this.showcgst = this.showsgst = this.showutgst = false;
            this.GeneralReceiptForm.get('preceiptslist.pgsttype')?.setValue(stateData.pgsttype);
            if (stateData.pgsttype == 'IGST') this.showigst = true;
            else { this.showcgst = true; if (stateData.pgsttype == 'CGST,SGST') this.showsgst = true; if (stateData.pgsttype == 'CGST,UTGST') this.showutgst = true; }
        } else {
            this.TempgstshowInclude = true; this.TempgstshowExclude = true;
        }
        if (data) {
            this.showgst = true;
            this.GeneralReceiptForm.get('preceiptslist.pgstcalculationtype')?.setValue(this.TempGSTtype === '' ? 'INCLUDE' : this.TempGSTtype);
        } else {
            this.showgst = false;
            this.GeneralReceiptForm.get('preceiptslist.pgstcalculationtype')?.setValue('');
        }
        this.claculategsttdsamounts();
        this.gstvalidation(data);
    }

    GetStatedetailsbyId(pstateid: any): any {
        return (this.statelist.filter((tds: any) => tds.pStateId == pstateid))[0];
    }

    claculategsttdsamounts(): void {
        try {
            const receiptGroup = this.GeneralReceiptForm.get('preceiptslist') as FormGroup;
            let paidamount = Number(this._commonService.removeCommasInAmount(receiptGroup.get('pactualpaidamount')?.value)) || 0;
            const isgstapplicable = receiptGroup.get('pisgstapplicable')?.value;
            const gsttype = receiptGroup.get('pgsttype')?.value;
            const gstcalculationtype = receiptGroup.get('pgstcalculationtype')?.value;
            const igstpercentage = Number(receiptGroup.get('pigstpercentage')?.value) || 0;
            const cgstpercentage = Number(receiptGroup.get('pcgstpercentage')?.value) || 0;
            const sgstpercentage = Number(receiptGroup.get('psgstpercentage')?.value) || 0;
            const utgstpercentage = Number(receiptGroup.get('putgstpercentage')?.value) || 0;
            let actualpaidamount = paidamount;
            let igstamount = 0, cgstamount = 0, sgstamount = 0, utgstamount = 0;
            if (isgstapplicable && paidamount > 0) {
                let totalPercentage = gsttype === 'IGST' ? igstpercentage
                    : gsttype === 'CGST,SGST' ? cgstpercentage + sgstpercentage
                        : gsttype === 'CGST,UTGST' ? cgstpercentage + utgstpercentage : 0;
                let gstamount = gstcalculationtype === 'INCLUDE'
                    ? (paidamount * totalPercentage) / (100 + totalPercentage)
                    : gstcalculationtype === 'EXCLUDE' ? (paidamount * totalPercentage) / 100 : 0;
                gstamount = Math.round(gstamount);
                if (gsttype === 'IGST') igstamount = gstamount;
                else if (gsttype === 'CGST,SGST') { cgstamount = gstamount / 2; sgstamount = gstamount / 2; }
                else if (gsttype === 'CGST,UTGST') { cgstamount = gstamount / 2; utgstamount = gstamount / 2; }
                if (gstcalculationtype === 'INCLUDE') actualpaidamount = paidamount - gstamount;
            }
            receiptGroup.patchValue({
                pamount: actualpaidamount || '',
                pgstamount: igstamount + cgstamount + sgstamount + utgstamount,
                pigstamount: igstamount, pcgstamount: cgstamount,
                psgstamount: sgstamount, putgstamount: utgstamount,
                ptotalamount: Number((actualpaidamount + igstamount + cgstamount + sgstamount + utgstamount).toFixed(2))
            });
        } catch (e) { this._commonService.showErrorMessage(e); }
    }

    claculateTDSamount(): void {
        try {
            const paidAmount = Number(this._commonService.removeCommasInAmount(this.temporaryamount)) || 0;
            const isTdsApplicable = this.GeneralReceiptForm.get('pistdsapplicable')?.value;
            const tdsCalcType = this.GeneralReceiptForm.get('ptdscalculationtype')?.value;
            const tdsPercentage = Number(this._commonService.removeCommasInAmount(this.GeneralReceiptForm.get('pTdsPercentage')?.value)) || 0;
            let tdsAmount = 0;
            if (isTdsApplicable && paidAmount > 0 && tdsPercentage > 0) {
                tdsAmount = tdsCalcType === 'INCLUDE'
                    ? (paidAmount * tdsPercentage) / (100 + tdsPercentage)
                    : tdsCalcType === 'EXCLUDE' ? (paidAmount * tdsPercentage) / 100 : 0;
                tdsAmount = parseFloat(tdsAmount.toFixed(2));
            }
            this.GeneralReceiptForm.get('ptdsamount')?.setValue(tdsAmount, { emitEvent: true });
        } catch (error) { this._commonService.showErrorMessage(error); }
    }

    gstno_change() { this.GetValidationByControl(this.GeneralReceiptForm, 'pgstno', true); }
    pamount_change() { this.claculategsttdsamounts(); }

    gst_clear() {
        ['pigstpercentage', 'pcgstpercentage', 'psgstpercentage', 'putgstpercentage', 'pgstpercentage', 'pgstno']
            .forEach(k => this.GeneralReceiptForm.get(`preceiptslist.${k}`)?.setValue(''));
    }

    state_change($event: any) {
        debugger;
        if (!$event) {
            this.gst_clear();
            this.GeneralReceiptForm.get('preceiptslist.pStateId')?.setValue(null);
            this.GeneralReceiptForm.get('preceiptslist.pState')?.setValue('');
            this.GeneralReceiptForm.get('preceiptslist.pgstno')?.setValue('');
            this.GeneralReceiptForm.get('preceiptslist.pgstpercentage')?.setValue(null);
            this.showgstamount = this.showigst = this.showcgst = this.showsgst = this.showutgst = this.showgstno = false;
            return;
        }
        const pstateid = $event.pStateId;
        this.gst_clear();
        this.showgstamount = this.showigst = this.showcgst = this.showsgst = this.showutgst = this.showgstno = false;
        if (pstateid) {
            let selectedState = this.statelist.find((x: any) => x.pStateId == pstateid);
            if (!selectedState) return;
            this.GeneralReceiptForm.get('preceiptslist.pState')?.setValue(selectedState.pState);
            this.showgstno = !selectedState.gstnumber;
            this.GeneralReceiptForm.get('preceiptslist.pgsttype')?.setValue(selectedState.pgsttype);
            this.GeneralReceiptForm.get('preceiptslist.pgstno')?.setValue(selectedState.gstnumber);
            this.showgstamount = true;
            if (selectedState.pgsttype === 'IGST') this.showigst = true;
            else { this.showcgst = true; if (selectedState.pgsttype === 'CGST,SGST') this.showsgst = true; if (selectedState.pgsttype === 'CGST,UTGST') this.showutgst = true; }
            this.claculategsttdsamounts();
            this.claculateTDSamount();
        }
    }

    ledgerName_Change($event: any): void {
        let pledgerid: any;
        if ($event != undefined) pledgerid = $event.pledgerid;
        this.subledgeraccountslist = [];
        this.GeneralReceiptForm.get('preceiptslist.psubledgerid')?.setValue(null);
        this.GeneralReceiptForm.get('preceiptslist.psubledgername')?.setValue('');
        this.ledgerBalance = `${this.currencySymbol} 0.00 Dr`;
        this.subledgerBalance = `${this.currencySymbol} 0.00 Dr`;
        if (pledgerid && pledgerid != '') {
            const ledgername = $event.pledgername;
            const data = this.ledgeraccountslist.find((l: { pledgerid: any; accountbalance: number }) => l.pledgerid === pledgerid);
            if (data) this.setBalances('LEDGER', data.accountbalance);
            const subLedgerControl = <FormGroup>this.GeneralReceiptForm.get('preceiptslist.psubledgerid');
            subLedgerControl.clearValidators(); subLedgerControl.updateValueAndValidity();
            this.GetSubLedgerData(pledgerid);
            this.GeneralReceiptForm.get('preceiptslist.pledgername')?.setValue(ledgername);
        } else {
            this.setBalances('LEDGER', 0);
            this.GeneralReceiptForm.get('preceiptslist.pledgername')?.setValue('');
        }
    }

    subledger_Change($event: { psubledgerid: any; psubledgername: any }) {
        let psubledgerid: any;
        if ($event != undefined) psubledgerid = $event.psubledgerid;
        this.subledgerBalance = this.currencySymbol + ' 0.00 Dr';
        if (psubledgerid && psubledgerid != '') {
            this.GeneralReceiptForm.get('preceiptslist.psubledgername')?.setValue($event.psubledgername);
            let data = this.subledgeraccountslist.filter((l: { psubledgerid: any }) => l.psubledgerid == psubledgerid)[0];
            this.setBalances('SUBLEDGER', data.accountbalance);
        } else {
            this.GeneralReceiptForm.get('preceiptslist.psubledgername')?.setValue('');
            this.setBalances('SUBLEDGER', 0);
        }
    }

    upiName_Change($event: any): void { }
    upid_change() { }

    GetSubLedgerData(pledgerid: any) {
        this._Accountservice.GetSubLedgerData(pledgerid, 'accounts', 'KAPILCHITS', 'accounts', 'KLC01', 'global').subscribe(
            json => {
                if (json != null) {
                    this.subledgeraccountslist = json;
                    let subLedgerControl = <FormGroup>this.GeneralReceiptForm.get('preceiptslist.psubledgerid');
                    if (this.subledgeraccountslist.length > 0) {
                        this.showsubledger = true;
                        subLedgerControl.setValidators(Validators.required);
                    } else {
                        this.showsubledger = false;
                        subLedgerControl.clearValidators();
                        this.GeneralReceiptForm.get('preceiptslist.psubledgerid')?.setValue(pledgerid);
                        this.GeneralReceiptForm.get('preceiptslist.psubledgername')?.setValue(this.GeneralReceiptForm.get('preceiptslist')?.get('pledgername')?.value);
                    }
                    subLedgerControl.updateValueAndValidity();
                }
            },
            (error) => this._commonService.showErrorMessage(error)
        );
    }

    istdsapplicableChange() {
        let data = this.GeneralReceiptForm.get('pistdsapplicable')?.value;
        if (data) {
            this.showtds = true;
            this.GeneralReceiptForm['controls']['ptdscalculationtype'].setValue('EXCLUDE');
            this.GeneralReceiptForm['controls']['pTdsPercentage'].setValue('');
        } else {
            this.showtds = false;
            this.GeneralReceiptForm['controls']['ptdscalculationtype'].setValue('');
            this.GeneralReceiptForm['controls']['pTdsPercentage'].setValue('');
        }
        this.claculateTDSamount();
        this.tdsvalidation(data);
    }

    tdsvalidation(data: any) {
        this.formValidationMessages = {};
        let TdsSectionControl = this.GeneralReceiptForm['controls']['pTdsSection'];
        let TdsPercentageControl = this.GeneralReceiptForm['controls']['pTdsPercentage'];
        if (data) {
            TdsSectionControl.setValidators([Validators.required]);
            // TDS % — REQUIRED + NUMERIC 0–100
            TdsPercentageControl.setValidators([Validators.required, percentageValidator]);
        } else {
            TdsSectionControl.clearValidators();
            TdsPercentageControl.clearValidators();
        }
        TdsSectionControl.updateValueAndValidity();
        TdsPercentageControl.updateValueAndValidity();
    }

    gstvalidation(data: any) {
        this.formValidationMessages = {};
        let gstpercentageControl = <FormGroup>this.GeneralReceiptForm.get('preceiptslist.pgstpercentage');
        let StateControl = <FormGroup>this.GeneralReceiptForm.get('preceiptslist.pStateId');
        if (data) {
            StateControl.setValidators([Validators.required]);
            // GST % — REQUIRED + NUMERIC 0–100
            gstpercentageControl.setValidators([Validators.required, percentageValidator]);
            this.GeneralReceiptForm.get('preceiptslist.pgstpercentage')?.setValue('');
        } else {
            StateControl.clearValidators();
            gstpercentageControl.clearValidators();
            this.GeneralReceiptForm.get('preceiptslist.pgstpercentage')?.setValue('');
        }
        StateControl.updateValueAndValidity();
        gstpercentageControl.updateValueAndValidity();
        this.formValidationMessages = {};
    }

    tds_Change(): void {
        this.GetValidationByControl(this.GeneralReceiptForm, 'pTdsPercentage', true);
        this.GetValidationByControl(this.GeneralReceiptForm, 'ptdsamount', true);
        this.claculateTDSamount();
    }

    typeofDepositBank(args: any) {
        this.GetValidationByControl(this.GeneralReceiptForm, 'pdepositbankid', true);
        let type = args.target.options[args.target.selectedIndex].text;
        this.GeneralReceiptForm.controls['pdepositbankname'].setValue(type);
        this.getBankBranchName(this.GeneralReceiptForm.controls['pdepositbankid'].value);
    }

    ClearGenerealReceipt() {
        this.GeneralReceiptForm.controls['pmodofreceipt'].setValue('CASH');
        this.Paymenttype('Cash');
        this.GeneralReceiptForm.controls['ppartyid'].setValue(null);
        this.GeneralReceiptForm.controls['ppartyname'].setValue('');
        this.GeneralReceiptForm['controls']['pistdsapplicable'].setValue(false);
        this.istdsapplicableChange();
        this.paymentslist = []; this.paymentslist1 = []; this.partyjournalentrylist = [];
        this.tempState = ''; this.tempgstno = ''; this.TempGSTtype = '';
        this.temporaryamount = 0;
        this.partyBalance = this.currencySymbol + ' 0.00 Dr';
        this.TempModeofReceipt = false;
        this.clearPaymentDetails();
        this.GeneralReceiptForm['controls']['pnarration'].setValue('');
        let date = new Date();
        this.GeneralReceiptForm['controls']['preceiptdate'].setValue(date);
        this.getpartyJournalEntryData();
        this.paymentlistcolumnwiselist = {};
        this.formValidationMessages = {};
        this.GeneralReceiptForm.controls['pFilename'].setValue('');
        this.GeneralReceiptForm.controls['pFileformat'].setValue('');
        this.GeneralReceiptForm.controls['pFilepath'].setValue('');
        this.imageResponse = { name: '', fileType: 'imageResponse', contentType: '', size: 0 };
    }

    // ─── Core validation engine (unchanged from original) ────────────────────
    checkValidations(group: FormGroup, isValid: boolean): boolean {
        try {
            Object.keys(group.controls).forEach((key: string) => {
                isValid = this.GetValidationByControl(group, key, isValid);
            });
        } catch (e) { this.showErrorMessage('e'); return false; }
        return isValid;
    }

    GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
        debugger;
        try {
            let formcontrol = formGroup.get(key);
            if (formcontrol) {
                if (formcontrol instanceof FormGroup) {
                    if (key != 'preceiptslist') this.checkValidations(formcontrol, isValid);
                } else if (formcontrol.validator) {
                    this.formValidationMessages[key] = '';
                    if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                        for (const errorkey in formcontrol.errors) {
                            if (errorkey) {
                                let lablename: string;
                                try { lablename = (document.getElementById(key) as HTMLInputElement).title; }
                                catch { lablename = key; }
                                const errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                                this.formValidationMessages[key] += errormessage + ' ';
                                isValid = false;
                            }
                        }
                    }
                }
            }
        } catch (e) { return false; }
        return isValid;
    }

    showErrorMessage(errorMsg: string): void { this._commonService.showErrorMessage(errorMsg); }

    BlurEventAllControll(formGroup: FormGroup): void {
        try { Object.keys(formGroup.controls).forEach((key: string) => this.setBlurEvent(formGroup, key)); }
        catch (error) { console.error(error); }
    }

    setBlurEvent(formGroup: FormGroup, key: string): void {
        try {
            const control = formGroup.get(key);
            if (!control) return;
            if (control instanceof FormGroup) this.BlurEventAllControll(control);
            else if (control.validator) {
                control.valueChanges.subscribe(() => this.GetValidationByControl(formGroup, key, true));
            }
        } catch (error) { console.error(error); }
    }

    uploadAndProgress(event: any) {
        debugger;
        var extention = event.target.value.substring(event.target.value.lastIndexOf('.') + 1);
        if (!this.validateFile(event.target.value)) {
            this._commonService.showWarningMessage('Upload jpg , png or pdf files');
        } else {
            let file = event.target.files[0];
            if (event && file) {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = e => { this.imageResponse = { name: file.name, fileType: 'imageResponse', contentType: file.type, size: file.size }; };
            }
            let fname = '';
            if (file.length === 0) return;
            var size = 0;
            const formData = new FormData();
            for (var i = 0; i < file.length; i++) {
                size += file[i].size; fname = file[i].name;
                formData.append(file[i].name, file[i]);
                formData.append('NewFileName', 'General Receipt' + '.' + file[i]['name'].split('.').pop());
            }
            this._commonService.fileUploadS3('Account', formData).subscribe((data: any) => {
                debugger;
                if (extention.toLowerCase() == 'pdf') { this.imageResponse.name = data[0]; this.kycFileName = data[0]; this.kycFilePath = data[0]; }
                else { this.kycFileName = data[0]; this.imageResponse.name = data[0]; }
                this.GeneralReceiptForm.controls['pFilename'].setValue(this.kycFileName);
            });
        }
    }

    loadBanks(): void {
        this._Accountservice.GetGlobalBanks('global').subscribe({
            next: (res: any[]) => { this.banklist = (res || []).map(bank => ({ pbankid: bank.bankId, pbankname: bank.bankName })); },
            error: (err) => this._CommonService.showErrorMessage(err)
        });
    }

    BankNameChange(): void { this.GetValidationByControl(this.GeneralReceiptForm, 'pbankname', true); }

    BankIdChange(selectedBankName: string): void {
        this.GetValidationByControl(this.GeneralReceiptForm, 'pbankid', true);
        const bank = this.banklist.find((b: any) => b.pbankname === selectedBankName);
        if (bank) {
            this.GeneralReceiptForm.controls['pbankname'].setValue(bank.pbankname);
            this.GeneralReceiptForm.controls['pbankid'].setValue(bank.pbankname);
        }
    }

    ChequeNoChange() { this.GetValidationByControl(this.GeneralReceiptForm, 'pChequenumber', true); }
    ChequeDateChange() { this.GetValidationByControl(this.GeneralReceiptForm, 'pchequedate', true); }
    CardNoChange() { this.GetValidationByControl(this.GeneralReceiptForm, 'pCardNumber', true); }

    emptySumm() { return null; }

    caclulateSum() {
        this.paymentslist1.forEach((item: any) => {
            this.pAmountSum += item.pamount;
            this.pTotalAMountSum = item.ptotalamount;
            this.pGstAmountSum = item.pgstamount;
        });
    }

    validateFile(fileName: string | null | undefined): boolean {
        try {
            if (!fileName) return true;
            const ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
            return ext === 'jpg' || ext === 'png' || ext === 'pdf';
        } catch (error) { console.error(error); return false; }
    }
// }import { Component, NgModule, OnInit } from '@angular/core';
// import { State, GroupDescriptor, DataResult } from '@progress/kendo-data-query';
// import { SelectableSettings } from '@progress/kendo-angular-grid';
// import { Router } from '@angular/router';
// import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';
// import { FormBuilder, FormGroup, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
// import { DatePickerClasses } from 'primeng/datepicker';
// import { BsDatepickerConfig, BsDatepickerModule, DatepickerDateCustomClasses } from 'ngx-bootstrap/datepicker';
// import { AccountingMasterService } from '../../../services/accounting-master.service';
// import { SubscriberjvService } from '../../../services/Transactions/subscriber/subscriberjv.service';
// import { Observable } from 'rxjs';
// import { CommonService } from '../../../services/common.service';
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// import { SharedModule } from 'primeng/api';
// import { NgSelectModule } from '@ng-select/ng-select';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { ValidationMessageComponent } from '../../../common/validation-message/validation-message.component';
// //import { unwatchFile } from 'fs';
// //import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
// //import { error } from 'console';
// import { TableModule } from 'primeng/table'
// import { HttpParams } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';



// @Component({
//     selector: 'app-general-receipt-new',
//     standalone: true,
//     imports: [CommonModule,
//         FormsModule,
//         ReactiveFormsModule,
//         NgxDatatableModule,
//         SharedModule,
//         NgSelectModule,
//         TableModule,
//         ValidationMessageComponent,
//         BsDatepickerModule,
//         CurrencyPipe],
//     templateUrl: './general-receipt-new.component.html'
// })
// export class GeneralReceiptNewComponent implements OnInit {


//     showModeofPayment = false;
//     GeneralReceiptForm!: FormGroup;
//     myDateValue: Date | undefined;
//     bsValue = new Date();
//     public submitted = false;
//     gridshowhide: any;
//     dateCustomClasses: DatepickerDateCustomClasses[] | undefined;
//     public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
//     public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
//     public bankshowhide: boolean = false;
//     public walletshowhide: boolean = false;
//     public chequeshowhide: boolean = false;
//     public onlineshowhide: boolean = false;
//     public DebitShowhide: boolean = false;
//     public creditShowhide: boolean = false;
//     public banklist: any;
//     public modeoftransactionslist: any;
//     paymentlistcolumnwiselist: any
//     currencySymbol: any;
//     public typeofpaymentlist: any;
//     public ledgeraccountslist: any;
//     public partylist: any;
//     public gstlist: any;
//     public debitcardlist: any;
//     public tdssectionlist: any;
//     public statelist: any;
//     public showgst = true;
//     public showtds = true;
//     public chequenumberslist: any;
//     public upinameslist: any;
//     public Modeofpayment: any;
//     public Transtype: any;
//     public DepositBankDisable: boolean = false;
//     //public StateGSTDisable: boolean = false;
//     public SwitchDisable: boolean = true;
//     public subledgeraccountslist: any;
//     public showigst = false;
//     public showcgst = false;
//     public showsgst = false; //
//     public showutgst = false;
//     public showgstno = false;
//     public showgstamount = false;
//     public showsubledger: boolean = true;
//     public today: Date = new Date();
//     public cashBalance: string = '';
//     public bankBalance: string = '';
//     public bankbookBalance: string = '';
//     public bankpassbookBalance: string = '';
//     public ledgerBalance: string = '';
//     public subledgerBalance: string = '';
//     public partyBalance: string = '';
//     currencyCode!: 'INR'

//     public WalletBalance: number = 0;
//     // public cashBalance: number = 0;
//     // public bankBalance: number = 0;
//     public paymentslist: any = 0;
//     public paymentslist1: any;
//     public partyjournalentrylist: any;

//     public gridState: State = {
//         sort: [],
//         skip: 0,
//         take: 10
//     };
//     public disablesavebutton = false;
//     public savebutton = "Save";
//     public selectableSettings: SelectableSettings | undefined;
//     // public bankbookBalance: any;
//     public TempGSTtype: any = '';
//     public TempModeofReceipt: any = '';
//     // public bankpassbookBalance: any;
//     // public ledgerBalance: any;
//     // public subledgerBalance: any;
//     // public partyBalance: any;
//     public groups: GroupDescriptor[] = [{ field: 'accountname' }];
//     public formValidationMessages: any;
//     public gridView: DataResult | undefined;
//     public showupi: boolean = false;
//     public tdspercentagelist: any;
//     public tdslist: any;
//     public temporaryamount: number = 0;
//     public imageResponse: any;
//     public kycFileName: any;
//     public kycFilePath: any;
//     public data: any;
//     public TempgstshowInclude: boolean = true;
//     public TempgstshowExclude: boolean = true;

//     public tempState: any = '';
//     public tempgstno: any = '';
//     disabletransactiondate = false;
//     public banksList: any;
//     public Bankbuttondata: any = [
//         { id: 1, type: "Cheque", chequeshowhide: true, onlineshowhide: false, DebitShowhide: false, creditShowhide: false },
//         { id: 2, type: "Online", chequeshowhide: false, onlineshowhide: true, DebitShowhide: false, creditShowhide: false },
//         { id: 3, type: "Debit Card", chequeshowhide: false, onlineshowhide: false, DebitShowhide: true, creditShowhide: false },
//         { id: 4, type: "Credit Card", chequeshowhide: false, onlineshowhide: false, DebitShowhide: false, creditShowhide: true }
//     ];

//     public Paymentbuttondata: any = [{ id: 1, type: "Cash", bankshowhide: false, walletshowhide: false }, { id: 2, type: "Bank", bankshowhide: true, walletshowhide: false }, { id: 3, type: "Wallet", bankshowhide: false, walletshowhide: true }];
//     public JSONdataItem: any = [];
//     pAmountSum: any;
//     pTotalAMountSum: any;
//     pGstAmountSum: any;
//     fileName: any;
//     gstnopattern = "^(0[1-9]|[1-2][0-9]|3[0-9])([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}([a-zA-Z0-9]){1}([a-zA-Z]){1}([a-zA-Z0-9]){1}?";
//     cashRestrictAmount: any;
//     bankexists: boolean | undefined;
//     availableAmount: any
//     this: any;

//     constructor(private _CommonService: CommonService, public datepipe: DatePipe, private _FormBuilder: FormBuilder, private _Accountservice: AccountingTransactionsService, private _commonService: CommonService, private _routes: Router, private _accountingmasterserive: AccountingMasterService, private router: Router, private _SubscriberJVService: SubscriberjvService, private _AccountingTransactionsService: AccountingTransactionsService) {
//         // this.dpConfig.containerClass = this._commonService.datePickerPropertiesSetup('containerClass');
//         // this.dpConfig.dateInputFormat = this._commonService.datePickerPropertiesSetup('dateInputFormat');;
//         // // this.dpConfig.minDate = new Date();
//         // this.dpConfig.showWeekNumbers = this._commonService.datePickerPropertiesSetup('showWeekNumbers');;
//         // this.dpConfig1.containerClass = this._commonService.datePickerPropertiesSetup('containerClass');;
//         // this.dpConfig1.dateInputFormat = this._commonService.datePickerPropertiesSetup('dateInputFormat');;
//         // this.dpConfig1.maxDate = new Date();
//         // this.dpConfig1.showWeekNumbers = this._commonService.datePickerPropertiesSetup('showWeekNumbers');;

//         this.dpConfig.maxDate = new Date();
//         this.dpConfig.containerClass = 'theme-dark-blue';
//         this.dpConfig.dateInputFormat = 'DD-MMM-YYYY';
//         this.dpConfig.showWeekNumbers = false;

//         this.dpConfig1.maxDate = new Date();
//         this.dpConfig1.containerClass = 'theme-dark-blue';
//         this.dpConfig1.dateInputFormat = 'DD-MMM-YYYY';
//         this.dpConfig1.showWeekNumbers = false;
//         if (this._commonService.comapnydetails != null)
//             this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;
//     }
//     pAccountnumber_change() {
//         this.formValidationMessages['pAccountnumber'] = '';
//     }

//     ngOnInit(): void {

//         this.currencySymbol = this._commonService.currencysymbol;
//         this.partyBalance = this.currencySymbol + ' 0.00' + ' Dr';
//         this.ledgerBalance = this.currencySymbol + ' 0.00' + ' Dr';
//         this.subledgerBalance = this.currencySymbol + ' 0.00' + ' Dr';
//         this.bankpassbookBalance = this.currencySymbol + ' 0.00' + ' Dr';
//         this.bankbookBalance = this.currencySymbol + ' 0.00' + ' Dr';

//         this.paymentlistcolumnwiselist = {};
//         this.paymentlistcolumnwiselist['ptotalamount'] = 0;
//         this.paymentlistcolumnwiselist['pamount'] = 0;
//         this.paymentlistcolumnwiselist['pgstamount'] = 0;

//         this.formValidationMessages = {};
//         this.paymentslist = [];
//         this.paymentslist1 = [];
//         this.gridshowhide = false;
//         this.GeneralReceiptForm = this._FormBuilder.group({
//             preceiptid: [''],
//             preceiptdate: [''],
//             pmodofreceipt: ['CASH'],
//             ptotalreceivedamount: [0],
//             pnarration: ['', Validators.required],
//             ppartyname: [''],
//             ppartyid: [null, Validators.required],
//             pistdsapplicable: [false],
//             pTdsSection: [''],
//             pTdsPercentage: [0],
//             ptdsamount: [0],
//             ptdscalculationtype: [''],
//             ppartypannumber: [''],
//             pbankname: [''],
//             pbranchname: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
//             schemaname: [this._commonService.getschemaname()],
//             ptranstype: [''],
//             //ptypeofpayment: [''],
//             ptypeofpayment: [null],
//             pAccountnumber: [''],
//             pChequenumber: [''],
//             pchequedate: [this.today],
//             //pbankid: [0],
//             pbankid: [null],
//             pCardNumber: [''],
//             //pdepositbankid: [0],
//             pdepositbankid: [null],
//             pdepositbankname: [''],
//             pRecordid: [0],
//             pUpiname: [''],
//             pUpiid: [''],
//             pstatename: [''],
//             pCreatedby: [this._commonService.getCreatedBy()],
//             pModifiedby: [0],
//             pStatusid: [''],
//             pStatusname: [this._commonService.pStatusname],
//             pEffectfromdate: [''],
//             pEffecttodate: [''],
//             ptypeofoperation: [this._commonService.ptypeofoperation],
//             ppartyreferenceid: [''],
//             ppartyreftype: [''],
//             preceiptslist: this.preceiptslist(),
//             pFilename: [''],
//             pFilepath: [''],
//             pFileformat: [''],
//             pipaddress: [this._CommonService.getIpAddress()],
//             //pCreatedby:[this._CommonService.getcreatedby()],
//             pDocStorePath: ['']
//         });

//         this.GeneralReceiptForm.get('pTdsPercentage')
//             ?.valueChanges.subscribe(() => this.claculateTDSamount());

//         this.GeneralReceiptForm.get('ptdscalculationtype')
//             ?.valueChanges.subscribe(() => this.claculateTDSamount());

//         this.GeneralReceiptForm.get('pistdsapplicable')
//             ?.valueChanges.subscribe(() => this.claculateTDSamount());
//         let date = new Date();
//         this.GeneralReceiptForm['controls']['preceiptdate'].setValue(date);
//         this.Paymenttype('Cash');
//         this.getLoadData();
//         //this.getLoadData()
//         this.isgstapplicableChange();
//         this.istdsapplicableChange();
//         this.BlurEventAllControll(this.GeneralReceiptForm);
//         // this._accountingmasterserive.GetBanks().subscribe(data => {
//         //     debugger;
//         //     this.banksList = data

//         // })
//         sessionStorage.removeItem('schemaNameForReportCall');
//     }
//     trackByFn(index: number, item: any): any {
//         // Use a unique identifier from your item, e.g., pBankId
//         return item?.pBankId || index;
//     }


//     preceiptslist(): FormGroup {
//         return this._FormBuilder.group({
//             pisgstapplicable: [false],
//             pState: [''],
//             pStateId: [''],
//             pgstpercentage: [0],
//             pamount: [0],
//             pgsttype: [''],
//             pgstcalculationtype: [''],
//             pigstamount: [0],
//             pcgstamount: [0],
//             psgstamount: [0],
//             putgstamount: [0],
//             psubledgerid: [null],
//             psubledgername: [''],
//             pledgerid: [null],
//             pledgername: [''],
//             pCreatedby: [this._commonService.pCreatedby],
//             pStatusname: [this._commonService.pStatusname],
//             pModifiedby: [0],
//             pStatusid: [''],
//             pEffectfromdate: [''],
//             pEffecttodate: [''],
//             ptypeofoperation: [this._commonService.ptypeofoperation],
//             pgstamount: [0],
//             pgstno: new FormControl('', Validators.pattern(this.gstnopattern)),
//             pigstpercentage: [''],
//             pcgstpercentage: [''],
//             psgstpercentage: [''],
//             putgstpercentage: [''],
//             pactualpaidamount: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
//             ptotalamount: [0]
//         })
//     }
//     get pgstno() {
//         return this.GeneralReceiptForm.get('pgstno');
//     }
//     public groupChange(groups: GroupDescriptor[]): void {
//         this.groups = groups;
//         this.loadgrid();
//     }
//     private loadgrid(): void {
//         //this.gridView = process(this.partyjournalentrylist, { group: this.groups });
//         let data = this.partyjournalentrylist;
//         this.partyjournalentrylist = [...this.partyjournalentrylist, data];
//     }
//     allowNumbersOnly(event: KeyboardEvent) {
//         const charCode = event.which ? event.which : event.keyCode;

//         // Allow numbers (0-9)
//         if (charCode >= 48 && charCode <= 57) {
//             return true;
//         }

//         // Allow decimal point
//         if (charCode === 46) {
//             return true;
//         }

//         event.preventDefault();
//         return false;
//     }


//     gst_Change($event: any) {
//         debugger;

//         // If gst cleared
//         if (!$event) {

//             this.GeneralReceiptForm.get('preceiptslist.pgstpercentage')?.setValue('');

//             this.GeneralReceiptForm.get('preceiptslist.pigstpercentage')?.setValue('');
//             this.GeneralReceiptForm.get('preceiptslist.pcgstpercentage')?.setValue('');
//             this.GeneralReceiptForm.get('preceiptslist.psgstpercentage')?.setValue('');
//             this.GeneralReceiptForm.get('preceiptslist.putgstpercentage')?.setValue('');

//             this.GeneralReceiptForm.get('preceiptslist.pgstamount')?.setValue(0);
//             this.GeneralReceiptForm.get('preceiptslist.pigstamount')?.setValue(0);
//             this.GeneralReceiptForm.get('preceiptslist.pcgstamount')?.setValue(0);
//             this.GeneralReceiptForm.get('preceiptslist.psgstamount')?.setValue(0);
//             this.GeneralReceiptForm.get('preceiptslist.putgstamount')?.setValue(0);

//             return;
//         }

//         // get selected gst %
//         const gstpercentage = $event.pgstpercentage ? $event.pgstpercentage : $event;

//         // reset percentages first
//         this.GeneralReceiptForm.get('preceiptslist.pigstpercentage')?.setValue('');
//         this.GeneralReceiptForm.get('preceiptslist.pcgstpercentage')?.setValue('');
//         this.GeneralReceiptForm.get('preceiptslist.psgstpercentage')?.setValue('');
//         this.GeneralReceiptForm.get('preceiptslist.putgstpercentage')?.setValue('');

//         // reset amounts
//         this.GeneralReceiptForm.get('preceiptslist.pgstamount')?.setValue(0);
//         this.GeneralReceiptForm.get('preceiptslist.pigstamount')?.setValue(0);
//         this.GeneralReceiptForm.get('preceiptslist.pcgstamount')?.setValue(0);
//         this.GeneralReceiptForm.get('preceiptslist.psgstamount')?.setValue(0);
//         this.GeneralReceiptForm.get('preceiptslist.putgstamount')?.setValue(0);

//         // call calculation
//         if (gstpercentage && gstpercentage !== '') {
//             this.getgstPercentage(gstpercentage);
//         }

//         // recalculate totals
//         this.claculategsttdsamounts();
//         this.claculateTDSamount();
//     }
//     allowIndianAmount(event: KeyboardEvent) {

//         const input = event.target as HTMLInputElement;
//         const value = input.value.replace(/,/g, ''); // remove commas for checking
//         const charCode = event.which ? event.which : event.keyCode;

//         // Allow Backspace, Delete, Arrow Keys, Tab
//         if (
//             charCode === 8 ||  // backspace
//             charCode === 9 ||  // tab
//             charCode === 37 || // left arrow
//             charCode === 39 || // right arrow
//             charCode === 46    // delete (handled below for decimal separately)
//         ) {
//             return true;
//         }

//         // Allow numbers only
//         if (charCode >= 48 && charCode <= 57) {

//             const parts = value.split('.');
//             const integerPart = parts[0];

//             // Restrict to 13 digits before decimal
//             if (integerPart.length >= 13 && input.selectionStart === input.selectionEnd) {
//                 event.preventDefault();
//                 return false;
//             }

//             // Restrict 2 decimal places
//             if (parts.length > 1 && parts[1].length >= 2) {
//                 event.preventDefault();
//                 return false;
//             }

//             return true;
//         }

//         // Allow only ONE decimal point
//         if (charCode === 46) {
//             if (value.includes('.')) {
//                 event.preventDefault();
//                 return false;
//             }
//             return true;
//         }

//         // Block comma typing (let formatter handle commas automatically)
//         if (charCode === 44) {
//             event.preventDefault();
//             return false;
//         }

//         event.preventDefault();
//         return false;
//     }
//     formatIndianAmount() {
//         const control = this.GeneralReceiptForm.get('preceiptslist.pactualpaidamount');
//         if (!control?.value) return;

//         let value = control.value.toString().replace(/,/g, '');
//         let numberValue = Number(value);

//         if (!isNaN(numberValue)) {
//             control.setValue(
//                 numberValue.toLocaleString('en-IN', {
//                     minimumFractionDigits: 0,
//                     maximumFractionDigits: 2
//                 }),
//                 { emitEvent: false }
//             );
//         }
//     }

//     removeCommas() {
//         const control = this.GeneralReceiptForm.get('preceiptslist.pactualpaidamount');
//         if (!control?.value) return;

//         control.setValue(
//             control.value.toString().replace(/,/g, ''),
//             { emitEvent: false }
//         );
//     }

//     getgstPercentage(gstpercentage: any) {
//         let data = this.gstlist.filter(function (tds: { pgstpercentage: any; }) {
//             return tds.pgstpercentage == gstpercentage;
//         });
//         //this.GeneralReceiptForm.get('preceiptslist.pigstpercentage')?.setValue('data[0].pigstpercentage');

//         this.GeneralReceiptForm.get('preceiptslist.pigstpercentage')?.setValue(data[0].pigstpercentage);
//         this.GeneralReceiptForm.get('preceiptslist.pcgstpercentage')?.setValue(data[0].pcgstpercentage);
//         this.GeneralReceiptForm.get('preceiptslist.psgstpercentage')?.setValue(data[0].psgstpercentage);
//         this.GeneralReceiptForm.get('preceiptslist.putgstpercentage')?.setValue(data[0].putgstpercentage);
//         // this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pigstpercentage'].setValue(data[0].pigstpercentage);
//         // this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pcgstpercentage'].setValue(data[0].pcgstpercentage);
//         // this.GeneralReceiptForm['controls']['preceiptslist']['controls']['psgstpercentage'].setValue(data[0].psgstpercentage);
//         // this.GeneralReceiptForm['controls']['preceiptslist']['controls']['putgstpercentage'].setValue(data[0].putgstpercentage);
//         this.claculategsttdsamounts();
//     }
//     partyName_Change($event: any): void {
//         debugger
//         this.availableAmount = 0
//         this.tempState = '';
//         this.tempgstno = '';
//         this.TempGSTtype = '';
//         this.TempModeofReceipt = '';
//         this.TempgstshowInclude = true;
//         this.TempgstshowExclude = true;
//         this.showtds = false;
//         let ppartyid;
//         if ($event != undefined) {
//             ppartyid = $event.ppartyid;
//             //  $('#pledgerid').addClass("required-field");
//             //  $('#pactualpaidamount').addClass("required-field");
//         }
//         this.statelist = [];
//         this.tdssectionlist = [];
//         this.tdspercentagelist = [];
//         this.clearPaymentDetails();
//         this.GeneralReceiptForm['controls']['pistdsapplicable'].setValue(false);
//         this.paymentslist = [];
//         this.paymentslist1 = [];
//         this.partyjournalentrylist = [];
//         //this.gridView = process(this.partyjournalentrylist, { group: this.groups });
//         this.GeneralReceiptForm.get('preceiptslist.pStateId')?.setValue('');
//         this.GeneralReceiptForm.get('preceiptslist.pState')?.setValue('');

//         // this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pStateId'].setValue('');
//         // this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pState'].setValue('');
//         // this.GeneralReceiptForm['controls']['pTdsSection'].setValue('');
//         // this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pStateId'].setValue('');
//         // this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pState'].setValue('');
//         // this.GeneralReceiptForm['controls']['pTdsSection'].setValue('');
//         this.GeneralReceiptForm.controls['pTdsSection'].setValue('')
//         // this.GeneralReceiptForm['controls']['pTdsPercentage'].setValue('');
//         // this.GeneralReceiptForm['controls']['pTdsPercentage'].setValue('');
//         this.GeneralReceiptForm.controls['pTdsPercentage'].setValue(0);
//         this.GeneralReceiptForm.controls['ppartyreferenceid'].setValue('');
//         this.GeneralReceiptForm.controls['ppartyreftype'].setValue('');
//         this.GeneralReceiptForm.controls['ppartypannumber'].setValue('');
//         this.partyBalance = this.currencySymbol + ' 0.00' + ' Dr';
//         let trans_date = this.GeneralReceiptForm.controls['preceiptdate'].value;
//         trans_date = this._commonService.getFormatDateNormal(trans_date);
//         let amt = 0;

//         this._Accountservice.GetCashRestrictAmountpercontact1(
//             'GENERAL RECEIPT',
//             'KGMS',
//             this._CommonService.getbranchname(),
//             ppartyid,
//             trans_date,
//             this._CommonService.getCompanyCode(),
//             this._CommonService.getschemaname(),



//             this._CommonService.getBranchCode()).subscribe((res: any) => {
//                 console.log(res);
//                 const amt = Number(res) || 0; this.availableAmount = (Number(this.cashRestrictAmount) || 0) - amt;
//             },
//                 (error: any) => {
//                     console.error(error); this._commonService.showErrorMessage(error);
//                 }
//             );
//         if (ppartyid && ppartyid !== '') {
//             const ledgername = $event.ppartyname;
//             const pStateId = $event.pStateId; this.getPartyDetailsbyid(ppartyid, pStateId);
//             this.GeneralReceiptForm.controls['ppartyname'].setValue(ledgername);
//             this.GeneralReceiptForm.controls['pstatename'].setValue($event.pstatename);
//             const selectedParty = this.partylist.find((x: any) => x.ppartyid == ppartyid);
//             if (selectedParty) {
//                 this.GeneralReceiptForm.controls['ppartyreferenceid'].setValue(selectedParty.ppartyreferenceid);
//                 this.GeneralReceiptForm.controls['ppartyreftype'].setValue(selectedParty.ppartyreftype);
//                 this.GeneralReceiptForm.controls['ppartypannumber'].setValue(selectedParty.ppartypannumber);
//             }
//         }
//         else {
//             this.setBalances('PARTY', 0); this.GeneralReceiptForm.controls['ppartyname'].setValue('');
//         }

//     }
//     getPartyDetailsbyid(ppartyid: any, pStateId: any) {
//         debugger;
//         this._Accountservice.getPartyDetailsbyid(ppartyid,
//             this._commonService.getbranchname(),
//             this._commonService.getBranchCode(),
//             this._commonService.getCompanyCode(), this._commonService.getschemaname(), 'taxes').subscribe(
//                 (json: any) => {
//                     if (json != null) {
//                         this.tdslist = json.lstTdsSectionDetails;
//                         console.log('tds list:', this.tdslist);

//                         let newdata = json.lstTdsSectionDetails.map((item: any) => item.pTdsSection)
//                             .filter((value: any, index: any, self: any) => self.indexOf(value) === index)
//                         for (let i = 0; i < newdata.length; i++) {
//                             let object = { pTdsSection: newdata[i] }
//                             this.tdssectionlist.push(object);
//                             console.log('tds section list:', this.tdssectionlist);

//                         }
//                         this.statelist = json.statelist;
//                         this.claculategsttdsamounts();
//                         this.claculateTDSamount();
//                         this.setBalances('PARTY', json.accountbalance);
//                     }
//                 },
//                 (error) => {
//                     this._commonService.showErrorMessage(error);
//                 }
//             );
//     }




//     setBalances(
//         balancetype: string,
//         balanceamount: string | number
//     ): void {

//         const amount = Number(balanceamount) || 0;

//         const formattedAmount =
//             this._CommonService.currencyFormat(
//                 Math.abs(amount).toFixed(2)
//             );

//         const balanceDetails =
//             amount < 0
//                 ? `${formattedAmount} Cr`
//                 : `${formattedAmount} Dr`;

//         switch (balancetype) {

//             case 'CASH':
//                 this.cashBalance = balanceDetails;
//                 break;

//             case 'BANK':
//                 this.bankBalance = balanceDetails;
//                 break;

//             case 'BANKBOOK':
//                 this.bankbookBalance =
//                     `${this.currencySymbol} ${balanceDetails}`;
//                 break;

//             case 'PASSBOOK':
//                 this.bankpassbookBalance =
//                     `${this.currencySymbol} ${balanceDetails}`;
//                 break;

//             case 'LEDGER':
//                 this.ledgerBalance =
//                     `${this.currencySymbol} ${balanceDetails}`;
//                 break;

//             case 'SUBLEDGER':
//                 this.subledgerBalance =
//                     `${this.currencySymbol} ${balanceDetails}`;
//                 break;

//             case 'PARTY':
//                 this.partyBalance =
//                     `${this.currencySymbol} ${balanceDetails}`;
//                 break;
//         }
//     }

//     public Paymenttype(type: string) {

//         for (var n = 0; n < this.Paymentbuttondata.length; n++) {
//             if (this.Paymentbuttondata[n].type === type) {
//                 this.bankshowhide = this.Paymentbuttondata[n].bankshowhide;
//                 this.walletshowhide = this.Paymentbuttondata[n].walletshowhide;
//             }
//         }
//         //           this.dpConfig = {
//         //   dateInputFormat: 'YYYY-MM-DD'
//         // };


//         this.GeneralReceiptForm.controls['pbankname'].setValue('');
//         this.GeneralReceiptForm.controls['pChequenumber'].setValue('');
//         this.GeneralReceiptForm.controls['pchequedate'].setValue(this.today);
//         this.GeneralReceiptForm.controls['pdepositbankname'].setValue('');
//         this.GeneralReceiptForm.controls['ptypeofpayment'].setValue('');
//         this.GeneralReceiptForm.controls['pbranchname'].setValue('');
//         this.GeneralReceiptForm.controls['pCardNumber'].setValue('');
//         this.GeneralReceiptForm.controls['pAccountnumber'].setValue('');

//         if (type == 'Bank') {
//             this.GeneralReceiptForm.controls['ptranstype'].setValue('Cheque');
//             this.Banktype('Cheque')
//             this.Modeofpayment = type;
//         }
//         else {
//             this.GeneralReceiptForm.controls['ptranstype'].setValue('');
//             let DepositBankNameControl = this.GeneralReceiptForm.controls['pdepositbankname']
//             //let BankControl = this.GeneralReceiptForm.controls['pbankname'];
//             let BankControl = this.GeneralReceiptForm.controls['pbankid'];
//             let ChequeControl = this.GeneralReceiptForm.controls['pChequenumber']
//             let TypeofPAymentControl = this.GeneralReceiptForm.controls['ptypeofpayment'];
//             let BranchControl = this.GeneralReceiptForm.controls['pbranchname'];
//             let CardNumberControl = this.GeneralReceiptForm.controls['pCardNumber'];
//             let ChequeDateControl = this.GeneralReceiptForm.controls['pchequedate'];
//             let AccountnumberControl = this.GeneralReceiptForm.controls['pAccountnumber'];
//             BankControl.clearValidators();
//             ChequeControl.clearValidators();
//             ChequeDateControl.clearValidators();
//             DepositBankNameControl.clearValidators();
//             TypeofPAymentControl.clearValidators();
//             BranchControl.clearValidators();
//             CardNumberControl.clearValidators();
//             AccountnumberControl.clearValidators();

//             BankControl.updateValueAndValidity();
//             ChequeControl.updateValueAndValidity();
//             DepositBankNameControl.updateValueAndValidity();
//             TypeofPAymentControl.updateValueAndValidity();
//             BranchControl.updateValueAndValidity();
//             CardNumberControl.updateValueAndValidity();
//             ChequeDateControl.updateValueAndValidity();
//             AccountnumberControl.updateValueAndValidity();
//             this.chequeshowhide = false;
//             this.onlineshowhide = false;
//             this.creditShowhide = false;
//             this.DebitShowhide = false;
//             this.Modeofpayment = type;
//             this.Transtype = '';
//             this.DepositBankDisable = false;
//             //this.StateGSTDisable = false;
//             //this.StateGSTDisable = false;
//             this.GeneralReceiptForm.controls['ptranstype'].setValue('');
//         }
//         //this.GeneralReceiptForm.controls['pmodofreceipt'].updateValueAndValidity();
//     }

//     public Banktype(type: string) {
//         debugger;
//         this.validation(type);
//         // this.setBalances('BANKBOOK', 0);
//         // this.setBalances('PASSBOOK', 0);
//         //this.GeneralReceiptForm.controls['pbankname'].setValue('');
//         //this.GeneralReceiptForm.controls['pbankid'].setValue('');
//         this.GeneralReceiptForm.controls['pbankid'].setValue(null);
//         this.GeneralReceiptForm.controls['pChequenumber'].setValue('');
//         this.GeneralReceiptForm.controls['pchequedate'].setValue(this.today);
//         //this.GeneralReceiptForm.controls['pdepositbankname'].setValue('');
//         this.GeneralReceiptForm.controls['pdepositbankid'].setValue(null);

//         this.GeneralReceiptForm.controls['ptypeofpayment'].setValue(null);
//         // this.GeneralReceiptForm.controls['ptypeofpayment'].setValue('');
//         this.GeneralReceiptForm.controls['pbranchname'].setValue('');
//         this.GeneralReceiptForm.controls['pCardNumber'].setValue('');
//         this.GeneralReceiptForm.controls['pAccountnumber'].setValue('');

//         this.Transtype = type;
//         for (var n = 0; n < this.Bankbuttondata.length; n++) {
//             if (this.Bankbuttondata[n].type === type) {
//                 this.chequeshowhide = this.Bankbuttondata[n].chequeshowhide;
//                 this.onlineshowhide = this.Bankbuttondata[n].onlineshowhide;
//                 this.creditShowhide = this.Bankbuttondata[n].creditShowhide;
//                 this.DebitShowhide = this.Bankbuttondata[n].DebitShowhide;
//             }
//         }

//         // for (var i = 0; i > this.ValidationOperation.length; i++) {
//         //   if (type == this.ValidationOperation.type) {
//         //     if (this.ValidationOperation.Condition == true) {
//         //       this.GeneralReceiptForm.controls[this.ValidationOperation.data].setValidators([Validators.required]);
//         //     }
//         //     else {
//         //       this.GeneralReceiptForm.controls[this.ValidationOperation.data].clearValidators();
//         //     }
//         //     this.GeneralReceiptForm.controls[this.ValidationOperation.data].updateValueAndValidity();
//         //   }
//         //   else {
//         //     this.GeneralReceiptForm.controls[this.ValidationOperation.data].clearValidators();
//         //     this.GeneralReceiptForm.controls[this.ValidationOperation.data].updateValueAndValidity();
//         //   }
//         // }
//         // for (var i = 0; i > this.ValidationOperation.length; i++) {
//         //   if (type == this.ValidationOperation.type) {
//         //     if (this.ValidationOperation.Condition == true) {
//         //       this.GeneralReceiptForm.controls[this.ValidationOperation.data].setValidators([Validators.required]);
//         //     }
//         //     else {
//         //       this.GeneralReceiptForm.controls[this.ValidationOperation.data].clearValidators();
//         //     }
//         //     this.GeneralReceiptForm.controls[this.ValidationOperation.data].updateValueAndValidity();
//         //   }
//         //   else {
//         //     this.GeneralReceiptForm.controls[this.ValidationOperation.data].clearValidators();
//         //     this.GeneralReceiptForm.controls[this.ValidationOperation.data].updateValueAndValidity();
//         //   }
//         // }
//         this.GeneralReceiptForm.controls['pdepositbankid'].setValue('');

//         this.GeneralReceiptForm.controls['pdepositbankname'].setValue('');
//         if (type == 'Online') {
//             this.GeneralReceiptForm.controls['ptypeofpayment'].setValue('');
//             this.DepositBankDisable = true;
//         }
//         else {
//             this.GeneralReceiptForm.controls['ptypeofpayment'].setValue(type);
//             if (type == 'Debit Card' || type == 'Credit Card') {

//                 let DepositBankDisable
//                 let Modeofpayment = this.GeneralReceiptForm.controls['pmodofreceipt'].value.toUpperCase();
//                 let trantype = this.Transtype.toUpperCase();
//                 type = type.toUpperCase();
//                 this.modeoftransactionslist.filter(function (Data: { ptypeofpayment: string; pmodofPayment: any; ptranstype: any; pchqonhandstatus: string; }) {
//                     if (Data.ptypeofpayment == type && Data.pmodofPayment == Modeofpayment && Data.ptranstype == trantype) {
//                         if (Data.pchqonhandstatus == 'Y') {
//                             DepositBankDisable = true  //Enable
//                         }
//                         else if (Data.pchqonhandstatus == 'N') {
//                             DepositBankDisable = false  //Disable
//                         }
//                     }
//                 })
//                 const DepositBankIDControl = <FormGroup>this.GeneralReceiptForm['controls']['pdepositbankid'];
//                 this.DepositBankDisable = this.DepositBankDisable
//                 if (this.DepositBankDisable == true) {
//                     DepositBankIDControl.clearValidators();
//                 }
//                 else {
//                     DepositBankIDControl.setValidators(Validators.required)
//                 }
//                 DepositBankIDControl.updateValueAndValidity();
//             }
//         }

//         this.bankbookBalance = this.currencySymbol + ' 0.00' + ' Dr';
//         this.bankpassbookBalance = this.currencySymbol + ' 0.00' + ' Dr';

//         console.log(this.banklist);


//     }
//     deleteRow(index: number): void {

//         if (index === undefined || index === null) return;


//         this.paymentslist.splice(index, 1);


//         this.paymentslist = [...this.paymentslist];


//         if (this.getpartyJournalEntryData) {
//             this.getpartyJournalEntryData();
//         }

//         if (this.getPaymentListColumnWisetotals) {
//             this.getPaymentListColumnWisetotals();
//         }
//     }
//     validation(type: string) {

//         debugger;
//         this.formValidationMessages = {};
//         let ChequeControl = this.GeneralReceiptForm.controls['pChequenumber']
//         let ChequeDateControl = this.GeneralReceiptForm.controls['pchequedate'];
//         let TypeofPaymentControl = this.GeneralReceiptForm.controls['ptypeofpayment']
//         //let BankControl = this.GeneralReceiptForm.controls['pbankname']
//         let BankControl = this.GeneralReceiptForm.controls['pbankid']
//         let CardNumberControl = this.GeneralReceiptForm.controls['pCardNumber']
//         //let BranchControl = this.GeneralReceiptForm.controls['pbranchname']
//         let DepositBankNameControl = this.GeneralReceiptForm.controls['pdepositbankid'];
//         let AccountnumberControl = this.GeneralReceiptForm['controls']['pAccountnumber'];

//         DepositBankNameControl.clearValidators();
//         ChequeControl.setValidators([Validators.required]);
//         TypeofPaymentControl.setValidators([Validators.required]);
//         if (type == 'Online' || type == 'Cheque') {
//             ChequeDateControl.setValidators([Validators.required]);
//             // if (type == 'Online') {
//             BankControl.setValidators([Validators.required]);
//             // }
//             // else {
//             //     BankControl.clearValidators();
//             // }
//             CardNumberControl.clearValidators();
//         }
//         else {
//             ChequeDateControl.clearValidators();
//             BankControl.clearValidators();
//             CardNumberControl.setValidators([Validators.required]);
//         }
//         if (type == 'Cheque') {
//             AccountnumberControl.setValidators([Validators.required]);
//         }
//         else {

//             AccountnumberControl.clearValidators();
//         }

//         AccountnumberControl.updateValueAndValidity();

//         ChequeDateControl.updateValueAndValidity();
//         ChequeControl.updateValueAndValidity();
//         TypeofPaymentControl.updateValueAndValidity();
//         BankControl.updateValueAndValidity();
//         CardNumberControl.updateValueAndValidity();
//         DepositBankNameControl.updateValueAndValidity();
//         //this.BlurEventAllControll(this.GeneralReceiptForm)
//     }

//     typeofPaymentChange(args: any) {
//         debugger;
//         this.GetValidationByControl(this.GeneralReceiptForm, 'ptypeofpayment', true);
//         let type = args.target.options[args.target.selectedIndex].text;
//         // if(type != 'Select'){
//         if (this.Transtype != '') {
//             //console.log(this.modeoftransactionslist);
//             //console.log(JSON.stringify(this.modeoftransactionslist))
//             //console.log(this.modeoftransactionslist);
//             //console.log(JSON.stringify(this.modeoftransactionslist))
//             this.GeneralReceiptForm.controls['pdepositbankid'].setValue('');
//             this.GeneralReceiptForm.controls['pdepositbankname'].setValue('');
//             let DepositBankDisable
//             let Modeofpayment = this.GeneralReceiptForm.controls['pmodofreceipt'].value.toUpperCase();
//             let trantype = this.Transtype.toUpperCase()
//             this.modeoftransactionslist.filter(function (Data: { ptypeofpayment: any; pmodofPayment: any; ptranstype: any; pchqonhandstatus: string; }) {

//                 if (Data.ptypeofpayment == type && Data.pmodofPayment == Modeofpayment && Data.ptranstype == trantype) {
//                     if (Data.pchqonhandstatus == 'Y') {
//                         DepositBankDisable = true
//                     }
//                     else if (Data.pchqonhandstatus == 'N') {
//                         DepositBankDisable = false
//                     }
//                 }
//             })
//             const pUpinameControl = <FormGroup>this.GeneralReceiptForm['controls']['pUpiname'];

//             if (trantype == "ONLINE" && type == "UPI") {
//                 this.showupi = true;
//                 this._commonService.GetGlobalUPINames().subscribe((json: null) => {
//                     if (json != null) {
//                         this.upinameslist = json;
//                     }
//                 }, (error: any) => {
//                     this._commonService.showErrorMessage(error);
//                 });

//                 pUpinameControl.setValidators(Validators.required);
//             }
//             else {
//                 this.showupi = false;
//                 pUpinameControl.clearValidators();
//             }

//             // "BANK"
//             // ptranstype: "Online"
//             // ptypeofoperation: null
//             // ptypeofpayment: "Cheque"
//             const DepositBankIDControl = <FormGroup>this.GeneralReceiptForm['controls']['pdepositbankid'];
//             this.DepositBankDisable = this.DepositBankDisable
//             if (this.DepositBankDisable == true) {
//                 DepositBankIDControl.clearValidators();
//                 // $('#pdepositbankid').removeClass('required-field');
//             }
//             else {
//                 DepositBankIDControl.setValidators(Validators.required)
//                 //$('#pdepositbankid').addClass('required-field');
//             }
//             DepositBankIDControl.updateValueAndValidity();
//         }
//     }

//     bankName_Change($event: any): void {

//         const pbankid = $event;   // For ng-select

//         this.upinameslist = [];
//         this.chequenumberslist = [];

//         this.GeneralReceiptForm.get('pUpiname')?.setValue('');
//         this.GeneralReceiptForm.get('pUpiid')?.setValue('');

//         if (pbankid && pbankid !== '') {

//             // If you really need state details, make sure method exists
//             // this.getStatedetailsbyId(pbankid);

//             this.getBankBranchName(pbankid);

//             // If you want to store bank name instead of id
//             const selectedBank = this.banklist.find((x: any) => x.pbankid == pbankid);

//             if (selectedBank) {
//                 this.GeneralReceiptForm.get('pbankname')?.setValue(selectedBank.pbankname);
//             }

//         } else {
//             this.GeneralReceiptForm.get('pbankname')?.setValue('');
//         }
//     }
//     getBankBranchName(pbankid: any): void {

//         if (!pbankid) {
//             this.GeneralReceiptForm.controls['pbranchname'].setValue('');
//             this.setBalances('BANKBOOK', 0);
//             this.setBalances('PASSBOOK', 0);
//             return;
//         }

//         const selectedBank = this.banklist.find(
//             (bank: any) => bank.pbankid === pbankid
//         );

//         if (selectedBank) {
//             this.GeneralReceiptForm.controls['pbranchname']
//                 .setValue(selectedBank.pbranchname || '');

//             this.setBalances('BANKBOOK', selectedBank.pbankbalance || 0);
//             this.setBalances('PASSBOOK', selectedBank.pbankpassbookbalance || 0);
//         }
//     }
//     addvalidations(): boolean {
//         this.formValidationMessages = {};
//         let isValid = true;
//         isValid = this.GetValidationByControl(this.GeneralReceiptForm, 'ppartyid', isValid);
//         if (isValid) {
//             //let verifyamount = this.this.GeneralReceiptForm.get('preceiptslist.pactualpaidamount')?.value('');
//             let verifyamount = this.GeneralReceiptForm.get('preceiptslist.pactualpaidamount')?.value;
//             if (verifyamount == 0) {
//                 this.GeneralReceiptForm.get('preceiptslist.pactualpaidamount')?.setValue('');
//             }
//             const formControl = <FormGroup>this.GeneralReceiptForm['controls']['preceiptslist'];
//             isValid = this.checkValidations(formControl, isValid);

//             if (isValid) {
//                 this.BlurEventAllControll(formControl);
//                 let ledgerid = formControl.controls['pledgerid'].value;
//                 let subledgerid = formControl.controls['psubledgerid'].value;
//                 let griddata = this.paymentslist;
//                 let count = 0;
//                 let bank_count = 0;
//                 for (let i = 0; i < griddata.length; i++) {
//                     if (griddata[i].pledgerid == ledgerid && griddata[i].psubledgerid == subledgerid) {
//                         count = 1;
//                         //alert("Ledger & Sub Ledger is already exists")
//                         //this._commonService.showWarningMessage("Ledger & Sub Ledger is already exists");
//                         break;
//                     }
//                     for (let j = 0; j < this.banklist.length; j++) {
//                         if (this.banklist[j].paccountid == griddata[i].psubledgerid || this.banklist[j].paccountid == subledgerid) {
//                             count = 1;
//                             bank_count = 1;
//                             break;
//                         }
//                     }
//                 }
//                 if (count == 1) {
//                     if (bank_count == 1)
//                         this._commonService.showWarningMessage("Bank Accounts only one record in the grid");
//                     else
//                         this._commonService.showWarningMessage("Ledger & Sub Ledger is already exists");

//                     isValid = false;
//                 }
//             }
//         }
//         return isValid;
//     }
//     addPaymentDetails(): void {
//         debugger;
//         const ledgerControl = this.GeneralReceiptForm.get('preceiptslist.pledgerid');
//         const subLedgerControl = this.GeneralReceiptForm.get('preceiptslist.psubledgerid');
//         const actualAmountControl = this.GeneralReceiptForm.get('preceiptslist.pactualpaidamount');

//         ledgerControl?.setValidators(Validators.required);
//         actualAmountControl?.setValidators(Validators.required);

//         ledgerControl?.updateValueAndValidity();
//         actualAmountControl?.updateValueAndValidity();

//         if (!this.addvalidations()) return;

//         const accountHeadId = ledgerControl?.value;
//         const subCategoryId = subLedgerControl?.value;

//         const paidAmount = Number(
//             this._commonService.removeCommasInAmount(
//                 actualAmountControl?.value
//             )
//         ) || 0;

//         this._SubscriberJVService
//             .GetdebitchitCheckbalance(
//                 this._commonService.getbranchname(),
//                 accountHeadId,
//                 36,
//                 subCategoryId,
//                 this._commonService.getschemaname(),
//                 this._commonService.getCompanyCode(),
//                 this._commonService.getBranchCode()
//             )
//             .subscribe({
//                 next: (result: any) => {

//                     const balanceAmount = Number(
//                         this._commonService.removeCommasInAmount(result?.balanceamount)
//                     ) || 0;

//                     const balanceCheckStatus =
//                         result?.balancecheckstatus === true ||
//                         result?.balancecheckstatus === "true";

//                     if (paidAmount >= balanceAmount || balanceCheckStatus) {

//                         const control = this.GeneralReceiptForm.get('preceiptslist') as FormGroup;

//                         control.patchValue({
//                             pCreatedby: this._commonService.pCreatedby,
//                             pModifiedby: this._commonService.pCreatedby
//                         });

//                         const formValue = control.value;

//                         const cleanedData = {
//                             ...formValue,
//                             pamount: Number(this._commonService.removeCommasInAmount(formValue.pamount)) || 0,
//                             pgstamount: Number(this._commonService.removeCommasInAmount(formValue.pgstamount)) || 0,
//                             ptotalamount: Number(this._commonService.removeCommasInAmount(formValue.ptotalamount)) || 0,
//                             pgstpercentage: Number(formValue.pgstpercentage) || 0,
//                             pisgstapplicable: formValue.pisgstapplicable === true
//                         };

//                         // Fix temporary amount safely
//                         this.temporaryamount = Number(this.temporaryamount) || 0;
//                         this.temporaryamount += cleanedData.pamount;

//                         // Push only once
//                         this.paymentslist = [...this.paymentslist, cleanedData];

//                         this.gridshowhide = true;

//                         this.claculateTDSamount();
//                         this.getpartyJournalEntryData();
//                         this.getPaymentListColumnWisetotals();

//                         this.clearPaymentDetails1();

//                         this.formValidationMessages = {};

//                     } else {
//                         this._commonService.showWarningMessage('Insufficient balance');
//                     }
//                 },
//                 error: (err) => {
//                     this._commonService.showErrorMessage(err);
//                 }
//             });
//     }
//     getPaymentListColumnWisetotals(): void {

//         this.paymentlistcolumnwiselist['ptotalamount'] =
//             this.paymentslist.reduce((sum: number, c: any) =>
//                 sum + (Number(c.ptotalamount) || 0), 0);

//         this.paymentlistcolumnwiselist['pamount'] =
//             this.paymentslist.reduce((sum: number, c: any) =>
//                 sum + (Number(c.pamount) || 0), 0);

//         this.paymentlistcolumnwiselist['pgstamount'] =
//             this.paymentslist.reduce((sum: number, c: any) =>
//                 sum + (Number(c.pgstamount) || 0), 0);
//     }
//     clearPaymentDetails(): void {

//         const control = this.GeneralReceiptForm.get('preceiptslist') as FormGroup;

//         control.reset();

//         control.patchValue({
//             pisgstapplicable: this.TempModeofReceipt || false,
//             pStatusname: this._commonService.pStatusname
//         });

//         this.showsubledger = true;
//         this.showgstno = false;

//         this.subledgeraccountslist = [];

//         this.ledgerBalance = `${this.currencySymbol} 0.00 Dr`;
//         this.subledgerBalance = `${this.currencySymbol} 0.00 Dr`;

//         this.formValidationMessages = {};
//     }

//     clearPaymentDetails1(): void {

//         const control = this.GeneralReceiptForm.get('preceiptslist') as FormGroup;

//         const currentLedger = control.get('pledgerid')?.value;
//         const currentLedgerName = control.get('pledgername')?.value;

//         control.reset();

//         if (this.showsubledger) {
//             control.patchValue({
//                 pledgerid: currentLedger,
//                 pledgername: currentLedgerName
//             });
//         }

//         control.patchValue({
//             pisgstapplicable: this.TempModeofReceipt || false,
//             pStatusname: this._commonService.pStatusname
//         });

//         this.showgstno = false;

//         this.ledgerBalance = `${this.currencySymbol} 0.00 Dr`;
//         this.subledgerBalance = `${this.currencySymbol} 0.00 Dr`;

//         this.formValidationMessages = {};
//     }
//     editHandler(event: Event, row: any, rowIndex: number): void {
//         console.log('Edit clicked:', row, rowIndex);

//         // Your edit logic here
//     }

//     // clearPaymentVoucher() {
//     //   try {
//     //     this.paymentslist = [];
//     //     this.GeneralReceiptForm.reset();
//     //     //this.cleartranstypeDetails();
//     //     this.clearPaymentDetails();
//     //     this.GeneralReceiptForm['controls']['pmodofreceipt'].setValue('CASH');
//     //     this.Paymenttype('CASH');

//     //     let date = new Date();
//     //     this.GeneralReceiptForm['controls']['ppaymentdate'].setValue(date);
//     //     this.formValidationMessages = {};
//     //this.paymentlistcolumnwiselist = {};
//     //     this.cashBalance = 0;
//     //     this.bankBalance = 0;
//     //     this.bankbookBalance = '0' + ' Dr';;
//     //     this.bankpassbookBalance = '0' + ' Dr';;
//     //     this.ledgerBalance = '0';
//     //     this.subledgerBalance = '0';
//     //     this.partyBalance = '0';
//     //     this.partyjournalentrylist = [];
//     //   } catch (e) {
//     //     this._commonService.showErrorMessage(e);
//     //   }
//     // }
//     getSum(field: string): number {
//         return this.paymentslist1.reduce((sum: number, item: any) => {
//             return sum + Number(item[field] || 0);
//         }, 0);
//     }

//     validatesaveGeneralReceipt(): boolean {
//         let isValid: boolean = true;

//         try {
//             // Run form validations
//             isValid = this.checkValidations(this.GeneralReceiptForm, isValid);

//             // Ensure at least one payment exists
//             if (this.paymentslist.length === 0) {
//                 isValid = false;
//                 return isValid;
//             }

//             // Handle CASH mode restrictions
//             if (this.GeneralReceiptForm.controls['pmodofreceipt'].value === 'CASH') {

//                 // Calculate total receipt value
//                 let receiptValue = this.paymentslist.reduce((sum: number, c: { ptotalamount: string }) => {
//                     const amt = parseFloat(c.ptotalamount) || 0;
//                     return sum + amt;
//                 }, 0);

//                 // Check if any bank exists in payments list
//                 this.bankexists = this.paymentslist.some((payment: { psubledgerid: any; }) =>
//                     this.banklist.some((bank: { paccountid: any; }) => bank.paccountid === payment.psubledgerid)
//                 );

//                 let cashRestrict = parseFloat(this.cashRestrictAmount?.toString() || '0');
//                 let available = parseFloat(this.availableAmount?.toString() || '0');

//                 if (cashRestrict > 0 && !this.bankexists) {
//                     if (available <= receiptValue) {
//                         this._commonService.showWarningMessage(
//                             `Cash transactions limit below ${this._commonService.currencysymbol}${this._commonService.currencyformat(cashRestrict)}. ` +
//                             `Available Amount ${this._commonService.currencysymbol}${this._commonService.currencyformat(available)} only for this Party.`
//                         );
//                         isValid = false;
//                     }
//                 }
//             }

//         } catch (e) {
//             this._commonService.showErrorMessage(e);
//             isValid = false;
//         }

//         return isValid;
//     }

//     saveGeneralReceipt(): void {

//         debugger;
//         let date = this.datepipe.transform(this.GeneralReceiptForm.controls['pchequedate'].value, 'dd-MM-yyyy')
//         let count = 0;
//         this.disablesavebutton = true;
//         this.savebutton = 'Processing';

//         const accountIds = this.paymentslist
//             .map((x: any) => x.psubledgerid)
//             .filter((x: any) => x)
//             .join(',');

//         const trans_date = this._commonService.getFormatDateNormal(
//             this.GeneralReceiptForm.controls['preceiptdate'].value
//         );

//         this._Accountservice.GetCashAmountAccountWise(
//             "GENERAL RECEIPT",
//             this._CommonService.getbranchname(),
//             accountIds,
//             trans_date,
//             this._CommonService.getschemaname(),
//             this._CommonService.getCompanyCode(),
//             this._CommonService.getBranchCode()
//         )
//             .subscribe((result: any[]) => {

//                 if (
//                     this.GeneralReceiptForm.controls['pmodofreceipt'].value === "C" &&
//                     this.bankexists === false
//                 ) {

//                     for (let i = 0; i < this.paymentslist.length; i++) {

//                         const amount = Number(
//                             this._commonService.removeCommasInAmount(
//                                 this.paymentslist[i].ptotalamount || 0
//                             )
//                         );

//                         for (let j = 0; j < result.length; j++) {

//                             if (this.paymentslist[i].psubledgerid == result[j].psubledgerid) {

//                                 const balance = Number(result[j].accountbalance || 0);
//                                 const finalAmount = balance + amount;

//                                 if (Number(this.cashRestrictAmount || 0) <= finalAmount) {
//                                     count = 1;
//                                     break;
//                                 }
//                             }
//                         }

//                         if (count === 1) break;
//                     }
//                 }

//                 if (count !== 0) {

//                     this._commonService.showWarningMessage(
//                         'Subledger per day Cash transactions limit below ' +
//                         this._commonService.currencysymbol +
//                         this._commonService.currencyformat(this.cashRestrictAmount)
//                     );

//                     this.disablesavebutton = false;
//                     this.savebutton = 'Save';
//                     return;
//                 }

//                 if (!confirm("Do You Want to Save ?")) {
//                     this.disablesavebutton = false;
//                     this.savebutton = 'Save';
//                     return;
//                 }

//                 const totalamount = Number(
//                     this._commonService.removeCommasInAmount(
//                         this.paymentlistcolumnwiselist?.ptotalamount || 0
//                     )
//                 );

//                 /* -------- SWAGGER PAYLOAD -------- */

//                 // let payload: any = {

//                 //     ...this.GeneralReceiptForm.value,

//                 //     pRecordid: "0",

//                 //     branchid: String(this._commonService.getbrachid()),
//                 //     companycode: this._commonService.getCompanyCode(),
//                 //     branchcode: this._commonService.getBranchCode(),

//                 //     global_schema: this._commonService.getschemaname(),
//                 //     branch_schema: this._commonService.getbranchname(),

//                 //     preceiptdate: trans_date,
//                 //     ptotalreceivedamount: String(totalamount),

//                 //     pCreatedby: this._commonService.getCreatedBy(),
//                 //     ptypeofoperation: "CREATE",

//                 //     preceiptslist: this.paymentslist.map((x: any) => ({

//                 //         psubledgerid: x.psubledgerid || "",
//                 //         psubledgername: x.psubledgername || "",
//                 //         pledgerid: x.pledgerid || "",
//                 //         pledgername: x.pledgername || "",

//                 //         id: "",
//                 //         text: "",
//                 //         ptranstype: "",
//                 //         accountbalance: "",
//                 //         pAccounttype: "",
//                 //         legalcellReceipt: "",
//                 //         pbranchcode: "",
//                 //         pbranchtype: "",
//                 //         groupcode: "",
//                 //         chitgroupid: "",

//                 //         pamount: String(
//                 //             this._commonService.removeCommasInAmount(x.pamount || 0)
//                 //         ),

//                 //         pgsttype: x.pgsttype || "",
//                 //         pgstcalculationtype: x.pgstcalculationtype || "",
//                 //         pgstpercentage: x.pgstpercentage || "",
//                 //         pigstamount: x.pigstamount || "",
//                 //         pcgstamount: x.pcgstamount || "",
//                 //         psgstamount: x.psgstamount || "",
//                 //         putgstamount: x.putgstamount || "",

//                 //         pState: "",
//                 //         pStateId: "",
//                 //         pgstno: "",

//                 //         pisgstapplicable: x.pisgstapplicable || "",

//                 //         ptdsamountindividual: x.ptdsamountindividual || "",
//                 //         pTdsSection: x.pTdsSection || "",
//                 //         pTdsPercentage: x.pTdsPercentage || "",

//                 //         preferencetext: ""

//                 //     }))
//                 // };

//                 // let payload: any = {

//                 //     ...this.GeneralReceiptForm.value,

//                 //     pStatusid: "",
//                 //     pStatusname: "",
//                 //     pEffectfromdate: "",
//                 //     pEffecttodate: "",
//                 //     pipaddress: "",

//                 //     global_schema: this._commonService.getschemaname(),
//                 //     branch_schema: this._commonService.getbranchname(),

//                 //     companycode: this._commonService.getCompanyCode(),
//                 //     branchcode: this._commonService.getBranchCode(),
//                 //     branchid: String(this._commonService.getbrachid()),

//                 //     pCreatedby: this._commonService.getCreatedBy(),
//                 //     ptypeofoperation: "CREATE",

//                 //     preceiptid: "",
//                 //     preceiptno: "",
//                 //     preceiptdate: trans_date,
//                 //     pmodofreceipt: this.GeneralReceiptForm.value.pmodofreceipt || "",

//                 //     ptotalreceivedamount: Number(totalamount) || 0,
//                 //     pnarration: this.GeneralReceiptForm.value.pnarration || "",

//                 //     // -------- Party --------
//                 //     ppartyname: this.GeneralReceiptForm.value.ppartyname || "",
//                 //     ppartyid: this.GeneralReceiptForm.value.ppartyid || null,
//                 //     ppartypannumber: "",
//                 //     ppartyreftype: "",
//                 //     ppartyreferenceid: "",

//                 //     pistdsapplicable: this.GeneralReceiptForm.value.pistdsapplicable || false,
//                 //     pTdsSection: "",
//                 //     pTdsPercentage: Number(this.GeneralReceiptForm.value.pTdsPercentage) || 0,
//                 //     ptdsamount: Number(this.GeneralReceiptForm.value.ptdsamount) || 0,
//                 //     ptdscalculationtype: "",
//                 //     ptdsaccountid: "",
//                 //     pTdsSectionId: "",

//                 //     pFilename: "",
//                 //     pFilepath: "",
//                 //     pFileformat: "",

//                 //     pCleardate: "",
//                 //     pdepositeddate: "",

//                 //     preceiptrecordid: "",
//                 //     groupcode: "",
//                 //     pchequestatus: "",
//                 //     preferencetext: "",
//                 //     formname: "General Receipt",
//                 //     chitpaymentid: "",
//                 //     adjustmentid: "",

//                 //     pBankName: this.GeneralReceiptForm.value.pBankName || "",
//                 //     pbranchname: this.GeneralReceiptForm.value.pbranchname || "",
//                 //     ptranstype: this.GeneralReceiptForm.value.ptranstype || "",
//                 //     ptypeofpayment: this.GeneralReceiptForm.value.ptypeofpayment || "",
//                 //     pChequenumber: this.GeneralReceiptForm.value.pChequenumber || "",
//                 //     pchequedate: this.GeneralReceiptForm.value.pchequedate || "",
//                 //     pchequedepositdate: "",
//                 //     pchequecleardate: "",
//                 //     pbankid: this.GeneralReceiptForm.value.pbankid || 0,
//                 //     pCardNumber: "",
//                 //     pdepositbankid: 0,
//                 //     pdepositbankname: "",
//                 //     pAccountnumber: this.GeneralReceiptForm.value.pAccountnumber || "",
//                 //     ChallanaNo: "",

//                 //     pRecordid: "0",
//                 //     pUpiname: "",
//                 //     pUpiid: "",
//                 //     pBankconfigurationId: "",

//                 //     preceiptslist: this.paymentslist.map((x: any) => ({

//                 //         psubledgerid: x.psubledgerid || "",
//                 //         psubledgername: x.psubledgername || "",
//                 //         pledgerid: x.pledgerid || "",
//                 //         pledgername: x.pledgername || "",

//                 //         id: "",
//                 //         text: "",
//                 //         ptranstype: "",
//                 //         accountbalance: "",
//                 //         pAccounttype: "",
//                 //         legalcellReceipt: "",
//                 //         pbranchcode: "",
//                 //         pbranchtype: "",
//                 //         groupcode: "",
//                 //         chitgroupid: "",

//                 //         pamount: Number(this._commonService.removeCommasInAmount(x.pamount || 0)),

//                 //         pgsttype: x.pgsttype || "",
//                 //         pgstcalculationtype: x.pgstcalculationtype || "",
//                 //         pgstpercentage: Number(x.pgstpercentage) || 0,

//                 //         pigstamount: Number(x.pigstamount) || 0,
//                 //         pcgstamount: Number(x.pcgstamount) || 0,
//                 //         psgstamount: Number(x.psgstamount) || 0,
//                 //         putgstamount: Number(x.putgstamount) || 0,

//                 //         pState: "",
//                 //         pStateId: "",
//                 //         pgstno: "",

//                 //         pisgstapplicable: x.pisgstapplicable || false,

//                 //         ptdsamountindividual: Number(x.ptdsamountindividual) || 0,
//                 //         pTdsSection: x.pTdsSection || "",
//                 //         pTdsPercentage: Number(x.pTdsPercentage) || 0,

//                 //         preferencetext: "",

//                 //         pgstamount: Number(x.pgstamount) || 0,
//                 //         pigstpercentage: Number(x.pigstpercentage) || 0,
//                 //         pcgstpercentage: Number(x.pcgstpercentage) || 0,
//                 //         psgstpercentage: Number(x.psgstpercentage) || 0,
//                 //         putgstpercentage: Number(x.putgstpercentage) || 0,

//                 //         pactualpaidamount: Number(x.pactualpaidamount) || 0,
//                 //         ptotalamount: Number(x.ptotalamount) || 0

//                 //     }))
//                 // };


//                 console.log('hgjkilhi', this.GeneralReceiptForm.value,);


//                 let payload: any = {

//                     ...this.GeneralReceiptForm.value,

//                     pStatusid: "",
//                     pStatusname: "",
//                     pEffectfromdate: "",
//                     pEffecttodate: "",
//                     pipaddress: "",

//                     global_schema: this._commonService.getschemaname(),
//                     branch_schema: this._commonService.getbranchname(),

//                     companycode: this._commonService.getCompanyCode(),
//                     branchcode: this._commonService.getBranchCode(),
//                     branchid: this._commonService.getbrachid() || 1,

//                     pCreatedby: this._commonService.getCreatedBy() || 0,
//                     pModifiedby: 0,
//                     ptypeofoperation: "CREATE",

//                     preceiptid: "",
//                     preceiptno: "string",
//                     preceiptdate: trans_date,

//                     pmodofreceipt: this.GeneralReceiptForm.value.pmodofreceipt || "",

//                     ptotalreceivedamount: totalamount || 0,
//                     pnarration: this.GeneralReceiptForm.value.pnarration || "",

//                     ppartyname: this.GeneralReceiptForm.value.ppartyname || "",
//                     ppartyid: this.GeneralReceiptForm.value.ppartyid || 0,
//                     ppartypannumber: "",
//                     ppartyreftype: "",
//                     ppartyreferenceid: "",

//                     pistdsapplicable: this.GeneralReceiptForm.value.pistdsapplicable || false,
//                     pTdsSectionId: this.GeneralReceiptForm.get('pTdsSection')?.value || 0,
//                     pTdsPercentage: this.GeneralReceiptForm.value.pTdsPercentage || 0,
//                     ptdsamount: this.GeneralReceiptForm.value.ptdsamount || 0,
//                     ptdscalculationtype: "",

//                     ptdsaccountid: 0,
//                     // pTdsSectionId: this.GeneralReceiptForm.value.pTdsSectionId || 0,
//                     pTdsSection: this.GeneralReceiptForm.get('pTdsSection')?.value || 0,
//                     // this.GeneralReceiptForm.controls.pTdsSection.value

//                     pFilename: "",
//                     pFilepath: "",
//                     pFileformat: "",

//                     pdepositeddate: "",
//                     pCleardate: "",

//                     preceiptrecordid: 0,
//                     groupcode: "",
//                     pchequestatus: "",
//                     preferencetext: "",

//                     formname: "General Receipt",
//                     chitpaymentid: 0,
//                     adjustmentid: 0,

//                     pBankName: this.GeneralReceiptForm.value.pBankName || "",
//                     pbranchname: this.GeneralReceiptForm.value.pbranchname || "",
//                     ptranstype: this.GeneralReceiptForm.value.ptranstype || "",
//                     ptypeofpayment: this.GeneralReceiptForm.value.ptypeofpayment || "",

//                     pChequenumber: this.GeneralReceiptForm.value.pChequenumber || "",
//                     // pchequedate: this.GeneralReceiptForm.value.pchequedate || "",
//                     pchequedate: date,

//                     pchequedepositdate: "",
//                     pchequecleardate: "",

//                     pbankid: this.GeneralReceiptForm.value.pbankid || 0,

//                     pCardNumber: "",
//                     pdepositbankid: 0,
//                     pdepositbankname: "",
//                     pAccountnumber: this.GeneralReceiptForm.value.pAccountnumber || "",
//                     challanaNo: "",

//                     pRecordid: 0,
//                     pUpiname: "",
//                     pUpiid: 0,
//                     pBankconfigurationId: "",

//                     pDocStorePath: "",

//                     preceiptslist: this.paymentslist.map((x: any) => ({

//                         psubledgerid: x.psubledgerid || 0,
//                         psubledgername: x.psubledgername || "",
//                         pledgerid: x.pledgerid || 0,
//                         pledgername: x.pledgername || "",

//                         id: "",
//                         text: "",
//                         ptranstype: "",
//                         accountbalance: "",
//                         pAccounttype: "",
//                         legalcellReceipt: "",
//                         pbranchcode: "",
//                         pbranchtype: "",
//                         groupcode: "",
//                         chitgroupid: "",

//                         pamount: this._commonService.removeCommasInAmount(x.pamount || 0),

//                         pgsttype: x.pgsttype || "",
//                         pgstcalculationtype: x.pgstcalculationtype || "",
//                         pgstpercentage: x.pgstpercentage || 0,

//                         pigstamount: x.pigstamount || 0,
//                         pcgstamount: x.pcgstamount || 0,
//                         psgstamount: x.psgstamount || 0,
//                         putgstamount: x.putgstamount || 0,

//                         pState: x.pState || "",
//                         pStateId: x.pStateId || 0,
//                         pgstno: 0,

//                         pisgstapplicable: x.pisgstapplicable || false,

//                         ptdsamountindividual: x.ptdsamountindividual || 0,
//                         pTdsSection: x.pTdsSection || "",
//                         pTdsPercentage: x.pTdsPercentage || 0,

//                         preferencetext: "",

//                         pgstamount: x.pgstamount || 0,
//                         pigstpercentage: x.pigstpercentage || 0,
//                         pcgstpercentage: x.pcgstpercentage || 0,
//                         psgstpercentage: x.psgstpercentage || 0,
//                         putgstpercentage: x.putgstpercentage || 0,

//                         pactualpaidamount: x.pactualpaidamount || 0,
//                         ptotalamount: x.ptotalamount || 0

//                     }))
//                 };


//                 console.log("Swagger Payload:", payload);

//                 this._Accountservice.saveGeneralReceipt(payload).subscribe(

//                     (res: any) => {

//                         if (res === true) {

//                             this._commonService.showInfoMessage("Saved successfully");

//                             let receipt = btoa(
//                                 payload.preceiptid + ',' +
//                                 'General Receipt' + ',' +
//                                 '' + ',' +
//                                 this._commonService.getschemaname()
//                             );

//                             window.open('/#/GeneralReceiptReport?id=' + receipt, "_blank");

//                             this.ClearGenerealReceipt();
//                         }

//                         this.disablesavebutton = false;
//                         this.savebutton = 'Save';
//                     },

//                     (error) => {

//                         this._commonService.showErrorMessage(error);

//                         this.disablesavebutton = false;
//                         this.savebutton = 'Save';
//                     }
//                 );

//             },
//                 (error) => {

//                     this._commonService.showErrorMessage(error);

//                     this.disablesavebutton = false;
//                     this.savebutton = 'Save';
//                 });
//     }

//     getpartyJournalEntryData() {
//         debugger;
//         try {
//             let dataobject;
//             let journalentryamount;
//             let tdsjournalentrylist = [];
//             let ledgerdata = this.paymentslist.map((item: { pledgername: any; }) => item.pledgername)
//                 .filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index)

//             let tdssectionwisedata;

//             this.partyjournalentrylist = [];
//             let index = 1;
//             for (let i = 0; i < ledgerdata.length; i++) {

//                 // journalentryamount = this.paymentslist
//                 //   .filter(c => c.pledgername === ledgerdata[i]).reduce((sum, c) => (sum + parseFloat((c.pamount).replace(/,/g, "")) + parseFloat((c.ptdsamount).replace(/,/g, ""))), 0);'
//                 journalentryamount = this.paymentslist
//                     .filter((c: { pledgername: any; }) => c.pledgername === ledgerdata[i]).reduce((sum: string, c: { pamount: any; }) => (sum + (this._commonService.removeCommasInAmount(c.pamount))), 0);
//                 dataobject = { type: 'General Receipt', accountname: ledgerdata[i], debitamount: (journalentryamount), creditamount: '' }
//                 //this.partyjournalentrylist.push(dataobject);
//                 this.partyjournalentrylist = [...this.partyjournalentrylist, dataobject];
//                 let tdsdata = this.paymentslist.filter((c: { pledgername: any; }) => c.pledgername === ledgerdata[i]);
//                 tdssectionwisedata = tdsdata.map((item: { pTdsSection: any; }) => item.pTdsSection)
//                     .filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index)

//                 // for (let j = 0; j < tdssectionwisedata.length; j++) {
//                 //   journalentryamount = tdsdata
//                 //     .filter(c => c.pTdsSection === tdssectionwisedata[j]).reduce((sum, c) => sum + parseFloat((c.ptdsamount).replace(/,/g, "")), 0);
//                 //   dataobject = { type: 'Journal Voucher' + index, accountname: 'TDS-' + tdssectionwisedata[j] + ' RECIVABLE', debitamount: (journalentryamount), creditamount: '' }
//                 //   tdsjournalentrylist.push(dataobject);
//                 // }

//                 //journalentryamount = tdsdata.reduce((sum, c) => sum + parseFloat((c.ptdsamount).replace(/,/g, "")), 0);
//                 // if (journalentryamount > 0) {
//                 //   dataobject = { type: 'Journal Voucher' + index, accountname: ledgerdata[i], debitamount: '', creditamount: (journalentryamount) }
//                 //   tdsjournalentrylist.push(dataobject);
//                 // }
//                 index = index + 1;
//             }

//             journalentryamount = this.paymentslist.reduce((sum: string, c: { pigstamount: any; }) => sum + (this._commonService.removeCommasInAmount(c.pigstamount)), 0);
//             if (journalentryamount > 0) {
//                 dataobject = { type: 'General Receipt', accountname: 'C-IGST', debitamount: (journalentryamount), creditamount: '' }
//                 //this.partyjournalentrylist.push(dataobject);
//                 this.partyjournalentrylist = [...this.partyjournalentrylist, dataobject];
//             }
//             journalentryamount = this.paymentslist.reduce((sum: string, c: { pcgstamount: any; }) => sum + (this._commonService.removeCommasInAmount(c.pcgstamount)), 0);
//             if (journalentryamount > 0) {
//                 dataobject = { type: 'General Receipt', accountname: 'C-CGST', debitamount: (journalentryamount), creditamount: '' }
//                 //this.partyjournalentrylist.push(dataobject);
//                 this.partyjournalentrylist = [...this.partyjournalentrylist, dataobject];
//             }
//             journalentryamount = this.paymentslist.reduce((sum: string, c: { psgstamount: any; }) => sum + (this._commonService.removeCommasInAmount(c.psgstamount)), 0);
//             if (journalentryamount > 0) {
//                 dataobject = { type: 'General Receipt', accountname: 'C-SGST', debitamount: (journalentryamount), creditamount: '' }
//                 //this.partyjournalentrylist.push(dataobject);
//                 this.partyjournalentrylist = [...this.partyjournalentrylist, dataobject];
//             }
//             journalentryamount = this.paymentslist.reduce((sum: string, c: { putgstamount: any; }) => sum + (this._commonService.removeCommasInAmount(c.putgstamount)), 0);
//             if (journalentryamount > 0) {
//                 dataobject = { type: 'General Receipt', accountname: 'C-UTGST', debitamount: (journalentryamount), creditamount: '' }
//                 //this.partyjournalentrylist.push(dataobject);
//                 this.partyjournalentrylist = [...this.partyjournalentrylist, dataobject];
//             }

//             // journalentryamount = this.paymentslist.reduce((sum, c) => sum + parseFloat((c.pamount).replace(/,/g, "")), 0);
//             journalentryamount = this.paymentslist.reduce((sum: string, c: { ptotalamount: any; }) => sum + (this._commonService.removeCommasInAmount(c.ptotalamount)), 0);
//             if (journalentryamount > 0) {
//                 this.GeneralReceiptForm['controls']['ptotalreceivedamount'].setValue((journalentryamount));
//                 if (this.GeneralReceiptForm.controls['pmodofreceipt'].value == "CASH") {
//                     dataobject = { type: 'General Receipt', accountname: 'CASH ON HAND', debitamount: '', creditamount: (journalentryamount) }
//                 }
//                 else {
//                     dataobject = { type: 'General Receipt', accountname: 'BANK', debitamount: '', creditamount: (journalentryamount) }
//                 }
//                 //this.partyjournalentrylist.push(dataobject);
//                 this.partyjournalentrylist = [...this.partyjournalentrylist, dataobject];
//             }
//             // for (let i = 0; i < tdsjournalentrylist.length; i++) {
//             //   this.partyjournalentrylist.push(tdsjournalentrylist[i]);
//             // }

//             // this.partyjournalentrylist.filter(data=>{
//             //     debugger
//             //     if(data.debitamount!=0){
//             //         data.debitamount=(this._commonService.removeCommasInAmount(data.debitamount));
//             //     }
//             //     if(data.creditamount!=0){
//             //         data.creditamount=(this._commonService.removeCommasInAmount(data.creditamount));
//             //     }
//             // })
//             //this.loadgrid();
//         } catch (e) {
//             this._commonService.showErrorMessage(e);
//         }
//     }

//     public removeHandler(row: { pamount: any; }, rowIndex: number) {
//         debugger;
//         let tempamount = row.pamount
//         tempamount = (this._commonService.removeCommasInAmount(tempamount));
//         this.temporaryamount = this.temporaryamount - +tempamount;
//         //const index: number = this.paymentslist.indexOf(dataItem);
//         const index: number = rowIndex;
//         if (index !== -1) {
//             this.paymentslist.splice(index, 1);
//             this.paymentslist1.splice(index, 1);
//             this.paymentslist1 = [...this.paymentslist1];
//         }
//         if (this.paymentslist.length == 0) {
//             this.tempState = '';
//             this.tempgstno = '';
//             this.TempGSTtype = '';
//             this.TempModeofReceipt = false;
//             this.gridshowhide = false;
//             this.clearPaymentDetails()
//         }
//         this.getpartyJournalEntryData();
//         this.getPaymentListColumnWisetotals();
//     }

//     public getLoadData() {


//         this._Accountservice.GetReceiptsandPaymentsLoadingData2(
//             'GENERAL RECEIPT',
//             this._commonService.getbranchname(),
//             this._commonService.getschemaname(),
//             this._commonService.getCompanyCode(),
//             this._commonService.getBranchCode(),
//             'taxes'
//         )
//             .subscribe(
//                 {
//                     next: (json: any) => {

//                         //console.log(json)
//                         if (json != null) {

//                             this.banklist = json.banklist;
//                             this.modeoftransactionslist = json.modeofTransactionslist;  //Bank
//                             this.typeofpaymentlist = this.gettypeofpaymentdata();
//                             this.ledgeraccountslist = json.accountslist;
//                             this.partylist = json.partylist;
//                             this.gstlist = json.gstlist;
//                             this.debitcardlist = json.bankdebitcardslist;
//                             this.setBalances('CASH', json.cashbalance);
//                             this.setBalances('BANK', json.bankbalance);
//                             this.cashRestrictAmount = json.cashRestrictAmount;
//                         }
//                     },
//                     error: (error) => {
//                         this._commonService.showErrorMessage(error);
//                     }
//                 });

//     }
//     GetGlobalBanks(): Observable<any[]> {
//         const params = new HttpParams().set('GlobalSchema', 'global');

//         return this._CommonService.getAPI(
//             '/Accounts/GetGlobalBanks',
//             params,
//             'YES'
//         );
//     }


//     public gettypeofpaymentdata(): any {
//         let data = this.modeoftransactionslist.filter(function (payment: { ptranstype: any; ptypeofpayment: any; }) {
//             return payment.ptranstype != payment.ptypeofpayment;
//         });
//         return data;
//     }
//     // tdsSection_Change($event: any): void {
//     //     const pTdsSection = $event.pTdsSection;
//     //     this.gettdsPercentage(pTdsSection);
//     //     console.log(pTdsSection); // "194JA"
//     // }

//     tdsSection_Change(event: any): void {
//         debugger;
//         let group = this.GeneralReceiptForm.get('ppaymentsslistcontrols');
//         let pTdsSection = event?.pTdsSection;
//         this.tdspercentagelist = [];
//         group?.get('pTdsPercentage')?.setValue('');
//         group?.get('ptdsamount')?.setValue('');

//         if (pTdsSection) {
//             console.log('Selected Section:', pTdsSection);
//             this.gettdsPercentage(pTdsSection);
//         }
//         this.GetValidationByControl(this.GeneralReceiptForm, 'pTdsSection', true);
//     }
//     gettdsPercentage(ptdssection: any) {
//         debugger;
//         this.tdspercentagelist = this.tdslist.filter((res: { pTdsSection: any }) =>
//             res.pTdsSection == ptdssection
//         );
//         this.claculategsttdsamounts();
//     }

//     // gettdsPercentage(pTdsSection: any) {

//     //     const selectedTds = this.tdslist.find(
//     //         (tds: any) => String(tds.pTdsSection) === String(pTdsSection)
//     //     );

//     //     if (selectedTds) {
//     //         // 🔥 THIS LINE IS MANDATORY
//     //         this.tdspercentagelist = [selectedTds];

//     //         this.GeneralReceiptForm.controls['pTdsPercentage']
//     //             .setValue(selectedTds.pTdsPercentage);
//     //     }

//     // }
//     tdsPercentage_Change(): void {
//         const group = this.GeneralReceiptForm.get('ppaymentsslistcontrols');
//         group?.get('ptdsamount')?.setValue('');
//         this.claculateTDSamount();
//         this.GetValidationByControl(this.GeneralReceiptForm, 'pTdsPercentage', true);
//     }
//     // tdsSection_Change($event: any): void {
//     //     debugger
//     //     const pTdsSection = $event.pTdsSection;
//     //     // this.tdspercentagelist = [];
//     //     //this.GeneralReceiptForm['controls']['pTdsPercentage'].setValue('');
//     //     this.GeneralReceiptForm['controls']['pTdsSection'].setValue(pTdsSection);

//     //     if (pTdsSection && pTdsSection != '') {

//     //         this.gettdsPercentage(pTdsSection);

//     //     }
//     //     // this.GetValidationByControl(this.GeneralReceiptForm, 'pTdsSection', true);
//     // }
//     // gettdsPercentage(pTdsSection: any) {
//     //     debugger
//     //     console.log('..........', this.tdslist);

//     //     this.tdspercentagelist = this.tdslist.filter((tds: any) =>
//     //         tds && tds.pTdsSection === pTdsSection
//     //     );
//     //     this.claculategsttdsamounts();
//     //     this.claculateTDSamount();
//     // }

//     isgstapplicableChange() {
//         debugger;

//         this.GeneralReceiptForm.get('preceiptslist.pStateId')?.setValue('');
//         this.gst_clear();
//         //let data = this.GeneralReceiptForm.controls.isGstapplicable.value
//         let data = this.GeneralReceiptForm.get('preceiptslist')?.get('pisgstapplicable')?.value;
//         let gstControl = <FormGroup>this.GeneralReceiptForm.get('preceiptslist.pgstno');
//         let gstpercentageControl = <FormGroup>this.GeneralReceiptForm.get('preceiptslist.pgstpercentage');
//         let stateControl = <FormGroup>this.GeneralReceiptForm.get('preceiptslist.pStateId');
//         let gstamountControl = <FormGroup>this.GeneralReceiptForm.get('preceiptslist.pgstamount');
//         if (this.TempGSTtype != '') {
//             if (this.TempGSTtype == 'INCLUDE') {
//                 this.TempgstshowExclude = false;
//                 this.TempgstshowInclude = true;
//             }
//             else {
//                 this.TempgstshowExclude = true;
//                 this.TempgstshowInclude = false;
//             }

//             //this.StateGSTDisable = true;
//             stateControl.setValue(this.tempState);
//             gstControl.setValue(this.tempgstno)

//             let data = this.GetStatedetailsbyId(this.tempState);

//             this.showgstamount = true;
//             this.showigst = false;
//             this.showcgst = false;
//             this.showsgst = false;
//             this.showutgst = false;

//             this.GeneralReceiptForm.get('preceiptslist.pgsttype')?.setValue(data.pgsttype);

//             if (data.pgsttype == 'IGST')
//                 this.showigst = true;
//             else {
//                 this.showcgst = true;
//                 if (data.pgsttype == 'CGST,SGST')
//                     this.showsgst = true;
//                 if (data.pgsttype == 'CGST,UTGST')
//                     this.showutgst = true;
//             }
//         }
//         else {
//             //this.StateGSTDisable = false;
//             this.TempgstshowInclude = true;
//             this.TempgstshowExclude = true;
//         }
//         if (data) {
//             this.showgst = true;
//             if (this.TempGSTtype == '') {
//                 this.GeneralReceiptForm.get('preceiptslist.pgstcalculationtype')?.setValue('INCLUDE')
//             }
//             else {
//                 this.GeneralReceiptForm.get('preceiptslist.pgstcalculationtype')?.setValue(this.TempGSTtype)
//             }

//         }
//         else {
//             this.showgst = false;
//             this.GeneralReceiptForm.get('preceiptslist.pgstcalculationtype')?.setValue('')
//         }
//         this.claculategsttdsamounts();

//         this.gstvalidation(data);
//     }

//     GetStatedetailsbyId(pstateid: any): any {
//         return (this.statelist.filter(function (tds: any) {
//             return tds.pStateId == pstateid;
//         }))[0];
//     }
//     claculategsttdsamounts(): void {
//         try {

//             const receiptGroup = this.GeneralReceiptForm.get('preceiptslist') as FormGroup;

//             let paidamount = Number(
//                 this._commonService.removeCommasInAmount(
//                     receiptGroup.get('pactualpaidamount')?.value
//                 )
//             ) || 0;

//             const isgstapplicable = receiptGroup.get('pisgstapplicable')?.value;
//             const gsttype = receiptGroup.get('pgsttype')?.value;
//             const gstcalculationtype = receiptGroup.get('pgstcalculationtype')?.value;

//             const igstpercentage = Number(receiptGroup.get('pigstpercentage')?.value) || 0;
//             const cgstpercentage = Number(receiptGroup.get('pcgstpercentage')?.value) || 0;
//             const sgstpercentage = Number(receiptGroup.get('psgstpercentage')?.value) || 0;
//             const utgstpercentage = Number(receiptGroup.get('putgstpercentage')?.value) || 0;

//             let actualpaidamount = paidamount;
//             let igstamount = 0;
//             let cgstamount = 0;
//             let sgstamount = 0;
//             let utgstamount = 0;

//             if (isgstapplicable && paidamount > 0) {

//                 let totalPercentage = 0;

//                 if (gsttype === 'IGST') {
//                     totalPercentage = igstpercentage;
//                 } else if (gsttype === 'CGST,SGST') {
//                     totalPercentage = cgstpercentage + sgstpercentage;
//                 } else if (gsttype === 'CGST,UTGST') {
//                     totalPercentage = cgstpercentage + utgstpercentage;
//                 }

//                 let gstamount = 0;

//                 if (gstcalculationtype === 'INCLUDE') {
//                     gstamount = (paidamount * totalPercentage) / (100 + totalPercentage);
//                     actualpaidamount = paidamount - gstamount;
//                 }
//                 else if (gstcalculationtype === 'EXCLUDE') {
//                     gstamount = (paidamount * totalPercentage) / 100;
//                 }

//                 gstamount = Math.round(gstamount);

//                 if (gsttype === 'IGST') {
//                     igstamount = gstamount;
//                 }
//                 else if (gsttype === 'CGST,SGST') {
//                     cgstamount = gstamount / 2;
//                     sgstamount = gstamount / 2;
//                 }
//                 else if (gsttype === 'CGST,UTGST') {
//                     cgstamount = gstamount / 2;
//                     utgstamount = gstamount / 2;
//                 }
//             }

//             const totalamount = actualpaidamount + igstamount + cgstamount + sgstamount + utgstamount;

//             receiptGroup.patchValue({
//                 pamount: actualpaidamount || '',
//                 pgstamount: igstamount + cgstamount + sgstamount + utgstamount,
//                 pigstamount: igstamount,
//                 pcgstamount: cgstamount,
//                 psgstamount: sgstamount,
//                 putgstamount: utgstamount,
//                 ptotalamount: Number(totalamount.toFixed(2))
//             });

//         } catch (e) {
//             this._commonService.showErrorMessage(e);
//         }
//     }

//     claculateTDSamount(): void {
//         try {

//             const paidAmount = Number(
//                 this._commonService.removeCommasInAmount(this.temporaryamount)
//             ) || 0;

//             const isTdsApplicable =
//                 this.GeneralReceiptForm.get('pistdsapplicable')?.value;

//             const tdsCalculationType =
//                 this.GeneralReceiptForm.get('ptdscalculationtype')?.value;

//             const tdsPercentage = Number(
//                 this._commonService.removeCommasInAmount(
//                     this.GeneralReceiptForm.get('pTdsPercentage')?.value
//                 )
//             ) || 0;

//             let tdsAmount = 0;

//             if (isTdsApplicable && paidAmount > 0 && tdsPercentage > 0) {

//                 if (tdsCalculationType === 'INCLUDE') {
//                     tdsAmount = (paidAmount * tdsPercentage) / (100 + tdsPercentage);
//                 }
//                 else if (tdsCalculationType === 'EXCLUDE') {
//                     tdsAmount = (paidAmount * tdsPercentage) / 100;
//                 }

//                 tdsAmount = parseFloat(tdsAmount.toFixed(2));
//             }

//             this.GeneralReceiptForm.get('ptdsamount')
//                 ?.setValue(tdsAmount, { emitEvent: true });

//         } catch (error) {
//             this._commonService.showErrorMessage(error);
//         }
//     }
//     gstno_change() {
//         this.GetValidationByControl(this.GeneralReceiptForm, 'pgstno', true);
//     }

//     pamount_change() {

//         // let paidamount = parseFloat(this.GeneralReceiptForm.get('preceiptslist').get('pamount').value.toString().replace(/,/g, ""));

//         // if (isNaN(paidamount))
//         //   paidamount = 0;

//         // this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pactualpaidamount'].setValue(paidamount);

//         this.claculategsttdsamounts();
//     }
//     gst_clear() {
//         this.GeneralReceiptForm.get('preceiptslist.pigstpercentage')?.setValue('');
//         this.GeneralReceiptForm.get('preceiptslist.pcgstpercentage')?.setValue('');
//         this.GeneralReceiptForm.get('preceiptslist.psgstpercentage')?.setValue('');
//         this.GeneralReceiptForm.get('preceiptslist.putgstpercentage')?.setValue('');
//         this.GeneralReceiptForm.get('preceiptslist.pgstpercentage')?.setValue('');
//         this.GeneralReceiptForm.get('preceiptslist.pgstno')?.setValue('');
//     }
//     //  { target: { value: any; options: { [x: string]: { text: any; }; }; selectedIndex: string | number; }; }

//     state_change($event: any) {
//         debugger;
//         if (!$event) {
//             this.gst_clear();
//             this.GeneralReceiptForm.get('preceiptslist.pStateId')?.setValue(null);
//             this.GeneralReceiptForm.get('preceiptslist.pState')?.setValue('');
//             this.GeneralReceiptForm.get('preceiptslist.pgstno')?.setValue('');
//             this.GeneralReceiptForm.get('preceiptslist.pgstpercentage')?.setValue(null);
//             this.showgstamount = false;
//             this.showigst = false;
//             this.showcgst = false;
//             this.showsgst = false;
//             this.showutgst = false;
//             this.showgstno = false;
//             return;
//         }
//         const pstateid = $event.pStateId;
//         this.gst_clear();
//         this.showgstamount = false;
//         this.showigst = false;
//         this.showcgst = false;
//         this.showsgst = false;
//         this.showutgst = false;
//         this.showgstno = false;

//         if (pstateid) {

//             let selectedState = this.statelist.find((x: any) => x.pStateId == pstateid);

//             if (!selectedState) return;

//             this.GeneralReceiptForm.get('preceiptslist.pState')?.setValue(selectedState.pState);

//             // GST No visibility
//             if (selectedState.gstnumber) {
//                 this.showgstno = false;
//             } else {
//                 this.showgstno = true;
//             }

//             this.GeneralReceiptForm.get('preceiptslist.pgsttype')?.setValue(selectedState.pgsttype);
//             this.GeneralReceiptForm.get('preceiptslist.pgstno')?.setValue(selectedState.gstnumber);

//             this.showgstamount = true;

//             if (selectedState.pgsttype === 'IGST') {
//                 this.showigst = true;
//             }
//             else {
//                 this.showcgst = true;

//                 if (selectedState.pgsttype === 'CGST,SGST')
//                     this.showsgst = true;

//                 if (selectedState.pgsttype === 'CGST,UTGST')
//                     this.showutgst = true;
//             }

//             this.claculategsttdsamounts();
//             this.claculateTDSamount();
//         }
//     }


//     ledgerName_Change($event: any): void {

//         let pledgerid;
//         if ($event != undefined) {
//             pledgerid = $event.pledgerid;
//         }

//         // Reset subledger and balances
//         this.subledgeraccountslist = [];
//         this.GeneralReceiptForm.get('preceiptslist.psubledgerid')?.setValue(null);
//         this.GeneralReceiptForm.get('preceiptslist.psubledgername')?.setValue('');
//         this.ledgerBalance = `${this.currencySymbol} 0.00 Dr`;
//         this.subledgerBalance = `${this.currencySymbol} 0.00 Dr`;

//         if (pledgerid && pledgerid != '') {

//             const ledgername = $event.pledgername;

//             // Find ledger data
//             const data = this.ledgeraccountslist.find(
//                 (ledger: { pledgerid: any; accountbalance: number }) => ledger.pledgerid === pledgerid
//             );

//             if (data) {
//                 this.setBalances('LEDGER', data.accountbalance);
//             }

//             // Clear validators for subledger if needed
//             const subLedgerControl = <FormGroup>this.GeneralReceiptForm.get('preceiptslist.psubledgerid');
//             subLedgerControl.clearValidators();
//             subLedgerControl.updateValueAndValidity();

//             // Load subledger data
//             this.GetSubLedgerData(pledgerid);

//             // Set selected ledger name
//             this.GeneralReceiptForm.get('preceiptslist.pledgername')?.setValue(ledgername);

//         } else {
//             // Reset if nothing selected
//             this.setBalances('LEDGER', 0);
//             this.GeneralReceiptForm.get('preceiptslist.pledgername')?.setValue('');
//         }
//     }


//     subledger_Change($event: { psubledgerid: any; psubledgername: any; }) {
//         let psubledgerid
//         if ($event != undefined) {
//             psubledgerid = $event.psubledgerid;
//         }
//         this.subledgerBalance = this.currencySymbol + ' 0.00' + ' Dr';
//         if (psubledgerid && psubledgerid != '') {
//             const subledgername = $event.psubledgername;

//             this.GeneralReceiptForm.get('preceiptslist.psubledgername')?.setValue(subledgername);
//             let data = this.subledgeraccountslist.filter(function (ledger: { psubledgerid: any; }) {
//                 return ledger.psubledgerid == psubledgerid;
//             })[0];
//             this.setBalances('SUBLEDGER', data.accountbalance);

//         }
//         else {

//             this.GeneralReceiptForm.get('preceiptslist.psubledgername')?.setValue('');
//             this.setBalances('SUBLEDGER', 0);
//         }
//         // this.GetValidationByControl(this.GeneralReceiptForm, 'psubledgername', true);
//     }

//     upiName_Change($event: any): void {

//         const districtid = $event.target.value;

//         if (districtid && districtid != '') {
//             const districtname = $event.target.options[$event.target.selectedIndex].text;

//             //this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue(districtname);
//             //this.contactForm['controls']['pAddressControls']['controls']['pDistrictId'].setValue(districtid);
//         }
//         else {

//             //this.contactForm['controls']['pAddressControls']['controls']['pDistrict'].setValue('');
//         }
//         //this.GetValidationByControl(this.GeneralReceiptForm, 'pUpiname', true);
//     }
//     upid_change() {
//         //this.GetValidationByControl(this.GeneralReceiptForm, 'pUpiid', true);

//     }
//     GetSubLedgerData(pledgerid: any) {

//         this._Accountservice.GetSubLedgerData(pledgerid, 'accounts', 'KAPILCHITS', 'accounts', 'KLC01', 'global').subscribe(json => {

//             if (json != null) {

//                 this.subledgeraccountslist = json;

//                 let subLedgerControl = <FormGroup>this.GeneralReceiptForm.get('preceiptslist.psubledgerid');
//                 if (this.subledgeraccountslist.length > 0) {
//                     this.showsubledger = true;
//                     subLedgerControl.setValidators(Validators.required);
//                     //$('#psubledgerid').addClass("required-field");
//                 }
//                 else {
//                     this.showsubledger = false;
//                     subLedgerControl.clearValidators();
//                     //$('#psubledgerid').removeClass("required-field");
//                     this.GeneralReceiptForm.get('preceiptslist.psubledgerid')?.setValue(pledgerid);

//                     this.GeneralReceiptForm.get('preceiptslist.psubledgername')?.setValue(this.GeneralReceiptForm.get('preceiptslist')?.get('pledgername')?.value);
//                 }
//                 subLedgerControl.updateValueAndValidity();
//             }
//         },
//             (error) => {
//                 this._commonService.showErrorMessage(error);
//             });
//     }

//     istdsapplicableChange() {
//         let data = this.GeneralReceiptForm.get('pistdsapplicable')?.value;

//         if (data) {
//             this.showtds = true;
//             this.GeneralReceiptForm['controls']['ptdscalculationtype'].setValue('EXCLUDE');
//             // this.GeneralReceiptForm['controls']['ptdscalculationtype'].setValue('INCLUDE');
//             this.GeneralReceiptForm['controls']['pTdsPercentage'].setValue('');
//         }
//         else {
//             this.showtds = false;
//             this.GeneralReceiptForm['controls']['ptdscalculationtype'].setValue('');
//             this.GeneralReceiptForm['controls']['pTdsPercentage'].setValue('');
//         }
//         this.claculateTDSamount();
//         this.tdsvalidation(data);
//     }

//     tdsvalidation(data: any) {

//         this.formValidationMessages = {};
//         let TdsSectionControl = this.GeneralReceiptForm['controls']['pTdsSection'];
//         let TdsPercentageControl = this.GeneralReceiptForm['controls']['pTdsPercentage'];
//         if (data) {
//             TdsSectionControl.setValidators([Validators.required]);
//             TdsPercentageControl.setValidators([Validators.required]);
//         }
//         else {
//             TdsSectionControl.clearValidators();
//             TdsPercentageControl.clearValidators();
//         }
//         TdsSectionControl.updateValueAndValidity();
//         TdsPercentageControl.updateValueAndValidity();
//         //this.BlurEventAllControll(this.GeneralReceiptForm)
//     }


//     gstvalidation(data: any) {


//         this.formValidationMessages = {};
//         let gstpercentageControl = <FormGroup>this.GeneralReceiptForm.get('preceiptslist.pgstpercentage');
//         let StateControl = <FormGroup>this.GeneralReceiptForm.get('preceiptslist.pStateId');

//         if (data) {
//             StateControl.setValidators([Validators.required]);
//             //this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstno'].setValidators([Validators.required]);
//             gstpercentageControl.setValidators([Validators.required]);
//             this.GeneralReceiptForm.get('preceiptslist.pgstpercentage')?.setValue('')
//         }
//         else {
//             StateControl.clearValidators();
//             //this.GeneralReceiptForm['controls']['preceiptslist']['controls']['pgstno'].clearValidators();
//             gstpercentageControl.clearValidators();
//             this.GeneralReceiptForm.get('preceiptslist.pgstpercentage')?.setValue('')
//         }
//         StateControl.updateValueAndValidity();

//         gstpercentageControl.updateValueAndValidity();
//         this.formValidationMessages = {};
//     }

//     tds_Change(): void {

//         this.GetValidationByControl(this.GeneralReceiptForm, 'pTdsPercentage', true);
//         this.GetValidationByControl(this.GeneralReceiptForm, 'ptdsamount', true);
//         this.claculateTDSamount();
//     }


//     typeofDepositBank(args: any) {

//         this.GetValidationByControl(this.GeneralReceiptForm, 'pdepositbankid', true);
//         let type = args.target.options[args.target.selectedIndex].text;

//         this.GeneralReceiptForm.controls['pdepositbankname'].setValue(type)

//         this.getBankBranchName(this.GeneralReceiptForm.controls['pdepositbankid'].value);
//     }


//     ClearGenerealReceipt() {

//         this.GeneralReceiptForm.controls['pmodofreceipt'].setValue('CASH');
//         this.Paymenttype('Cash');
//         this.GeneralReceiptForm.controls['ppartyid'].setValue(null);
//         this.GeneralReceiptForm.controls['ppartyname'].setValue('');
//         this.GeneralReceiptForm['controls']['pistdsapplicable'].setValue(false);
//         this.istdsapplicableChange()
//         this.paymentslist = [];
//         this.paymentslist1 = [];
//         this.partyjournalentrylist = [];
//         this.tempState = '';
//         this.tempgstno = '';
//         this.TempGSTtype = '';
//         this.temporaryamount = 0;
//         this.partyBalance = this.currencySymbol + ' 0.00' + ' Dr';
//         this.TempModeofReceipt = false;
//         this.clearPaymentDetails()
//         this.GeneralReceiptForm['controls']['pnarration'].setValue('');
//         let date = new Date();
//         this.GeneralReceiptForm['controls']['preceiptdate'].setValue(date);
//         this.getpartyJournalEntryData();
//         this.paymentlistcolumnwiselist = {};
//         this.formValidationMessages = {};
//         this.GeneralReceiptForm.controls['pFilename'].setValue('');
//         this.GeneralReceiptForm.controls['pFileformat'].setValue('');
//         this.GeneralReceiptForm.controls['pFilepath'].setValue('');
//         this.imageResponse = {
//             name: '',
//             fileType: "imageResponse",
//             contentType: '',
//             size: 0,

//         };
//     }

//     //     pCardNumber: "5765889870980998"
//     // pbankaccountnumber: null
//     // pbankbalance: 0
//     // pbankid: 117
//     // pbankname: "SBI"
//     // pbankpassbookbalance: 0
//     // pbranchname: null
//     // pdepositbankid: 0
//     // pdepositbankname: null
//     // pfrombrsdate: null
//     // ptobrsdate: null


//     checkValidations(group: FormGroup, isValid: boolean): boolean {
//         try {
//             Object.keys(group.controls).forEach((key: string) => {
//                 isValid = this.GetValidationByControl(group, key, isValid);
//             })
//         }
//         catch (e) {
//             this.showErrorMessage('e');
//             return false;
//         }
//         return isValid;
//     }

//     GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
//         debugger;
//         try {

//             let formcontrol;
//             formcontrol = formGroup.get(key);
//             if (formcontrol) {
//                 if (formcontrol instanceof FormGroup) {
//                     if (key != 'preceiptslist')
//                         this.checkValidations(formcontrol, isValid)
//                 }
//                 else if (formcontrol.validator) {
//                     this.formValidationMessages[key] = '';
//                     if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {

//                         let errormessage;
//                         for (const errorkey in formcontrol.errors) {
//                             if (errorkey) {
//                                 let lablename;
//                                 lablename = (document.getElementById(key) as HTMLInputElement).title;
//                                 errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
//                                 this.formValidationMessages[key] += errormessage + ' ';
//                                 isValid = false;
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//         catch (e) {
//             // this.showErrorMessage(key);
//             return false;
//         }
//         return isValid;
//     }
//     showErrorMessage(errorMsg: string): void {
//         this._commonService.showErrorMessage(errorMsg);
//     }

//     BlurEventAllControll(formGroup: FormGroup): void {
//         try {
//             Object.keys(formGroup.controls).forEach((key: string) => {
//                 this.setBlurEvent(formGroup, key);
//             });
//         } catch (error) {
//             console.error(error);
//             this.showErrorMessage('An error occurred in BlurEventAllControll.');
//         }
//     }

//     setBlurEvent(formGroup: FormGroup, key: string): void {
//         try {
//             const control = formGroup.get(key);

//             if (!control) {
//                 return;
//             }

//             if (control instanceof FormGroup) {
//                 // Recursive call for nested FormGroup
//                 this.BlurEventAllControll(control);
//             } else if (control.validator) {
//                 control.valueChanges.subscribe(() => {
//                     this.GetValidationByControl(formGroup, key, true);
//                 });
//             }

//         } catch (error) {
//             console.error(error);
//             this.showErrorMessage('An error occurred in setBlurEvent.');
//         }
//     }
//     uploadAndProgress(event: any
//     ) {
//         debugger;
//         var extention = event.target.value.substring(event.target.value.lastIndexOf('.') + 1);
//         if (!this.validateFile(event.target.value)) {
//             this._commonService.showWarningMessage("Upload jpg , png or pdf files");
//         }
//         else {
//             let file = event.target.files[0];
//             if (event && file) {
//                 let reader = new FileReader();
//                 reader.readAsDataURL(file);
//                 reader.onload = e => {
//                     this.imageResponse = {
//                         name: file.name,
//                         fileType: "imageResponse",
//                         contentType: file.type,
//                         size: file.size,

//                     };
//                 };
//             }
//             let fname = "";
//             if (file.length === 0) {
//                 return;
//             }
//             var size = 0;
//             const formData = new FormData();
//             for (var i = 0; i < file.length; i++) {
//                 size += file[i].size;
//                 fname = file[i].name
//                 formData.append(file[i].name, file[i]);
//                 formData.append('NewFileName', 'General Receipt' + '.' + file[i]["name"].split('.').pop());
//             }
//             size = size / 1024;
//             this._commonService.fileUploadS3("Account", formData).subscribe((data: any) => {
//                 debugger;
//                 if (extention.toLowerCase() == 'pdf') {
//                     this.imageResponse.name = data[0];
//                     this.kycFileName = data[0];
//                     this.kycFilePath = data[0];
//                 }
//                 else {
//                     this.kycFileName = data[0];
//                     this.imageResponse.name = data[0];
//                     // this.kycFilePath = data[0];
//                     //let Filepath = this.kycFileName.AAAAAAAAsplit(".");
//                     //console.log(Filepath[1])
//                 }
//                 this.GeneralReceiptForm.controls['pFilename'].setValue(this.kycFileName);
//                 //  this.GeneralReceiptForm.controls.pFileformat.setValue(Filepath[1]);
//                 //   this.GeneralReceiptForm.controls.pFilepath.setValue(this.kycFilePath);
//             })
//         }
//     }


//     loadBanks(): void {
//         this._Accountservice.GetGlobalBanks('global').subscribe({
//             next: (res: any[]) => {
//                 this.banklist = (res || []).map(bank => ({
//                     pbankid: bank.bankId,
//                     pbankname: bank.bankName
//                 }));
//             },
//             error: (err) => {
//                 this._CommonService.showErrorMessage(err);
//             }
//         });
//     }

//     BankNameChange(): void {
//         this.GetValidationByControl(this.GeneralReceiptForm, 'pbankname', true);
//     }

//     BankIdChange(selectedBankName: string): void {

//         this.GetValidationByControl(this.GeneralReceiptForm, 'pbankid', true);


//         const bank = this.banklist.find(
//             (b: any) => b.pbankname === selectedBankName
//         );

//         if (bank) {
//             this.GeneralReceiptForm.controls['pbankname'].setValue(bank.pbankname);
//             this.GeneralReceiptForm.controls['pbankid'].setValue(bank.pbankname); // bindValue is name
//         }
//     }
//     ChequeNoChange() {
//         this.GetValidationByControl(this.GeneralReceiptForm, 'pChequenumber', true);
//     }

//     ChequeDateChange() {
//         this.GetValidationByControl(this.GeneralReceiptForm, 'pchequedate', true);
//     }

//     CardNoChange() {
//         this.GetValidationByControl(this.GeneralReceiptForm, 'pCardNumber', true);
//     }

//     emptySumm() {
//         return null;
//     }
//     caclulateSum() {
//         this.paymentslist1.forEach((item: any) => {
//             this.pAmountSum += item.pamount;
//             this.pTotalAMountSum = item.ptotalamount;
//             this.pGstAmountSum = item.pgstamount;
//         });
//     }

//     documentUpload(event: any) {
//         debugger;
//         try {
//             this.fileName = event.target.value
//             //this.GeneralReceiptForm.controls.pFilename.setValue(this.fileName)
//             if (!this.validateFile(this.fileName)) {
//                 this._CommonService.showWarningMessage("Upload PDF/DOC/JPG files")
//             }
//             else {
//                 this.GeneralReceiptForm.controls['pFilename'].setValue(this.fileName)
//             }
//         }
//         catch (e) {
//             this.showErrorMessage('e');
//         }
//     }
//     validateFile(fileName: string | null | undefined): boolean {
//         try {
//             if (!fileName) {
//                 return true;
//             }
//             const ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

//             return ext === 'jpg' || ext === 'png' || ext === 'pdf';
//         } catch (error) {
//             console.error(error);
//             this.showErrorMessage('An error occurred while validating file.');
//             return false;
//         }
//     }
// }

// function subscribe(arg0: (json: any) => void, arg1: (error: any) => void) {
//     throw new Error('Function not implemented.');
}