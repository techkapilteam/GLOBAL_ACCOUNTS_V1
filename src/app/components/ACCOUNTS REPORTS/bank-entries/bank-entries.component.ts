import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';
import { PageCriteria } from 'src/app/Models/pageCriteria';
import { AccountReportsService } from 'src/app/services/account-reports.service';
import { CommonService } from 'src/app/services/common.service';
import { AccountingReportsService } from 'src/app/services/Transactions/AccountingReports/accounting-reports.service';
import { BankBookService } from 'src/app/services/Transactions/AccountingReports/bank-book.service';

@Component({
  selector: 'app-bank-entries',
  imports: [CommonModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    TableModule,
    DatePipe],
  templateUrl: './bank-entries.component.html',
  styleUrl: './bank-entries.component.css',
})
export class BankEntriesComponent implements OnInit {

  @Output() printedDate: any;
  @ViewChild('myTable') table: any;

  public BanknBookReportForm!: FormGroup;

  pageCriteria: PageCriteria = new PageCriteria();

  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  public today: Date = new Date();
  public startDate: any = new Date();
  public endDate: any = new Date();

  public gridView: any[] = [];
  public pagedData: any[] = [];

  public Showhide = true;

  public loading = false;
  public pdfLoading = false;
  public isLoading = false;

  public savebutton = 'Generate Report';

  public SummeryChecked = false;
  public isSummeryChecked: any = '';

  currencysymbol: any;

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private formbuilder: FormBuilder,
    private _CommonService: CommonService,
    private _bankBookService: BankBookService,
    private verificationService: AccountReportsService,
    // private verificationService: VerificationService
  ) {

    this.currencysymbol = this._CommonService.datePickerPropertiesSetup("currencysymbol");

    this.dpConfig.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig.containerClass = 'theme-dark-blue';
    // this._CommonService.datePickerPropertiesSetup("containerClass");
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.maxDate = new Date();

    this.dpConfig1.maxDate = new Date();
    this.dpConfig1.minDate = new Date();
    this.dpConfig1.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig1.containerClass = 'theme-dark-blue'
    this._CommonService.datePickerPropertiesSetup("containerClass");

  }

  ngOnInit(): void {

    this.printedDate = true;
    this.setPageModel();

    this.BanknBookReportForm = this.formbuilder.group({
      fromDate: [this.today, Validators.required],
      toDate: [this.today, Validators.required]
    });

  }

  setPageModel(): void {

    this.pageCriteria.pageSize = this._CommonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.CurrentPage = 1;
    this.pageCriteria.footerPageHeight = 50;
    this.pageCriteria.totalrows = 0;
    this.pageCriteria.TotalPages = 0;

  }

  updatePagedData(): void {

    if (!this.gridView || this.gridView.length === 0) {
      this.pagedData = [];
      return;
    }

    const startIndex = (this.pageCriteria.CurrentPage - 1) * this.pageCriteria.pageSize;
    const endIndex = Math.min(startIndex + this.pageCriteria.pageSize, this.gridView.length);

    this.pagedData = this.gridView.slice(startIndex, endIndex);

  }

  onFooterPageChange(event: any): void {

    this.pageCriteria.CurrentPage = event.page;
    this.pageCriteria.offset = (event.page - 1) * this.pageCriteria.pageSize;

    this.updatePagedData();

  }

  public ToDateChange(event: any): void {
    this.dpConfig1.minDate = event;
  }

  public FromDateChange(event: any): void {
    this.dpConfig.maxDate = event;
  }

  CheckSummery(event: any): void {

    if (event.target.checked) {

      this.pagedData = [];
      this.gridView = [];

      this.SummeryChecked = true;
      this.isSummeryChecked = 'S';

    } else {

      this.pagedData = [];
      this.gridView = [];

      this.SummeryChecked = false;
      this.isSummeryChecked = '';

    }

  }

  public getbankBookReports(): void {

    if (!this.BanknBookReportForm.valid) {
      return;
    }

    this.loading = true;
    this.isLoading = true;
    this.savebutton = 'Processing';

    const pbankname = '';

    this.startDate = this.BanknBookReportForm.controls['fromDate'].value;
    this.endDate = this.BanknBookReportForm.controls['toDate'].value;

    // let fromdate = this._CommonService.getFormatDateNormal(this.startDate);
    // let todate = this._CommonService.getFormatDateNormal(this.endDate);
    let fromdate = new Date(this.startDate).toLocaleDateString('en-CA');
let todate = new Date(this.endDate).toLocaleDateString('en-CA');

    this._bankBookService.GetBankEntriesDetails2(
      fromdate,
      todate,
      pbankname,
      this.isSummeryChecked
    ).subscribe(res => {

      this.Showhide = false;

      this.gridView = res;

      this.pageCriteria.totalrows = this.gridView.length;
      this.pageCriteria.TotalPages = Math.ceil(this.gridView.length / this.pageCriteria.pageSize);

      this.pageCriteria.CurrentPage = 1;
      this.pageCriteria.offset = 0;

      this.updatePagedData();

      this.loading = false;
      this.isLoading = false;
      this.savebutton = 'Generate Report';

    },
    (error) => {

      this.showErrorMessage(error);

      this.loading = false;
      this.isLoading = false;
      this.savebutton = 'Generate Report';

    });

  }

  // async pdfOrprint(printorpdf: string) {

  //   this.pdfLoading = true;

  //   try {

  //     let rows: any[] = [];

  //     this.gridView.forEach(element => {

  //       let datereceipt = this._CommonService.getFormatDateGlobal(element.transdate);

  //       rows.push([
  //         element.recordid || "--NA--",
  //         datereceipt || "--NA--",
  //         element.transaNo || "--NA--",
  //         element.particulars || "--NA--",
  //         element.debit || "",
  //         element.credit || "",
  //         element.balance || "",
  //         element.balancetype || "--NA--"
  //       ]);

  //     });

  //     let fromDate = this._CommonService.getFormatDateGlobal(
  //       this.BanknBookReportForm.controls['fromDate'].value
  //     );

  //     let toDate = this._CommonService.getFormatDateGlobal(
  //       this.BanknBookReportForm.controls['toDate'].value
  //     );

  //     this.verificationService.downloadKgmsOutwardReportsData(
  //       "Bank Entries Details",
  //       rows,
  //       [],
  //       {},
  //       "a4",
  //       'Pdf',
  //       fromDate,
  //       toDate,
  //       "Between"
  //     );

  //     this.pdfLoading = false;

  //   } catch (error) {

  //     this.pdfLoading = false;
  //     this.showErrorMessage("Failed to generate PDF");

  //   }

  // }
  async pdfOrprint(printorpdf: string) {

  this.pdfLoading = true;

  try {

    let rows: any[] = [];
    let slNo = 1; 

    this.gridView.forEach(element => {

      let datereceipt = this._CommonService.getFormatDateGlobal(element.transactionDate);

      rows.push([
        slNo++,                        
        datereceipt        || "--NA--",
        (element.transactionNo && element.transactionNo !== '0') 
      ? element.transactionNo   : "--NA--",
        element.particulars|| "--NA--",
        element.debitamount      || "",
        element.creditamount     || "",
        element.balance    || "",
        element.balancetype|| "--NA--"
      ]);

    });

    const headers = [
      "Sl No.",
      "Transaction Date",
      "Transaction No.",
      "Particulars",
      "Debit Amount",
      "Credit Amount",
      "Balance",
      "Balance Type"
    ];

    const colWidths = {
      0: { cellWidth: 12, halign: 'center' },   
      1: { cellWidth: 25, halign: 'center' },  
      2: { cellWidth: 22, halign: 'center' },   
      3: { cellWidth: 65 },                    
      4: { cellWidth: 22, halign: 'right' },    
      5: { cellWidth: 22, halign: 'right' },   
      6: { cellWidth: 15, halign: 'right' },  
      7: { cellWidth: 17, halign: 'center' },   
    };
    // Total: 12+25+22+65+22+22+15+17 = 200 ... adjusted below for 10mm left margin

    let fromDate = this._CommonService.getFormatDateGlobal(
      this.BanknBookReportForm.controls['fromDate'].value
    );

    let toDate = this._CommonService.getFormatDateGlobal(
      this.BanknBookReportForm.controls['toDate'].value
    );

    this.verificationService.downloadKgmsOutwardReportsData(
      "Bank Entries Details",
      rows,
      headers,
      colWidths,
      "a4",
      printorpdf === 'Print' ? 'Print' : 'Pdf',
      fromDate,
      toDate,
      "Between"
    );

    this.pdfLoading = false;

  } catch (error) {

    this.pdfLoading = false;
    this.showErrorMessage("Failed to generate PDF");

  }

}

  export(): void {

    let rows: any[] = [];

    this.gridView.forEach(element => {

      let datereceipt = this._CommonService.getFormatDateGlobal(element.transdate);

      rows.push({
        "Transaction Date": datereceipt,
        "Transaction No.": element.transactionNo,
        "Particulars": element.particulars,
        "Debit Amount": element.debitamount,
        "Credit Amount": element.creditamount,
        "Balance": element.balance,
        "Balance Type": element.balancetype
      });

    });

    this._CommonService.exportAsExcelFile(rows, 'Bank Entries Details');

  }

  public showErrorMessage(errormsg: any) {
    this._CommonService.showErrorMessage(errormsg);
  }

  public showInfoMessage(msg: string) {
    this._CommonService.showInfoMessage(msg);
  }

}



// import { Component, OnInit, NgZone } from '@angular/core';
// import { CommonModule, DatePipe } from '@angular/common';
// import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// import { TableModule } from 'primeng/table';
// import { ButtonModule } from 'primeng/button';
// import { InputTextModule } from 'primeng/inputtext';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';
// import { CommonService } from '../../../services/common.service';
// import { ValidationMessageComponent } from '../../../common/validation-message/validation-message.component';

// @Component({
//   selector: 'app-petty-cash',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     ReactiveFormsModule,
//     BsDatepickerModule,
//     TableModule,
//     ButtonModule,
//     InputTextModule,
//     NgSelectModule,
//     ValidationMessageComponent
//   ],
//   templateUrl: './petty-cash.component.html',
//   providers: [DatePipe]
// })
// export class PettyCashComponent implements OnInit {

//   // ─── UI Flags ────────────────────────────────────────────────────────────────
//   showModeofPayment  = false;
//   showTypeofPayment  = false;
//   showtranstype      = false;
//   showbankcard       = true;
//   showbranch         = true;
//   showfinancial      = true;
//   showupi            = false;
//   showchequno        = true;
//   /** true  = GST collapsed (checkbox OFF)
//    *  false = GST expanded  (checkbox ON)  */
//   showgst            = true;
//   /** true  = TDS collapsed (checkbox OFF)
//    *  false = TDS expanded  (checkbox ON)  */
//   showtds            = true;
//   showgstamount      = false;
//   showigst           = false;
//   showcgst           = false;
//   showsgst           = false;
//   showutgst          = false;
//   showgstno          = false;
//   showsubledger      = true;

//   // ─── Labels ──────────────────────────────────────────────────────────────────
//   displayCardName  = 'Debit Card';
//   displaychequeno  = 'Cheque No';
//   currencySymbol   = '';
//   currencyCode     = '₹';

//   // ─── Lists ───────────────────────────────────────────────────────────────────
//   banklist             : any[] = [];
//   modeoftransactionslist: any[] = [];
//   typeofpaymentlist    : any[] = [];
//   ledgeraccountslist   : any[] = [];
//   subledgeraccountslist: any[] = [];
//   partylist            : any[] = [];
//   gstlist              : any[] = [];
//   tdslist              : any[] = [];
//   tdssectionlist       : any[] = [];
//   tdspercentagelist    : any[] = [];
//   debitcardlist        : any[] = [];
//   statelist            : any[] = [];
//   chequenumberslist    : any[] = [];
//   upinameslist         : any[] = [];
//   upiidlist            : any[] = [];
//   paymentslist         : any[] = [];
//   paymentslist1        : any[] = [];
//   partyjournalentrylist: any[] = [];

//   // ─── Balances — kept as strings so "1,234.00 Dr/Cr" label renders in template ─
//   cashBalance        : string = '0.00 Dr';
//   bankBalance        : string = '0.00 Dr';
//   bankbookBalance    : string = '0.00 Dr';
//   bankpassbookBalance: string = '0.00 Dr';
//   ledgerBalance      : string = '0.00 Dr';
//   subledgerBalance   : string = '0.00 Dr';
//   partyBalance       : string = '0.00 Dr';

//   // ─── Other state ─────────────────────────────────────────────────────────────
//   formValidationMessages : any   = {};
//   paymentlistcolumnwiselist: any = {};
//   imageResponse          : any   = { name: '', fileType: 'imageResponse', contentType: '', size: 0 };
//   disablegst             = false;
//   disabletds             = false;
//   disableaddbutton       = false;
//   disablesavebutton      = false;
//   disabletransactiondate = false;
//   addbutton              = 'Add';
//   savebutton             = 'Save';
//   kycFileName            = '';
//   JSONdataItem           : any[] = [];

//   BranchSchema = 'accounts';
//   CompanyCode  = '';
//   LocalSchema  = 'accounts';
//   BranchCode   = '';
//   GlobalSchema = 'global';

//   gstnopattern = '^(0[1-9]|[1-2][0-9]|3[0-9])([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}([a-zA-Z0-9]){1}([a-zA-Z]){1}([a-zA-Z0-9]){1}?';

//   public ppaymentdateConfig: Partial<BsDatepickerConfig> = {
//     dateInputFormat : 'DD-MMM-YYYY',
//     containerClass  : 'theme-dark-blue',
//     showWeekNumbers : false,
//     maxDate         : new Date()
//   };

//   paymentVoucherForm!: FormGroup;

//   constructor(
//     private _FormBuilder: FormBuilder,
//     private datepipe: DatePipe,
//     private zone: NgZone,
//     private _commonService: CommonService,
//     private router: Router,
//     private _AccountingTransactionsService: AccountingTransactionsService
//   ) {}

//   // ════════════════════════════════════════════════════════════════════════════
//   //  LIFECYCLE
//   // ════════════════════════════════════════════════════════════════════════════
//   ngOnInit(): void {
//     this.currencySymbol = this._commonService.currencysymbol || '';

//     if (this._commonService.comapnydetails != null) {
//       this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;
//     }

//     this.paymentVoucherForm = this._FormBuilder.group({
//       ppaymentid         : [''],
//       schemaname         : [this._commonService.getschemaname()],
//       ppaymentdate       : [new Date(), Validators.required],
//       ptotalpaidamount   : [''],
//       pnarration         : ['', Validators.required],
//       pmodofpayment      : ['CASH'],
//       pbankname          : [''],
//       pbranchname        : [''],
//       ptranstype         : ['CHEQUE'],
//       pCardNumber        : [''],
//       pUpiname           : [''],
//       pUpiid             : [''],
//       ptypeofpayment     : [''],
//       pChequenumber      : [''],
//       pchequedate        : [''],
//       pbankid            : [''],
//       pCreatedby         : [this._commonService.getCreatedBy()],
//       pStatusname        : [this._commonService.pStatusname],
//       ptypeofoperation   : [this._commonService.ptypeofoperation],
//       pipaddress         : [this._commonService.getIpAddress()],
//       ppaymentsslistcontrols: this.addppaymentsslistcontrols(),
//       pDocStorePath      : ['']
//     });

//     this.BlurEventAllControll(this.paymentVoucherForm);
//     this.getLoadData();
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   //  FORM GROUP — LINE ITEM
//   // ════════════════════════════════════════════════════════════════════════════
//   addppaymentsslistcontrols(): FormGroup {
//     return this._FormBuilder.group({
//       psubledgerid      : [null],
//       psubledgername    : [''],
//       pledgerid         : [null],
//       pledgername       : ['', Validators.required],
//       pamount           : [''],
//       pactualpaidamount : ['', Validators.required],
//       pgsttype          : [''],
//       pisgstapplicable  : [false],
//       pgstcalculationtype: [''],
//       pgstpercentage    : [''],
//       pgstamount        : [''],
//       pigstamount       : [''],
//       pcgstamount       : [''],
//       psgstamount       : [''],
//       putgstamount      : [''],
//       ppartyname        : ['', Validators.required],
//       ppartyid          : [null],
//       pistdsapplicable  : [false],
//       pgstno            : new FormControl('', Validators.pattern(this.gstnopattern)),
//       pTdsSection       : [''],
//       pTdsPercentage    : [''],
//       ptdsamount        : [''],
//       ptdscalculationtype: [''],
//       ppannumber        : [''],
//       pState            : [''],
//       pStateId          : [''],
//       pigstpercentage   : [''],
//       pcgstpercentage   : [''],
//       psgstpercentage   : [''],
//       putgstpercentage  : [''],
//       ptotalamount      : ['']
//     });
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   //  VALIDATION HELPERS
//   // ════════════════════════════════════════════════════════════════════════════

//   /** Subscribe valueChanges on every control — triggers message refresh on typing */
//   BlurEventAllControll(fromgroup: FormGroup): void {
//     Object.keys(fromgroup.controls).forEach((key: string) => {
//       const control = fromgroup.get(key);
//       if (control instanceof FormGroup) {
//         this.BlurEventAllControll(control);
//       } else if (control?.validator) {
//         control.valueChanges.subscribe(() => {
//           this.GetValidationByControl(fromgroup, key);
//         });
//       }
//     });
//   }

//   /** Validate one control and write message into formValidationMessages */
//   GetValidationByControl(formGroup: FormGroup, key: string): boolean {
//     try {
//       const control = formGroup.get(key);
//       if (!control) return true;

//       this.formValidationMessages[key] = '';

//       if (control.invalid && (control.dirty || control.touched)) {
//         for (const errorkey in control.errors) {
//           if (errorkey) {
//             let labelName = key;
//             try {
//               const el = document.getElementById(key) as HTMLElement | null;
//               if (el) labelName = (el as any).title || el.getAttribute('title') || key;
//             } catch { /* ignore */ }

//             const message = this._commonService.getValidationMessage(control, errorkey, labelName, key, '');
//             this.formValidationMessages[key] += message + ' ';
//             return false;
//           }
//         }
//       }
//     } catch (e) {
//       return false;
//     }
//     return true;
//   }

//   /**
//    * Run GetValidationByControl on every control in a FormGroup recursively.
//    * Returns true only if every control is valid.
//    * The ppaymentsslistcontrols sub-group is handled separately in validateaddPaymentDetails.
//    */
//   checkValidations(group: FormGroup, isValid: boolean): boolean {
//     try {
//       Object.keys(group.controls).forEach((key: string) => {
//         const control = group.get(key);
//         if (control instanceof FormGroup) {
//           // Skip the sub-group when validating the root form (validated independently)
//           if (key !== 'ppaymentsslistcontrols') {
//             isValid = this.checkValidations(control, isValid);
//           }
//         } else {
//           const ok = this.GetValidationByControl(group, key);
//           if (!ok) isValid = false;
//         }
//       });
//     } catch (e) {
//       this._commonService.showErrorMessage(e);
//       return false;
//     }
//     return isValid;
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   //  BALANCE DISPLAY — stored as formatted string "1,234.00 Dr / Cr"
//   // ════════════════════════════════════════════════════════════════════════════
//   setBalances(balancetype: string, balanceamount: any): void {
//     if (balanceamount === null || balanceamount === undefined || balanceamount === '') {
//       balanceamount = 0;
//     }

//     const numericAmount = Number(balanceamount) || 0;
//     const formatted     = this._commonService.currencyFormat(Math.abs(numericAmount).toFixed(2));
//     const label         = numericAmount < 0
//       ? `${formatted} Cr`
//       : `${formatted} Dr`;

//     switch (balancetype) {
//       case 'CASH'     : this.cashBalance         = label; break;
//       case 'BANK'     : this.bankBalance         = label; break;
//       case 'BANKBOOK' : this.bankbookBalance     = label; break;
//       case 'PASSBOOK' : this.bankpassbookBalance = label; break;
//       case 'LEDGER'   : this.ledgerBalance       = label; break;
//       case 'SUBLEDGER': this.subledgerBalance    = label; break;
//       case 'PARTY'    : this.partyBalance        = label; break;
//     }
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   //  LOAD DATA
//   // ════════════════════════════════════════════════════════════════════════════
//   getLoadData(): void {
//     this._AccountingTransactionsService
//       .GetReceiptsandPaymentsLoadingDatapettycash(
//         'PETTYCASH', 'accounts', 'KAPILCHITS', 'KLC01', 'global', 'taxes'
//       )
//       .subscribe(
//         (json: any) => {
//           if (json) {
//             this.banklist               = json.banklist              || [];
//             this.modeoftransactionslist = json.modeofTransactionslist || [];
//             this.typeofpaymentlist      = this.gettypeofpaymentdata();
//             this.ledgeraccountslist     = json.accountslist          || [];
//             this.partylist              = json.partylist             || [];
//             this.gstlist                = json.gstlist               || [];
//             this.debitcardlist          = json.bankdebitcardslist     || [];
//             this.setBalances('CASH', json.cashbalance);
//             this.setBalances('BANK', json.bankbalance);
//           }
//         },
//         (error: any) => this._commonService.showErrorMessage(error)
//       );
//   }

//   gettypeofpaymentdata(): any[] {
//     return (this.modeoftransactionslist || []).filter(
//       (p: any) => p.ptranstype !== p.ptypeofpayment
//     );
//   }

//   trackByFn(index: number, item: any): any {
//     return index;
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   //  MODE OF PAYMENT
//   // ════════════════════════════════════════════════════════════════════════════
//   modeofPaymentChange(): void {
//     const mode = this.paymentVoucherForm.controls['pmodofpayment'].value;

//     if (mode === 'CASH') {
//       this.paymentVoucherForm.controls['pbankid'].setValue(0);
//       this.showModeofPayment = false;
//       this.showtranstype     = false;
//     } else if (mode === 'BANK') {
//       this.paymentVoucherForm.controls['ptranstype'].setValue('CHEQUE');
//       this.showModeofPayment = true;
//       this.showtranstype     = true;
//     } else {
//       this.showModeofPayment = true;
//       this.showtranstype     = false;
//     }

//     this.transofPaymentChange();
//     this.getpartyJournalEntryData();
//   }

//   addModeofpaymentValidations(): void {
//     const modeControl      = this.paymentVoucherForm.controls['pmodofpayment'] as FormGroup;
//     const transtypeControl = this.paymentVoucherForm.controls['ptranstype']    as FormGroup;
//     const bankControl      = this.paymentVoucherForm.controls['pbankname']     as FormGroup;
//     const chequeControl    = this.paymentVoucherForm.controls['pChequenumber'] as FormGroup;
//     const cardControl      = this.paymentVoucherForm.controls['pCardNumber']   as FormGroup;
//     const typeofpayControl = this.paymentVoucherForm.controls['ptypeofpayment']as FormGroup;
//     const UpinameControl   = this.paymentVoucherForm.controls['pUpiname']      as FormGroup;
//     const UpiidControl     = this.paymentVoucherForm.controls['pUpiid']        as FormGroup;

//     if (this.showModeofPayment) {
//       modeControl.setValidators(Validators.required);
//       bankControl.setValidators(Validators.required);
//       chequeControl.setValidators(Validators.required);

//       if (this.showtranstype) { transtypeControl.setValidators(Validators.required); }
//       else                    { transtypeControl.clearValidators(); }

//       if (this.showbankcard) { cardControl.clearValidators(); }
//       else                   { cardControl.setValidators(Validators.required); }

//       if (this.showTypeofPayment) { typeofpayControl.setValidators(Validators.required); }
//       else                        { typeofpayControl.clearValidators(); }

//       if (this.showupi) {
//         UpinameControl.setValidators(Validators.required);
//         UpiidControl.setValidators(Validators.required);
//       } else {
//         UpinameControl.clearValidators();
//         UpiidControl.clearValidators();
//       }
//     } else {
//       modeControl.clearValidators();
//       bankControl.clearValidators();
//       chequeControl.clearValidators();
//       UpinameControl.clearValidators();
//       UpiidControl.clearValidators();
//       typeofpayControl.clearValidators();
//     }

//     [modeControl, transtypeControl, cardControl, bankControl,
//      chequeControl, typeofpayControl, UpinameControl, UpiidControl]
//       .forEach(c => c.updateValueAndValidity());
//   }

//   transofPaymentChange(): void {
//     this.displayCardName   = 'Debit Card';
//     this.showTypeofPayment = false;
//     this.showbranch        = false;
//     this.showfinancial     = false;
//     this.showchequno       = false;
//     this.showbankcard      = true;
//     this.showupi           = false;
//     this.displaychequeno   = 'Reference No.';

//     const transtype = this.paymentVoucherForm.controls['ptranstype'].value;

//     if (transtype === 'CHEQUE') {
//       this.showbankcard    = true;
//       this.displaychequeno = 'Cheque No.';
//       this.showbranch      = true;
//       this.showchequno     = true;
//     } else if (transtype === 'ONLINE') {
//       this.showbankcard      = true;
//       this.showTypeofPayment = true;
//       this.showfinancial     = false;
//     } else if (transtype === 'DEBIT CARD') {
//       this.showbankcard  = false;
//       this.showfinancial = true;
//     } else {
//       this.displayCardName = 'Credit Card';
//       this.showbankcard    = false;
//       this.showfinancial   = true;
//     }

//     this.addModeofpaymentValidations();
//     this.cleartranstypeDetails();
//   }

//   typeofPaymentChange(): void {
//     const UpinameControl = this.paymentVoucherForm.controls['pUpiname'] as FormGroup;
//     const UpiidControl   = this.paymentVoucherForm.controls['pUpiid']   as FormGroup;

//     if (this.paymentVoucherForm.controls['ptypeofpayment'].value === 'UPI') {
//       this.showupi = true;
//       UpinameControl.setValidators(Validators.required);
//       UpiidControl.setValidators(Validators.required);
//     } else {
//       this.showupi = false;
//       UpinameControl.clearValidators();
//       UpiidControl.clearValidators();
//     }
//     UpinameControl.updateValueAndValidity();
//     UpiidControl.updateValueAndValidity();
//     this.GetValidationByControl(this.paymentVoucherForm, 'ptypeofpayment');
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   //  BANK
//   // ════════════════════════════════════════════════════════════════════════════
//   bankName_Change($event: any): void {
//     const pbankid = $event?.target?.value;

//     this.upinameslist     = [];
//     this.chequenumberslist = [];
//     this.paymentVoucherForm.get('pChequenumber')?.setValue('');
//     this.paymentVoucherForm.get('pUpiname')?.setValue('');
//     this.paymentVoucherForm.get('pUpiid')?.setValue('');

//     if (pbankid && pbankid !== '') {
//       const bankname = $event?.target?.options?.[$event.target.selectedIndex]?.text || '';
//       this.GetBankDetailsbyId(pbankid);
//       this.getBankBranchName(pbankid);
//       this.paymentVoucherForm.get('pbankname')?.setValue(bankname);
//     } else {
//       this.paymentVoucherForm.get('pbankname')?.setValue('');
//     }

//     this.GetValidationByControl(this.paymentVoucherForm, 'pbankname');
//     this.formValidationMessages['pChequenumber'] = '';
//   }

//   chequenumber_Change(): void {
//     this.GetValidationByControl(this.paymentVoucherForm, 'pChequenumber');
//   }

//   debitCard_Change(): void {
//     const cardNumber = this.paymentVoucherForm.get('pCardNumber')?.value;
//     const data       = this.getbankname(cardNumber);
//     if (data) {
//       this.paymentVoucherForm.get('pbankname')?.setValue(data.pbankname);
//       this.paymentVoucherForm.get('pbankid')?.setValue(data.pbankid);
//     }
//     this.GetValidationByControl(this.paymentVoucherForm, 'pCardNumber');
//   }

//   getbankname(cardnumber: any): any {
//     try {
//       const data = (this.debitcardlist || []).find(
//         (d: any) => d.pCardNumber === cardnumber
//       );
//       if (data) this.getBankBranchName(data.pbankid);
//       return data || null;
//     } catch (e) {
//       this._commonService.showErrorMessage(e);
//       return null;
//     }
//   }

//   GetBankDetailsbyId(pbankid: any): void {
//     this._AccountingTransactionsService.GetBankDetailsbyId(pbankid).subscribe(
//       (json: any) => {
//         if (json) {
//           this.upinameslist      = json.bankupilist  || [];
//           this.chequenumberslist = json.chequeslist  || [];
//         }
//       },
//       (error: any) => this._commonService.showErrorMessage(error)
//     );
//   }

//   getBankBranchName(pbankid: any): void {
//     const data = (this.banklist || []).find((b: any) => b.pbankid == pbankid);
//     if (!data) return;
//     this.paymentVoucherForm.get('pbranchname')?.setValue(data.pbranchname);
//     this.setBalances('BANKBOOK', data.pbankbalance);
//     this.setBalances('PASSBOOK', data.pbankpassbookbalance);
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   //  UPI
//   // ════════════════════════════════════════════════════════════════════════════
//   upiName_Change($event: any): void {
//     const upiname  = $event?.target?.value;
//     this.upiidlist = (this.upinameslist || []).filter(
//       (r: any) => r.pUpiname === upiname
//     );
//     this.GetValidationByControl(this.paymentVoucherForm, 'pUpiname');
//   }

//   upid_change(): void {
//     this.GetValidationByControl(this.paymentVoucherForm, 'pUpiid');
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   //  LEDGER / SUB-LEDGER / PARTY
//   // ════════════════════════════════════════════════════════════════════════════
//   ledgerName_Change($event: any): void {
//     const pledgerid = $event?.pledgerid;
//     const subForm   = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
//     if (!subForm) return;

//     this.subledgeraccountslist = [];
//     subForm.get('psubledgerid')?.setValue(null);
//     subForm.get('psubledgername')?.setValue('');
//     this.setBalances('LEDGER',    0);
//     this.setBalances('SUBLEDGER', 0);

//     if (pledgerid) {
//       const data = (this.ledgeraccountslist || []).find((l: any) => l.pledgerid == pledgerid);
//       if (data) this.setBalances('LEDGER', data.accountbalance);

//       this.GetSubLedgerData(pledgerid);
//       subForm.get('pledgername')?.setValue($event.pledgername);
//     } else {
//       subForm.get('pledgername')?.setValue('');
//     }
//   }

//   GetSubLedgerData(pledgerid: any): void {
//     this._AccountingTransactionsService
//       .GetSubLedgerData(pledgerid, 'accounts', 'KAPILCHITS', 'accounts', 'KLC01', 'global')
//       .subscribe(
//         (json: any) => {
//           if (!json) return;
//           this.subledgeraccountslist = json;

//           const subForm   = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
//           if (!subForm) return;
//           const subLedgerControl = subForm.get('psubledgername');

//           if (this.subledgeraccountslist.length > 0) {
//             this.showsubledger = true;
//             subLedgerControl?.setValidators(Validators.required);
//           } else {
//             this.showsubledger = false;
//             subLedgerControl?.clearValidators();
//             subForm.get('psubledgerid')?.setValue(pledgerid);
//             subForm.get('psubledgername')?.setValue(subForm.get('pledgername')?.value);
//             this.formValidationMessages['psubledgername'] = '';
//           }
//           subLedgerControl?.updateValueAndValidity();
//         },
//         (error: any) => this._commonService.showErrorMessage(error)
//       );
//   }

//   subledger_Change($event: any): void {
//     const psubledgerid = $event?.psubledgerid;
//     const subForm      = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
//     if (!subForm) return;

//     this.setBalances('SUBLEDGER', 0);

//     if (psubledgerid) {
//       subForm.get('psubledgername')?.setValue($event.psubledgername);
//       const data = (this.subledgeraccountslist || []).find(
//         (l: any) => l.psubledgerid === psubledgerid
//       );
//       if (data) this.setBalances('SUBLEDGER', data.accountbalance);
//     } else {
//       subForm.get('psubledgername')?.setValue('');
//     }
//     this.GetValidationByControl(this.paymentVoucherForm, 'psubledgername');
//   }

//   partyName_Change($event: any): void {
//     const ppartyid = $event?.ppartyid;
//     const subForm  = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
//     if (!subForm) return;

//     this.statelist         = [];
//     this.tdssectionlist    = [];
//     this.tdspercentagelist = [];
//     this.paymentslist1     = [];
//     this.paymentslist      = [];

//     subForm.patchValue({
//       pStateId: '', pState: '', pTdsSection: '',
//       pTdsPercentage: '', ppartyreferenceid: '',
//       ppartyreftype: '', ppartypannumber: ''
//     });

//     this.setBalances('PARTY', 0);

//     if (ppartyid) {
//       subForm.get('ppartyname')?.setValue($event.ppartyname);

//       const data = (this.partylist || []).find((x: any) => x.ppartyid === ppartyid);
//       if (data) {
//         subForm.patchValue({
//           ppartyreferenceid: data.ppartyreferenceid,
//           ppartyreftype    : data.ppartyreftype,
//           ppartypannumber  : data.ppartypannumber
//         });
//       }

//       this.getPartyDetailsbyid(ppartyid);
//       this.setenableordisabletdsgst($event.ppartyname, 'PARTYCHANGE');
//     } else {
//       subForm.get('ppartyname')?.setValue('');
//     }
//   }

//   getPartyDetailsbyid(ppartyid: any): void {
//     this._AccountingTransactionsService
//       .getPartyDetailsbyid(ppartyid, 'accounts', 'KLC01', 'KAPILCHITS', 'global', 'taxes')
//       .subscribe(
//         (json: any) => {
//           if (!json) return;

//           this.tdslist = json.lstTdsSectionDetails || [];

//           const uniqueSections = [...new Set(this.tdslist.map((t: any) => t.pTdsSection))] as string[];
//           this.tdssectionlist  = uniqueSections.map(s => ({ pTdsSection: s }));

//           this.statelist = json.statelist || [];
//           this.claculategsttdsamounts();
//           this.setBalances('PARTY', json.accountbalance);
//         },
//         (error: any) => this._commonService.showErrorMessage(error)
//       );
//   }

//   setenableordisabletdsgst(ppartyname: any, changetype: string): void {
//     const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
//     if (!subForm) return;

//     subForm.get('pistdsapplicable')?.setValue(false);
//     subForm.get('pisgstapplicable')?.setValue(false);

//     const data = (this.paymentslist || []).filter((x: any) => x.ppartyname === ppartyname);

//     if (data && data.length > 0) {
//       this.disablegst = true;
//       this.disabletds = true;
//       subForm.get('pistdsapplicable')?.setValue(data[0].pistdsapplicable);
//       subForm.get('pisgstapplicable')?.setValue(data[0].pisgstapplicable);
//       subForm.get('pgstcalculationtype')?.setValue(data[0].pgstcalculationtype);
//       subForm.get('ptdscalculationtype')?.setValue(data[0].ptdscalculationtype);
//     } else {
//       this.disablegst = false;
//       this.disabletds = false;
//     }

//     if (changetype === 'PARTYCHANGE') {
//       this.isgstapplicableChange();
//       this.istdsapplicableChange();
//     }
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   //  GST
//   // ════════════════════════════════════════════════════════════════════════════

//   /** Called when GST checkbox is clicked */
//   isgstapplicable_Checked(): void {
//     const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
//     if (!subForm) return;

//     subForm.get('pStateId')?.setValue('');
//     this.gst_clear();

//     const ppartyname = subForm.get('ppartyname')?.value;
//     const griddata   = (this.paymentslist || []).filter((x: any) => x.ppartyname === ppartyname);
//     if (griddata.length > 0) {
//       subForm.get('pisgstapplicable')?.setValue(griddata[0].pisgstapplicable);
//     }

//     this.isgstapplicableChange();
//   }

//   /** Handles GST checkbox value change — sets showgst flag and validators */
//   isgstapplicableChange(): void {
//     const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
//     if (!subForm) return;

//     const isGstOn = subForm.get('pisgstapplicable')?.value;

//     const gstCalcCtrl       = subForm.get('pgstcalculationtype');
//     const gstPercentageCtrl = subForm.get('pgstpercentage');
//     const stateCtrl         = subForm.get('pStateId');
//     const gstAmountCtrl     = subForm.get('pgstamount');

//     if (isGstOn) {
//       // Expand panel (showgst = false means the #gst div is shown)
//       this.showgst = false;
//       if (!this.disablegst) gstCalcCtrl?.setValue('INCLUDE');
//       gstCalcCtrl?.setValidators(Validators.required);
//       gstPercentageCtrl?.setValidators(Validators.required);
//       stateCtrl?.setValidators(Validators.required);
//     } else {
//       // Collapse panel
//       this.showgst = true;
//       if (!this.disablegst) gstCalcCtrl?.setValue('');
//       gstCalcCtrl?.clearValidators();
//       gstPercentageCtrl?.clearValidators();
//       stateCtrl?.clearValidators();
//       gstAmountCtrl?.clearValidators();
//     }

//     [gstCalcCtrl, gstPercentageCtrl, stateCtrl, gstAmountCtrl]
//       .forEach(c => c?.updateValueAndValidity());

//     this.claculategsttdsamounts();
//   }

//   gst_Change($event: any): void {
//     const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
//     if (!subForm) return;

//     // ng-select emits the item object; native select emits event
//     const gstpercentage = $event?.pgstpercentage ?? $event?.target?.value;

//     subForm.get('pigstpercentage')?.setValue('');
//     subForm.get('pcgstpercentage')?.setValue('');
//     subForm.get('psgstpercentage')?.setValue('');
//     subForm.get('putgstpercentage')?.setValue('');

//     if (gstpercentage && gstpercentage !== '') {
//       this.getgstPercentage(gstpercentage);
//     }

//     this.GetValidationByControl(this.paymentVoucherForm, 'pgstpercentage');
//     this.GetValidationByControl(this.paymentVoucherForm, 'pgstamount');
//   }

//   getgstPercentage(gstpercentage: any): void {
//     const data = (this.gstlist || []).find((g: any) => g.pgstpercentage == gstpercentage);
//     if (!data) return;

//     const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
//     if (!subForm) return;

//     subForm.get('pigstpercentage')?.setValue(data.pigstpercentage);
//     subForm.get('pcgstpercentage')?.setValue(data.pcgstpercentage);
//     subForm.get('psgstpercentage')?.setValue(data.psgstpercentage);
//     subForm.get('putgstpercentage')?.setValue(data.putgstpercentage);
//     this.claculategsttdsamounts();
//   }

//   gst_clear(): void {
//     const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
//     if (!subForm) return;
//     ['pigstpercentage', 'pcgstpercentage', 'psgstpercentage', 'putgstpercentage', 'pgstpercentage', 'pgstno']
//       .forEach(f => subForm.get(f)?.setValue(''));
//   }

//   gsno_change(): void {
//     this.GetValidationByControl(this.paymentVoucherForm, 'pgstno');
//   }

//   state_change($event: any): void {
//     const pstateid = $event?.target?.value;
//     const subForm  = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
//     if (!subForm) return;

//     this.gst_clear();
//     this.showgstamount = false;
//     this.showigst      = false;
//     this.showcgst      = false;
//     this.showsgst      = false;
//     this.showutgst     = false;
//     this.showgstno     = false;

//     if (pstateid && pstateid !== '') {
//       const statename = $event?.target?.options?.[$event.target.selectedIndex]?.text || '';
//       subForm.get('pState')?.setValue(statename);

//       const gstno = statename.split('-')[1];
//       this.showgstno = !gstno;

//       const data = this.GetStatedetailsbyId(pstateid);
//       if (!data) return;

//       this.showgstamount = true;
//       subForm.get('pgsttype')?.setValue(data.pgsttype);

//       if (data.pgsttype === 'IGST') {
//         this.showigst = true;
//       } else {
//         this.showcgst = true;
//         if (data.pgsttype === 'CGST,SGST')  this.showsgst  = true;
//         if (data.pgsttype === 'CGST,UTGST') this.showutgst = true;
//       }
//     } else {
//       subForm.get('pState')?.setValue('');
//     }

//     this.GetValidationByControl(this.paymentVoucherForm, 'pState');
//     this.formValidationMessages['pigstpercentage'] = '';
//     this.claculategsttdsamounts();
//   }

//   GetStatedetailsbyId(pstateid: any): any {
//     return (this.statelist || []).find((s: any) => s.pStateId == pstateid) || null;
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   //  TDS
//   // ════════════════════════════════════════════════════════════════════════════

//   /** Called when TDS checkbox is clicked */
//   istdsapplicable_Checked(): void {
//     const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
//     if (!subForm) return;

//     const ppartyname = subForm.get('ppartyname')?.value;
//     const griddata   = (this.paymentslist || []).filter((x: any) => x.ppartyname === ppartyname);
//     if (griddata.length > 0) {
//       subForm.get('pistdsapplicable')?.setValue(griddata[0].pistdsapplicable);
//     }

//     this.istdsapplicableChange();
//   }

//   /** Handles TDS checkbox value change — sets showtds flag and validators */
//   istdsapplicableChange(): void {
//     const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
//     if (!subForm) return;

//     const isTdsOn = subForm.get('pistdsapplicable')?.value;

//     const tdsCalcCtrl    = subForm.get('ptdscalculationtype');
//     const tdsPercentCtrl = subForm.get('pTdsPercentage');
//     const sectionCtrl    = subForm.get('pTdsSection');
//     const tdsamtCtrl     = subForm.get('ptdsamount');

//     if (isTdsOn) {
//       // Expand panel (showtds = false means the #tds div is shown)
//       this.showtds = false;
//       if (!this.disabletds) tdsCalcCtrl?.setValue('INCLUDE');
//       tdsCalcCtrl?.setValidators(Validators.required);
//       tdsPercentCtrl?.setValidators(Validators.required);
//       sectionCtrl?.setValidators(Validators.required);
//     } else {
//       // Collapse panel
//       this.showtds = true;
//       if (!this.disabletds) tdsCalcCtrl?.setValue('');
//       tdsCalcCtrl?.clearValidators();
//       tdsPercentCtrl?.clearValidators();
//       sectionCtrl?.clearValidators();
//       tdsamtCtrl?.clearValidators();
//     }

//     [tdsCalcCtrl, tdsPercentCtrl, sectionCtrl, tdsamtCtrl]
//       .forEach(c => c?.updateValueAndValidity());

//     this.claculategsttdsamounts();
//   }

//   tdsSection_Change($event: any): void {
//     const ptdssection = $event?.target?.value;
//     const subForm     = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
//     if (!subForm) return;

//     this.tdspercentagelist = [];
//     subForm.get('pTdsPercentage')?.setValue('');

//     if (ptdssection && ptdssection !== '') {
//       this.gettdsPercentage(ptdssection);
//     }
//     this.GetValidationByControl(this.paymentVoucherForm, 'pTdsSection');
//   }

//   gettdsPercentage(ptdssection: any): void {
//     this.tdspercentagelist = (this.tdslist || []).filter(
//       (t: any) => t.pTdsSection === ptdssection
//     );
//     this.claculategsttdsamounts();
//   }

//   tds_Change($event: any): void {
//     this.GetValidationByControl(this.paymentVoucherForm, 'pTdsPercentage');
//     this.GetValidationByControl(this.paymentVoucherForm, 'ptdsamount');
//     this.claculategsttdsamounts();
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   //  AMOUNT CALCULATIONS
//   // ════════════════════════════════════════════════════════════════════════════
//   pamount_change(): void {
//     this.claculategsttdsamounts();
//   }

//   claculategsttdsamounts(): void {
//     try {
//       const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
//       if (!subForm) return;

//       let paidAmount = subForm.get('pactualpaidamount')?.value;
//       if (!paidAmount) paidAmount = 0;
//       else paidAmount = parseFloat(this._commonService.removeCommasInAmount(paidAmount.toString()));
//       if (isNaN(paidAmount)) paidAmount = 0;

//       let actualPaidAmount = paidAmount;

//       const isGstApplicable    = subForm.get('pisgstapplicable')?.value;
//       const gstType            = subForm.get('pgsttype')?.value;
//       const gstCalculationType = subForm.get('pgstcalculationtype')?.value;

//       const igstPercentage  = parseFloat(subForm.get('pigstpercentage')?.value)  || 0;
//       const cgstPercentage  = parseFloat(subForm.get('pcgstpercentage')?.value)  || 0;
//       const sgstPercentage  = parseFloat(subForm.get('psgstpercentage')?.value)  || 0;
//       const utgstPercentage = parseFloat(subForm.get('putgstpercentage')?.value) || 0;

//       let igstAmount = 0, cgstAmount = 0, sgstAmount = 0, utgstAmount = 0, gstAmount = 0;

//       if (isGstApplicable) {
//         if (gstCalculationType === 'INCLUDE') {
//           gstAmount = parseFloat(((paidAmount * igstPercentage) / (100 + igstPercentage)).toFixed(2));

//           if (gstType === 'IGST') {
//             igstAmount       = Math.ceil(gstAmount);
//             actualPaidAmount -= igstAmount;
//           } else if (gstType === 'CGST,SGST') {
//             cgstAmount       = Math.ceil(gstAmount) / 2;
//             sgstAmount       = Math.ceil(gstAmount) / 2;
//             actualPaidAmount -= (cgstAmount + sgstAmount);
//           } else if (gstType === 'CGST,UTGST') {
//             cgstAmount       = Math.ceil(gstAmount) / 2;
//             utgstAmount      = Math.ceil(gstAmount) / 2;
//             actualPaidAmount -= (cgstAmount + utgstAmount);
//           }
//         } else if (gstCalculationType === 'EXCLUDE') {
//           gstAmount = parseFloat(((paidAmount * igstPercentage) / 100).toFixed(2));

//           if      (gstType === 'IGST')       { igstAmount = Math.ceil(gstAmount); }
//           else if (gstType === 'CGST,SGST')  { cgstAmount = Math.ceil(gstAmount) / 2; sgstAmount  = Math.ceil(gstAmount) / 2; }
//           else if (gstType === 'CGST,UTGST') { cgstAmount = Math.ceil(gstAmount) / 2; utgstAmount = Math.ceil(gstAmount) / 2; }
//         }
//       }

//       const isTdsApplicable    = subForm.get('pistdsapplicable')?.value;
//       const tdsCalculationType = subForm.get('ptdscalculationtype')?.value;
//       const tdsPercentage      = parseFloat(subForm.get('pTdsPercentage')?.value) || 0;
//       let tdsAmount = 0;

//       if (isTdsApplicable) {
//         const base = gstCalculationType === 'INCLUDE' ? actualPaidAmount : paidAmount;
//         if (tdsCalculationType === 'INCLUDE') {
//           tdsAmount        = Math.ceil(base * tdsPercentage / (100 + tdsPercentage));
//           actualPaidAmount -= tdsAmount;
//         } else if (tdsCalculationType === 'EXCLUDE') {
//           tdsAmount        = Math.ceil(base * tdsPercentage / 100);
//           actualPaidAmount -= tdsAmount;
//         }
//       }

//       gstAmount = igstAmount + cgstAmount + sgstAmount + utgstAmount;
//       const totalAmount = actualPaidAmount + gstAmount;

//       subForm.patchValue({
//         pamount      : actualPaidAmount > 0 ? actualPaidAmount : '',
//         pgstamount   : gstAmount,
//         pigstamount  : igstAmount,
//         pcgstamount  : cgstAmount,
//         psgstamount  : sgstAmount,
//         putgstamount : utgstAmount,
//         ptdsamount   : tdsAmount,
//         ptotalamount : parseFloat(totalAmount.toFixed(2))
//       });

//       this.formValidationMessages['pamount'] = '';
//     } catch (e) {
//       this._commonService.showErrorMessage(e);
//     }
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   //  ADD PAYMENT TO GRID
//   // ════════════════════════════════════════════════════════════════════════════
//   validateaddPaymentDetails(): boolean {
//     let isValid = true;
//     const subForm = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
//     if (!subForm) return false;

//     try {
//       const verifyAmount = subForm.get('pactualpaidamount')?.value;
//       if (verifyAmount === 0) subForm.get('pactualpaidamount')?.setValue('');

//       isValid = this.checkValidations(subForm, isValid);

//       const ledgerName    = subForm.get('pledgername')?.value;
//       const subledgerName = subForm.get('psubledgername')?.value;
//       const subledgerId   = subForm.get('psubledgerid')?.value;
//       const partyId       = subForm.get('ppartyid')?.value;
//       const gridData      = this.paymentslist || [];
//       let count = 0, fixedCount = 0, bankCount = 0;

//       for (let i = 0; i < gridData.length; i++) {
//         if (ledgerName === 'FIXED DEPOSIT RECEIPTS-CHITS' && gridData.length > 0) {
//           count = 1; fixedCount = 1; break;
//         }
//         if (
//           gridData[i].pledgername === 'FIXED DEPOSIT RECEIPTS-CHITS' ||
//           (gridData[i].pledgername  === ledgerName &&
//            gridData[i].psubledgername === subledgerName &&
//            gridData[i].ppartyid     === partyId)
//         ) {
//           if (gridData[i].pledgername === 'FIXED DEPOSIT RECEIPTS-CHITS') fixedCount = 1;
//           count = 1; break;
//         }
//         for (let j = 0; j < this.banklist.length; j++) {
//           if (this.banklist[j].paccountid === gridData[i].psubledgerid ||
//               this.banklist[j].paccountid === subledgerId) {
//             count = 1; bankCount = 1; break;
//           }
//         }
//       }

//       if (count === 1) {
//         if      (fixedCount === 1) this._commonService.showWarningMessage('Fixed deposit receipts accepts only one record in the grid');
//         else if (bankCount  === 1) this._commonService.showWarningMessage('Bank Accounts only one record in the grid');
//         else                        this._commonService.showWarningMessage('Ledger, subledger and party already exists in the grid.');
//         isValid = false;
//       }
//     } catch (e) {
//       this._commonService.showErrorMessage(e);
//     }

//     return isValid;
//   }

//   addPaymentDetails(): void {
//     this.disableaddbutton = true;
//     this.addbutton        = 'Processing';

//     const control = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;

//     if (this.validateaddPaymentDetails()) {
//       control.get('pStateId')?.setValue(control.get('pStateId')?.value || 0);
//       const gstPercentage = control.get('pgstpercentage')?.value || 0;
//       control.get('pgstpercentage')?.setValue(gstPercentage);
//       control.get('pTdsPercentage')?.setValue(control.get('pTdsPercentage')?.value || 0);

//       const data = {
//         ppartyname         : control.get('ppartyname')?.value,
//         pledgername        : control.get('pledgername')?.value,
//         psubledgername     : control.get('psubledgername')?.value,
//         ptotalamount       : this._commonService.removeCommasInAmount(control.get('ptotalamount')?.value),
//         pamount            : this._commonService.removeCommasInAmount(control.get('pamount')?.value),
//         pgstcalculationtype: control.get('pgstcalculationtype')?.value,
//         pTdsSection        : control.get('pTdsSection')?.value,
//         pgstpercentage     : gstPercentage,
//         ptdsamount         : this._commonService.removeCommasInAmount(control.get('ptdsamount')?.value)
//       };

//       this.paymentslist1 = [...this.paymentslist1, data];
//       this.paymentslist.push(control.value);

//       this.getpartyJournalEntryData();
//       this.clearPaymentDetailsparticular();
//       this.getPaymentListColumnWisetotals();
//     }

//     this.disableaddbutton = false;
//     this.addbutton        = 'Add';
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   //  CLEAR HELPERS
//   // ════════════════════════════════════════════════════════════════════════════
//   clearPaymentDetailsparticular(): void {
//     const control = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
//     this.showsubledger = true;

//     control.patchValue({
//       pistdsapplicable : false,
//       pisgstapplicable : false,
//       psubledgerid     : null,
//       pStateId         : '',
//       pgstpercentage   : '',
//       pTdsSection      : '',
//       pTdsPercentage   : '',
//       pactualpaidamount: ''
//     });

//     this.setBalances('SUBLEDGER', 0);
//     this.showgst    = true;   // collapse
//     this.showtds    = true;   // collapse
//     this.disablegst = false;
//     this.disabletds = true;
//     this.showgstno  = false;
//     this.formValidationMessages = {};
//   }

//   clearPaymentDetails(): void {
//     const control = this.paymentVoucherForm.get('ppaymentsslistcontrols') as FormGroup;
//     control.reset();
//     this.showsubledger = true;

//     control.patchValue({
//       pistdsapplicable: false,
//       pisgstapplicable: false,
//       pledgerid       : null,
//       psubledgerid    : null,
//       ppartyid        : null,
//       pStateId        : '',
//       pgstpercentage  : '',
//       pTdsSection     : '',
//       pTdsPercentage  : ''
//     });

//     this.setBalances('LEDGER',    0);
//     this.setBalances('SUBLEDGER', 0);
//     this.setBalances('PARTY',     0);

//     this.istdsapplicable_Checked();
//     this.isgstapplicable_Checked();
//     this.formValidationMessages = {};
//   }

//   cleartranstypeDetails(): void {
//     this.chequenumberslist = [];
//     ['pbankid', 'pbankname', 'pCardNumber', 'ptypeofpayment',
//      'pbranchname', 'pUpiname', 'pUpiid', 'pChequenumber']
//       .forEach(f => this.paymentVoucherForm.get(f)?.setValue(''));

//     this.formValidationMessages = {};
//     this.setBalances('BANKBOOK', 0);
//     this.setBalances('PASSBOOK', 0);
//   }

//   clearPaymentVoucher(): void {
//     try {
//       this.paymentslist  = [];
//       this.paymentslist1 = [];
//       this.paymentVoucherForm.reset();
//       this.cleartranstypeDetails();
//       this.clearPaymentDetails();

//       this.paymentVoucherForm.get('pmodofpayment')?.setValue('CASH');
//       this.modeofPaymentChange();
//       this.paymentVoucherForm.get('ppaymentdate')?.setValue(new Date());

//       this.formValidationMessages    = {};
//       this.paymentlistcolumnwiselist = {};
//       this.partyjournalentrylist     = [];
//       this.imageResponse = { name: '', fileType: 'imageResponse', contentType: '', size: 0 };

//       this.setBalances('BANKBOOK', 0);
//       this.setBalances('PASSBOOK', 0);
//       this.setBalances('LEDGER',   0);
//       this.setBalances('SUBLEDGER',0);
//       this.setBalances('PARTY',    0);
//     } catch (e: any) {
//       this._commonService.showErrorMessage(e.message || e);
//     }
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   //  REMOVE GRID ROW
//   // ════════════════════════════════════════════════════════════════════════════
//   removeHandler(rowIndex: number): void {
//     if (!this.paymentslist || !this.paymentslist1) return;

//     if (rowIndex >= 0 && rowIndex < this.paymentslist.length) {
//       this.paymentslist.splice(rowIndex, 1);
//       this.paymentslist1.splice(rowIndex, 1);
//       this.paymentslist1 = [...this.paymentslist1];

//       const totalPaid = this.paymentslist.reduce(
//         (sum: number, p: any) => sum + parseFloat(p.ptotalamount || '0'), 0
//       );
//       this.paymentVoucherForm.get('ptotalpaidamount')?.setValue(totalPaid);

//       this.getpartyJournalEntryData();
//       this.clearPaymentDetails();
//       this.getPaymentListColumnWisetotals();
//     }
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   //  JOURNAL ENTRY + GRID TOTALS
//   // ════════════════════════════════════════════════════════════════════════════
//   getPaymentListColumnWisetotals(): void {
//     this.paymentlistcolumnwiselist['ptotalamount'] = this.paymentslist.reduce(
//       (s: number, c: any) => s + parseFloat(c.ptotalamount || 0), 0);
//     this.paymentlistcolumnwiselist['pamount'] = this.paymentslist.reduce(
//       (s: number, c: any) => s + parseFloat(c.pamount || 0), 0);
//     this.paymentlistcolumnwiselist['pgstamount'] = this.paymentslist.reduce(
//       (s: number, c: any) => s + parseFloat(c.pgstamount || 0), 0);
//     this.paymentlistcolumnwiselist['ptdsamount'] = this.paymentslist.reduce(
//       (s: number, c: any) => s + parseFloat(c.ptdsamount || 0), 0);
//   }

//   getpartyJournalEntryData(): void {
//     try {
//       const ledgerNames = [...new Set(this.paymentslist.map((p: any) => p.pledgername))];
//       const tdsJournalEntries: any[] = [];
//       this.partyjournalentrylist = [];

//       ledgerNames.forEach((ledger: any, index: number) => {
//         const journalAmount = this.paymentslist
//           .filter((p: any) => p.pledgername === ledger)
//           .reduce((sum: number, p: any) =>
//             sum +
//             this._commonService.removeCommasInAmount(p.pamount) +
//             this._commonService.removeCommasInAmount(p.ptdsamount), 0);

//         this.partyjournalentrylist.push({
//           type: 'Payment Voucher', accountname: ledger,
//           debitamount: journalAmount, creditamount: ''
//         });

//         const tdsData     = this.paymentslist.filter((p: any) => p.pledgername === ledger);
//         const tdsSections = [...new Set(tdsData.map((p: any) => p.pTdsSection))] as string[];

//         tdsSections.forEach((section: string) => {
//           const tdsAmount = tdsData
//             .filter((p: any) => p.pTdsSection === section)
//             .reduce((s: number, p: any) =>
//               s + this._commonService.removeCommasInAmount(p.ptdsamount), 0);
//           tdsJournalEntries.push({
//             type: `Journal Voucher${index + 1}`,
//             accountname: `TDS-${section} RECEIVABLE`,
//             debitamount: tdsAmount, creditamount: ''
//           });
//         });

//         const totalTds = tdsData.reduce(
//           (s: number, p: any) => s + this._commonService.removeCommasInAmount(p.ptdsamount), 0);
//         if (totalTds > 0) {
//           tdsJournalEntries.push({
//             type: `Journal Voucher${index + 1}`, accountname: ledger,
//             debitamount: '', creditamount: totalTds
//           });
//         }
//       });

//       // GST entries
//       const gstAccounts = ['pigstamount', 'pcgstamount', 'psgstamount', 'putgstamount'];
//       const gstNames    = ['P-IGST', 'P-CGST', 'P-SGST', 'P-UTGST'];
//       gstAccounts.forEach((field, i) => {
//         const amount = this.paymentslist.reduce(
//           (s: number, p: any) => s + this._commonService.removeCommasInAmount(p[field] || 0), 0);
//         if (amount > 0) {
//           this.partyjournalentrylist.push({
//             type: 'Payment Voucher', accountname: gstNames[i],
//             debitamount: amount, creditamount: ''
//           });
//         }
//       });

//       // Total paid & cash/bank credit entry
//       const totalPaid = this.paymentslist.reduce(
//         (s: number, p: any) => s + this._commonService.removeCommasInAmount(p.ptotalamount), 0);
//       if (totalPaid > 0) {
//         this.paymentVoucherForm.get('ptotalpaidamount')?.setValue(totalPaid);
//         const accountName = this.paymentVoucherForm.get('pmodofpayment')?.value === 'CASH'
//           ? 'PETTY CASH' : 'BANK';
//         this.partyjournalentrylist.push({
//           type: 'Payment Voucher', accountname: accountName,
//           debitamount: '', creditamount: totalPaid
//         });
//       }

//       this.partyjournalentrylist = [...this.partyjournalentrylist, ...tdsJournalEntries];

//       // FIX: loadgrid was throwing "Method not implemented." — now just triggers change detection
//       this.loadgrid();
//     } catch (e) {
//       this._commonService.showErrorMessage(e);
//     }
//   }

//   /** Triggers Angular change detection for partyjournalentrylist p-table */
//   loadgrid(): void {
//     this.partyjournalentrylist = [...this.partyjournalentrylist];
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   //  SAVE
//   // ════════════════════════════════════════════════════════════════════════════
//   validatesavePaymentVoucher(): boolean {
//     let isValid = true;
//     try {
//       isValid = this.checkValidations(this.paymentVoucherForm, isValid);

//       if (!this.paymentslist || this.paymentslist.length === 0) {
//         this._commonService.showWarningMessage('Add at least one record to the grid!');
//         isValid = false;
//       }

//       if (this.paymentVoucherForm.get('pmodofpayment')?.value === 'CASH') {
//         // cashBalance is a string like "1,234.00 Dr" — strip non-numeric chars for comparison
//         const rawBalance      = (this.cashBalance || '0').toString().replace(/[^\d.]/g, '');
//         const numericBalance  = parseFloat(rawBalance) || 0;
//         const paidvalue       = Number(this.paymentVoucherForm.get('ptotalpaidamount')?.value) || 0;

//         if (paidvalue > numericBalance) {
//           this._commonService.showWarningMessage('Insufficient Cash Balance');
//           isValid = false;
//         }
//       }
//     } catch (e: any) {
//       this._commonService.showErrorMessage(e.message || e);
//     }
//     return isValid;
//   }

//   savePaymentVoucher(): void {
//     this.disablesavebutton = true;
//     this.savebutton        = 'Processing';

//     try {
//       const totalPaid = this.paymentslist.reduce(
//         (sum: number, c: any) => sum + parseFloat(c.ptotalamount || 0), 0);
//       this.paymentVoucherForm.get('ptotalpaidamount')?.setValue(totalPaid);

//       if (!this.validatesavePaymentVoucher()) {
//         this.disablesavebutton = false;
//         this.savebutton        = 'Save';
//         return;
//       }

//       if (!confirm('Do You Want To Save ?')) {
//         this.disablesavebutton = false;
//         this.savebutton        = 'Save';
//         return;
//       }

//       if (this.paymentVoucherForm.get('pmodofpayment')?.value === 'CASH') {
//         this.paymentVoucherForm.get('pbankid')?.setValue(0);
//       }

//       const paymentVoucherdata = {
//         ...this.paymentVoucherForm.value,
//         ppaymentslist: this.paymentslist
//       };

//       paymentVoucherdata.ppaymentdate = this._commonService.getFormatDateNormal(paymentVoucherdata.ppaymentdate);
//       paymentVoucherdata.pchequedate  = this._commonService.getFormatDateNormal(paymentVoucherdata.pchequedate);

//       this._AccountingTransactionsService.savePettyCash(JSON.stringify(paymentVoucherdata)).subscribe(
//         (res: any) => {
//           if (res[0] === 'TRUE') {
//             this.JSONdataItem = res;
//             this._commonService.showInfoMessage('Saved successfully');
//             this.clearPaymentVoucher();
//             this.ngOnInit();
//             const receipt = btoa(res[1] + ',' + 'Petty Cash');
//             window.open('/#/PaymentVoucherReport?id=' + receipt, '_blank');
//           }
//           this.disablesavebutton = false;
//           this.savebutton        = 'Save';
//         },
//         (error: any) => {
//           this._commonService.showErrorMessage(error);
//           this.disablesavebutton = false;
//           this.savebutton        = 'Save';
//         }
//       );
//     } catch (e) {
//       this._commonService.showErrorMessage(e);
//       this.disablesavebutton = false;
//       this.savebutton        = 'Save';
//     }
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   //  FILE UPLOAD
//   // ════════════════════════════════════════════════════════════════════════════
//   uploadAndProgress(event: Event): void {
//     try {
//       const target = event.target as HTMLInputElement;
//       const file   = target?.files?.[0];
//       if (!file || !this.validateFile(file.name)) {
//         this._commonService.showWarningMessage('Upload jpg, png, or pdf files only');
//         return;
//       }

//       const reader    = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload   = () => {
//         this.imageResponse = {
//           name        : file.name,
//           fileType    : 'imageResponse',
//           contentType : file.type,
//           size        : file.size
//         };
//       };

//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('NewFileName', `Payment Voucher.${file.name.split('.').pop()}`);

//       this._commonService.fileUploadS3('Account', formData).subscribe(
//         (data: any) => {
//           if (!data?.length) return;
//           this.kycFileName = data[0];
//           this.imageResponse.name = data[0];
//           this.paymentVoucherForm.get('pDocStorePath')?.setValue(this.kycFileName);
//         },
//         (error: any) => this._commonService.showErrorMessage(error)
//       );
//     } catch (e: any) {
//       this._commonService.showErrorMessage(e.message || e);
//     }
//   }

//   validateFile(fileName: string): boolean {
//     if (!fileName) return true;
//     const ext = fileName.split('.').pop()?.toLowerCase();
//     return ['jpg', 'png', 'pdf'].includes(ext || '');
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   //  MISC
//   // ════════════════════════════════════════════════════════════════════════════
//   showErrorMessage(msg: any): void   { this._commonService.showErrorMessage(msg); }
//   showWarningMessage(msg: string): void { this._commonService.showWarningMessage(msg); }

//   get pgstno() {
//     return this.paymentVoucherForm.get('ppaymentsslistcontrols.pgstno');
//   }

//   saveJournalVoucher(): void {
//     // stub — implement if needed
//     console.log('saveJournalVoucher called');
//   }
// }