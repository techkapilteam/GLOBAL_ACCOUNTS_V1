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
// Local types replacing PageCriteria / Page / AOA
// ---------------------------------------------------------------------------
type AOA = any[][];

interface PageCriteria {
  pageSize: number;
  offset: number;
  pageNumber: number;
  footerPageHeight: number;
  totalrows: number;
  TotalPages: number;
  currentPageRows: number;
  CurrentPage?: number;
}

interface Page {
  totalElements: number;
  pageSize: number;
  pageNumber: number;
  offset: number;
  size: number;
  totalPages: number;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ChequesIssuedRow {
  preceiptrecordid?: any;
  pUpiname?: string;
  pUpiid?: string;
  pBankconfigurationId?: string;
  pBankName?: string;
  ptranstype?: string;
  ptypeofpayment?: string;
  pChequenumber?: string;
  pchequedate?: string;
  pchequedepositdate?: string;
  pchequecleardate?: string;
  pbankid?: any;
  branchid?: any;
  pCardNumber?: string;
  pdepositbankid?: any;
  pdepositbankname?: string;
  pAccountnumber?: string;
  challanaNo?: string;
  preceiptid?: any;
  preceiptdate?: string;
  pmodofreceipt?: string;
  ptotalreceivedamount: number;
  pnarration?: string;
  ppartyname?: string;
  ppartyid?: any;
  pistdsapplicable?: boolean;
  pTdsSection?: string;
  pTdsPercentage?: string;
  ptdsamount?: number;
  ptdscalculationtype?: string;
  ppartypannumber?: string;
  ppartyreftype?: string;
  ppartyreferenceid?: string;
  preceiptslist?: any[];
  pFilename?: string;
  pFilepath?: string;
  pFileformat?: string;
  pCleardate?: string;
  pdepositeddate?: string;
  ptdsaccountid?: string;
  pTdsSectionId?: string;
  groupcode?: string;
  preceiptno?: string;
  formname?: string;
  chitpaymentid?: string;
  adjustmentid?: string;
  pdepositstatus?: boolean;
  pcancelstatus?: boolean;
  preturnstatus?: boolean;
  pbranchname?: string;
  pchequestatus?: string;
  pcancelcharges?: string;
  pactualcancelcharges?: string;
  pledger?: string;
  cancelstatus?: string;
  returnstatus?: string;
  clearstatus?: string;
  chqueno?: string;
  issueddate?: string;
  chitgroupcode?: string;
  chitgroupid?: any;
  ticketno?: any;
  chequeamount?: any;
  zpdaccountid?: string;
  installmentno?: string;
  schemesubscriberid?: string;
  contactid?: string;
  schemetype?: string;
  checksentryrecordid?: string;
  cheque_bank?: string;
  selfchequestatus?: string;
  branch_name?: string;
  receipt_branch_name?: string;
  subscriber_details?: string;
  chitReceiptNo?: string;
  total_count?: string;
  transactionNo?: string;
  transactiondate?: string;
  chitstatus?: string;
  chitgroupstatus?: string;
  receiptnumbers?: string;
  pdepositedBankid?: string;
  pdepositedBankName?: string;
  preferencetext?: string;
  preceiptype?: string;
  puploadeddate?: string;
  subscriberbankaccountno?: string;
  pkgmsreceiptdate?: string;
  chequeStatus?: string;
  pCreatedby?: any;
  pipaddress?: string;
  pclearstatus?: boolean;
  [key: string]: any;
}

type ActiveTabType =
  | 'all' | 'chequesissued' | 'onlinepayment'
  | 'cleared' | 'returned' | 'cancelled'
  | 'autobrs' | 'autobrsupload' | 'other' | 'bankfileupload';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
@Component({
  selector: 'app-cheques-issued',
  imports: [CommonModule, CurrencyPipe, NgSelectModule, TableModule, CheckboxModule,
    FormsModule, ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './cheques-issued.component.html',
  styleUrl: './cheques-issued.component.css'
})
export class ChequesIssuedComponent implements OnInit {

  @Input() fromFormName: any;

  // ---- UI ----
  tabsShowOrHideBasedOnfromFormName: boolean = false;
  amounttotal: any = 0;
  schemaname: any;
  showicons: boolean = false;

  // ---- Data ----
  gridData: ChequesIssuedRow[] = [];
  gridDatatemp: ChequesIssuedRow[] = [];
  BanksList: any[] = [];
  gridLoading: boolean = false;
  ChequesIssuedData: ChequesIssuedRow[] = [];
  OtherChequesData: any[] = [];
  OtherChequesDataTemp: any[] = [];
  ChequesClearReturnData: ChequesIssuedRow[] = [];
  ChequesClearReturnDataBasedOnBrs: ChequesIssuedRow[] = [];
  DataForSaving: any[] = [];
  dataTemp: ChequesIssuedRow[] = [];
  ChequesIssuedValidation: any = {};

  // ---- Counts ----
  all: any = 0;
  chequesissued: any = 0;
  onlinepayments: any = 0;
  currencySymbol: any;
  cleared: any = 0;
  returned: any = 0;
  cancelled: any = 0;

  // ---- Bank ----
  bankname: any;
  bankbalancetype: any;
  bankbalance: any = 0;
  brsdate: any;
  validate: boolean = false;
  bankbalancedetails: any = { pfrombrsdate: null, ptobrsdate: null };
  bankdetails: any;
  bankid: any = 0;
  banknameshowhide: any;
  datetitle: any;

  // ---- Status ----
  status: ActiveTabType = 'all';
  activeTab: ActiveTabType = 'all';
  pdfstatus: string = 'All';
  checkbox: boolean = false;

  // ---- Save button ----
  buttonname: string = 'Save';
  disablesavebutton: boolean = false;

  // ---- BRS date show/hide ----
  brsdateshowhidecleared: boolean = false;
  brsdateshowhidereturned: boolean = false;
  brsdateshowhidecancelled: boolean = false;

  // ---- Grid columns ----
  showhidegridcolumns: boolean = false;
  showhidegridcolumns2: boolean = false;
  saveshowhide: boolean = true;
  validatebrsdatecancel: boolean = false;
  validatebrsdatereturn: boolean = false;
  validatebrsdateclear: boolean = false;
  hiddendate: boolean = true;

  // ---- Forms ----
  ChequesIssuedForm!: FormGroup;
  BrsReturnForm!: FormGroup;
  BrsCancelForm!: FormGroup;

  // ---- Pagination ----
  pageCriteria: PageCriteria = {
    pageSize: 10, offset: 0, pageNumber: 1,
    footerPageHeight: 50, totalrows: 0, TotalPages: 0, currentPageRows: 0
  };
  pageCriteria2: PageCriteria = {
    pageSize: 10, offset: 0, pageNumber: 1,
    footerPageHeight: 50, totalrows: 0, TotalPages: 0, currentPageRows: 0
  };

  // ---- Grid visibility ----
  showOrHideOtherChequesGrid: boolean = false;
  showOrHideAllChequesGrid: boolean = false;
  showOrHideChequesIssuedGrid: boolean = false;
  otherChequesCount: any = 0;
  tabname: string = '';
  pageSize: number = 10;

  // ---- All cheques ----
  displayAllChequesDataBasedOnForm: any[] = [];
  displayAllChequesDataBasedOnFormTemp: any[] = [];

  // ---- Page ----
  totalElements: number = 0;
  page: Page = {
    totalElements: 0, pageSize: 10, pageNumber: 0,
    offset: 0, size: 10, totalPages: 0
  };
  startindex: number = 0;
  endindex: number = 10;
  modeofreceipt: string = 'ALL';
  _searchText: string = '';
  fromdate: any = '';
  todate: any = '';
  _countData: any = {};

  // ---- AutoBRS ----
  boolforAutoBrs: boolean = false;
  companydetails: any;
  auto_brs_type_name: string = 'Upload';
  saveAutoBrsBool: boolean = false;
  data: AOA = [['Date', 'UTR Number', 'amount', 'referencetext']];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'AutoBrs.xlsx';
  Exceldata: any[] = [];
  PreDefinedAutoBrsArrayData: any[] = [];

  // ---- Datepicker ----
  dpConfig: Partial<BsDatepickerConfig> = {};
  brsfromConfig: Partial<BsDatepickerConfig> = {};
  brstoConfig: Partial<BsDatepickerConfig> = {};

  // ---- BRS date constraints ----
  today: Date = new Date();
  clearMinToDate: Date = new Date(1900, 0, 1);
  returnMinToDate: Date = new Date(1900, 0, 1);
  cancelMinToDate: Date = new Date(1900, 0, 1);

  // ---- ng-select bank list ----
  bankList: any[] = [];
  selectedBankName: any;

  // ---- Bank file upload ----
  showBankUploadSection: boolean = false;

  constructor(
    private _accountingtransaction: AccountingTransactionsService,
    private _commonService: CommonService,
    private fb: FormBuilder,
    private datepipe: DatePipe
  ) {
    this.dpConfig.maxDate = new Date();
    this.dpConfig.dateInputFormat = 'DD-MMM-YYYY';
    this.brsfromConfig.dateInputFormat = 'DD-MMM-YYYY';
    this.brsfromConfig.maxDate = new Date();
    this.brstoConfig.dateInputFormat = 'DD-MMM-YYYY';
    this.brstoConfig.maxDate = new Date();
  }

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  ngOnInit(): void {
    this.pageSetUp();
    this.companydetails = JSON.parse(sessionStorage.getItem('companydetails') || '{}');
    this.currencySymbol = this._commonService.currencysymbol;

    this.ChequesIssuedForm = this.fb.group({
      ptransactiondate: [new Date(), Validators.required],
      bankname: [''],
      pfrombrsdate: [''],
      ptobrsdate: [''],
      pchequesOnHandlist: [],
      SearchClear: [''],
      pCreatedby: [''],
      schemaname: [this._commonService.getschemaname()],
      pipaddress: [this._commonService.getIpAddress()],
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

    this.bankid = 0;
    this.banknameshowhide = false;
    this.ChequesIssuedValidation = {};

    // Load banks for ng-select
    this._accountingtransaction.GetBankntList(
      this._commonService.getbranchname(),
      this._commonService.getschemaname(),
      this._commonService.getCompanyCode(),
      this._commonService.getBranchCode()
    ).subscribe((res: any) => {
      this.bankList = res?.banklist || res || [];
    });

    // Also load for the legacy BanksList dropdown
    this._accountingtransaction.GetBanksntList(
      this._commonService.getbranchname(),
      this._commonService.getschemaname(),
      this._commonService.getCompanyCode(),
      this._commonService.getBranchCode()
    ).subscribe({
      next: (banks: any) => (this.BanksList = banks || []),
      error: (err: any) => this._commonService.showErrorMessage(err)
    });

    this.setPageModel();
    this.setPageModel2();
    this.GetBankBalance(this.bankid);
    this.GetChequesIssued_Load(this.bankid);

    if (this.fromFormName === 'fromChequesStatusInformationForm') {
      this.tabsShowOrHideBasedOnfromFormName = false;
      this.showOrHideOtherChequesGrid = true;
      this.showOrHideAllChequesGrid = true;
      this.showOrHideChequesIssuedGrid = false;
    } else {
      this.tabsShowOrHideBasedOnfromFormName = true;
      this.showOrHideOtherChequesGrid = false;
      this.showOrHideAllChequesGrid = false;
      this.showOrHideChequesIssuedGrid = false;
    }

    this.boolforAutoBrs = this.companydetails?.pisautobrsimpsapplicable ?? true;
  }

  // ===========================================================================
  // Page model helpers
  // ===========================================================================

  setPageModel(): void {
    this.pageCriteria.pageSize = this._commonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }

  setPageModel2(): void {
    this.pageCriteria2.pageSize = this._commonService.pageSize;
    this.pageCriteria2.offset = 0;
    this.pageCriteria2.pageNumber = 1;
    this.pageCriteria2.footerPageHeight = 50;
  }

  onFooterPageChange(event: { page: number }): void {
    this.pageCriteria.offset = event.page - 1;
    this.pageCriteria.CurrentPage = event.page;
    if (this.pageCriteria.totalrows < event.page * this.pageCriteria.pageSize) {
      this.pageCriteria.currentPageRows = this.pageCriteria.totalrows % this.pageCriteria.pageSize;
    } else {
      this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
    }
  }

  change_date(_event: any): void {
    for (let i = 0; i < this.gridData.length; i++) {
      this.gridData[i].pdepositstatus = false;
      this.gridData[i].pcancelstatus = false;
      this.gridData[i].pchequestatus = 'N';
    }
  }

  pageSetUp(): void {
    this.page.offset = 0;
    this.page.pageNumber = 1;
    this.page.size = this._commonService.pageSize || 10;
    this.startindex = 0;
    this.endindex = this.page.size;
    this.page.totalElements = 5;
    this.page.totalPages = 1;
  }

  setPage(pageInfo: any, event: any): void {
    this.page.offset = event.page - 1;
    this.page.pageNumber = pageInfo.page;
    this.endindex = this.page.pageNumber * this.page.size;
    this.startindex = this.endindex - this.page.size;
    if (this.fromdate !== '' && this.todate !== '') {
      this.GetDataOnBrsDates1(this.fromdate, this.todate, this.bankid);
    } else {
      this.GetChequesIssued(this.bankid, this.startindex, this.page.size, '');
    }
  }

  // ===========================================================================
  // GetBankBalance
  // ===========================================================================

  GetBankBalance(bankid: any): void {
    this._accountingtransaction.GetBankBalance(
      this.datepipe.transform(new Date(), 'yyyy-MM-dd') || '',
      bankid,
      this._commonService.getbranchname(),
      this._commonService.getBranchCode(),
      this._commonService.getCompanyCode()
    ).subscribe((bankdetails: any) => {
      this.bankbalancedetails = bankdetails || { pfrombrsdate: null, ptobrsdate: null };

      if (this.bankid === 0) {
        const bal = this.bankbalancedetails._BankBalance ?? 0;
        if (bal < 0) { this.bankbalance = Math.abs(bal); this.bankbalancetype = 'Cr'; }
        else if (bal === 0) { this.bankbalance = 0; this.bankbalancetype = ''; }
        else { this.bankbalance = bal; this.bankbalancetype = 'Dr'; }
      }

      this.brsdate = this._commonService.getFormatDateGlobal(this.bankbalancedetails.ptobrsdate);

      this.ChequesIssuedForm.patchValue({
        pfrombrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate),
        ptobrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate)
      });
      this.BrsReturnForm.patchValue({
        frombrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate),
        tobrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate)
      });
      this.BrsCancelForm.patchValue({
        frombrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate),
        tobrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate)
      });

      // set initial minDate for To Date pickers
      const fromDateObj = this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate);
      if (fromDateObj) {
        this.clearMinToDate = fromDateObj;
        this.returnMinToDate = fromDateObj;
        this.cancelMinToDate = fromDateObj;
      }
    });
  }

  // ===========================================================================
  // ng-select bank change
  // ===========================================================================

  onBankChange(bank: any): void {
    if (!bank) {
      this.selectedBankName = '';
      this.bankname = '';
      this.bankbalance = 0;
      this.brsdate = '';
      this.bankid = 0;
      this.bankbalancedetails = { pfrombrsdate: null, ptobrsdate: null };
      this.gridData = [];
      return;
    }
    this.selectedBankName = bank.pdepositbankname;
    this.bankname = bank.pdepositbankname;
    this.bankid = bank.pbankid;

    const transactionDate = this.ChequesIssuedForm.value.ptransactiondate;
    const formattedDate = this.datepipe.transform(transactionDate, 'yyyy-MM-dd') || '';

    this._accountingtransaction.GetBankBalance(
      formattedDate, bank.pbankid,
      this._commonService.getbranchname(),
      this._commonService.getBranchCode(),
      this._commonService.getCompanyCode()
    ).subscribe((res: any) => {
      this.bankbalance = res?._BankBalance ?? 0;
      this.brsdate = res?.pfrombrsdate || '';
      this.bankbalancedetails = {
        pfrombrsdate: res?.pfrombrsdate || null,
        ptobrsdate: res?.ptobrsdate || null,
      };

      this.ChequesIssuedForm.patchValue({
        pfrombrsdate: this._commonService.getDateObjectFromDataBase(res?.pfrombrsdate),
        ptobrsdate: this._commonService.getDateObjectFromDataBase(res?.ptobrsdate)
      });
      this.BrsReturnForm.patchValue({
        frombrsdate: this._commonService.getDateObjectFromDataBase(res?.pfrombrsdate),
        tobrsdate: this._commonService.getDateObjectFromDataBase(res?.ptobrsdate)
      });
      this.BrsCancelForm.patchValue({
        frombrsdate: this._commonService.getDateObjectFromDataBase(res?.pfrombrsdate),
        tobrsdate: this._commonService.getDateObjectFromDataBase(res?.ptobrsdate)
      });

      const fromDateObj = this._commonService.getDateObjectFromDataBase(res?.pfrombrsdate);
      if (fromDateObj) {
        this.clearMinToDate = fromDateObj;
        this.returnMinToDate = fromDateObj;
        this.cancelMinToDate = fromDateObj;
      }
      this.GetChequesIssued_Load(this.bankid);
    });
  }

  // ===========================================================================
  // BRS From Date change handlers — updates minDate for To Date
  // ===========================================================================

  onClearFromDateChange(date: Date): void {
    if (date) {
      this.clearMinToDate = new Date(date);
      const toDate = this.ChequesIssuedForm.value.ptobrsdate;
      if (toDate && new Date(toDate) < new Date(date)) {
        this.ChequesIssuedForm.patchValue({ ptobrsdate: null });
      }
    }
  }

  onReturnFromDateChange(date: Date): void {
    if (date) {
      this.returnMinToDate = new Date(date);
      const toDate = this.BrsReturnForm.value.tobrsdate;
      if (toDate && new Date(toDate) < new Date(date)) {
        this.BrsReturnForm.patchValue({ tobrsdate: null });
      }
    }
  }

  onCancelFromDateChange(date: Date): void {
    if (date) {
      this.cancelMinToDate = new Date(date);
      const toDate = this.BrsCancelForm.value.tobrsdate;
      if (toDate && new Date(toDate) < new Date(date)) {
        this.BrsCancelForm.patchValue({ tobrsdate: null });
      }
    }
  }

  // ===========================================================================
  // Data loaders
  // ===========================================================================

  GetChequesIssued_Load(bankid: any): void {
    this.gridData = [];
    this.gridLoading = true;

    // FIX: API requires _BankId as integer (0 = all banks), NOT empty string.
    //      BrsFromDate / BrsTodate / searchtext must be non-empty — use 'NA' as placeholder
    //      so the API validator does not reject the request with 400.
    const safeBank     = (bankid !== null && bankid !== undefined && bankid !== '') ? Number(bankid) : 0;
    const safeFromDate = (this.fromdate   && this.fromdate   !== '') ? this.fromdate   : 'NA';
    const safeToDate   = (this.todate     && this.todate     !== '') ? this.todate     : 'NA';
    const safeSearch   = (this._searchText && this._searchText !== '') ? this._searchText : 'NA';

    forkJoin([
      this._accountingtransaction.GetChequesIssued(
        safeBank, safeFromDate, safeToDate,
        this._commonService.getbranchname(),
        this.startindex, this.endindex,
        this.modeofreceipt, safeSearch,
        this._commonService.getschemaname(),
        this._commonService.getBranchCode(),
        this._commonService.getCompanyCode()
      ),
      this._accountingtransaction.GetChequesRowCount(
        safeBank,
        this._commonService.getschemaname(),
        this._commonService.getbranchname(),
        safeSearch, safeFromDate, safeToDate,
        'CHEQUESISSUED', this.modeofreceipt,
        this._commonService.getCompanyCode(),
        this._commonService.getBranchCode()
      )
    ]).subscribe({
      next: ([data, count]: any) => {
        this.gridLoading = false;

        const data1: ChequesIssuedRow[] = (data?.pchequesOnHandlist || data?.pchequesOnHandlist || []);
        data1.forEach((i: any) => {
          i.preceiptdate = this._commonService.getFormatDateGlobal(i.preceiptdate);
        });
        this.ChequesIssuedData = data1;

        const retdata: ChequesIssuedRow[] = (data?.pchequesclearreturnlist || []);
        retdata.forEach((i: any) => {
          i.preceiptdate = this._commonService.getFormatDateGlobal(i.preceiptdate);
          i.pdepositeddate = this._commonService.getFormatDateGlobal(i.pdepositeddate);
        });
        this.ChequesClearReturnData = retdata;

        this.OtherChequesData = data?.pchequesotherslist || [];
        this.otherChequesCount = this.OtherChequesData.length;

        this._countData = count || {};
        this.CountOfRecords();

        if (this.status === 'all') { this.All(); }
        if (this.status === 'autobrs') { this.autoBrs(); }
        if (this.fromFormName === 'fromChequesStatusInformationForm') {
          this.chequesStatusInfoGridForChequesIssued();
        }

        this.totalElements = +(count?.total_count || 0);
        this.page.totalElements = this.totalElements;
        if (this.page.totalElements > 10) {
          this.page.totalPages = Math.ceil(this.page.totalElements / 10);
        }
      },
      error: (err: any) => { this.gridLoading = false; this._commonService.showErrorMessage(err); }
    });
  }

  GetChequesIssued(bankid: any, startindex: number, endindex: number, searchText: string): void {
    this.gridLoading = true;

    // FIX: same rules — bankid must be integer 0 when no bank, dates/search must be 'NA' not ''
    const safeBank2     = (bankid !== null && bankid !== undefined && bankid !== '') ? Number(bankid) : 0;
    const safeFromDate2 = (this.fromdate   && this.fromdate   !== '') ? this.fromdate   : 'NA';
    const safeToDate2   = (this.todate     && this.todate     !== '') ? this.todate     : 'NA';
    const safeSearch2   = (this._searchText && this._searchText !== '') ? this._searchText : 'NA';

    this._accountingtransaction.GetChequesIssued(
      safeBank2, safeFromDate2, safeToDate2,
      this._commonService.getbranchname(),
      startindex ?? 0, endindex ?? 10,
      this.modeofreceipt, safeSearch2,
      this._commonService.getschemaname(),
      this._commonService.getBranchCode(),
      this._commonService.getCompanyCode()
    ).subscribe({
      next: (data: any) => {
        this.gridLoading = false;

        this.ChequesIssuedData = data?.pchequesOnHandlist || [];
        this.ChequesClearReturnData = data?.pchequesclearreturnlist || [];
        this.OtherChequesData = data?.pchequesotherslist || [];
        this.otherChequesCount = this.OtherChequesData.length;

        if (this.status === 'all')           { this.All1(); }
        if (this.status === 'chequesissued') { this.ChequesIssued1(); }
        if (this.status === 'onlinepayment') { this.OnlinePayments1(); }
        if (this.status === 'cleared')       { this.Cleared1(); }
        if (this.status === 'returned')      { this.Returned1(); }
        if (this.status === 'cancelled')     { this.Cancelled1(); }

        if (this.status === 'autobrs') {
          this.showhidegridcolumns = false;
          this.showhidegridcolumns2 = true;
          this.saveshowhide = true;
          this.hiddendate = false;
        }
        if (this.fromFormName === 'fromChequesStatusInformationForm') {
          this.chequesStatusInfoGridForChequesIssued();
        }
      },
      error: (err: any) => { this.gridLoading = false; this._commonService.showErrorMessage(err); }
    });
  }

  // ===========================================================================
  // Search
  // ===========================================================================

  onSearch(event: any): void {
    const searchText = event?.toString() || '';
    this._searchText = searchText;

    if (this.fromFormName === 'fromChequesStatusInformationForm') {
      if (this.tabname === 'Other') {
        this.OtherChequesData = searchText
          ? this._commonService.transform(this.OtherChequesDataTemp, searchText, '')
          : this.OtherChequesDataTemp;
        this.pageCriteria.totalrows = this.OtherChequesData.length;
        this.pageCriteria.TotalPages = Math.ceil(this.pageCriteria.totalrows / this.pageCriteria.pageSize) || 1;
        this.pageCriteria.currentPageRows = Math.min(this.pageCriteria.pageSize, this.OtherChequesData.length);
      } else {
        this.displayAllChequesDataBasedOnForm = searchText
          ? this._commonService.transform(this.displayAllChequesDataBasedOnFormTemp, searchText, '')
          : this.displayAllChequesDataBasedOnFormTemp;
        this.pageCriteria.totalrows = this.displayAllChequesDataBasedOnForm.length;
        this.pageCriteria.TotalPages = Math.ceil(this.pageCriteria.totalrows / this.pageCriteria.pageSize) || 1;
        this.pageCriteria.currentPageRows = Math.min(this.pageCriteria.pageSize, this.displayAllChequesDataBasedOnForm.length);
      }
    } else {
      if (searchText !== '') {
        this.pageSetUp();
        this.GetChequesIssued_Load(this.bankid);
        this.gridData = this._commonService.transform(this.gridDatatemp, searchText, '');
      } else {
        this.pageSetUp();
        this.GetChequesIssued_Load(this.bankid);
        this.gridData = this.gridDatatemp;
      }
      this.amounttotal = this.gridData.reduce((sum: number, c: ChequesIssuedRow) => sum + (c.ptotalreceivedamount || 0), 0);
    }
  }

  // ===========================================================================
  // Tab methods
  // ===========================================================================

  private buildGrid(source: ChequesIssuedRow[]): ChequesIssuedRow[] {
    if (!this.bankid || this.bankid === 0) return source;
    return source.filter(r => r.pdepositbankid === this.bankid);
  }

  private buildGridByType(source: ChequesIssuedRow[], type: string, exclude = false): ChequesIssuedRow[] {
    return this.buildGrid(source).filter(r =>
      exclude ? r.ptypeofpayment !== type : r.ptypeofpayment === type);
  }

  private buildGridByChequeStatus(source: ChequesIssuedRow[], status: 'P' | 'R' | 'C'): ChequesIssuedRow[] {
    return this.buildGrid(source).filter(r => r.pchequestatus === status);
  }

  private applyGridData(grid: ChequesIssuedRow[]): void {
    this.gridData = JSON.parse(JSON.stringify(grid));
    this.gridDatatemp = this.gridData;
    this.showicons = this.gridData.length > 0;
    this.amounttotal = this.gridData.reduce((s, r) => s + (r.ptotalreceivedamount || 0), 0);
    this.dataTemp = JSON.parse(JSON.stringify(grid));
  }

  All(): void {
    this.fromdate = ''; this.todate = '';
    this.brsdateshowhidereturned = false;
    this.brsdateshowhidecleared = false;
    this.brsdateshowhidecancelled = false;
    this.showOrHideOtherChequesGrid = false;
    this.showOrHideAllChequesGrid = false;
    this.showOrHideChequesIssuedGrid = true;
    this.status = 'all'; this.pdfstatus = 'All'; this.modeofreceipt = 'ALL';
    this.fromFormName === 'fromChequesStatusInformationForm' ? this.GridColumnsHide() : this.GridColumnsShow();
    this.pageSetUp();
    this.GetChequesIssued(this.bankid, this.startindex, this.endindex, this._searchText);
    this.applyGridData(this.buildGrid(this.ChequesIssuedData));
    this.totalElements = this._countData['total_count'] || 0;
    this.page.totalElements = this.totalElements;
    if (this.page.totalElements > 10) this.page.totalPages = Math.ceil(this.page.totalElements / 10);
  }

  All1(): void {
    this.brsdateshowhidereturned = false; this.brsdateshowhidecleared = false; this.brsdateshowhidecancelled = false;
    this.showOrHideOtherChequesGrid = false; this.showOrHideAllChequesGrid = false; this.showOrHideChequesIssuedGrid = true;
    this.status = 'all'; this.pdfstatus = 'All'; this.modeofreceipt = 'ALL';
    this.fromFormName === 'fromChequesStatusInformationForm' ? this.GridColumnsHide() : this.GridColumnsShow();
    this.applyGridData(this.buildGrid(this.ChequesIssuedData));
  }

  ChequesIssued(): void {
    this.fromdate = ''; this.todate = '';
    this.brsdateshowhidereturned = false; this.brsdateshowhidecleared = false; this.brsdateshowhidecancelled = false;
    this.showOrHideOtherChequesGrid = false; this.showOrHideAllChequesGrid = false; this.showOrHideChequesIssuedGrid = true;
    this.status = 'chequesissued'; this.pdfstatus = 'Cheques Issued'; this.modeofreceipt = 'CHEQUE';
    this.fromFormName === 'fromChequesStatusInformationForm' ? this.GridColumnsHide() : this.GridColumnsShow();
    this.pageSetUp();
    this.GetChequesIssued(this.bankid, this.startindex, this.endindex, this._searchText);
    this.applyGridData(this.buildGridByType(this.ChequesIssuedData, 'CHEQUE'));
    this.totalElements = this._countData['cheques_count'] || 0;
    this.page.totalElements = this.totalElements;
    if (this.page.totalElements > 10) this.page.totalPages = Math.ceil(this.page.totalElements / 10);
  }

  ChequesIssued1(): void {
    this.brsdateshowhidereturned = false; this.brsdateshowhidecleared = false; this.brsdateshowhidecancelled = false;
    this.showOrHideOtherChequesGrid = false; this.showOrHideAllChequesGrid = false; this.showOrHideChequesIssuedGrid = true;
    this.status = 'chequesissued'; this.pdfstatus = 'Cheques Issued'; this.modeofreceipt = 'CHEQUE';
    this.fromFormName === 'fromChequesStatusInformationForm' ? this.GridColumnsHide() : this.GridColumnsShow();
    this.applyGridData(this.buildGridByType(this.ChequesIssuedData, 'CHEQUE'));
  }

  OnlinePayments(): void {
    this.fromdate = ''; this.todate = '';
    this.brsdateshowhidereturned = false; this.brsdateshowhidecleared = false; this.brsdateshowhidecancelled = false;
    this.showOrHideOtherChequesGrid = false; this.showOrHideAllChequesGrid = false; this.showOrHideChequesIssuedGrid = true;
    this.status = 'onlinepayment'; this.pdfstatus = 'Online Payments'; this.modeofreceipt = 'ONLINE';
    this.fromFormName === 'fromChequesStatusInformationForm' ? this.GridColumnsHide() : this.GridColumnsShow();
    this.pageSetUp();
    this.GetChequesIssued(this.bankid, this.startindex, this.endindex, this._searchText);
    this.applyGridData(this.buildGridByType(this.ChequesIssuedData, 'CHEQUE', true));
    this.totalElements = this._countData['others_count'] || 0;
    this.page.totalElements = this.totalElements;
    if (this.page.totalElements > 10) this.page.totalPages = Math.ceil(this.page.totalElements / 10);
  }

  OnlinePayments1(): void {
    this.brsdateshowhidereturned = false; this.brsdateshowhidecleared = false; this.brsdateshowhidecancelled = false;
    this.showOrHideOtherChequesGrid = false; this.showOrHideAllChequesGrid = false; this.showOrHideChequesIssuedGrid = true;
    this.status = 'onlinepayment'; this.pdfstatus = 'Online Payments'; this.modeofreceipt = 'ONLINE';
    this.fromFormName === 'fromChequesStatusInformationForm' ? this.GridColumnsHide() : this.GridColumnsShow();
    this.applyGridData(this.buildGridByType(this.ChequesIssuedData, 'CHEQUE', true));
  }

  Cleared(): void {
    if (!this.bankid || this.bankid === 0) {
      this._commonService.showWarningMessage('Please Select Bank first'); return;
    }
    this.fromdate = ''; this.todate = '';
    this.today = new Date(); this.clearMinToDate = new Date(1900, 0, 1);
    this.datetitle = 'Cleared Date'; this.status = 'cleared'; this.activeTab = 'cleared';
    this.pdfstatus = 'Cleared'; this.modeofreceipt = 'CLEAR';
    this.showOrHideOtherChequesGrid = false; this.showOrHideAllChequesGrid = false; this.showOrHideChequesIssuedGrid = true;
    this.brsdateshowhidecleared = true; this.brsdateshowhidereturned = false; this.brsdateshowhidecancelled = false;
    this.GridColumnsHide();
    this.ChequesIssuedForm.patchValue({
      pfrombrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails?.pfrombrsdate),
      ptobrsdate:   this._commonService.getDateObjectFromDataBase(this.bankbalancedetails?.ptobrsdate)
    });
    const fromDateObj = this._commonService.getDateObjectFromDataBase(this.bankbalancedetails?.pfrombrsdate);
    if (fromDateObj) this.clearMinToDate = fromDateObj;
    this.pageSetUp();
    this.GetChequesIssued(this.bankid, this.startindex, this.endindex, this._searchText);
    this.applyGridData(this.buildGridByChequeStatus(this.ChequesClearReturnData, 'P'));
    this.totalElements = this._countData['clear_count'] || 0;
    this.page.totalElements = this.totalElements;
    if (this.page.totalElements > 10) this.page.totalPages = Math.ceil(this.page.totalElements / 10);
  }

  Cleared1(): void {
    this.datetitle = 'Cleared Date'; this.status = 'cleared'; this.pdfstatus = 'Cleared'; this.modeofreceipt = 'CLEAR';
    this.showOrHideOtherChequesGrid = false; this.showOrHideAllChequesGrid = false; this.showOrHideChequesIssuedGrid = true;
    this.brsdateshowhidecleared = true; this.brsdateshowhidereturned = false; this.brsdateshowhidecancelled = false;
    this.GridColumnsHide();
    this.ChequesIssuedForm.patchValue({
      pfrombrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails?.pfrombrsdate),
      ptobrsdate:   this._commonService.getDateObjectFromDataBase(this.bankbalancedetails?.ptobrsdate)
    });
    this.applyGridData(this.buildGridByChequeStatus(this.ChequesClearReturnData, 'P'));
  }

  Returned(): void {
    if (!this.bankid || this.bankid === 0) {
      this._commonService.showWarningMessage('Please Select Bank first'); return;
    }
    this.fromdate = ''; this.todate = '';
    this.today = new Date(); this.returnMinToDate = new Date(1900, 0, 1);
    this.datetitle = 'Returned Date'; this.status = 'returned'; this.activeTab = 'returned';
    this.pdfstatus = 'Returned'; this.modeofreceipt = 'RETURN';
    this.showOrHideOtherChequesGrid = false; this.showOrHideAllChequesGrid = false; this.showOrHideChequesIssuedGrid = true;
    this.brsdateshowhidereturned = true; this.brsdateshowhidecleared = false; this.brsdateshowhidecancelled = false;
    this.GridColumnsHide();
    this.BrsReturnForm.patchValue({
      frombrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails?.pfrombrsdate),
      tobrsdate:   this._commonService.getDateObjectFromDataBase(this.bankbalancedetails?.ptobrsdate)
    });
    const fromDateObj = this._commonService.getDateObjectFromDataBase(this.bankbalancedetails?.pfrombrsdate);
    if (fromDateObj) this.returnMinToDate = fromDateObj;
    this.pageSetUp();
    this.GetChequesIssued(this.bankid, this.startindex, this.endindex, this._searchText);
    this.applyGridData(this.buildGridByChequeStatus(this.ChequesClearReturnData, 'R'));
    this.totalElements = this._countData['return_count'] || 0;
    this.page.totalElements = this.totalElements;
    if (this.page.totalElements > 10) this.page.totalPages = Math.ceil(this.page.totalElements / 10);
  }

  Returned1(): void {
    this.datetitle = 'Returned Date'; this.status = 'returned'; this.pdfstatus = 'Returned'; this.modeofreceipt = 'RETURN';
    this.showOrHideOtherChequesGrid = false; this.showOrHideAllChequesGrid = false; this.showOrHideChequesIssuedGrid = true;
    this.brsdateshowhidereturned = true; this.brsdateshowhidecleared = false; this.brsdateshowhidecancelled = false;
    this.GridColumnsHide();
    this.BrsReturnForm.patchValue({
      frombrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails?.pfrombrsdate),
      tobrsdate:   this._commonService.getDateObjectFromDataBase(this.bankbalancedetails?.ptobrsdate)
    });
    this.applyGridData(this.buildGridByChequeStatus(this.ChequesClearReturnData, 'R'));
  }

  Cancelled(): void {
    if (!this.bankid || this.bankid === 0) {
      this._commonService.showWarningMessage('Please Select Bank first'); return;
    }
    this.fromdate = ''; this.todate = '';
    this.today = new Date(); this.cancelMinToDate = new Date(1900, 0, 1);
    this.datetitle = 'Cancelled Date'; this.status = 'cancelled'; this.activeTab = 'cancelled';
    this.pdfstatus = 'Cancelled'; this.modeofreceipt = 'CANCEL'; this.tabname = 'Cancelled';
    this.showOrHideOtherChequesGrid = false; this.showOrHideAllChequesGrid = false; this.showOrHideChequesIssuedGrid = true;
    this.brsdateshowhidereturned = false; this.brsdateshowhidecleared = false; this.brsdateshowhidecancelled = true;
    this.GridColumnsHide();
    this.BrsCancelForm.patchValue({
      frombrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails?.pfrombrsdate),
      tobrsdate:   this._commonService.getDateObjectFromDataBase(this.bankbalancedetails?.ptobrsdate)
    });
    const fromDateObj = this._commonService.getDateObjectFromDataBase(this.bankbalancedetails?.pfrombrsdate);
    if (fromDateObj) this.cancelMinToDate = fromDateObj;
    this.pageSetUp();
    this.GetChequesIssued(this.bankid, this.startindex, this.endindex, this._searchText);
    this.applyGridData(this.buildGridByChequeStatus(this.ChequesClearReturnData, 'C'));
    this.totalElements = this._countData['cancel_count'] || 0;
    this.page.totalElements = this.totalElements;
    if (this.page.totalElements > 10) this.page.totalPages = Math.ceil(this.page.totalElements / 10);
  }

  Cancelled1(): void {
    this.datetitle = 'Cancelled Date'; this.status = 'cancelled'; this.pdfstatus = 'Cancelled';
    this.modeofreceipt = 'CANCEL'; this.tabname = 'Cancelled';
    this.showOrHideOtherChequesGrid = false; this.showOrHideAllChequesGrid = false; this.showOrHideChequesIssuedGrid = true;
    this.brsdateshowhidereturned = false; this.brsdateshowhidecleared = false; this.brsdateshowhidecancelled = true;
    this.GridColumnsHide();
    this.BrsCancelForm.patchValue({
      frombrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails?.pfrombrsdate),
      tobrsdate:   this._commonService.getDateObjectFromDataBase(this.bankbalancedetails?.ptobrsdate)
    });
    this.applyGridData(this.buildGridByChequeStatus(this.ChequesClearReturnData, 'C'));
  }

  otherCheques(): void {
    this._accountingtransaction.DataFromBrsDatesForOtherChequesDetails(null, null, this.bankid).subscribe({
      next: (data: any) => {
        this.tabname = 'OtherCheques';
        this.OtherChequesData = data['pchequesotherslist'] || [];
        this.OtherChequesDataTemp = [...this.OtherChequesData];
        this.otherChequesCount = this.OtherChequesData.length;
        this.showOrHideOtherChequesGrid = true;
        this.showOrHideAllChequesGrid = false;
        this.showOrHideChequesIssuedGrid = false;
        this.brsdateshowhidereturned = false;
        this.brsdateshowhidecleared = false;
        this.brsdateshowhidecancelled = true;
        this.pageCriteria.totalrows = this.OtherChequesData.length;
        this.pageCriteria.TotalPages = Math.ceil(this.pageCriteria.totalrows / this.pageCriteria.pageSize) || 1;
        this.pageCriteria.currentPageRows = Math.min(this.pageCriteria.pageSize, this.OtherChequesData.length);
      },
      error: (err: any) => this._commonService.showErrorMessage(err)
    });
  }

  allCheques(): void {
    this.showOrHideOtherChequesGrid = false;
    this.showOrHideAllChequesGrid = true;
    this.showOrHideChequesIssuedGrid = false;
    this.brsdateshowhidereturned = false; this.brsdateshowhidecleared = false; this.brsdateshowhidecancelled = false;
    this.chequesStatusInfoGridForChequesIssued();
  }

  autoBrs(): void {
    this.gridDatatemp = [];
    this.gridData = [...this.ChequesIssuedData];
    this.dataTemp = JSON.parse(JSON.stringify(this.gridData));
    this.gridData.forEach(element => {
      element.pdepositstatus = true;
      element.pchequestatus = 'P';
    });
    this.amounttotal = this.gridData.reduce((s: number, r: ChequesIssuedRow) => s + (r.ptotalreceivedamount || 0), 0);
    this.totalElements = this._countData['cheques_count'] || 0;
    this.page.totalElements = this.totalElements;
    if (this.page.totalElements > 10) this.page.totalPages = Math.ceil(this.page.totalElements / 10);
  }

  GridColumnsShow(): void {
    this.showhidegridcolumns = false;
    this.showhidegridcolumns2 = false;
    this.brsdateshowhidecleared = false;
    this.brsdateshowhidereturned = false;
    this.brsdateshowhidecancelled = false;
    this.saveshowhide = true;
    this.hiddendate = true;
  }

  GridColumnsHide(): void {
    this.showhidegridcolumns = true;
    this.saveshowhide = false;
    this.hiddendate = false;
  }

  SelectBank(event: any): void {
    const value = event?.target?.value;
    if (!value) {
      this.bankid = 0;
      this.bankname = '';
      this.banknameshowhide = false;
      this.bankbalancedetails = { pfrombrsdate: null, ptobrsdate: null };
    } else {
      this.banknameshowhide = true;
      this.bankdetails = this.BanksList.find((b: any) => b.pdepositbankname === value);
      this.bankid = this.bankdetails?.pbankid;
      this.bankname = this.bankdetails?.pdepositbankname;
      const bal = this.bankdetails?.pbankbalance ?? 0;
      this.bankbalance = bal < 0 ? Math.abs(bal) : bal;
      this.bankbalancetype = bal < 0 ? 'Cr' : bal === 0 ? '' : 'Dr';
    }
    this.GetChequesIssued_Load(this.bankid);
    if (this.status === 'all')           { this.All(); }
    if (this.status === 'chequesissued') { this.ChequesIssued(); }
    if (this.status === 'onlinepayment') { this.OnlinePayments(); }
    if (this.status === 'cleared')       { this.Cleared(); }
    if (this.status === 'returned')      { this.Returned(); }
    if (this.status === 'cancelled')     { this.Cancelled(); }
    this.ChequesIssuedForm.patchValue({ SearchClear: '' });
  }

  CountOfRecords(): void {
    this.all           = this._countData['total_count']   || 0;
    this.onlinepayments = this._countData['others_count']  || 0;
    this.chequesissued  = this._countData['cheques_count'] || 0;
    this.cleared        = this._countData['clear_count']   || 0;
    this.returned       = this._countData['return_count']  || 0;
    this.cancelled      = this._countData['cancel_count']  || 0;
  }

  // ===========================================================================
  // BRS Date methods
  // ===========================================================================

  OnBrsDateChanges(fromdate: any, todate: any): void {
    this.validate = new Date(fromdate).setHours(0,0,0,0) > new Date(todate).setHours(0,0,0,0);
  }

  ShowBrsClear(): void {
    this.gridData = []; this.cleared = 0; this._searchText = '';
    const fromdate = this.ChequesIssuedForm.controls['pfrombrsdate'].value;
    const todate   = this.ChequesIssuedForm.controls['ptobrsdate'].value;
    if (fromdate != null && todate != null) {
      this.OnBrsDateChanges(fromdate, todate);
      if (!this.validate) {
        this.fromdate = this._commonService.getFormatDateGlobal(fromdate);
        this.todate   = this._commonService.getFormatDateGlobal(todate);
        this.validatebrsdateclear = false;
        this.pageSetUp();
        this.GetDataOnBrsDates(this.fromdate, this.todate, this.bankid);
      } else {
        this.validatebrsdateclear = true;
      }
    } else {
      this._commonService.showWarningMessage('select fromdate and todate');
    }
  }

  ShowBrsReturn(): void {
    this.gridData = []; this.returned = 0; this._searchText = '';
    const fromdate = this.BrsReturnForm.controls['frombrsdate'].value;
    const todate   = this.BrsReturnForm.controls['tobrsdate'].value;
    if (fromdate != null && todate != null) {
      this.OnBrsDateChanges(fromdate, todate);
      if (!this.validate) {
        this.fromdate = this._commonService.getFormatDateGlobal(fromdate);
        this.todate   = this._commonService.getFormatDateGlobal(todate);
        this.validatebrsdatereturn = false;
        this.pageSetUp();
        this.GetDataOnBrsDates(this.fromdate, this.todate, this.bankid);
      } else {
        this.validatebrsdatereturn = true;
      }
    } else {
      this._commonService.showWarningMessage('select fromdate and todate');
    }
  }

  ShowBrsCancel(): void {
    this._searchText = '';
    const fromdate = this.BrsCancelForm.controls['frombrsdate'].value;
    const todate   = this.BrsCancelForm.controls['tobrsdate'].value;
    if (fromdate != null && todate != null) {
      this.OnBrsDateChanges(fromdate, todate);
      if (!this.validate) {
        this.fromdate = this._commonService.getFormatDateGlobal(fromdate);
        this.todate   = this._commonService.getFormatDateGlobal(todate);
        this.validatebrsdatecancel = false;
        if (this.tabname === 'Cancelled') {
          this.gridData = []; this.cancelled = 0;
          this.pageSetUp();
          this.GetDataOnBrsDates(this.fromdate, this.todate, this.bankid);
        } else if (this.tabname === 'OtherCheques') {
          this.GetDataOnBrsDatesForOtherCheques(this.fromdate, this.todate, this.bankid);
        }
      } else {
        this.validatebrsdatecancel = true;
      }
    } else {
      this._commonService.showWarningMessage('select fromdate and todate');
    }
  }

  Clear(): void {
    this.ChequesIssuedForm.reset();
    this.ChequesIssuedValidation = {};
    this.ngOnInit();
  }

  // ===========================================================================
  // BRS Data loaders
  // ===========================================================================

  GetDataOnBrsDates(frombrsdate: any, tobrsdate: any, bankid: any): void {
    forkJoin([
      this._accountingtransaction.DataFromBrsDatesChequesIssued(
        frombrsdate, tobrsdate, (bankid !== null && bankid !== undefined && bankid !== '') ? Number(bankid) : 0,
        this.modeofreceipt,
        this._searchText || 'NA', this.startindex, this.endindex),
      this._accountingtransaction.GetChequesRowCount(
        (bankid !== null && bankid !== undefined && bankid !== '') ? Number(bankid) : 0,
        this._commonService.getschemaname(),
        this._commonService.getbranchname(),
        this._searchText, frombrsdate, tobrsdate,
        'CHEQUESISSUED', '',
        this._commonService.getCompanyCode(),
        this._commonService.getBranchCode())
    ]).subscribe({
      next: ([clearreturndata, countdata]: any) => {
        const list: ChequesIssuedRow[] = clearreturndata['pchequesclearreturnlist'] || [];
        const kk = list.filter((r: ChequesIssuedRow) =>
          (this.status === 'cleared'   && r.pchequestatus === 'P') ||
          (this.status === 'cancelled' && r.pchequestatus === 'C') ||
          (this.status === 'returned'  && r.pchequestatus === 'R')
        ).map((d: ChequesIssuedRow) => ({
          ...d,
          preceiptdate:   this._commonService.getFormatDateGlobal(d.preceiptdate),
          pdepositeddate: this._commonService.getFormatDateGlobal(d.pdepositeddate)
        }));
        this._countData = countdata;
        this.CountOfRecords();
        this.gridData = kk;
        const key = this.status === 'cleared' ? 'clear_count' : this.status === 'returned' ? 'return_count' : 'cancel_count';
        this.totalElements = this._countData[key] || 0;
        this.page.totalElements = this.totalElements;
        if (this.page.totalElements > 10) this.page.totalPages = Math.ceil(this.page.totalElements / 10);
      },
      error: (err: any) => this._commonService.showErrorMessage(err)
    });
  }

  GetDataOnBrsDates1(frombrsdate: any, tobrsdate: any, bankid: any): void {
    this._accountingtransaction.DataFromBrsDatesChequesIssued(
      frombrsdate, tobrsdate,
      (bankid !== null && bankid !== undefined && bankid !== '') ? Number(bankid) : 0,
      this.modeofreceipt,
      this._searchText || 'NA', this.startindex, this.endindex
    ).subscribe({
      next: (clearreturndata: any) => {
        const list: ChequesIssuedRow[] = clearreturndata['pchequesclearreturnlist'] || [];
        this.gridData = list.filter((r: ChequesIssuedRow) =>
          (this.status === 'cleared'   && r.pchequestatus === 'P') ||
          (this.status === 'cancelled' && r.pchequestatus === 'C') ||
          (this.status === 'returned'  && r.pchequestatus === 'R')
        ).map((d: ChequesIssuedRow) => ({
          ...d,
          preceiptdate:   this._commonService.getFormatDateGlobal(d.preceiptdate),
          pdepositeddate: this._commonService.getFormatDateGlobal(d.pdepositeddate)
        }));
      },
      error: (err: any) => this._commonService.showErrorMessage(err)
    });
  }

  GetDataOnBrsDatesForOtherCheques(frombrsdate: any, tobrsdate: any, bankid: any): void {
    this._accountingtransaction.DataFromBrsDatesForOtherChequesDetails(frombrsdate, tobrsdate, (bankid !== null && bankid !== undefined && bankid !== '') ? Number(bankid) : 0).subscribe({
      next: (data: any) => {
        this.OtherChequesData = (data['pchequesotherslist'] || []).map((x: any) => ({ ...x, preferencetext: '' }));
        this.otherChequesCount = this.OtherChequesData.length;
        this.pageCriteria.totalrows = this.OtherChequesData.length;
        this.pageCriteria.TotalPages = Math.ceil(this.pageCriteria.totalrows / this.pageCriteria.pageSize) || 1;
        this.pageCriteria.currentPageRows = Math.min(this.pageCriteria.pageSize, this.OtherChequesData.length);
      },
      error: (err: any) => this._commonService.showErrorMessage(err)
    });
  }

  // ===========================================================================
  // Checkbox handlers
  // ===========================================================================

  checkedClear(event: any, data: ChequesIssuedRow): void {
    const receiptdate     = this._commonService.getDateObjectFromDataBase(data.preceiptdate);
    const transactiondate = this.ChequesIssuedForm.controls['ptransactiondate'].value;
    if (event.target.checked) {
      if (receiptdate && transactiondate >= receiptdate) {
        data.pdepositstatus = true; data.preturnstatus = false;
        data.pcancelstatus = false; data.pchequestatus = 'P';
      } else {
        data.pclearstatus = false; data.pchequestatus = 'N';
        event.target.checked = false;
        this._commonService.showWarningMessage('Transaction Date Should be Greater than Payment Date');
      }
    } else {
      data.pdepositstatus = false; data.pclearstatus = false; data.pchequestatus = 'N';
    }
    this.gridData = [...this.gridData];
  }

  checkedReturn(event: any, data: ChequesIssuedRow): void {
    const receiptdate     = this._commonService.getDateObjectFromDataBase(data.preceiptdate);
    const transactiondate = this.ChequesIssuedForm.controls['ptransactiondate'].value;
    if (event.target.checked) {
      if (receiptdate && transactiondate >= receiptdate) {
        data.preturnstatus = true; data.pcancelstatus = false;
        data.pdepositstatus = false; data.pchequestatus = 'R';
      } else {
        data.pclearstatus = false; data.preturnstatus = false; data.pchequestatus = 'N';
        event.target.checked = false;
        this._commonService.showWarningMessage('Transaction Date Should be Greater than Payment Date');
      }
    } else {
      data.preturnstatus = false; data.pchequestatus = 'N';
    }
    this.gridData = [...this.gridData];
  }

  checkedCancel(event: any, data: ChequesIssuedRow): void {
    const receiptdate     = this._commonService.getDateObjectFromDataBase(data.preceiptdate);
    const transactiondate = this.ChequesIssuedForm.controls['ptransactiondate'].value;
    if (event.target.checked) {
      if (receiptdate && transactiondate >= receiptdate) {
        data.pcancelstatus = true; data.pdepositstatus = false;
        data.preturnstatus = false; data.pchequestatus = 'C';
      } else {
        data.pclearstatus = false; data.preturnstatus = false;
        data.pcancelstatus = false; data.pchequestatus = 'N';
        event.target.checked = false;
        this._commonService.showWarningMessage('Transaction Date Should be Greater than Payment Date');
      }
    } else {
      data.pcancelstatus = false; data.pchequestatus = 'N';
    }
    this.gridData = [...this.gridData];
  }

  // ===========================================================================
  // Validation helpers
  // ===========================================================================

  checkValidations(group: FormGroup, isValid: boolean): boolean {
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      });
    } catch (e: any) { this.showErrorMessage(e); return false; }
    return isValid;
  }

  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    try {
      const formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid);
        } else if (formcontrol.validator) {
          this.ChequesIssuedValidation[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            const el = document.getElementById(key) as HTMLInputElement;
            const lablename = el ? el.title : key;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                const errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.ChequesIssuedValidation[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    } catch (e: any) { this.showErrorMessage(e); return false; }
    return isValid;
  }

  showErrorMessage(errormsg: string): void {
    this._commonService.showErrorMessage(errormsg);
  }

  BlurEventAllControll(fromgroup: FormGroup): boolean {
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      });
    } catch (e: any) { this.showErrorMessage(e); return false; }
    return true;
  }

  setBlurEvent(fromgroup: FormGroup, key: string): boolean {
    try {
      const formcontrol = fromgroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.BlurEventAllControll(formcontrol);
        } else if (formcontrol.validator) {
          fromgroup.get(key)!.valueChanges.subscribe(() => {
            this.GetValidationByControl(fromgroup, key, true);
          });
        }
      }
    } catch (e: any) { this.showErrorMessage(e); return false; }
    return true;
  }

  // ===========================================================================
  // Save
  // ===========================================================================

  Save(): void {
    const duplicatesbool   = this.validateDuplicates();
    const isemptyvalues    = this.emptyValuesFound();
    const selectrecords    = this.gridData.filter(e => e.pchequestatus === 'P' || e.pchequestatus === 'R');
    const isCancelstatus   = this.gridData.filter(e => e.pcancelstatus === true);
    let isValid = true;

    if (this.status !== 'autobrs') {
      if (!this.showhidegridcolumns) {
        if (duplicatesbool > 0) {
          this._commonService.showWarningMessage('Duplicates Found please enter unique values'); isValid = false;
        } else if (isemptyvalues) {
          this._commonService.showWarningMessage('Please enter all input fields!'); isValid = false;
        } else if (selectrecords.length === 0) {
          if (isCancelstatus.length > 0) { isValid = true; }
          else { this._commonService.showWarningMessage('Please Select records'); isValid = false; }
        }
      }
    }

    if (isValid && confirm('Do You Want To Save ?')) {
      this.DataForSaving = [];
      if (this.checkValidations(this.ChequesIssuedForm, isValid)) {
        this.buttonname = 'Processing'; this.disablesavebutton = true;
        this.gridData.forEach((row: ChequesIssuedRow, i: number) => {
          if (row.pchequestatus === 'P' || row.pchequestatus === 'R' || row.pchequestatus === 'C') {
            if (i < this.dataTemp.length) this.dataTemp[i].pchequestatus = row.pchequestatus;
            this.DataForSaving.push(row);
          }
        });

        if (this.DataForSaving.length !== 0) {
          this.DataForSaving.forEach((item: ChequesIssuedRow) => {
            item.pCreatedby   = this._commonService.getCreatedBy();
            item.pipaddress   = this._commonService.getIpAddress();
            item.preferencetext = (item.preferencetext || '') + '-' + new Date().getFullYear().toString();
          });

          this.ChequesIssuedForm.patchValue({ pchequesOnHandlist: this.DataForSaving });
          const chequesissueddata: any = { ...this.ChequesIssuedForm.value };
          chequesissueddata.ptransactiondate = this._commonService.getFormatDateNormal(chequesissueddata.ptransactiondate);
          chequesissueddata.pCreatedby = this._commonService.getCreatedBy();

          this._accountingtransaction.SaveChequesIssued(JSON.stringify(chequesissueddata)).subscribe({
            next: (data: any) => {
              if (data) { this._commonService.showSuccessMsg('Saved successfully'); this.Clear(); }
              this.disablesavebutton = false; this.buttonname = 'Save';
            },
            error: (err: any) => {
              this._commonService.showErrorMessage(err);
              this.disablesavebutton = false; this.buttonname = 'Save'; this.Clear();
            }
          });
        } else {
          this._commonService.showWarningMessage('Select atleast one record');
          this.disablesavebutton = false; this.buttonname = 'Save';
        }
      }
    }
  }

  // ===========================================================================
  // Info grid
  // ===========================================================================

  chequesStatusInfoGridForChequesIssued(): void {
    this.showOrHideOtherChequesGrid = false;
    this.showOrHideAllChequesGrid = true;
    this.showOrHideChequesIssuedGrid = false;

    const grid: any[] = [
      ...this.ChequesIssuedData.filter(r => r.ptypeofpayment === 'CHEQUE').map(r => ({ ...r, chequeStatus: 'Cheques Issued' })),
      ...this.ChequesClearReturnData.filter(r => r.pchequestatus === 'P').map(r => ({ ...r, chequeStatus: 'Cleared' })),
      ...this.ChequesClearReturnData.filter(r => r.pchequestatus === 'R').map(r => ({ ...r, chequeStatus: 'Returned' })),
      ...this.ChequesClearReturnData.filter(r => r.pchequestatus === 'C').map(r => ({ ...r, chequeStatus: 'Cancelled' }))
    ];

    this.displayAllChequesDataBasedOnForm = grid;
    this.displayAllChequesDataBasedOnFormTemp = JSON.parse(JSON.stringify(grid));
    this.setPageModel();
    this.pageCriteria.totalrows = grid.length;
    this.pageCriteria.TotalPages = Math.ceil(grid.length / this.pageCriteria.pageSize) || 1;
    this.pageCriteria.currentPageRows = Math.min(grid.length, this.pageCriteria.pageSize);
  }

  // ===========================================================================
  // PDF / Export
  // ===========================================================================

  pdfOrprint(printorpdf: string): void {
    forkJoin([
      this._accountingtransaction.GetChequesIssued(
        this.bankid ? Number(this.bankid) : 0, 'NA', 'NA', this._commonService.getbranchname(),
        0, 999999, this.modeofreceipt, this._searchText || 'NA',
        this._commonService.getschemaname(),
        this._commonService.getBranchCode(), this._commonService.getCompanyCode()),
      this._accountingtransaction.DataFromBrsDatesChequesIssued(
        this.fromdate || 'NA', this.todate || 'NA',
        this.bankid ? Number(this.bankid) : 0,
        this.modeofreceipt, this._searchText || 'NA', 0, 99999)
    ]).subscribe(([result0, result1]: any) => {
      const isCRC = ['Cleared', 'Returned', 'Cancelled'].includes(this.pdfstatus);
      const gridData: any[] = isCRC ? result1['pchequesclearreturnlist'] : result0.pchequesOnHandlist;
      const rows: any[] = [];

      gridData.forEach((element: any) => {
        const datereceipt = this._commonService.getFormatDateGlobal(element.preceiptdate);
        let depositeddate = this._commonService.getFormatDateGlobal(element.pdepositeddate);
        if (!depositeddate) depositeddate = '--NA--';
        let totalreceivedamt = '';
        if (element.ptotalreceivedamount) {
          totalreceivedamt = this._commonService.convertAmountToPdfFormat(
            this._commonService.currencyformat(element.ptotalreceivedamount));
        }
        const temp = isCRC
          ? [element.pChequenumber, totalreceivedamt, element.preceiptid, datereceipt, depositeddate, element.ptypeofpayment, element.ppartyname]
          : [element.pChequenumber, totalreceivedamt, element.preceiptid, datereceipt, element.ptypeofpayment, element.ppartyname];
        rows.push(temp);
      });

      const amounttotal = this._commonService.convertAmountToPdfFormat(
        this._commonService.currencyformat(this.amounttotal));
      this._commonService._downloadchequesReportsPdf(
        'Cheques Issued', rows, [], {}, 'landscape', '', '', '', printorpdf, amounttotal);
    });
  }

  export(): void {
    forkJoin([
      this._accountingtransaction.GetChequesIssued(
        this.bankid ? Number(this.bankid) : 0, 'NA', 'NA', this._commonService.getbranchname(),
        0, 999999, this.modeofreceipt, this._searchText || 'NA',
        this._commonService.getschemaname(),
        this._commonService.getBranchCode(), this._commonService.getCompanyCode()),
      this._accountingtransaction.DataFromBrsDatesChequesIssued(
        this.fromdate || 'NA', this.todate || 'NA',
        this.bankid ? Number(this.bankid) : 0,
        this.modeofreceipt, this._searchText || 'NA', 0, 99999)
    ]).subscribe(([result0, result1]: any) => {
      const isCRC = ['Cleared', 'Returned', 'Cancelled'].includes(this.pdfstatus);
      const gridData: any[] = isCRC ? result1['pchequesclearreturnlist'] : result0.pchequesOnHandlist;
      const rows: any[] = [];

      gridData.forEach((element: any) => {
        const datereceipt   = this._commonService.getFormatDateGlobal(element.preceiptdate);
        const depositeddate = this._commonService.getFormatDateGlobal(element.pdepositeddate) || '--NA--';
        const totalreceivedamt = element.ptotalreceivedamount || '';
        let dataobject: any;
        if (isCRC) {
          dataobject = {
            'Cheque/ Reference No.': element.pChequenumber,
            'Amount': totalreceivedamt,
            'Payment Id': element.preceiptid,
            'Payment Date': datereceipt,
            [`${this.pdfstatus} Date`]: depositeddate,
            'Transaction Mode': element.ptypeofpayment,
            'Party': element.ppartyname
          };
        } else {
          dataobject = {
            'Cheque/ Reference No.': element.pChequenumber,
            'Amount': totalreceivedamt,
            'Payment Id': element.preceiptid,
            'Payment Date': datereceipt,
            'Transaction Mode': element.ptypeofpayment,
            'Party': element.ppartyname
          };
        }
        rows.push(dataobject);
      });
      this._commonService.exportAsExcelFile(rows, 'Cheques Issued');
    });
  }

  // ===========================================================================
  // Duplicate / empty checks
  // ===========================================================================

  checkDuplicateValues(_event: any, rowIndex: number, row: any): void {
    const value = _event?.target?.value || '';
    const bool = this.gridData.filter(item => item.pchequestatus === 'P').some(element => {
      if (value && element.preferencetext) {
        return element.preferencetext.toString().toLowerCase() === value.toString().toLowerCase();
      }
      return false;
    });
    if (bool) {
      this._commonService.showWarningMessage('Already Exist');
      this.gridData[rowIndex].preferencetext = '';
    } else {
      row.preferencetext = value;
    }
    this.gridData = [...this.gridData];
  }

  checkDuplicateValueslatest(_event: any, rowIndex: number, row: any): void {
    const value = _event?.target?.value || '';
    let count = 0;
    this.gridData.filter(item => item.preturnstatus === true || item.pdepositstatus === true)
      .forEach((element: ChequesIssuedRow) => {
        if (value && element.preferencetext &&
          element.preferencetext.toString().toLowerCase() === value.toString().toLowerCase() &&
          element.pChequenumber !== row.pChequenumber) {
          count += 1;
        } else {
          row.preferencetext = value;
          count = 0;
        }
      });
    if (count > 0) { this._commonService.showWarningMessage('Already Exist'); }
    this.gridData = [...this.gridData];
  }

  validateDuplicates(): number {
    const arr = this.gridData.filter(e => e.pchequestatus === 'P' || e.pchequestatus === 'R');
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let k = 0; k < arr.length; k++) {
        if (arr[i].pChequenumber !== arr[k].pChequenumber &&
          arr[i].preferencetext && arr[k].preferencetext &&
          arr[i].preferencetext === arr[k].preferencetext) {
          count += 1;
        }
      }
    }
    return count;
  }

  emptyValuesFound(): boolean {
    return this.gridData.filter(e => e.pdepositstatus === true || e.preturnstatus === true)
      .some(item => !item.preferencetext);
  }

  emptyValuesFoundinReturn(): boolean {
    return this.gridData.filter(e => e.preturnstatus === true).every(item => !!item.preferencetext);
  }

  // ===========================================================================
  // AutoBRS / Bank File Upload
  // ===========================================================================

  BankUploadExcel(): void {
    this.saveshowhide = false;
    this.PreDefinedAutoBrsArrayData = [];
    this.showBankUploadSection = true;
  }

  bankFileUpload(): void {
    this.showBankUploadSection = true;
  }

  onFileChange(evt: any): void {
    this.PreDefinedAutoBrsArrayData = [];
    const target: DataTransfer = evt.target as DataTransfer;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: false });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      let exceldata: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
      exceldata = exceldata.slice(1);
      exceldata.forEach((row: any[]) => {
        this.PreDefinedAutoBrsArrayData.push({
          transactiondate: new Date((row[0] - 25569) * 86400000),
          chqueno:         row[1],
          chequeamount:    row[2],
          preferencetext:  row[3]
        });
      });
      this.PreDefinedAutoBrsArrayData = [...this.PreDefinedAutoBrsArrayData];
      this.saveshowhide = false;
    };
    reader.readAsBinaryString(target.files[0]);
  }

  DownloadExcelforPreDefinedBidAmount(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'AutoBrs');
    XLSX.writeFile(wb, this.fileName);
  }

  checkbox_pending_data(row: any, event: any): void {
    this.PreDefinedAutoBrsArrayData[row.index]['check'] = event.target.checked;
  }

  getAutoBrs(type: string): void {
    this.PreDefinedAutoBrsArrayData = [];
    this._accountingtransaction.GetPendingautoBRSDetailsIssued(this._commonService.getschemaname(), type)
      .subscribe({
        next: (res: any) => {
          this.PreDefinedAutoBrsArrayData = (res || []).map((x: any, i: number) => ({
            ...x, chqueno: x.pChequenumber, chequeamount: x.ptotalreceivedamount, index: i, check: false
          }));
          this.PreDefinedAutoBrsArrayData = [...this.PreDefinedAutoBrsArrayData];
        },
        error: (err: any) => this._commonService.showErrorMessage(err)
      });
  }

  auto_brs_typeChange(event: any): void {
    this.PreDefinedAutoBrsArrayData = [];
    this.auto_brs_type_name = event;
  }

  AutoBrs(): void {
    if (this.ChequesIssuedForm.controls['bankname'].value) {
      this.status = 'autobrs'; this.modeofreceipt = 'ONLINE-AUTO'; this.saveshowhide = true;
      this.GetChequesIssued_Load(this.bankid);
    } else {
      this._commonService.showWarningMessage('Please Select Bank');
      this.gridData = [];
    }
  }

  saveAutoBrs(): void {
    let PreDefinedData: any[] = [];
    let valid = false;
    if (this.auto_brs_type_name === 'Upload') {
      valid = Array.isArray(this.PreDefinedAutoBrsArrayData) && this.PreDefinedAutoBrsArrayData.length !== 0;
      PreDefinedData = JSON.parse(JSON.stringify(this.PreDefinedAutoBrsArrayData));
    } else if (this.auto_brs_type_name === 'Pending') {
      valid = this.PreDefinedAutoBrsArrayData.filter((x: any) => x.check).length > 0;
      PreDefinedData = JSON.parse(JSON.stringify(this.PreDefinedAutoBrsArrayData.filter((x: any) => x.check)));
    }

    if (!valid) { this._commonService.showWarningMessage('No Data to Save'); return; }

    if (confirm('Do you want to save ?')) {
      PreDefinedData.forEach((element: any) => {
        element.transactiondate = this._commonService.getFormatDateGlobal(element.transactiondate);
      });
      const newobj = {
        pchequesOnHandlist: PreDefinedData,
        schemaname: this._commonService.getschemaname(),
        auto_brs_type_name: this.auto_brs_type_name
      };
      this.saveAutoBrsBool = true;
      this._accountingtransaction.SaveAutoBrsdatauploadIssued(JSON.stringify(newobj)).subscribe({
        next: (res: any) => {
          this.saveAutoBrsBool = false;
          if (res) { this._commonService.showSuccessMsg('Saved successfully'); this.PreDefinedAutoBrsArrayData = []; }
          else { this._commonService.showWarningMessage('Not Saved!!'); }
        },
        error: (err: any) => { this._commonService.showErrorMessage(err); this.saveAutoBrsBool = false; }
      });
    }
  }
}