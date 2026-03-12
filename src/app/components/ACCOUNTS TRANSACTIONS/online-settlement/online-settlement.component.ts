import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccountingTransactionsService } from 'src/app/services/Transactions/AccountingTransaction/accounting-transaction.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-online-settlement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    TableModule,
    NgSelectModule
  ],
  templateUrl: './online-settlement.component.html',
  styleUrls: ['./online-settlement.component.css'],
  providers: [DatePipe]
})
export class OnlineSettlementComponent implements OnInit {

  ChequesInBankForm!: FormGroup;

  gridData: any[] = [];
  originalGridData: any[] = [];
  selected: any[] = [];

  bankList: any[] = [];
  PaytmList: any[] = [];

  currencySymbol = '₹';
  bankbalance = 0;
  bankbalancetype = '';
  brsdate = '';

  dpConfig: Partial<BsDatepickerConfig> = {};
  ptransactiondateConfig: Partial<BsDatepickerConfig> = {};
  pchequecleardateConfig: Partial<BsDatepickerConfig> = {};

  private fb = inject(FormBuilder);
  private datePipe = inject(DatePipe);
  private _Accountservice = inject(AccountingTransactionsService);
  private _CommonService = inject(CommonService);

  ngOnInit(): void {

    const todayDate = new Date();

    this.ChequesInBankForm = this.fb.group({
      ptransactiondate: [todayDate],
      pchequereceiptdate: [todayDate],
      pchequecleardate: [todayDate],
      bankname: [''],
      paytmname: [{ value: '', disabled: true }],
      chequeintype: ['A'],
      searchtext: ['']
    });

    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      showWeekNumbers: false,
      maxDate: new Date()
    };

    this.ptransactiondateConfig = this.dpConfig;
    this.pchequecleardateConfig = this.dpConfig;

    this.loadBankList();
    this.loadUPIList();
    this.loadChequeReturnCharges();
    this.loadGridData();

    this.setupDependencies();
  }

  loadBankList(): void {

    const BranchSchema = this._CommonService.getbranchname();
    const GlobalSchema = this._CommonService.getschemaname();
    const CompanyCode = this._CommonService.getCompanyCode();
    const BranchCode = this._CommonService.getBranchCode();

    this._Accountservice.GetBankntList(
      BranchSchema,
      GlobalSchema,
      CompanyCode,
      BranchCode
    ).subscribe((res: any) => {

      this.bankList = res || [];

    });
  }

  loadUPIList(): void {

    const GlobalSchema = this._CommonService.getschemaname();
    const CompanyCode = this._CommonService.getCompanyCode();
    const BranchCode = this._CommonService.getBranchCode();

    this._Accountservice.GetBankUPIDetails(
      GlobalSchema,
      BranchCode,
      CompanyCode
    ).subscribe((res: any) => {

      this.PaytmList = res || [];

    });
  }

  loadGridData(): void {

    const payload = {
      transactiondate: this.formatDate(
        this.ChequesInBankForm.value.ptransactiondate
      ),
      branchcode: this._CommonService.getBranchCode(),
      companycode: this._CommonService.getCompanyCode(),
      globalschema: this._CommonService.getschemaname()
    };

    this._Accountservice.GetOnlineSettlementList(payload)
      .subscribe((res: any) => {

        this.originalGridData = res || [];
        this.gridData = [...this.originalGridData];

      });

  }

  loadChequeReturnCharges(): void {

    const GlobalSchema = this._CommonService.getschemaname();
    const CompanyCode = this._CommonService.getCompanyCode();
    const BranchCode = this._CommonService.getBranchCode();

    this._Accountservice.getchequereturncharges(
      GlobalSchema,
      CompanyCode,
      BranchCode
    ).subscribe();
  }
  setupDependencies(): void {

    this.ChequesInBankForm.get('bankname')?.valueChanges.subscribe(value => {

      if (value) {

        this.ChequesInBankForm.get('paytmname')?.enable();

        const brstodate = this.formatDate(
          this.ChequesInBankForm.value.ptransactiondate
        );

        const BranchSchema = this._CommonService.getbranchname();
        const BranchCode = this._CommonService.getBranchCode();
        const CompanyCode = this._CommonService.getCompanyCode();

        this._Accountservice.GetBankBalance(
          '2026-02-26',
          value,
          'accounts',
          'KLC01',
          'KAPILCHITS'
        ).subscribe((res: any) => {

          this.bankbalance = res?.bankbalance || 0;
          this.bankbalancetype = res?.bankbalancetype || '';
          this.brsdate = res?.brsdate || '';

        });

      }
      else {

        this.ChequesInBankForm.get('paytmname')?.disable();
        this.ChequesInBankForm.get('paytmname')?.setValue('');

      }

    });

    this.ChequesInBankForm.get('chequeintype')?.valueChanges.subscribe(type => {
      this.applyRadioFilter(type);
    });

  }
  applyRadioFilter(type: string): void {

    if (type === 'A') {
      this.gridData = [...this.originalGridData];
    }
    else if (type === 'D') {
      this.gridData = this.originalGridData.filter(x => x.pCleardate);
    }
    else if (type === 'ND') {
      this.gridData = this.originalGridData.filter(x => !x.pCleardate);
    }

    this.selected = [];
  }
  onSearch(value: string): void {

    let filteredData = [...this.originalGridData];
    const type = this.ChequesInBankForm.value.chequeintype;

    if (type === 'D') {
      filteredData = filteredData.filter(x => x.pCleardate);
    }
    else if (type === 'ND') {
      filteredData = filteredData.filter(x => !x.pCleardate);
    }

    if (value) {
      const search = value.toLowerCase();
      filteredData = filteredData.filter(item =>
        JSON.stringify(item).toLowerCase().includes(search)
      );
    }

    this.gridData = filteredData;
  }

  getSelectedTotal(): number {
    return this.selected.reduce(
      (sum, row) => sum + (row.ptotalreceivedamount || 0),
      0
    );
  }

  clearSelection(): void {
    this.selected = [];
  }

  Save(): void {
    console.log('Selected Rows:', this.selected);
  }

  formatDate(date: Date | string | null): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
  }
}

//refactored

// import { CommonModule, DatePipe } from '@angular/common';
// import { Component, OnInit, Input, ViewChild, inject } from '@angular/core';
// import {FormsModule,ReactiveFormsModule,FormBuilder,FormGroup,Validators} from '@angular/forms';
// import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
// import { TableModule } from 'primeng/table';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { DataBindingDirective } from '@progress/kendo-angular-grid';
// import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
// import { forkJoin } from 'rxjs';
// import jsPDF from 'jspdf';
// import { AccountingTransactionsService } from 'src/app/services/Transactions/AccountingTransaction/accounting-transaction.service';
// import { CommonService } from 'src/app/services/common.service';
// import { PageCriteria } from 'src/app/Models/pageCriteria';
// import { NumberToWordsPipe } from '../../ACCOUNTS REPORTS/re-print/number-to-words.pipe';

// declare var $: any;

// interface BankAccount {
//   paccountid: number | string;
//   pdepositbankname: string;
//   pbankbalance: number;
//   pisprimary?: boolean;
// }

// interface ReceiptRow {
//   preceiptid: string | number;
//   preceiptrecordid?: any;
//   preceiptdate: string;
//   pdepositeddate: string;
//   pChequenumber?: string;
//   ptypeofpayment: string;
//   ptotalreceivedamount: number;
//   pdepositbankid?: number | string;
//   pchequestatus?: string;
//   pdepositstatus?: boolean;
//   preturnstatus?: boolean;
//   pactualcancelcharges?: number;
//   pCleardate?: string;
//   pbranchname?: string;
//   ppartyname?: string;
//   cheque_bank?: string;
//   chitReceiptNo?: string;
//   chitgroupid?: any;
//   ticketno?: any;
//   selfchequestatus?: boolean;
//   pchequedate?: string;
//   checkuncheck?: boolean;
//   chequeStatus?: string;
//   [key: string]: any;
// }

// type GridStatus = 'all' | 'chequesdeposited' | 'onlinereceipts' | 'cleared' | 'returned';
// type ModeOfReceipt = 'ONLINE' | 'CHEQUE' | 'CLEAR' | 'RETURN';
// type PdfStatus = 'All' | 'Cheques Deposited' | 'Online Receipts' | 'Cleared' | 'Returned';

// // ---------------------------------------------------------------------------
// // Component
// // ---------------------------------------------------------------------------

// @Component({
//   selector: 'app-online-settlement',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     ReactiveFormsModule,
//     BsDatepickerModule,
//     TableModule,
//     NgSelectModule,
//   ],
//   templateUrl: './online-settlement.component.html',
//   styleUrls: ['./online-settlement.component.css'],
//   providers: [DatePipe, NumberToWordsPipe],
// })
// export class OnlineSettlementComponent implements OnInit {

//   // ---- Kendo binding (kept for backwards-compat with template) ----
//   @ViewChild(DataBindingDirective, { static: true })
//   dataBinding: DataBindingDirective | undefined;

//   /** When embedded inside another form, pass the parent form name here. */
//   @Input() fromFormName: string = '';

//   // ---- Services (inject-style for standalone) ----
//   private readonly fb             = inject(FormBuilder);
//   private readonly datePipe       = inject(DatePipe);
//   private readonly _accountSvc    = inject(AccountingTransactionsService);
//   private readonly _commonSvc     = inject(CommonService);
//   private readonly _numberToWords = inject(NumberToWordsPipe);

//   // ---- Exposed enums for template bindings ----
//   readonly ColumnMode    = ColumnMode;
//   readonly SelectionType = SelectionType;

//   // ---- Form ----
//   ChequesInBankForm!: FormGroup;
//   BrsDateForm!: FormGroup;
//   ChequesInBankValidation: Record<string, string> = {};

//   // ---- Reference data ----
//   BanksList:  BankAccount[] = [];
//   PaytmList:  BankAccount[] = [];

//   // ---- Raw data from API ----
//   ChequesInBankData:        ReceiptRow[] = [];
//   ChequesClearReturnData:   ReceiptRow[] = [];
//   private _countData: any  = {};
//   private ChequesClearReturnDataBasedOnBrs: ReceiptRow[] = [];

//   // ---- Grid state ----
//   gridData:     ReceiptRow[] = [];
//   gridDatatemp: ReceiptRow[] = [];
//   gridLoading = false;

//   /** Grid used when component is embedded from ChequesStatusInformationForm */
//   displayGridDataBasedOnForm:     ReceiptRow[] = [];
//   displayGridDataBasedOnFormTemp: ReceiptRow[] = [];

//   // ---- Selection ----
//   selected:           ReceiptRow[] = [];
//   saveGridData:       ReceiptRow[] = [];
//   checkedAmountTotal  = 0;
//   checkedRowsCount    = 0;
//   checkuncheckbool    = true;

//   // ---- Totals / counts ----
//   amounttotal  = 0;
//   Totlaamount  = 0;
//   all          = 0;
//   chequesdeposited = 0;
//   onlinereceipts   = 0;
//   cleared          = 0;
//   returned         = 0;
//   totalElements: number | undefined;

//   // ---- Pagination ----
//   pageCriteria: PageCriteria;
//   page = { offset: 0, pageNumber: 1, size: 10, totalElements: 10, totalPages: 1 };
//   startindex = 0;
//   endindex   = 1000;

//   // ---- UI flags ----
//   tabsShowOrHideBasedOnfromFormName = true;
//   displayGridBasedOnFormName        = true;
//   showhidegridcolumns  = false;
//   saveshowhide: any;
//   hiddendate           = true;
//   banknameshowhide     = false;
//   paytmshowhide        = false;
//   brsdateshowhidecleared  = false;
//   brsdateshowhidereturned = false;
//   validatebrsdateclear    = false;
//   validatebrsdatereturn   = false;
//   showicons               = false;
//   disablesavebutton       = false;
//   disabletransactiondate  = false;
//   buttonname              = 'Save';
//   userBranchType: any;

//   // ---- Status trackers ----
//   status: GridStatus       = 'all';
//   pdfstatus: PdfStatus     = 'All';
//   modeofreceipt: ModeOfReceipt = 'ONLINE';

//   // ---- Misc ----
//   currencySymbol  = '₹';
//   bankbalance     = 0;
//   paytmbalance    = 0;
//   bankbalancetype = '';
//   brsdate         = '';
//   bankname        = '';
//   paytmname       = '';
//   bankid: number | string = 0;
//   bankdetails: BankAccount | undefined;
//   paytmdetails:  BankAccount | undefined;
//   bankbalancedetails: any;
//   datetitle = '';
//   validate: boolean | undefined;

//   chequereturncharges = 0;
//   chequenumber: any;
//   PopupData: ReceiptRow | undefined;
//   previewdetails:       any[] = [];
//   chequerwturnvoucherdetails: any[] = [];

//   _searchText = '';
//   fromdate    = '';
//   todate      = '';

//   today     = Date.now();
//   todayDate: any;

//   // ---- Datepicker configs ----
//   ptransactiondateConfig:   Partial<BsDatepickerConfig> = {};
//   pchequecleardateConfig:   Partial<BsDatepickerConfig> = {};
//   brsfromConfig:            Partial<BsDatepickerConfig> = {};
//   brstoConfig:              Partial<BsDatepickerConfig> = {};

//   // ===========================================================================
//   // Lifecycle
//   // ===========================================================================

//   constructor() {
//     this.pageCriteria = new PageCriteria();
//   }

//   ngOnInit(): void {
//     this.userBranchType = sessionStorage.getItem('userBranchType');

//     this.initDatepickerConfigs();
//     this.initForms();
//     this.initTabState();
//     this.setPageModel();
//     this.pageSetUp();

//     if (this._commonSvc.comapnydetails != null) {
//       this.disabletransactiondate = this._commonSvc.comapnydetails.pdatepickerenablestatus;
//     }
//     this.currencySymbol = this._commonSvc.currencysymbol;

//     this.loadBankList();
//     this.loadUPIList();
//     this.loadChequeReturnCharges();
//     this.GetBankBalance(this.bankid);
//     this.BlurEventAllControll(this.ChequesInBankForm);
//   }

//   // ===========================================================================
//   // Init helpers
//   // ===========================================================================

//   private initDatepickerConfigs(): void {
//     const base: Partial<BsDatepickerConfig> = {
//       showWeekNumbers: this._commonSvc.datePickerPropertiesSetup('showWeekNumbers'),
//       maxDate:         new Date(),
//       dateInputFormat: this._commonSvc.datePickerPropertiesSetup('dateInputFormat'),
//       containerClass:  this._commonSvc.datePickerPropertiesSetup('containerClass'),
//     };
//     this.ptransactiondateConfig = { ...base };
//     this.pchequecleardateConfig = { ...base };
//     this.brsfromConfig = { ...base };
//     this.brstoConfig   = { ...base };
//   }

//   private initForms(): void {
//     this.ChequesInBankForm = this.fb.group({
//       ptransactiondate:    [new Date()],
//       pchequecleardate:    [new Date(), Validators.required],
//       pchequereceiptdate:  [new Date()],
//       bankname:            ['', Validators.required],
//       paytmname:           ['', Validators.required],
//       pfrombrsdate:        [''],
//       ptobrsdate:          [''],
//       pchequesOnHandlist:  [null],
//       plstOnlineSettelementDTO: [null],
//       SearchClear:         [''],
//       schemaname:          [this._commonSvc.getschemaname()],
//       pCreatedby:          [this._commonSvc.getCreatedBy()],
//       pipaddress:          [this._commonSvc.getIpAddress()],
//       chequeintype:        ['A'],
//       searchtext:          [''],
//     });

//     this.BrsDateForm = this.fb.group({
//       frombrsdate: [''],
//       tobrsdate:   [''],
//     });

//     this.ChequesInBankValidation = {};
//   }

//   private initTabState(): void {
//     if (this.fromFormName === 'fromChequesStatusInformationForm') {
//       this.tabsShowOrHideBasedOnfromFormName = false;
//       this.displayGridBasedOnFormName        = false;
//       $('#chequescss').addClass('active');
//       $('#allcss').removeClass('active');
//     } else {
//       this.tabsShowOrHideBasedOnfromFormName = true;
//       this.displayGridBasedOnFormName        = true;
//       $('#allcss').addClass('active');
//       $('#chequescss').removeClass('active');
//     }
//   }

//   // ===========================================================================
//   // Data loaders
//   // ===========================================================================

//   loadBankList(): void {
//     this._accountSvc.GetBanksList(this._commonSvc.getschemaname()).subscribe((list: BankAccount[]) => {
//       this.BanksList = list.filter(b => b.pisprimary);
//     });
//   }

//   loadUPIList(): void {
//     this._accountSvc.GetPayTmBanksList(this._commonSvc.getschemaname()).subscribe((list: BankAccount[]) => {
//       this.PaytmList = list;
//     });
//   }

//   loadChequeReturnCharges(): void {
//     this._accountSvc.getChequeReturnCharges().subscribe((res: any[]) => {
//       this.chequereturncharges = res?.[0]?.chequereturncharges ?? 0;
//     });
//   }

//   GetBankBalance(bankid: number | string): void {
//     this._accountSvc.GetBankBalance(bankid).subscribe((details: any) => {
//       this.bankbalancedetails = details;

//       if (this.bankid === 0) {
//         const bal = details._BankBalance;
//         this.bankbalance     = bal < 0 ? Math.abs(bal) : bal;
//         this.bankbalancetype = bal < 0 ? 'Cr' : bal === 0 ? '' : 'Dr';
//       }

//       this.brsdate = this._commonSvc.getFormatDateGlobal(details.ptobrsdate);
//       this.ChequesInBankForm.controls['pfrombrsdate'].setValue(
//         this._commonSvc.getDateObjectFromDataBase(details.pfrombrsdate));
//       this.ChequesInBankForm.controls['ptobrsdate'].setValue(
//         this._commonSvc.getDateObjectFromDataBase(details.ptobrsdate));
//       this.BrsDateForm.controls['frombrsdate'].setValue(
//         this._commonSvc.getDateObjectFromDataBase(details.pfrombrsdate));
//       this.BrsDateForm.controls['tobrsdate'].setValue(
//         this._commonSvc.getDateObjectFromDataBase(details.ptobrsdate));
//     });
//   }

//   // ===========================================================================
//   // Grid loading — primary entry points
//   // ===========================================================================

//   /**
//    * Full reload: fetches both data + count in parallel, then refreshes
//    * whichever tab is currently active.
//    */
//   GetPAYTMBank_load(bankid: number | string, chequeintype: string): void {
//     this.gridLoading = true;
//     const receiptDate  = this.formatDate(this.ChequesInBankForm.controls['pchequereceiptdate'].value);

//     forkJoin([
//       this._accountSvc.GetPaytmInBankData(bankid, this.startindex, this.endindex,
//         this.modeofreceipt, this._searchText, '', receiptDate, chequeintype),
//       this._accountSvc.GetUPIClearedDataForTotalCount(bankid, this.startindex, this.endindex,
//         this.modeofreceipt, this._searchText, '', receiptDate, chequeintype),
//     ]).subscribe({
//       next: ([bankData, countData]) => {
//         this.gridLoading = false;
//         this.ChequesInBankData      = bankData.pchequesOnHandlist ?? [];
//         this.ChequesClearReturnData = bankData.pchequesclearreturnlist ?? [];
//         this._countData             = countData;

//         this.applyCheckState(chequeintype);
//         this.CountOfRecords();
//         this.syncActiveTab();

//         const total = countData['pchequesOnHandlist']?.[0]?.['total_count'] ?? 0;
//         this.totalElements       = total;
//         this.page.totalElements  = total;
//         this.page.totalPages     = total > 10 ? Math.floor(total / 10) + 1 : 1;
//       },
//       error: err => this._commonSvc.showErrorMessage(err),
//     });
//   }

//   /**
//    * Lightweight reload (no count refetch) — used for paging / tab switches
//    * after the initial load.
//    */
//   GetChequesInBank(bankid: number | string, startindex: number, endindex: number,
//     searchText: string, chequeintype: string): void {
//     this.gridLoading = true;
//     const receiptDate = this.formatDate(this.ChequesInBankForm.controls['pchequereceiptdate'].value);

//     this._accountSvc.GetPaytmInBankData(bankid, startindex, endindex,
//       this.modeofreceipt, this._searchText, '', receiptDate, chequeintype)
//       .subscribe({
//         next: (data: any) => {
//           this.gridLoading            = false;
//           this.ChequesInBankData      = data.pchequesOnHandlist ?? [];
//           this.ChequesClearReturnData = data.pchequesclearreturnlist ?? [];
//           this.ChequesInBankData.forEach(r => r['checkuncheck'] = true);
//           this.syncActiveTab();
//         },
//         error: err => this._commonSvc.showErrorMessage(err),
//       });
//   }

//   GetDataOnBrsDates(frombrsdate: string, tobrsdate: string, bankid: number | string): void {
//     forkJoin([
//       this._accountSvc.DataFromBrsDatesChequesInBank(frombrsdate, tobrsdate, bankid,
//         this.modeofreceipt, this._searchText, this.startindex, this.endindex),
//       this._accountSvc.GetChequesRowCount(bankid, this._searchText, frombrsdate,
//         tobrsdate, 'CHEQUESINBANK', ''),
//     ]).subscribe({
//       next: ([clearData, countData]) => {
//         const rows = (clearData['pchequesclearreturnlist'] as ReceiptRow[]).filter(r =>
//           (this.status === 'cleared'  && r.pchequestatus === 'Y') ||
//           (this.status === 'returned' && r.pchequestatus === 'R'));

//         this._countData = countData;
//         this.CountOfRecords();
//         this.gridData = rows.map(r => ({
//           ...r,
//           preceiptdate:  this._commonSvc.getFormatDateGlobal(r.preceiptdate),
//           pdepositeddate: this._commonSvc.getFormatDateGlobal(r.pdepositeddate),
//           pCleardate:    this._commonSvc.getFormatDateGlobal(r.pCleardate ?? ''),
//         }));

//         const countKey = this.status === 'cleared' ? 'clear_count' : 'return_count';
//         const total    = countData[countKey] ?? 0;
//         this.totalElements      = total;
//         this.page.totalElements = total;
//         this.page.totalPages    = total > 10 ? Math.floor(total / 10) + 1 : 1;
//       },
//       error: err => this._commonSvc.showErrorMessage(err),
//     });
//   }

//   // ===========================================================================
//   // Tab / status helpers
//   // ===========================================================================

//   /**
//    * After data loads, re-run whichever tab view is currently selected.
//    * Avoids duplicated if/else blocks scattered across load methods.
//    */
//   private syncActiveTab(): void {
//     switch (this.status) {
//       case 'chequesdeposited': this.renderChequesDeposited(); break;
//       case 'onlinereceipts':   this.renderOnlineReceipts();   break;
//       case 'cleared':          this.renderCleared();          break;
//       case 'returned':         this.renderReturned();         break;
//       default:                 this.renderAll();              break;
//     }
//     if (this.fromFormName === 'fromChequesStatusInformationForm') {
//       this.chequesStatusInfoGrid();
//     }
//   }

//   private applyCheckState(chequeintype: string): void {
//     const uncheck = chequeintype === 'D' || chequeintype === 'A';
//     this.ChequesInBankData.forEach(r => r['checkuncheck'] = !uncheck);
//     this.checkuncheckbool = !uncheck;
//   }

//   // ===========================================================================
//   // Public tab actions (bound to template buttons)
//   // ===========================================================================

//   All(): void {
//     this.resetDateRange();
//     this.modeofreceipt = 'ONLINE';
//     this.status        = 'all';
//     this.pdfstatus     = 'All';
//     this.pageSetUp();
//     this.GetPAYTMBank_load(this.bankid, this.ChequesInBankForm.controls['chequeintype'].value);
//     this.renderAll();
//   }

//   ChequesDeposited(): void {
//     this.resetDateRange();
//     this.modeofreceipt = 'CHEQUE';
//     this.status        = 'chequesdeposited';
//     this.pdfstatus     = 'Cheques Deposited';
//     this.pageSetUp();
//     this.GetChequesInBank(this.bankid, this.startindex, this.endindex,
//       this._searchText, this.ChequesInBankForm.controls['chequeintype'].value);
//     this.renderChequesDeposited();
//   }

//   OnlineReceipts(): void {
//     this.resetDateRange();
//     this.modeofreceipt = 'ONLINE';
//     this.status        = 'onlinereceipts';
//     this.pdfstatus     = 'Online Receipts';
//     this.pageSetUp();
//     this.GetChequesInBank(this.bankid, this.startindex, this.endindex,
//       this._searchText, this.ChequesInBankForm.controls['chequeintype'].value);
//     this.renderOnlineReceipts();
//   }

//   Cleared(): void {
//     this.resetDateRange();
//     this.modeofreceipt       = 'CLEAR';
//     this.status              = 'cleared';
//     this.pdfstatus           = 'Cleared';
//     this.datetitle           = 'Cleared Date';
//     this.brsdateshowhidecleared  = true;
//     this.brsdateshowhidereturned = false;
//     this.GridColumnsHide();
//     this.pageSetUp();
//     this.GetChequesInBank(this.bankid, this.startindex, this.endindex,
//       this._searchText, this.ChequesInBankForm.controls['chequeintype'].value);
//     this.restoreBrsDates(this.ChequesInBankForm);
//     this.renderCleared();
//   }

//   Returned(): void {
//     this.resetDateRange();
//     this.modeofreceipt       = 'RETURN';
//     this.status              = 'returned';
//     this.pdfstatus           = 'Returned';
//     this.datetitle           = 'Returned Date';
//     this.brsdateshowhidecleared  = false;
//     this.brsdateshowhidereturned = true;
//     this.GridColumnsHide();
//     this.pageSetUp();
//     this.GetChequesInBank(this.bankid, this.startindex, this.endindex,
//       this._searchText, this.ChequesInBankForm.controls['chequeintype'].value);
//     this.restoreBrsDates(this.BrsDateForm, true);
//     this.renderReturned();
//   }

//   // ===========================================================================
//   // Render helpers — populate gridData from the already-loaded arrays
//   // ===========================================================================

//   private renderAll(): void {
//     this.gridData     = [];
//     this.gridDatatemp = [];
//     this.fromFormName === 'fromChequesStatusInformationForm'
//       ? this.GridColumnsHide() : this.GridColumnsShow();

//     const grid = this.filterByBank(this.ChequesInBankData);
//     this.setGridData(grid);

//     const total = this._countData['pchequesOnHandlist']?.[0]?.['total_count'] ?? 0;
//     this.setPageTotals(total);
//   }

//   private renderChequesDeposited(): void {
//     this.gridData     = [];
//     this.gridDatatemp = [];
//     this.fromFormName === 'fromChequesStatusInformationForm'
//       ? this.GridColumnsHide() : this.GridColumnsShow();

//     const grid = this.filterByBankAndType(this.ChequesInBankData, 'CHEQUE');
//     this.setGridData(grid);
//     this.setPageTotals(this._countData['cheques_count'] ?? 0);
//   }

//   private renderOnlineReceipts(): void {
//     this.gridData     = [];
//     this.gridDatatemp = [];
//     this.fromFormName === 'fromChequesStatusInformationForm'
//       ? this.GridColumnsHide() : this.GridColumnsShow();

//     const grid = this.filterByBankAndType(this.ChequesInBankData, 'CHEQUE', true);
//     this.setGridData(grid);
//     this.setPageTotals(this._countData['others_count'] ?? 0);
//   }

//   private renderCleared(): void {
//     this.gridData     = [];
//     this.gridDatatemp = [];
//     this.GridColumnsHide();

//     const grid = this.filterClearReturn('Y');
//     this.setGridData(grid);
//     this.setPageTotals(this._countData['clear_count'] ?? 0);
//   }

//   private renderReturned(): void {
//     this.gridData     = [];
//     this.gridDatatemp = [];
//     this.GridColumnsHide();

//     const grid = this.filterClearReturn('R');
//     this.setGridData(grid);
//     this.setPageTotals(this._countData['return_count'] ?? 0);
//   }

//   // ===========================================================================
//   // Filter utilities
//   // ===========================================================================

//   /** Keep rows matching bankid (pass-all when bankid === 0). */
//   private filterByBank(rows: ReceiptRow[]): ReceiptRow[] {
//     return this.bankid === 0 ? rows
//       : rows.filter(r => r.pdepositbankid == this.bankid);
//   }

//   /**
//    * Filter by bank AND payment type.
//    * @param exclude  When true, keep rows that do NOT match `type`.
//    */
//   private filterByBankAndType(rows: ReceiptRow[], type: string, exclude = false): ReceiptRow[] {
//     return this.filterByBank(rows).filter(r =>
//       exclude ? r.ptypeofpayment !== type : r.ptypeofpayment === type);
//   }

//   private filterClearReturn(status: 'Y' | 'R'): ReceiptRow[] {
//     return this.bankid === 0
//       ? this.ChequesClearReturnData.filter(r => r.pchequestatus === status)
//       : this.ChequesClearReturnData.filter(r =>
//           r.pchequestatus === status && r.pdepositbankid == this.bankid);
//   }

//   // ===========================================================================
//   // Grid-state helpers
//   // ===========================================================================

//   private setGridData(rows: ReceiptRow[]): void {
//     this.gridData     = JSON.parse(JSON.stringify(rows));
//     this.gridDatatemp = this.gridData;
//     this.showicons    = this.gridData.length > 0;
//     this.amounttotal  = this.gridData.reduce((s, r) => s + r.ptotalreceivedamount, 0);
//     this.updatePagination(this.gridData.length);
//   }

//   private updatePagination(count: number): void {
//     this.pageCriteria.totalrows    = count;
//     this.pageCriteria.TotalPages   = count > this.pageCriteria.pageSize
//       ? Math.floor(count / this.pageCriteria.pageSize) + 1 : 1;
//     this.pageCriteria.currentPageRows = count < this.pageCriteria.pageSize
//       ? count : this.pageCriteria.pageSize;
//   }

//   private setPageTotals(total: number): void {
//     this.totalElements      = total;
//     this.page.totalElements = total;
//     this.page.totalPages    = total > 10 ? Math.floor(total / 10) + 1 : 1;
//   }

//   GridColumnsShow(): void {
//     this.showhidegridcolumns     = false;
//     this.saveshowhide            = true;
//     this.brsdateshowhidecleared  = false;
//     this.brsdateshowhidereturned = false;
//     this.hiddendate              = true;
//   }

//   GridColumnsHide(): void {
//     this.showhidegridcolumns = true;
//     this.saveshowhide        = false;
//     this.hiddendate          = false;
//   }

//   CountOfRecords(): void {
//     this.all             = this._countData['pchequesOnHandlist']?.[0]?.['total_count'] ?? 0;
//     this.onlinereceipts  = this._countData['others_count']  ?? 0;
//     this.chequesdeposited = this._countData['cheques_count'] ?? 0;
//     this.cleared         = this._countData['clear_count']   ?? 0;
//     this.returned        = this._countData['return_count']  ?? 0;
//   }

//   // ===========================================================================
//   // Pagination
//   // ===========================================================================

//   setPageModel(): void {
//     this.pageCriteria.pageSize        = this._commonSvc.pageSize;
//     this.pageCriteria.offset          = 0;
//     this.pageCriteria.pageNumber      = 1;
//     this.pageCriteria.footerPageHeight = 50;
//   }

//   pageSetUp(): void {
//     this.page.offset       = 0;
//     this.page.pageNumber   = 1;
//     this.page.size         = this._commonSvc.pageSize;
//     this.startindex        = 0;
//     this.endindex          = 1000;
//     this.page.totalElements = 10;
//     this.page.totalPages   = 1;
//   }

//   setPage(pageInfo: any, event: any): void {
//     this.page.offset      = event.page - 1;
//     this.page.pageNumber  = pageInfo.page;
//     this.endindex         = this.page.pageNumber * this.page.size;
//     this.startindex       = this.endindex - this.page.size;
//     this.GetChequesInBank(this.bankid, this.startindex, this.endindex, '',
//       this.ChequesInBankForm.controls['chequeintype'].value);
//   }

//   onFooterPageChange(event: any): void {
//     this.pageCriteria.offset      = event.page - 1;
//     this.pageCriteria.CurrentPage = event.page;
//     this.pageCriteria.currentPageRows = (this.pageCriteria.totalrows < event.page * this.pageCriteria.pageSize)
//       ? this.pageCriteria.totalrows % this.pageCriteria.pageSize
//       : this.pageCriteria.pageSize;
//   }

//   // ===========================================================================
//   // Events — bank / UPI selection
//   // ===========================================================================

//   SelectBank(event: Event): void {
//     const value = (event.target as HTMLSelectElement).value;
//     if (!value) {
//       this.bankname        = '';
//       this.banknameshowhide = false;
//       return;
//     }
//     this.banknameshowhide = true;
//     this.bankdetails      = this.BanksList.find(b => String(b.paccountid) === value);
//     if (!this.bankdetails) return;

//     this.bankname = this.bankdetails.pdepositbankname;
//     this.setBankBalance(this.bankdetails.pbankbalance);
//   }

//   SelectPaytm(event: Event): void {
//     const value = (event.target as HTMLSelectElement).value;
//     if (!value) return;

//     this.gridLoading  = true;
//     this.paytmshowhide = true;
//     this.paytmdetails = this.PaytmList.find(p => String(p.paccountid) === value);
//     if (!this.paytmdetails) return;

//     this.bankid    = this.paytmdetails.paccountid;
//     this.paytmname = this.paytmdetails.pdepositbankname;
//     this.setPaytmBalance(this.paytmdetails.pbankbalance);

//     const chequeintype = this.ChequesInBankForm.controls['chequeintype'].value;
//     this.GetPAYTMBank_load(this.bankid, chequeintype);
//     this.GetBankBalance(this.bankid);
//     this.ChequesInBankForm.controls['SearchClear'].setValue('');
//   }

//   private setBankBalance(balance: number): void {
//     this.bankbalance     = balance < 0 ? Math.abs(balance) : balance;
//     this.bankbalancetype = balance < 0 ? 'Cr' : balance === 0 ? '' : 'Dr';
//   }

//   private setPaytmBalance(balance: number): void {
//     this.paytmbalance    = balance < 0 ? Math.abs(balance) : balance;
//     this.bankbalancetype = balance < 0 ? 'Cr' : balance === 0 ? '' : 'Dr';
//   }

//   // ===========================================================================
//   // Events — date changes
//   // ===========================================================================

//   change_date(_event: any): void {
//     this.selected = [];
//     this.gridData.forEach(r => {
//       r.pdepositstatus = false;
//       r['pcancelstatus']  = false;
//       r.pchequestatus  = 'N';
//     });
//   }

//   Receipt_change_date(_event: any): void {
//     this.selected = [];
//     const chequeintype = this.ChequesInBankForm.controls['chequeintype'].value;
//     this.GetChequesInBank(this.bankid, this.startindex, this.endindex,
//       this._searchText, chequeintype);
//   }

//   chequeintypeChange(event: string): void {
//     this.ChequesInBankForm.controls['searchtext'].setValue('');
//     if (event !== undefined) {
//       this.ChequesInBankForm.controls['chequeintype'].setValue(event);
//       this.GetChequesInBank(this.bankid, this.startindex, this.endindex,
//         this._searchText, event);
//     }
//     const uncheck = event === 'D' || event === 'A';
//     this.ChequesInBankData.forEach(r => r['checkuncheck'] = !uncheck);
//     this.checkuncheckbool = !uncheck;
//   }

//   // ===========================================================================
//   // Search
//   // ===========================================================================

//   onSearch(event: any): void {
//     const searchText = String(event);
//     this._searchText = searchText;

//     if (this.fromFormName === 'fromChequesStatusInformationForm') {
//       this.displayGridDataBasedOnForm = searchText
//         ? this._commonSvc.transform(this.displayGridDataBasedOnFormTemp, searchText,
//             this.isNumeric(searchText) ? 'pChequenumber' : '')
//         : this.displayGridDataBasedOnFormTemp;

//       this.updatePagination(this.displayGridDataBasedOnForm.length);
//       return;
//     }

//     const searchThreshold = parseInt(this._commonSvc.searchfilterlength, 10);

//     if (searchText !== '' && searchText.length > searchThreshold) {
//       this.pageSetUp();
//       const chequeintype = this.ChequesInBankForm.controls['chequeintype'].value;
//       this.GetPAYTMBank_load(this.bankid, chequeintype);
//       this.gridData = this._commonSvc
//         .transform(this.gridDatatemp, searchText,
//           this.isNumeric(searchText) ? 'pChequenumber' : '')
//         .map(r => ({
//           ...r,
//           checkuncheck: chequeintype === 'D' ? false : r.checkuncheck,
//         }));
//       this.gridData = [...this.gridData];
//     } else {
//       if (searchText === '') {
//         this.ChequesInBankForm.controls['chequeintype'].setValue('A');
//         this.pageSetUp();
//         this.GetPAYTMBank_load(this.bankid, 'A');
//       }
//       this.gridData = this.gridDatatemp;
//     }

//     this.amounttotal = this.gridData.reduce((s, r) => s + r.ptotalreceivedamount, 0);
//   }

//   private isNumeric(value: string): boolean {
//     const code = value.charCodeAt(value.length - 1);
//     return code > 47 && code < 58;
//   }

//   // ===========================================================================
//   // BRS date filtering
//   // ===========================================================================

//   ShowBrsClear(): void {
//     this._searchText = '';
//     this.gridData    = [];
//     this.cleared     = 0;
//     const fromdate = this.ChequesInBankForm.controls['pfrombrsdate'].value;
//     const todate   = this.ChequesInBankForm.controls['ptobrsdate'].value;

//     if (!fromdate || !todate) {
//       this._commonSvc.showWarningMessage('select fromdate and todate');
//       return;
//     }

//     if (fromdate > todate) {
//       this.validatebrsdateclear = true;
//       return;
//     }

//     this.validatebrsdateclear = false;
//     this.fromdate = this._commonSvc.getFormatDateNormal(fromdate);
//     this.todate   = this._commonSvc.getFormatDateNormal(todate);
//     this.pageSetUp();
//     this.GetDataOnBrsDates(this.fromdate, this.todate, this.bankid);
//   }

//   ShowBrsReturn(): void {
//     $('#search').val('');
//     this._searchText = '';
//     this.gridData    = [];
//     this.returned    = 0;
//     const fromdate = this.BrsDateForm.controls['frombrsdate'].value;
//     const todate   = this.BrsDateForm.controls['tobrsdate'].value;

//     if (!fromdate || !todate) {
//       this._commonSvc.showWarningMessage('select fromdate and todate');
//       return;
//     }

//     if (fromdate > todate) {
//       this.validatebrsdatereturn = true;
//       return;
//     }

//     this.validatebrsdatereturn = false;
//     this.fromdate = this._commonSvc.getFormatDateNormal(fromdate);
//     this.todate   = this._commonSvc.getFormatDateNormal(todate);
//     this.pageSetUp();
//     this.GetDataOnBrsDates(this.fromdate, this.todate, this.bankid);
//   }

//   private restoreBrsDates(form: FormGroup, useBrsForm = false): void {
//     const from = this._commonSvc.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate);
//     const to   = this._commonSvc.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate);
//     form.controls['frombrsdate']?.setValue(from);
//     form.controls['tobrsdate']?.setValue(to);
//     if (!useBrsForm) {
//       form.controls['pfrombrsdate']?.setValue(from);
//       form.controls['ptobrsdate']?.setValue(to);
//     }
//   }

//   private resetDateRange(): void {
//     this.fromdate = '';
//     this.todate   = '';
//   }

//   // ===========================================================================
//   // Checkbox / selection handlers
//   // ===========================================================================

//   CheckedClear(event: Event, data: ReceiptRow): void {
//     const checkbox = event.target as HTMLInputElement;
//     let isvalid = true;
//     isvalid = this.checkValidations(this.ChequesInBankForm, isvalid);

//     if (!isvalid) {
//       this._commonSvc.showWarningMessage('Select the Debited & Credited Banks');
//       this.resetRowStatus(data);
//       checkbox.checked = false;
//       this.updateRow(data);
//       return;
//     }

//     if (checkbox.checked) {
//       const receiptdate    = this._commonSvc.getDateObjectFromDataBase(
//         this.gridData.find(r => r.preceiptid === data.preceiptid)?.pdepositeddate ?? '');
//       const chequecleardate = this.ChequesInBankForm.controls['pchequecleardate'].value;

//       if (new Date(chequecleardate) >= new Date(receiptdate)) {
//         data.pdepositstatus = true;
//         data.preturnstatus  = false;
//         data.pchequestatus  = 'Y';
//       } else {
//         this.resetRowStatus(data);
//         checkbox.checked = false;
//         this._commonSvc.showWarningMessage(
//           'Cheque Clear Date Should be Greater than or Equal to Deposited Date');
//       }
//     } else {
//       this.resetRowStatus(data);
//     }
//     this.updateRow(data);
//   }

//   CheckedReturn(event: Event, data: ReceiptRow): void {
//     const checkbox = event.target as HTMLInputElement;
//     this.PopupData = data;

//     if (checkbox.checked) {
//       const receiptdate     = this._commonSvc.getDateObjectFromDataBase(
//         this.gridData.find(r => r.preceiptid === data.preceiptid)?.pdepositeddate ?? '');
//       const chequecleardate = this.ChequesInBankForm.controls['pchequecleardate'].value;

//       if (new Date(chequecleardate) >= new Date(receiptdate)) {
//         data.preturnstatus  = true;
//         data.pdepositstatus = false;
//         data.pchequestatus  = 'R';
//         $('#cancelcharges').val(this.chequereturncharges);
//         this.chequenumber = data.pChequenumber;
//         $('#add-detail').modal('show');
//       } else {
//         data.preturnstatus = false;
//         data.pchequestatus = 'N';
//         checkbox.checked   = false;
//         this._commonSvc.showWarningMessage(
//           'Cheque Clear Date Should be Greater than or Equal Deposited Date');
//       }
//     } else {
//       data.preturnstatus = false;
//       data.pchequestatus = 'N';
//     }
//     this.updateRow(data);
//   }

//   private resetRowStatus(data: ReceiptRow): void {
//     data.pdepositstatus = false;
//     data.pchequestatus  = 'N';
//   }

//   private updateRow(data: ReceiptRow): void {
//     const idx = this.gridData.findIndex(r => r.preceiptid === data.preceiptid);
//     if (idx !== -1) this.gridData[idx] = data;
//   }

//   onSelect({ selected }: { selected: ReceiptRow[] }): void {
//     this.saveGridData       = [...selected];
//     this.checkedAmountTotal = this.saveGridData.reduce((s, r) => s + r.ptotalreceivedamount, 0);
//     this.checkedRowsCount   = this.saveGridData.length;
//   }

//   CancelChargesOk(value: string): void {
//     if (!value) {
//       this._commonSvc.showWarningMessage(`Minimum Amount Should Be ${this.chequereturncharges}`);
//       return;
//     }
//     const row = this.gridData.find(r => r.preceiptid === this.PopupData?.preceiptid);
//     if (row) row.pactualcancelcharges = +value;
//     $('#add-detail').modal('hide');
//   }

//   returnCharges_Change(event: Event): void {
//     const val = (event.target as HTMLInputElement).value;
//     if (!val || parseFloat(val) < this.chequereturncharges) {
//       this._commonSvc.showWarningMessage(`Minimum Amount Should Be ${this.chequereturncharges}`);
//       $('#cancelcharges').val('');
//     }
//   }

//   getSelectedTotal(): number {
//     return this.saveGridData.reduce((s, r) => s + r.ptotalreceivedamount, 0);
//   }

//   private validateSave(): boolean {
//     let isvalid = this.checkValidations(this.ChequesInBankForm, true);

//     const chequecleardate = this.ChequesInBankForm.controls['pchequecleardate'].value;
//     const transactiondate = this.ChequesInBankForm.controls['ptransactiondate'].value;

//     if (new Date(transactiondate) < new Date(chequecleardate)) {
//       this._commonSvc.showWarningMessage(
//         'Transaction Date Should be Greater than or Equal to Cheque Clear Date');
//       isvalid = false;
//     }
//     if (isvalid && !confirm('Do You Want To Save ?')) {
//       isvalid = false;
//     }
//     return isvalid;
//   }

//   Save(): void {
//     if (!this.validateSave()) return;

//     this.disablesavebutton = true;
//     this.buttonname        = 'Processing';
//     this.saveGridData.forEach(r => r.pdepositstatus = true);

//     const payload: any[] = this.saveGridData
//       .filter(r => r.pdepositstatus)
//       .map(r => ({
//         pbranch_id:           this._commonSvc.getbrachid(),
//         pbranch_name:         r.pbranchname,
//         pselfchequestatus:    r.selfchequestatus,
//         preceiptrecordid:     r.preceiptrecordid,
//         preceiptid:           r.preceiptid,
//         preceiptdate:         r.preceiptdate,
//         ptotalreceivedamount: r.ptotalreceivedamount,
//         pcontactid:           '',
//         pcontact_name:        r.ppartyname,
//         pmodeofreceipt:       r.ptypeofpayment,
//         preferencenumber:     r.pChequenumber,
//         pchequesdate:         r.pchequedate,
//         pdeposit_status:      r.pchequestatus,
//         pdeposit_bankid:      r.pdepositbankid,
//         pdeposited_date:      r.pdepositeddate,
//         pcheque_bank:         r.cheque_bank,
//         preceipt_branch_name: '',
//         preceived_from:       '',
//         chit_receipt_number:  r.chitReceiptNo,
//         chitgroup_id:         r.chitgroupid,
//         ticketno:             r.ticketno,
//         ptransactiondate:     this.formatDate(
//           this.ChequesInBankForm.controls['ptransactiondate'].value),
//       }));

//     if (payload.length === 0) {
//       this._commonSvc.showWarningMessage('Select atleast one record');
//       this.resetSaveButton();
//       return;
//     }

//     this.ChequesInBankForm.controls['plstOnlineSettelementDTO'].setValue(payload);
//     const formData              = this.ChequesInBankForm.value;
//     const debitAmount           = payload
//       .filter(p => p.pselfchequestatus)
//       .reduce((s, p) => s + p.ptotalreceivedamount, 0);

//     formData.debit_account_id   = this.ChequesInBankForm.controls['bankname'].value;
//     formData.credit_account_id  = this.ChequesInBankForm.controls['paytmname'].value;
//     formData.account_trans_type = 'D';
//     formData.debit_amount       = debitAmount.toFixed(2);
//     formData.credit_amount      = debitAmount.toFixed(2);
//     formData.transaction_date   = this.formatDate(
//       this.ChequesInBankForm.controls['ptransactiondate'].value);
//     formData.jv_type            = 'A';
//     formData.pmodeoftransaction = 'C';

//     this._accountSvc.SaveOnLineCollection_JV(JSON.stringify(formData)).subscribe({
//       next: (data: any) => {
//         if (data) this._commonSvc.showSuccessMessage();
//         this.Clear();
//         this.resetSaveButton();
//       },
//       error: (err: any) => {
//         this._commonSvc.showErrorMessage(err);
//         this.resetSaveButton();
//       },
//     });
//   }

//   private resetSaveButton(): void {
//     this.disablesavebutton = false;
//     this.buttonname        = 'Save';
//   }

//   Clear(): void {
//     this.ChequesInBankForm.reset();
//     this.ngOnInit();
//     $('#bankselection').val('');
//     $('#search').val('');
//     this._searchText        = '';
//     this.fromdate           = '';
//     this.todate             = '';
//     this.ChequesInBankValidation = {};
//     this.checkedRowsCount   = 0;
//     this.checkedAmountTotal = 0;
//   }

//   // ===========================================================================
//   // Info-grid (fromChequesStatusInformationForm mode)
//   // ===========================================================================

//   chequesStatusInfoGrid(): void {
//     $('#chequescss').addClass('active');
//     $('#allcss').removeClass('active');

//     const grid: ReceiptRow[] = [
//       ...this.ChequesInBankData
//         .filter(r => r.ptypeofpayment === 'CHEQUE')
//         .map(r => ({ ...r, chequeStatus: 'Deposited' })),
//       ...this.ChequesClearReturnData
//         .filter(r => r.pchequestatus === 'Y')
//         .map(r => ({ ...r, chequeStatus: 'Cleared' })),
//       ...this.ChequesClearReturnData
//         .filter(r => r.pchequestatus === 'R')
//         .map(r => ({ ...r, chequeStatus: 'Returned' })),
//     ];

//     this.displayGridDataBasedOnForm     = grid;
//     this.displayGridDataBasedOnFormTemp = JSON.parse(JSON.stringify(grid));
//     this.setPageModel();
//     this.updatePagination(grid.length);
//   }

//   // ===========================================================================
//   // PDF / Print / Export
//   // ===========================================================================

//   pdfOrprint(printorpdf: any): void {
//     this.Totlaamount = 0;
//     const receiptDate  = this.formatDate(this.ChequesInBankForm.controls['pchequereceiptdate'].value);
//     const chequeintype = this.ChequesInBankForm.controls['chequeintype'].value;

//     forkJoin([
//       this._accountSvc.GetPaytmInBankData(this.bankid, 0, 999999,
//         this.modeofreceipt, this._searchText, 'PDF', receiptDate, chequeintype),
//       this._accountSvc.DataFromBrsDatesChequesInBank(this.fromdate, this.todate,
//         this.bankid, this.modeofreceipt, this._searchText, 0, 99999),
//     ]).subscribe(([bankData, clearData]) => {
//       const gridData: ReceiptRow[] =
//         (this.pdfstatus === 'Cleared' || this.pdfstatus === 'Returned')
//           ? clearData['pchequesclearreturnlist']
//           : bankData.pchequesOnHandlist;

//       const isClearedOrReturned = this.pdfstatus === 'Cleared' || this.pdfstatus === 'Returned';
//       const upiName             = this.resolveUPIName();
//       const reportname          = `Online Collection Settlement ${upiName}`;

//       const gridheaders = isClearedOrReturned
//         ? ['Reference No.', 'Branch Name', 'Amount', 'Receipt ID', 'Receipt Date',
//             'Deposited Date', this.datetitle, 'Transaction \nMode', 'Cheque Bank Name',
//             'chit Receipt No', 'Party']
//         : ['Reference No.', 'Branch Name', 'Amount', 'Receipt ID', 'Receipt Date',
//             'Deposited Date', 'Transaction \nMode', 'Cheque Bank Name', 'Chit Receipt No', 'Party'];

//       let totalAmt = 0;
//       const rows = gridData.map(r => {
//         const amt = r.ptotalreceivedamount !== 0
//           ? this._commonSvc.convertAmountToPdfFormat(this._commonSvc.currencyformat(r.ptotalreceivedamount))
//           : '';
//         totalAmt += r.ptotalreceivedamount;
//         const base = [
//           r.pChequenumber,
//           r.pbranchname,
//           amt,
//           r.preceiptid,
//           this._commonSvc.getFormatDateGlobal(r.preceiptdate),
//           this._commonSvc.getFormatDateGlobal(r.pdepositeddate),
//         ];
//         if (isClearedOrReturned) base.push(this._commonSvc.getFormatDateGlobal(r.pCleardate ?? ''));
//         base.push(r.ptypeofpayment, r.cheque_bank, r.chitReceiptNo, r.ppartyname);
//         return base;
//       });

//       const amtFormatted = this._commonSvc.convertAmountToPdfFormat(
//         this._commonSvc.currencyformat(totalAmt));
//       rows.push(['', 'Total', amtFormatted, '', '', '', '', '', '', '', '']);
//       this.amounttotal = totalAmt;

//       this._commonSvc._downloadonlineUPIReportsPdf(
//         reportname, rows, gridheaders, {}, 'landscape', '', '', '', printorpdf, amtFormatted);
//     });
//   }

//   export(): void {
//     const receiptDate  = this.formatDate(this.ChequesInBankForm.controls['pchequereceiptdate'].value);
//     const chequeintype = this.ChequesInBankForm.controls['chequeintype'].value;

//     forkJoin([
//       this._accountSvc.GetPaytmInBankData(this.bankid, 0, 999999,
//         this.modeofreceipt, this._searchText, 'PDF', receiptDate, chequeintype),
//       this._accountSvc.DataFromBrsDatesChequesInBank(this.fromdate, this.todate,
//         this.bankid, this.modeofreceipt, this._searchText, 0, 99999),
//     ]).subscribe(([bankData, clearData]) => {
//       const gridData: ReceiptRow[] =
//         (this.pdfstatus === 'Cleared' || this.pdfstatus === 'Returned')
//           ? clearData['pchequesclearreturnlist']
//           : bankData.pchequesOnHandlist;

//       const rows = gridData.map(r => {
//         const amt = r.ptotalreceivedamount !== 0
//           ? this._commonSvc.removeCommasInAmount(r.ptotalreceivedamount)
//           : '';
//         const base: Record<string, any> = {
//           'Reference No.':   r.pChequenumber,
//           'Branch Name':     r.pbranchname,
//           'Amount':          amt,
//           'Receipt Id':      r.preceiptid,
//           'Receipt Date':    this._commonSvc.getFormatDateGlobal(r.preceiptdate),
//           'Deposited Date':  this._commonSvc.getFormatDateGlobal(r.pdepositeddate),
//         };
//         const cleardate = r.pCleardate
//           ? this._commonSvc.getFormatDateGlobal(r.pCleardate) : '';
//         if (this.pdfstatus === 'Cleared')  base['Cleared Date']  = cleardate;
//         if (this.pdfstatus === 'Returned') base['Returned Date'] = cleardate;
//         base['Transaction Mode']  = r.ptypeofpayment;
//         base['Cheque Bank Name']  = r.cheque_bank;
//         base['Chit Receipt No']   = r.chitReceiptNo;
//         base['Party']             = r.ppartyname;
//         return base;
//       });

//       this._commonSvc.exportAsExcelFile(rows, 'Online Collection');
//     });
//   }

//   // ===========================================================================
//   // Cheque-return PDFs
//   // ===========================================================================

//   pdfContentData(): void {
//     if (!this.previewdetails.length) return;
//     const lMargin = 15, rMargin = 15, pdfInMM = 210;
//     const doc        = new jsPDF();
//     const company    = this._commonSvc._getCompanyDetails();
//     const address    = this._commonSvc.getcompanyaddress();
//     const today      = this._commonSvc.getFormatDateGlobal(new Date());
//     this.todayDate   = this.datePipe.transform(this.today, 'dd-MMM-yyyy h:mm:ss a');

//     this.previewdetails.forEach((obj, idx) => {
//       const isLast = idx === this.previewdetails.length - 1;
//       this.renderChequeReturnNoticePage(doc, obj, company, address, today, pdfInMM, lMargin, rMargin);
//       isLast ? doc.save('Cheque Return Invoice.pdf') : doc.addPage();
//     });
//   }

//   private renderChequeReturnNoticePage(
//     doc: any, obj: any, company: any, address: string,
//     today: string, pdfInMM: number, lMargin: number, rMargin: number,
//   ): void {
//     const dateStr = `Date  : ${today}`;
//     const logo    = this._commonSvc.getKapilGroupLogo();

//     doc.addImage(logo, 'JPEG', 10, 5);
//     doc.setFont('Times-Italic');
//     doc.setFontStyle('normal');
//     doc.setFontSize(12);
//     doc.setTextColor('black');
//     doc.text(company.pCompanyName, 72, 10);
//     doc.setFontSize(8);
//     doc.text(address.substr(0, 115), 110, 15, 0, 0, 'center');
//     doc.text(address.substring(115), 110, 18);
//     if (company.pCinNo) doc.text(`CIN : ${company.pCinNo}`, 90, 22);
//     doc.setFontSize(14);
//     doc.text('Cheque Return Invoice', 92, 30);
//     doc.setFontSize(12);
//     doc.text('To,', 30, 55);
//     doc.text([`${obj.psubscribername.trim()}, `, `${obj.paddress}.`], 30, 60);
//     doc.text(dateStr, 160, 45);
//     doc.text('Dear Sir / Madam', 15, 90);
//     doc.text('SUB : NOTICE REGARDING RETURN OF YOUR CHEQUE.', 55, 97);
//     doc.text(`Ref : Chit No. : ${obj.pchitno}`, 70, 104);

//     const content = [
//       `We regret to inform you that your cheque No : ${obj.preferencenumber} dated : `,
//       `${this._commonSvc.getFormatDateGlobal(obj.pchequedate)} for Rs. `,
//       `${this._commonSvc.convertAmountToPdfFormat(obj.ptotalreceivedamount)} drawn on : `,
//       `${obj.pbankname}  towards subscription to the above Chit : ${obj.pchitno} has been returned by your bank unpaid.\n\n`,
//       `Kindly arrange payment of the amount of the cheque in cash or demand draft together with penalty of Rs. `,
//       `${this._commonSvc.convertAmountToPdfFormat(obj.pchequereturnchargesamount)} and Bank Charges immediately on receipt of this letter.\n\n`,
//       `Please note that our Official Receipt No. ${obj.preceiptid} Date : `,
//       `${this._commonSvc.getFormatDateGlobal(obj.pchequedate)} issued in this regard stands cancelled. Henceforth payment of subscription may please be made either in cash or by D.D only.\n\n`,
//       `Please note that under the provision of Section 138B of Negotiable Instruments Act we can/will initiate legal proceeding against you if you fail to pay the dishonoured cheque amount within Fifteen days from the date of this notice.\n\n`,
//       `We hope you will not allow us to initiate the above proceedings.\n\nWe request your immediate response.\n\n`,
//     ].join('');

//     const lines = doc.splitTextToSize(content, pdfInMM - lMargin - rMargin);
//     doc.text(15, 115, lines);
//     doc.text('Yours faithfully,', 165, 200);
//     doc.text(`For ${company.pCompanyName}`, 115, 207);
//     doc.text('Manager', 165, 220);
//   }

//   chequereturnvoucherpdf(): void {
//     if (!this.chequerwturnvoucherdetails.length) return;
//     const doc     = new jsPDF();
//     const company = this._commonSvc._getCompanyDetails();
//     const address = this._commonSvc.getcompanyaddress();
//     this.todayDate = this.datePipe.transform(this.today, 'dd-MMM-yyyy h:mm:ss a');

//     this.chequerwturnvoucherdetails.forEach((obj, idx) => {
//       const isLast = idx === this.chequerwturnvoucherdetails.length - 1;
//       this.renderChequeReturnVoucherPage(doc, obj, company, address);
//       isLast ? doc.save('Cheque Return Voucher.pdf') : doc.addPage();
//     });
//   }

//   private renderChequeReturnVoucherPage(
//     doc: any, obj: any, company: any, address: string,
//   ): void {
//     const logo  = this._commonSvc.getKapilGroupLogo();
//     const today = this._commonSvc.getFormatDateGlobal(new Date());

//     doc.addImage(logo, 'JPEG', 10, 5);
//     doc.setFont('Times-Italic');
//     doc.setFontStyle('normal');
//     doc.setFontSize(12);
//     doc.setTextColor('black');
//     doc.text(company.pCompanyName, 72, 10);
//     doc.setFontSize(8);
//     doc.text(address.substr(0, 115), 110, 15, 0, 0, 'center');
//     doc.text(address.substring(115), 110, 18);
//     if (company.pCinNo) doc.text(`CIN : ${company.pCinNo}`, 90, 22);
//     doc.setFontSize(14);
//     doc.text('Cheque Return Voucher', 92, 30);
//     doc.setFontSize(12);
//     doc.line(15, 42, 220, 42);
//     doc.text(`Printed On  :  ${this.todayDate}`, 15, 40);
//     doc.text(`Date  : ${today}`, 160, 48);
//     doc.text(`Voucher No. : ${obj.pvoucherno}`, 15, 48);
//     doc.text(`Debit To       : ${obj.pdebitaccountname}`, 15, 55);
//     doc.text(`Bank             : ${obj.pcreditaccountname}`, 15, 62);
//     doc.text(`Amount In Words :  Rupees ${this.titleCase(
//       this._numberToWords.transform(obj.ptotalreceivedamount))} Only.`, 15, 125);

//     const body = [
//       ['Cheque No.',   obj.preferencenumber],
//       ['Cheque Date',  this._commonSvc.getFormatDateGlobal(obj.pchequedate)],
//       ['Bank',         obj.pbankname],
//       ['Branch',       obj.pbranchname],
//       ['Receipt No.',  obj.preceiptid],
//       ['Receipt Date', this._commonSvc.getFormatDateGlobal(obj.pchequedate)],
//       [{ content: 'Amount', colSpan: 1, styles: { halign: 'right', fontStyle: 'bold' } },
//         this._commonSvc.currencyFormat(obj.ptotalreceivedamount)],
//     ];

//     doc.autoTable({
//       columns: ['PARTICULARS', ''],
//       body,
//       theme: 'grid',
//       headStyles: {
//         fillColor: this._commonSvc.pdfProperties('Header Color1'),
//         halign:    this._commonSvc.pdfProperties('Header Alignment'),
//         fontSize: 9, lineWidth: 0.1, textColor: 'black',
//       },
//       styles: { cellPadding: 1, fontSize: 10, overflow: 'linebreak', textColor: 'black' },
//       startY: 69,
//       margin: { right: 35, left: 35 },
//     });

//     doc.rect(15, 135, 30, 12, 'S');
//     doc.text('Manager', 55, 145);
//     doc.text('Accounts Officer', 110, 145);
//     doc.text('Cashier', 180, 145);
//   }

//   // ===========================================================================
//   // Form validation
//   // ===========================================================================

//   checkValidations(group: FormGroup, isValid: boolean): boolean {
//     try {
//       Object.keys(group.controls).forEach(key => {
//         isValid = this.GetValidationByControl(group, key, isValid);
//       });
//     } catch (e) {
//       this._commonSvc.showErrorMessage(e);
//       return false;
//     }
//     return isValid;
//   }

//   GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
//     try {
//       const control = formGroup.get(key);
//       if (!control) return isValid;

//       if (control instanceof FormGroup) {
//         this.checkValidations(control, isValid);
//       } else if (control.validator) {
//         this.ChequesInBankValidation[key] = '';
//         if (control.errors || control.invalid || control.touched || control.dirty) {
//           const label = (document.getElementById(key) as HTMLInputElement)?.title ?? key;
//           for (const errorkey in control.errors) {
//             const msg = this._commonSvc.getValidationMessage(control, errorkey, label, key, '');
//             this.ChequesInBankValidation[key] += msg + ' ';
//             isValid = false;
//           }
//         }
//       }
//     } catch (e) {
//       this._commonSvc.showErrorMessage(e);
//       return false;
//     }
//     return isValid;
//   }

//   BlurEventAllControll(formgroup: FormGroup): void {
//     try {
//       Object.keys(formgroup.controls).forEach(key => this.setBlurEvent(formgroup, key));
//     } catch (e) {
//       this._commonSvc.showErrorMessage(e);
//     }
//   }

//   private setBlurEvent(formgroup: FormGroup, key: string): void {
//     try {
//       const control = formgroup.get(key);
//       if (!control) return;
//       if (control instanceof FormGroup) {
//         this.BlurEventAllControll(control);
//       } else if (control.validator) {
//         formgroup.get(key)!.valueChanges.subscribe(() =>
//           this.GetValidationByControl(formgroup, key, true));
//       }
//     } catch (e) {
//       this._commonSvc.showErrorMessage(e);
//     }
//   }

//   formatDate(date: Date | string | null): string {
//     if (!date) return '';
//     return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
//   }

//   private resolveUPIName(): string {
//     const match = this.PaytmList.find(
//       x => x.paccountid == this.ChequesInBankForm.controls['paytmname'].value);
//     return match ? `for ${match.pdepositbankname}` : 'for Paytm';
//   }

//   titleCase(str: string): string {
//     return str.toLowerCase().split(' ')
//       .map(w => w.charAt(0).toUpperCase() + w.substring(1))
//       .join(' ');
//   }

//   showErrorMessage(msg: string): void {
//     this._commonSvc.showErrorMessage(msg);
//   }
// } 





// import { Component, OnInit, ViewChild, Input } from '@angular/core';
// import { CommonService } from 'src/app/services/common.service';
// import { DatePipe } from '@angular/common';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AccountingTransactionsService } from 'src/app/services/Transactions/AccountingTransaction/accounting-transaction.service';
// import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
// import { DataBindingDirective } from '@progress/kendo-angular-grid';
// //import { ThrowStmt } from '@angular/compiler';
// import { PageCriteria } from 'src/app/Models/pageCriteria';
// import { forkJoin } from 'rxjs';
// //import { Page } from 'src/app/UI/Common/Paging/page';
// import { timeStamp } from 'console';
// import { NoticeService } from 'src/app/services/PSInfo/notice.service';
// //import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
// import * as jsPDF from 'jspdf';
// //import { NumberToWordsPipe } from 'src/app/Pipes/number-to-words.pipe';
// import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
// import { NumberToWordsPipe } from '../../ACCOUNTS REPORTS/re-print/number-to-words.pipe';
// //import { ENGINE_METHOD_CIPHERS } from 'constants';
// declare var $: any;

// @Component({
//   selector: 'app-onlinecollection',
//   templateUrl: './onlinecollection.component.html',
//   styleUrls: ['./onlinecollection.component.css'],
//   providers: [
//   NumberToWordsPipe
// ],
// })
// export class onlinecollectionComponent implements OnInit {
//   @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective | undefined;
//   @Input() fromFormName: any;
//   totalElements: number | undefined;
//   //page = new Page();
//   startindex: any;
//   public today: number = Date.now();
//   public todayDate: any;
//   endindex: any;
//   tabsShowOrHideBasedOnfromFormName: boolean | undefined;
//   BanksList = [];
//   previewdetails:any=[];
//   chequerwturnvoucherdetails:any=[];
//   ChequesInBankData = [];
//   _countData:any=[];
//   gridData = [];
//   gridDatatemp = [];
//   gridExcel: any = [];
//   ChequesClearReturnData = [];
//   DataForSaving = [];
//   all: any;
//   chequesdeposited: any;
//   amounttotal:any;
//   Totlaamount:any;
//   onlinereceipts: any;
//   bankbalancetype: any;
//   cleared: any;
//   returned: any;
//   currencySymbol: any;
//   PopupData: any;
//   bankdetails: any;
//   bankid: any;
//   datetitle: any;
//   validate: any;
//   bankname: any;
//   paytmname:any;
//   brsdate: any;
//   bankbalancedetails: any;
//   bankbalance: any;
//   paytmbalance:any
//   userBranchType:any;
//   ChequesClearReturnDataBasedOnBrs: any;
//   showhidegridcolumns = false;
//   saveshowhide: any;
//   chequenumber: any;
//   status = "all";
//   pdfstatus = "All";
//   buttonname = "Save";
//   disablesavebutton = false;
//   hiddendate = true;
//   banknameshowhide = false;
//   brsdateshowhidecleared = false;
//   brsdateshowhidereturned = false;
//   validatebrsdateclear = false;
//   validatebrsdatereturn = false;
//   showicons=false
//   ChequesInBankForm: FormGroup | undefined;
//   BrsDateForm: FormGroup | undefined;
//   ChequesInBankValidation: any = {};
//   schemaname: any;
//   pageCriteria: PageCriteria;
//   public pageSize = 10;
//   //public selectableSettings: SelectableSettings;
//   public checkbox = false;
//   disabletransactiondate = false;
//   displayGridBasedOnFormName: boolean | undefined;
//   displayGridDataBasedOnForm: any;
//   displayGridDataBasedOnFormTemp: any;
//   chequereturncharges:any;
//   //public groups: GroupDescriptor[] = [{ field: 'preceiptdate', dir: 'desc' }];
//   public ptransactiondateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
//   public pchequecleardateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

//   public brsfromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
//   public brstoConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
//   gridLoading = false;
//   modeofreceipt: string="ONLINE";
//   _searchText: string = "";
//   fromdate: any="";
//   todate: any="";
//   PaytmList: any=[];
//   paytmdetails: any;
//   paytmshowhide: boolean | undefined;
//   dummy: any[] | undefined;
//   ColumnMode = ColumnMode;
//   SelectionType = SelectionType;
//   selected = [];
//   saveGridData: any = [];
//   checkedAmountTotal = 0;
//   checkedRowsCount = 0;
//   checkuncheckbool:boolean=true;
//   constructor(private _accountingtransaction: AccountingTransactionsService, private fb: FormBuilder, private datepipe: DatePipe, private _commonService: CommonService,private _noticeservice:NoticeService,
//     private numbertowords:NumberToWordsPipe) {
//     //this.setSelectableSettings();
//     this.ptransactiondateConfig.showWeekNumbers = this._commonService.datePickerPropertiesSetup('showWeekNumbers');
//     this.ptransactiondateConfig.maxDate = new Date();
//     this.ptransactiondateConfig.dateInputFormat = this._commonService.datePickerPropertiesSetup('dateInputFormat');
//     this.ptransactiondateConfig.containerClass = this._commonService.datePickerPropertiesSetup('containerClass');

//     this.pchequecleardateConfig.showWeekNumbers = this._commonService.datePickerPropertiesSetup('showWeekNumbers');
//     this.pchequecleardateConfig.maxDate = new Date();
//     this.pchequecleardateConfig.dateInputFormat = this._commonService.datePickerPropertiesSetup('dateInputFormat');
//     this.pchequecleardateConfig.containerClass = this._commonService.datePickerPropertiesSetup('containerClass');


//     this.brsfromConfig.dateInputFormat = this._commonService.datePickerPropertiesSetup('dateInputFormat');
//     this.brsfromConfig.maxDate = new Date();
//     this.brstoConfig.dateInputFormat = this._commonService.datePickerPropertiesSetup('dateInputFormat');
//     this.brstoConfig.maxDate = new Date();
//     //this.allData = this.allData.bind(this);

//     this.brsfromConfig.showWeekNumbers = this._commonService.datePickerPropertiesSetup('showWeekNumbers');
//     this.brsfromConfig.containerClass = this._commonService.datePickerPropertiesSetup('containerClass');
//     this.brstoConfig.showWeekNumbers = this._commonService.datePickerPropertiesSetup('showWeekNumbers');
//     this.brstoConfig.containerClass = this._commonService.datePickerPropertiesSetup('containerClass');

//     this.pageCriteria = new PageCriteria();
//     if (this._commonService.comapnydetails != null)
//       this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;
//   }
//   ngOnInit(): void {
//     this.pageSetUp();
//     this.userBranchType = sessionStorage.getItem("userBranchType");
//     if (this.fromFormName == "fromChequesStatusInformationForm") {
//       debugger;
//       console.log("cheques in bank true-->", this.fromFormName)
//       this.tabsShowOrHideBasedOnfromFormName = false;
//       this.displayGridBasedOnFormName = false;
//       // $("#chequesdepositedcss").addClass("active");
//       $("#chequescss").addClass("active");
//       $("#allcss").removeClass("active");

//     } else {
//       console.log("cheques in bank false-->", this.fromFormName)
//       this.tabsShowOrHideBasedOnfromFormName = true;
//       this.displayGridBasedOnFormName = true;
//       $("#allcss").addClass("active");
//       //$("#chequesdepositedcss").removeClass("active");
//       $("#chequescss").removeClass("active");
//     }

//     this.currencySymbol = this._commonService.currencysymbol;
//     this.ChequesInBankForm = this.fb.group({
//       ptransactiondate: [new Date()],
//       pchequecleardate: [new Date(), Validators.required],
//       pchequereceiptdate: [new Date()],
//       bankname: ['',Validators.required],
//       paytmname: ['',Validators.required],
//       pfrombrsdate: [''],
//       ptobrsdate: [''],
//       pchequesOnHandlist: [],
//       plstOnlineSettelementDTO:[],
//       SearchClear: [''],
//       schemaname: [this._commonService.getschemaname()],
//       pCreatedby:[this._commonService.getcreatedby()],
//       pipaddress:[this._commonService.getipaddress()],
//       chequeintype:['A'],
//       searchtext:['']

//     })
//     this.BrsDateForm = this.fb.group({
//       frombrsdate: [''],
//       tobrsdate: ['']
//     })
//     this.bankid = 0;
//     this.banknameshowhide = false;
//     this.paytmshowhide = false;
//     this.ChequesInBankValidation = {};
//     this._accountingtransaction.GetBanksList(this._commonService.getschemaname()).subscribe(bankslist => {
//       let tempbanklist=[];
//       this.BanksList=[];
//         tempbanklist=bankslist
//         tempbanklist.forEach(element => {
//           if(element.pisprimary){
//             this.BanksList.push(element)
//           }
//         });
//     })
//     this.setPageModel();
//     this.GetBankBalance(this.bankid)
//     this._accountingtransaction.GetPayTmBanksList(this._commonService.getschemaname()).subscribe(paytmlist => {
//       debugger;
//       this.PaytmList = paytmlist;
//     })
   
//     this.getChequeReturnCharges();
//     this.BlurEventAllControll(this.ChequesInBankForm);
//   }
//   setPageModel() {
//     this.pageCriteria.pageSize = this._commonService.pageSize;
//     this.pageCriteria.offset = 0;
//     this.pageCriteria.pageNumber = 1;
//     this.pageCriteria.footerPageHeight = 50;
//   }
//   onFooterPageChange(event): void {
//     this.pageCriteria.offset = event.page - 1;
//     this.pageCriteria.CurrentPage = event.page;
//     if (this.pageCriteria.totalrows < event.page * this.pageCriteria.pageSize) {
//       this.pageCriteria.currentPageRows = this.pageCriteria.totalrows % this.pageCriteria.pageSize;
//     }
//     else {
//       this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
//     }
//   }
//   change_date(event) {
//     debugger;
//     this.selected = [];
//     for (let i = 0; i < this.gridData.length; i++) {
//       this.gridData[i].pdepositstatus = false;
//       this.gridData[i].pcancelstatus = false;
//       this.gridData[i].pchequestatus = "N";
//     }
//   }
//   Receipt_change_date(event){
//     this.selected = [];
//     let chequeintypevalue=this.ChequesInBankForm.controls.chequeintype.value;
//     this.GetChequesInBank(this.bankid,this.startindex,this.endindex,this._searchText,chequeintypevalue);
//   } 
//   pageSetUp() {
//     debugger;
//     this.page.offset = 0;
//     this.page.pageNumber = 1;
//     this.page.size = this._commonService.pageSize;
//     this.startindex = 0;
//     this.endindex = 1000;
//     this.page.totalElements = 10;
//     this.page.totalPages = 1;
//   }
//   setPage(pageInfo, event) {
//     debugger;
//     this.page.offset = event.page - 1;
//     this.page.pageNumber = pageInfo.page;
//     this.endindex = this.page.pageNumber * this.page.size
//     this.startindex = (this.endindex) - this.page.size
//     let chequeintypevalue=this.ChequesInBankForm.controls.chequeintype.value;
//       this.GetChequesInBank(this.bankid, this.startindex, this.endindex, "",chequeintypevalue);
//   }
//   GetBankBalance(bankid) {
//     this._accountingtransaction.GetBankBalance(bankid).subscribe(bankdetails => {

//       this.bankbalancedetails = bankdetails;
//       if (this.bankid == 0) {
//         if (this.bankbalancedetails._BankBalance < 0) {
//           this.bankbalance = Math.abs(this.bankbalancedetails._BankBalance)
//           this.bankbalancetype = "Cr";
//         }
//         else if (this.bankbalancedetails._BankBalance == 0) {
//           this.bankbalance = 0;
//           this.bankbalancetype = "";
//         }
//         else {
//           this.bankbalance = (this.bankbalancedetails._BankBalance)
//           this.bankbalancetype = "Dr";
//         }
//       }
//       this.brsdate = this._commonService.getFormatDateGlobal((this.bankbalancedetails.ptobrsdate))
//       this.ChequesInBankForm.controls.pfrombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
//       this.ChequesInBankForm.controls.ptobrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
//       this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
//       this.BrsDateForm.controls.tobrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
//     })
//   }
//   GetChequesInBank_load(bankid) {
//     this.gridLoading = true;
//     let GetChequesInBankData=this._accountingtransaction.GetChequesInBankData(bankid,this.startindex, this.endindex,this.modeofreceipt,this._searchText,"");
//     let getchequescount=this._accountingtransaction.GetChequesRowCount(bankid,this._searchText,"","","CHEQUESINBANK",'');
//     forkJoin(GetChequesInBankData,getchequescount).
//     subscribe(data => {
//       console.log(data)
//       this.gridLoading = false;

//       if (this.fromFormName == "fromChequesStatusInformationForm") {

//         $("#chequesissuedcss").addClass("active");
//         $("#allcss").removeClass("active");
//         $("#onlinereceiptscss").removeClass("active");
//         $("#clearedcss").removeClass("active");
//         $("#returnedcss").removeClass("active");
//       } else {
//         $("#allcss").addClass("active");
//         $("#chequesissuedcss").removeClass("active");
//         $("#onlinereceiptscss").removeClass("active");
//         $("#clearedcss").removeClass("active");
//         $("#returnedcss").removeClass("active");
//       }
//       debugger;
//       let data1 = data[0].pchequesOnHandlist;
//       this.ChequesInBankData = data1;
//       this.ChequesClearReturnData = data[0].pchequesclearreturnlist;
//       this._countData=data[1];
//       this.CountOfRecords();
//       if (this.fromFormName == "fromChequesStatusInformationForm") {
//         this.chequesStatusInfoGrid();
//       }
//       debugger;
//       this.totalElements = +data[1]["total_count"];
//       this.page.totalElements = +data[1]["total_count"];
//       if (this.page.totalElements > 10)
//         this.page.totalPages = parseInt((this.page.totalElements / 10).toString()) + 1;

//     }, error => { this._commonService.showErrorMessage(error) })
//   }


//   GetPAYTMBank_load(bankid,chequeintype) {
//     debugger;
//     this.gridLoading = true;
//     let receiptDate = this._commonService.getFormatDate1(this.ChequesInBankForm.controls.pchequereceiptdate.value);
//     let GetChequesInBankData=this._accountingtransaction.GetPaytmInBankData(bankid,this.startindex, this.endindex,this.modeofreceipt,this._searchText,"",receiptDate,chequeintype);
//     let getchequescount=this._accountingtransaction.GetUPIClearedDataForTotalCount(bankid,this.startindex, this.endindex,this.modeofreceipt,this._searchText,"",receiptDate,chequeintype);
//     forkJoin(GetChequesInBankData,getchequescount).
//     subscribe(data => {
//       debugger;
//       console.log(data)
//       this.gridLoading = false;
//       if (this.fromFormName == "fromChequesStatusInformationForm") {
//         $("#chequesissuedcss").addClass("active");
//         $("#allcss").removeClass("active");
//         $("#onlinereceiptscss").removeClass("active");
//         $("#clearedcss").removeClass("active");
//         $("#returnedcss").removeClass("active");
//       } else {
//         $("#allcss").addClass("active");
//         $("#chequesissuedcss").removeClass("active");
//         $("#onlinereceiptscss").removeClass("active");
//         $("#clearedcss").removeClass("active");
//         $("#returnedcss").removeClass("active");
//       }
//       debugger;
//       let data1 = data[0].pchequesOnHandlist;
//       this.ChequesInBankData = data1;
//       this.ChequesInBankData.forEach(element=>{
//         element['checkuncheck']=true
//         if ((this._searchText!="" && chequeintype == 'D') || (chequeintype=="A")){
//           element.checkuncheck=false
//         }
//       });
//       if ((this._searchText!="" && chequeintype == 'D') || (chequeintype=="A")){
//         this.checkuncheckbool=this.ChequesInBankData.every(item=>item.checkuncheck=false);
//       }else{
//         this.checkuncheckbool=true;
//       }
//       this.ChequesClearReturnData = data[0].pchequesclearreturnlist;
//       this._countData=data[1];
//       this.CountOfRecords();
//       if (this.status == "all") {
//         this.All();
//       }
//       if (this.fromFormName == "fromChequesStatusInformationForm") {
//         this.chequesStatusInfoGrid();
//       }
//       debugger;
//       this.totalElements = data[1]['pchequesOnHandlist'][0]['total_count'];
//       this.page.totalElements = data[1]['pchequesOnHandlist'][0]['total_count'];
//       if (this.page.totalElements > 10)
//         this.page.totalPages = parseInt((this.page.totalElements / 10).toString()) + 1;

//     }, error => { this._commonService.showErrorMessage(error) })
//   }
//   GetChequesInBank(bankid,startindex, endindex,searchText,chequeintype) {
//     debugger;
//     this.gridLoading = true;
//     let receiptDate = this._commonService.getFormatDate1(this.ChequesInBankForm.controls.pchequereceiptdate.value);
//     this._accountingtransaction.GetPaytmInBankData(bankid,startindex, endindex,this.modeofreceipt,this._searchText,"",receiptDate,chequeintype).
//     subscribe(data => {
//       console.log(data)
//       this.gridLoading = false;
//       let data1 = data.pchequesOnHandlist;
//       this.ChequesInBankData = data1;
//       this.ChequesInBankData.forEach(element=>{element['checkuncheck']=true});
//       this.ChequesClearReturnData = data.pchequesclearreturnlist;
//       if (this.status == "all") {
//         this.All1();
//       }
//       if (this.status == "chequesdeposited") {
//         this.ChequesDeposited1();
//       }
//       if (this.status == "onlinereceipts") {
//         this.OnlineReceipts1();
//       }
//       if (this.status == "cleared") {
//         this.Cleared1();
//       }
//       if (this.status == "returned") {
//         this.Returned1();
//       }

//       if (this.fromFormName == "fromChequesStatusInformationForm") {
//         this.chequesStatusInfoGrid();
//       }


//     }, error => { this._commonService.showErrorMessage(error) })
//   }
  
//   onSearch(event) {
//     debugger;

//     let searchText = event.toString();
//     this._searchText = searchText;

//     if (this.fromFormName == "fromChequesStatusInformationForm") {
//       if (searchText != "") {
//         let columnName;
//         let lastChar = searchText.substr(searchText.length - 1);
//         let asciivalue = lastChar.charCodeAt()
//         if (asciivalue > 47 && asciivalue < 58) {
//           columnName = "pChequenumber";
//         } else {
//           columnName = "";
//         }
        
//         this.displayGridDataBasedOnForm = this._commonService.transform(this.displayGridDataBasedOnFormTemp, searchText, columnName);
//       }
//       else {
//         this.displayGridDataBasedOnForm = this.displayGridDataBasedOnFormTemp;
//       }
//       this.pageCriteria.totalrows = this.displayGridDataBasedOnForm.length;
//       this.pageCriteria.TotalPages = 1;
//       if (this.pageCriteria.totalrows > 10)
//         this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / 10).toString()) + 1;
//       if (this.displayGridDataBasedOnForm.length < this.pageCriteria.pageSize) {
//         this.pageCriteria.currentPageRows = this.displayGridDataBasedOnForm.length;
//       }
//       else {
//         this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
//       }
//     }
//     else {
//       let SearchLength: any = this._commonService.searchfilterlength;
//       if (searchText != "" && parseInt(searchText.length) > parseInt(SearchLength)) {
//         let columnName;
//         let lastChar = searchText.substr(searchText.length - 1);
//         let asciivalue = lastChar.charCodeAt()
//         if (asciivalue > 47 && asciivalue < 58) {
//           columnName = "pChequenumber";
//         } else {
//           columnName = "";
//         }
//         this.pageSetUp();
//         let chequeintypevalue=this.ChequesInBankForm.controls.chequeintype.value;
//         this.GetPAYTMBank_load(this.bankid,chequeintypevalue);
//         this.gridData = this._commonService.transform(this.gridDatatemp, searchText, columnName);
//         this.gridData.forEach(element=>{
//           if (searchText!="" && chequeintypevalue == 'D'){
//             element.checkuncheck=false
//           }
//         })
//         this.gridData=[...this.gridData]
//       }
//       else {
//         if (searchText == "") {
//           this.ChequesInBankForm.controls.chequeintype.setValue('A');
//           this.pageSetUp();
//           let chequeintypevalue=this.ChequesInBankForm.controls.chequeintype.value;
//           this.GetPAYTMBank_load(this.bankid,chequeintypevalue);
//         }
//         this.gridData = this.gridDatatemp;
//       }
//       this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
//     }
//   }
//   All() {
//     debugger
//     this.gridData = [];
//     this.gridDatatemp = [];
//     this.fromdate="";this.todate="";
//     if (this.fromFormName == "fromChequesStatusInformationForm") {

//       this.GridColumnsHide();
//     } else {
//       this.GridColumnsShow();
//     }
//     this.status = "all";
//     this.pdfstatus = "All";
//     this.modeofreceipt="ONLINE";
//     this.pageSetUp();
//     let grid = [];
//     if (this.bankid == 0) {
//       grid = this.ChequesInBankData;
//     }
//     else {
//       for (let i = 0; i < this.ChequesInBankData.length; i++) {
//         if (this.ChequesInBankData[i].pdepositbankid == this.bankid) {
//           grid.push(this.ChequesInBankData[i]);
//         }
//       }
//     }
//     this.gridData = JSON.parse(JSON.stringify(grid));
//     if (this.gridData.length > 0) {
//       this.pageCriteria.totalrows = this.gridData.length;
//       this.pageCriteria.TotalPages = 1;
//       if (this.pageCriteria.totalrows > 10)
//         this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / 10).toString()) + 1;
//       if (this.gridData.length < this.pageCriteria.pageSize) {
//         this.pageCriteria.currentPageRows = this.gridData.length;
//       }
//       else {
//         this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
//       }
//     }
//     this.gridDatatemp = this.gridData;
//     if(this.gridData.length>0)
//     {
//       this.showicons=true
//     }
//     else{
//       this.showicons=false
//     }
//     this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
//     this.totalElements = this._countData['pchequesOnHandlist'][0]['total_count'];
//     this.page.totalElements = this._countData['pchequesOnHandlist'][0]['total_count'];
//     if (this.page.totalElements > 10)
//       this.page.totalPages = parseInt((this.page.totalElements / 10).toString()) + 1;
//   }
//   All1() {
//     debugger
//     this.gridData = [];
//     this.gridDatatemp = [];
//     if (this.fromFormName == "fromChequesStatusInformationForm") {
//       this.GridColumnsHide();
//     } else {
//       this.GridColumnsShow();
//     }
//     this.status = "all";
//     this.pdfstatus = "All";
//     this.modeofreceipt="ONLINE";
//     let grid = [];
//     if (this.bankid == 0) {
//       grid = this.ChequesInBankData;
//     }
//     else {
//       for (let i = 0; i < this.ChequesInBankData.length; i++) {
//         if (this.ChequesInBankData[i].pdepositbankid == this.bankid) {
//           grid.push(this.ChequesInBankData[i]);
//         }
//       }
//     }
//      if ((this.ChequesInBankForm.controls.chequeintype.value == 'D') || (this.ChequesInBankForm.controls.chequeintype.value=="A")){
//        this.ChequesInBankData.forEach(element=>{element['checkuncheck']=false});
//       }else{
//         this.ChequesInBankData.forEach(element=>{element['checkuncheck']=true});
//       }
//     this.gridData = JSON.parse(JSON.stringify(grid));
//     this.gridDatatemp = this.gridData;
//     if (this.gridData.length > 0) {
//       this.pageCriteria.totalrows = this.gridData.length;
//       this.pageCriteria.TotalPages = 1;
//       if (this.pageCriteria.totalrows > 10)
//         this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / 10).toString()) + 1;
//       if (this.gridData.length < this.pageCriteria.pageSize) {
//         this.pageCriteria.currentPageRows = this.gridData.length;
//       }
//       else {
//         this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
//       }
//     }
//     if(this.gridData.length>0)
//     {
//       this.showicons=true
//     }
//     else{
//       this.showicons=false
//     }
//     this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
//     this.ChequesInBankForm.controls.pfrombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
//     this.ChequesInBankForm.controls.ptobrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
//     this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
//     this.BrsDateForm.controls.tobrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
//   }
//   ChequesDeposited() {
//     debugger;
//     this.fromdate="";this.todate="";
//     this.modeofreceipt="CHEQUE";
//     this.pageSetUp();
//     let chequeintypevalue=this.ChequesInBankForm.controls.chequeintype.value;
//     this.GetChequesInBank(this.bankid,this.startindex,this.endindex,this._searchText,chequeintypevalue);
//     this.gridData = [];
//     this.gridDatatemp = [];
//     if (this.fromFormName == "fromChequesStatusInformationForm") {

//       this.GridColumnsHide();
//     } else {
//       this.GridColumnsShow();
//     }
//     this.status = "chequesdeposited";
//     this.pdfstatus = "Cheques Deposited";

//     let grid = [];
//     if (this.bankid == 0) {
//       for (let i = 0; i < this.ChequesInBankData.length; i++) {
//         if (this.ChequesInBankData[i].ptypeofpayment == "CHEQUE") {
//           grid.push(this.ChequesInBankData[i]);
//         }
//       }
//     }
//     else {
//       for (let i = 0; i < this.ChequesInBankData.length; i++) {
//         if (this.ChequesInBankData[i].ptypeofpayment == "CHEQUE" && this.ChequesInBankData[i].pdepositbankid == this.bankid) {
//           grid.push(this.ChequesInBankData[i]);
//         }
//       }
//     }
//     this.gridData = JSON.parse(JSON.stringify(grid))
//     this.gridDatatemp = this.gridData
//     if(this.gridData.length>0)
//     {
//       this.showicons=true
//     }
//     else{
//       this.showicons=false
//     }
//     this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
//     this.totalElements = this._countData["cheques_count"];
//     this.page.totalElements = this._countData["cheques_count"];
//     if (this.page.totalElements > 10)
//       this.page.totalPages = parseInt((this.page.totalElements / 10).toString()) + 1;

//   }
//   ChequesDeposited1() {
//     debugger;
//     this.modeofreceipt="CHEQUE"
//     this.gridData = [];
//     this.gridDatatemp = [];
//     if (this.fromFormName == "fromChequesStatusInformationForm") {

//       this.GridColumnsHide();
//     } else {
//       this.GridColumnsShow();
//     }
//     this.status = "chequesdeposited";
//     this.pdfstatus = "Cheques Deposited";

//     let grid = [];
//     if (this.bankid == 0) {
//       for (let i = 0; i < this.ChequesInBankData.length; i++) {
//         if (this.ChequesInBankData[i].ptypeofpayment == "CHEQUE") {
//           grid.push(this.ChequesInBankData[i]);
//         }
//       }
//     }
//     else {
//       for (let i = 0; i < this.ChequesInBankData.length; i++) {
//         if (this.ChequesInBankData[i].ptypeofpayment == "CHEQUE" && this.ChequesInBankData[i].pdepositbankid == this.bankid) {
//           grid.push(this.ChequesInBankData[i]);
//         }
//       }
//     }
//     this.gridData = JSON.parse(JSON.stringify(grid))
//     this.gridDatatemp = this.gridData
//     if(this.gridData.length>0)
//     {
//       this.showicons=true
//     }
//     else{
//       this.showicons=false
//     }
//     this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
    

//   }
//   OnlineReceipts() {
//     this.fromdate="";this.todate="";
//     this.pageSetUp();
//     this.gridData = [];
//     this.gridDatatemp = [];
//     if (this.fromFormName == "fromChequesStatusInformationForm") {

//       this.GridColumnsHide();
//     } else {
//       this.GridColumnsShow();
//     }
//     this.status = "onlinereceipts";
//     this.pdfstatus = "Online Receipts";
//     this.modeofreceipt="ONLINE";
//     let chequeintypevalue=this.ChequesInBankForm.controls.chequeintype.value;
//     this.GetChequesInBank(this.bankid,this.startindex,this.endindex,this._searchText,chequeintypevalue);

//     let grid = [];
//     console.log(this.ChequesInBankData);
//     if (this.bankid == 0) {
//       for (let j = 0; j < this.ChequesInBankData.length; j++) {
//         if (this.ChequesInBankData[j].ptypeofpayment != "CHEQUE") {
//           grid.push(this.ChequesInBankData[j]);
//         }
//       }
//     }
//     else {
//       for (let j = 0; j < this.ChequesInBankData.length; j++) {
//         if (this.ChequesInBankData[j].ptypeofpayment != "CHEQUE" && this.ChequesInBankData[j].pdepositbankid == this.bankid) {
//           grid.push(this.ChequesInBankData[j]);
//         }
//       }
//     }
//     this.gridData = JSON.parse(JSON.stringify(grid))
//     this.gridDatatemp = this.gridData;
//     if(this.gridData.length>0)
//     {
//       this.showicons=true
//     }
//     else{
//       this.showicons=false
//     }
//     this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
//     this.totalElements = this._countData["others_count"];
//     this.page.totalElements = this._countData["others_count"];
//     if (this.page.totalElements > 10)
//       this.page.totalPages = parseInt((this.page.totalElements / 10).toString()) + 1;
//   }
//   OnlineReceipts1() {
//     this.gridData = [];
//     this.gridDatatemp = [];
//     if (this.fromFormName == "fromChequesStatusInformationForm") {
//       this.GridColumnsHide();
//     } else {
//       this.GridColumnsShow();
//     }
//     this.status = "onlinereceipts";
//     this.pdfstatus = "Online Receipts";
//     this.modeofreceipt="ONLINE";

//     let grid = [];
//     console.log(this.ChequesInBankData);
//     if (this.bankid == 0) {
//       for (let j = 0; j < this.ChequesInBankData.length; j++) {
//         if (this.ChequesInBankData[j].ptypeofpayment != "CHEQUE") {
//           grid.push(this.ChequesInBankData[j]);
//         }
//       }
//     }
//     else {
//       for (let j = 0; j < this.ChequesInBankData.length; j++) {
//         if (this.ChequesInBankData[j].ptypeofpayment != "CHEQUE" && this.ChequesInBankData[j].pdepositbankid == this.bankid) {
//           grid.push(this.ChequesInBankData[j]);
//         }
//       }
//     }
//     this.gridData = JSON.parse(JSON.stringify(grid))
//     this.gridDatatemp = this.gridData;
//     if(this.gridData.length>0)
//     {
//       this.showicons=true
//     }
//     else{
//       this.showicons=false
//     }
//     this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
   

//   }

//   Cleared() {
//     debugger;
//     this.fromdate="";this.todate="";
//     this.datetitle = "Cleared Date"
//     this.gridData = [];
//     this.gridDatatemp = [];
//     this.GridColumnsHide();
//     this.brsdateshowhidecleared = true;
//     this.brsdateshowhidereturned = false;
//     this.status = "cleared";
//     this.pdfstatus = "Cleared";
//     this.modeofreceipt="CLEAR";
//     this.pageSetUp();
//     let chequeintypevalue=this.ChequesInBankForm.controls.chequeintype.value;
//     this.GetChequesInBank(this.bankid,this.startindex,this.endindex,this._searchText,chequeintypevalue);
//     this.ChequesInBankForm.controls.pfrombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
//     this.ChequesInBankForm.controls.ptobrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
//     let grid = [];
//     if (this.bankid == 0) {
//       for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
//         if (this.ChequesClearReturnData[i].pchequestatus == "Y") {
//           grid.push(this.ChequesClearReturnData[i]);
//         }
//       }
//     }
//     else {
//       for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
//         if (this.ChequesClearReturnData[i].pchequestatus == "Y" && this.ChequesClearReturnData[i].pdepositbankid == this.bankid) {
//           grid.push(this.ChequesClearReturnData[i]);
//         }
//       }
//     }
//     this.gridData = JSON.parse(JSON.stringify(grid))
//     this.gridDatatemp = this.gridData
//     if(this.gridData.length>0)
//     {
//       this.showicons=true
//     }
//     else{
//       this.showicons=false
//     }
//     this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
//     this.totalElements = this._countData["clear_count"];
//     this.page.totalElements = this._countData["clear_count"];
//     if (this.page.totalElements > 10)
//       this.page.totalPages = parseInt((this.page.totalElements / 10).toString()) + 1;
//   }
//   Cleared1() {
//     debugger;
//     this.datetitle = "Cleared Date"
//     this.gridData = [];
//     this.gridDatatemp = [];
//     this.GridColumnsHide();
//     this.brsdateshowhidecleared = true;
//     this.brsdateshowhidereturned = false;
//     this.status = "cleared";
//     this.pdfstatus = "Cleared";
//     this.modeofreceipt="CLEAR";
//     this.ChequesInBankForm.controls.pfrombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
//     this.ChequesInBankForm.controls.ptobrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
//     let grid = [];
//     if (this.bankid == 0) {
//       for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
//         if (this.ChequesClearReturnData[i].pchequestatus == "Y") {
//           grid.push(this.ChequesClearReturnData[i]);
//         }
//       }
//     }
//     else {
//       for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
//         if (this.ChequesClearReturnData[i].pchequestatus == "Y" && this.ChequesClearReturnData[i].pdepositbankid == this.bankid) {
//           grid.push(this.ChequesClearReturnData[i]);
//         }
//       }
//     }
//     this.gridData = JSON.parse(JSON.stringify(grid))
//     this.gridDatatemp = this.gridData
//     if(this.gridData.length>0)
//     {
//       this.showicons=true
//     }
//     else{
//       this.showicons=false
//     }
//     this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0))
//   }
//   Returned() {
//     debugger;
//     this.fromdate="";this.todate="";
//     this.datetitle = "Returned Date";
//     this.gridData = [];
//     this.gridDatatemp = [];
//     this.GridColumnsHide();
//     this.brsdateshowhidecleared = false;
//     this.brsdateshowhidereturned = true;
//     this.status = "returned";
//     this.pdfstatus = "Returned";
//     this.modeofreceipt="RETURN";
//     this.pageSetUp();
//     let chequeintypevalue=this.ChequesInBankForm.controls.chequeintype.value;
//     this.GetChequesInBank(this.bankid,this.startindex,this.endindex,this._searchText,chequeintypevalue);
//     this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
//     this.BrsDateForm.controls.tobrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
//     let grid = [];
//     if (this.bankid == 0) {
//       for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
//         if (this.ChequesClearReturnData[i].pchequestatus == "R") {
//           grid.push(this.ChequesClearReturnData[i]);
//         }
//       }
//     }
//     else {
//       for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
//         if (this.ChequesClearReturnData[i].pchequestatus == "R" && this.ChequesClearReturnData[i].pdepositbankid == this.bankid) {
//           grid.push(this.ChequesClearReturnData[i]);
//         }
//       }
//     }
//     this.gridData = JSON.parse(JSON.stringify(grid))
//     this.gridDatatemp = this.gridData
//     if(this.gridData.length>0)
//     {
//       this.showicons=true
//     }
//     else{
//       this.showicons=false
//     }
//     this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
//     this.totalElements = this._countData["return_count"];
//     this.page.totalElements = this._countData["return_count"];
//     if (this.page.totalElements > 10)
//       this.page.totalPages = parseInt((this.page.totalElements / 10).toString()) + 1;
//   }
//   Returned1() {
//     debugger;
//     this.datetitle = "Returned Date";
//     this.gridData = [];
//     this.gridDatatemp = [];
//     this.GridColumnsHide();
//     this.brsdateshowhidecleared = false;
//     this.brsdateshowhidereturned = true;
//     this.status = "returned";
//     this.pdfstatus = "Returned";
//     this.modeofreceipt="RETURN";
//     this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
//     this.BrsDateForm.controls.tobrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
//     let grid = [];
//     if (this.bankid == 0) {
//       for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
//         if (this.ChequesClearReturnData[i].pchequestatus == "R") {
//           grid.push(this.ChequesClearReturnData[i]);
//         }
//       }
//     }
//     else {
//       for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
//         if (this.ChequesClearReturnData[i].pchequestatus == "R" && this.ChequesClearReturnData[i].pdepositbankid == this.bankid) {
//           grid.push(this.ChequesClearReturnData[i]);
//         }
//       }
//     }
//     this.gridData = JSON.parse(JSON.stringify(grid))
//     this.gridDatatemp = this.gridData
//     if(this.gridData.length>0)
//     {
//       this.showicons=true
//     }
//     else{
//       this.showicons=false
//     }
//     this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
//   }
//   GridColumnsShow() {
//     this.showhidegridcolumns = false;
//     this.saveshowhide = true;
//     this.brsdateshowhidecleared = false;
//     this.brsdateshowhidereturned = false;
//     this.hiddendate = true;
//   }
//   GridColumnsHide() {
//     this.showhidegridcolumns = true;
//     this.saveshowhide = false;
//     this.hiddendate = false;
//   }
//   CountOfRecords() {
//     this.all = 0;
//     this.chequesdeposited = 0;
//     this.onlinereceipts = 0;
//     this.cleared = 0;
//     this.returned = 0;
//      this.all=this._countData['pchequesOnHandlist'][0]['total_count'];
//     this.onlinereceipts=this._countData["others_count"];
//     this.chequesdeposited=this._countData["cheques_count"];
//     this.cleared=this._countData["clear_count"];
//     this.returned=this._countData["return_count"];
//   }
//   SelectBank(event) {
//       debugger;
//     if (event.target.value == "") {
//       this.bankname = "";
//       this.banknameshowhide = false;
//     }
//     else {
//       this.banknameshowhide = true;
//       for (let i = 0; i < this.BanksList.length; i++) {
//         if (event.target.value == this.BanksList[i].paccountid) {
//           this.bankdetails = this.BanksList[i];
//           break;
//         }
//       }
//       this.bankname = this.bankdetails.pdepositbankname;
//       if (this.bankdetails.pbankbalance < 0) {
//         this.bankbalance = Math.abs(this.bankdetails.pbankbalance)
//         this.bankbalancetype = "Cr";
//       }
//       else if (this.bankdetails.pbankbalance == 0) {
//         this.bankbalance = 0;
//         this.bankbalancetype = "";
//       }
//       else {
//         this.bankbalance = (this.bankdetails.pbankbalance)
//         this.bankbalancetype = "Dr";
//       }
//     }
//   }

//   SelectPaytm(event) {
//      debugger
//     if (event.target.value != "") {
//       this.gridLoading=true;
//       this.paytmshowhide = true;
//       for (let i = 0; i < this.PaytmList.length; i++) {
//         if (event.target.value == this.PaytmList[i].paccountid) {
//           this.paytmdetails = this.PaytmList[i];
//           break;
//         }
//       }
//       this.bankid = this.paytmdetails.paccountid;
//       this.paytmname = this.paytmdetails.pdepositbankname;
//       if (this.paytmdetails.pbankbalance < 0) {
//         this.paytmbalance = Math.abs(this.paytmdetails.pbankbalance)
//         this.bankbalancetype = "Cr";
//       }
//       else if (this.paytmdetails.pbankbalance == 0) {
//         this.paytmbalance = 0;
//         this.bankbalancetype = "";
//       }
//       else {
//         this.paytmbalance = (this.paytmdetails.pbankbalance)
//         this.bankbalancetype = "Dr";
//       }
//     let chequeintypevalue=this.ChequesInBankForm.controls.chequeintype.value;
//     this.GetPAYTMBank_load(this.bankid,chequeintypevalue);
//     this.GetBankBalance(this.bankid);
//     this.ChequesInBankForm.controls.SearchClear.setValue('');
//     }
//   }
//   CheckedClear(event, data) {
//     debugger
//     let isvalid = true;
//     isvalid = this.checkValidations(this.ChequesInBankForm, isvalid);

//     if(isvalid){
//     let gridtemp = this.gridData.filter(a => {
//       if (a.preceiptid == data.preceiptid) {
//         return a;
//       }
//     })
//     if (event.target.checked == true) {
//       let receiptdate = this._commonService.getDateObjectFromDataBase(gridtemp[0].pdepositeddate);
//       let chequecleardate = this.ChequesInBankForm.controls.pchequecleardate.value;
//       if (new Date(chequecleardate).getTime() >= new Date(receiptdate).getTime()) {
//         data.pdepositstatus = true;
//         data.preturnstatus = false;
//         data.pchequestatus = "Y";
//       }
//       else {
//         data.pdepositstatus = false;
//         data.pchequestatus = "N";
//         event.target.checked = false;
//         this._commonService.showWarningMessage("Cheque Clear Date Should be Greater than or Equal to Deposited Date");
//       }
//     }
//     else {
//       data.pdepositstatus = false;
//       data.pchequestatus = "N";
//     }

//     for (let i = 0; i < this.gridData.length; i++) {
//       if (this.gridData[i].preceiptid == data.preceiptid) {
//         this.gridData[i] = data;
//         break;
//       }
//     }
//   }
//   else{
//     this._commonService.showWarningMessage("Select the Debited & Credited Banks");
//     this.gridData.forEach(a => {
//       if (a.preceiptid == data.preceiptid) {
//         a.pdepositstatus=false;
//         event.target.checked = false;
//       }
//     })
//       data.pdepositstatus = false;
//       data.pchequestatus = "N";
//     for (let i = 0; i < this.gridData.length; i++) {
//       if (this.gridData[i].preceiptid == data.preceiptid) {
//         this.gridData[i] = data;
//         break;
//       }
//     }
//   }
// }
//   CheckedReturn(event, data) {
//     debugger;
//     let gridtemp = this.gridData.filter(a => {
//       if (a.preceiptid == data.preceiptid) {
//         return a;
//       }
//     })
//     this.PopupData = data;
//     if (event.target.checked == true) {
//       let receiptdate = this._commonService.getDateObjectFromDataBase(gridtemp[0].pdepositeddate);
//       let chequecleardate = this.ChequesInBankForm.controls.pchequecleardate.value;

//       if (new Date(chequecleardate).getTime() >= new Date(receiptdate).getTime()) {
//         data.preturnstatus = true;
//         data.pdepositstatus = false;
//         data.pchequestatus = "R";
//         $("#cancelcharges").val(this.chequereturncharges);
//         this.chequenumber = data.pChequenumber;
//         $('#add-detail').modal('show');
//       }
//       else {
//         data.preturnstatus = false;
//         data.pchequestatus = "N";
//         event.target.checked = false;
//         this._commonService.showWarningMessage("Cheque Clear Date Should be Greater than or Equal Deposited Date");
//       }
//     }
//     else {
//       data.preturnstatus = false;
//       data.pchequestatus = "N";
//     }
//     for (let i = 0; i < this.gridData.length; i++) {
//       if (this.gridData[i].preceiptid == data.preceiptid) {
//         this.gridData[i] = data;
//         break;
//       }
//     }
//   }
//   validateSave(): boolean {
//     let isvalid = true;
//     isvalid = this.checkValidations(this.ChequesInBankForm, isvalid);

//     let chequecleardate = this.ChequesInBankForm.controls.pchequecleardate.value;
//     let transactiondate = this.ChequesInBankForm.controls.ptransactiondate.value;

//     if (new Date(transactiondate).getTime() < new Date(chequecleardate).getTime()) {
//       this._commonService.showWarningMessage('Transaction Date Should be Greater than or Equal to Cheque Clear Date');
//       isvalid = false;
//     }
//     if (isvalid) {
//       if (!confirm("Do You Want To Save ?")) {
//         isvalid = false;
//       }
//     }
//     return isvalid;
//   }
//   Save() {
//     debugger

//     this.DataForSaving = [];
//     let isValid = true;

//     if (this.validateSave()) {
//       this.disablesavebutton = true;
//       this.buttonname = "Processing";
//       this.saveGridData.forEach(X=>{
//         X.pdepositstatus=true;
//       })    
//       for (let i = 0; i < this.saveGridData.length; i++) {
//         if (this.saveGridData[i].pdepositstatus == true ) {
//           this.saveGridData[i].preferencenumber=this.saveGridData[i].pChequenumber;
//           let object={}
//           object={
//             pbranch_id:this._commonService.getbrachid(),
//             pbranch_name:this.saveGridData[i].pbranchname,
//             pselfchequestatus:this.saveGridData[i].selfchequestatus,
//             preceiptrecordid:this.saveGridData[i].preceiptrecordid,
//             preceiptid:this.saveGridData[i].preceiptid,
//             preceiptdate:this.saveGridData[i].preceiptdate,
//             ptotalreceivedamount:this.saveGridData[i].ptotalreceivedamount,
//             pcontactid:'',
//             pcontact_name:this.saveGridData[i].ppartyname,
//             pmodeofreceipt:this.saveGridData[i].ptypeofpayment,
//             preferencenumber:this.saveGridData[i].pChequenumber,
//             pchequesdate:this.saveGridData[i].pchequedate,
//             pdeposit_status:this.saveGridData[i].pchequestatus,
//             pdeposit_bankid:this.saveGridData[i].pdepositbankid,
//             pdeposited_date:this.saveGridData[i].pdepositeddate,
//             pcheque_bank:this.saveGridData[i].cheque_bank,
//             preceipt_branch_name:'',
//             preceived_from:'',
//             chit_receipt_number:this.saveGridData[i].chitReceiptNo,
//             chitgroup_id:this.saveGridData[i].chitgroupid,
//             ticketno:this.saveGridData[i].ticketno,
//             ptransactiondate: this._commonService.getFormatDate1(this.ChequesInBankForm.controls.ptransactiondate.value)
//           } 
//           this.DataForSaving.push(object);
//         }
//       }
//       if (this.DataForSaving.length != 0) {
//         this.ChequesInBankForm.controls.plstOnlineSettelementDTO.setValue(this.DataForSaving);
//         let chequesinbankdata = this.ChequesInBankForm.value;
//         let debit_amount = 0;
//         this.DataForSaving.forEach(a=>{
//           if(a.pselfchequestatus == true){
//             debit_amount = debit_amount+a.ptotalreceivedamount;
//           }
//         })
//         chequesinbankdata.debit_account_id = this.ChequesInBankForm.controls.bankname.value;
//         chequesinbankdata.credit_account_id = this.ChequesInBankForm.controls.paytmname.value;
//         chequesinbankdata.account_trans_type = "D";
//         chequesinbankdata.debit_amount = debit_amount.toFixed(2);
//         chequesinbankdata.credit_amount = debit_amount.toFixed(2);
//         chequesinbankdata.transaction_date = this._commonService.getFormatDate1(this.ChequesInBankForm.controls.ptransactiondate.value);
//         chequesinbankdata.jv_type = "A";
//         chequesinbankdata.pmodeoftransaction = "C";

//         let form = JSON.stringify(chequesinbankdata);
//         console.log(form)
//          let form1
//         this._accountingtransaction.SaveOnLineCollection_JV(form).subscribe(data => {
//           debugger;
//           if (data) {
//             this._commonService.showSuccessMessage();
//             this.Clear();
//           }
//           this.disablesavebutton = false;
//           this.buttonname = "Save";
//         }, error => {
//           this._commonService.showErrorMessage(error);
//           this.disablesavebutton = false;
//           this.buttonname = "Save";
//         });
//       }
//       else {
//         this.disablesavebutton = false;
//         this.buttonname = "Save";
//         this._commonService.showWarningMessage("Select atleast one record ");
//       }
//     }
//   }
//   Clear() {
//     this.ChequesInBankForm.reset();
//     this.ngOnInit();
//     $("#bankselection").val("");
//     $("#search").val("");
//     this._searchText="";
//     this.fromdate="";
//     this.todate="";
//     this.ChequesInBankValidation = {};
//     this.checkedRowsCount = 0;
//     this.checkedAmountTotal = 0;
//   }
//   ShowBrsClear() {
//     debugger;
//     this._searchText="";
//     this.gridData = [];
//     this.cleared = 0;
//     let fromdate = this.ChequesInBankForm.controls['pfrombrsdate'].value;
//     let todate = this.ChequesInBankForm.controls['ptobrsdate'].value;
//     if (fromdate != null && todate != null) {
//       this.OnBrsDateChanges(fromdate, todate);
//       if (this.validate == false) {
//         fromdate = this._commonService.getFormatDateNormal(fromdate);
//         todate = this._commonService.getFormatDateNormal(todate);
//         this.fromdate=fromdate;
//         this.todate=todate;
//         this.validatebrsdateclear = false;
//         this.pageSetUp();
//         this.GetDataOnBrsDates(fromdate, todate, this.bankid);
//       }
//       else {
//         this.validatebrsdateclear = true;
//       }
//     }
//     else {
//       this._commonService.showWarningMessage("select fromdate and todate");
//     }
//   }

//   ShowBrsReturn() {
//     debugger;
//     $("#search").val("");
//      this._searchText="";
//     this.gridData = [];
//     this.returned = 0;
//     let fromdate = this.BrsDateForm.controls['frombrsdate'].value;
//     let todate = this.BrsDateForm.controls['tobrsdate'].value;
//     if (fromdate != null && todate != null) {
//       this.OnBrsDateChanges(fromdate, todate);
//       if (this.validate == false) {
//         fromdate = this._commonService.getFormatDateNormal(fromdate);
//         todate = this._commonService.getFormatDateNormal(todate);
//         this.fromdate=fromdate;
//         this.todate=todate;
//         this.validatebrsdatereturn = false;
//         this.pageSetUp();
//         this.GetDataOnBrsDates(fromdate, todate, this.bankid);
//       }
//       else {
//         this.validatebrsdatereturn = true;
//       }
//     }
//     else {
//       this._commonService.showWarningMessage("select fromdate and todate");
//     }
//   }
//   GetDataOnBrsDates(frombrsdate, tobrsdate, bankid) {
//     let DataFromBrsDatesChequesInBank=this._accountingtransaction.DataFromBrsDatesChequesInBank(frombrsdate, tobrsdate, bankid,this.modeofreceipt,this._searchText,this.startindex,this.endindex);
//     let GetChequesRowCount=this._accountingtransaction.GetChequesRowCount(this.bankid,this._searchText,frombrsdate, tobrsdate,"CHEQUESINBANK",'');
//     forkJoin(DataFromBrsDatesChequesInBank,GetChequesRowCount)
//     .subscribe(
//       clearreturndata => {
//         debugger;
//         let kk = [];
//         this.ChequesClearReturnDataBasedOnBrs = clearreturndata[0]['pchequesclearreturnlist'];
//         for (let i = 0; i < this.ChequesClearReturnDataBasedOnBrs.length; i++) {
//           if (this.status == "cleared" && this.ChequesClearReturnDataBasedOnBrs[i].pchequestatus == "Y") {
//             kk.push(this.ChequesClearReturnDataBasedOnBrs[i]);
//           }
//           if (this.status == "returned" && this.ChequesClearReturnDataBasedOnBrs[i].pchequestatus == "R") {
//             kk.push(this.ChequesClearReturnDataBasedOnBrs[i])
//           }
//         }
//         this._countData=clearreturndata[1];
//         this.CountOfRecords();
//         this.gridData = kk;
//         this.gridData.filter(data => {
//           data.preceiptdate = this._commonService.getFormatDateGlobal((data.preceiptdate));
//           data.pdepositeddate = this._commonService.getFormatDateGlobal((data.pdepositeddate));
//           data.pCleardate = this._commonService.getFormatDateGlobal((data.pCleardate));
//         })
//         if(this.status=="cleared"){
//         this.totalElements = this._countData["clear_count"];
//         this.page.totalElements = this._countData["clear_count"];
//         }else{
//           this.totalElements = this._countData["return_count"];
//         this.page.totalElements = this._countData["return_count"];
//         }
//         if (this.page.totalElements > 10)
//           this.page.totalPages = parseInt((this.page.totalElements / 10).toString()) + 1;
//       }, error => { this._commonService.showErrorMessage(error) })
//   }
//   GetDataOnBrsDates1(frombrsdate, tobrsdate, bankid) {
//     this._accountingtransaction.DataFromBrsDatesChequesInBank(frombrsdate, tobrsdate, bankid,this.modeofreceipt,this._searchText,this.startindex,this.endindex)
//     .subscribe(
//       clearreturndata => {
//         debugger;
//         let kk = [];
//         this.ChequesClearReturnDataBasedOnBrs = clearreturndata['pchequesclearreturnlist'];
//         for (let i = 0; i < this.ChequesClearReturnDataBasedOnBrs.length; i++) {
//           if (this.status == "cleared" && this.ChequesClearReturnDataBasedOnBrs[i].pchequestatus == "Y") {
//             kk.push(this.ChequesClearReturnDataBasedOnBrs[i]);
//           }
//           if (this.status == "returned" && this.ChequesClearReturnDataBasedOnBrs[i].pchequestatus == "R") {
//             kk.push(this.ChequesClearReturnDataBasedOnBrs[i])
//           }
//         }
//         this.gridData = kk;
//         this.gridData.filter(data => {
//           data.preceiptdate = this._commonService.getFormatDateGlobal((data.preceiptdate));
//           data.pdepositeddate = this._commonService.getFormatDateGlobal((data.pdepositeddate));
//           data.pCleardate = this._commonService.getFormatDateGlobal((data.pCleardate));
//         })
//       }, error => { this._commonService.showErrorMessage(error) })
//   }
//   CancelChargesOk(value) {
//     debugger;
//     if(value==""){
//       this._commonService.showWarningMessage("Minimum Amount Should Be "+this.chequereturncharges);
//         // $("#cancelcharges").val(this.chequereturncharges);
//      }
//      else{
//     for (let i = 0; i < this.gridData.length; i++) {
//       if (this.gridData[i].preceiptid == this.PopupData.preceiptid) {
//         this.gridData[i].pactualcancelcharges = value;
//       }
//     }
//     $('#add-detail').modal('hide');
//   }
//   }
//   OnBrsDateChanges(fromdate, todate) {

//     if (fromdate > todate) {
//       this.validate = true;
//     }
//     else {
//       this.validate = false;
//     }
//   }
//   checkValidations(group: FormGroup, isValid: boolean): boolean {

//     try {
//       Object.keys(group.controls).forEach((key: string) => {
//         isValid = this.GetValidationByControl(group, key, isValid);
//         console.log(key+"-->"+isValid);
//       })
//     }
//     catch (e) {
//       this.showErrorMessage(e);
//       return false;
//     }
//     return isValid;
//   }
//   GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
//     try {
//       let formcontrol;
//       formcontrol = formGroup.get(key);
//       if (formcontrol) {
//         if (formcontrol instanceof FormGroup) {
//           this.checkValidations(formcontrol, isValid)
//         }
//         else if (formcontrol.validator) {
//           this.ChequesInBankValidation[key] = '';
//           if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
//             let lablename;
//             lablename = (document.getElementById(key) as HTMLInputElement).title;
//             let errormessage;
//             for (const errorkey in formcontrol.errors) {
//               if (errorkey) {
//                 errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
//                 this.ChequesInBankValidation[key] += errormessage + ' ';
//                 isValid = false;
//               }
//             }
//           }
//         }
//       }
//     }
//     catch (e) {
//       this.showErrorMessage(e);
//       return false;
//     }
//     return isValid;
//   }
//   showErrorMessage(errormsg: string) {
//     this._commonService.showErrorMessage(errormsg);
//   }
//   BlurEventAllControll(fromgroup: FormGroup) {
//     try {
//       Object.keys(fromgroup.controls).forEach((key: string) => {
//         this.setBlurEvent(fromgroup, key);
//       })
//     }
//     catch (e) {
//       this.showErrorMessage(e);
//       return false;
//     }
//   }
//   setBlurEvent(fromgroup: FormGroup, key: string) {
//     try {
//       let formcontrol;
//       formcontrol = fromgroup.get(key);
//       if (formcontrol) {
//         if (formcontrol instanceof FormGroup) {
//           this.BlurEventAllControll(formcontrol)
//         }
//         else {
//           if (formcontrol.validator)
//             fromgroup.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
//         }
//       }
//     }
//     catch (e) {
//       this.showErrorMessage(e);
//       return false;
//     }
//   }


//   public group: any[] = [{
//     field: 'preceiptdate'
//   }, {
//     field: 'pChequenumber'
//   }
//   ];
//   chequesStatusInfoGrid() {
//     debugger;
//     $("#chequescss").addClass("active");
//     $("#allcss").removeClass("active");
//     let grid = [];
//     for (let i = 0; i < this.ChequesInBankData.length; i++) {
//       if (this.ChequesInBankData[i].ptypeofpayment == "CHEQUE") {
//         this.ChequesInBankData[i]["chequeStatus"] = "Deposited";
//         grid.push(this.ChequesInBankData[i]);
//       }
//     }

//     for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
//       if (this.ChequesClearReturnData[i].pchequestatus == "Y") {
//         this.ChequesClearReturnData[i]["chequeStatus"] = "Cleared";
//         grid.push(this.ChequesClearReturnData[i]);
//       }
//     }

//     for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
//       if (this.ChequesClearReturnData[i].pchequestatus == "R") {
//         this.ChequesClearReturnData[i]["chequeStatus"] = "Returned";
//         grid.push(this.ChequesClearReturnData[i]);
//       }
//     }

//     this.displayGridDataBasedOnForm = grid;
//     this.displayGridDataBasedOnFormTemp = JSON.parse(JSON.stringify(grid))
//     console.log("Mixed Grid->", this.displayGridDataBasedOnForm)
//     debugger;
//     this.setPageModel();
//     this.pageCriteria.totalrows = this.displayGridDataBasedOnForm.length;
//     this.pageCriteria.TotalPages = 1;
//     if (this.pageCriteria.totalrows > this.pageCriteria.pageSize)
//       this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / this.pageCriteria.pageSize).toString()) + 1;
//     if (this.displayGridDataBasedOnForm.length < this.pageCriteria.pageSize) {
//       this.pageCriteria.currentPageRows = this.displayGridDataBasedOnForm.length;
//     }
//     else {
//       this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
//     }

//   }


//   pdfOrprint(printorpdf) {
//     debugger;
//     this.Totlaamount=0;
//     let receiptDate = this._commonService.getFormatDate1(this.ChequesInBankForm.controls.pchequereceiptdate.value);
//     let chequeintype=this.ChequesInBankForm.controls.chequeintype.value;
//     let GetChequesInBankData=this._accountingtransaction.GetPaytmInBankData(this.bankid,0,999999,this.modeofreceipt,this._searchText,"PDF",receiptDate,chequeintype);
//     let ChequesClearReturnData=this._accountingtransaction.DataFromBrsDatesChequesInBank(this.fromdate,this.todate,this.bankid,this.modeofreceipt,this._searchText,0,99999);
//     forkJoin(GetChequesInBankData,ChequesClearReturnData)
//     .subscribe(result=>{
//       let gridData: any;
//      debugger;
//       if (this.pdfstatus == "Cleared" || this.pdfstatus == "Returned") {
//          gridData = result[1]["pchequesclearreturnlist"];
//       }
//       else {
//         gridData = result[0].pchequesOnHandlist;
//       }
//     let rows = [];
//     let UPI;
//     this.PaytmList.forEach(x=>{
//       if(x.paccountid==this.ChequesInBankForm.controls.paytmname.value){
//         UPI="for "+x.pdepositbankname;
//       }
//     })
//     if(UPI == undefined){
//       UPI="for Paytm";
//     }
//     let reportname = "Onlile Collection Settlement "+UPI;
//     let gridheaders;
//     let colWidthHeight;
//     if (this.pdfstatus == "Cleared" || this.pdfstatus == "Returned") {
//      colWidthHeight = {
//         0: { cellWidth: 'auto', halign: 'center' },1: { cellWidth: 'auto' }, 2: { cellWidth: 15, halign: 'right' }, 3: { cellWidth: 20, halign: 'center' }, 
//         4: { cellWidth: 'auto', halign: 'center' }, 5: { cellWidth: 'auto', halign: 'center' }, 
//         6: { cellWidth:'auto', halign:'center'  }, 7: { cellWidth: 'center' }, 8: { cellWidth: 'auto' },
//         9: { cellWidth: 'auto' },10: { cellWidth: 'auto' }
//       }
//       gridheaders = ["Reference No.","Branch Name", "Amount", "Receipt ID", "Receipt Date", "Deposited Date", this.datetitle, "Transaction \nMode", "Cheque Bank Name","chit Receipt No", "Party"];
//     }
//     else {
//       colWidthHeight = {
//         0: { cellWidth: 'auto', halign: 'center' },1: { cellWidth: 'auto' }, 2: { cellWidth: 15, halign: 'right' }, 
//         3: { cellWidth: 20, halign: 'center' }, 
//         4: { cellWidth: 'auto', halign: 'center' },
//          5: { cellWidth: 'auto', halign: 'center' }, 6: { cellWidth: 'center' }, 7: { cellWidth: 'center' }, 8: { cellWidth: 'auto' },9: { cellWidth: 'auto' }
         
//       }
//       gridheaders = ["Reference No.","Branch Name", "Amount", "Receipt ID", "Receipt Date", "Deposited Date", "Transaction \nMode", "Cheque Bank Name","Chit Receipt No", "Party"];
//     }

//     gridData.forEach(element => {
//       debugger;
//       let receiptdate = element.preceiptdate;

//       let datereceipt = this._commonService.getFormatDateGlobal(receiptdate);
//       let depositeddate = this._commonService.getFormatDateGlobal(element.pdepositeddate);
//       let returneddate = this._commonService.getFormatDateGlobal(element.pCleardate);
//       let totalreceivedamt;
//       if (element.ptotalreceivedamount != 0) {
//         totalreceivedamt = this._commonService.currencyformat(element.ptotalreceivedamount);
//         totalreceivedamt = this._commonService.convertAmountToPdfFormat(totalreceivedamt);
//         this.Totlaamount += element.ptotalreceivedamount;
//       }
//       else {
//         totalreceivedamt = "";
//       }
//        let temp
//       if (this.pdfstatus == "Cleared" || this.pdfstatus == "Returned") {
//         temp = [element.pChequenumber,element.pbranchname, totalreceivedamt, element.preceiptid, datereceipt, depositeddate, returneddate, element.ptypeofpayment, element.cheque_bank,element.chitReceiptNo, element.ppartyname];
//       }
//       else {
//         temp = [element.pChequenumber,element.pbranchname, totalreceivedamt, element.preceiptid, datereceipt, depositeddate, element.ptypeofpayment, element.cheque_bank,element.chitReceiptNo, element.ppartyname];
//       }
//       rows.push(temp);
//     });
//     this.amounttotal=this.Totlaamount;
//     let totalAmt=0;
//     gridData.forEach(element => {
//       totalAmt=totalAmt+element.ptotalreceivedamount;
//     })
//     let amounttotal = this._commonService.convertAmountToPdfFormat(this._commonService.currencyformat(totalAmt));

//     let temp1
//     temp1 = ['','Total', amounttotal, '', '', '', '', '', '','', ''];
//     rows.push(temp1); 
//     this._commonService._downloadonlineUPIReportsPdf(reportname, rows, gridheaders, colWidthHeight, "landscape","", "", "", printorpdf,amounttotal);
//   });
//   }
//   export(): void {
//     this.Totlaamount=0;
//     let receiptDate = this._commonService.getFormatDate1(this.ChequesInBankForm.controls.pchequereceiptdate.value);
//     let chequeintype=this.ChequesInBankForm.controls.chequeintype.value;
//     let GetChequesInBankData=this._accountingtransaction.GetPaytmInBankData(this.bankid,0,999999,this.modeofreceipt,this._searchText,"PDF",receiptDate,chequeintype);
//     let ChequesClearReturnData=this._accountingtransaction.DataFromBrsDatesChequesInBank(this.fromdate,this.todate,this.bankid,this.modeofreceipt,this._searchText,0,99999);
//     forkJoin(GetChequesInBankData,ChequesClearReturnData)
//     .subscribe(result=>{
//       let gridData: any;
//      debugger;
//       if (this.pdfstatus == "Cleared" || this.pdfstatus == "Returned") {
//          gridData = result[1]["pchequesclearreturnlist"];
//       }
//       else {
//         gridData = result[0].pchequesOnHandlist;
//       }
//     let rows = [];
//     gridData.forEach(element => {
//       debugger;
//       let receiptdate = element.preceiptdate;
//       let datereceipt = this._commonService.getFormatDateGlobal(receiptdate);
//       let depositeddate = this._commonService.getFormatDateGlobal(element.pdepositeddate);
//       let chequedate;
//       if (element.pCleardate == null) {
//         chequedate = "";
//       }
//       else {
//         chequedate = this._commonService.getFormatDateGlobal(element.pCleardate);
//       }
//       let totalreceivedamt;
//       if (element.ptotalreceivedamount != 0) {
//         totalreceivedamt = this._commonService.removeCommasInAmount(element.ptotalreceivedamount);
//       }
//       else {
//         totalreceivedamt = "";
//       }
//       let temp;
//       let dataobject;
//       if (this.pdfstatus == "Cleared" || this.pdfstatus == "Returned") {
//         if (this.pdfstatus == "Cleared") {
//           dataobject = {
//             "Reference No.": element.pChequenumber,
//             "Branch Name":element.pbranchname,
//             "Amount": totalreceivedamt,
//             "Receipt Id": element.preceiptid,
//             "Receipt Date": datereceipt,
//             "Deposited Date": depositeddate,
//             "Cleared Date": chequedate,
//             "Transaction Mode": element.ptypeofpayment,
//             "Cheque Bank Name": element.cheque_bank,
//             "Chit Receipt No":element.chitReceiptNo,
//             "Party": element.ppartyname,
//           }
//         }
//         if (this.pdfstatus == "Returned") {
//           dataobject = {
//             "Reference No.": element.pChequenumber,
//             "Branch Name":element.pbranchname,
//             "Amount": totalreceivedamt,
//             "Receipt Id": element.preceiptid,
//             "Receipt Date": datereceipt,
//             "Deposited Date": depositeddate,
//             "Returned Date": chequedate,
//             "Transaction Mode": element.ptypeofpayment,
//             "Cheque Bank Name": element.cheque_bank,
//             "Chit Receipt No":element.chitReceiptNo,
//             "Party": element.ppartyname,
//           }
//         }
//       }
//       else {
//         dataobject = {
//           "Reference No.": element.pChequenumber,
//           "Branch Name":element.pbranchname,
//           "Amount": totalreceivedamt,
//           "Receipt Id": element.preceiptid,
//           "Receipt Date": datereceipt,
//           "Deposited Date": depositeddate,
//           "Transaction Mode": element.ptypeofpayment,
//           "Cheque Bank Name": element.cheque_bank,
//           "Chit Receipt No":element.chitReceiptNo,
//           "Party": element.ppartyname,
//         }
//       }

//       rows.push(dataobject);
//     });
//     this._commonService.exportAsExcelFile(rows, 'Online Collection');
//   });
//   }

//   returnCharges_Change(event){
//     if(parseFloat(event.target.value)<this.chequereturncharges || event.target.value==""){
//      this._commonService.showWarningMessage("Minimum Amount Should Be "+this.chequereturncharges);
//         $("#cancelcharges").val("");
//     }
//   }

//   getChequeReturnCharges(){
//     this._accountingtransaction.getChequeReturnCharges().subscribe(res=>{
//       console.log(res);
//       this.chequereturncharges=res[0].chequereturncharges;
//     })
//   }
//   pdfContentData() {
//     var lMargin = 15; 
//     var rMargin = 15; 
//     var pdfInMM = 210;
  
//     let count=0
// if(this.previewdetails.length !=0){
//   var doc = new jsPDF();
//   this.previewdetails.forEach(obj=>{
   
// count=count+1
//     let ExportRightSideData = [ obj.psubscribername.trim() + ", "]
//     let Companyreportdetails = this._commonService._getCompanyDetails();
//     let today = this._commonService.getFormatDateGlobal(new Date())
//     let todayhhmm = this._commonService.pdfProperties("Date");
//     let DateandLetterNo = ["Date  : " + today + ""]
//     doc.setFontSize(12);
//     doc.setFontStyle('normal');
//     doc.setTextColor('black');
//     doc.text('Dear Sir / Madam' +'',15, 90,);
//     doc.text('SUB : NOTICE REGARDING RETURN OF YOUR CHEQUE.' +'',55, 97,);
//     doc.text('Ref : Chit No. : '+obj.pchitno +'',70, 104,);
    
//     let Content = " We regret to inform you that your cheque No : "+ obj.preferencenumber+ " dated : "+this._commonService.getFormatDateGlobal(obj.pchequedate)+" for Rs. "+this._commonService.convertAmountToPdfFormat(obj.ptotalreceivedamount)+" drawn on : "+obj.pbankname+"  towards subscription to the above Chit : "+ obj.pchitno+" has been returned by your bank unpaid.  \n\n"
//           Content +="Kindly arrange payment of the amount of the cheque in cash or demand draft together with penality of Rs. "+this._commonService.convertAmountToPdfFormat(obj.pchequereturnchargesamount)+" and Bank Charges immediately on receipt of this letter.  \n\n"
//           Content +="Please note that our Official Receipt No. "+obj.preceiptid+ " Date : "+ this._commonService.getFormatDateGlobal(obj.pchequedate)+ " issued in this regard stands cancelled.  Henceforth payment of subscription may please be made either in cash or by D.D only. \n\n"
//           Content +="Please note that under the provision of Section 138B of Negotiable Instruments Act we can/will initiate legal proceeding against you if you fail to pay the dishonoured cheque amount within Fifteen days from the date of this notice. \n\n"
//     Content +="We hope you will not allow us to initiate the above proceedings. \n\n"
//     Content +="We request your immediate response. \n\n"
//     doc.setFontStyle('normal');
//     doc.text('Yours faithfully,' + '', 165, 200);
//     doc.text('For ' + Companyreportdetails.pCompanyName+'', 115, 207);
//     doc.text('Manger' + '', 165, 220);
//     debugger;
//    let kapil_logo=this._commonService.getKapilGroupLogo();
//    let rupeeImage = this._commonService._getRupeeSymbol();
//    doc.addImage(kapil_logo, 'JPEG', 10, 5)
//     doc.setFont("Times-Italic")
//     doc.setTextColor('black');
//     doc.setFontStyle('normal');
//     doc.setFontSize(12);
//     let address = this._commonService.getcompanyaddress();
//     doc.text(Companyreportdetails.pCompanyName, 72, 10);
//     doc.setFontSize(8);
//     doc.setTextColor('black');
//     let address1=address.substr(0,115);
//     doc.text(address1, 110, 15, 0, 0, 'center');
//     let address2=address.substring(115)
//     doc.text('' + address2 + '', 110, 18);
//     if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
//       doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 90, 22);
//     }
//     doc.setFontSize(14);
//     doc.text("Cheque Return Invoice", 92, 30);
//     doc.setFontSize(12);
//     doc.text(30, 55, "To,");
//     let addr1="";
//     addr1=obj.paddress+ ".";
//     ExportRightSideData.push(addr1);
//      this._commonService.addWrappedText({
//        text: ExportRightSideData,
//        textWidth: 100,
//        doc,
//        fontSize: 10,
//        fontType: 'normal',
//        lineSpacing: 5,              
//        xPosition: 30,                
//        initialYPosition: 60,        
//        pageWrapInitialYPosition: 10 
//      }); 
//     doc.setFontSize(12);
//     doc.text(160, 45, DateandLetterNo);
//     let P1Lines = doc.splitTextToSize(Content, (pdfInMM - lMargin - rMargin));
//     doc.setFontSize(12);
//     doc.text(15,115, P1Lines);        
//     const head2FinalHeight = doc.getTextDimensions(P1Lines, { fontSize: 10 });
//     let previousContentHeight = 70 + head2FinalHeight.h;
//     doc.setFontSize(12);
//     doc.setTextColor('green');
//     doc.setTextColor('black');
//     let pageSize = doc.internal.pageSize;
//     let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
//     let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
//     let reportname = "Cheque Return Invoice";
//     if(count!= this.previewdetails.length){
//       doc.addPage();
//     }else{
//       doc.save('' + reportname + '.pdf');
//     }
   
//   })
   
//   }

// }

// chequereturnvoucherpdf(){
//   var lMargin = 15; 
//   var rMargin = 15; 
//   var pdfInMM = 235; 

//   let count=0
// if(this.chequerwturnvoucherdetails.length !=0){
// var doc = new jsPDF();
// this.chequerwturnvoucherdetails.forEach(obj=>{
// count=count+1
//   let Companyreportdetails = this._commonService._getCompanyDetails();
//   let today = this._commonService.getFormatDateGlobal(new Date())
//   let todayhhmm = this._commonService.pdfProperties("Date");
//   let DateandLetterNo = ["Date  : " + today + ""]
//   this.todayDate = this.datepipe.transform(this.today, "dd-MMM-yyyy h:mm:ss a");
//   doc.line(15, 42, (pdfInMM - lMargin - rMargin), 42) 
//   doc.setFontSize(12);
//   doc.setFontStyle('normal');
//   doc.setTextColor('black');
//   debugger;
//  let kapil_logo=this._commonService.getKapilGroupLogo();
// //  let currencyformat = this.currencysymbol;
//  let rupeeImage = this._commonService._getRupeeSymbol();
//  doc.addImage(kapil_logo, 'JPEG', 10, 5)
//   doc.setFont("Times-Italic")
//   doc.setTextColor('black');
//   doc.setFontStyle('normal');
//   doc.setFontSize(12);
//  // doc.setTextColor('green');

//   //company Header
//   let address = this._commonService.getcompanyaddress();
//   doc.text(Companyreportdetails.pCompanyName, 72, 10);
//   doc.setFontSize(8);
//   doc.setTextColor('black');
//   let address1=address.substr(0,115);
//   doc.text(address1, 110, 15, 0, 0, 'center');
//   let address2=address.substring(115)
//   doc.text('' + address2 + '', 110, 18);
  
//   if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
//     doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 90, 22);
//   }
//   doc.setFontSize(14);
//   doc.text("Cheque Return Voucher", 92, 30);
//   doc.setFontSize(12);
 
//   doc.setFontSize(12);
//   doc.text(160, 48, DateandLetterNo);
//   doc.text('Printed On  :  ' + this.todayDate  , 15, 40);
//   doc.text('Voucher No. : ' + obj.pvoucherno+ '', 15, 48);
//   doc.text('Debit To       : ' + obj.pdebitaccountname+ '', 15, 55);
//   doc.text('Bank             : ' + obj.pcreditaccountname+ '', 15, 62);
//   doc.rect(15, 135, 30, 12, 'S')
//   doc.text('Manager' + '' , 55, 145);
//   doc.text('Accounts Officer' + '' , 110, 145);
//   doc.text('Cashier' + '' , 180, 145);
//   doc.text("Amount In Words :  "+"Rupees " + this.titleCase(this.numbertowords.transform(obj.ptotalreceivedamount))+" Only."+ '', 15, 125);
//   // let gridheaders = ["Cheque No.","Cheque Date", "Bank","Branch","Receipt No.","Receipt Date"];
//   let gridheaders=["PARTICULARS",'']
   
//    let bodygrid=[]
//    let temp1=[];
//    let temp2=[]
//    let temp3=[]
//    let temp4=[]
//    let temp5=[]
//    let temp6=[]
   
//    let tempgrid=[]
//    temp1=["Cheque No.",obj.preferencenumber]
//    temp2=["Cheque Date",this._commonService.getFormatDateGlobal(obj.pchequedate)]
//    temp3=["Bank",obj.pbankname]
//    temp4=["Branch",obj.pbranchname]
//    temp5=["Receipt No.",obj.preceiptid]
//    temp6=["Receipt Date",this._commonService.getFormatDateGlobal(obj.pchequedate)]
//    bodygrid.push(temp1);
//    bodygrid.push(temp2);
//    bodygrid.push(temp3);
//    bodygrid.push(temp4);
//    bodygrid.push(temp5);
//    bodygrid.push(temp6);
  
//    let total = {
//     content: 'Amount' ,
//     colSpan: 1,
//     styles: {
//       halign: 'right', fontSize: 8, fontStyle: 'bold'//, textColor: "#663300", fillColor: "#e6f7ff" 
//     }
//   };
//   let tot=[]
//     tot=[total,this._commonService.currencyFormat(obj.ptotalreceivedamount)];
//    bodygrid.push(tot);
//   let FirstcolWidthHeight = {
//     0: { cellWidth: 'auto', halign: 'left' }, 1: { cellWidth: 'auto', halign: 'left' },
//     }
//   doc.autoTable({
//     columns: gridheaders,
//     body: bodygrid,
//     theme: 'grid',//'striped'|'grid'|'plain'|'css' = 'striped'
//     headStyles: {
//       fillColor: this._commonService.pdfProperties("Header Color1"),
//       halign: this._commonService.pdfProperties("Header Alignment"),
//       fontSize: 9,
//       lineWidth: 0.1,
//       tableLineColor: 'black',
//       textColor: 'black', //Black  
//       //rowHeight:5
//     }, // Red
//     styles: {
//       cellPadding: 1, fontSize:10, cellWidth: 'wrap',
//       rowPageBreak: 'avoid',
//       overflow: 'linebreak',
//       textColor:'black',
//       //rowHeight:11,
//     },
//     columnStyles: FirstcolWidthHeight,
//     startY: 69,
//     margin: { right: 35,left:35 },
    
//   })
  
//   doc.setFontSize(12);
//   doc.setTextColor('green');

//   doc.setTextColor('black');
  
//   let pageSize = doc.internal.pageSize;
//   let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
//   let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
//   let reportname = "Cheque Return Voucher";
//   if(count!= this.chequerwturnvoucherdetails.length){
//     doc.addPage();
//   }else{
//     doc.save('' + reportname + '.pdf');
//   }
// })
// }
// }
// titleCase(str) {
//   var splitStr = str.toLowerCase().split(' ');
//   for (var i = 0; i < splitStr.length; i++) {
//       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
//   }
//   return splitStr.join(' '); 
// }
// onSelect({ selected }) {
//   debugger;
//   console.log(selected);
//   this.saveGridData=[];
//   this.saveGridData=selected;
//   this.checkedAmountTotal = 0;
//   this.checkedRowsCount = 0;
//   for(let i = 0; i < this.saveGridData.length; i++){
//     this.checkedAmountTotal = this.saveGridData[i].ptotalreceivedamount + this.checkedAmountTotal;
//   }
//   this.checkedRowsCount = this.saveGridData.length;
// }
//   chequeintypeChange(event){
//     debugger
//     console.log(event);
//     this.ChequesInBankForm.controls.searchtext.setValue("");
//     if (event!=undefined){
//       this.ChequesInBankForm.controls.chequeintype.setValue(event);
//       this.GetChequesInBank(this.bankid,this.startindex,this.endindex,this._searchText,event);
//     }

//      if ((this.ChequesInBankForm.controls.chequeintype.value == 'D') || (this.ChequesInBankForm.controls.chequeintype.value=="A")){
//        this.ChequesInBankData.forEach(element=>{element['checkuncheck']=false});
//        this.checkuncheckbool=false;
//       }else{
//         this.ChequesInBankData.forEach(element=>{element['checkuncheck']=true});
//          this.checkuncheckbool=true;
//       }

//   }
// }
