import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PageCriteria } from '../../../Models/pageCriteria';
import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';
import { CommonService } from '../../../services/common.service';
import * as XLSX from 'xlsx';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cheques-issued',
  imports: [NgxDatatableModule,CommonModule,CurrencyPipe,FormsModule,ReactiveFormsModule,BsDatepickerModule],
  templateUrl: './cheques-issued.component.html',
  styleUrl: './cheques-issued.component.css'
})
export class ChequesIssuedComponent implements OnInit {
  @Input() fromFormName: any;
  PreDefinedAutoBrsArrayData: any[] = [];
data: any[] = [["Date", "UTR Number", "Amount", "Reference Text"]];
fileName: string = 'AutoBrs.xlsx';
page = {
  totalElements: 0,
  pageSize: 10,
  pageNumber: 0,
  offset: 0,
  size: 10,
  totalPages: 0
};


activeTab = 'all';

tabsShowOrHideBasedOnfromFormName: boolean = false;
amounttotal: number = 0;
schemaname: any;
validate: boolean = false;

showicons = false;
gridData: any[] = [];
gridDatatemp: any[] = [];
BanksList: any[] = [];
gridLoading = false;

ChequesIssuedData: any[] = [];
OtherChequesData: any[] = [];
OtherChequesDataTemp: any[] = [];

ChequesClearReturnData: any[] = [];
ChequesClearReturnDataBasedOnBrs: any;

DataForSaving: any[] = [];
dataTemp: any[] = [];

ChequesIssuedValidation: any = {};

all: any;
chequesissued: any;
onlinepayments: any;
cleared: any;
returned: any;
cancelled: any;

currencySymbol: any;
bankname: any;
bankbalancetype: any;
bankbalance: any;
brsdate: any;

bankbalancedetails: any;
bankdetails: any;
bankid: any = 0;

status = 'all';
pdfstatus = 'All';

checkbox = false;
banknameshowhide: any;
datetitle: any;

buttonname = 'Save';
disablesavebutton = false;

brsdateshowhidecleared = false;
brsdateshowhidereturned = false;
brsdateshowhidecancelled = false;

showhidegridcolumns = false;
showhidegridcolumns2 = false;
saveshowhide = true;

validatebrsdatecancel = false;
validatebrsdatereturn = false;
validatebrsdateclear = false;

hiddendate = true;

ChequesIssuedForm!: FormGroup;
BrsReturnForm!: FormGroup;
BrsCancelForm!: FormGroup;
pageCriteria = {
  pageSize: 10,
  offset: 0,
  pageNumber: 1,
  footerPageHeight: 50,
  totalrows: 0,
  TotalPages: 0,
  currentPageRows: 0
};

pageCriteria2 = {
  pageSize: 10,
  offset: 0,
  pageNumber: 1,
  footerPageHeight: 50,
  headerHeight: 50,     
  rowHeight: 'auto' as const  
};


// pageCriteria = new PageCriteria();
// pageCriteria2 = new PageCriteria();

showOrHideOtherChequesGrid: boolean | undefined;
showOrHideAllChequesGrid: boolean | undefined;
showOrHideChequesIssuedGrid: boolean | undefined;

otherChequesCount: any;
tabname: string | undefined;

pageSize = 10;

displayAllChequesDataBasedOnForm: any;
displayAllChequesDataBasedOnFormTemp: any;

totalElements: number | undefined;
// page = new Page();

startindex: any;
endindex: any;

modeofreceipt: string = 'ALL';
_searchText: string = '';

fromdate: any = '';
todate: any = '';

_countData: any = [];

boolforAutoBrs: boolean = false;
companydetails: any;

auto_brs_type_name: string = 'Upload';
saveAutoBrsBool: boolean = false;

dpConfig: Partial<BsDatepickerConfig> = {};
brsfromConfig: Partial<BsDatepickerConfig> = {};
brstoConfig: Partial<BsDatepickerConfig> = {};
  // page: any;
//   pageCriteria2: any = {
//   pageSize: 10,
//   offset: 0,
//   footerPageHeight: 50,
//   headerHeight: 50,
//   rowHeight: 'auto'
// };


constructor(
  private _accountingtransaction: AccountingTransactionsService,
  private _commonService: CommonService,
  private fb: FormBuilder,
  private datepipe: DatePipe
) {
  // this.dpConfig = {
  //   showWeekNumbers: String(this._commonService.datePickerPropertiesSetup('showWeekNumbers')),
  //   containerClass: this._commonService.datePickerPropertiesSetup('containerClass'),
  //   maxDate: new Date(),
  //   dateInputFormat: this._commonService.datePickerPropertiesSetup('dateInputFormat')
  // };

  this.brsfromConfig = { ...this.dpConfig };
  this.brstoConfig = { ...this.dpConfig };
}
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

  // this._accountingtransaction.GetBanksList(this._commonService.getschemaname())
  //   .subscribe(banks => this.BanksList = banks);
  of([
  { pdepositbankname: 'HDFC Bank' },
  { pdepositbankname: 'State Bank of India' },
  { pdepositbankname: 'ICICI Bank' }
]).subscribe(banks => this.BanksList = banks);

  this.setPageModel();
  this.setPageModel2();

  this.GetBankBalance(this.bankid);
  this.GetChequesIssued_Load(this.bankid);

  this.boolforAutoBrs = this.companydetails?.pisautobrsimpsapplicable;

  // Replaced jQuery tab activation with booleans only
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
}
change_date(event: any) {
  this.gridData.forEach(i => {
    i.pdepositstatus = false;
    i.pcancelstatus = false;
    i.pchequestatus = 'N';
  });
}
pageSetUp() {
  if (!this.pageCriteria) {
    this.pageCriteria = {
      pageSize: 10,
      offset: 0,
      pageNumber: 1,
      footerPageHeight: 50,
      totalrows: 0,
      TotalPages: 0,
      currentPageRows: 0
    };
  }

  this.pageCriteria.offset = 0;
  this.pageCriteria.pageNumber = 1;
}

// GetBankBalance(bankid: number) {
//   this._accountingtransaction.GetBankBalance(bankid).subscribe(bankdetails => {
//     this.bankbalancedetails = bankdetails;

//     const balance = bankdetails._BankBalance;

//     if (balance < 0) {
//       this.bankbalance = Math.abs(balance);
//       this.bankbalancetype = 'Cr';
//     } else if (balance === 0) {
//       this.bankbalance = 0;
//       this.bankbalancetype = '';
//     } else {
//       this.bankbalance = balance;
//       this.bankbalancetype = 'Dr';
//     }

//     this.brsdate = this._commonService.getFormatDateGlobal(bankdetails.ptobrsdate);

//     const from = this._commonService.getDateObjectFromDataBase(bankdetails.pfrombrsdate);
//     const to = this._commonService.getDateObjectFromDataBase(bankdetails.ptobrsdate);

//     this.ChequesIssuedForm.patchValue({ pfrombrsdate: from, ptobrsdate: to });
//     this.BrsReturnForm.patchValue({ frombrsdate: from, tobrsdate: to });
//     this.BrsCancelForm.patchValue({ frombrsdate: from, tobrsdate: to });
//   });
// }
GetBankBalance(bankid: number) {
  of({
    _BankBalance: 75000,
    pfrombrsdate: new Date(),
    ptobrsdate: new Date()
  }).subscribe(bankdetails => {
    this.bankbalancedetails = bankdetails;

    const balance = bankdetails._BankBalance;

    if (balance < 0) {
      this.bankbalance = Math.abs(balance);
      this.bankbalancetype = 'Cr';
    } else if (balance === 0) {
      this.bankbalance = 0;
      this.bankbalancetype = '';
    } else {
      this.bankbalance = balance;
      this.bankbalancetype = 'Dr';
    }

    this.brsdate = new Date(bankdetails.ptobrsdate).toLocaleDateString('en-GB');

    const from = new Date(bankdetails.pfrombrsdate);
    const to = new Date(bankdetails.ptobrsdate);

    this.ChequesIssuedForm?.patchValue({ pfrombrsdate: from, ptobrsdate: to });
    this.BrsReturnForm?.patchValue({ frombrsdate: from, tobrsdate: to });
    this.BrsCancelForm?.patchValue({ frombrsdate: from, tobrsdate: to });
  });
}

// GetChequesIssued_Load(bankid: number) {
//   this.gridLoading = true;

//   forkJoin([
//     this._accountingtransaction.GetChequesIssuedData(bankid, this.startindex, this.endindex, this.modeofreceipt, this._searchText, ''),
//     this._accountingtransaction.GetChequesRowCount(bankid, this._searchText, '', '', 'CHEQUESISSUED', this.modeofreceipt)
//   ]).subscribe({
//     next: ([data, count]) => {
//       this.gridLoading = false;

//       this.ChequesIssuedData = data.pchequesOnHandlist || [];
//       this.ChequesClearReturnData = data.pchequesclearreturnlist || [];
//       this.OtherChequesData = data.pchequesotherslist || [];
//       this.otherChequesCount = this.OtherChequesData.length;

//       this._countData = count;
//       this.CountOfRecords();

//       if (this.status === 'all') this.All();
//       if (this.status === 'autobrs') this.autoBrs();

//       this.totalElements = +count['total_count'];
//       this.page.totalElements = this.totalElements;
//     },
//     error: err => {
//       this.gridLoading = false;
//       this._commonService.showErrorMessage(err);
//     }
//   });
// }
GetChequesIssued_Load(bankid: number) {
  this.gridLoading = true;

  const mockData = {
    pchequesOnHandlist: [],
    pchequesclearreturnlist: [],
    pchequesotherslist: []
  };

  const mockCount = { total_count: 0 };

  forkJoin([
    of(mockData),
    of(mockCount)
  ]).subscribe({
    next: ([data, count]) => {
      this.gridLoading = false;

      this.ChequesIssuedData = data.pchequesOnHandlist || [];
      this.ChequesClearReturnData = data.pchequesclearreturnlist || [];
      this.OtherChequesData = data.pchequesotherslist || [];
      this.otherChequesCount = this.OtherChequesData.length;

      this._countData = count;
      this.CountOfRecords();

      if (this.status === 'all') this.All();
      if (this.status === 'autobrs') this.autoBrs();

      this.totalElements = +count['total_count'];
      this.page.totalElements = this.totalElements;
    },
    error: err => {
      this.gridLoading = false;
      console.error(err);
    }
  });
}

// GetChequesIssued(bankid: any, startindex: number, endindex: number, searchText: string) {

//   this.gridLoading = true;

//   this._accountingtransaction
//     .GetChequesIssuedData(bankid, startindex, endindex, this.modeofreceipt, this._searchText, '')
//     .subscribe({
//       next: (data: any) => {
//         this.gridLoading = false;

//         const data1 = data?.pchequesOnHandlist || [];
//         this.ChequesIssuedData = data1;

//         this.ChequesClearReturnData = data?.pchequesclearreturnlist || [];

//         const otherchequesdetails = data?.pchequesotherslist || [];
//         this.OtherChequesData = otherchequesdetails;
//         this.otherChequesCount = this.OtherChequesData.length;

//         // Maintain original status-based routing
//         if (this.status === 'all') {
//           this.All1();
//         }
//         if (this.status === 'chequesissued') {
//           this.ChequesIssued1();
//         }
//         if (this.status === 'onlinepayment') {
//           this.OnlinePayments1();
//         }
//         if (this.status === 'cleared') {
//           this.Cleared1();
//         }
//         if (this.status === 'returned') {
//           this.Returned1();
//         }
//         if (this.status === 'cancelled') {
//           this.Cancelled1();
//         }

//         // Auto BRS UI state handling
//         if (this.status === 'autobrs') {
//           this.showhidegridcolumns = false;
//           this.showhidegridcolumns2 = true;
//           this.saveshowhide = true;
//           this.hiddendate = false;
//         }

//         if (this.status === 'autobrsupload') {
//           this.showhidegridcolumns = false;
//           this.showhidegridcolumns2 = true;
//           this.saveshowhide = false;
//         }

//         if (this.fromFormName === 'fromChequesStatusInformationForm') {
//           this.chequesStatusInfoGridForChequesIssued();
//         }
//       },
//       error: (error) => {
//         this.gridLoading = false;
//         this._commonService.showErrorMessage(error);
//       }
//     });
// }
GetChequesIssued(bankid: any, startindex: number, endindex: number, searchText: string) {
  this.gridLoading = true;

  const mockResponse = {
    
    pchequesOnHandlist: [
      {
        pdepositstatus: false,
        preturnstatus: false,
        pcancelstatus: false,
        pChequenumber: 'CHQ1001',
        ptotalreceivedamount: 5000,
        ppartyname: 'Demo Party A',
        preceiptid: 'RCPT001',
        preceiptdate: new Date(),
        pdepositeddate: new Date(),
        ptypeofpayment: 'Cheque',
        preferencetext: ''
      },
      {
        pdepositstatus: false,
        preturnstatus: false,
        pcancelstatus: false,
        pChequenumber: 'CHQ1002',
        ptotalreceivedamount: 12000,
        ppartyname: 'Demo Party B',
        preceiptid: 'RCPT002',
        preceiptdate: new Date(),
        pdepositeddate: new Date(),
        ptypeofpayment: 'Online',
        preferencetext: ''
      },
    ],
    pchequesclearreturnlist: [{
        pdepositstatus: true,
        preturnstatus: false,
        pcancelstatus: false,
        clearstatus: 'YES',
        returnstatus: 'NO',
        cancelstatus: 'NO',
        pChequenumber: 'CHQ0998',
        ptotalreceivedamount: 7500,
        ppartyname: 'Cleared Party 1',
        preceiptid: 'RCPT098',
        preceiptdate: new Date(2025, 11, 28),
        pdepositeddate: new Date(2026, 0, 3),
        ptypeofpayment: 'Cheque',
        preferencetext: 'REF123'
      },
      {
        pdepositstatus: true,
        preturnstatus: false,
        pcancelstatus: false,
        clearstatus: 'YES',
        returnstatus: 'NO',
        cancelstatus: 'NO',
        pChequenumber: 'CHQ0999',
        ptotalreceivedamount: 9800,
        ppartyname: 'Cleared Party 2',
        preceiptid: 'RCPT099',
        preceiptdate: new Date(2025, 11, 29),
        pdepositeddate: new Date(2026, 0, 4),
        ptypeofpayment: 'Cheque',
        preferencetext: 'REF124'
      }],
    pchequesotherslist: []
  };

  of(mockResponse).subscribe({
    next: (data: any) => {
      this.gridLoading = false;

      this.ChequesIssuedData = data.pchequesOnHandlist;
      this.ChequesClearReturnData = data.pchequesclearreturnlist;
      this.OtherChequesData = data.pchequesotherslist;
      this.otherChequesCount = this.OtherChequesData.length;
      this.gridData = [...this.ChequesIssuedData];
      this.amounttotal = this.gridData.reduce(
        (sum, x) => sum + (x.ptotalreceivedamount || 0),
        0
      );
      switch (this.status) {
        case 'all':
          this.All1();
          break;
        case 'chequesissued':
          this.ChequesIssued1();
          break;
        case 'onlinepayment':
          this.OnlinePayments1();
          break;
        case 'cleared':
          this.Cleared1();
          break;
        case 'returned':
          this.Returned1();
          break;
        case 'cancelled':
          this.Cancelled1();
          break;
        case 'autobrs':
          this.showhidegridcolumns = false;
          this.showhidegridcolumns2 = true;
          this.saveshowhide = true;
          this.hiddendate = false;
          break;
        case 'autobrsupload':
          this.showhidegridcolumns = false;
          this.showhidegridcolumns2 = true;
          this.saveshowhide = false;
          break;
      }

      if (this.fromFormName === 'fromChequesStatusInformationForm') {
        this.chequesStatusInfoGridForChequesIssued();
      }
    }
  });
}

onSearch(event: any) {
  const searchText = event?.toString() || '';
  this._searchText = searchText;

  if (!searchText) {
    // this.pageSetUp();
    // this.GetChequesIssued_Load(this.bankid);
    this.gridData = structuredClone(this.gridDatatemp);
    this.amounttotal = this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0);
    return;
  }

  const lastChar = searchText.slice(-1);
  const isNumber = /\d/.test(lastChar);
  const columnName = isNumber ? 'pChequenumber' : '';

  // this.gridData = this._commonService.transform(this.gridDatatemp, searchText, columnName);
 this.gridData = this.gridDatatemp.filter((x: any) =>
    JSON.stringify(x).includes(searchText)
  );

  this.amounttotal = this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0);
}
setPageModel() {
  this.pageCriteria.pageSize = this._commonService.pageSize;
  this.pageCriteria.offset = 0;
  this.pageCriteria.pageNumber = 1;
  this.pageCriteria.footerPageHeight = 50;
}
setPageModel2() {
  this.pageCriteria2.pageSize = this._commonService.pageSize;
  this.pageCriteria2.offset = 0;
  this.pageCriteria2.pageNumber = 1;
  this.pageCriteria2.footerPageHeight = 50;
}
onFooterPageChange(event: { page: number }): void {
  this.pageCriteria.offset = event.page - 1;
  this.pageCriteria.pageNumber = event.page;


  if (this.pageCriteria.totalrows < event.page * this.pageCriteria.pageSize) {
    this.pageCriteria.currentPageRows =
      this.pageCriteria.totalrows % this.pageCriteria.pageSize;
  } else {
    this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
  }
}
setPage(pageInfo: any, event: any) {
  this.page.offset = event.page - 1;
  this.page.pageNumber = pageInfo.page;

  this.endindex = this.page.pageNumber * this.page.size;
  this.startindex = this.endindex - this.page.size;

  if (this.fromdate && this.todate) {
    this.GetDataOnBrsDates1(this.fromdate, this.todate, this.bankid);
  } else {
    this.GetChequesIssued(this.bankid, this.startindex, this.page.size, '');
  }
}
All() {
  this.gridData = [];
  this.gridDatatemp = [];
  this.dataTemp = [];
  this.fromdate = '';
  this.todate = '';

  if (this.fromFormName === 'fromChequesStatusInformationForm') {
    this.GridColumnsHide();
  } else {
    this.GridColumnsShow();
  }

  this.brsdateshowhidereturned = false;
  this.brsdateshowhidecleared = false;
  this.brsdateshowhidecancelled = false;

  this.showOrHideOtherChequesGrid = false;
  this.showOrHideAllChequesGrid = false;
  this.showOrHideChequesIssuedGrid = true;

  this.status = 'all';
  this.pdfstatus = 'All';
  this.modeofreceipt = 'ALL';

  this.pageSetUp();
  this.GetChequesIssued(this.bankid, this.startindex, this.endindex, this._searchText);

  let grid: any[] = [];

  if (this.bankid === 0) {
    grid = this.ChequesIssuedData;
  } else {
    grid = this.ChequesIssuedData.filter(x => x.pdepositbankid === this.bankid);
  }

  this.gridData = structuredClone(grid);
  this.gridDatatemp = this.gridData;

  this.showicons = this.gridData.length > 0;
  this.amounttotal = this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0);
  this.dataTemp = structuredClone(grid);

  this.totalElements = this._countData['total_count'];
  this.page.totalElements = this.totalElements??0;
  if (this.page.totalElements > 10) {
    this.page.totalPages = Math.ceil(this.page.totalElements / 10);
  }
}
All1() {
  this.gridData = [...this.ChequesIssuedData, ...this.ChequesClearReturnData];
  this.gridDatatemp = [];
  this.dataTemp = [];

  if (this.fromFormName === 'fromChequesStatusInformationForm') {
    this.GridColumnsHide();
  } else {
    this.GridColumnsShow();
  }

  this.brsdateshowhidereturned = false;
  this.brsdateshowhidecleared = false;
  this.brsdateshowhidecancelled = false;

  this.showOrHideOtherChequesGrid = false;
  this.showOrHideAllChequesGrid = false;
  this.showOrHideChequesIssuedGrid = true;

  this.status = 'all';
  this.pdfstatus = 'All';
  this.modeofreceipt = 'ALL';

  let grid = this.bankid === 0
    ? this.ChequesIssuedData
    : this.ChequesIssuedData.filter(x => x.pdepositbankid === this.bankid);

  this.gridData = structuredClone(grid);
  this.gridDatatemp = this.gridData;
  this.showicons = this.gridData.length > 0;
  this.amounttotal = this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0);
  this.dataTemp = structuredClone(grid);
}
ChequesIssued() {
  this.gridData = [...this.ChequesIssuedData];
  this.gridDatatemp = [];
  this.dataTemp = [];
  this.fromdate = '';
  this.todate = '';

  if (this.fromFormName === 'fromChequesStatusInformationForm') {
    this.GridColumnsHide();
  } else {
    this.GridColumnsShow();
  }

  this.brsdateshowhidereturned = false;
  this.brsdateshowhidecleared = false;
  this.brsdateshowhidecancelled = false;

  this.showOrHideOtherChequesGrid = false;
  this.showOrHideAllChequesGrid = false;
  this.showOrHideChequesIssuedGrid = true;

  this.status = 'chequesissued';
  this.pdfstatus = 'Cheques Issued';
  this.modeofreceipt = 'CHEQUE';

  this.pageSetUp();
  this.GetChequesIssued(this.bankid, this.startindex, this.endindex, this._searchText);

  let grid = this.ChequesIssuedData.filter(x =>
    x.ptypeofpayment === 'CHEQUE' &&
    (this.bankid === 0 || x.pdepositbankid === this.bankid)
  );

  this.gridData = structuredClone(grid);
  this.gridDatatemp = this.gridData;
  this.showicons = this.gridData.length > 0;
  this.dataTemp = structuredClone(grid);
  this.amounttotal = this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0);

  this.totalElements = this._countData['cheques_count'];
  this.page.totalElements = this.totalElements??0;
  if (this.page.totalElements > 10) {
    this.page.totalPages = Math.ceil(this.page.totalElements / 10);
  }
}
ChequesIssued1() {
  this.gridData = [...this.ChequesIssuedData];
  this.gridDatatemp = [];
  this.dataTemp = [];

  if (this.fromFormName === 'fromChequesStatusInformationForm') {
    this.GridColumnsHide();
  } else {
    this.GridColumnsShow();
  }

  this.brsdateshowhidereturned = false;
  this.brsdateshowhidecleared = false;
  this.brsdateshowhidecancelled = false;

  this.showOrHideOtherChequesGrid = false;
  this.showOrHideAllChequesGrid = false;
  this.showOrHideChequesIssuedGrid = true;

  this.status = 'chequesissued';
  this.pdfstatus = 'Cheques Issued';
  this.modeofreceipt = 'CHEQUE';

  let grid = this.ChequesIssuedData.filter(x =>
    x.ptypeofpayment === 'CHEQUE' &&
    (this.bankid === 0 || x.pdepositbankid === this.bankid)
  );

  this.gridData = structuredClone(grid);
  this.gridDatatemp = this.gridData;
  this.showicons = this.gridData.length > 0;
  this.dataTemp = structuredClone(grid);
  this.amounttotal = this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0);
}
OnlinePayments() {
  this.gridData = [];
  this.gridDatatemp = [];
  this.dataTemp = [];
  this.fromdate = '';
  this.todate = '';

  if (this.fromFormName === 'fromChequesStatusInformationForm') {
    this.GridColumnsHide();
  } else {
    this.GridColumnsShow();
  }

  this.brsdateshowhidereturned = false;
  this.brsdateshowhidecleared = false;
  this.brsdateshowhidecancelled = false;

  this.showOrHideOtherChequesGrid = false;
  this.showOrHideAllChequesGrid = false;
  this.showOrHideChequesIssuedGrid = true;

  this.status = 'onlinepayment';
  this.pdfstatus = 'Online Payments';
  this.modeofreceipt = 'ONLINE';

  this.pageSetUp();
  this.GetChequesIssued(this.bankid, this.startindex, this.endindex, this._searchText);

  let grid = this.ChequesIssuedData.filter(x =>
    x.ptypeofpayment !== 'CHEQUE' &&
    (this.bankid === 0 || x.pdepositbankid === this.bankid)
  );

  this.gridData = structuredClone(grid);
  this.gridDatatemp = this.gridData;
  this.showicons = this.gridData.length > 0;
  this.amounttotal = this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0);
  this.dataTemp = structuredClone(grid);

  this.totalElements = this._countData['others_count'];
  this.page.totalElements = this.totalElements??0;
  if (this.page.totalElements > 10) {
    this.page.totalPages = Math.ceil(this.page.totalElements / 10);
  }
}
OnlinePayments1() {
  this.gridData = [];
  this.gridDatatemp = [];
  this.dataTemp = [];

  if (this.fromFormName === 'fromChequesStatusInformationForm') {
    this.GridColumnsHide();
  } else {
    this.GridColumnsShow();
  }

  this.brsdateshowhidereturned = false;
  this.brsdateshowhidecleared = false;
  this.brsdateshowhidecancelled = false;

  this.showOrHideOtherChequesGrid = false;
  this.showOrHideAllChequesGrid = false;
  this.showOrHideChequesIssuedGrid = true;

  this.status = 'onlinepayment';
  this.pdfstatus = 'Online Payments';
  this.modeofreceipt = 'ONLINE';

  let grid = this.ChequesIssuedData.filter(x =>
    x.ptypeofpayment !== 'CHEQUE' &&
    (this.bankid === 0 || x.pdepositbankid === this.bankid)
  );

  this.gridData = structuredClone(grid);
  this.gridDatatemp = this.gridData;
  this.showicons = this.gridData.length > 0;
  this.amounttotal = this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0);
  this.dataTemp = structuredClone(grid);
}
Cleared() {
  this.fromdate = '';
  this.todate = '';
  this.datetitle = 'Cleared Date';

  this.gridData = [];
  this.gridDatatemp = [];
  this.dataTemp = [];

  this.status = 'cleared';
  this.pdfstatus = 'Cleared';

  this.showOrHideOtherChequesGrid = false;
  this.showOrHideAllChequesGrid = false;
  this.showOrHideChequesIssuedGrid = true;

  this.brsdateshowhidecleared = true;
  this.brsdateshowhidereturned = false;
  this.brsdateshowhidecancelled = false;

  this.GridColumnsHide();

  this.ChequesIssuedForm.patchValue({
    pfrombrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate),
    ptobrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate)
  });

  this.modeofreceipt = 'CLEAR';
  this.pageSetUp();
  this.GetChequesIssued(this.bankid, this.startindex, this.endindex, this._searchText);

  const grid = this.ChequesClearReturnData.filter(x =>
    x.pchequestatus === 'P' && (this.bankid === 0 || x.pdepositbankid === this.bankid)
  );

  this.gridData = grid;
  this.gridDatatemp = grid;
  this.showicons = grid.length > 0;
  this.amounttotal = grid.reduce((sum, c) => sum + c.ptotalreceivedamount, 0);

  this.totalElements = this._countData['clear_count'];
  this.page.totalElements = this.totalElements??0;
  if (this.page.totalElements > 10) this.page.totalPages = Math.ceil(this.page.totalElements / 10);
}
Cleared1() {
  this.datetitle = 'Cleared Date';
  this.gridData = this.ChequesClearReturnData.filter(x => x.pdepositstatus);;
  this.gridDatatemp = [];
  this.dataTemp = [];

  this.status = 'cleared';
  this.pdfstatus = 'Cleared';

  this.showOrHideOtherChequesGrid = false;
  this.showOrHideAllChequesGrid = false;
  this.showOrHideChequesIssuedGrid = true;

  this.brsdateshowhidecleared = true;
  this.brsdateshowhidereturned = false;
  this.brsdateshowhidecancelled = false;

  this.GridColumnsHide();

  this.ChequesIssuedForm.patchValue({
    pfrombrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate),
    ptobrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate)
  });

  this.modeofreceipt = 'CLEAR';

  const grid = this.ChequesClearReturnData.filter(x =>
    x.pchequestatus === 'P' && (this.bankid === 0 || x.pdepositbankid === this.bankid)
  );

  this.gridData = grid;
  this.gridDatatemp = grid;
  this.showicons = grid.length > 0;
  this.amounttotal = grid.reduce((sum, c) => sum + c.ptotalreceivedamount, 0);
}
Returned() {
  this.fromdate = '';
  this.todate = '';
  this.datetitle = 'Returned Date';

  this.gridData = [];
  this.gridDatatemp = [];
  this.dataTemp = [];

  this.status = 'returned';
  this.pdfstatus = 'Returned';

  this.GridColumnsHide();

  this.showOrHideOtherChequesGrid = false;
  this.showOrHideAllChequesGrid = false;
  this.showOrHideChequesIssuedGrid = true;

  this.brsdateshowhidereturned = true;
  this.brsdateshowhidecleared = false;
  this.brsdateshowhidecancelled = false;

  this.BrsReturnForm.patchValue({
    frombrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate),
    tobrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate)
  });

  this.modeofreceipt = 'RETURN';
  this.pageSetUp();
  this.GetChequesIssued(this.bankid, this.startindex, this.endindex, this._searchText);

  const grid = this.ChequesClearReturnData.filter(x =>
    x.pchequestatus === 'R' && (this.bankid === 0 || x.pdepositbankid === this.bankid)
  );

  this.gridData = grid;
  this.gridDatatemp = grid;
  this.showicons = grid.length > 0;
  this.amounttotal = grid.reduce((sum, c) => sum + c.ptotalreceivedamount, 0);

  this.totalElements = this._countData['return_count'];
  this.page.totalElements = this.totalElements??0;
  if (this.page.totalElements > 10) this.page.totalPages = Math.ceil(this.page.totalElements / 10);
}
Returned1() {
  this.datetitle = 'Returned Date';
  this.gridData = [];
  this.gridDatatemp = [];
  this.dataTemp = [];

  this.status = 'returned';
  this.pdfstatus = 'Returned';

  this.GridColumnsHide();

  this.showOrHideOtherChequesGrid = false;
  this.showOrHideAllChequesGrid = false;
  this.showOrHideChequesIssuedGrid = true;

  this.brsdateshowhidereturned = true;
  this.brsdateshowhidecleared = false;
  this.brsdateshowhidecancelled = false;

  this.BrsReturnForm.patchValue({
    frombrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate),
    tobrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate)
  });

  this.modeofreceipt = 'RETURN';

  const grid = this.ChequesClearReturnData.filter(x =>
    x.pchequestatus === 'R' && (this.bankid === 0 || x.pdepositbankid === this.bankid)
  );

  this.gridData = grid;
  this.gridDatatemp = grid;
  this.showicons = grid.length > 0;
  this.amounttotal = grid.reduce((sum, c) => sum + c.ptotalreceivedamount, 0);
}
Cancelled() {
  this.fromdate = '';
  this.todate = '';
  this.datetitle = 'Cancelled Date';

  this.gridData = [];
  this.gridDatatemp = [];
  this.dataTemp = [];

  this.status = 'cancelled';
  this.pdfstatus = 'Cancelled';
  this.tabname = 'Cancelled';

  this.GridColumnsHide();

  this.showOrHideOtherChequesGrid = false;
  this.showOrHideAllChequesGrid = false;
  this.showOrHideChequesIssuedGrid = true;

  this.brsdateshowhidereturned = false;
  this.brsdateshowhidecleared = false;
  this.brsdateshowhidecancelled = true;

  this.BrsCancelForm.patchValue({
    frombrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate),
    tobrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate)
  });

  this.modeofreceipt = 'CANCEL';
  this.pageSetUp();
  this.GetChequesIssued(this.bankid, this.startindex, this.endindex, this._searchText);

  const grid = this.ChequesClearReturnData.filter(x =>
    x.pchequestatus === 'C' && (this.bankid === 0 || x.pdepositbankid === this.bankid)
  );

  this.gridData = grid;
  this.gridDatatemp = grid;
  this.showicons = grid.length > 0;
  this.amounttotal = grid.reduce((sum, c) => sum + c.ptotalreceivedamount, 0);

  this.totalElements = this._countData['cancel_count'];
  this.page.totalElements = this.totalElements??0;
  if (this.page.totalElements > 10) this.page.totalPages = Math.ceil(this.page.totalElements / 10);
}
Cancelled1() {
  this.datetitle = 'Cancelled Date';
  this.gridData = [];
  this.gridDatatemp = [];
  this.dataTemp = [];

  this.status = 'cancelled';
  this.pdfstatus = 'Cancelled';
  this.tabname = 'Cancelled';

  this.GridColumnsHide();

  this.showOrHideOtherChequesGrid = false;
  this.showOrHideAllChequesGrid = false;
  this.showOrHideChequesIssuedGrid = true;

  this.brsdateshowhidereturned = false;
  this.brsdateshowhidecleared = false;
  this.brsdateshowhidecancelled = true;

  this.BrsCancelForm.patchValue({
    frombrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate),
    tobrsdate: this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate)
  });

  this.modeofreceipt = 'CANCEL';

  const grid = this.ChequesClearReturnData.filter(x =>
    x.pchequestatus === 'C' && (this.bankid === 0 || x.pdepositbankid === this.bankid)
  );

  this.gridData = grid;
  this.gridDatatemp = grid;
  this.showicons = grid.length > 0;
  this.amounttotal = grid.reduce((sum, c) => sum + c.ptotalreceivedamount, 0);
}
allCheques() {
  this.showOrHideOtherChequesGrid = false;
  this.showOrHideAllChequesGrid = true;
  this.showOrHideChequesIssuedGrid = false;

  this.brsdateshowhidereturned = false;
  this.brsdateshowhidecleared = false;
  this.brsdateshowhidecancelled = false;

  this.chequesStatusInfoGridForChequesIssued();
}
autoBrs() {
  this.gridDatatemp = [];
  this.gridData = [...this.ChequesIssuedData];
  this.dataTemp = structuredClone(this.gridData);

  this.gridData.forEach(element => {
    element.pdepositstatus = true;
    element.pchequestatus = 'P';
  });

  this.amounttotal = this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0);

  this.totalElements = this._countData['cheques_count'];
  this.page.totalElements = this.totalElements??0;
  if (this.page.totalElements > 10) {
    this.page.totalPages = Math.ceil(this.page.totalElements / 10);
  }
}
GridColumnsShow() {
  this.showhidegridcolumns = false;
  this.showhidegridcolumns2 = false;
  this.brsdateshowhidecleared = false;
  this.brsdateshowhidereturned = false;
  this.brsdateshowhidecancelled = false;
  this.saveshowhide = true;
  this.hiddendate = true;
}
GridColumnsHide() {
  this.showhidegridcolumns = true;
  this.saveshowhide = false;
  this.hiddendate = false;
}
SelectBank(event: any) {
  const value = event?.target?.value;

  if (!value) {
    this.bankid = 0;
    this.bankname = '';
    this.banknameshowhide = false;
  } else {
    this.banknameshowhide = true;

    this.bankdetails = this.BanksList.find(b => b.pdepositbankname === value);
    this.bankid = this.bankdetails?.pbankid;
    this.bankname = this.bankdetails?.pdepositbankname;

    const bal = this.bankdetails?.pbankbalance ?? 0;
    if (bal < 0) {
      this.bankbalance = Math.abs(bal);
      this.bankbalancetype = 'Cr';
    } else if (bal === 0) {
      this.bankbalance = 0;
      this.bankbalancetype = '';
    } else {
      this.bankbalance = bal;
      this.bankbalancetype = 'Dr';
    }
  }

  this.GetChequesIssued_Load(this.bankid);

  switch (this.status) {
    case 'all': this.All(); break;
    case 'chequesissued': this.ChequesIssued(); break;
    case 'onlinepayment': this.OnlinePayments(); break;
    case 'cleared': this.Cleared(); break;
    case 'returned': this.Returned(); break;
    case 'cancelled': this.Cancelled(); break;
  }

  this.ChequesIssuedForm.patchValue({ SearchClear: '' });
}
CountOfRecords() {
  this.all = this._countData['total_count'] || 0;
  this.onlinepayments = this._countData['others_count'] || 0;
  this.chequesissued = this._countData['cheques_count'] || 0;
  this.cleared = this._countData['clear_count'] || 0;
  this.returned = this._countData['return_count'] || 0;
  this.cancelled = this._countData['cancel_count'] || 0;
}
GetDataOnBrsDates(frombrsdate: any, tobrsdate: any, bankid: any) {
  const data$ = this._accountingtransaction.DataFromBrsDatesChequesIssued(
    frombrsdate, tobrsdate, bankid, this.modeofreceipt, this._searchText, this.startindex, this.endindex
  );

  const count$ = this._accountingtransaction.GetChequesRowCount(
    this.bankid, this._searchText, frombrsdate, tobrsdate, 'CHEQUESISSUED', ''
  );

  forkJoin([data$, count$]).subscribe({
    next: ([data, count]) => {
      this.ChequesClearReturnDataBasedOnBrs = data['pchequesclearreturnlist'] || [];

      const grid = this.ChequesClearReturnDataBasedOnBrs.filter((x:any) =>
        (this.status === 'cleared' && x.pchequestatus === 'P') ||
        (this.status === 'cancelled' && x.pchequestatus === 'C') ||
        (this.status === 'returned' && x.pchequestatus === 'R')
      );

      this._countData = count;
      this.CountOfRecords();

      this.gridData = grid.map((d:any) => ({
        ...d,
        preceiptdate: this._commonService.getFormatDateGlobal(d.preceiptdate),
        pdepositeddate: this._commonService.getFormatDateGlobal(d.pdepositeddate)
      }));

      const key = this.status === 'cleared'
        ? 'clear_count'
        : this.status === 'returned'
          ? 'return_count'
          : 'cancel_count';

      this.totalElements = this._countData[key];
      this.page.totalElements = this.totalElements??0;
      if (this.page.totalElements > 10) {
        this.page.totalPages = Math.ceil(this.page.totalElements / 10);
      }
    },
    error: err => this._commonService.showErrorMessage(err)
  });
}
GetDataOnBrsDates1(frombrsdate: any, tobrsdate: any, bankid: any) {
  this._accountingtransaction
    .DataFromBrsDatesChequesIssued(frombrsdate, tobrsdate, bankid, this.modeofreceipt, this._searchText, this.startindex, this.endindex)
    .subscribe({
      next: data => {
        this.ChequesClearReturnDataBasedOnBrs = data['pchequesclearreturnlist'] || [];

        this.gridData = this.ChequesClearReturnDataBasedOnBrs
          .filter((x:any) =>
            (this.status === 'cleared' && x.pchequestatus === 'P') ||
            (this.status === 'cancelled' && x.pchequestatus === 'C') ||
            (this.status === 'returned' && x.pchequestatus === 'R')
          )
          .map((d:any) => ({
            ...d,
            preceiptdate: this._commonService.getFormatDateGlobal(d.preceiptdate),
            pdepositeddate: this._commonService.getFormatDateGlobal(d.pdepositeddate)
          }));
      },
      error: err => this._commonService.showErrorMessage(err)
    });
}
GetDataOnBrsDatesForOtherCheques(frombrsdate: any, tobrsdate: any, bankid: any) {
  this._accountingtransaction
    .DataFromBrsDatesForOtherChequesDetails(frombrsdate, tobrsdate, bankid)
    .subscribe({
      next: data => {
        this.OtherChequesData = (data['pchequesotherslist'] || []).map((x:any) => ({ ...x, preferencetext: '' }));
        this.otherChequesCount = this.OtherChequesData.length;

        this.pageCriteria.totalrows = this.OtherChequesData.length;
        this.pageCriteria.TotalPages = Math.ceil(this.pageCriteria.totalrows / this.pageCriteria.pageSize);
        this.pageCriteria.currentPageRows = Math.min(this.pageCriteria.pageSize, this.OtherChequesData.length);
      },
      error: err => this._commonService.showErrorMessage(err)
    });
}
ShowBrsClear() {
  this.gridData = [];
  this.cleared = 0;
  this._searchText = '';

  const fromdate = this.ChequesIssuedForm.value.pfrombrsdate;
  const todate = this.ChequesIssuedForm.value.ptobrsdate;

  if (fromdate && todate) {
    this.OnBrsDateChanges(fromdate, todate);

    if (!this.validate) {
      const f = this._commonService.getFormatDateGlobal(fromdate);
      const t = this._commonService.getFormatDateGlobal(todate);

      this.fromdate = f;
      this.todate = t;
      this.validatebrsdateclear = false;

      this.pageSetUp();
      this.GetDataOnBrsDates(f, t, this.bankid);
    } else {
      this.validatebrsdateclear = true;
    }
  } else {
    this._commonService.showWarningMessage('select fromdate and todate');
  }
}
ShowBrsReturn() {
  this.gridData = [];
  this.returned = 0;
  this._searchText = '';

  const fromdate = this.BrsReturnForm.value.frombrsdate;
  const todate = this.BrsReturnForm.value.tobrsdate;

  if (fromdate && todate) {
    this.OnBrsDateChanges(fromdate, todate);

    if (!this.validate) {
      const f = this._commonService.getFormatDateGlobal(fromdate);
      const t = this._commonService.getFormatDateGlobal(todate);

      this.fromdate = f;
      this.todate = t;
      this.validatebrsdatereturn = false;

      this.pageSetUp();
      this.GetDataOnBrsDates(f, t, this.bankid);
    } else {
      this.validatebrsdatereturn = true;
    }
  } else {
    this._commonService.showWarningMessage('select fromdate and todate');
  }
}
ShowBrsCancel() {
  this._searchText = '';

  let fromdate = this.BrsCancelForm.value.frombrsdate;
  let todate = this.BrsCancelForm.value.tobrsdate;

  if (fromdate && todate) {
    this.OnBrsDateChanges(fromdate, todate);

    if (!this.validate) {
      const f = this._commonService.getFormatDateGlobal(fromdate);
      const t = this._commonService.getFormatDateGlobal(todate);

      this.fromdate = f;
      this.todate = t;
      this.validatebrsdatecancel = false;

      if (this.tabname === 'Cancelled') {
        this.gridData = [];
        this.cancelled = 0;
        this.pageSetUp();
        this.GetDataOnBrsDates(f, t, this.bankid);
      } else if (this.tabname === 'OtherCheques') {
        this.GetDataOnBrsDatesForOtherCheques(f, t, this.bankid);
      }
    } else {
      this.validatebrsdatecancel = true;
    }
  } else {
    this._commonService.showWarningMessage('select fromdate and todate');
  }
}
OnBrsDateChanges(fromdate: Date, todate: Date) {
  this.validate = fromdate > todate;
}
Clear() {
  this.ChequesIssuedForm.reset();
  this.ChequesIssuedValidation = {};

  // Reset component state cleanly
  this.ngOnInit();
}
Save() {
  // 🚫 Stop if form itself is invalid
  if (this.ChequesIssuedForm.invalid) {
    this.ChequesIssuedForm.markAllAsTouched();
    this._commonService.showWarningMessage('Please fix validation errors');
    return;
  }

  // 🚫 Business validations (only when not Auto BRS)
  if (this.status !== 'autobrs' && !this.showhidegridcolumns) {
    const duplicates = this.validateDuplicates();
    const emptyValues = this.emptyValuesFound();
    const selectedRecords = this.gridData.filter(x => x.pchequestatus === 'P' || x.pchequestatus === 'R');
    const cancelledRecords = this.gridData.filter(x => x.pcancelstatus === true);

    if (duplicates > 0) {
      this._commonService.showWarningMessage('Duplicates Found please enter unique values');
      return;
    }

    if (emptyValues) {
      this._commonService.showWarningMessage('Please enter all input fields!');
      return;
    }

    if (selectedRecords.length === 0 && cancelledRecords.length === 0) {
      this._commonService.showWarningMessage('Please Select records');
      return;
    }
  }

  // 🛑 Final confirmation
  if (!confirm('Do You Want To Save ?')) return;

  this.buttonname = 'Processing';
  this.disablesavebutton = true;

  // 📦 Prepare records for saving
  const recordsToSave = this.gridData
    .filter(row => ['P', 'R', 'C'].includes(row.pchequestatus))
    .map(row => ({
      ...row,
      pCreatedby: this._commonService.pCreatedby(),
      pipaddress: this._commonService.ipaddress,
      preferencetext: row.preferencetext + '-' + new Date().getFullYear()
    }));

  if (recordsToSave.length === 0) {
    this._commonService.showWarningMessage('Select atleast one record');
    this.disablesavebutton = false;
    this.buttonname = 'Save';
    return;
  }

  // 🧾 Attach list to form
  this.ChequesIssuedForm.patchValue({ pchequesOnHandlist: recordsToSave });

  const payload = {
    ...this.ChequesIssuedForm.value,
    ptransactiondate: this._commonService.getFormatDateGlobal(this.ChequesIssuedForm.value.ptransactiondate),
    pCreatedby: this._commonService.pCreatedby()
  };

  // 💾 API Call
  this._accountingtransaction.SaveChequesIssued(JSON.stringify(payload)).subscribe({
    next: () => {
      this._commonService.showSuccessMsg("Saved successfully");
      this.Clear();
      this.buttonname = 'Save';
      this.disablesavebutton = false;
    },
    error: (err) => {
      this._commonService.showErrorMessage(err);
      this.buttonname = 'Save';
      this.disablesavebutton = false;
    }
  });
}
checkedClear(event: any, data: any) {
  const receiptDate = this._commonService.getDateObjectFromDataBase(data.preceiptdate);
  const transactionDate = this.ChequesIssuedForm.value.ptransactiondate;

  if (event.target.checked) {
    if (receiptDate && transactionDate >= receiptDate) {
      data.pdepositstatus = true;
      data.preturnstatus = false;
      data.pcancelstatus = false;
      data.pchequestatus = 'P';
    } else {
      event.target.checked = false;
      this._commonService.showWarningMessage('Transaction Date Should be Greater than Payment Date');
    }
  } else {
    data.pdepositstatus = false;
    data.pchequestatus = 'N';
  }
  this.gridData = [...this.gridData];
}
checkedReturn(event: any, data: any) {
  const receiptDate = this._commonService.getDateObjectFromDataBase(data.preceiptdate);
  const transactionDate = this.ChequesIssuedForm.value.ptransactiondate;

  if (event.target.checked) {
    if (receiptDate && transactionDate >= receiptDate) {
      data.preturnstatus = true;
      data.pcancelstatus = false;
      data.pdepositstatus = false;
      data.pchequestatus = 'R';
    } else {
      event.target.checked = false;
      this._commonService.showWarningMessage('Transaction Date Should be Greater than Payment Date');
    }
  } else {
    data.preturnstatus = false;
    data.pchequestatus = 'N';
  }
}
checkedCancel(event: any, data: any) {
  const receiptDate = this._commonService.getDateObjectFromDataBase(data.preceiptdate);
  const transactionDate = this.ChequesIssuedForm.value.ptransactiondate;

  if (event.target.checked) {
    if (receiptDate && transactionDate >= receiptDate) {
      data.pcancelstatus = true;
      data.pdepositstatus = false;
      data.preturnstatus = false;
      data.pchequestatus = 'C';
    } else {
      event.target.checked = false;
      this._commonService.showWarningMessage('Transaction Date Should be Greater than Payment Date');
    }
  } else {
    data.pcancelstatus = false;
    data.pchequestatus = 'N';
  }
}
chequesStatusInfoGridForChequesIssued() {
  this.showOrHideOtherChequesGrid = false;
  this.showOrHideAllChequesGrid = true;
  this.showOrHideChequesIssuedGrid = false;

  const grid: any[] = [
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
      .map(x => ({ ...x, chequeStatus: 'Cancelled' }))
  ];

  this.displayAllChequesDataBasedOnForm = grid;
  this.displayAllChequesDataBasedOnFormTemp = [...grid];

  this.setPageModel();
  this.pageCriteria.totalrows = grid.length;
  this.pageCriteria.TotalPages = Math.ceil(grid.length / this.pageCriteria.pageSize);
  this.pageCriteria.currentPageRows = Math.min(grid.length, this.pageCriteria.pageSize);
}
pdfOrprint(printorpdf: 'pdf' | 'print') {
  forkJoin([
    this._accountingtransaction.GetChequesIssuedData(this.bankid, 0, 999999, this.modeofreceipt, this._searchText, 'PDF'),
    this._accountingtransaction.DataFromBrsDatesChequesIssued(this.fromdate, this.todate, this.bankid, this.modeofreceipt, this._searchText, 0, 99999)
  ]).subscribe(([issued, brs]) => {

    const gridData = ['Cleared', 'Returned', 'Cancelled'].includes(this.pdfstatus)
      ? brs.pchequesclearreturnlist
      : issued.pchequesOnHandlist;

    const rows = gridData.map((e:any) => {
      const receipt = this._commonService.getFormatDateGlobal(e.preceiptdate);
      const deposited = this._commonService.getFormatDateGlobal(e.pdepositeddate) || '--NA--';
      const amt = e.ptotalreceivedamount
        ? this._commonService.convertAmountToPdfFormat(this._commonService.currencyformat(e.ptotalreceivedamount))
        : '';

      return ['Cleared', 'Returned', 'Cancelled'].includes(this.pdfstatus)
        ? [e.pChequenumber, amt, e.preceiptid, receipt, deposited, e.ptypeofpayment, e.ppartyname]
        : [e.pChequenumber, amt, e.preceiptid, receipt, e.ptypeofpayment, e.ppartyname];
    });

    const amounttotal = this._commonService.convertAmountToPdfFormat(
      this._commonService.currencyformat(this.amounttotal)
    );

    this._commonService._downloadchequesReportsPdf(
      'Cheques Issued',
      rows,
      [],
      {},
      'landscape',
      '',
      '',
      '',
      printorpdf,
      amounttotal
    );
  });
}
export() {
  forkJoin([
    this._accountingtransaction.GetChequesIssuedData(this.bankid, 0, 999999, this.modeofreceipt, this._searchText, 'PDF'),
    this._accountingtransaction.DataFromBrsDatesChequesIssued(this.fromdate, this.todate, this.bankid, this.modeofreceipt, this._searchText, 0, 99999)
  ]).subscribe(([issued, brs]) => {

    const gridData = ['Cleared', 'Returned', 'Cancelled'].includes(this.pdfstatus)
      ? brs.pchequesclearreturnlist
      : issued.pchequesOnHandlist;

    const rows = gridData.map((e:any) => ({
      "Cheque/ Reference No.": e.pChequenumber,
      "Amount": e.ptotalreceivedamount || '',
      "Payment Id": e.preceiptid,
      "Payment Date": this._commonService.getFormatDateGlobal(e.preceiptdate),
      "Transaction Mode": e.ptypeofpayment,
      "Party": e.ppartyname
    }));

    this._commonService.exportAsExcelFile(rows, 'Cheques Issued');
  });
}
checkDuplicateValues(value: string, rowIndex: number, row: any) {
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
validateDuplicates(): number {
  const refs = this.gridData
    .filter(x => ['P', 'R'].includes(x.pchequestatus) && x.preferencetext)
    .map(x => x.preferencetext.toLowerCase());

  return refs.length - new Set(refs).size;
}
emptyValuesFound(): boolean {
  return this.gridData
    .filter(x => x.pdepositstatus || x.preturnstatus)
    .some(x => !x.preferencetext);
}
// setPageModel2() {
//   Object.assign(this.pageCriteria2, {
//     pageSize: this._commonService.pageSize,
//     offset: 0,
//     pageNumber: 1,
//     footerPageHeight: 50
//   });
// }

BankUploadExcel() {
  this.saveshowhide = false;
  this.PreDefinedAutoBrsArrayData = [];
}
onFileChange(evt: any) {
  const reader = new FileReader();
  reader.onload = e => {
    const wb = XLSX.read(e.target!.result, { type: 'binary' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 }).slice(1);

    this.PreDefinedAutoBrsArrayData = data.map((r: any) => ({
      transactiondate: new Date((r[0] - 25569) * 86400000),
      chqueno: r[1],
      chequeamount: r[2],
      preferencetext: r[3]
    }));
  };
  reader.readAsBinaryString(evt.target.files[0]);
}

DownloadExcelforPreDefinedBidAmount() {
  const ws = XLSX.utils.aoa_to_sheet(this.data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'AutoBrs');
  XLSX.writeFile(wb, this.fileName);
}
getAutoBrs(type: string) {
  this._accountingtransaction
    .GetPendingautoBRSDetailsIssued(this._commonService.getschemaname(), type)
    .subscribe(res => {
      this.PreDefinedAutoBrsArrayData = res.map((x:any, i:any) => ({
        ...x,
        chqueno: x.pChequenumber,
        chequeamount: x.ptotalreceivedamount,
        index: i,
        check: false
      }));
    });
}

AutoBrs() {
  if (!this.ChequesIssuedForm.get('bankname')?.value) {
    this._commonService.showWarningMessage('Please Select Bank');
    this.gridData = [];
    return;
  }

  this.status = 'autobrs';
  this.modeofreceipt = 'ONLINE-AUTO';
  this.saveshowhide = true;
  this.GetChequesIssued_Load(this.bankid);
}
saveAutoBrs() {
  const data =
    this.auto_brs_type_name === 'Upload'
      ? this.PreDefinedAutoBrsArrayData
      : this.PreDefinedAutoBrsArrayData.filter((x:any) => x.check);

  if (!data.length) {
    this._commonService.showWarningMessage('No Data to Save');
    return;
  }

  if (!confirm('Do you want to save ?')) return;

  const payload = {
    pchequesOnHandlist: data.map((x:any) => ({
      ...x,
      transactiondate: this._commonService.getFormatDateGlobal(x.transactiondate)
    })),
    schemaname: this._commonService.getschemaname(),
    auto_brs_type_name: this.auto_brs_type_name
  };

  this.saveAutoBrsBool = true;
  this._accountingtransaction.SaveAutoBrsdatauploadIssued(JSON.stringify(payload)).subscribe({
    next: () => {
      this._commonService.showSuccessMsg("Saved successfully");
      this.PreDefinedAutoBrsArrayData = [];
      this.saveAutoBrsBool = false;
    },
    error: (err:any) => {
      this._commonService.showErrorMessage(err);
      this.saveAutoBrsBool = false;
    }
  });
}


auto_brs_typeChange(event: any) {
  this.PreDefinedAutoBrsArrayData = [];
  this.auto_brs_type_name = event;
}

checkbox_pending_data(row: any, event: any) {
  this.PreDefinedAutoBrsArrayData[row.index]['check'] = event.target.checked;
}
otherCheques() {
  this.status = 'other';
  this.showOrHideOtherChequesGrid = true;
  this.showOrHideAllChequesGrid = false;
  this.showOrHideChequesIssuedGrid = false;
}
checkDuplicateValueslatest(event: any, rowIndex: number, row: any) {
  const value = event.target.value?.toLowerCase();
  let exists = this.gridData.some((x: any, i: number) =>
    i !== rowIndex &&
    x.preferencetext?.toLowerCase() === value &&
    (x.preturnstatus || x.pdepositstatus)
  );

  if (exists) {
    this._commonService.showWarningMessage("Already Exist");
    row.preferencetext = '';
  } else {
    row.preferencetext = value;
  }

  this.gridData = [...this.gridData];
}





}
