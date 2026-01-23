import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
//import jsPDF from 'jspdf';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validator, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { forkJoin, never } from 'rxjs';
//import * as XLSX from 'xlsx';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
//import { NgxLoadingModule } from 'ngx-loading';
import { Pipe, PipeTransform } from '@angular/core';


@Component({
  selector: 'app-cheques-inbank',
  imports: [NgxDatatableModule,BsDatepickerModule,ReactiveFormsModule,CommonModule],
  templateUrl: './cheques-inbank.component.html',
  styleUrl: './cheques-inbank.component.css',
})
export class ChequesInbankComponent {


  //@ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  @Input() fromFormName: any;
  totalElements!: number;
  // page = new Page();
  @Input() loading: boolean = false;
  
  startindex: any;
  public today: number = Date.now();
  public todayDate: any;
  endindex: any;
  tabsShowOrHideBasedOnfromFormName!: boolean;
  BanksList = [];
  previewdetails: any = [];
  chequerwturnvoucherdetails: any = [];
  ChequesInBankData = [];
  _countData: any = [];
  gridData = [];
  gridDatatemp = [];
  gridExcel: any = [];
  ChequesClearReturnData = [];
  DataForSaving = [];
  all: any;
  chequesdeposited: any;
  amounttotal: any;
  Totlaamount: any;
  onlinereceipts: any;
  bankbalancetype: any;
  cleared: any;
  returned: any;
  currencySymbol: any;
  PopupData: any;
  bankdetails: any;
  bankid: any;
  datetitle: any;
  validate: any;
  bankname: any;
  brsdate: any;
  bankbalancedetails: any;
  bankbalance: any;
  userBranchType: any;
  ChequesClearReturnDataBasedOnBrs: any;
  showhidegridcolumns = false;
  showhidegridcolumns2 = false;
  saveshowhide: any;
  chequenumber: any;
  // status = "all";
  status: string = "";
  pdfstatus = "All";
  buttonname = "Save";
  disablesavebutton = false;
  hiddendate = true;
  banknameshowhide = false;
  brsdateshowhidecleared = false;
  brsdateshowhidereturned = false;
  validatebrsdateclear = false;
  validatebrsdatereturn = false;
  showicons = false
  ChequesInBankForm!: FormGroup;
  BrsDateForm!: FormGroup;
  ChequesInBankValidation: any = {};
  schemaname: any;
  //pageCriteria: PageCriteria;
  // pageCriteria2: PageCriteria;
  public pageSize = 10;
  //public selectableSettings: SelectableSettings;
  public checkbox = false;
  disabletransactiondate = false;
  displayGridBasedOnFormName!: boolean;
  displayGridDataBasedOnForm: any;
  displayGridDataBasedOnFormTemp: any;
  chequereturncharges: any;
  
  //public groups: GroupDescriptor[] = [{ field: 'preceiptdate', dir: 'desc' }];
  public ptransactiondateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public pchequecleardateConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  public brsfromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public brstoConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  gridLoading = false;
  searchloading: boolean = false;
  // modeofreceipt: string="CHEQUE";
  modeofreceipt: string = "ONLINE";
  _searchText: string = "";
  fromdate: any = "";
  todate: any = "";
  preferdrows: boolean = false
  chequeboxshoworhide: boolean = false
  receiptmode: any = "CH";
  //
  //data: AOA = [["Date", "UTR Number","amount","referencetext","UTR type","Receipt type"]];
  //wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'AutoBrs.xlsx';
  Exceldata: any = [];
  PreDefinedAutoBrsArrayData: any = [];
  //
  saveAutoBrsBool: boolean = false;
  boolforAutoBrs: boolean = false;
  companydetails: any;
  roleid: any;
  selectedamt = 0
  auto_brs_type_name: string = 'Upload';
  autoBsrGridData: any = [];
  autoBrsDuplicates: any = [];
  autoBrsData: any = [];
  _accountingtransaction: any;
  CountOfRecords: any;
  chequesStatusInfoGrid: any;
  BlurEventAllControll: any;
  GetDataOnBrsDates1: any;
  GridColumnsHide: any;
  GridColumnsShow: any;
  page: any;
  _commonService: any;
  _noticeservice: any;
  pageCriteria: any;
  numbertowords: any;
  pageCriteria2: any;
  GetChequesInBank: any;
  constructor(/*private _accountingtransaction: AccountingTransactionsService*/ private fb: FormBuilder, private datepipe: DatePipe,/* private _commonService: CommonService*//*private _noticeservice:NoticeService*/
    /*private numbertowords:NumberToWordsPipe*/) {
    //this.setSelectableSettings();
    // this.ptransactiondateConfig.showWeekNumbers = this._commonService.datePickerPropertiesSetup('showWeekNumbers');
    this.ptransactiondateConfig.maxDate = new Date();
    //this.ptransactiondateConfig.dateInputFormat = this._commonService.datePickerPropertiesSetup('dateInputFormat');
    //this.ptransactiondateConfig.containerClass = this._commonService.datePickerPropertiesSetup('containerClass');

    //this.pchequecleardateConfig.showWeekNumbers = this._commonService.datePickerPropertiesSetup('showWeekNumbers');
    this.pchequecleardateConfig.maxDate = new Date();
    //this.pchequecleardateConfig.dateInputFormat = this._commonService.datePickerPropertiesSetup('dateInputFormat');
    //this.pchequecleardateConfig.containerClass = this._commonService.datePickerPropertiesSetup('containerClass');


    //this.brsfromConfig.dateInputFormat = this._commonService.datePickerPropertiesSetup('dateInputFormat');
    this.brsfromConfig.maxDate = new Date();
    //this.brstoConfig.dateInputFormat = this._commonService.datePickerPropertiesSetup('dateInputFormat');
    this.brstoConfig.maxDate = new Date();
    //this.allData = this.allData.bind(this);

    // this.brsfromConfig.showWeekNumbers = this._commonService.datePickerPropertiesSetup('showWeekNumbers');
    // this.brsfromConfig.containerClass = this._commonService.datePickerPropertiesSetup('containerClass');
    // this.brstoConfig.showWeekNumbers = this._commonService.datePickerPropertiesSetup('showWeekNumbers');
    // this.brstoConfig.containerClass = this._commonService.datePickerPropertiesSetup('containerClass');

    // this.pageCriteria = new PageCriteria();
    // this.pageCriteria2 = new PageCriteria();
    // if (this._commonService.comapnydetails != null)
    //   this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;
  }
  // public setSelectableSettings(): void {
  //   this.selectableSettings = {
  //     checkboxOnly: this.checkbox,
  //     //mode: this.mode
  //     mode: "multiple"
  //   };
  // }

  ngOnInit(): void {
    this.pageSetUp();
    this.userBranchType = sessionStorage.getItem("userBranchType");
    this.roleid = sessionStorage.getItem("roleid");
    // this.companydetails = JSON.parse(sessionStorage.getItem("companydetails"));
    if (this.fromFormName == "fromChequesStatusInformationForm") {
      console.log("cheques in bank true-->", this.fromFormName)
      this.tabsShowOrHideBasedOnfromFormName = false;
      this.displayGridBasedOnFormName = false;
      // $("#chequesdepositedcss").addClass("active");
      // $("#chequescss").addClass("active");
      // $("#allcss").removeClass("active");

    } else {
      console.log("cheques in bank false-->", this.fromFormName)
      this.tabsShowOrHideBasedOnfromFormName = true;
      this.displayGridBasedOnFormName = true;
      // $("#allcss").removeClass("active");
      // $("#chequesdepositedcss").removeClass("active");
      // $("#chequesdepositedcss").addClass("active");
      //$("#onlinereceiptscss").addClass("active");
      // this.status = "chequesdeposited";
      this.status = "onlinereceipts";
      //$("#chequesdepositedcss").removeClass("active");
      //$("#chequescss").removeClass("active");
    }
    this.boolforAutoBrs = this.companydetails.pisautobrsimpsapplicable;
    console.log('-->', this.companydetails);
    console.log(this.companydetails.pisautobrsimpsapplicable);

    //this.currencySymbol = this._commonService.currencysymbol;
    this.ChequesInBankForm = this.fb.group({
      ptransactiondate: [new Date()],
      pchequecleardate: [new Date(), Validators.required],

      bankname: [''],
      pfrombrsdate: [''],
      ptobrsdate: [''],
      pchequesOnHandlist: [],
      SearchClear: [''],
      //schemaname: [this._commonService.getschemaname()],
      searchtext: [''],
      receipttype: ['Adjusted'],
      auto_brs_type: ['Upload']
    })
    this.BrsDateForm = this.fb.group({
      frombrsdate: [''],
      tobrsdate: ['']
    })
    this.bankid = 0;
    this.banknameshowhide = false;
    this.ChequesInBankValidation = {};
    // this._accountingtransaction.GetBanksList(this._commonService.getschemaname()).subscribe((bankslist: never[]) => {

    //   this.BanksList = bankslist;
    // })
    this.setPageModel();
    this.setPageModel2();
    this.GetBankBalance(this.bankid)
    // this.modeofreceipt = 'CHEQUE';
    this.modeofreceipt = 'ONLINE';
    this.GetChequesInBank_load(this.bankid);
    this.getChequeReturnCharges();
    this.BlurEventAllControll(this.ChequesInBankForm);

  }

  //initializing page model
  setPageModel() {
    // this.pageCriteria.pageSize = this._commonService.pageSize;
    // this.pageCriteria.offset = 0;
    // this.pageCriteria.pageNumber = 1;
    // this.pageCriteria.footerPageHeight = 50;
  }
  //for ngx table footer page navigation purpose
  onFooterPageChange(event: { page: number; }): void {
    // this.pageCriteria.offset = event.page - 1;
    // this.pageCriteria.CurrentPage = event.page;
    // if (this.pageCriteria.totalrows < event.page * this.pageCriteria.pageSize) {
    //   this.pageCriteria.currentPageRows = this.pageCriteria.totalrows % this.pageCriteria.pageSize;
    // }
    // else {
    //   this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
    // }
  }
  change_date() {
    debugger;
    for (let i = 0; i < this.gridData.length; i++) {
      // this.gridData[i].pdepositstatus = false;
      // this.gridData[i].pcancelstatus = false;
      // this.gridData[i].pchequestatus = "N";
    }
  }

  pageSetUp() {
    debugger;
    // this.page.offset = 0;
    // this.page.pageNumber = 1;
    // this.page.size = this._commonService.pageSize;
    // this.startindex = 0;
    // this.endindex = this.page.size;
    // this.page.totalElements = 5;
    // this.page.totalPages = 1;
  }
  setPage(pageInfo: { page: any; }, event: { page: number; }) {
    debugger;
    this.gridData = [];
    // this.page.offset = event.page - 1;
    // this.page.pageNumber = pageInfo.page;
    // this.endindex = this.page.pageNumber * this.page.size
    // this.startindex = (this.endindex) - this.page.size
    this.preferdrows = false
    if (this.fromdate != "" && this.todate != "") {
      this.GetDataOnBrsDates1(this.fromdate, this.todate, this.bankid);
    } else {
      if (this.status == 'autobrs') {
        // this.GetChequesInBank(this.bankid, this.startindex, this.page.size, "");
      } else {
        // this.GetChequesInBank(this.bankid, this.startindex, this.endindex, "");
        //  this.GetChequesInBank(this.bankid, this.startindex, this.page.size, "");
      }

    }

  }
  GetBankBalance(bankid: any) {
    this._accountingtransaction.GetBankBalance(bankid).subscribe((bankdetails: any) => {

      this.bankbalancedetails = bankdetails;
      if (this.bankid == 0) {
        if (this.bankbalancedetails._BankBalance < 0) {
          this.bankbalance = Math.abs(this.bankbalancedetails._BankBalance)
          this.bankbalancetype = "Cr";
        }
        else if (this.bankbalancedetails._BankBalance == 0) {
          this.bankbalance = 0;
          this.bankbalancetype = "";
        }
        else {
          this.bankbalance = (this.bankbalancedetails._BankBalance)
          this.bankbalancetype = "Dr";
        }
      }
      // this.brsdate = this._commonService.getFormatDateGlobal((this.bankbalancedetails.ptobrsdate))
      // this.ChequesInBankForm.controls['pfrombrsdate'].setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
      // this.ChequesInBankForm.controls['ptobrsdate'].setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
      // this.BrsDateForm.controls['frombrsdate'].setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
      // this.BrsDateForm.controls['tobrsdate'].setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
    })
  }
  GetChequesInBank_load(bankid: any) {
    this.gridLoading = true;
    this.brsdateshowhidecleared = false;
    let GetChequesInBankData = this._accountingtransaction.GetChequesInBankData(bankid, this.startindex, this.endindex, this.modeofreceipt, this._searchText, "");
    let getchequescount = this._accountingtransaction.GetChequesRowCount(bankid, this._searchText, "", "", "CHEQUESINBANK", this.modeofreceipt);
    //this._accountingtransaction.GetChequesInBankData(bankid).
    forkJoin(GetChequesInBankData, getchequescount).
      subscribe((data) => {
        console.log(data)
        this.gridLoading = false;

        if (this.fromFormName == "fromChequesStatusInformationForm") {

          // $("#chequesissuedcss").addClass("active");
          // $("#allcss").removeClass("active");
          // // $("#onlinereceiptscss").removeClass("active");
          // $("#clearedcss").removeClass("active");
          // $("#returnedcss").removeClass("active");
        } else {
          if (this.modeofreceipt == 'ALL') {
            // $("#allcss").addClass("active");
            // $("#chequesissuedcss").removeClass("active");
            // $("#chequesdepositedcss").removeClass("active");
            // // $("#onlinereceiptscss").removeClass("active");
            // $("#clearedcss").removeClass("active");
            // $("#returnedcss").removeClass("active");
            // $("#cleaautobrsuploadredcss").removeClass("active");
            // $("#autobrs").removeClass("active");
          } else if (this.modeofreceipt == 'CHEQUE') {
            // $("#chequesdepositedcss").addClass("active");
            // $("#allcss").removeClass("active");
            // $("#chequesissuedcss").removeClass("active");
            // // $("#onlinereceiptscss").removeClass("active");
            // $("#clearedcss").removeClass("active");
            // $("#returnedcss").removeClass("active");
            // $("#cleaautobrsuploadredcss").removeClass("active");
            // $("#autobrs").removeClass("active");
            this.chequeboxshoworhide = true;
          } else if (this.modeofreceipt == 'RETURN') {
            // $("#returnedcss").addClass("active");
            // $("#chequesdepositedcss").removeClass("active");
            // $("#allcss").removeClass("active");
            // $("#chequesissuedcss").removeClass("active");
            // // $("#onlinereceiptscss").removeClass("active");
            // $("#clearedcss").removeClass("active");
            // $("#cleaautobrsuploadredcss").removeClass("active");
            // $("#autobrs").removeClass("active");
          } else if (this.modeofreceipt == 'ONLINE') {
            // $("#onlinereceiptscss").addClass("active");
            // $("#returnedcss").removeClass("active");
            // $("#chequesdepositedcss").removeClass("active");
            // $("#allcss").removeClass("active");
            // $("#chequesissuedcss").removeClass("active");
            // $("#clearedcss").removeClass("active");
            // $("#cleaautobrsuploadredcss").removeClass("active");
            // $("#autobrs").removeClass("active");
          }
          else if (this.modeofreceipt == 'CLEAR') {
            // $("#clearedcss").addClass("active");
            // $("#chequesdepositedcss").removeClass("active");
            // $("#allcss").removeClass("active");
            // $("#chequesissuedcss").removeClass("active");
            // $("#onlinereceiptscss").removeClass("active");
            // $("#returnedcss").removeClass("active");
            // $("#cleaautobrsuploadredcss").removeClass("active");
            // $("#autobrs").removeClass("active");
          } else if (this.modeofreceipt == 'ONLINE-AUTO') {
            // $("#autobrs").addClass("active");
            // $("#cleaautobrsuploadredcss").removeClass("active");
            // $("#chequesdepositedcss").removeClass("active");
            // $("#allcss").removeClass("active");
            // $("#chequesissuedcss").removeClass("active");
            // $("#onlinereceiptscss").removeClass("active");
           // $("#returnedcss").removeClass("active");
          } else {
            // $("#allcss").addClass("active");
            // $("#chequesissuedcss").removeClass("active");
            // $("#chequesdepositedcss").removeClass("active");
            // // $("#onlinereceiptscss").removeClass("active");
            // $("#clearedcss").removeClass("active");
            // $("#returnedcss").removeClass("active");
            // $("#cleaautobrsuploadredcss").removeClass("active");
            // $("#autobrs").removeClass("active");
          }
        }
        debugger;
        //let data1 = data[0]['pchequesOnHandlist'];
        // data1.filter(i => {
        //   i.preceiptdate = this._commonService.getFormatDateGlobal(this._commonService.getDateObjectFromDataBase(i.preceiptdate));
        //   i.pdepositeddate = this._commonService.getFormatDateGlobal(this._commonService.getDateObjectFromDataBase(i.pdepositeddate));
        //   i.pchequedate = this._commonService.getFormatDateGlobal(this._commonService.getDateObjectFromDataBase(i.pchequedate));

        // });
        // this.ChequesInBankData = data1;
        // this.ChequesInBankData.map(element=>{
        //   element['preferencetext'] = "";
        // })
        // this.ChequesClearReturnData = data[0]['pchequesclearreturnlist'];
        // this._countData=data[1];
        this.CountOfRecords();
        if (this.status == "all") {
          // this.All();
        }
        // if (this.status == "chequesdeposited") {
        //   this.ChequesDeposited();
        // }
        // if (this.status == "onlinereceipts") {
        //   this.OnlineReceipts();
        // }
        // if (this.status == "cleared") {
        //   this.Cleared();
        // }
        // if (this.status == "returned") {
        //   this.Returned();
        // }

        if (this.fromFormName == "fromChequesStatusInformationForm") {
          this.chequesStatusInfoGrid();
        }
        debugger;
        // if(this.status == 'all'){
        if (this.status == 'cleared' || this.status == 'returned') {
          this.GridColumnsHide();
        } else if (this.status == 'autobrs') {
          // this.GridColumnsHide();
          this.showhidegridcolumns = false;
          this.showhidegridcolumns2 = true;
          this.saveshowhide = true;
          this.hiddendate = false;
        } else {
          this.GridColumnsShow();
        }
        let grid: never[] = [];
        if (this.bankid == 0) {
          grid = this.ChequesInBankData;
        }
        else {

          for (let i = 0; i < this.ChequesInBankData.length; i++) {
            if (this.ChequesInBankData[i]['pdepositbankid'] == this.bankid) {
              grid.push(this.ChequesInBankData[i]);
              // datatemp.push(this.ChequesClearReturnData[i]);
            }
          }

        }
        this.gridData = JSON.parse(JSON.stringify(grid));
        this.gridDatatemp = this.gridData;
        this.autoBsrGridData = this.gridDatatemp;
        if (this.gridData.length > 0) {
          this.showicons = true
        }
        else {
          this.showicons = false
        }
        //  this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
        // }
        console.log('data-->', this.gridData);
        // if(this.status == 'autobrs'){
        //   this.totalElements = +data[1]["matchedcount"];
        //   this.page.totalElements = +data[1]["matchedcount"];
        // }else{
        //   this.totalElements = +data[1]["others_count"];
        //   this.page.totalElements = +data[1]["others_count"];
        // }

        // this.totalElements = +data[1]["cheques_count"];
        // this.page.totalElements = +data[1]["cheques_count"];
        // this.page.totalPages = 1;
        //if (this.page.totalElements > 10)
        // this.page.totalPages = parseInt((this.page.totalElements / 10).toString()) + 1;

        //   }, (error: any) => { this._commonService.showErrorMessage(error) })
        // }

        // GetChequesInBank(bankid: any,startindex: any, endindex: any,searchText: string) {
        //   debugger;
        //   this.gridLoading = true;
        //   this._accountingtransaction.GetChequesInBankData(bankid,startindex, endindex,this.modeofreceipt,this._searchText,"").
        //   //forkJoin(GetChequesInBankData,getchequescount).
        //   subscribe((data: { pchequesOnHandlist: any; pchequesclearreturnlist: never[]; }) => {
        //     console.log(data)
        //     this.gridLoading = false;

        //     // if (this.fromFormName == "fromChequesStatusInformationForm") {

        //     //   $("#chequesissuedcss").addClass("active");
        //     //   $("#allcss").removeClass("active");
        //     //   $("#onlinereceiptscss").removeClass("active");
        //     //   $("#clearedcss").removeClass("active");
        //     //   $("#returnedcss").removeClass("active");
        //     // } else {
        //     //   $("#allcss").addClass("active");
        //     //   $("#chequesissuedcss").removeClass("active");
        //     //   $("#onlinereceiptscss").removeClass("active");
        //     //   $("#clearedcss").removeClass("active");
        //     //   $("#returnedcss").removeClass("active");
        //     // }
        //     debugger;
        //     let data1 = data.pchequesOnHandlist;
        //     // data1.filter(i => {
        //     //   i.preceiptdate = this._commonService.getFormatDateGlobal(this._commonService.getDateObjectFromDataBase(i.preceiptdate));
        //     //   i.pdepositeddate = this._commonService.getFormatDateGlobal(this._commonService.getDateObjectFromDataBase(i.pdepositeddate));
        //     //   i.pchequedate = this._commonService.getFormatDateGlobal(this._commonService.getDateObjectFromDataBase(i.pchequedate));

        //     // });
        //     this.ChequesInBankData = data1;
        //     // this.ChequesInBankData.map(element=>{
        //     //   element['preferencetext'] = "";
        //     // })
        //     this.ChequesClearReturnData = data.pchequesclearreturnlist;
        //     // this._countData=data[1];
        //     //this.CountOfRecords();
        //     if (this.status == "all") {
        //       this.All1();
        //     }
        //     if (this.status == "chequesdeposited") {
        //       this.ChequesDeposited1();
        //     }
        //     if (this.status == "onlinereceipts") {
        //       this.OnlineReceipts1();
        //     }
        //     if (this.status == "cleared") {
        //       this.Cleared1();
        //     }
        //     if (this.status == "returned") {
        //       this.Returned1();
        //     }

        //     if (this.fromFormName == "fromChequesStatusInformationForm") {
        //       this.chequesStatusInfoGrid();
        //     }
        //     if(this.status == 'autobrs'){
        //       this.autoBsrGridData=data1;
        //     }


        //   }, (error: any) => { this._commonService.showErrorMessage(error) })
        // }

        // onSearch(event: { toString: () => any; }) {
        //   debugger;

        //   let searchText = event.toString();
        //   this._searchText = searchText;

        //   if (this.fromFormName == "fromChequesStatusInformationForm") {
        //     if (searchText != "") {
        //       let columnName;
        //       let lastChar = searchText.substr(searchText.length - 1);
        //       let asciivalue = lastChar.charCodeAt()
        //       if (asciivalue > 47 && asciivalue < 58) {
        //         columnName = "pChequenumber";
        //       } else {
        //         columnName = "";
        //       }

        //       this.displayGridDataBasedOnForm = this._commonService.transform(this.displayGridDataBasedOnFormTemp, searchText, columnName);
        //     }
        //     else {
        //       this.displayGridDataBasedOnForm = this.displayGridDataBasedOnFormTemp;
        //     }
        //     this.pageCriteria.totalrows = this.displayGridDataBasedOnForm.length;
        //     this.pageCriteria.TotalPages = 1;
        //     if (this.pageCriteria.totalrows > 10)
        //       this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / 10).toString()) + 1;
        //     if (this.displayGridDataBasedOnForm.length < this.pageCriteria.pageSize) {
        //       this.pageCriteria.currentPageRows = this.displayGridDataBasedOnForm.length;
        //     }
        //     else {
        //       this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
        //     }
        //   }
        //   else {
        //     let SearchLength: any = this._commonService.searchfilterlength;
        //     if (searchText != "" && parseInt(searchText.length) > parseInt(SearchLength)) {
        //       let columnName;
        //       let lastChar = searchText.substr(searchText.length - 1);
        //       let asciivalue = lastChar.charCodeAt()
        //       if (asciivalue > 47 && asciivalue < 58) {
        //         columnName = "pChequenumber";
        //       } else {
        //         columnName = "";
        //       }
        //       this.pageSetUp();
        //       if(this.status == 'cleared'){
        //         this.Cleared();
        //       }else if(this.status == 'returned'){
        //         this.Returned();
        //       }else if(this.status == 'onlinereceipts'){
        //         this.OnlineReceipts();
        //       }else if(this.status == 'chequesdeposited'){
        //         this.ChequesDeposited();
        //       }else if(this.status == 'all'){
        //         this.All();
        //       }
        //       else{
        //         this.GetChequesInBank_load(this.bankid);
        //       }
        //       // this.GetChequesInBank_load(this.bankid);
        //       //this.gridData = this._commonService.transform(this.gridDatatemp, searchText, columnName);
        //     }
        //     else {
        //       if (searchText == "") {
        //         this.pageSetUp();
        //         // this.modeofreceipt="CHEQUE";
        //         this.modeofreceipt="ONLINE";
        //         // this.status = 'chequesdeposited';
        //         this.status = 'onlinereceipts';
        //         this.GetChequesInBank_load(this.bankid);
        //       }
        //       this.gridData = this.gridDatatemp;
        //     }
        //     this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
        //     // this.pageCriteria.totalrows = this.gridData.length;
        //     // this.pageCriteria.TotalPages = 1;
        //     // if (this.pageCriteria.totalrows > 10)
        //     //   this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / 10).toString()) + 1;
        //     // if (this.gridData.length < this.pageCriteria.pageSize) {
        //     //   this.pageCriteria.currentPageRows = this.gridData.length;
        //     // }
        //     // else {
        //     //   this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
        //     // }
        //   }

        // }


        All(); {
          debugger
          // $('#search').val("");
          this.gridData = [];
          this.gridDatatemp = [];
          this.amounttotal = 0;
          this.fromdate = ""; this.todate = "";
          this.chequeboxshoworhide = true
          if (this.fromFormName == "fromChequesStatusInformationForm") {

            this.GridColumnsHide();
          } else {
            this.GridColumnsShow();
          }
          this.status = "all";
          this.pdfstatus = "All";
          this.modeofreceipt = "ALL";
          this.pageSetUp();
          // this.GetChequesInBank(this.bankid,this.startindex,this.endindex,this._searchText);
          this.GetChequesInBankforSearchDeposit(this.bankid, this.startindex, this.endindex, this._searchText);
          let grid: never[] = [];
          if (this.bankid == 0) {
            grid = this.ChequesInBankData;
          }
          else {
            for (let i = 0; i < this.ChequesInBankData.length; i++) {
              if (this.ChequesInBankData[i]['pdepositbankid'] == this.bankid) {
                grid.push(this.ChequesInBankData[i]);
                // datatemp.push(this.ChequesClearReturnData[i]);
              }
            }
          }
          this.gridData = JSON.parse(JSON.stringify(grid));
          this.gridDatatemp = this.gridData;
          if (this.gridData.length > 0) {
            this.showicons = true
          }
          else {
            this.showicons = false
          }
          // this.gridData.filter(data => {
          //   data.preceiptdate = this._commonService.getFormatDateGlobal((data.preceiptdate));
          //   data.pdepositeddate = this._commonService.getFormatDateGlobal((data.pdepositeddate));
          // })
          // custom page navigation
          //this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
          // this.pageCriteria.totalrows = this.gridData.length;
          // this.pageCriteria.TotalPages = 1;
          // if (this.pageCriteria.totalrows > this.pageCriteria.pageSize)
          //   this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / this.pageCriteria.pageSize).toString()) + 1;
          // if (this.gridData.length < this.pageCriteria.pageSize) {
          //   this.pageCriteria.currentPageRows = this.gridData.length;
          // }
          // else {
          //   this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
          // }
          // this.totalElements = this._countData["total_count"];
          // this.page.totalElements = this._countData["total_count"];
          // // this.page.totalPages = 1;
          // if (this.page.totalElements > 10)
          //   this.page.totalPages = parseInt((this.page.totalElements / 10).toString()) + 1;

        }
        All(); {
          debugger
          // $('#search').val("");
          this.gridData = [];
          this.gridDatatemp = [];
          if (this.fromFormName == "fromChequesStatusInformationForm") {

            this.GridColumnsHide();
          } else {
            this.GridColumnsShow();
          }
          this.status = "all";
          this.pdfstatus = "All";
          this.modeofreceipt = "ALL";
          let grid: never[] = [];
          if (this.bankid == 0) {
            grid = this.ChequesInBankData;
          }
          else {
            for (let i = 0; i < this.ChequesInBankData.length; i++) {
              if (this.ChequesInBankData[i]['pdepositbankid'] == this.bankid) {
                grid.push(this.ChequesInBankData[i]);
                // datatemp.push(this.ChequesClearReturnData[i]);
              }
            }
          }
          this.gridData = JSON.parse(JSON.stringify(grid));
          this.gridDatatemp = this.gridData;
          if (this.gridData.length > 0) {
            this.showicons = true
          }
          else {
            this.showicons = false
          }

          // custom page navigation
          // this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));

          // this.ChequesInBankForm.controls['pfrombrsdate'].setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
          // this.ChequesInBankForm.controls.ptobrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
          // this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
          // this.BrsDateForm.controls.tobrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));

        }

        ChequesDeposited(); {
          debugger;
          this.gridData = [];
          this.chequeboxshoworhide = true
          this.amounttotal = 0;
          this.fromdate = ""; this.todate = "";
          this.modeofreceipt = "CHEQUE";
          this.pageSetUp();
          this.GetChequesInBank(this.bankid, this.startindex, this.endindex, this._searchText);
          //this.GetChequesInBankforSearchDeposit(this.bankid,this.startindex,this.endindex,this._searchText);
          //this.GetChequesInBank_load(this.bankid);

          // $('#search').val("");
          this.gridData = [];
          this.gridDatatemp = [];
          if (this.fromFormName == "fromChequesStatusInformationForm") {

            this.GridColumnsHide();
          } else {
            this.GridColumnsShow();
          }
          this.status = "chequesdeposited";
          this.pdfstatus = "Cheques Deposited";

          let grid: never[] = [];
          if (this.bankid == 0) {
            for (let i = 0; i < this.ChequesInBankData.length; i++) {
              if (this.ChequesInBankData[i]['ptypeofpayment'] == "CHEQUE") {
                grid.push(this.ChequesInBankData[i]);
              }
            }
          }
          else {
            for (let i = 0; i < this.ChequesInBankData.length; i++) {
              if (this.ChequesInBankData[i]['ptypeofpayment'] == "CHEQUE" && this.ChequesInBankData[i]['pdepositbankid'] == this.bankid) {
                grid.push(this.ChequesInBankData[i]);
              }
            }
          }
          this.gridData = JSON.parse(JSON.stringify(grid))
          this.gridDatatemp = this.gridData
          if (this.gridData.length > 0) {
            this.showicons = true
          }
          else {
            this.showicons = false
          }
          //this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
          // this.gridData.filter(data => {
          //   data.preceiptdate = this._commonService.getFormatDateGlobal((data.preceiptdate));
          //   data.pdepositeddate = this._commonService.getFormatDateGlobal((data.pdepositeddate));
          //   //data.pchequedate=this._commonService.getFormatDateGlobal((data.pchequedate));
          // })

          // custom page navigation
          // this.pageCriteria.totalrows = this.gridData.length;
          // this.pageCriteria.TotalPages = 1;
          // if (this.pageCriteria.totalrows > this.pageCriteria.pageSize)
          //   this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / this.pageCriteria.pageSize).toString()) + 1;
          // if (this.gridData.length < this.pageCriteria.pageSize) {
          //   this.pageCriteria.currentPageRows = this.gridData.length;
          // }
          // else {
          //   this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
          // }
          this.totalElements = this._countData["cheques_count"];
          this.page.totalElements = this._countData["cheques_count"];
          // this.page.totalPages = 1;
          if (this.page.totalElements > 10)
            this.page.totalPages = parseInt((this.page.totalElements / 10).toString()) + 1;

        }
        ChequesDeposited1(); {
          debugger;
          this.modeofreceipt = "CHEQUE";
          // $('#search').val("");
          this.gridData = [];
          this.gridDatatemp = [];
          if (this.fromFormName == "fromChequesStatusInformationForm") {

            this.GridColumnsHide();
          } else {
            this.GridColumnsShow();
          }
          this.status = "chequesdeposited";
          this.pdfstatus = "Cheques Deposited";

          let grid: never[] = [];
          if (this.bankid == 0) {
            for (let i = 0; i < this.ChequesInBankData.length; i++) {
              if (this.ChequesInBankData[i]['ptypeofpayment'] == "CHEQUE") {
                grid.push(this.ChequesInBankData[i]);
              }
            }
          }
          else {
            for (let i = 0; i < this.ChequesInBankData.length; i++) {
              if (this.ChequesInBankData[i]['ptypeofpayment'] == "CHEQUE" && this.ChequesInBankData[i]['pdepositbankid'] == this.bankid) {
                grid.push(this.ChequesInBankData[i]);
              }
            }
          }
          this.gridData = JSON.parse(JSON.stringify(grid))
          this.gridDatatemp = this.gridData
          if (this.gridData.length > 0) {
            this.showicons = true
          }
          else {
            this.showicons = false
          }
          //  this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));


        }
        OnlineReceipts(); {
          // $('#search').val("");
          this.chequeboxshoworhide = true
          this.amounttotal = 0;
          this.fromdate = ""; this.todate = "";
          this.pageSetUp();
          this.gridData = [];
          this.gridDatatemp = [];
          if (this.fromFormName == "fromChequesStatusInformationForm") {

            this.GridColumnsHide();
          } else {
            this.GridColumnsShow();
          }
          this.status = "onlinereceipts";
          this.pdfstatus = "Online Receipts";
          this.modeofreceipt = "ONLINE";
          //this.GetChequesInBank(this.bankid,this.startindex,this.endindex,this._searchText);
          this.GetChequesInBank_load(this.bankid);

          let grid: never[] = [];
          console.log(this.ChequesInBankData);
          if (this.bankid == 0) {
            for (let j = 0; j < this.ChequesInBankData.length; j++) {
              if (this.ChequesInBankData[j]['ptypeofpayment'] != "CHEQUE") {
                grid.push(this.ChequesInBankData[j]);
              }
            }
          }
          else {
            for (let j = 0; j < this.ChequesInBankData.length; j++) {
              if (this.ChequesInBankData[j]['ptypeofpayment'] != "CHEQUE" && this.ChequesInBankData[j]['pdepositbankid'] == this.bankid) {
                grid.push(this.ChequesInBankData[j]);
              }
            }
          }
          this.gridData = JSON.parse(JSON.stringify(grid))
          this.gridDatatemp = this.gridData;
          if (this.gridData.length > 0) {
            this.showicons = true
          }
          else {
            this.showicons = false
          }
          //this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
          // this.gridData.filter(data => {
          //   data.preceiptdate = this._commonService.getFormatDateGlobal((data.preceiptdate));
          //   data.pdepositeddate = this._commonService.getFormatDateGlobal((data.pdepositeddate));
          //   //data.pchequedate=this._commonService.getFormatDateGlobal((data.pchequedate));
          // })

          // custom page navigation
          // this.pageCriteria.totalrows = this.gridData.length;
          // this.pageCriteria.TotalPages = 1;
          // if (this.pageCriteria.totalrows > this.pageCriteria.pageSize)
          //   this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / this.pageCriteria.pageSize).toString()) + 1;
          // if (this.gridData.length < this.pageCriteria.pageSize) {
          //   this.pageCriteria.currentPageRows = this.gridData.length;
          // }
          // else {
          //   this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
          // }
          this.totalElements = this._countData["others_count"];
          this.page.totalElements = this._countData["others_count"];
          // this.page.totalPages = 1;
          if (this.page.totalElements > 10)
            this.page.totalPages = parseInt((this.page.totalElements / 10).toString()) + 1;

        }
        OnlineReceipts1(); {
          // $('#search').val("");

          this.gridData = [];
          this.gridDatatemp = [];
          if (this.fromFormName == "fromChequesStatusInformationForm") {

            this.GridColumnsHide();
          } else {
            this.GridColumnsShow();
          }
          this.status = "onlinereceipts";
          this.pdfstatus = "Online Receipts";
          this.modeofreceipt = "ONLINE";

          let grid: never[] = [];
          console.log(this.ChequesInBankData);
          if (this.bankid == 0) {
            for (let j = 0; j < this.ChequesInBankData.length; j++) {
              if (this.ChequesInBankData[j]['ptypeofpayment'] != "CHEQUE") {
                grid.push(this.ChequesInBankData[j]);
              }
            }
          }
          else {
            for (let j = 0; j < this.ChequesInBankData.length; j++) {
              if (this.ChequesInBankData[j]['ptypeofpayment'] != "CHEQUE" && this.ChequesInBankData[j]['pdepositbankid'] == this.bankid) {
                grid.push(this.ChequesInBankData[j]);
              }
            }
          }
          this.gridData = JSON.parse(JSON.stringify(grid))
          this.gridDatatemp = this.gridData;
          if (this.gridData.length > 0) {
            this.showicons = true
          }
          else {
            this.showicons = false
          }
          //this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));


        }

        Cleared(); {
          debugger;
          // $('#search').val("");
          this.chequeboxshoworhide = false
          this.amounttotal = 0;
          this.fromdate = ""; this.todate = "";
          this.datetitle = "Cleared Date"
          this.gridData = [];
          this.gridDatatemp = [];
          this.GridColumnsHide();
          this.brsdateshowhidecleared = true;
          this.brsdateshowhidereturned = false;
          this.status = "cleared";
          this.pdfstatus = "Cleared";
          this.modeofreceipt = "CLEAR";
          this.pageSetUp();
          this.GetChequesInBank(this.bankid, this.startindex, this.endindex, this._searchText);
          // this.cleared = 0;
          this.ChequesInBankForm.controls['pfrombrsdate'].setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
          this.ChequesInBankForm.controls['ptobrsdate'].setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
          let grid: never[] = [];
          if (this.bankid == 0) {
            for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
              if (this.ChequesClearReturnData[i]['pchequestatus'] == "Y") {
                grid.push(this.ChequesClearReturnData[i]);
              }
            }
          }
          else {
            for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
              if (this.ChequesClearReturnData[i]['pchequestatus'] == "Y" && this.ChequesClearReturnData[i]['pdepositbankid'] == this.bankid) {
                grid.push(this.ChequesClearReturnData[i]);
              }
            }
          }
          this.gridData = JSON.parse(JSON.stringify(grid))
          this.gridDatatemp = this.gridData
          if (this.gridData.length > 0) {
            this.showicons = true
          }
          else {
            this.showicons = false
          }
          // this.cleared = this.gridData.length;
          //this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
          // console.log(this.gridData);
          // this.gridData.filter(data => {
          //   debugger;
          //   // data.preceiptdate = this._commonService.getFormatDateGlobal((data.preceiptdate));
          //   // data.pdepositeddate = this._commonService.getFormatDateGlobal((data.pdepositeddate));
          //   // data.pCleardate = this._commonService.getFormatDateGlobal((data.pCleardate));
          // })
          // console.log(this.gridData);

          // custom page navigation
          // this.pageCriteria.totalrows = this.gridData.length;
          // this.pageCriteria.TotalPages = 1;
          // if (this.pageCriteria.totalrows > this.pageCriteria.pageSize)
          //   this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / this.pageCriteria.pageSize).toString()) + 1;
          // if (this.gridData.length < this.pageCriteria.pageSize) {
          //   this.pageCriteria.currentPageRows = this.gridData.length;
          // }
          // else {
          //   this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
          // }
          this.totalElements = this._countData["clear_count"];
          this.page.totalElements = this._countData["clear_count"];
          // this.page.totalPages = 1;
          if (this.page.totalElements > 10)
            this.page.totalPages = parseInt((this.page.totalElements / 10).toString()) + 1;
        }
        Cleared1(); {
          debugger;
          // $('#search').val("");
          this.datetitle = "Cleared Date"
          this.gridData = [];
          this.gridDatatemp = [];
          this.GridColumnsHide();
          this.brsdateshowhidecleared = true;
          this.brsdateshowhidereturned = false;
          this.status = "cleared";
          this.pdfstatus = "Cleared";
          this.modeofreceipt = "CLEAR";

          // this.cleared = 0;
          this.ChequesInBankForm.controls['pfrombrsdate'].setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
          this.ChequesInBankForm.controls['ptobrsdate'].setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
          let grid: never[] = [];
          if (this.bankid == 0) {
            for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
              if (this.ChequesClearReturnData[i]['pchequestatus'] == "Y") {
                grid.push(this.ChequesClearReturnData[i]);
              }
            }
          }
          else {
            for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
              if (this.ChequesClearReturnData[i]['pchequestatus'] == "Y" && this.ChequesClearReturnData[i]['pdepositbankid'] == this.bankid) {
                grid.push(this.ChequesClearReturnData[i]);
              }
            }
          }
          this.gridData = JSON.parse(JSON.stringify(grid))
          this.gridDatatemp = this.gridData
          if (this.gridData.length > 0) {
            this.showicons = true
          }
          else {
            this.showicons = false
          }
          // this.cleared = this.gridData.length;
          //this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));


        }
        Returned(); {
          debugger
          // $('#search').val("");
          this.chequeboxshoworhide = false
          this.amounttotal = 0;
          this.fromdate = ""; this.todate = "";
          this.datetitle = "Returned Date";
          this.gridData = [];
          this.gridDatatemp = [];
          this.GridColumnsHide();
          this.brsdateshowhidecleared = false;
          this.brsdateshowhidereturned = true;
          this.status = "returned";
          this.pdfstatus = "Returned";
          this.modeofreceipt = "RETURN";
          this.pageSetUp();
          // this.GetChequesInBank(this.bankid,this.startindex,this.endindex,this._searchText);
          this.GetChequesInBankforSearchDeposit(this.bankid, this.startindex, this.endindex, this._searchText); (this.bankid, this.startindex, this.endindex, this._searchText);
          this.BrsDateForm.controls['frombrsdate'].setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
          this.BrsDateForm.controls['tobrsdate'].setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
          let grid: never[] = [];
          // this.returned = 0;
          if (this.bankid == 0) {
            for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
              if (this.ChequesClearReturnData[i]['pchequestatus'] == "R") {
                grid.push(this.ChequesClearReturnData[i]);
              }
            }
          }
          else {
            for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
              if (this.ChequesClearReturnData[i]['pchequestatus'] == "R" && this.ChequesClearReturnData[i]['pdepositbankid'] == this.bankid) {
                grid.push(this.ChequesClearReturnData[i]);
              }
            }
          }
          this.gridData = JSON.parse(JSON.stringify(grid))
          this.gridDatatemp = this.gridData
          if (this.gridData.length > 0) {
            this.showicons = true
          }
          else {
            this.showicons = false
          }
          // this.returned = this.gridData.length;
          //this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
          // console.log(this.gridData)
          // this.gridData.filter(data => {
          //   // data.preceiptdate = this._commonService.getFormatDateGlobal((data.preceiptdate));
          //   // data.pdepositeddate = this._commonService.getFormatDateGlobal((data.pdepositeddate));
          //   // data.pCleardate = this._commonService.getFormatDateGlobal(data.pCleardate);
          // })

          // custom page navigation
          // this.pageCriteria.totalrows = this.gridData.length;
          // this.pageCriteria.TotalPages = 1;
          // if (this.pageCriteria.totalrows > this.pageCriteria.pageSize)
          //   this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / this.pageCriteria.pageSize).toString()) + 1;
          // if (this.gridData.length < this.pageCriteria.pageSize) {
          //   this.pageCriteria.currentPageRows = this.gridData.length;
          // }
          // else {
          //   this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
          // }
          this.totalElements = this._countData["return_count"];
          this.page.totalElements = this._countData["return_count"];
          // this.page.totalPages = 1;
          if (this.page.totalElements > 10)
            this.page.totalPages = parseInt((this.page.totalElements / 10).toString()) + 1;
        }
        Returned1(); {
          debugger
          // $('#search').val("");
          this.datetitle = "Returned Date";
          this.gridData = [];
          this.gridDatatemp = [];
          this.GridColumnsHide();
          this.brsdateshowhidecleared = false;
          this.brsdateshowhidereturned = true;
          this.status = "returned";
          this.pdfstatus = "Returned";
          this.modeofreceipt = "RETURN";
          this.BrsDateForm.controls['frombrsdate'].setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
          this.BrsDateForm.controls['tobrsdate'].setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
          let grid: never[] = [];
          // this.returned = 0;
          if (this.bankid == 0) {
            for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
              if (this.ChequesClearReturnData[i]['pchequestatus'] == "R") {
                grid.push(this.ChequesClearReturnData[i]);
              }
            }
          }
          else {
            for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
              if (this.ChequesClearReturnData[i]['pchequestatus'] == "R" && this.ChequesClearReturnData[i]['pdepositbankid'] == this.bankid) {
                grid.push(this.ChequesClearReturnData[i]);
              }
            }
          }
          this.gridData = JSON.parse(JSON.stringify(grid))
          this.gridDatatemp = this.gridData
          if (this.gridData.length > 0) {
            this.showicons = true
          }
          else {
            this.showicons = false
          }
          // this.returned = this.gridData.length;
          //this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));


        }
        this.GridColumnsShow(); {
          this.showhidegridcolumns = false;
          this.showhidegridcolumns2 = false;
          this.saveshowhide = true;
          this.brsdateshowhidecleared = false;
          this.brsdateshowhidereturned = false;
          this.hiddendate = true;
        }

        this.GridColumnsHide(); {
          // this.cleared = 0;
          // this.returned = 0;
          this.showhidegridcolumns = true;
          this.showhidegridcolumns2 = true;
          this.saveshowhide = false;
          this.hiddendate = false;
          // this.CountOfRecords();
        }

        this.CountOfRecords(); {
          this.all = 0;
          this.chequesdeposited = 0;
          this.onlinereceipts = 0;
          this.cleared = 0;
          this.returned = 0;
          // if (this.bankid == 0) {
          //   this.all = this.ChequesInBankData.length;
          // }
          // else {
          //   for (let j = 0; j < this.ChequesInBankData.length; j++) {
          //     if (this.ChequesInBankData[j].pdepositbankid == this.bankid) {
          //       this.all = this.all + 1;
          //     }
          //   }
          // }
          this.all = this._countData["total_count"];
          // if (this.bankid == 0) {
          //   for (let j = 0; j < this.ChequesInBankData.length; j++) {
          //     if (this.ChequesInBankData[j].ptypeofpayment != "CHEQUE") {
          //       this.onlinereceipts = this.onlinereceipts + 1;
          //     }
          //   }
          // }
          // else {
          //   for (let j = 0; j < this.ChequesInBankData.length; j++) {
          //     if (this.ChequesInBankData[j].ptypeofpayment != "CHEQUE" && this.ChequesInBankData[j].pdepositbankid == this.bankid) {
          //       this.onlinereceipts = this.onlinereceipts + 1;
          //     }
          //   }
          // }
          this.onlinereceipts = this._countData["others_count"];
          // if (this.bankid == 0) {
          //   for (let i = 0; i < this.ChequesInBankData.length; i++) {
          //     if (this.ChequesInBankData[i].ptypeofpayment == "CHEQUE") {
          //       this.chequesdeposited = this.chequesdeposited + 1;
          //     }
          //   }
          // }
          // else {
          //   for (let i = 0; i < this.ChequesInBankData.length; i++) {
          //     if (this.ChequesInBankData[i].ptypeofpayment == "CHEQUE" && this.ChequesInBankData[i].pdepositbankid == this.bankid) {
          //       this.chequesdeposited = this.chequesdeposited + 1;
          //     }
          //   }
          // }
          this.chequesdeposited = this._countData["cheques_count"];
          // if (this.bankid == 0) {
          //   for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
          //     if (this.ChequesClearReturnData[i].pchequestatus == "Y") {
          //       this.cleared = this.cleared + 1;
          //     }
          //   }
          // }
          // else {
          //   for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
          //     if (this.ChequesClearReturnData[i].pchequestatus == "Y" && this.ChequesClearReturnData[i].pdepositbankid == this.bankid) {
          //       this.cleared = this.cleared + 1;
          //     }
          //   }
          // }
          this.cleared = this._countData["clear_count"];
          // if (this.bankid == 0) {
          //   for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
          //     if (this.ChequesClearReturnData[i].pchequestatus == "R") {
          //       this.returned = this.returned + 1;
          //     }
          //   }
          // }
          // else {
          //   for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
          //     if (this.ChequesClearReturnData[i].pchequestatus == "R" && this.ChequesClearReturnData[i].pdepositbankid == this.bankid) {
          //       this.returned = this.returned + 1;
          //     }
          //   }
          // }
          this.returned = this._countData["return_count"];
        }

        // SelectBank(event, { target: { value: string, },}); {

        //   if (event.target.value == "") {
        //     this.bankid = 0;
        //     this.bankname = "";
        //     this.banknameshowhide = false;
        //   }
        //   else {
        //     this.banknameshowhide = true;
        //     for (let i = 0; i < this.BanksList.length; i++) {
        //       if (event.target.value == this.BanksList[i]['pdepositbankname']) {
        //         this.bankdetails = this.BanksList[i];
        //         break;
        //       }
        //     }

        //     this.bankid = this.bankdetails.pbankid;
        //     this.bankname = this.bankdetails.pdepositbankname;
        //     if (this.bankdetails.pbankbalance < 0) {
        //       this.bankbalance = Math.abs(this.bankdetails.pbankbalance)
        //       this.bankbalancetype = "Cr";
        //     }
        //     else if (this.bankdetails.pbankbalance == 0) {
        //       this.bankbalance = 0;
        //       this.bankbalancetype = "";
        //     }
        //     else {
        //       this.bankbalance = (this.bankdetails.pbankbalance)
        //       this.bankbalancetype = "Dr";
        //     }
        //   }
        //   //   this.GetChequesInBank(this.bankid);
        //   //this.CountOfRecords();
        //   this.GetChequesInBank_load(this.bankid);
        //   if (this.status == "all") {
        //     this.all();
        //   }
        //   if (this.status == "chequesdeposited") {
        //     this.chequesdeposited();
        //   }
        //   if (this.status == "onlinereceipts") {
        //     // this.OnlineReceipts();
        //   }
        //   if (this.status == "cleared") {
        //     this.cleared();
        //   }
        //   if (this.status == "returned") {
        //     this.returned();
        //   }
        //   this.GetBankBalance(this.bankid);
        //   this.ChequesInBankForm.controls['SearchClear'].setValue('');
        // }

        // CheckedClear(event: { target: any, }, data, never); {
        //   debugger
        //   let gridtemp = this.gridData.filter(a => {
        //     if (a['preceiptid'] == data.preceiptid) {
        //       return a;
        //     }
        //   })
        //   if (event.target.checked == true) {
        //     let receiptdate = this._commonService.getDateObjectFromDataBase(gridtemp[0]['pdepositeddate']);
        //     let chequecleardate = this.ChequesInBankForm.controls['pchequecleardate'].value;
        //     if (new Date(chequecleardate).getTime() >= new Date(receiptdate).getTime()) {
        //       if(parseInt(this.roleid) !== 2){
        //       this.gridData.forEach(element=>{
        //         if(element.['pChequenumber'] == data.pChequenumber && data.cheque_bank == element.cheque_bank && data.receipt_branch_name == element.receipt_branch_name){
        //           element.pdepositstatus = true;
        //           element.preturnstatus = false;
        //           element.pchequestatus = "Y";
        //         }
        //       })
        //     }else{
        //       data.pdepositstatus = true;
        //       data.preturnstatus = false;
        //       data.pchequestatus = "Y";
        //     }
        //     }
        //     else {
        //       data.pdepositstatus = false;
        //       data.pchequestatus = "N";
        //       // $('#' + event.target.id + '').prop("checked", false);
        //       event.target.checked = false;
        //       //this._commonService.showWarningMessage("Cheque Clear Date Should be Greater than or Equal to Deposited Date");

        //     }
        //   }
        //   else {
        //     data.pdepositstatus = false;
        //     data.pchequestatus = "N";
        //     this.gridData.forEach(element=>{
        //       if(element.pChequenumber == data.pChequenumber && data.cheque_bank == element.cheque_bank){
        //         element.pdepositstatus = false;
        //         element.preturnstatus = false;
        //         element.pchequestatus = "N";
        //         if(this.status !='autobrs')
        //         {
        //           element.preferencetext = "";
        //         }

        //       }
        //     })
        //     data.preturnstatus = "";
        //     let index = this.gridData.indexOf(data);
        //     if(this.status !='autobrs'){
        //     $("#preferencetext"+index).prop("value","");
        //     }
        //   }
        //   for (let i = 0; i < this.gridData.length; i++) {
        //     if (this.gridData[i]['preceiptid'] == data.preceiptid) {
        //       this.gridData[i] = data;
        //       break;
        //     }
        //   }
        //   this.selectedamt=0
        // this.gridData.forEach(element => {
        //   if(element['pdepositstatus']){
        //     this.selectedamt+=element['ptotalreceivedamount']
        //   }
        // });
        // //  this.gridData.filter(ele=>ele.pdepositstatus==true?this.selectedamt+=ele.ptotalreceivedamount:this.selectedamt+=0)
        // }

        // CheckedReturn(event: { target: { checked: boolean, }; }, data: { preceiptid: any, preturnstatus: boolean, pdepositstatus: boolean, pchequestatus: string, pChequenumber: any, }) {
        //   debugger;
        //   let gridtemp = this.gridData.filter(a => {
        //     if (a['preceiptid'] == data.preceiptid) {
        //       return a;
        //     }
        //   })
        //   this.PopupData = data;
        //   //if (event.target.checked == true) {

        //     // let rcpt = this.datepipe.transform(gridtemp[0].pdepositeddate, 'dd/MM/yyyy');
        //     //let receiptdate = this._commonService.getDateObjectFromDataBase(gridtemp[0].pdepositeddate);
        //    // let chequecleardate = this.ChequesInBankForm.controls['pchequecleardate.value'];

        //     //if (new Date(chequecleardate).getTime() >= new Date(receiptdate).getTime()) {
        //       // this.gridData.forEach(element=>{
        //       //   if(data.pChequenumber == element.pChequenumber && data.cheque_bank == element.cheque_bank){
        //       //     element.preturnstatus = true;
        //       //     element.pdepositstatus = false;
        //       //     element.pchequestatus = "R";
        //       //   }
        //       // })
        //       //  data.preturnstatus = true;
        //       //  data.pdepositstatus = false;
        //       //  data.pchequestatus = "R";
        //       // $("#cancelcharges").val(this.chequereturncharges);
        //       // this.chequenumber = data.pChequenumber;
        //       // $('#add-detail').modal('show');
        //     //}
        //     //else {
        //       // data.preturnstatus = false;
        //       // data.pchequestatus = "N";
        //       // //$('#' + data.preceiptid + '').prop("checked", false);
        //       // event.target.checked = false;
        //       // this._commonService.showWarningMessage("Cheque Clear Date Should be Greater than or Equal Deposited Date");
        //     //}

        //   }
        // else {
        //   this.data.preturnstatus = false,
        //   this.data.pchequestatus = "N",
        // this.gridData.forEach(element=>{
        //   if(element.pChequenumber == data.pChequenumber){
        //     element.preturnstatus=false;
        //     element.pchequestatus="N";
        //     element.pactualcancelcharges="";
        //   }
        // })
      })
     // for (let i = 0; i < this.gridData.length; i++) {
      //  if (this.gridData[i].preceiptid == data.preceiptid) {
      //   this.gridData[i] = data;
      //   break;
      //  }
    //  }
  }

  validateSave(): boolean {
    let isvalid = true;
    isvalid = this.checkValidations(this.ChequesInBankForm, isvalid);
    let isvalidbool

    let chequecleardate = this.ChequesInBankForm.controls['pchequecleardate'].value;
    let transactiondate = this.ChequesInBankForm.controls['ptransactiondate'].value;

    if (new Date(transactiondate).getTime() < new Date(chequecleardate).getTime()) {
      this._commonService.showWarningMessage('Transaction Date Should be Greater than or Equal to Cheque Clear Date');
      isvalid = false;
    }
    if (this.modeofreceipt != 'ONLINE-AUTO') {
      isvalidbool = this.validateDuplicates();
    } else {
      isvalidbool = 0
    }
    let isemptyvalues = this.emptyValuesFound();
    if (this.DataForSaving.length > 0) {
      isvalid = true;
    } else {
      let selectrecords = this.gridData.filter(element => element['pchequestatus'] == "Y" || element['pchequestatus'] == "R");
      if (!this.showhidegridcolumns) {
        if (isvalidbool > 0) {
          this._commonService.showWarningMessage("Duplicates Found please enter unique values");
          isvalid = false;
        } else if (isemptyvalues) {
          this._commonService.showWarningMessage("Please enter all input fields!");
          isvalid = false;
        } else if (selectrecords.length == 0) {
          this._commonService.showWarningMessage("Please Select records");
          isvalid = false;
        }
      }
    }
    if (isvalid) {
      if (!confirm("Do You Want To Save ?")) {
        isvalid = false;
      }
    }
    return isvalid;
  }
  Save() {
    debugger
    this.DataForSaving = [];
    if (this.status == 'autobrs') {
      this.DataForSaving = this.autoBrsData;

      if (this.DataForSaving.length != 0) {
        if (confirm("Do you want to save ?")) {
          this.gridLoading = true;
          // for (let i = 0; i < this.DataForSaving.length; i++) {
          //   this.DataForSaving[i].pCreatedby = this._commonService.getcreatedby();

          //   this.DataForSaving[i].pdepositeddate = this._commonService.getFormatDateNormal(this._commonService.getDateObjectFromDataBase(this.DataForSaving[i]['pdepositeddate']));
          //   this.DataForSaving[i].preceiptdate = this._commonService.getFormatDateNormal(this._commonService.getDateObjectFromDataBase(this.DataForSaving[i]['preceiptdate']));
          //   this.DataForSaving[i].pchequedate = this._commonService.getFormatDateNormal(this._commonService.getDateObjectFromDataBase(this.DataForSaving[i]['pchequedate']));
          //   this.DataForSaving[i].pipaddress = this._commonService.getipaddress();
          //   this.DataForSaving[i].pchequestatus = "Y";
          //   this.DataForSaving[i].preferencetext = this.DataForSaving[i]['preferencetext']+'-'+(new Date().getFullYear().toString());
          // }

          this.ChequesInBankForm.controls['pchequesOnHandlist'].setValue(this.DataForSaving);
          let chequesinbankdata = this.ChequesInBankForm.value;
          // chequesinbankdata.pchequecleardate = this._commonService.getFormatDateNormal(chequesinbankdata.pchequecleardate);

          //chequesinbankdata.ptransactiondate = this._commonService.getFormatDateNormal(chequesinbankdata.ptransactiondate);

          let form = JSON.stringify(chequesinbankdata);
          // let form = JSON.stringify(this.ChequesInBankForm.value);
          console.log(form)
          this._accountingtransaction.SaveChequesInBank(form).subscribe((res: any) => {
            if (res[0] == true) {
              this.gridLoading = false;
              this._commonService.showSuccessMessage();
              this.Clear();
              this.autoBrsData = [];
            }
            this.disablesavebutton = false;
            this.buttonname = "Save";
          }, (error: any) => {
            this.gridLoading = false;
            this._commonService.showErrorMessage(error);
            this.disablesavebutton = false;
            this.buttonname = "Save";
            // this.Clear(); 
          });
        } else {
          this.gridLoading = false;
        }
      }
      else {
        this.disablesavebutton = false;
        this.buttonname = "Save";
        this._commonService.showWarningMessage("Select atleast one record ");
      }

    } else {


      let isValid = true;

      if (this.validateSave()) {
        this.disablesavebutton = true;
        this.buttonname = "Processing";

        for (let i = 0; i < this.gridData.length; i++) {
          if (this.gridData[i]['pchequestatus'] == "Y" || this.gridData[i]['pchequestatus'] == "R") {
            this.gridData[i]['pchequestatus'] = this.gridData[i]['pchequestatus'];
            this.gridData[i]['pactualcancelcharges'] = this.gridData[i]['pactualcancelcharges'];
            this.DataForSaving.push(this.gridData[i]);
          }
        }
        if (this.DataForSaving.length != 0) {
          for (let i = 0; i < this.DataForSaving.length; i++) {
            // this.DataForSaving[i].pCreatedby = this._commonService.getcreatedby();

            // this.DataForSaving[i].pdepositeddate = this._commonService.getFormatDateNormal(this._commonService.getDateObjectFromDataBase(this.DataForSaving[i]['pdepositeddate']));
            // this.DataForSaving[i].preceiptdate = this._commonService.getFormatDateNormal(this._commonService.getDateObjectFromDataBase(this.DataForSaving[i]['preceiptdate']));
            // this.DataForSaving[i].pchequedate = this._commonService.getFormatDateNormal(this._commonService.getDateObjectFromDataBase(this.DataForSaving[i].pchequedate));
            // this.DataForSaving[i].pipaddress = this._commonService.getipaddress();
            // this.DataForSaving[i].preferencetext = this.DataForSaving[i].preferencetext+'-'+(new Date().getFullYear().toString());
          }

          this.ChequesInBankForm.controls['pchequesOnHandlist'].setValue(this.DataForSaving);
          let chequesinbankdata = this.ChequesInBankForm.value;
          chequesinbankdata.pchequecleardate = this._commonService.getFormatDateNormal(chequesinbankdata.pchequecleardate);

          chequesinbankdata.ptransactiondate = this._commonService.getFormatDateNormal(chequesinbankdata.ptransactiondate);

          let form = JSON.stringify(chequesinbankdata);
          // let form = JSON.stringify(this.ChequesInBankForm.value);
          console.log(form)

          this._accountingtransaction.SaveChequesInBank(form).subscribe((data: any[]) => {
            debugger;
            if (data) {
              let receipt = data[1];
              if (receipt.split('$')[0] == 'R') {
                let mo = receipt.split('$')[1];
                // window.open('/#/ChequeReturnInvoice?id=' + mo + '', "_blank"); 
                this._noticeservice.GetChequeReturnInvoice(this._commonService.getschemaname(), mo).subscribe((res: any) => {
                  console.log("Cheque return data is:", res);
                  this.previewdetails = res;
                  for (let i = 0; i < this.previewdetails.length; i++) {
                    let addresssplit = this.previewdetails[i]["paddress"].split(',');

                    this.previewdetails[i].paddress = addresssplit;
                    let incidentalcharges = JSON.stringify(this.previewdetails[i].incidentalcharges);
                    if (incidentalcharges == "{}" || isNullOrEmptyString(this.previewdetails[i].incidentalcharges)) {
                      this.previewdetails[i].incidentalcharges = 0;
                    }
                  }
                  this.pdfContentData()

                })
                this._noticeservice.GetChequeReturnVoucher(this._commonService.getschemaname(), mo).subscribe((res: any) => {
                  this.chequerwturnvoucherdetails = res
                  this.chequereturnvoucherpdf()

                })
              }
              this._commonService.showSuccessMessage();
              this.Clear();
            }
            this.disablesavebutton = false;
            this.buttonname = "Save";
          }, (error: any) => {
            this._commonService.showErrorMessage(error);
            this.disablesavebutton = false;
            this.buttonname = "Save";
            // this.Clear(); 
          });
        }
        else {
          this.disablesavebutton = false;
          this.buttonname = "Save";
          this._commonService.showWarningMessage("Select atleast one record ");
        }
      }

    }
  }

  // Clear() {

  //   this.ChequesInBankForm.reset();
  //   this.ngOnInit();
  //   this.gridData=[];
  //   this.modeofreceipt = 'CHEQUE';
  //   this.status='chequesdeposited';
  //   this._searchText="";
  //   this.GetChequesInBank_load(this.bankid);
  //   $("#bankselection").val("");
  //   $("#search").val("");
  //   this.fromdate="";
  //   this.todate="";
  //   this.ChequesInBankValidation = {};
  //   this.preferdrows=false
  // }

  ShowBrsClear() {
    debugger;
    //$("#search").val("");
    this._searchText = "";
    this.gridData = [];
    this.cleared = 0;
    let fromdate = this.ChequesInBankForm.controls['pfrombrsdate'].value;
    let todate = this.ChequesInBankForm.controls['ptobrsdate'].value;
    if (fromdate != null && todate != null) {
      this.OnBrsDateChanges(fromdate, todate);
      if (this.validate == false) {
        // fromdate = this.datepipe.transform(fromdate, 'dd-MMM-yyyy')
        // todate = this.datepipe.transform(todate, 'dd-MMM-yyyy')
        fromdate = this._commonService.getFormatDateNormal(fromdate);
        todate = this._commonService.getFormatDateNormal(todate);
        this.fromdate = fromdate;
        this.todate = todate;
        this.validatebrsdateclear = false;
        this.pageSetUp();
        this.GetDataOnBrsDates(fromdate, todate, this.bankid);
        // if (this.bankid == 0) {
        //   this.ChequesInBankForm.controls.pfrombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
        //   this.ChequesInBankForm.controls.ptobrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
        // }
        // else {
        //   this.ChequesInBankForm.controls.ptobrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankdetails.ptobrsdate));
        //   this.ChequesInBankForm.controls.pfrombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankdetails.pfrombrsdate));
        // }

      }
      else {
        this.validatebrsdateclear = true;
      }
    }
    else {
      this._commonService.showWarningMessage("select fromdate and todate");
    }
  }

  ShowBrsReturn() {
    debugger;
    // $("#search").val("");
    this._searchText = "";
    this.gridData = [];
    this.returned = 0;
    let fromdate = this.BrsDateForm.controls['frombrsdate'].value;
    let todate = this.BrsDateForm.controls['tobrsdate'].value;
    if (fromdate != null && todate != null) {
      this.OnBrsDateChanges(fromdate, todate);
      if (this.validate == false) {
        // fromdate = this.datepipe.transform(fromdate, 'dd-MMM-yyyy')
        // todate = this.datepipe.transform(todate, 'dd-MMM-yyyy')
        fromdate = this._commonService.getFormatDateNormal(fromdate);
        todate = this._commonService.getFormatDateNormal(todate);
        this.fromdate = fromdate;
        this.todate = todate;
        this.validatebrsdatereturn = false;
        this.pageSetUp();
        this.GetDataOnBrsDates(fromdate, todate, this.bankid);
        // if (this.bankid == 0) {
        //   this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
        //   this.BrsDateForm.controls.tobrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
        // }
        // else {
        //   this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankdetails.pfrombrsdate));
        //   this.BrsDateForm.controls.tobrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankdetails.ptobrsdate));
        // }


      }
      else {
        this.validatebrsdatereturn = true;
      }
    }
    else {
      this._commonService.showWarningMessage("select fromdate and todate");
    }
  }

  GetDataOnBrsDates(frombrsdate: any, tobrsdate: any, bankid: any) {
    let DataFromBrsDatesChequesInBank = this._accountingtransaction.DataFromBrsDatesChequesInBank(frombrsdate, tobrsdate, bankid, this.modeofreceipt, this._searchText, this.startindex, this.endindex);
    let GetChequesRowCount = this._accountingtransaction.GetChequesRowCount(this.bankid, this._searchText, frombrsdate, tobrsdate, "CHEQUESINBANK", this.modeofreceipt);

    //this._accountingtransaction.DataFromBrsDatesChequesInBank(frombrsdate, tobrsdate, bankid,this.modeofreceipt,this._searchText)
    forkJoin(DataFromBrsDatesChequesInBank, GetChequesRowCount)
      .subscribe(
        (clearreturndata: any) => {
          debugger;
          let kk = [];
          this.ChequesClearReturnDataBasedOnBrs = clearreturndata[0]['pchequesclearreturnlist'];
          for (let i = 0; i < this.ChequesClearReturnDataBasedOnBrs.length; i++) {
            if (this.status == "cleared" && this.ChequesClearReturnDataBasedOnBrs[i].pchequestatus == "Y") {
              kk.push(this.ChequesClearReturnDataBasedOnBrs[i]);
              // this.cleared = this.cleared + 1;
            }
            if (this.status == "returned" && this.ChequesClearReturnDataBasedOnBrs[i].pchequestatus == "R") {
              kk.push(this.ChequesClearReturnDataBasedOnBrs[i])
              // this.returned = this.returned + 1;
            }
          }
          this._countData = clearreturndata[1];
          this.CountOfRecords();
          //this.gridData = kk;
          this.gridData.filter(data => {
            // data.preceiptdate = this._commonService.getFormatDateGlobal((data.preceiptdate));
            // data.pdepositeddate = this._commonService.getFormatDateGlobal((data.pdepositeddate));
            // data.pCleardate = this._commonService.getFormatDateGlobal((data.pCleardate));
          })
          if (this.status == "cleared") {
            this.totalElements = this._countData["clear_count"];
            this.page.totalElements = this._countData["clear_count"];
          } else {
            this.totalElements = this._countData["return_count"];
            this.page.totalElements = this._countData["return_count"];
          }
          // this.page.totalPages = 1;
          if (this.page.totalElements > 10)
            this.page.totalPages = parseInt((this.page.totalElements / 10).toString()) + 1;

        }, (error: any) => { this._commonService.showErrorMessage(error) })
  }

  // GetDataOnBrsDates1(frombrsdate: any, tobrsdate: any, bankid: any) {
  //   // let DataFromBrsDatesChequesInBank=this._accountingtransaction.DataFromBrsDatesChequesInBank(frombrsdate, tobrsdate, bankid,this.modeofreceipt,this._searchText,this.startindex,this.endindex);
  //   // let GetChequesRowCount=this._accountingtransaction.GetChequesRowCount(this.bankid,this._searchText,frombrsdate, tobrsdate);

  //   this._accountingtransaction.DataFromBrsDatesChequesInBank(frombrsdate, tobrsdate, bankid,this.modeofreceipt,this._searchText,this.startindex,this.endindex)
  //   // forkJoin(DataFromBrsDatesChequesInBank,GetChequesRowCount)
  //   .subscribe(
  //     (      clearreturndata: { [x: string]: any; }) => {
  //       debugger;
  //       let kk = [];
  //       this.ChequesClearReturnDataBasedOnBrs = clearreturndata['pchequesclearreturnlist'];
  //       for (let i = 0; i < this.ChequesClearReturnDataBasedOnBrs.length; i++) {
  //         if (this.status == "cleared" && this.ChequesClearReturnDataBasedOnBrs[i].pchequestatus == "Y") {
  //           kk.push(this.ChequesClearReturnDataBasedOnBrs[i]);
  //           // this.cleared = this.cleared + 1;
  //         }
  //         if (this.status == "returned" && this.ChequesClearReturnDataBasedOnBrs[i].pchequestatus == "R") {
  //           kk.push(this.ChequesClearReturnDataBasedOnBrs[i])
  //           // this.returned = this.returned + 1;
  //         }
  //       }

  //       //this.gridData = kk;
  //       this.gridData.filter(data => {
  //         // data.preceiptdate = this._commonService.getFormatDateGlobal((data.preceiptdate));
  //         // data.pdepositeddate = this._commonService.getFormatDateGlobal((data.pdepositeddate));
  //         // data.pCleardate = this._commonService.getFormatDateGlobal((data.pCleardate));
  //       })

  //     }, (error: any) => { this._commonService.showErrorMessage(error) })
  // }

  CancelChargesOk(value: string) {
    debugger;
    if (value == "" || !(Number(value) >= this.chequereturncharges)) {
      this._commonService.showWarningMessage("Minimum Amount Should Be " + this.chequereturncharges);
      // $("#cancelcharges").val(this.chequereturncharges);
    }
    else {
      for (let i = 0; i < this.gridData.length; i++) {
        if (this.gridData[i]['preceiptid'] == this.PopupData.preceiptid) {
          // if ((this.gridData[i].pchequestatus == 'R') && (this.gridData[i].preturnstatus)) {
          //this.gridData[i].pactualcancelcharges = value;
        }
      }
      //$('#add-detail').modal('hide');
    }
  }
  OnBrsDateChanges(fromdate: number, todate: number) {

    if (fromdate > todate) {
      this.validate = true;
    }
    else {
      this.validate = false;
    }
  }

  // DateChange(event) {
  //   this.GetChequesInBank(this.bankid)
  // }
  // showErrorMessage(errormsg: string) {
  //   this.toastr.error(errormsg);
  // }
  checkValidations(group: FormGroup, isValid: boolean): boolean {

    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
        console.log(key + "-->" + isValid);
      })
    }
    catch (e) {
      //this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  // GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
  //   try {
  //     let formcontrol;
  //     formcontrol = formGroup.get(key);
  //     if (formcontrol) {
  //       if (formcontrol instanceof FormGroup) {
  //         this.checkValidations(formcontrol, isValid)
  //       }
  //       else if (formcontrol.validator) {
  //         this.ChequesInBankValidation[key] = '';
  //         if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
  //           let lablename;
  //           lablename = (document.getElementById(key) as HTMLInputElement).title;
  //           let errormessage;
  //           for (const errorkey in formcontrol.errors) {
  //             if (errorkey) {
  //               errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
  //               this.ChequesInBankValidation[key] += errormessage + ' ';
  //               isValid = false;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  //   catch (e) {
  //    // this.showErrorMessage(e);
  //     return false;
  //   }
  //   return isValid;
  // }
  // showErrorMessage(errormsg: string) {
  //   this._commonService.showErrorMessage(errormsg);
  // }
  // BlurEventAllControll(fromgroup: FormGroup) {
  //   try {
  //     Object.keys(fromgroup.controls).forEach((key: string) => {
  //       this.setBlurEvent(fromgroup, key);
  //     })
  //   }
  //   catch (e) {
  //     this.showErrorMessage(e);
  //     return false;
  //   }
  // }
  // setBlurEvent(fromgroup: FormGroup, key: string) {
  //   try {
  //     let formcontrol;
  //     formcontrol = fromgroup.get(key);
  //     if (formcontrol) {
  //       if (formcontrol instanceof FormGroup) {
  //         this.BlurEventAllControll(formcontrol)
  //       }
  //       else {
  //         if (formcontrol.validator)
  //           fromgroup.get(key).valueChanges.subscribe(() => { this.GetValidationByControl(fromgroup, key, true) })
  //       }
  //     }
  //   }
  //   catch (e) {
  //     //this.showErrorMessage(e);
  //     return false;
  //   }
  // }


  public group: any[] = [{
    field: 'preceiptdate'
  }, {
    field: 'pChequenumber'
  }
  ];
  // public allData(): ExcelExportData {
  //   const result: ExcelExportData = {
  //     data: process(this.gridData, { group: this.group, sort: [{ field: 'preceiptdate', dir: 'desc' }, { field: 'pChequenumber', dir: 'desc' }] }).data,
  //     group: this.group
  //   };

  //   return result;
  // }

  // chequesStatusInfoGrid() {
  //   debugger;
  //   $("#chequescss").addClass("active");
  //   $("#allcss").removeClass("active");
  //   let grid: never[] = [];
  //   for (let i = 0; i < this.ChequesInBankData.length; i++) {
  //     if (this.ChequesInBankData[i]['ptypeofpayment'] == "CHEQUE") {
  //       //this.ChequesInBankData[i]["chequeStatus"] = "Deposited";
  //       grid.push(this.ChequesInBankData[i]);
  //     }
  //   }

  //   for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
  //     if (this.ChequesClearReturnData[i]['pchequestatus'] == "Y") {
  //       //this.ChequesClearReturnData[i]["chequeStatus"] = "Cleared";
  //       grid.push(this.ChequesClearReturnData[i]);
  //     }
  //   }

  //   for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
  //     if (this.ChequesClearReturnData[i]['pchequestatus'] == "R") {
  //       this.ChequesClearReturnData[i]["chequeStatus"] = "Returned";
  //       grid.push(this.ChequesClearReturnData[i]);
  //     }
  //   }

  //   this.displayGridDataBasedOnForm = grid;
  //   this.displayGridDataBasedOnFormTemp = JSON.parse(JSON.stringify(grid))
  //   console.log("Mixed Grid->", this.displayGridDataBasedOnForm)
  //   debugger;
  //   this.setPageModel();
  //   this.pageCriteria.totalrows = this.displayGridDataBasedOnForm.length;
  //   this.pageCriteria.TotalPages = 1;
  //   if (this.pageCriteria.totalrows > this.pageCriteria.pageSize)
  //     this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / this.pageCriteria.pageSize).toString()) + 1;
  //   if (this.displayGridDataBasedOnForm.length < this.pageCriteria.pageSize) {
  //     this.pageCriteria.currentPageRows = this.displayGridDataBasedOnForm.length;
  //   }
  //   else {
  //     this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
  //   }

  // }


  pdfOrprint(printorpdf: any) {
    debugger;
    this.Totlaamount = 0;
    let GetChequesInBankData = this._accountingtransaction.GetChequesInBankData(this.bankid, 0, 99999, this.modeofreceipt, this._searchText, "PDF");
    let ChequesClearReturnData = this._accountingtransaction.DataFromBrsDatesChequesInBank(this.fromdate, this.todate, this.bankid, this.modeofreceipt, this._searchText, 0, 99999);
    //this._accountingtransaction.GetChequesInBankData(this.bankid,0,999999,this.modeofreceipt,this._searchText,"PDF")
    forkJoin(GetChequesInBankData, ChequesClearReturnData)
      .subscribe(result => {
        let gridData: any;
        debugger;
        if (this.pdfstatus == "Cleared" || this.pdfstatus == "Returned") {
          //gridData = result[1]["pchequesclearreturnlist"];
        }
        else {
          //gridData = result[0].pchequesOnHandlist;
        }
        // this.ChequesClearReturnData = result.pchequesclearreturnlist;

        let rows: any[][] = [];
        let reportname = "Cheques In Bank";
        let gridheaders;
        let colWidthHeight;
        if (this.pdfstatus == "Cleared" || this.pdfstatus == "Returned") {
          colWidthHeight = {
            0: { cellWidth: 'auto', halign: 'center' }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 15, halign: 'right' }, 3: { cellWidth: 20, halign: 'center' },
            4: { cellWidth: 'auto', halign: 'center' }, 5: { cellWidth: 'auto', halign: 'center' },
            6: { cellWidth: 'auto', halign: 'center' }, 7: { cellWidth: 'auto' }, 8: { cellWidth: 'auto' },
            9: { cellWidth: 'auto' }, 10: { cellWidth: 'auto' }, 11: { cellWidth: 'auto' }
          }
          gridheaders = ["Cheque/ Reference No.", "Branch Name", "Amount", "Receipt ID", "Receipt Date", "Deposited Date", this.datetitle, "Transaction \nMode", "Cheque Bank Name", "Account\nNo", "Cheque Branch Name", "Party"];
        }
        else {
          colWidthHeight = {
            0: { cellWidth: 'auto', halign: 'center' }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 15, halign: 'right' },
            3: { cellWidth: 20, halign: 'center' },
            4: { cellWidth: 'auto', halign: 'center' },
            5: { cellWidth: 'auto', halign: 'center' }, 6: { cellWidth: 'auto' }, 7: { cellWidth: 'auto' }, 8: { cellWidth: 'auto' }, 9: { cellWidth: 'auto' }, 10: { cellWidth: 'auto' }

          }
          gridheaders = ["Cheque/ Reference No.", "Branch Name", "Amount", "Receipt ID", "Receipt Date", "Deposited Date", "Transaction \nMode", "Cheque Bank Name", "Account\nNo", "Cheque Branch Name", "Party"];
        }




        gridData.forEach((element: { preceiptdate: any; pdepositeddate: any; pCleardate: any; ptotalreceivedamount: number; pChequenumber: any; pbranchname: any; preceiptid: any; ptypeofpayment: any; cheque_bank: any; subscriberbankaccountno: any; receipt_branch_name: any; ppartyname: any; }) => {
          debugger;
          let receiptdate = element.preceiptdate;

          let datereceipt = this._commonService.getFormatDateGlobal(receiptdate);
          let depositeddate = this._commonService.getFormatDateGlobal(element.pdepositeddate);
          let returneddate = this._commonService.getFormatDateGlobal(element.pCleardate);
          //let  DateFormat4= this._CommonService.getDateObjectFromDataBase(receiptdate);

          let totalreceivedamt;
          if (element.ptotalreceivedamount != 0) {
            totalreceivedamt = this._commonService.currencyformat(element.ptotalreceivedamount);
            totalreceivedamt = this._commonService.convertAmountToPdfFormat(totalreceivedamt);
            this.Totlaamount += element.ptotalreceivedamount;
          }
          else {
            totalreceivedamt = "";
          }
          // totalreceivedamt = this._commonService.convertAmountToPdfFormat(totalreceivedamt);
          let temp
          if (this.pdfstatus == "Cleared" || this.pdfstatus == "Returned") {
            temp = [element.pChequenumber, element.pbranchname, totalreceivedamt, element.preceiptid, datereceipt, depositeddate, returneddate, element.ptypeofpayment, element.cheque_bank, element.subscriberbankaccountno, element.receipt_branch_name, element.ppartyname];
          }
          else {
            temp = [element.pChequenumber, element.pbranchname, totalreceivedamt, element.preceiptid, datereceipt, depositeddate, element.ptypeofpayment, element.cheque_bank, element.subscriberbankaccountno, element.receipt_branch_name, element.ppartyname];
          }
          rows.push(temp);
        });
        this.amounttotal = this.Totlaamount;
        // pass Type of Sheet Ex : a4 or lanscspe  
        // let amounttotal = this._commonService.convertAmountToPdfFormat(this._commonService.currencyformat(this.amounttotal));
        // this._commonService._downloadchequesReportsPdf(reportname, rows, gridheaders, colWidthHeight, "landscape","", "", "", printorpdf,amounttotal);
      });
  }

  pdf(printorpdf: any, type: string) {
    debugger;
    this.Totlaamount = 0;
    let rows: any[][] = [];
    let brstype = ''
    type == 'Y' ? brstype = 'Cleared' : type == 'N' ? brstype = 'Pending' : brstype = 'Cleared and Pending'

    let reportname = "Auto BRS (" + brstype + " )";
    let gridheaders;
    let colWidthHeight;
    let gridData: any = []

    //    this._accountingtransaction.GetPendingautoBRSDetails(this._commonService.getschemaname(),type).subscribe((res: any)=>{

    //       gridData=res
    //     gridheaders = ["Cheque No.","Transaction Date", "Upload Date", "Received Amt", "Mode of Receipt", "Receipt Type", "Referece Text"];
    //       colWidthHeight = {
    //         0: { cellWidth: 'auto', halign: 'left' },1: { cellWidth: 'auto',halign: 'left' }, 2: { cellWidth: 'auto', halign: 'left' }, 
    //         3: { cellWidth: 'auto', halign: 'right' }, 
    //         4: { cellWidth: 'auto', halign: 'left' },
    //          5: { cellWidth: 'auto', halign: 'left' },
    //          6: { cellWidth: 'auto', halign: 'left' }

    //       }

    //     gridData.forEach((element: { transactiondate: any; puploadeddate: any; ptotalreceivedamount: any; pChequenumber: any; pmodofreceipt: any; preceiptype: any; preferencetext: any; }) => {
    //       debugger;
    //       let transactiondate
    //       let uploaddaate
    //       let receivedamt
    //       if(element.transactiondate){
    //         transactiondate=this._commonService.getFormatDateGlobal(element.transactiondate);
    //       }else{
    //         transactiondate='NA'
    //       }
    //       if(element.puploadeddate){
    //         uploaddaate=this._commonService.getFormatDateGlobal(element.puploadeddate);
    //       }else{
    //         uploaddaate='NA'
    //       }
    //       if(element.ptotalreceivedamount){
    //         receivedamt=this._commonService.convertAmountToPdfFormat(element.ptotalreceivedamount);
    //       }else{
    //         receivedamt='NA'
    //       }
    //       let temp

    //         temp = [element.pChequenumber,transactiondate,uploaddaate,receivedamt,element.pmodofreceipt,element.preceiptype,element.preferencetext];

    //       rows.push(temp);
    //     });
    //  //   this.amounttotal=this.Totlaamount;
    //     // pass Type of Sheet Ex : a4 or lanscspe  
    //     let amounttotal = this._commonService.convertAmountToPdfFormat(this._commonService.currencyformat(this.amounttotal));
    //     this._commonService._downloadPendingReportsPdf(reportname, rows, gridheaders, colWidthHeight, "landscape", printorpdf);
    //   this.exportautobrs(gridData,type)
    //   })
  }
  //  exportautobrs(gridData: { transactiondate: any; puploadeddate: any; ptotalreceivedamount: any; pChequenumber: any; pmodofreceipt: any; preceiptype: any; preferencetext: any; }[],type: string){
  //   let brstype=''
  //    type=='Y'?brstype='Cleared':type=='N'?brstype='Pending':brstype='Cleared and Pending'
  //  let rows: { "Cheque No.": any; "Transaction Date": any; "Upload Date": any; "Received Amt": any; "Mode of Receipt": any; "Receipt Type": any; "Reference Text": any; }[]=[]
  //   gridData.forEach((element: { transactiondate: any; puploadeddate: any; ptotalreceivedamount: any; pChequenumber: any; pmodofreceipt: any; preceiptype: any; preferencetext: any; }) => {
  //     debugger;
  //     let transactiondate
  //     let uploaddaate
  //     let receivedamt
  //     if(element.transactiondate){
  //       transactiondate=this._commonService.getFormatDateGlobal(element.transactiondate);
  //     }else{
  //       transactiondate='NA'
  //     }
  //     if(element.puploadeddate){
  //       uploaddaate=this._commonService.getFormatDateGlobal(element.puploadeddate);
  //     }else{
  //       uploaddaate='NA'
  //     }
  //     if(element.ptotalreceivedamount){
  //       receivedamt=this._commonService.convertAmountToPdfFormat(element.ptotalreceivedamount);
  //     }else{
  //       receivedamt='NA'
  //     }

  //   let  dataobject = { 
  //       "Cheque No.": element.pChequenumber,
  //       "Transaction Date":transactiondate,
  //       "Upload Date": uploaddaate,
  //       "Received Amt": receivedamt,
  //       "Mode of Receipt": element.pmodofreceipt,
  //       "Receipt Type": element.preceiptype,
  //       "Reference Text": element.preferencetext,      
  //     }
  //     rows.push(dataobject);
  //   });
  //   this._commonService.exportAsExcelFile(rows, 'Auto BRS ('+brstype+" )");
  //  }
  // GetChequesInBank(bankid: any, startindex: any, endindex: any, _searchText: string) {
  //   throw new Error('Method not implemented.');
  // }
  All() {
    throw new Error('Method not implemented.');
  }
  ChequesDeposited() {
    throw new Error('Method not implemented.');
  }
  Cleared() {
    throw new Error('Method not implemented.');
  }
  Returned() {
    throw new Error('Method not implemented.');
  }
  // checkValidations(ChequesInBankForm: FormGroup<any>, isvalid: boolean): boolean {
  //   throw new Error('Method not implemented.');
  // }
  Clear() {
    throw new Error('Method not implemented.');
  }
  // validateSave() {
  //   throw new Error('Method not implemented.');
  // }
  // OnBrsDateChanges(fromdate: any, todate: any) {
  //   throw new Error('Method not implemented.');
  // }
  // GetDataOnBrsDates(fromdate: any, todate: any, bankid: any) {
  //   throw new Error('Method not implemented.');
  // }
  GetValidationByControl(group: any, key: string, isValid: any): any {
    throw new Error('Method not implemented.');
  }
  setBlurEvent(fromgroup: any, key: string) {
    throw new Error('Method not implemented.');
  }
  showErrorMessage(e: unknown) {
    throw new Error('Method not implemented.');
  }
  exportautobrs(gridData: any, type: any) {
    throw new Error('Method not implemented.');
  }
  // Excel Download

  export(): void {
    this.Totlaamount = 0;
    let GetChequesInBankData = this._accountingtransaction.GetChequesInBankData(this.bankid, 0, 99999, this.modeofreceipt, this._searchText, "PDF");
    let ChequesClearReturnData = this._accountingtransaction.DataFromBrsDatesChequesInBank(this.fromdate, this.todate, this.bankid, this.modeofreceipt, this._searchText, 0, 99999);
    //this._accountingtransaction.GetChequesInBankData(this.bankid,0,999999,this.modeofreceipt,this._searchText,"PDF")
    forkJoin(GetChequesInBankData, ChequesClearReturnData)
      //this._accountingtransaction.GetChequesInBankData(this.bankid,0,999999,this.modeofreceipt,this._searchText,"PDF")
      .subscribe(() => {
        let gridData: any;
        debugger;
        if (this.pdfstatus == "Cleared" || this.pdfstatus == "Returned") {
          // gridData = result[1]["pchequesclearreturnlist"];
        }
        else {
          // gridData = result[0].pchequesOnHandlist;
        }
        let rows: ({ "Cheque/ Reference No.": any; "Branch Name": any; Amount: any; "Receipt Id": any; "Receipt Date": any; "Deposited Date": any; "Returned Date": any; "Transaction Mode": any; "Cheque Bank Name": any; "Cheque Bank Account": any; "Cheque Branch Name": any; Party: any; "Cleared Date"?: undefined; } | { "Cheque/ Reference No.": any; "Branch Name": any; Amount: any; "Receipt Id": any; "Receipt Date": any; "Deposited Date": any; "Cleared Date": any; "Transaction Mode": any; "Cheque Bank Name": any; "Cheque Bank Account": any; "Cheque Branch Name": any; Party: any; "Returned Date"?: undefined; } | { "Cheque/ Reference No.": any; "Branch Name": any; Amount: any; "Receipt Id": any; "Receipt Date": any; "Deposited Date": any; "Transaction Mode": any; "Cheque Bank Name": any; "Cheque Bank Account": any; "Cheque Branch Name": any; Party: any; "Returned Date"?: undefined; "Cleared Date"?: undefined; } | undefined)[] = [];
        gridData.forEach((element: { preceiptdate: any; pdepositeddate: any; pCleardate: null; ptotalreceivedamount: number; pChequenumber: any; pbranchname: any; preceiptid: any; ptypeofpayment: any; cheque_bank: any; subscriberbankaccountno: any; receipt_branch_name: any; ppartyname: any; }) => {
          debugger;
          let receiptdate = element.preceiptdate;
          let datereceipt = this._commonService.getFormatDateGlobal(receiptdate);
          let depositeddate = this._commonService.getFormatDateGlobal(element.pdepositeddate);
          let chequedate;
          if (element.pCleardate == null) {
            chequedate = "";
          }
          else {
            chequedate = this._commonService.getFormatDateGlobal(element.pCleardate);
          }
          let totalreceivedamt;
          if (element.ptotalreceivedamount != 0) {
            totalreceivedamt = this._commonService.removeCommasInAmount(element.ptotalreceivedamount);
            //totalreceivedamt = this._commonService.convertAmountToPdfFormat(totalreceivedamt);
          }
          else {
            totalreceivedamt = "";
          }
          // totalreceivedamt = this._commonService.convertAmountToPdfFormat(totalreceivedamt);
          let temp;
          let dataobject;
          if (this.pdfstatus == "Cleared" || this.pdfstatus == "Returned") {
            if (this.pdfstatus == "Cleared") {
              dataobject = {
                "Cheque/ Reference No.": element.pChequenumber,
                "Branch Name": element.pbranchname,
                "Amount": totalreceivedamt,
                "Receipt Id": element.preceiptid,
                "Receipt Date": datereceipt,
                "Deposited Date": depositeddate,
                "Cleared Date": chequedate,
                "Transaction Mode": element.ptypeofpayment,
                "Cheque Bank Name": element.cheque_bank,
                "Cheque Bank Account": element.subscriberbankaccountno,
                "Cheque Branch Name": element.receipt_branch_name,
                "Party": element.ppartyname,
              }
            }
            if (this.pdfstatus == "Returned") {
              dataobject = {
                "Cheque/ Reference No.": element.pChequenumber,
                "Branch Name": element.pbranchname,
                "Amount": totalreceivedamt,
                "Receipt Id": element.preceiptid,
                "Receipt Date": datereceipt,
                "Deposited Date": depositeddate,
                "Returned Date": chequedate,
                "Transaction Mode": element.ptypeofpayment,
                "Cheque Bank Name": element.cheque_bank,
                "Cheque Bank Account": element.subscriberbankaccountno,
                "Cheque Branch Name": element.receipt_branch_name,
                "Party": element.ppartyname,
              }
            }
          }
          else {
            dataobject = {
              "Cheque/ Reference No.": element.pChequenumber,
              "Branch Name": element.pbranchname,
              "Amount": totalreceivedamt,
              "Receipt Id": element.preceiptid,
              "Receipt Date": datereceipt,
              "Deposited Date": depositeddate,
              "Transaction Mode": element.ptypeofpayment,
              "Cheque Bank Name": element.cheque_bank,
              "Cheque Bank Account": element.subscriberbankaccountno,
              "Cheque Branch Name": element.receipt_branch_name,
              "Party": element.ppartyname,
            }
          }

          rows.push(dataobject);
        });
        this._commonService.exportAsExcelFile(rows, 'Cheques in Bank');
      });
  }

  returnCharges_Change(event: { target: { value: string; }; }) {
    if (parseFloat(event.target.value) < this.chequereturncharges || event.target.value == "") {
      this._commonService.showWarningMessage("Minimum Amount Should Be " + this.chequereturncharges);
      // $("#cancelcharges").val("");
    }
  }

  getChequeReturnCharges() {
    this._accountingtransaction.getChequeReturnCharges().subscribe((res: { chequereturncharges: any; }[]) => {
      console.log(res);
      this.chequereturncharges = res[0].chequereturncharges;
    })
  }


  // pdf content
  pdfContentData() {
    var lMargin = 15; //left margin in mm
    var rMargin = 15; //right margin in mm
    var pdfInMM = 210;  // width of A4 in mm

    let count = 0
    if (this.previewdetails.length != 0) {
      // var doc = new jsPDF();
      this.previewdetails.forEach((obj: { psubscribername: string; pchitno: string; preferencenumber: string; pchequedate: any; ptotalreceivedamount: any; pbankname: string; pchequereturnchargesamount: any; preceiptid: string; paddress: string; }) => {

        count = count + 1
        let ExportRightSideData = [obj.psubscribername.trim() + ", "]
        // let addresssplit = this.specimenpostDetails[i]["subscriberaddress"].split(',')
        // //   var splitTitle = doc.splitTextToSize(this.NoticePostDetails[i]["address"], 60);
        // for(let a=0;a<addresssplit.length;a++){
        //   if(addresssplit[a]!=""){
        //   if(a==addresssplit.length-1){
        //      ExportRightSideData.push(addresssplit[a].trim()+".")
        //   }
        //   else{
        //    ExportRightSideData.push(addresssplit[a].trim()+",")
        //   }
        //  }
        // }


        let Companyreportdetails = this._commonService._getCompanyDetails();

        // ExportRightSideData.push(this.specimenpostDetails[i]["subscriberaddress"])
        let today = this._commonService.getFormatDateGlobal(new Date())
        let todayhhmm = this._commonService.pdfProperties("Date");
        let DateandLetterNo = ["Date  : " + today + ""]
        // let pageSize = doc.internal.pageSize;
        // let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        // let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

        // DateandLetterNo.push("No.    : " + this.specimenpostDetails[i]["specimenoneno"] + "")
        //   let DateandLetterNo =[];
        // //  let DateandLetterNo = ["No.   :" + this.specimenpostDetails[i]["specimenoneno"] + ""]
        //   DateandLetterNo.push("Date  :   " + today + "")

        // doc.text(15, 40, "FKNS04F");subscribername,specimenoneno

        // let Content = "Dear Sir / Madam,\n\n                                        Your Chit Series No.                             and Ticket No.       \n\n";
        // Content += "    You became a prized subscriber for     " + this._CommonService.convertAmountToPdfFormat(this.specimenpostDetails[i]["bidpayableamount"]) + " With a discount of     " + this._CommonService.convertAmountToPdfFormat(this.specimenpostDetails[i]["bidamount"]) + " on the above ticket no : " + this.specimenpostDetails[i]["ticketno"] + " in the auction held on  Dt." + this._CommonService.getFormatDateGlobal(this.specimenpostDetails[i]["auctiondate"]) + " \n\n";
        // Content += "You  have  not  so  far  suggested  the  names  of  sureties  or offered  other  acceptable  security  to  enable  you  to  draw  the prize  amount.   We  shall  be  glad  if  you  will,  in  your  own interests,  arrange  to  draw  the  prize  amount  by  offering acceptable  security.\n\n";
        // Content += "Very Truly yours,\n\n";
        // Content += "Manager\n\n\n";
        // doc.setFontSize(12);
        // //doc.setFontStyle('normal');
        // doc.setTextColor('black');
        // doc.text('Dear Sir / Madam' + '', 15, 90,);
        // doc.text('SUB : NOTICE REGARDING RETURN OF YOUR CHEQUE.' + '', 55, 97,);
        // let chitno = doc.splitTextToSize(obj.pchitno, 120);
        // doc.text('Ref : Chit No. : ', 55, 104);
        // doc.text(chitno, 85, 104);

        let Content = "We regret to inform you that your cheque No : " + obj.preferencenumber + " dated : " + this._commonService.getFormatDateGlobal(obj.pchequedate) + " for Rs. " + this._commonService.convertAmountToPdfFormat(obj.ptotalreceivedamount) + " drawn on : " + obj.pbankname + "  towards subscription to the above Chit : " + obj.pchitno + " has been returned by your bank unpaid.  \n\n"
        Content += "Kindly arrange payment of the amount of the cheque in cash or demand draft together with penality of Rs. " + this._commonService.convertAmountToPdfFormat(obj.pchequereturnchargesamount) + " and Bank Charges immediately on receipt of this letter.  \n\n"
        Content += "Please note that our Official Receipt No. " + obj.preceiptid + " Date : " + this._commonService.getFormatDateGlobal(obj.pchequedate) + " issued in this regard stands cancelled.  Henceforth payment of subscription may please be made either in cash or by D.D only. \n\n"
        Content += "Please note that under the provision of Section 138B of Negotiable Instruments Act we can/will initiate legal proceeding against you if you fail to pay the dishonoured cheque amount within Fifteen days from the date of this notice. \n\n"
        Content += "We hope you will not allow us to initiate the above proceedings. \n\n"
        Content += "We request your immediate response. \n\n"
        // doc.setFontStyle('normal');
        // doc.text('Yours faithfully,' + '', 165, 200);
        // doc.text('For ' + Companyreportdetails.pCompanyName + '', 115, 207);
        // doc.text('Manger' + '', 165, 220);
        ////////////////////////////////////////////////
        debugger;
        // let Easy_chit_Img = this._CommonService.Easy_chit_Img;
        let kapil_logo = this._commonService.getKapilGroupLogo();
        //  let currencyformat = this.currencysymbol;
        let rupeeImage = this._commonService._getRupeeSymbol();
        //doc.addImage(kapil_logo, 'JPEG', 10, 5)
        // doc.setFont("Times-Italic")
        // doc.setTextColor('black');
        //  doc.setFontStyle('normal');
        // doc.setFontSize(12);
        // doc.setTextColor('green');

        //company Header
        let address = this._commonService.getcompanyaddress();
        // doc.text(Companyreportdetails.pCompanyName, 72, 10);
        // doc.setFontSize(8);
        // doc.setTextColor('black');
        let address1 = address.substr(0, 115);
        //doc.text(address1, 110, 15, 0, 0, 'center');
        let address2 = address.substring(115)
        // doc.text('' + address2 + '', 110, 18);

        // if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
        //   doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 90, 22);
        // }
        // doc.setFontSize(14);
        // doc.text("Cheque Return Invoice", pageWidth / 2, 30, { align: 'center' });
        // end
        //doc.setFontSize(12);
        // doc.text(30, 55, "To,");
        // doc.text(obj.psubscribername+ '', 15, 62);

        // doc.text(obj.paddress+ '', 15, 69);

        //Sideheader
        let addr1 = "";
        addr1 = obj.paddress + ".";
        // if (isNullOrEmptyString(this.NoticePostDetails[i]["contactnumber"])) 
        // {
        //    addr1=addr1 + ".";
        // }
        // else 
        // {
        //    addr1=addr1 + " - " + this.NoticePostDetails[i]["contactnumber"] + ".";
        // }
        ExportRightSideData.push(addr1);
        this._commonService.addWrappedText({
          text: ExportRightSideData, // Put a really long string here
          textWidth: 100,
          //doc,

          // Optional
          fontSize: 10,
          fontType: 'normal',
          lineSpacing: 5,               // Space between lines
          xPosition: 30,                // Text offset from left of document
          initialYPosition: 60,         // Initial offset from top of document; set based on prior objects in document
          pageWrapInitialYPosition: 10  // Initial offset from top of document when page-wrapping
        });

        // let homeaddress = doc.splitTextToSize(ExportRightSideData, (pdfInMM - lMargin - rMargin));
       // doc.setFontSize(12);
        //doc.text(15, 65, homeaddress);
        // doc.text(5, 50, ExportRightSideData);
        // doc.text(160, 45, DateandLetterNo);
        //Content
        // const addresscontent = doc.getTextDimensions(ExportRightSideData, { fontSize: 10 });
        //let addresscontentheight = 60 + addresscontent.h;

        // let P1Lines = doc.splitTextToSize(Content, (pageWidth - lMargin - rMargin));//, lineHeightFactor: 1.5, maxWidth: 190 ,{ align: "justify",maxWidth: 190}
        // doc.setFontSize(12);
        //doc.text(15,115+(chitno.length?3:0), P1Lines,);
        //           
        // const head2FinalHeight = doc.getTextDimensions(P1Lines, { fontSize: 10 });
        // let previousContentHeight = 70 + head2FinalHeight.h;
        //heighligt text start
        // doc.setFontSize(12);
        // doc.setTextColor('green');
        // doc.setFontType('bold');
        // let ticketno = this.specimenpostDetails[i]["ticketno"].toString();
        // doc.text(this.specimenpostDetails[i]["groupcode"] +"-"+ticketno, 58, 100)
        // doc.text(ticketno, 128, addresscontentheight+8.3)
        //End
        //page End
        // doc.setTextColor('black');
        // doc.addImage(rupeeImage,104,136,2,2.5);
        // doc.addImage(rupeeImage,104,141,2,2.5);
        // doc.addImage(rupeeImage,104,146,2,2.5);

        // const amountdimensions = doc.getTextDimensions(this._commonService.convertAmountToPdfFormat(this.specimenpostDetails[i]["bidpayableamount"]).toString()+"Deduct : Bid offered (discount)	     	           : Rs. ", { fontSize: 12 });
        // let amountwidth = 100 + amountdimensions.w;
        //doc.addImage(rupeeImage,amountwidth+2.5,151,1.7,1.7);

        // doc.text("Printed on : "+todayhhmm, 15, pageHeight - 5);
        let reportname = "Cheque Return Invoice";
        if (count != this.previewdetails.length) {
          // doc.addPage();
        } else {
          // doc.save('' + reportname + '.pdf');
        }

      })

    }

  }

  chequereturnvoucherpdf() {
    var lMargin = 15; //left margin in mm
    var rMargin = 15; //right margin in mm
    var pdfInMM = 235;  // width of A4 in mm

    let count = 0
    if (this.chequerwturnvoucherdetails.length != 0) {
      // var doc = new jsPDF();
      this.chequerwturnvoucherdetails.forEach((obj: { pvoucherno: string; pdebitaccountname: string; pcreditaccountname: string; ptotalreceivedamount: any; preferencenumber: any; pchequedate: any; pbankname: any; pbranchname: any; preceiptid: any; }) => {

        count = count + 1
        // let ExportRightSideData = [ obj.psubscribername.trim() + ", "]
        // let addresssplit = this.specimenpostDetails[i]["subscriberaddress"].split(',')
        // //   var splitTitle = doc.splitTextToSize(this.NoticePostDetails[i]["address"], 60);
        // for(let a=0;a<addresssplit.length;a++){
        //   if(addresssplit[a]!=""){
        //   if(a==addresssplit.length-1){
        //      ExportRightSideData.push(addresssplit[a].trim()+".")
        //   }
        //   else{
        //    ExportRightSideData.push(addresssplit[a].trim()+",")
        //   }
        //  }
        // }


        let Companyreportdetails = this._commonService._getCompanyDetails();

        // ExportRightSideData.push(this.specimenpostDetails[i]["subscriberaddress"])
        let today = this._commonService.getFormatDateGlobal(new Date())
        let todayhhmm = this._commonService.pdfProperties("Date");
        let DateandLetterNo = ["Date  : " + today + ""]
        this.todayDate = this.datepipe.transform(this.today, "dd-MMM-yyyy h:mm:ss a");
        // doc.line(15, 42, (pdfInMM - lMargin - rMargin), 42)
        // DateandLetterNo.push("No.    : " + this.specimenpostDetails[i]["specimenoneno"] + "")
        //   let DateandLetterNo =[];
        // //  let DateandLetterNo = ["No.   :" + this.specimenpostDetails[i]["specimenoneno"] + ""]
        //   DateandLetterNo.push("Date  :   " + today + "")

        // doc.text(15, 40, "FKNS04F");subscribername,specimenoneno

        // let Content = "Dear Sir / Madam,\n\n                                        Your Chit Series No.                             and Ticket No.       \n\n";
        // Content += "    You became a prized subscriber for     " + this._CommonService.convertAmountToPdfFormat(this.specimenpostDetails[i]["bidpayableamount"]) + " With a discount of     " + this._CommonService.convertAmountToPdfFormat(this.specimenpostDetails[i]["bidamount"]) + " on the above ticket no : " + this.specimenpostDetails[i]["ticketno"] + " in the auction held on  Dt." + this._CommonService.getFormatDateGlobal(this.specimenpostDetails[i]["auctiondate"]) + " \n\n";
        // Content += "You  have  not  so  far  suggested  the  names  of  sureties  or offered  other  acceptable  security  to  enable  you  to  draw  the prize  amount.   We  shall  be  glad  if  you  will,  in  your  own interests,  arrange  to  draw  the  prize  amount  by  offering acceptable  security.\n\n";
        // Content += "Very Truly yours,\n\n";
        // Content += "Manager\n\n\n";
        // doc.setFontSize(12);
        //doc.setFontStyle('normal');
        // doc.setTextColor('black');
        // doc.text('Dear Sir / Madam' +'',15, 90,);
        // doc.text('SUB : NOTICE REGARDING RETURN OF YOUR CHEQUE.' +'',55, 97,);
        // doc.text('Ref : Chit No. : '+obj.pchitno +'',70, 104,);

        // let Content = " We regret to inform you that your cheque No : "+ obj.preferencenumber+ " dated : "+this._commonService.getFormatDateGlobal(obj.pchequedate)+" for Rs. "+this._commonService.convertAmountToPdfFormat(obj.ptotalreceivedamount)+" drawn on : "+obj.pbankname+"  towards subscription to the above Chit : "+ obj.pchitno+" has been returned by your bank unpaid.  \n\n"
        //       Content +="Kindly arrange payment of the amount of the cheque in cash or demand draft together with penality of Rs. "+this._commonService.convertAmountToPdfFormat(obj.pchequereturnchargesamount)+" and Bank Charges immediately on receipt of this letter.  \n\n"
        //       Content +="Please note that our Official Receipt No. "+obj.preceiptid+ " Date : "+ this._commonService.getFormatDateGlobal(obj.pchequedate)+ " issued in this regard stands cancelled.  Henceforth payment of subscription may please be made either in cash or by D.D only. \n\n"
        //       Content +="Please note that under the provision of Section 138B of Negotiable Instruments Act we can/will initiate legal proceeding against you if you fail to pay the dishonoured cheque amount within Fifteen days from the date of this notice. \n\n"
        // Content +="We hope you will not allow us to initiate the above proceedings. \n\n"
        // Content +="We request your immediate response. \n\n"
        // doc.setFontStyle('normal');
        // doc.text('Yours faithfully,' + '', 165, 200);
        // doc.text('For ' + Companyreportdetails.pCompanyName+'', 115, 207);
        // doc.text('Manger' + '', 165, 220);
        ////////////////////////////////////////////////
        debugger;
        // let Easy_chit_Img = this._CommonService.Easy_chit_Img;
        let kapil_logo = this._commonService.getKapilGroupLogo();
        //  let currencyformat = this.currencysymbol;
        let rupeeImage = this._commonService._getRupeeSymbol();
        //doc.addImage(kapil_logo, 'JPEG', 10, 5)
        // doc.setFont("Times-Italic")
        // doc.setTextColor('black');
        //doc.setFontStyle('normal');
        // doc.setFontSize(12);
        // doc.setTextColor('green');

        //company Header
        let address = this._commonService.getcompanyaddress();
        // doc.text(Companyreportdetails.pCompanyName, 72, 10);
        // doc.setFontSize(8);
        // doc.setTextColor('black');
        let address1 = address.substr(0, 115);
        //doc.text(address1, 110, 15, 0, 0, 'center');
        let address2 = address.substring(115)
        // doc.text('' + address2 + '', 110, 18);

        // if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
        //   doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 90, 22);
        // }
        // doc.setFontSize(14);
        // doc.text("Cheque Return Voucher", 92, 30);
        // end
        // doc.setFontSize(12);
        // doc.text(30, 55, "To,");
        // doc.text(obj.psubscribername+ '', 15, 62);

        // doc.text(obj.paddress+ '', 15, 69);

        //Sideheader
        // let addr1="";
        // addr1=obj.paddress+ ".";
        // if (isNullOrEmptyString(this.NoticePostDetails[i]["contactnumber"])) 
        // {
        //    addr1=addr1 + ".";
        // }
        // else 
        // {
        //    addr1=addr1 + " - " + this.NoticePostDetails[i]["contactnumber"] + ".";
        // }
        // ExportRightSideData.push(addr1);
        //  this._commonService.addWrappedText({
        //    text: ExportRightSideData, // Put a really long string here
        //    textWidth: 100,
        //    doc,

        //    // Optional
        //    fontSize: 10,
        //    fontType: 'normal',
        //    lineSpacing: 5,               // Space between lines
        //    xPosition: 30,                // Text offset from left of document
        //    initialYPosition: 60,         // Initial offset from top of document; set based on prior objects in document
        //    pageWrapInitialYPosition: 10  // Initial offset from top of document when page-wrapping
        //  }); 

        // let homeaddress = doc.splitTextToSize(ExportRightSideData, (pdfInMM - lMargin - rMargin));
       // doc.setFontSize(12);
        //doc.text(15, 65, homeaddress);
        // doc.text(5, 50, ExportRightSideData);
        // doc.text(160, 48, DateandLetterNo);
        // doc.text('Printed On  :  ' + this.todayDate, 15, 40);
        // doc.text('Voucher No. : ' + obj.pvoucherno + '', 15, 48);
        // doc.text('Debit To       : ' + obj.pdebitaccountname + '', 15, 55);
        // doc.text('Bank             : ' + obj.pcreditaccountname + '', 15, 62);
        // doc.rect(15, 135, 30, 12, 'S')
        // doc.text('Manager' + '', 55, 145);
        // doc.text('Accounts Officer' + '', 110, 145);
        // doc.text('Cashier' + '', 180, 145);
        // doc.text("Amount In Words :  " + "Rupees " + this.titleCase(this.numbertowords.transform(obj.ptotalreceivedamount)) + " Only." + '', 15, 125);
        // let gridheaders = ["Cheque No.","Cheque Date", "Bank","Branch","Receipt No.","Receipt Date"];
        let gridheaders = ["PARTICULARS", '']

        let bodygrid = []
        let temp1 = [];
        let temp2 = []
        let temp3 = []
        let temp4 = []
        let temp5 = []
        let temp6 = []

        let tempgrid = []
        temp1 = ["Cheque No.", obj.preferencenumber]
        temp2 = ["Cheque Date", this._commonService.getFormatDateGlobal(obj.pchequedate)]
        temp3 = ["Bank", obj.pbankname]
        temp4 = ["Branch", obj.pbranchname]
        temp5 = ["Receipt No.", obj.preceiptid]
        temp6 = ["Receipt Date", this._commonService.getFormatDateGlobal(obj.pchequedate)]

        // tempgrid=[obj.preferencenumber,this._commonService.getFormatDateGlobal(obj.pchequedate),obj.pbankname,obj.pbranchname,obj.preceiptid,this._commonService.getFormatDateGlobal(obj.pchequedate)]
        bodygrid.push(temp1);
        bodygrid.push(temp2);
        bodygrid.push(temp3);
        bodygrid.push(temp4);
        bodygrid.push(temp5);
        bodygrid.push(temp6);

        let total = {
          content: 'Amount',
          colSpan: 1,
          styles: {
            halign: 'right', fontSize: 8, fontStyle: 'bold'//, textColor: "#663300", fillColor: "#e6f7ff" 
          }
        };
        let tot = []
        tot = [total, this._commonService.currencyFormat(obj.ptotalreceivedamount)];
        bodygrid.push(tot);
        let FirstcolWidthHeight = {
          0: { cellWidth: 'auto', halign: 'left' }, 1: { cellWidth: 'auto', halign: 'left' },
        }
        // doc.autoTable({
        //   columns: gridheaders,
        //   body: bodygrid,
        //   theme: 'grid',//'striped'|'grid'|'plain'|'css' = 'striped'
        //   headStyles: {
        //     fillColor: this._commonService.pdfProperties("Header Color1"),
        //     halign: this._commonService.pdfProperties("Header Alignment"),
        //     fontSize: 9,
        //     lineWidth: 0.1,
        //     tableLineColor: 'black',
        //     textColor: 'black', //Black  
        //     //rowHeight:5
        //   }, // Red
        //   styles: {
        //     cellPadding: 1, fontSize:10, cellWidth: 'wrap',
        //     rowPageBreak: 'avoid',
        //     overflow: 'linebreak',
        //     textColor:'black',
        //     //rowHeight:11,
        //   },
        //   columnStyles: FirstcolWidthHeight,
        //   startY: 69,
        //   margin: { right: 35,left:35 },

        // })
        //Content
        // const addresscontent = doc.getTextDimensions(ExportRightSideData, { fontSize: 10 });
        //let addresscontentheight = 60 + addresscontent.h;

        // let P1Lines = doc.splitTextToSize(Content, (pdfInMM - lMargin - rMargin));
        // doc.setFontSize(12);
        // doc.text(15,115, P1Lines);
        //           
        // const head2FinalHeight = doc.getTextDimensions(P1Lines, { fontSize: 10 });
        // let previousContentHeight = 70 + head2FinalHeight.h;
        //heighligt text start
        // doc.setFontSize(12);
        // doc.setTextColor('green');
        // doc.setFontType('bold');
        // let ticketno = this.specimenpostDetails[i]["ticketno"].toString();
        // doc.text(this.specimenpostDetails[i]["groupcode"] +"-"+ticketno, 58, 100)
        // doc.text(ticketno, 128, addresscontentheight+8.3)
        //End
        //page End
        // doc.setTextColor('black');
        // doc.addImage(rupeeImage,104,136,2,2.5);
        // doc.addImage(rupeeImage,104,141,2,2.5);
        // doc.addImage(rupeeImage,104,146,2,2.5);

        // const amountdimensions = doc.getTextDimensions(this._commonService.convertAmountToPdfFormat(this.specimenpostDetails[i]["bidpayableamount"]).toString()+"Deduct : Bid offered (discount)	     	           : Rs. ", { fontSize: 12 });
        // let amountwidth = 100 + amountdimensions.w;
        //doc.addImage(rupeeImage,amountwidth+2.5,151,1.7,1.7);
        // let pageSize = doc.internal.pageSize;
        // let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        // let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        // doc.text("Printed on : "+todayhhmm, 15, pageHeight - 5);
        let reportname = "Cheque Return Voucher";
        if (count != this.chequerwturnvoucherdetails.length) {
          // doc.addPage();
        } else {
          // doc.save('' + reportname + '.pdf');
        }

      })

    }
  }

  titleCase(str: string) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
  }

  preferedselection(eve: { target: { checked: any; }; }) {

    let maxvalue = (this.pageCriteria.CurrentPage) * 10
    let minvalue = maxvalue - 10
    for (let i = minvalue; i <= maxvalue - 1; i++) {
      if (eve.target.checked) {
        this.preferdrows = true
        //   if(this.gridData[i].clearstatus == 'YES' ){
        // this.CheckedClear(eve, this.gridData[i])
        //   }
      } else {

        this.CheckedClear(eve, this.gridData[i])
        this.preferdrows = false
      }
    }
  }
  CheckedClear(eve: { target: { checked: any; }; }, arg1: never) {
    throw new Error('Method not implemented.');
  }

  showSearchText($event: any) {
    debugger
    // if(!this._commonService.isNullOrEmptyString(this.ChequesInBankForm.controls.searchtext.value)){
    //this.status == "all"
    this.gridData = [];
    let search = $event;
    let searchText = this.ChequesInBankForm.controls['searchtext'].value.toString();
    this._searchText = searchText;
    if (this.fromFormName == "fromChequesStatusInformationForm") {
      if (searchText != "") {
        let columnName;
        let lastChar = searchText.substr(searchText.length - 1);
        let asciivalue = lastChar.charCodeAt()
        if (asciivalue > 47 && asciivalue < 58) {
          columnName = "pChequenumber";
        } else {
          columnName = "";
        }
        this.displayGridDataBasedOnForm = this._commonService.transform(this.displayGridDataBasedOnFormTemp, searchText, columnName);
      }
      else {
        this.displayGridDataBasedOnForm = this.displayGridDataBasedOnFormTemp;
      }
      this.pageCriteria.totalrows = this.displayGridDataBasedOnForm.length;
      this.pageCriteria.TotalPages = 1;
      if (this.pageCriteria.totalrows > 10)
        this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / 10).toString()) + 1;
      if (this.displayGridDataBasedOnForm.length < this.pageCriteria.pageSize) {
        this.pageCriteria.currentPageRows = this.displayGridDataBasedOnForm.length;
      }
      else {
        this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
      }
    }
    else {
      let SearchLength: any = this._commonService.searchfilterlength;
      if (searchText != "" && parseInt(searchText.length) > parseInt(SearchLength)) {
        let columnName;
        let lastChar = searchText.substr(searchText.length - 1);
        let asciivalue = lastChar.charCodeAt()
        if (asciivalue > 47 && asciivalue < 58) {
          columnName = "pChequenumber";
        } else {
          columnName = "";
        }
        this.pageSetUp();
        // this.SearchChequesInBank(this.bankid,search);
        if (this.status == 'cleared') {
          this.Cleared();
        } else if (this.status == 'returned') {
          this.Returned();
        } else if (this.status == 'onlinereceipts') {
          this.OnlineReceipts();
        } else if (this.status == 'all') {
          this.All();
        }
        else {
          this.GetChequesInBank_load(this.bankid);
        }
        //this.gridData = this._commonService.transform(this.gridDatatemp, searchText, columnName);
      }
      else {
        if (searchText == "") {
          this.pageSetUp();
          this.GetChequesInBank_load(this.bankid);
          // this.SearchChequesInBank(this.bankid,search);
        }
      }
      // this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
      this.CountOfRecords();
    }
    // }
    console.log("grid DAta", this.gridData);
  }
  OnlineReceipts() {
    throw new Error('Method not implemented.');
  }
  loadingDataonClearSearch($event: { target: { value: string; }; }) {
    debugger
    if ($event.target.value == "") {
      this._searchText = "";
      this.modeofreceipt = "CHEQUE";
      this.GridColumnsHide();
      this.GetChequesInBank_load(this.bankid);
      // $("#chequesdepositedcss").addClass("active");
      // $("#allcss").removeClass("active");
      // $("#chequesissuedcss").removeClass("active");
      // $("#onlinereceiptscss").removeClass("active");
      // $("#clearedcss").removeClass("active");
      // $("#returnedcss").removeClass("active");
    }
  }
  onFileChange(evt: any) {
    debugger;
    /* wire up file reader */
    this.PreDefinedAutoBrsArrayData = [];
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      // const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: false });

      /* grab first sheet */
      // const wsname: string = wb.SheetNames[0];
      // const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      //this.Exceldata = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      this.Exceldata = this.Exceldata.splice(1);
      let j;
      for (let i = 0; i < this.Exceldata.length; i++) {
        let Arraydata = this.Exceldata[i]
        let arraydatapush = {
          "transactiondate": new Date((Arraydata[0] - 25569) * 86400000),
          "chqueno": Arraydata[1],
          "chequeamount": Arraydata[2],
          "preferencetext": Arraydata[3],
          "preceiptype": Arraydata[4],
          "uploadtype": Arraydata[5],
        }
        this.PreDefinedAutoBrsArrayData.push(arraydatapush);
      }
      this.PreDefinedAutoBrsArrayData = [...this.PreDefinedAutoBrsArrayData];
      this.saveshowhide = false;
      console.log("uploaddata", this.PreDefinedAutoBrsArrayData);
    };
    reader.readAsBinaryString(target.files[0]);
  }
  DownloadExcelforPreDefinedBidAmount(): void {
    debugger;

    /* generate worksheet */
    //const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

    /* generate workbook and add the worksheet */
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'AutoBrs');

    /* save to file */
    // XLSX.writeFile(wb, this.fileName);
  }
  // /data(data: any): XLSX.WorkSheet {
  //   throw new Error('Method not implemented.');
  // }
  setPageModel2() {
    this.pageCriteria2.pageSize = this._commonService.pageSize;
    this.pageCriteria2.offset = 0;
    this.pageCriteria2.pageNumber = 1;
    this.pageCriteria2.footerPageHeight = 50;
  }
  BankUploadExcel() {
    debugger
    this.saveshowhide = false;
    this.PreDefinedAutoBrsArrayData = [];
    //this.disablesavebutton=true;
  }
  AutoBrs() {
    debugger
    if (this.ChequesInBankForm.controls['bankname'].value) {
      this.status = 'autobrs';
      this.modeofreceipt = 'ONLINE-AUTO';
      this.brsdateshowhidereturned = false;
      this.saveshowhide = true;
      this.GetChequesInBank_load(this.bankid);
    } else {
      this._commonService.showWarningMessage("Please Select Bank");
      this.gridData = [];
    }
  }
  saveAutoBrs() {
    debugger
    console.log("data", this.PreDefinedAutoBrsArrayData);
    let valid: boolean = false;
    let PreDefinedAutoBrsArrayData: any = [];
    if (this.auto_brs_type_name == 'Upload') {
      valid = Array.isArray(this.PreDefinedAutoBrsArrayData) && this.PreDefinedAutoBrsArrayData.length !== 0;
      PreDefinedAutoBrsArrayData = JSON.parse(JSON.stringify(this.PreDefinedAutoBrsArrayData));
    }
    else if (this.auto_brs_type_name == 'Pending') {
      valid = this.PreDefinedAutoBrsArrayData.filter((x: { check: any; }) => x.check).length > 0;
      PreDefinedAutoBrsArrayData = JSON.parse(JSON.stringify(this.PreDefinedAutoBrsArrayData.filter((x: { check: any; }) => x.check)));
    }
    if (valid) {
      if (confirm("Do you want to save ?")) {
        PreDefinedAutoBrsArrayData.forEach((element: { [x: string]: any; transactiondate: any; preceiptype: any; uploadtype: any; }) => {
          debugger
          element.transactiondate = this._commonService.getFormatDateNormal(element.transactiondate);
          //element['ptranstype']=this.receiptmode
          element['ptranstype'] = element.preceiptype
          //element['preceiptype']=this.ChequesInBankForm.controls.receipttype.value
          element['preceiptype'] = element.uploadtype;
        })

        let newobj = {
          pchequesOnHandlist: PreDefinedAutoBrsArrayData,
          schemaname: this._commonService.getschemaname(),
          auto_brs_type_name: this.auto_brs_type_name
        }
        let data = JSON.stringify(newobj);
        this.saveAutoBrsBool = true;
        this._accountingtransaction.SaveAutoBrsdataupload(data).subscribe((res: any) => {
          this.saveAutoBrsBool = false;
          if (res) {
            this._commonService.showSuccessMessage();
            this.PreDefinedAutoBrsArrayData = [];
          }
          else {
            this._commonService.showWarningMessage('Not Saved!!')
          }
        }, (error: any) => {
          this._commonService.showErrorMessage(error);
          this.saveAutoBrsBool = false;
        })
      }
    }
    else {
      this._commonService.showWarningMessage("No Data to Save");
    }
  }

  checkDuplicateValues($event: { target: { value: any; }; }, rowIndex: string, row: { preferencetext: any; }) {
    debugger
    let value = $event.target.value;
    // if(value.toString().length > 2){
    let bool = this.gridData.filter(item => item['preferencetext'] != "").some(element => {
      // this.checkduplicatebool(element.preferencetext,value)) ? true : false;
      // if(element.preferencetext.toString().length ==  value.toString().length){
      // return element.referencetext.toString().toLowerCase() === value.toString().toLowerCase();
      // && element.preferencetext.toString().length === value.toString().length;
      // }
    })
    if (bool) {
      // this.gridData.forEach(element=>{
      // if(this.checkduplicatebool(element.preferencetext,value)){
      // if(!this._commonService.isNullOrEmptyString(this.gridData[rowIndex].preferencetext)){
      // setTimeout(() => {
      this._commonService.showWarningMessage("Already Exist");
      //this.gridData[rowIndex].preferencetext = "";
      // $("#preferencetext" + rowIndex).prop("value", "");
      // }
      // }, 1500);
    } else {
      // this.gridData[rowIndex].preferencetext = value;
      row.preferencetext = value;
    }
    // }
    this.gridData = [...this.gridData];
    // }
  }
  checkduplicatebool(value1: { toString: () => { (): any; new(): any; length: any; toLowerCase: { (): any; new(): any; }; }; }, value2: { toString: () => { (): any; new(): any; length: any; toLowerCase: { (): any; new(): any; }; }; }) {
    if (value1.toString().length == value2.toString().length) {
      // setTimeout(() => {
      return value1.toString().toLowerCase() === value2.toString().toLowerCase() && value1.toString().length === value2.toString().length;
      // }, 1200);
    }
    return false;
  }
  checkDuplicateValues2($event: { target: { value: any; }; }, rowIndex: string) {
    debugger
    let value = $event.target.value;
    // if(value.toString().length > 2){
    let bool = this.gridData.some(element => {
      // this.checkduplicatebool(element.preferencetext,value)) ? true : false;
      // if(element.preferencetext.toString().length ==  value.toString().length){
      //   return element.preferencetext.toString().toLowerCase() === value.toString().toLowerCase() && element.preferencetext.toString().length === value.toString().length;
      // }
    })
    if (bool) {
      // this.gridData.forEach(element=>{
      // if(this.checkduplicatebool(element.preferencetext,value)){
      // if(!this._commonService.isNullOrEmptyString(this.gridData[rowIndex].preferencetext)){
      // setTimeout(() => {
      // this._commonService.showWarningMessage("Already Exist");
      //  this.gridData[rowIndex].preferencetext = "";
      // $("#preferencetext" + rowIndex).prop("value", "");
      // }
      // }, 1500);
    } else {
      // this.gridData[rowIndex].preferencetext = value;
    }
    // }
    this.gridData = [...this.gridData];
    // }
    console.log("data", this.gridData);
  }
  checkDuplicateValueslatest($event: { target: { value: any; }; }, rowIndex: any, row: { pChequenumber: any; cheque_bank: any; receipt_branch_name: any; preferencetext: any; }) {
    debugger
    let value = $event.target.value;
    let count = 0;
    this.gridData.filter(item => item['pdepositstatus'] == true || item['preturnstatus'] == true).forEach((element, index) => {
      if (element['pChequenumber'] == row.pChequenumber && row.cheque_bank == element['cheque_bank'] && row.receipt_branch_name == element['receipt_branch_name'] && element['pdepositstatus'] == true) {
        //element.preferencetext = value;
      } else {
        if (!this._commonService.isNullOrEmptyString(value) && !this._commonService.isNullOrEmptyString(element['preferencetext'])
          //&& (element.preferencetext.toString().toLowerCase() === value.toString().toLowerCase()) 
        ) {
          count += 1;
          //this._commonService.showWarningMessage("Already Exist");
          //row.preferencetext = "";
          //$("#preferencetext"+rowIndex).prop("value","");
          //this.gridData = [...this.gridData];
        } else {
          row.preferencetext = value;
          count = 0
        }
      }
    });
    if (count > 0) {
      this._commonService.showWarningMessage("Already Exist");
    }
    this.gridData = [...this.gridData];
  }
  validateDuplicates() {
    let arraynew = this.gridData.filter(element => element['pchequestatus'] == "Y" || element['pchequestatus'] == "R");
    let count = 0;
    for (let i = 0; i < arraynew.length; i++) {
      for (let k = 0; k < arraynew.length; k++) {
        if (arraynew[i]['pChequenumber'] != arraynew[k]['pChequenumber']) {
          if (!this._commonService.isNullOrEmptyString(arraynew[i]['preferencetext']) &&
            !this._commonService.isNullOrEmptyString(arraynew[k]['preferencetext'])) {
            if (arraynew[i]['preferencetext'] == arraynew[k]['preferencetext']) {
              count += 1;
            }
          }
        }
      }
    }
    console.log('Duplicated count', count);
    return count;
  }
  emptyValuesFound() {
    debugger
    return this.gridData.filter(element => element['pdepositstatus'] == true || element['preturnstatus'] == true).some(item => item['preferencetext'] == "");
  }
  GetChequesInBankforSearchDeposit(bankid: any, startindex: any, endindex: any, searchText: string) {
    debugger;
    this.gridLoading = true;
    let GetChequesInBankData = this._accountingtransaction.GetChequesInBankData(bankid, startindex, endindex, this.modeofreceipt, this._searchText, "");
    let getchequescount = this._accountingtransaction.GetChequesRowCount(bankid, this._searchText, "", "", "CHEQUESINBANK", this.modeofreceipt);
    forkJoin(GetChequesInBankData, getchequescount).
      subscribe((data: any) => {
        console.log(data)
        this.gridLoading = false;
        debugger;
        let data1 = data[0].pchequesOnHandlist;
        // data1.filter(i => {
        //   i.preceiptdate = this._commonService.getFormatDateGlobal(this._commonService.getDateObjectFromDataBase(i.preceiptdate));
        //   i.pdepositeddate = this._commonService.getFormatDateGlobal(this._commonService.getDateObjectFromDataBase(i.pdepositeddate));
        //   i.pchequedate = this._commonService.getFormatDateGlobal(this._commonService.getDateObjectFromDataBase(i.pchequedate));

        // });
        this.ChequesInBankData = data1;
        // this.ChequesInBankData.map(element=>{
        //   element['preferencetext'] = "";
        // })
        this.ChequesClearReturnData = data[0].pchequesclearreturnlist;
        this._countData = data[1];
        this.CountOfRecords();
        this.totalElements = this._countData["return_count"];
        this.page.totalElements = this._countData["return_count"];
        if (this.page.totalElements > 10) {
          this.page.totalPages = parseInt((this.page.totalElements / 10).toString()) + 1;
        } else {
          this.page.totalPages = 1
        }
        if (this.status == "all") {
          this.All1();
        }
        if (this.status == "chequesdeposited") {
          this.ChequesDeposited1();
        }
        if (this.status == "onlinereceipts") {
          this.OnlineReceipts1();
        }
        if (this.status == "cleared") {
          this.Cleared1();
        }
        if (this.status == "returned") {
          this.Returned1();
        }

        if (this.fromFormName == "fromChequesStatusInformationForm") {
          this.chequesStatusInfoGrid();
        }


      }, (error: any) => { this._commonService.showErrorMessage(error) })
  }
  All1() {
    throw new Error('Method not implemented.');
  }
  ChequesDeposited1() {
    throw new Error('Method not implemented.');
  }
  OnlineReceipts1() {
    throw new Error('Method not implemented.');
  }
  Cleared1() {
    throw new Error('Method not implemented.');
  }
  Returned1() {
    throw new Error('Method not implemented.');
  }
  receipttypeChange(event: { value: string; } | undefined) {
    debugger
    console.log(event);
    if (event != undefined) {
      this.receiptmode = event.value == "Adjusted" ? "CH" : "I"
    }
  }

  auto_brs_typeChange(event: string) {
    debugger
    this.PreDefinedAutoBrsArrayData = [];
    this.auto_brs_type_name = event;
  }

  getAutoBrs(type: any) {
    this.PreDefinedAutoBrsArrayData = [];
    this._accountingtransaction.GetPendingautoBRSDetails(this._commonService.getschemaname(), type).subscribe((res: any) => {
      this.PreDefinedAutoBrsArrayData = res;
      this.PreDefinedAutoBrsArrayData.forEach((x: { [x: string]: boolean; pChequenumber: any; ptotalreceivedamount: any; preceiptype: any; pmodofreceipt: any; }, i: any) => {
        x['chqueno'] = x.pChequenumber;
        x['chequeamount'] = x.ptotalreceivedamount;
        x['uploadtype'] = x.preceiptype;
        x['preceiptype'] = x.pmodofreceipt;
        x['index'] = i;
        x['check'] = false;
      })
      this.PreDefinedAutoBrsArrayData = [...this.PreDefinedAutoBrsArrayData];
    }, (error: any) => {
      this._commonService.showErrorMessage(error);
    })
  }

  checkbox_pending_data(row: { index: string | number; }, $event: { target: { checked: any; }; }) {
    debugger;
    this.PreDefinedAutoBrsArrayData[row.index]['check'] = $event.target.checked
  }
  autoBrsCheckedClear($event: { target: { checked: boolean; }; }, row: { pdepositeddate: any; pChequenumber: { toString: () => string; }; pchequedate: any; pdepositstatus: boolean; }) {
    {
      debugger
      this.selectedamt = 0;
      if ($event.target.checked) {
        let receiptdate = this._commonService.getDateObjectFromDataBase(row.pdepositeddate);
        let chequecleardate = this.ChequesInBankForm.controls['pchequecleardate'].value;
        if (new Date(chequecleardate).getTime() >= new Date(receiptdate).getTime()) {
          this._searchText = row.pChequenumber.toString();
          this.gridLoading = true;
          this._accountingtransaction.GetChequesInBankData(this.bankid, 0, 10, this.modeofreceipt, this._searchText, "").subscribe((res: { pchequesOnHandlist: any; }) => {

            this.autoBrsDuplicates = res.pchequesOnHandlist;
            for (let i = 0; i < this.autoBrsDuplicates.length; i++) {
              if ((this.autoBrsDuplicates[i].pChequenumber == row.pChequenumber) && (this.autoBrsDuplicates[i].pchequedate == row.pchequedate)) {
                this.autoBrsData = [...this.autoBrsData, this.autoBrsDuplicates[i]];
              }
            }
            this.autoBrsData.forEach((element: { ptotalreceivedamount: number; }) => {
              this.selectedamt += element.ptotalreceivedamount
            });
            this.gridLoading = false;
            console.log(this.autoBrsData);
          })
        }
        else {
          this._commonService.showWarningMessage("Cheque Clear Date Should be Greater than or Equal to Deposited Date");
          this.gridLoading = false;
          $event.target.checked = false;
          row.pdepositstatus = false;
          this.autoBrsData.forEach((element: { ptotalreceivedamount: number; }) => {
            this.selectedamt += element.ptotalreceivedamount
          });
        }
      } else {
        let tempbrsData = this.autoBrsData.filter((x: { pChequenumber: any; }) => x.pChequenumber !== row.pChequenumber)
        this.autoBrsData = tempbrsData;
        console.log(this.autoBrsData);
        this.autoBrsData.forEach((element: { ptotalreceivedamount: number; }) => {
          this.selectedamt += element.ptotalreceivedamount
        });
      }

    }
  }

}

function isNullOrEmptyString(pCinNo: any) {
  throw new Error('Function not implemented.');
}

function All() {
  throw new Error('Function not implemented.');
}

function ChequesDeposited() {
  throw new Error('Function not implemented.');
}

function ChequesDeposited1() {
  throw new Error('Function not implemented.');
}

function OnlineReceipts() {
  throw new Error('Function not implemented.');
}

function OnlineReceipts1() {
  throw new Error('Function not implemented.');
}

function Cleared() {
  throw new Error('Function not implemented.');
}

function Cleared1() {
  throw new Error('Function not implemented.');
}

function Returned() {
  throw new Error('Function not implemented.');
}

function Returned1() {
  throw new Error('Function not implemented.');
}

function SelectBank(event: Event | undefined, arg1: { target: { value: any; }; }) {
  throw new Error('Function not implemented.');
}

function CheckedClear(event: Event | undefined, arg1: { target: any; }, data: unknown, never: any) {
  throw new Error('Function not implemented.');
}

function CheckedReturn(event: Event | undefined, arg1: { target: { checked: any; }; }, data: unknown, arg3: { preceiptid: any; preturnstatus: any; pdepositstatus: any; pchequestatus: any; pChequenumber: any; }) {
  throw new Error('Function not implemented.');
}

function validateSave() {
  throw new Error('Function not implemented.');
}

function Save() {
  throw new Error('Function not implemented.');
}

function Clear() {
  throw new Error('Function not implemented.');
}

function ShowBrsClear() {
  throw new Error('Function not implemented.');
}

function ShowBrsReturn() {
  throw new Error('Function not implemented.');
}

function GetDataOnBrsDates(frombrsdate: any, any: any, tobrsdate: any, any1: any, bankid: any, any2: any) {
  throw new Error('Function not implemented.');
}

function CancelChargesOk(value: any, string: any) {
  throw new Error('Function not implemented.');
}

function OnBrsDateChanges(fromdate: any, number: any, todate: any, number1: any) {
  throw new Error('Function not implemented.');
}

// function checkValidations(group: any, FormGroup: typeof FormGroup, isValid: any, boolean: any) {
//   throw new Error('Function not implemented.');
// }

// function GetValidationByControl(formGroup: any, FormGroup: typeof FormGroup, key: any, string: any, isValid: any, boolean: any) {
//   throw new Error('Function not implemented.');
// }

function showErrorMessage(errormsg: any, string: any) {
  throw new Error('Function not implemented.');
}

// function setBlurEvent(fromgroup: any, FormGroup: typeof FormGroup, key: any, string: any) {
//   throw new Error('Function not implemented.');
// }


function group(): void {
  throw new Error('Function not implemented.');
}

function pdfOrprint(printorpdf: any, any: any) {
  throw new Error('Function not implemented.');
}

function pdf(printorpdf: any, any: any, type: any, string: any) {
  throw new Error('Function not implemented.');
}

function exportautobrs(gridData: any, arg1: any, type: any, string: any) {
  throw new Error('Function not implemented.');
}




