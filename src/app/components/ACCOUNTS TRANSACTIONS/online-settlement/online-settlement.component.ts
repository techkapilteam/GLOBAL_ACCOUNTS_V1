import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';
import { CommonService } from '../../../services/common.service';
import * as XLSX from 'xlsx';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { NgSelectModule } from '@ng-select/ng-select';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChequesIssuedRow {
  preceiptrecordid?:      any;
  pUpiname?:              string;
  pUpiid?:                string;
  pBankconfigurationId?:  string;
  pBankName?:             string;
  ptranstype?:            string;
  ptypeofpayment?:        string;
  pChequenumber?:         string;
  pchequedate?:           string;
  pchequedepositdate?:    string;
  pchequecleardate?:      string;
  pbankid?:               any;
  branchid?:              any;
  pCardNumber?:           string;
  pdepositbankid?:        any;
  pdepositbankname?:      string;
  pAccountnumber?:        string;
  challanaNo?:            string;
  preceiptid?:            any;
  preceiptdate?:          string;
  pmodofreceipt?:         string;
  ptotalreceivedamount:   number;
  pnarration?:            string;
  ppartyname?:            string;
  ppartyid?:              any;
  pistdsapplicable?:      boolean;
  pTdsSection?:           string;
  pTdsPercentage?:        string;
  ptdsamount?:            number;
  ptdscalculationtype?:   string;
  ppartypannumber?:       string;
  ppartyreftype?:         string;
  ppartyreferenceid?:     string;
  preceiptslist?:         any[];
  pFilename?:             string;
  pFilepath?:             string;
  pFileformat?:           string;
  pCleardate?:            string;
  pdepositeddate?:        string;
  ptdsaccountid?:         string;
  pTdsSectionId?:         string;
  groupcode?:             string;
  preceiptno?:            string;
  formname?:              string;
  chitpaymentid?:         string;
  adjustmentid?:          string;
  pdepositstatus?:        boolean;
  pcancelstatus?:         boolean;
  preturnstatus?:         boolean;
  pbranchname?:           string;
  pchequestatus?:         string;
  pcancelcharges?:        string;
  pactualcancelcharges?:  string;
  pledger?:               string;
  cancelstatus?:          string;
  returnstatus?:          string;
  clearstatus?:           string;
  chqueno?:               string;
  issueddate?:            string;
  chitgroupcode?:         string;
  chitgroupid?:           any;
  ticketno?:              any;
  chequeamount?:          any;
  zpdaccountid?:          string;
  installmentno?:         string;
  schemesubscriberid?:    string;
  contactid?:             string;
  schemetype?:            string;
  checksentryrecordid?:   string;
  cheque_bank?:           string;
  selfchequestatus?:      string;
  branch_name?:           string;
  receipt_branch_name?:   string;
  subscriber_details?:    string;
  chitReceiptNo?:         string;
  total_count?:           string;
  transactionNo?:         string;
  transactiondate?:       string;
  chitstatus?:            string;
  chitgroupstatus?:       string;
  receiptnumbers?:        string;
  pdepositedBankid?:      string;
  pdepositedBankName?:    string;
  preferencetext?:        string;
  preceiptype?:           string;
  puploadeddate?:         string;
  subscriberbankaccountno?: string;
  pkgmsreceiptdate?:      string;
  chequeStatus?:          string;
  pCreatedby?:            any;
  pipaddress?:            string;
  [key: string]:          any;
}

type GridStatus =
  | 'all' | 'chequesissued' | 'onlinepayment'
  | 'cleared' | 'returned' | 'cancelled'
  | 'autobrs' | 'other' | 'bankfileupload';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

@Component({
  selector: 'app-cheques-issued',
  imports: [CommonModule, CurrencyPipe, NgSelectModule, TableModule, CheckboxModule, FormsModule, ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './cheques-issued.component.html',
  styleUrl: './cheques-issued.component.css'
})
export class ChequesIssuedComponent implements OnInit {

  @Input() fromFormName: any;

  // ---- Excel / AutoBRS ----
  PreDefinedAutoBrsArrayData: any[]  = [];
  data: any[]                        = [['Date', 'UTR Number', 'Amount', 'Reference Text']];
  fileName                           = 'AutoBrs.xlsx';
  auto_brs_type_name                 = 'Upload';
  saveAutoBrsBool                    = false;
  boolforAutoBrs                     = false;

  // ---- Pagination ----
  page = {
    totalElements: 0,
    pageSize: 10,
    pageNumber: 0,
    offset: 0,
    size: 10,
    totalPages: 0,
  };

  pageCriteria = {
    pageSize: 10,
    offset: 0,
    pageNumber: 1,
    footerPageHeight: 50,
    totalrows: 0,
    TotalPages: 0,
    currentPageRows: 0,
  };

  pageCriteria2 = {
    pageSize: 10,
    offset: 0,
    pageNumber: 1,
    footerPageHeight: 50,
    headerHeight: 50,
    rowHeight: 'auto' as const,
  };

  startindex: any;
  endindex:   any;
  totalElements: number | undefined;

  // ---- Status flags ----
  activeTab: GridStatus = 'all';
  status:    GridStatus = 'all';
  pdfstatus  = 'All';
  modeofreceipt = 'ALL';

  // ---- UI flags ----
  tabsShowOrHideBasedOnfromFormName = false;
  showicons           = false;
  gridLoading         = false;
  checkbox            = false;
  banknameshowhide:   any;
  showhidegridcolumns  = false;
  showhidegridcolumns2 = false;
  saveshowhide         = true;
  hiddendate           = true;

  brsdateshowhidecleared   = false;
  brsdateshowhidereturned  = false;
  brsdateshowhidecancelled = false;

  validatebrsdatecancel = false;
  validatebrsdatereturn = false;
  validatebrsdateclear  = false;

  showOrHideOtherChequesGrid:    boolean | undefined;
  showOrHideAllChequesGrid:      boolean | undefined;
  showOrHideChequesIssuedGrid:   boolean | undefined;

  // ---- Save button ----
  buttonname        = 'Save';
  disablesavebutton = false;

  // ---- Data ----
  gridData:     ChequesIssuedRow[] = [];
  gridDatatemp: ChequesIssuedRow[] = [];
  dataTemp:     ChequesIssuedRow[] = [];

  BanksList:               any[]                = [];
  ChequesIssuedData:       ChequesIssuedRow[]   = [];
  OtherChequesData:        any[]                = [];
  OtherChequesDataTemp:    any[]                = [];
  ChequesClearReturnData:  ChequesIssuedRow[]   = [];
  ChequesClearReturnDataBasedOnBrs: ChequesIssuedRow[] = [];
  DataForSaving:           any[]                = [];

  _countData: any = {};
  otherChequesCount: any;
  tabname: string | undefined;

  // ---- Counts ----
  all          = 0;
  chequesissued = 0;
  onlinepayments = 0;
  cleared      = 0;
  returned     = 0;
  cancelled    = 0;
  amounttotal  = 0;

  // ---- Bank / balance ----
  currencySymbol:   any;
  bankname:         any;
  bankbalancetype:  any;
  bankbalance:      any;
  brsdate:          any;
  bankbalancedetails: any;
  bankdetails:      any;
  bankid:           any = 0;
  datetitle:        any;
  validate          = false;

  // ---- Search / date range ----
  _searchText = '';
  fromdate:   any = '';
  todate:     any = '';
  schemaname: any;

  // ---- AllCheques grid (fromChequesStatusInformationForm mode) ----
  displayAllChequesDataBasedOnForm:     any;
  displayAllChequesDataBasedOnFormTemp: any;

  // ---- Validation ----
  ChequesIssuedValidation: any = {};

  // ---- Forms ----
  ChequesIssuedForm!: FormGroup;
  BrsReturnForm!:     FormGroup;
  BrsCancelForm!:     FormGroup;

  // ---- Datepicker ----
  dpConfig:     Partial<BsDatepickerConfig> = {};
  brsfromConfig: Partial<BsDatepickerConfig> = {};
  brstoConfig:   Partial<BsDatepickerConfig> = {};

  // ---- Extra fields from new version ----
  bankList: any[] = [];
  selectedBankName: any;
  bankid1: any;
  brsTOdate: any;
  bankid12: any;
  pageSize: any;
  disableaddbutton = false;

  companydetails: any;

  constructor(
    private _accountingtransaction: AccountingTransactionsService,
    private _commonService: CommonService,
    private fb: FormBuilder,
    private datepipe: DatePipe,
    private _Accountservice: AccountingTransactionsService
  ) {
    this.brsfromConfig = { ...this.dpConfig };
    this.brstoConfig   = { ...this.dpConfig };
  }

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  ngOnInit(): void {
    this.pageSetUp();

    this.companydetails  = JSON.parse(sessionStorage.getItem('companydetails') || '{}');
    this.currencySymbol  = this._commonService.currencysymbol;

    this.ChequesIssuedForm = this.fb.group({
      ptransactiondate: [new Date(), Validators.required],
      bankname: [''],
      pfrombrsdate: [''],
      ptobrsdate: [''],
      pchequesOnHandlist: [],
      SearchClear: [''],
      pCreatedby: [''],
      schemaname: [this._commonService.getschemaname()],
      pipaddress: [this._commonService.ipaddress],
      auto_brs_type: ['Upload']
    });

    this.BrsReturnForm = this.fb.group({
      frombrsdate: [''],
      tobrsdate: ['']
    });

    this.BrsCancelForm = this.fb.group({
      frombrsdate: [''],
      tobrsdate: ['']
    });

    this.ChequesIssuedValidation = {};

    this.initTabState();

    const BranchSchema = this._commonService.getbranchname();
    const GlobalSchema = this._commonService.getschemaname();
    const CompanyCode = this._commonService.getCompanyCode();
    const BranchCode = this._commonService.getBranchCode();

    this._Accountservice.GetBankntList(
      BranchSchema,
      GlobalSchema,
      CompanyCode,
      BranchCode
    ).subscribe((res: any) => {
      this.bankList = res.banklist || [];
    });

    this.setPageModel();
    this.setPageModel2();

    this.GetChequesIssued_Load(this.bankid);

    this.boolforAutoBrs = this.companydetails?.pisautobrsimpsapplicable;

    this._accountingtransaction
      .GetBanksntList(
        this._commonService.getbranchname(),
        this._commonService.getschemaname(),
        this._commonService.getCompanyCode(),
        this._commonService.getBranchCode(),
      )
      .subscribe({
        next: (banks: any) => (this.BanksList = banks || []),
        error: (err: any) => this._commonService.showErrorMessage(err),
      });
  }

  // ===========================================================================
  // Init helpers
  // ===========================================================================

  private initTabState(): void {
    if (this.fromFormName === 'fromChequesStatusInformationForm') {
      this.tabsShowOrHideBasedOnfromFormName = false;
      this.showOrHideOtherChequesGrid        = true;
      this.showOrHideAllChequesGrid          = true;
      this.showOrHideChequesIssuedGrid       = false;
    } else {
      this.tabsShowOrHideBasedOnfromFormName = true;
      this.showOrHideOtherChequesGrid        = false;
      this.showOrHideAllChequesGrid          = false;
      this.showOrHideChequesIssuedGrid       = false;
    }
  }

  // ===========================================================================
  // Bank change
  // ===========================================================================

  onBankChange(bank: any) {
    if (!bank) {
      this.selectedBankName = '';
      this.bankbalance = 0;
      this.brsdate = '';
      this.bankid = 0;
      return;
    }

    this.selectedBankName = bank.pdepositbankname;
    this.bankid = bank.pbankid;
    this.bankid12 = bank.pbankid;

    const transactionDate = this.ChequesIssuedForm.value.ptransactiondate;
    const formattedDate = this.datepipe.transform(transactionDate, 'yyyy-MM-dd') || '';

    this._Accountservice.GetBankBalance(
      formattedDate,
      bank.pbankid,
      'accounts',
      'KLC01',
      'KAPILCHITS'
    ).subscribe((res: any) => {
      this.bankbalance = res?._BankBalance ?? 0;
      this.brsdate = res?.pfrombrsdate || '';
      this.brsTOdate = res?.ptobrsdate || '';

      this.ChequesIssuedForm.patchValue({
        pfrombrsdate: this._commonService.getDateObjectFromDataBase(res?.pfrombrsdate),
        ptobrsdate: this._commonService.getDateObjectFromDataBase(res?.ptobrsdate)
      });

      this.GetChequesIssued_Load(this.bankid);
    });
  }

  // ===========================================================================
  // Data loaders
  // ===========================================================================

  GetChequesIssued_Load(bankid: number) {
    this.gridLoading = true;

    const GlobalSchema = this._commonService.getschemaname();
    const BranchSchema = this._commonService.getbranchname();
    const CompanyCode  = this._commonService.getCompanyCode();
    const BranchCode   = this._commonService.getBranchCode();

    forkJoin([
      this._accountingtransaction.GetChequesIssued(
        this.bankid12,
        this.brsdate,
        this.brsTOdate,
        BranchSchema,
        0,
        this.pageSize,
        this.modeofreceipt,
        3,
        GlobalSchema,
        BranchCode,
        CompanyCode
      ),
      this._accountingtransaction.GetChequesRowCount(
        bankid, GlobalSchema, BranchSchema,
        this._searchText, this.fromdate, this.todate,
        'CHEQUESISSUED', this.modeofreceipt, CompanyCode, BranchCode,
      ),
    ]).subscribe({
      next: ([data, count]: any) => {
        this.gridLoading = false;

        this.ChequesIssuedData      = data?.pchequesOnHandlist     || [];
        this.ChequesClearReturnData = data?.pchequesclearreturnlist || [];
        this.OtherChequesData       = data?.pchequesotherslist      || [];
        this.otherChequesCount      = this.OtherChequesData.length;

        this._countData = count || {};
        this.CountOfRecords();

        if (this.status === 'all')     this.All();
        if (this.status === 'autobrs') this.autoBrs();

        this.totalElements      = +count?.total_count || 0;
        this.page.totalElements = this.totalElements;
      },
      error: (err: any) => {
        this.gridLoading = false;
        this._commonService.showErrorMessage(err);
      },
    });
  }

  GetChequesIssued(
    bankid: any,
    startindex: number,
    endindex: number,
    searchText: string,
  ): void {
    this.gridLoading = true;

    const GlobalSchema = this._commonService.getschemaname();
    const BranchSchema = this._commonService.getbranchname();
    const CompanyCode  = this._commonService.getCompanyCode();
    const BranchCode   = this._commonService.getBranchCode();

    this._accountingtransaction
      .GetChequesIssued(
        bankid, this.fromdate, this.todate, BranchSchema,
        startindex, endindex,
        this.modeofreceipt, searchText,
        GlobalSchema, BranchCode, CompanyCode,
      )
      .subscribe({
        next: (data: any) => {
          this.gridLoading = false;

          this.ChequesIssuedData      = data?.pchequesOnHandlist     || [];
          this.ChequesClearReturnData = data?.pchequesclearreturnlist || [];
          this.OtherChequesData       = data?.pchequesotherslist      || [];
          this.otherChequesCount      = this.OtherChequesData.length;

          this.syncActiveTab();

          if (this.fromFormName === 'fromChequesStatusInformationForm') {
            this.chequesStatusInfoGridForChequesIssued();
          }
        },
        error: (err: any) => {
          this.gridLoading = false;
          this._commonService.showErrorMessage(err);
        },
      });
  }

  // ===========================================================================
  // Tab sync dispatcher
  // ===========================================================================

  private syncActiveTab(): void {
    switch (this.status) {
      case 'chequesissued': this.renderChequesIssued1();    break;
      case 'onlinepayment': this.renderOnlinePayments1();   break;
      case 'cleared':       this.renderCleared1();          break;
      case 'returned':      this.renderReturned1();         break;
      case 'cancelled':     this.renderCancelled1();        break;
      default:              this.renderAll1();              break;
    }
  }

  // ===========================================================================
  // Public tab actions
  // ===========================================================================

  All(): void {
    this.resetDateRange();
    this.status       = 'all';
    this.pdfstatus    = 'All';
    this.modeofreceipt = 'ALL';
    this.resetBrsFlags();
    this.setGridVisibility('cheques');
    this.fromFormName === 'fromChequesStatusInformationForm'
      ? this.GridColumnsHide() : this.GridColumnsShow();

    this.pageSetUp();
    this.GetChequesIssued(this.bankid, this.startindex, this.endindex, this._searchText);

    const grid = this.filterByBank(this.ChequesIssuedData);
    this.setGridData(grid);

    this.totalElements      = this._countData['total_count'];
    this.page.totalElements = this.totalElements ?? 0;
    if (this.page.totalElements > 10) {
      this.page.totalPages = Math.ceil(this.page.totalElements / 10);
    }
  }

  private renderAll1(): void {
    this.status       = 'all';
    this.pdfstatus    = 'All';
    this.modeofreceipt = 'ALL';
    this.resetBrsFlags();
    this.setGridVisibility('cheques');
    this.fromFormName === 'fromChequesStatusInformationForm'
      ? this.GridColumnsHide() : this.GridColumnsShow();

    const grid = this.filterByBank(this.ChequesIssuedData);
    this.setGridData(grid);
  }

  ChequesIssued(): void {
    this.resetDateRange();
    this.status        = 'chequesissued';
    this.pdfstatus     = 'Cheques Issued';
    this.modeofreceipt = 'CHEQUE';
    this.resetBrsFlags();
    this.setGridVisibility('cheques');
    this.fromFormName === 'fromChequesStatusInformationForm'
      ? this.GridColumnsHide() : this.GridColumnsShow();

    this.pageSetUp();
    this.GetChequesIssued(this.bankid, this.startindex, this.endindex, this._searchText);

    const grid = this.filterByBankAndType(this.ChequesIssuedData, 'CHEQUE');
    this.setGridData(grid);

    this.totalElements      = this._countData['cheques_count'];
    this.page.totalElements = this.totalElements ?? 0;
    if (this.page.totalElements > 10) {
      this.page.totalPages = Math.ceil(this.page.totalElements / 10);
    }
  }

  private renderChequesIssued1(): void {
    this.status        = 'chequesissued';
    this.pdfstatus     = 'Cheques Issued';
    this.modeofreceipt = 'CHEQUE';
    this.resetBrsFlags();
    this.setGridVisibility('cheques');
    this.fromFormName === 'fromChequesStatusInformationForm'
      ? this.GridColumnsHide() : this.GridColumnsShow();

    const grid = this.filterByBankAndType(this.ChequesIssuedData, 'CHEQUE');
    this.setGridData(grid);
  }

  OnlinePayments(): void {
    this.resetDateRange();
    this.status        = 'onlinepayment';
    this.pdfstatus     = 'Online Payments';
    this.modeofreceipt = 'ONLINE';
    this.resetBrsFlags();
    this.setGridVisibility('cheques');
    this.fromFormName === 'fromChequesStatusInformationForm'
      ? this.GridColumnsHide() : this.GridColumnsShow();

    this.pageSetUp();
    this.GetChequesIssued(this.bankid, this.startindex, this.endindex, this._searchText);

    const grid = this.filterByBankAndType(this.ChequesIssuedData, 'CHEQUE', true);
    this.setGridData(grid);

    this.totalElements      = this._countData['others_count'];
    this.page.totalElements = this.totalElements ?? 0;
    if (this.page.totalElements > 10) {
      this.page.totalPages = Math.ceil(this.page.totalElements / 10);
    }
  }

  private renderOnlinePayments1(): void {
    this.status        = 'onlinepayment';
    this.pdfstatus     = 'Online Payments';
    this.modeofreceipt = 'ONLINE';
    this.resetBrsFlags();
    this.setGridVisibility('cheques');
    this.fromFormName === 'fromChequesStatusInformationForm'
      ? this.GridColumnsHide() : this.GridColumnsShow();

    const grid = this.filterByBankAndType(this.ChequesIssuedData, 'CHEQUE', true);
    this.setGridData(grid);
  }

  Cleared(): void {
    this.resetDateRange();
    this.status        = 'cleared';
    this.pdfstatus     = 'Cleared';
    this.modeofreceipt = 'CLEAR';
    this.datetitle     = 'Cleared Date';
    this.brsdateshowhidecleared   = true;
    this.brsdateshowhidereturned  = false;
    this.brsdateshowhidecancelled = false;
    this.setGridVisibility('cheques');
    this.GridColumnsHide();

    this.ChequesIssuedForm.patchValue({
      pfrombrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate),
      ptobrsdate:   this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate),
    });

    this.pageSetUp();
    this.GetChequesIssued(this.bankid, this.startindex, this.endindex, this._searchText);

    const grid = this.filterClearReturn('P');
    this.setGridData(grid);

    this.totalElements      = this._countData['clear_count'];
    this.page.totalElements = this.totalElements ?? 0;
    if (this.page.totalElements > 10) {
      this.page.totalPages = Math.ceil(this.page.totalElements / 10);
    }
  }

  private renderCleared1(): void {
    this.status        = 'cleared';
    this.pdfstatus     = 'Cleared';
    this.modeofreceipt = 'CLEAR';
    this.datetitle     = 'Cleared Date';
    this.brsdateshowhidecleared   = true;
    this.brsdateshowhidereturned  = false;
    this.brsdateshowhidecancelled = false;
    this.setGridVisibility('cheques');
    this.GridColumnsHide();

    this.ChequesIssuedForm.patchValue({
      pfrombrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate),
      ptobrsdate:   this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate),
    });

    const grid = this.filterClearReturn('P');
    this.setGridData(grid);
  }

  Returned(): void {
    this.resetDateRange();
    this.status        = 'returned';
    this.pdfstatus     = 'Returned';
    this.modeofreceipt = 'RETURN';
    this.datetitle     = 'Returned Date';
    this.brsdateshowhidereturned  = true;
    this.brsdateshowhidecleared   = false;
    this.brsdateshowhidecancelled = false;
    this.setGridVisibility('cheques');
    this.GridColumnsHide();

    this.BrsReturnForm.patchValue({
      frombrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate),
      tobrsdate:   this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate),
    });

    this.pageSetUp();
    this.GetChequesIssued(this.bankid, this.startindex, this.endindex, this._searchText);

    const grid = this.filterClearReturn('R');
    this.setGridData(grid);

    this.totalElements      = this._countData['return_count'];
    this.page.totalElements = this.totalElements ?? 0;
    if (this.page.totalElements > 10) {
      this.page.totalPages = Math.ceil(this.page.totalElements / 10);
    }
  }

  private renderReturned1(): void {
    this.status        = 'returned';
    this.pdfstatus     = 'Returned';
    this.modeofreceipt = 'RETURN';
    this.datetitle     = 'Returned Date';
    this.brsdateshowhidereturned  = true;
    this.brsdateshowhidecleared   = false;
    this.brsdateshowhidecancelled = false;
    this.setGridVisibility('cheques');
    this.GridColumnsHide();

    this.BrsReturnForm.patchValue({
      frombrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate),
      tobrsdate:   this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate),
    });

    const grid = this.filterClearReturn('R');
    this.setGridData(grid);
  }

  Cancelled(): void {
    this.resetDateRange();
    this.status        = 'cancelled';
    this.pdfstatus     = 'Cancelled';
    this.modeofreceipt = 'CANCEL';
    this.datetitle     = 'Cancelled Date';
    this.tabname       = 'Cancelled';
    this.brsdateshowhidecancelled = true;
    this.brsdateshowhidereturned  = false;
    this.brsdateshowhidecleared   = false;
    this.setGridVisibility('cheques');
    this.GridColumnsHide();

    this.BrsCancelForm.patchValue({
      frombrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate),
      tobrsdate:   this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate),
    });

    this.pageSetUp();
    this.GetChequesIssued(this.bankid, this.startindex, this.endindex, this._searchText);

    const grid = this.filterClearReturn('C');
    this.setGridData(grid);

    this.totalElements      = this._countData['cancel_count'];
    this.page.totalElements = this.totalElements ?? 0;
    if (this.page.totalElements > 10) {
      this.page.totalPages = Math.ceil(this.page.totalElements / 10);
    }
  }

  private renderCancelled1(): void {
    this.status        = 'cancelled';
    this.pdfstatus     = 'Cancelled';
    this.modeofreceipt = 'CANCEL';
    this.datetitle     = 'Cancelled Date';
    this.tabname       = 'Cancelled';
    this.brsdateshowhidecancelled = true;
    this.brsdateshowhidereturned  = false;
    this.brsdateshowhidecleared   = false;
    this.setGridVisibility('cheques');
    this.GridColumnsHide();

    this.BrsCancelForm.patchValue({
      frombrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate),
      tobrsdate:   this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate),
    });

    const grid = this.filterClearReturn('C');
    this.setGridData(grid);
  }

  allCheques(): void {
    this.setGridVisibility('all');
    this.resetBrsFlags();
    this.chequesStatusInfoGridForChequesIssued();
  }

  autoBrs(): void {
    this.gridDatatemp = [];
    this.gridData     = [...this.ChequesIssuedData];
    this.dataTemp     = structuredClone(this.gridData);

    this.gridData.forEach(r => {
      r.pdepositstatus = true;
      r.pchequestatus  = 'P';
    });

    this.amounttotal = this.gridData.reduce((s, r) => s + r.ptotalreceivedamount, 0);

    this.totalElements      = this._countData['cheques_count'];
    this.page.totalElements = this.totalElements ?? 0;
    if (this.page.totalElements > 10) {
      this.page.totalPages = Math.ceil(this.page.totalElements / 10);
    }
  }

  otherCheques(): void {
    this.status   = 'other';
    this.tabname  = 'OtherCheques';
    this.setGridVisibility('otherCheques');
  }

  AutoBrs(): void {
    if (!this.ChequesIssuedForm.get('bankname')?.value) {
      this._commonService.showWarningMessage('Please Select Bank');
      this.gridData = [];
      return;
    }
    this.status        = 'autobrs';
    this.modeofreceipt = 'ONLINE-AUTO';
    this.saveshowhide  = true;
    this.GetChequesIssued_Load(this.bankid);
  }

  // ===========================================================================
  // Filter utilities
  // ===========================================================================

  private filterByBank(rows: ChequesIssuedRow[]): ChequesIssuedRow[] {
    return this.bankid === 0 ? rows
      : rows.filter(r => r.pdepositbankid === this.bankid);
  }

  private filterByBankAndType(
    rows: ChequesIssuedRow[],
    type: string,
    exclude = false,
  ): ChequesIssuedRow[] {
    return this.filterByBank(rows).filter(r =>
      exclude ? r.ptypeofpayment !== type : r.ptypeofpayment === type,
    );
  }

  private filterClearReturn(status: 'P' | 'R' | 'C'): ChequesIssuedRow[] {
    return this.ChequesClearReturnData.filter(r =>
      r.pchequestatus === status &&
      (this.bankid === 0 || r.pdepositbankid === this.bankid),
    );
  }

  // ===========================================================================
  // Grid-state helpers
  // ===========================================================================

  private setGridData(rows: ChequesIssuedRow[]): void {
    this.gridData     = structuredClone(rows);
    this.gridDatatemp = this.gridData;
    this.dataTemp     = structuredClone(rows);
    this.showicons    = this.gridData.length > 0;
    this.amounttotal  = this.gridData.reduce((s, r) => s + r.ptotalreceivedamount, 0);
  }

  private setGridVisibility(mode: 'all' | 'cheques' | 'otherCheques'): void {
    this.showOrHideOtherChequesGrid  = mode === 'otherCheques';
    this.showOrHideAllChequesGrid    = mode === 'all';
    this.showOrHideChequesIssuedGrid = mode === 'cheques';
  }

  private resetBrsFlags(): void {
    this.brsdateshowhidecleared   = false;
    this.brsdateshowhidereturned  = false;
    this.brsdateshowhidecancelled = false;
  }

  private resetDateRange(): void {
    this.fromdate = '';
    this.todate   = '';
  }

  GridColumnsShow(): void {
    this.showhidegridcolumns  = false;
    this.showhidegridcolumns2 = false;
    this.saveshowhide         = true;
    this.hiddendate           = true;
    this.resetBrsFlags();
  }

  GridColumnsHide(): void {
    this.showhidegridcolumns = true;
    this.saveshowhide        = false;
    this.hiddendate          = false;
  }

  CountOfRecords(): void {
    this.all           = this._countData['total_count']   || 0;
    this.onlinepayments = this._countData['others_count']  || 0;
    this.chequesissued = this._countData['cheques_count']  || 0;
    this.cleared       = this._countData['clear_count']   || 0;
    this.returned      = this._countData['return_count']  || 0;
    this.cancelled     = this._countData['cancel_count']  || 0;
  }

  // ===========================================================================
  // Pagination
  // ===========================================================================

  pageSetUp(): void {
    if (!this.pageCriteria) {
      this.pageCriteria = {
        pageSize: 10, offset: 0, pageNumber: 1,
        footerPageHeight: 50, totalrows: 0, TotalPages: 0, currentPageRows: 0,
      };
    }
    this.pageCriteria.offset     = 0;
    this.pageCriteria.pageNumber = 1;
    this.startindex              = 0;
    this.endindex                = this._commonService.pageSize || 10;
  }

  setPageModel(): void {
    this.pageCriteria.pageSize        = this._commonService.pageSize;
    this.pageCriteria.offset          = 0;
    this.pageCriteria.pageNumber      = 1;
    this.pageCriteria.footerPageHeight = 50;
  }

  setPageModel2(): void {
    this.pageCriteria2.pageSize        = this._commonService.pageSize;
    this.pageCriteria2.offset          = 0;
    this.pageCriteria2.pageNumber      = 1;
    this.pageCriteria2.footerPageHeight = 50;
  }

  onFooterPageChange(event: { page: number }): void {
    this.pageCriteria.offset      = event.page - 1;
    this.pageCriteria.pageNumber  = event.page;
    this.pageCriteria.currentPageRows =
      this.pageCriteria.totalrows < event.page * this.pageCriteria.pageSize
        ? this.pageCriteria.totalrows % this.pageCriteria.pageSize
        : this.pageCriteria.pageSize;
  }

  setPage(pageInfo: any, event: any): void {
    this.page.offset      = event.page - 1;
    this.page.pageNumber  = pageInfo.page;
    this.endindex         = this.page.pageNumber * this.page.size;
    this.startindex       = this.endindex - this.page.size;

    if (this.fromdate && this.todate) {
      this.GetDataOnBrsDates1(this.fromdate, this.todate, this.bankid);
    } else {
      this.GetChequesIssued(this.bankid, this.startindex, this.page.size, '');
    }
  }

  // ===========================================================================
  // Bank selection
  // ===========================================================================

  SelectBank(event: any): void {
    const value = event?.target?.value;

    if (!value) {
      this.bankid          = 0;
      this.bankname        = '';
      this.banknameshowhide = false;
    } else {
      this.banknameshowhide = true;
      this.bankdetails      = this.BanksList.find(b => b.pdepositbankname === value);
      this.bankid           = this.bankdetails?.pbankid;
      this.bankname         = this.bankdetails?.pdepositbankname;

      const bal             = this.bankdetails?.pbankbalance ?? 0;
      this.bankbalance      = bal < 0 ? Math.abs(bal) : bal;
      this.bankbalancetype  = bal < 0 ? 'Cr' : bal === 0 ? '' : 'Dr';
    }

    this.GetChequesIssued_Load(this.bankid);
    this.syncActiveTab();
    this.ChequesIssuedForm.patchValue({ SearchClear: '' });
  }

  // ===========================================================================
  // Search
  // ===========================================================================

  onSearch(event: any): void {
    const searchText = event?.toString() || '';
    this._searchText = searchText;

    if (!searchText) {
      this.gridData    = structuredClone(this.gridDatatemp);
      this.amounttotal = this.gridData.reduce((s, r) => s + r.ptotalreceivedamount, 0);
      return;
    }

    this.gridData = this.gridDatatemp.filter((x: any) =>
      JSON.stringify(x).includes(searchText),
    );
    this.amounttotal = this.gridData.reduce((s, r) => s + r.ptotalreceivedamount, 0);
  }

  // ===========================================================================
  // Date change
  // ===========================================================================

  change_date(_event: any): void {
    this.gridData.forEach(r => {
      r.pdepositstatus = false;
      r.pcancelstatus  = false;
      r.pchequestatus  = 'N';
    });
  }

  OnBrsDateChanges(fromdate: Date, todate: Date): void {
    this.validate = fromdate > todate;
  }

  // ===========================================================================
  // BRS date filtering
  // ===========================================================================

  ShowBrsClear(): void {
    this.gridData    = [];
    this.cleared     = 0;
    this._searchText = '';
    const fromdate   = this.ChequesIssuedForm.value.pfrombrsdate;
    const todate     = this.ChequesIssuedForm.value.ptobrsdate;

    if (!fromdate || !todate) {
      this._commonService.showWarningMessage('select fromdate and todate');
      return;
    }

    this.OnBrsDateChanges(fromdate, todate);
    if (this.validate) { this.validatebrsdateclear = true; return; }

    this.validatebrsdateclear = false;
    this.fromdate = this._commonService.getFormatDateGlobal(fromdate);
    this.todate   = this._commonService.getFormatDateGlobal(todate);
    this.pageSetUp();
    this.GetDataOnBrsDates(this.fromdate, this.todate, this.bankid);
  }

  ShowBrsReturn(): void {
    this.gridData    = [];
    this.returned    = 0;
    this._searchText = '';
    const fromdate   = this.BrsReturnForm.value.frombrsdate;
    const todate     = this.BrsReturnForm.value.tobrsdate;

    if (!fromdate || !todate) {
      this._commonService.showWarningMessage('select fromdate and todate');
      return;
    }

    this.OnBrsDateChanges(fromdate, todate);
    if (this.validate) { this.validatebrsdatereturn = true; return; }

    this.validatebrsdatereturn = false;
    this.fromdate = this._commonService.getFormatDateGlobal(fromdate);
    this.todate   = this._commonService.getFormatDateGlobal(todate);
    this.pageSetUp();
    this.GetDataOnBrsDates(this.fromdate, this.todate, this.bankid);
  }

  ShowBrsCancel(): void {
    this._searchText = '';
    const fromdate   = this.BrsCancelForm.value.frombrsdate;
    const todate     = this.BrsCancelForm.value.tobrsdate;

    if (!fromdate || !todate) {
      this._commonService.showWarningMessage('select fromdate and todate');
      return;
    }

    this.OnBrsDateChanges(fromdate, todate);
    if (this.validate) { this.validatebrsdatecancel = true; return; }

    this.validatebrsdatecancel = false;
    this.fromdate = this._commonService.getFormatDateGlobal(fromdate);
    this.todate   = this._commonService.getFormatDateGlobal(todate);
    this.pageSetUp();

    if (this.tabname === 'Cancelled') {
      this.gridData  = [];
      this.cancelled = 0;
      this.GetDataOnBrsDates(this.fromdate, this.todate, this.bankid);
    } else if (this.tabname === 'OtherCheques') {
      this.GetDataOnBrsDatesForOtherCheques(this.fromdate, this.todate, this.bankid);
    }
  }

  addPaymentDetails() {
    if (this.disableaddbutton) {
      return;
    }

    this.disableaddbutton = true;

    console.log("Add clicked");

    setTimeout(() => {
      this.disableaddbutton = false;
    }, 1000);
  }

  GetDataOnBrsDates(frombrsdate: any, tobrsdate: any, bankid: any): void {
    const GlobalSchema = this._commonService.getschemaname();
    const BranchSchema = this._commonService.getbranchname();
    const CompanyCode  = this._commonService.getCompanyCode();
    const BranchCode   = this._commonService.getBranchCode();

    forkJoin([
      this._accountingtransaction.DataFromBrsDatesChequesIssued(
        frombrsdate, tobrsdate, bankid, this.modeofreceipt,
        this._searchText, this.startindex, this.endindex,
      ),
      this._accountingtransaction.GetChequesRowCount(
        bankid, GlobalSchema, BranchSchema,
        this._searchText, frombrsdate, tobrsdate,
        'CHEQUESISSUED', '', CompanyCode, BranchCode,
      ),
    ]).subscribe({
      next: ([data, count]: any) => {
        this.ChequesClearReturnDataBasedOnBrs = data['pchequesclearreturnlist'] || [];

        const grid = this.ChequesClearReturnDataBasedOnBrs
          .filter((x: any) =>
            (this.status === 'cleared'   && x.pchequestatus === 'P') ||
            (this.status === 'cancelled' && x.pchequestatus === 'C') ||
            (this.status === 'returned'  && x.pchequestatus === 'R'),
          )
          .map((d: any) => ({
            ...d,
            preceiptdate:   this._commonService.getFormatDateGlobal(d.preceiptdate),
            pdepositeddate: this._commonService.getFormatDateGlobal(d.pdepositeddate),
          }));

        this._countData = count;
        this.CountOfRecords();
        this.gridData = grid;

        const countKey     = this.status === 'cleared' ? 'clear_count'
          : this.status === 'returned' ? 'return_count' : 'cancel_count';
        this.totalElements = this._countData[countKey];
        this.page.totalElements = this.totalElements ?? 0;
        if (this.page.totalElements > 10) {
          this.page.totalPages = Math.ceil(this.page.totalElements / 10);
        }
      },
      error: (err: any) => this._commonService.showErrorMessage(err),
    });
  }

  GetDataOnBrsDates1(frombrsdate: any, tobrsdate: any, bankid: any): void {
    this._accountingtransaction
      .DataFromBrsDatesChequesIssued(
        frombrsdate, tobrsdate, bankid, this.modeofreceipt,
        this._searchText, this.startindex, this.endindex,
      )
      .subscribe({
        next: (data: any) => {
          this.ChequesClearReturnDataBasedOnBrs = data['pchequesclearreturnlist'] || [];
          this.gridData = this.ChequesClearReturnDataBasedOnBrs
            .filter((x: any) =>
              (this.status === 'cleared'   && x.pchequestatus === 'P') ||
              (this.status === 'cancelled' && x.pchequestatus === 'C') ||
              (this.status === 'returned'  && x.pchequestatus === 'R'),
            )
            .map((d: any) => ({
              ...d,
              preceiptdate:   this._commonService.getFormatDateGlobal(d.preceiptdate),
              pdepositeddate: this._commonService.getFormatDateGlobal(d.pdepositeddate),
            }));
        },
        error: (err: any) => this._commonService.showErrorMessage(err),
      });
  }

  GetDataOnBrsDatesForOtherCheques(frombrsdate: any, tobrsdate: any, bankid: any): void {
    this._accountingtransaction
      .DataFromBrsDatesForOtherChequesDetails(frombrsdate, tobrsdate, bankid)
      .subscribe({
        next: (data: any) => {
          this.OtherChequesData  = (data['pchequesotherslist'] || [])
            .map((x: any) => ({ ...x, preferencetext: '' }));
          this.otherChequesCount = this.OtherChequesData.length;

          this.pageCriteria.totalrows       = this.OtherChequesData.length;
          this.pageCriteria.TotalPages      = Math.ceil(this.pageCriteria.totalrows / this.pageCriteria.pageSize);
          this.pageCriteria.currentPageRows = Math.min(this.pageCriteria.pageSize, this.OtherChequesData.length);
        },
        error: (err: any) => this._commonService.showErrorMessage(err),
      });
  }

  // ===========================================================================
  // Checkbox handlers
  // ===========================================================================

  checkedClear(event: any, data: ChequesIssuedRow): void {
    const receiptDate    = this._commonService.getDateObjectFromDataBase(data.preceiptdate);
    const transactionDate = this.ChequesIssuedForm.value.ptransactiondate;

    if (event.target.checked) {
      if (receiptDate && transactionDate >= receiptDate) {
        data.pdepositstatus = true;
        data.preturnstatus  = false;
        data.pcancelstatus  = false;
        data.pchequestatus  = 'P';
      } else {
        event.target.checked = false;
        this._commonService.showWarningMessage(
          'Transaction Date Should be Greater than Payment Date');
      }
    } else {
      data.pdepositstatus = false;
      data.pchequestatus  = 'N';
    }
    this.gridData = [...this.gridData];
  }

  checkedReturn(event: any, data: ChequesIssuedRow): void {
    const receiptDate    = this._commonService.getDateObjectFromDataBase(data.preceiptdate);
    const transactionDate = this.ChequesIssuedForm.value.ptransactiondate;

    if (event.target.checked) {
      if (receiptDate && transactionDate >= receiptDate) {
        data.preturnstatus  = true;
        data.pcancelstatus  = false;
        data.pdepositstatus = false;
        data.pchequestatus  = 'R';
      } else {
        event.target.checked = false;
        this._commonService.showWarningMessage(
          'Transaction Date Should be Greater than Payment Date');
      }
    } else {
      data.preturnstatus = false;
      data.pchequestatus = 'N';
    }
  }

  checkedCancel(event: any, data: ChequesIssuedRow): void {
    const receiptDate    = this._commonService.getDateObjectFromDataBase(data.preceiptdate);
    const transactionDate = this.ChequesIssuedForm.value.ptransactiondate;

    if (event.target.checked) {
      if (receiptDate && transactionDate >= receiptDate) {
        data.pcancelstatus  = true;
        data.pdepositstatus = false;
        data.preturnstatus  = false;
        data.pchequestatus  = 'C';
      } else {
        event.target.checked = false;
        this._commonService.showWarningMessage(
          'Transaction Date Should be Greater than Payment Date');
      }
    } else {
      data.pcancelstatus = false;
      data.pchequestatus = 'N';
    }
  }

  // ===========================================================================
  // Info grid (fromChequesStatusInformationForm mode)
  // ===========================================================================

  chequesStatusInfoGridForChequesIssued(): void {
    this.setGridVisibility('all');

    const grid: ChequesIssuedRow[] = [
      ...this.ChequesIssuedData
        .filter(x => x.ptypeofpayment === 'CHEQUE')
        .map(x => ({ ...x, chequeStatus: 'Cheques Issued' })),
      ...this.ChequesClearReturnData
        .filter(x => x.pchequestatus === 'P')
        .map(x => ({ ...x, chequeStatus: 'Cleared' })),
      ...this.ChequesClearReturnData
        .filter(x => x.pchequestatus === 'R')
        .map(x => ({ ...x, chequeStatus: 'Returned' })),
      ...this.ChequesClearReturnData
        .filter(x => x.pchequestatus === 'C')
        .map(x => ({ ...x, chequeStatus: 'Cancelled' })),
    ];

    this.displayAllChequesDataBasedOnForm     = grid;
    this.displayAllChequesDataBasedOnFormTemp = [...grid];

    this.setPageModel();
    this.pageCriteria.totalrows       = grid.length;
    this.pageCriteria.TotalPages      = Math.ceil(grid.length / this.pageCriteria.pageSize);
    this.pageCriteria.currentPageRows = Math.min(grid.length, this.pageCriteria.pageSize);
  }

  // ===========================================================================
  // Save / Clear
  // ===========================================================================

  private validateSaveChequesIssued(): boolean {
    if (this.ChequesIssuedForm.invalid) {
      this.ChequesIssuedForm.markAllAsTouched();
      this._commonService.showWarningMessage('Please fix validation errors');
      return false;
    }

    if (this.status !== 'autobrs' && !this.showhidegridcolumns) {
      if (this.validateDuplicates() > 0) {
        this._commonService.showWarningMessage('Duplicates Found please enter unique values');
        return false;
      }

      if (this.emptyValuesFound()) {
        this._commonService.showWarningMessage('Please enter all input fields!');
        return false;
      }

      const hasSelected = this.gridData.some(
        x => x.pchequestatus === 'P' || x.pchequestatus === 'R' || x.pcancelstatus === true,
      );
      if (!hasSelected) {
        this._commonService.showWarningMessage('Please Select records');
        return false;
      }
    }

    return true;
  }

  Save(): void {
    if (!this.validateSaveChequesIssued()) return;

    if (!confirm('Do You Want To Save ?')) return;

    this.buttonname       = 'Processing';
    this.disablesavebutton = true;

    const recordsToSave = this.gridData
      .filter(row => ['P', 'R', 'C'].includes(row.pchequestatus ?? ''))
      .map(row => ({
        ...row,
        pCreatedby:      this._commonService.getCreatedBy(),
        pipaddress:      this._commonService.getIpAddress(),
        preferencetext:  (row.preferencetext ?? '') + '-' + new Date().getFullYear(),
      }));

    if (recordsToSave.length === 0) {
      this._commonService.showWarningMessage('Select atleast one record');
      this.resetSaveButton();
      return;
    }

    this.ChequesIssuedForm.patchValue({ pchequesOnHandlist: recordsToSave });

    const payload = {
      ...this.ChequesIssuedForm.value,
      ptransactiondate: this._commonService.getFormatDateGlobal(
        this.ChequesIssuedForm.value.ptransactiondate),
      pCreatedby: this._commonService.getCreatedBy(),
    };

    this._accountingtransaction.SaveChequesIssued(JSON.stringify(payload)).subscribe({
      next: () => {
        this._commonService.showSuccessMsg('Saved successfully');
        this.Clear();
        this.resetSaveButton();
      },
      error: (err: any) => {
        this._commonService.showErrorMessage(err);
        this.resetSaveButton();
      },
    });
  }

  saveChequesIssued(): void {
    if (!this.validateSaveChequesIssued()) return;

    if (!confirm('Do You Want To Save ?')) return;

    this.buttonname        = 'Processing';
    this.disablesavebutton = true;

    const transactionDate = this._commonService.getFormatDateNormal(
      this.ChequesIssuedForm.controls['ptransactiondate'].value,
    );

    const pchequesOnHandlist: any[] = this.gridData
      .filter(row => ['P', 'R', 'C'].includes(row.pchequestatus ?? ''))
      .map((row: ChequesIssuedRow) => ({
        pRecordid:              row.preceiptrecordid       || '',
        pUpiname:               row.pUpiname               || '',
        pUpiid:                 row.pUpiid                 || '',
        pBankconfigurationId:   row.pBankconfigurationId   || '',
        pBankName:              row.pBankName              || '',
        ptranstype:             row.ptranstype             || '',
        ptypeofpayment:         row.ptypeofpayment         || '',
        pChequenumber:          row.pChequenumber          || '',
        pchequedate:            row.pchequedate            || '',
        pchequedepositdate:     row.pchequedepositdate     || '',
        pchequecleardate:       row.pchequecleardate       || '',
        pbankid:                row.pbankid                || '',
        branchid:               row.branchid               || '',
        pCardNumber:            row.pCardNumber            || '',
        pdepositbankid:         row.pdepositbankid         || '',
        pdepositbankname:       row.pdepositbankname       || '',
        pAccountnumber:         row.pAccountnumber         || '',
        challanaNo:             row.challanaNo             || '',
        preceiptid:             row.preceiptid             || '',
        preceiptdate:           row.preceiptdate           || '',
        pmodofreceipt:          row.ptypeofpayment         || '',
        ptotalreceivedamount:   row.ptotalreceivedamount   || 0,
        pnarration:             row.pnarration             || '',
        ppartyname:             row.ppartyname             || '',
        ppartyid:               row.ppartyid               || '',
        pistdsapplicable:       row.pistdsapplicable        ?? false,
        pTdsSection:            row.pTdsSection            || '',
        pTdsPercentage:         row.pTdsPercentage         || '',
        ptdsamount:             row.ptdsamount             || 0,
        ptdscalculationtype:    row.ptdscalculationtype    || '',
        ppartypannumber:        row.ppartypannumber        || '',
        ppartyreftype:          row.ppartyreftype          || '',
        ppartyreferenceid:      row.ppartyreferenceid      || '',
        preceiptslist:          row.preceiptslist          || [],
        pFilename:              row.pFilename              || '',
        pFilepath:              row.pFilepath              || '',
        pFileformat:            row.pFileformat            || '',
        pCleardate:             row.pCleardate             || '',
        pdepositeddate:         row.pdepositeddate         || '',
        ptdsaccountid:          row.ptdsaccountid          || '',
        preceiptrecordid:       row.preceiptrecordid       || '',
        pTdsSectionId:          row.pTdsSectionId          || '',
        groupcode:              row.groupcode              || '',
        preceiptno:             row.preceiptno             || '',
        formname:               row.formname               || '',
        chitpaymentid:          row.chitpaymentid          || '',
        adjustmentid:           row.adjustmentid           || '',
        pdepositstatus:         row.pdepositstatus          ?? false,
        pcancelstatus:          row.pcancelstatus           ?? false,
        preturnstatus:          row.preturnstatus           ?? false,
        pbranchname:            row.pbranchname            || '',
        pchequestatus:          row.pchequestatus          || 'N',
        pcancelcharges:         row.pcancelcharges         || '',
        pactualcancelcharges:   row.pactualcancelcharges   || '',
        pledger:                row.pledger                || '',
        cancelstatus:           row.cancelstatus           || '',
        returnstatus:           row.returnstatus           || '',
        clearstatus:            row.clearstatus            || '',
        chqueno:                row.chqueno               || '',
        issueddate:             row.issueddate             || '',
        chitgroupcode:          row.chitgroupcode          || '',
        chitgroupid:            row.chitgroupid            || '',
        ticketno:               row.ticketno               || '',
        chequeamount:           row.chequeamount           || '',
        zpdaccountid:           row.zpdaccountid           || '',
        installmentno:          row.installmentno          || '',
        schemesubscriberid:     row.schemesubscriberid     || '',
        contactid:              row.contactid              || '',
        schemetype:             row.schemetype             || '',
        checksentryrecordid:    row.checksentryrecordid    || '',
        cheque_bank:            row.cheque_bank            || '',
        selfchequestatus:       row.selfchequestatus       || '',
        branch_name:            row.branch_name            || '',
        receipt_branch_name:    row.receipt_branch_name    || '',
        subscriber_details:     row.subscriber_details     || '',
        chitReceiptNo:          row.chitReceiptNo          || '',
        total_count:            row.total_count            || '',
        transactionNo:          row.transactionNo          || '',
        transactiondate:        transactionDate,
        chitstatus:             row.chitstatus             || '',
        chitgroupstatus:        row.chitgroupstatus        || '',
        receiptnumbers:         row.receiptnumbers         || '',
        pdepositedBankid:       row.pdepositedBankid       || '',
        pdepositedBankName:     row.pdepositedBankName     || '',
        preferencetext:         (row.preferencetext ?? '') + '-' + new Date().getFullYear(),
        preceiptype:            row.preceiptype            || '',
        puploadeddate:          row.puploadeddate          || '',
        subscriberbankaccountno: row.subscriberbankaccountno || '',
        pkgmsreceiptdate:       row.pkgmsreceiptdate       || '',
        pCreatedby:             this._commonService.getCreatedBy(),
        pipaddress:             this._commonService.getIpAddress(),
      }));

    if (pchequesOnHandlist.length === 0) {
      this._commonService.showWarningMessage('Select at least one record');
      this.resetSaveButton();
      return;
    }

    const payload = {
      ptransactiondate:         transactionDate,
      pchequecleardate:         '',
      pcaobranchcode:           this._commonService.getBranchCode()  || '',
      pcaobranchname:           this._commonService.getbranchname()  || '',
      pcaobranchid:             this._commonService.getbrachid()     || '',
      pfrombrsdate:             this._commonService.getFormatDateNormal(
                                  this.ChequesIssuedForm.controls['pfrombrsdate'].value) || '',
      ptobrsdate:               this._commonService.getFormatDateNormal(
                                  this.ChequesIssuedForm.controls['ptobrsdate'].value)   || '',
      _BankBalance:             String(this.bankbalance ?? 0),
      chequestype:              this.modeofreceipt || 'ALL',
      _CashBalance:             '',
      banknameForLegal:         this.bankname || '',
      pchequesOnHandlist,
      pchequesclearreturnlist:  [],
      pchequesotherslist:       [],
      auto_brs_type_name:       this.auto_brs_type_name || '',
    };

    console.log('SaveChequesIssued payload:', payload);

    this._accountingtransaction.SaveChequesIssued(JSON.stringify(payload)).subscribe({
      next: (res: any) => {
        if (res?.[0] === 'TRUE' || res === true || res === 'TRUE') {
          this._commonService.showSuccessMsg('Saved successfully');
          this.Clear();
        } else {
          this._commonService.showErrorMessage('Error while saving..!');
        }
        this.resetSaveButton();
      },
      error: (err: any) => {
        this._commonService.showErrorMessage(err);
        this.resetSaveButton();
      },
    });
  }

  private resetSaveButton(): void {
    this.disablesavebutton = false;
    this.buttonname        = 'Save';
  }

  Clear(): void {
    this.ChequesIssuedForm.reset();
    this.ChequesIssuedValidation = {};
    this.ngOnInit();
  }

  // ===========================================================================
  // PDF / Export
  // ===========================================================================

  pdfOrprint(printorpdf: 'pdf' | 'print'): void {
    const GlobalSchema = this._commonService.getschemaname();
    const BranchSchema = this._commonService.getbranchname();
    const CompanyCode  = this._commonService.getCompanyCode();
    const BranchCode   = this._commonService.getBranchCode();

    forkJoin([
      this._accountingtransaction.GetChequesIssued(
        this.bankid, '', '', BranchSchema,
        0, 999999, this.modeofreceipt, this._searchText,
        GlobalSchema, BranchCode, CompanyCode,
      ),
      this._accountingtransaction.DataFromBrsDatesChequesIssued(
        this.fromdate, this.todate, this.bankid,
        this.modeofreceipt, this._searchText, 0, 99999,
      ),
    ]).subscribe(([issued, brs]: any) => {
      const isClearReturnCancel = ['Cleared', 'Returned', 'Cancelled'].includes(this.pdfstatus);
      const gridData: any[] = isClearReturnCancel
        ? brs.pchequesclearreturnlist
        : issued.pchequesOnHandlist;

      const rows = gridData.map((e: any) => {
        const receipt   = this._commonService.getFormatDateGlobal(e.preceiptdate);
        const deposited = this._commonService.getFormatDateGlobal(e.pdepositeddate) || '--NA--';
        const amt       = e.ptotalreceivedamount
          ? this._commonService.convertAmountToPdfFormat(
              this._commonService.currencyformat(e.ptotalreceivedamount))
          : '';
        return isClearReturnCancel
          ? [e.pChequenumber, amt, e.preceiptid, receipt, deposited, e.ptypeofpayment, e.ppartyname]
          : [e.pChequenumber, amt, e.preceiptid, receipt, e.ptypeofpayment, e.ppartyname];
      });

      const amounttotal = this._commonService.convertAmountToPdfFormat(
        this._commonService.currencyformat(this.amounttotal));

      this._commonService._downloadchequesReportsPdf(
        'Cheques Issued', rows, [], {}, 'landscape',
        '', '', '', printorpdf, amounttotal,
      );
    });
  }

  export(): void {
    const GlobalSchema = this._commonService.getschemaname();
    const BranchSchema = this._commonService.getbranchname();
    const CompanyCode  = this._commonService.getCompanyCode();
    const BranchCode   = this._commonService.getBranchCode();

    forkJoin([
      this._accountingtransaction.GetChequesIssued(
        this.bankid, '', '', BranchSchema,
        0, 999999, this.modeofreceipt, this._searchText,
        GlobalSchema, BranchCode, CompanyCode,
      ),
      this._accountingtransaction.DataFromBrsDatesChequesIssued(
        this.fromdate, this.todate, this.bankid,
        this.modeofreceipt, this._searchText, 0, 99999,
      ),
    ]).subscribe(([issued, brs]: any) => {
      const gridData: any[] = ['Cleared', 'Returned', 'Cancelled'].includes(this.pdfstatus)
        ? brs.pchequesclearreturnlist
        : issued.pchequesOnHandlist;

      const rows = gridData.map((e: any) => ({
        'Cheque/ Reference No.': e.pChequenumber,
        'Amount':                e.ptotalreceivedamount || '',
        'Payment Id':            e.preceiptid,
        'Payment Date':          this._commonService.getFormatDateGlobal(e.preceiptdate),
        'Transaction Mode':      e.ptypeofpayment,
        'Party':                 e.ppartyname,
      }));

      this._commonService.exportAsExcelFile(rows, 'Cheques Issued');
    });
  }

  // ===========================================================================
  // AutoBRS
  // ===========================================================================

  BankUploadExcel(): void {
    this.saveshowhide             = false;
    this.PreDefinedAutoBrsArrayData = [];
  }

  onFileChange(evt: any): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const wb   = XLSX.read(e.target.result, { type: 'binary' });
      const ws   = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }).slice(1);

      this.PreDefinedAutoBrsArrayData = (data as any[]).map((r: any) => ({
        transactiondate: new Date((r[0] - 25569) * 86400000),
        chqueno:         r[1],
        chequeamount:    r[2],
        preferencetext:  r[3],
      }));
    };
    reader.readAsBinaryString(evt.target.files[0]);
  }

  DownloadExcelforPreDefinedBidAmount(): void {
    const ws = XLSX.utils.aoa_to_sheet(this.data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'AutoBrs');
    XLSX.writeFile(wb, this.fileName);
  }

  getAutoBrs(type: string): void {
    this._accountingtransaction
      .GetPendingautoBRSDetailsIssued(this._commonService.getschemaname(), type)
      .subscribe((res: any) => {
        this.PreDefinedAutoBrsArrayData = res.map((x: any, i: number) => ({
          ...x,
          chqueno:      x.pChequenumber,
          chequeamount: x.ptotalreceivedamount,
          index:        i,
          check:        false,
        }));
      });
  }

  saveAutoBrs(): void {
    const data = this.auto_brs_type_name === 'Upload'
      ? this.PreDefinedAutoBrsArrayData
      : this.PreDefinedAutoBrsArrayData.filter((x: any) => x.check);

    if (!data.length) {
      this._commonService.showWarningMessage('No Data to Save');
      return;
    }
    if (!confirm('Do you want to save ?')) return;

    const payload = {
      pchequesOnHandlist: data.map((x: any) => ({
        ...x,
        transactiondate: this._commonService.getFormatDateGlobal(x.transactiondate),
      })),
      schemaname:         this._commonService.getschemaname(),
      auto_brs_type_name: this.auto_brs_type_name,
    };

    this.saveAutoBrsBool = true;
    this._accountingtransaction.SaveAutoBrsdatauploadIssued(JSON.stringify(payload)).subscribe({
      next: () => {
        this._commonService.showSuccessMsg('Saved successfully');
        this.PreDefinedAutoBrsArrayData = [];
        this.saveAutoBrsBool            = false;
      },
      error: (err: any) => {
        this._commonService.showErrorMessage(err);
        this.saveAutoBrsBool = false;
      },
    });
  }

  auto_brs_typeChange(event: any): void {
    this.PreDefinedAutoBrsArrayData = [];
    this.auto_brs_type_name         = event;
  }

  checkbox_pending_data(row: any, event: any): void {
    this.PreDefinedAutoBrsArrayData[row.index]['check'] = event.target.checked;
  }

  // ===========================================================================
  // Duplicate / empty value checks
  // ===========================================================================

  checkDuplicateValues(value: string, rowIndex: number, row: any): void {
    const exists = this.gridData
      .filter(x => x.pchequestatus === 'P')
      .some(x => x.preferencetext?.toLowerCase() === value?.toLowerCase());

    if (exists) {
      this._commonService.showWarningMessage('Already Exist');
      this.gridData[rowIndex].preferencetext = '';
    } else {
      row.preferencetext = value;
    }
    this.gridData = [...this.gridData];
  }

  checkDuplicateValueslatest(event: any, rowIndex: number, row: any): void {
    const value  = event.target.value?.toLowerCase();
    const exists = this.gridData.some((x: any, i: number) =>
      i !== rowIndex &&
      x.preferencetext?.toLowerCase() === value &&
      (x.preturnstatus || x.pdepositstatus),
    );

    if (exists) {
      this._commonService.showWarningMessage('Already Exist');
      row.preferencetext = '';
    } else {
      row.preferencetext = value;
    }
    this.gridData = [...this.gridData];
  }

  validateDuplicates(): number {
    const refs = this.gridData
      .filter(x => ['P', 'R'].includes(x.pchequestatus ?? '') && x.preferencetext)
      .map(x => x.preferencetext!.toLowerCase());
    return refs.length - new Set(refs).size;
  }

  emptyValuesFound(): boolean {
    return this.gridData
      .filter(x => x.pdepositstatus || x.preturnstatus)
      .some(x => !x.preferencetext);
  }
}