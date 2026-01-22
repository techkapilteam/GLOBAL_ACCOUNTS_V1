import { CommonModule, DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cheques-onhand',
  imports: [FormsModule,ReactiveFormsModule,NgxDatatableModule,CommonModule,BsDatepickerModule],
  standalone:true,
  providers:[DatePipe],
  templateUrl: './cheques-onhand.component.html',
  styleUrl: './cheques-onhand.component.css',

})
export class ChequesOnhandComponent {

   //@ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
    showhidegridcolumns = false;
    gridData: any = [];
   // page = new Page();
    startindex: any;
    endindex: any;
    //  public gridView: DataResult;
    gridDatatemp = [];
    BanksList: any[] = [];
    amounttotal: any;
    currencySymbol: any;
    ChequesOnHandData = [];
    ChequesClearReturnData = [];
    // transdatevalid:any;
    ChequesClearReturnDataBasedOnBrs: any = [];
    DataForSaving = [];
    // dataTemp = [];
    buttonname = "Save";
    gridLoading = false;
    bankdetails: any;
    all = 0;
    chequesreceived = 0;
    onlinereceipts = 0;
    deposited = 0;
    cancelled = 0;
    showicons = false;
    brsdateshowhidedeposited = false;
    brsdateshowhidecancelled = false;
    validatebrsdatedeposit = false;
    validatebrsdatecancel = false;
    bankbalancetype: any;
    validate: any;
    banknameshowhide: any;
    bankname: any;
    bankbalance: any;
    // bankaccountnumber: any;
    brsdate: any;
    bankid: any;
    saveshowhide = true;
    status = "all";
    pdfstatus = "All";
    count = 0;
    // cancel = false;
    // bankselection = false;
    hiddendate = true;
    datetitle: any;
    chequenumber: any;
    bankbalancedetails: any;
    ChequesOnHandValidation: any = {};
    ChequesOnHandForm!: FormGroup;
    BrsDateForm!: FormGroup;
    depositchecked = false;
    cancelchecked = false;
    public disablesavebutton = false;
    //public selectableSettings: SelectableSettings;
    public checkbox = false;
    PopupData: any;
    schemaname: any;
    public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    public brsfromConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    public brstoConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
    //public groups: GroupDescriptor[] = [{ field: 'preceiptdate', dir: 'desc' }];
    SelectBankData: any;
    //pageCriteria: PageCriteria;
    public pageSize = 10;
    modeofreceipt: string = "ALL";
    _searchText: string = "";
    fromdate: any = "";
    todate: any = "";
    _countData: any = [];
    totalElements!: number;
    Totalamount!: number;
    userBranchType!: string;
    chequereturncharges: any;
    preferdrows:boolean=false
    chequeboxshoworhide:boolean=false
    pdatepickerenablestatus!: boolean;
    companydetails:any;
  selectableSettings!: {
    checkboxOnly: boolean;
    //mode: this.mode
    mode: string;
  };
  _accountingtransaction: any;
  page: any;
  _commonService: any;
  pageCriteria: any;
    // ShowBankErrorMsg: Boolean = false;
    constructor(private fb: FormBuilder, /*private _accountingtransaction: AccountingTransactionsService*//*private _commonService: CommonService*/ private datepipe: DatePipe) {
        this.setSelectableSettings();
       // this.dpConfig.containerClass = this._commonService.datePickerPropertiesSetup('containerClass');
       // this.dpConfig.showWeekNumbers = this._commonService.datePickerPropertiesSetup('showWeekNumbers');
        this.dpConfig.maxDate = new Date();
       // this.dpConfig.dateInputFormat = this._commonService.datePickerPropertiesSetup('dateInputFormat');
       // this.brsfromConfig.dateInputFormat = this._commonService.datePickerPropertiesSetup('dateInputFormat');
        this.brsfromConfig.maxDate = new Date();
       // this.brstoConfig.dateInputFormat = this._commonService.datePickerPropertiesSetup('dateInputFormat');
        this.brstoConfig.maxDate = new Date();
        //this.allData = this.allData.bind(this);
        //this.brsfromConfig.containerClass = this._commonService.datePickerPropertiesSetup('containerClass');
       // this.brsfromConfig.showWeekNumbers = this._commonService.datePickerPropertiesSetup('showWeekNumbers');
       // this.brstoConfig.containerClass = this._commonService.datePickerPropertiesSetup('containerClass');
       // this.brstoConfig.showWeekNumbers = this._commonService.datePickerPropertiesSetup('showWeekNumbers');
        //this.pageCriteria = new PageCriteria();
    }

    ngOnInit(): void {
        //this.userBranchType = sessionStorage.getItem("userBranchType");
        //this.companydetails=this._commonService._getCompanyDetails();
        this.pdatepickerenablestatus=this.companydetails?.pdatepickerenablestatus;
        this.getChequeReturnCharges();
        this.pageSetUp();
        //this.currencySymbol = this._commonService.currencysymbol;
        this.ChequesOnHandForm = this.fb.group({
            ptransactiondate: [new Date(), Validators.required],
            bankname: [''],
            pfrombrsdate: [''],
            ptobrsdate: [''],
            pchequesOnHandlist: [],
            SearchClear: [''],
           // schemaname: [this._commonService.getschemaname()]
        })

        this.BrsDateForm = this.fb.group({
            frombrsdate: [''],
            tobrsdate: ['']
        })
        this.bankid = 0;
        this.banknameshowhide = false;
        this.ChequesOnHandValidation = {};
        this.GetBankBalance(this.bankid);
        // this._accountingtransaction.GetBanksList(this._commonService.getschemaname()).subscribe(bankslist => {

        //     this.BanksList = bankslist;
        //     //console.log(this.BanksList)
        // })
        this.setPageModel();
        this.GetChequesOnHand_Load(this.bankid);
        this.BlurEventAllControll(this.ChequesOnHandForm);
    }
  getChequeReturnCharges() {
    throw new Error('Method not implemented.');
  }
  // BlurEventAllControll(ChequesOnHandForm: FormGroup<any>) {
  //   throw new Error('Method not implemented.');
  // }
    public setSelectableSettings(): void {
        this.selectableSettings = {
            checkboxOnly: this.checkbox,
            //mode: this.mode
            mode: "multiple"
        };
    }

    //initializing page model
    setPageModel() {
        // this.pageCriteria.pageSize = this._commonService.pageSize;
        // this.pageCriteria.offset = 0;
        // this.pageCriteria.pageNumber = 1;
        // this.pageCriteria.footerPageHeight = 50;
    }
    //for ngx table footer page navigation purpose
    onFooterPageChange(event:any): void {
        // this.pageCriteria.offset = event.page - 1;
        // this.pageCriteria.CurrentPage = event.page;
        // if (this.pageCriteria.totalrows < event.page * this.pageCriteria.pageSize) {
        //     this.pageCriteria.currentPageRows = this.pageCriteria.totalrows % this.pageCriteria.pageSize;
        // }
        // else {
        //     this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
        // }



    }
    change_date(event:any) {
        debugger;
        for (let i = 0; i < this.gridData.length; i++) {
            this.gridData[i].pdepositstatus = false;
            this.gridData[i].pcancelstatus = false;
            this.gridData[i].pchequestatus = "N";
        }
    }
    pageSetUp() {
        debugger;
       // this.page.offset = 0;
        //this.page.pageNumber = 1;
        //this.page.size = this._commonService.pageSize;
        this.startindex = 0;
        //this.endindex = this.page.size;
        //this.page.totalElements = 5;
        //this.page.totalPages = 1;
    }
    setPage(pageInfo:any, event:any) {
        debugger;
        this.preferdrows=false
       // this.page.offset = event.page - 1;
       // this.page.pageNumber = pageInfo.page;
       // this.endindex = this.page.pageNumber * this.page.size
       // this.startindex = (this.endindex) - this.page.size
        if (this.fromdate != "" && this.todate != "") {
            this.GetDataOnBrsDates1(this.fromdate, this.todate, this.bankid);
        } else {
            //this.GetChequesOnHand(this.bankid, this.startindex, this.page.size, "");
        }
    }
  // GetDataOnBrsDates1(fromdate: any, todate: any, bankid: any) {
  //   throw new Error('Method not implemented.');
  // }
    GetBankBalance(bankid:any) {
        debugger;
        this._accountingtransaction.GetBankBalance(bankid).subscribe((bankdetails:any) => {
            debugger
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
            debugger;
            console.log(this.bankbalancedetails.ptobrsdate);
           // this.brsdate = this._commonService.getFormatDateGlobal(this.bankbalancedetails.ptobrsdate);
            // if(this.bankbalancedetails.pfrombrsdate!=null){
            //     this.ChequesOnHandForm.controls.pfrombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
            //     this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
            // }
            // else{
            //     this.ChequesOnHandForm.controls.pfrombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
            //     this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
            // }

            //     this.ChequesOnHandForm.controls.pfrombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
            //     this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
            //this.ChequesOnHandForm.controls.pfrombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
            //this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
            //this.ChequesOnHandForm.controls.ptobrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
            //this.BrsDateForm.controls.tobrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
        })
    }
    GetChequesOnHand_Load(bankid:any) {
        debugger;
        this.gridLoading = true;
        let GetChequesOnHandData = this._accountingtransaction.GetChequesOnHandData(bankid, this.startindex, this.endindex, this.modeofreceipt, this._searchText, "");
        let getchequescount = this._accountingtransaction.GetChequesRowCount(bankid, this._searchText, "", "", "CHEQUESONHAND",'');
        // this._accountingtransaction.GetChequesOnHandData(bankid)
        // forkJoin(GetChequesOnHandData, getchequescount)
        //     .subscribe(data => {
        //         debugger;
        //         console.log(data)
        //         this.gridLoading = false;
                
        //         // if (bankid == 0) {
        //        // let data1 = data[0].pchequesOnHandlist;

        //         // this.ChequesOnHandData = data1;
        //         // this.ChequesClearReturnData = data.pchequesclearreturnlist;
        //         // this.CountOfRecords();

        //         //this.ChequesOnHandData = data1;
        //         //this.ChequesClearReturnData = data[0].pchequesclearreturnlist;
        //        // this._countData = data[1];
        //         this.CountOfRecords();
        //         // if (this.status == "all") {
        //         //     this.All();
        //         // }

        //         // if (this.status == "all") {
        //         //     this.All();
        //         // }
        //         // if (this.status == "chequesreceived") {
        //         //     this.ChequesReceived();
        //         // }
        //         // if (this.status == "onlinereceipts") {
        //         //     this.OnlineReceipts();
        //         // }
        //         // if (this.status == "deposited") {
        //         //     this.Deposited();
        //         // }
        //         // if (this.status == "cancelled") {
        //         //     this.Cancelled();
        //         // }
        //         debugger;
        //         let grid :any[]=[];
        //             if (this.bankid == 0) {
        //                 grid = this.ChequesOnHandData;
        //             }
        //             else {
                        
        //                 for (let i = 0; i < this.ChequesOnHandData.length; i++) {
        //                 if (this.ChequesOnHandData[i].pdepositbankid == this.bankid) {
        //                     grid.push(this.ChequesOnHandData[i]);
        //                     // datatemp.push(this.ChequesClearReturnData[i]);
        //                 }
        //                 }
                        
        //             }
        //             this.gridData = JSON.parse(JSON.stringify(grid));
        //             this.gridDatatemp = this.gridData;
        //             if(this.gridData.length>0)
        //             {
        //                 this.showicons=true
        //             }
        //             else{
        //                 this.showicons=false
        //             }
        //             this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
        //         this.totalElements = +data[1]["total_count"];
        //         this.page.totalElements = +data[1]["total_count"];
        //         // this.page.totalPages = 1;
        //         if (this.page.totalElements > 10)
        //             this.page.totalPages = parseInt((this.page.totalElements / 10).toString()) + 1;
        //     }, error => { this._commonService.showErrorMessage(error) })
    }
    // GetChequesOnHand(bankid, startindex, endindex, searchText) {
    //     debugger;
    //     this.gridLoading = true;
    //     this._accountingtransaction.GetChequesOnHandData(bankid, startindex, endindex, this.modeofreceipt, this._searchText, "").subscribe(data => {
    //         debugger;
    //         console.log(data)
    //         this.gridLoading = false;
    //         // if (bankid == 0) {
    //         let data1 = data.pchequesOnHandlist;
    //         // data1.filter(i => {
    //         //     i.preceiptdate = this._commonService.getFormatDateGlobal(i.preceiptdate);
    //         //     i.pchequedate = this._commonService.getFormatDateGlobal(i.pchequedate);
    //         // })
    //         // this.ChequesOnHandData = data.pchequesOnHandlist;
    //         this.ChequesOnHandData = data1;
    //         this.ChequesClearReturnData = data.pchequesclearreturnlist;
            
    //         if (this.status == "all") {
    //             this.All1();
    //         }
    //         if (this.status == "chequesreceived") {
    //             this.ChequesReceived1();
    //         }
    //         if (this.status == "onlinereceipts") {
    //             this.OnlineReceipts1();
    //         }
    //         if (this.status == "deposited") {
    //             this.Deposited1();
    //         }
    //         if (this.status == "cancelled") {
    //             this.Cancelled1();
    //         }
    //     }, error => { this._commonService.showErrorMessage(error) })
    // }

    SelectBank(event:any) {
        debugger;
        //  this.ShowBankErrorMsg = false;
        //  document.getElementById('bankselection').style.border = "";
        if (event.target.value == "") {
            this.bankid = 0;
            this.bankname = "";
            this.banknameshowhide = false;
        }
        else {
            this.SelectBankData = event.target.value;
            this.banknameshowhide = true;
            for (let i = 0; i < this.BanksList.length; i++) {
                // if (event.target.value == this.BanksList[i].pdepositbankname) {
                //     this.bankdetails = this.BanksList[i];
                //     break;
                // }
            }
            this.bankid = this.bankdetails.pbankid;
            this.bankname = this.bankdetails.pdepositbankname;
            if (this.bankdetails.pbankbalance < 0) {
                this.bankbalance = Math.abs(this.bankdetails.pbankbalance)
                this.bankbalancetype = "Cr";
            }
            else if (this.bankdetails.pbankbalance == 0) {
                this.bankbalance = 0;
                this.bankbalancetype = "";
            }
            else {
                this.bankbalance = (this.bankdetails.pbankbalance)
                this.bankbalancetype = "Dr";
            }

            this.ChequesOnHandValidation['bankname'] = '';
        }
        // this.CountOfRecords();
        this.GetChequesOnHand_Load(this.bankid);
        if (this.status == "all") {
            this.All();
        }
        if (this.status == "chequesreceived") {
            this.ChequesReceived();
        }
        if (this.status == "onlinereceipts") {
            this.OnlineReceipts();
        }
        if (this.status == "deposited") {
            this.Deposited();
        }
        if (this.status == "cancelled") {
            this.Cancelled();
        }
        // this.GetChequesOnHand(this.bankid);
        // this.sortGridBasedOnBankSelection(this.bankid);
        this.GetBankBalance(this.bankid);
       // this.ChequesOnHandForm.controls.SearchClear.setValue('');
    }
  //  All() {
  //    throw new Error('Method not implemented.');
  //  }
  // ChequesReceived() {
  //   throw new Error('Method not implemented.');
  // }
  // OnlineReceipts() {
  //   throw new Error('Method not implemented.');
  // }
  // Deposited() {
  //   throw new Error('Method not implemented.');
  // }
  // Cancelled() {
  //   throw new Error('Method not implemented.');
  // }

    onSearch(event:any) {
        debugger;
        let searchText = event.toString();
        this._searchText = searchText;
       // let SearchLength: any = this._commonService.searchfilterlength;
        // if (searchText != "" && parseInt(searchText.length) >= parseInt(SearchLength)) {
        //     let columnName;
        //     let lastChar = searchText.substr(searchText.length - 1);
        //     let asciivalue = lastChar.charCodeAt()
        //     if (asciivalue > 47 && asciivalue < 58) {
        //         columnName = "pChequenumber";
        //     } else {
        //         columnName = "";
        //     }
        //     this.pageSetUp();
        //     this.GetChequesOnHand_Load(this.bankid);
        //     this.gridData = this._commonService.transform(this.gridDatatemp, searchText, columnName);
        // }
        // else {
        //     if (searchText == "") {
        //         this.pageSetUp();
        //         this.GetChequesOnHand_Load(this.bankid);
        //     }
        //     this.gridData = this.gridDatatemp;
        // }
        // this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));

        // let searchText = event.toString();
        // if (searchText != "") {
        //   let columnName;
        //   let lastChar = searchText.substr(searchText.length - 1);
        //   let asciivalue = lastChar.charCodeAt()
        //   if (asciivalue > 47 && asciivalue < 58) {
        //     columnName = "pChequenumber";
        //   } else {
        //     columnName = "";
        //   }

        //   this.gridData = this._commonService.transform(this.gridDatatemp, searchText, columnName);
        // }
        // else {
        //   this.gridData = this.gridDatatemp;
        // }
        // this.pageCriteria.totalrows = this.gridData.length;
        // this.pageCriteria.TotalPages = 1;
        // if (this.pageCriteria.totalrows > 10)
        //   this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / 10).toString()) + 1;
        // if (this.gridData.length < this.pageCriteria.pageSize) {
        //   this.pageCriteria.currentPageRows = this.gridData.length;
        // }
        // else {
        //   this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
        // }
    }
    checkedDeposit(event:any, data:any) {
        debugger
        let gridtemp = this.gridData.filter((a:any) => {
            if (a.preceiptid == data.preceiptid) {
                return a;
            }
        })
        if (event.target.checked == true) {
            debugger;
            // let transdate = this.datepipe.transform(this.ChequesOnHandForm.controls.ptransactiondate.value, 'dd/MM/yyyy');
            // let chkdate = this.datepipe.transform(gridtemp[0].pchequedate, 'dd/MM/yyyy');
           // let chequedate = this._commonService.getDateObjectFromDataBase(gridtemp[0].pchequedate);
            // let rcptdate = this.datepipe.transform(gridtemp[0].preceiptdate, 'dd/MM/yyyy');
            //let receiptdate = this._commonService.getDateObjectFromDataBase(gridtemp[0].preceiptdate);
            //let transactiondate = this.ChequesOnHandForm.controls.ptransactiondate.value;
            // let todaydate = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
            let today = new Date();
            // if (today >= chequedate) {
            //     if (transactiondate >= receiptdate) {
            //         data.pdepositstatus = true;
            //         data.pcancelstatus = false;
            //         data.pchequestatus = "P";
            //     }
            //     else {
            //         data.pdepositstatus = false;
            //         data.pcancelstatus = false;
            //         data.pchequestatus = "N";
            //         //$('#' + event.target.id + ''). prop("checked", false);
            //         event.target.checked = false;
            //         this._commonService.showWarningMessage("Transaction Date Should be Greater than Receipt Date");
            //     }
            // }
            // else {
            //     data.pdepositstatus = false;
            //     data.pcancelstatus = false;
            //     data.pchequestatus = "N";
            //     //$('#' + event.target.id + '').prop("checked", false);
            //     event.target.checked = false;
            //     this._commonService.showWarningMessage("Post Dated Cheques Are Not Allowed");

            // }
        }
        else {
            data.pdepositstatus = false;
            data.pchequestatus = "N";
        }
        for (let i = 0; i < this.gridData.length; i++) {
            if (this.gridData[i].preceiptid == data.preceiptid) {
                this.gridData[i] = data;
                //console.log(this.gridData[i])
                break;

            }
        }

    }

    checkedCancel(event:any, data:any) {
        debugger;
        let gridtemp = this.gridData.filter((a:any) => {
            if (a.preceiptid == data.preceiptid) {
                return a;
            }
        })
        this.PopupData = data;
        if (event.target.checked == true) {
            // let transdate = this.datepipe.transform(this.ChequesOnHandForm.controls.ptransactiondate.value, 'dd/MM/yyyy');
            //  let rcptdate = this._commonService.getFormatDateGlobal(gridtemp[0].preceiptdate);
          //  let receiptdate = this._commonService.getDateObjectFromDataBase(gridtemp[0].preceiptdate);

            //let transactiondate = this.ChequesOnHandForm.controls.ptransactiondate.value;
        //     if (transactiondate >= receiptdate) {
        //         data.pcancelstatus = true;
        //         data.pdepositstatus = false;
        //         data.pchequestatus = "C";
        //         $("#cancelcharges").val(this.chequereturncharges);
        //         this.chequenumber = data.pChequenumber;
        //         // if(this.userBranchType != "KGMS")
        //         // $('#add-detail').modal('show');
        //         // else
        //         this.CancelChargesOk(0);
        //     }
        //     else {
        //         data.pdepositstatus = false;
        //         data.pcancelstatus = false;
        //         data.pchequestatus = "N";

        //         // $('#' + data.preceiptid + ''). prop("checked", false);
        //         event.target.checked = false;
        //         this._commonService.showWarningMessage("Transaction Date Should be Greater than Receipt Date");
        //     }
        // }
        // else {
        //     data.pcancelstatus = false;
        //     data.pchequestatus = "N";
        // }
        // for (let i = 0; i < this.gridData.length; i++) {
        //     if (this.gridData[i].preceiptid == data.preceiptid) {
        //         this.gridData[i] = data;
        //         break;
        //     }
        // }
    }
    getChequeReturnCharges();{
        this._accountingtransaction.getChequeReturnCharges().subscribe((res:any)=>{
          console.log(res);
          this.chequereturncharges=res[0].chequereturncharges;
        })
      }

   // CancelChargesOk(value) {
        // if (this.userBranchType != "KGMS") {
        //     if (value != "" && Number(value) >= this.chequereturncharges) {
        //         for (let i = 0; i < this.gridData.length; i++) {
        //             if (this.gridData[i].preceiptid == this.PopupData.preceiptid) {
        //                 this.gridData[i].pactualcancelcharges = value;
        //             }
        //         }
        //         $('#add-detail').modal('hide');
        //     } else {
        //         this._commonService.showWarningMessage("Minimum Amount Should Be " + this.chequereturncharges);
        //     }
        // } else {
            for (let i = 0; i < this.gridData.length; i++) {
                if (this.gridData[i].preceiptid == this.PopupData.preceiptid) {
                   // this.gridData[i].pactualcancelcharges = value;
                }
            }
            // $('#add-detail').modal('hide');
        // }
    }

    GridColumnsShow() {
        this.showhidegridcolumns = false;
        this.saveshowhide = true;
        this.brsdateshowhidedeposited = false;
        this.brsdateshowhidecancelled = false;
        this.hiddendate = true;
    }

    GridColumnsHide() {
        // this.deposited = 0;
        // this.cancelled = 0;
        this.showhidegridcolumns = true;
        this.saveshowhide = false;
        this.hiddendate = false;
        //this.CountOfRecords();
    }

    CountOfRecords() {

        this.all = 0;
        this.chequesreceived = 0;
        this.onlinereceipts = 0;
        this.cancelled = 0;
        this.deposited = 0;
        this.all = this._countData["total_count"];
        this.onlinereceipts = this._countData["others_count"];
        this.chequesreceived = this._countData["cheques_count"];
        this.deposited = this._countData["clear_count"];
        this.cancelled = this._countData["return_count"];
    }

    All() {
        //$('#search').val("");
        this.chequeboxshoworhide=true
        this.gridData = [];
        this.gridDatatemp = [];
        // this.dataTemp = [];
        this.fromdate="";this.todate="";
        this.GridColumnsShow();
        this.status = "all";
        this.pdfstatus = "All"
        this.modeofreceipt = "ALL";
        this.pageSetUp();
        this.GetChequesOnHand(this.bankid, this.startindex, this.endindex, this._searchText);

        this.gridData = JSON.parse(JSON.stringify(this.ChequesOnHandData));
        this.gridDatatemp = this.gridData;
        // this.dataTemp = JSON.parse(JSON.stringify(this.ChequesOnHandData))
        this.gridData = this.ChequesOnHandData;

        // this.gridData.filter(data => {
        //     debugger;
        //     data.preceiptdate = this._commonService.getFormatDateGlobal((data.preceiptdate));
        //     data.pchequedate = this._commonService.getFormatDateGlobal((data.pchequedate));
        // })
        console.log(this.gridData);
        if (this.gridData.length > 0) {
            this.showicons = true
        }
        else {
            this.showicons = false
        }
      //  this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
       
        this.totalElements = this._countData["total_count"];
        this.page.totalElements = this._countData["total_count"];
        // this.page.totalPages = 1;
        if (this.page.totalElements > 10)
            this.page.totalPages = parseInt((this.page.totalElements / 10).toString()) + 1;
    }
    All1() {
        // $('#search').val("");
        this.gridData = [];
        this.gridDatatemp = [];
        // this.dataTemp = [];
        this.GridColumnsShow();
        this.status = "all";
        this.pdfstatus = "All"
        this.modeofreceipt = "ALL";

        this.gridData = JSON.parse(JSON.stringify(this.ChequesOnHandData));
        this.gridDatatemp = this.gridData;
        // this.dataTemp = JSON.parse(JSON.stringify(this.ChequesOnHandData))
        this.gridData = this.ChequesOnHandData;

        // this.gridData.filter(data => {
        //     debugger;
        //     data.preceiptdate = this._commonService.getFormatDateGlobal((data.preceiptdate));
        //     data.pchequedate = this._commonService.getFormatDateGlobal((data.pchequedate));
        // })
        console.log(this.gridData);
        if (this.gridData.length > 0) {
            this.showicons = true
        }
        else {
            this.showicons = false
        }
        //this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
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

    }

    ChequesReceived() {
        debugger;
        this.chequeboxshoworhide=true
        this.fromdate="";this.todate="";
        this.modeofreceipt = "CHEQUE";
        this.pageSetUp();
        this.GetChequesOnHand(this.bankid, this.startindex, this.endindex, this._searchText);
        // $('#search').val("");
        this.gridData = [];
        this.gridDatatemp = [];
        // this.dataTemp = [];
        this.GridColumnsShow();
        this.status = "chequesreceived";
        this.pdfstatus = "Cheques Received";
        let datatemp = [];
        let grid:any = [];
        for (let i = 0; i < this.ChequesOnHandData.length; i++) {
            // if (this.ChequesOnHandData[i].ptypeofpayment == "CHEQUE") {
            //     grid.push(this.ChequesOnHandData[i]);
            //     //   datatemp.push(this.ChequesOnHandData[i])
            // }
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
        // this.dataTemp = JSON.parse(JSON.stringify(grid))
        // this.gridData.filter(data => {
        //     data.preceiptdate = this._commonService.getFormatDateGlobal((data.preceiptdate));
        //     data.pchequedate = this._commonService.getFormatDateGlobal((data.pchequedate));
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
    ChequesReceived1() {
        debugger;
        this.modeofreceipt = "CHEQUE";
        // $('#search').val("");
        this.gridData = [];
        this.gridDatatemp = [];
        // this.dataTemp = [];
        this.GridColumnsShow();
        this.status = "chequesreceived";
        this.pdfstatus = "Cheques Received";
        let datatemp = [];
        let grid:any = [];
        for (let i = 0; i < this.ChequesOnHandData.length; i++) {
            // if (this.ChequesOnHandData[i].ptypeofpayment == "CHEQUE") {
            //     grid.push(this.ChequesOnHandData[i]);
            //     //   datatemp.push(this.ChequesOnHandData[i])
            // }
        }
        this.gridData = JSON.parse(JSON.stringify(grid))
        this.gridDatatemp = this.gridData
        if (this.gridData.length > 0) {
            this.showicons = true
        }
        else {
            this.showicons = false
        }
       // this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
        // this.dataTemp = JSON.parse(JSON.stringify(grid))
        // this.gridData.filter(data => {
        //     data.preceiptdate = this._commonService.getFormatDateGlobal((data.preceiptdate));
        //     data.pchequedate = this._commonService.getFormatDateGlobal((data.pchequedate));
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

    }
    OnlineReceipts() {
        debugger;
        this.chequeboxshoworhide=true
        this.fromdate="";this.todate="";
        //$('#search').val("");
        this.gridData = [];
        this.gridDatatemp = [];
        // this.dataTemp = [];
        this.GridColumnsShow();
        this.status = "onlinereceipts";
        this.pdfstatus = "Online Receipts";
        this.fromdate = ""; this.todate = "";
        this.pageSetUp();
        this.modeofreceipt = "ONLINE";
        this.GetChequesOnHand(this.bankid, this.startindex, this.endindex, this._searchText);
        let datatemp = [];
        let grid:any = [];
        for (let j = 0; j < this.ChequesOnHandData.length; j++) {
            // if (this.ChequesOnHandData[j].ptypeofpayment != "CHEQUE") {
            //     grid.push(this.ChequesOnHandData[j]);
            //     // datatemp.push(this.ChequesOnHandData[j])
            // }
        }
        this.gridData = JSON.parse(JSON.stringify(grid))
        this.gridDatatemp = this.gridData;
        if (this.gridData.length > 0) {
            this.showicons = true
        }
        else {
            this.showicons = false
        }
       // this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
        // this.dataTemp = JSON.parse(JSON.stringify(grid))
        // this.gridData.filter(data => {
        //     data.preceiptdate = this._commonService.getFormatDateGlobal((data.preceiptdate));
        //     data.pchequedate = this._commonService.getFormatDateGlobal((data.pchequedate));
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

    OnlineReceipts1() {
        debugger;
        //$('#search').val("");
        this.gridData = [];
        this.gridDatatemp = [];
        // this.dataTemp = [];
        this.GridColumnsShow();
        this.status = "onlinereceipts";
        this.pdfstatus = "Online Receipts";
        this.fromdate = ""; this.todate = "";

        this.modeofreceipt = "ONLINE";

        let datatemp = [];
        let grid:any = [];
        for (let j = 0; j < this.ChequesOnHandData.length; j++) {
            // if (this.ChequesOnHandData[j].ptypeofpayment != "CHEQUE") {
            //     grid.push(this.ChequesOnHandData[j]);
            //     // datatemp.push(this.ChequesOnHandData[j])
            // }
        }
        this.gridData = JSON.parse(JSON.stringify(grid))
        this.gridDatatemp = this.gridData;
        if (this.gridData.length > 0) {
            this.showicons = true
        }
        else {
            this.showicons = false
        }
       // this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));


    }

    Deposited() {
        //$('#search').val("");
        this.chequeboxshoworhide=false
        this.fromdate="";this.todate="";
        this.pageSetUp();
        this.modeofreceipt = "DEPOSIT";
        this.GetChequesOnHand(this.bankid, this.startindex, this.endindex, this._searchText);
        this.status = "deposited";
        this.pdfstatus = "Deposited";
        this.datetitle = "Deposited Date";
        this.gridData = [];
        this.gridDatatemp = [];
        // this.dataTemp = [];
        // this.deposited = 0;
        this.GridColumnsHide();
        this.brsdateshowhidedeposited = true;
        this.brsdateshowhidecancelled = false;
        this.ChequesOnHandForm.controls['pfrombrsdate'].setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
        this.ChequesOnHandForm.controls['ptobrsdate'].setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
        let datatemp = [];
        let grid:any = [];
        if (this.bankid == 0) {
            for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
                // if (this.ChequesClearReturnData[i].pchequestatus == "P") {
                //     grid.push(this.ChequesClearReturnData[i]);
                //     // datatemp.push(this.ChequesClearReturnData[i]);
                //     //this.deposited = this.deposited + 1;
                // }
            }
        }
        else {
            for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
                // if (this.ChequesClearReturnData[i].pchequestatus == "P" && this.ChequesClearReturnData[i].pdepositbankid == this.bankid) {
                //     grid.push(this.ChequesClearReturnData[i]);
                //     // datatemp.push(this.ChequesClearReturnData[i]);
                //     //this.deposited = this.deposited + 1;
                // }
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
        //this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
        // this.dataTemp = JSON.parse(JSON.stringify(grid))
        // this.gridData.filter(data => {
        //     data.preceiptdate = this._commonService.getFormatDateGlobal((data.preceiptdate));
        //     data.pchequedate = this._commonService.getFormatDateGlobal((data.pchequedate));
        //     data.pdepositeddate = this._commonService.getFormatDateGlobal((data.pdepositeddate));
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

        this.totalElements = this._countData["clear_count"];
        this.page.totalElements = this._countData["clear_count"];
        // this.page.totalPages = 1;
        if (this.page.totalElements > 10)
            this.page.totalPages = parseInt((this.page.totalElements / 10).toString()) +  1;


    }

    Deposited1() {
        //$('#search').val("");

        this.modeofreceipt = "DEPOSIT";
        this.status = "deposited";
        this.pdfstatus = "Deposited";
        this.datetitle = "Deposited Date";
        this.gridData = [];
        this.gridDatatemp = [];
        // this.dataTemp = [];
        // this.deposited = 0;
        this.GridColumnsHide();
        this.brsdateshowhidedeposited = true;
        this.brsdateshowhidecancelled = false;
        this.ChequesOnHandForm.controls['pfrombrsdate'].setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
        this.ChequesOnHandForm.controls['ptobrsdate'].setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
        let datatemp = [];
        let grid:any = [];
        if (this.bankid == 0) {
            for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
                // if (this.ChequesClearReturnData[i].pchequestatus == "P") {
                //     grid.push(this.ChequesClearReturnData[i]);
                //     // datatemp.push(this.ChequesClearReturnData[i]);
                //     //this.deposited = this.deposited + 1;
                // }
            }
        }
        else {
            for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
                // if (this.ChequesClearReturnData[i].pchequestatus == "P" && this.ChequesClearReturnData[i].pdepositbankid == this.bankid) {
                //     grid.push(this.ChequesClearReturnData[i]);
                //     // datatemp.push(this.ChequesClearReturnData[i]);
                //     //this.deposited = this.deposited + 1;
                // }
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
       // this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));

    }

    Cancelled() {
        this.chequeboxshoworhide=false
        this.fromdate="";this.todate="";
        this.pageSetUp();
        this.modeofreceipt = "CANCEL";
        this.GetChequesOnHand(this.bankid, this.startindex, this.endindex, this._searchText);
        // $('#search').val("");
        this.status = "cancelled";
        this.pdfstatus = "Cancelled"
        this.datetitle = "Cancelled Date";
        this.gridData = [];
        this.gridDatatemp = [];
        // this.dataTemp = [];
        // this.cancelled = 0;
        this.GridColumnsHide();
        this.brsdateshowhidedeposited = false;
        this.brsdateshowhidecancelled = true;
        this.BrsDateForm.controls['frombrsdate'].setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
        this.BrsDateForm.controls['tobrsdate'].setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
        let datatemp = [];
        let grid:any = [];
        for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
            // if (this.ChequesClearReturnData[i].pchequestatus == "C") {
            //     grid.push(this.ChequesClearReturnData[i]);
            //     //datatemp.push(this.ChequesClearReturnData[i]);
            //     //this.cancelled = this.cancelled + 1;
            // }
        }
        this.gridData = JSON.parse(JSON.stringify(grid));
        if (this.gridData.length > 0) {
            this.showicons = true
        }
        else {
            this.showicons = false
        }
        // this.gridData.filter(data => {
        //     data.preceiptdate = this._commonService.getFormatDateGlobal((data.preceiptdate));
        //     data.pchequedate = this._commonService.getFormatDateGlobal((data.pchequedate));
        //     data.pdepositeddate = this._commonService.getFormatDateGlobal((data.pdepositeddate));
        // })


        //this.gridData=JSON.parse(JSON.stringify(grid));
        // this.gridDatatemp=this.gridData;
        // this.dataTemp=JSON.parse(JSON.stringify(grid))

        // this.gridData.filter(data=>{
        //     data.preceiptdate=this._commonService.getFormatDateGlobal((data.preceiptdate));
        //     data.pchequedate=this._commonService.getFormatDateGlobal((data.pchequedate));
        //     data.pdepositeddate=this._commonService.getFormatDateGlobal((data.pdepositeddate));  
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

        this.totalElements = this._countData["return_count"];
        this.page.totalElements = this._countData["return_count"];
        // this.page.totalPages = 1;
        if (this.page.totalElements > 10)
            this.page.totalPages = parseInt((this.page.totalElements / 10).toString()) + 1;


    }

    Cancelled1() {
        this.modeofreceipt = "CANCEL";
        // $('#search').val("");
        this.status = "cancelled";
        this.pdfstatus = "Cancelled"
        this.datetitle = "Cancelled Date";
        this.gridData = [];
        this.gridDatatemp = [];
        // this.dataTemp = [];
        // this.cancelled = 0;
        this.GridColumnsHide();
        this.brsdateshowhidedeposited = false;
        this.brsdateshowhidecancelled = true;
        this.BrsDateForm.controls['frombrsdate'].setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
        this.BrsDateForm.controls['tobrsdate'].setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
        let datatemp = [];
        let grid:any = [];
        for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
            // if (this.ChequesClearReturnData[i].pchequestatus == "C") {
            //     grid.push(this.ChequesClearReturnData[i]);
            //     //datatemp.push(this.ChequesClearReturnData[i]);
            //     //this.cancelled = this.cancelled + 1;
            // }
        }
        this.gridData = JSON.parse(JSON.stringify(grid));
        if (this.gridData.length > 0) {
            this.showicons = true
        }
        else {
            this.showicons = false
        }
      //  this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
    }
    pdfOrprint(printorpdf:any) {
        debugger;
        this.Totalamount = 0;
        let GetChequesInBankData = this._accountingtransaction.GetChequesOnHandData(this.bankid, 0, 999999, this.modeofreceipt, this._searchText, "PDF");
        let ChequesClearReturnData = this._accountingtransaction.DataFromBrsDatesChequesOnHand(this.fromdate, this.todate, this.bankid, this.modeofreceipt, this._searchText, 0, 99999);
        //this._accountingtransaction.GetChequesInBankData(this.bankid,0,999999,this.modeofreceipt,this._searchText,"PDF")
        forkJoin(GetChequesInBankData, ChequesClearReturnData)
            .subscribe(result => {
                let gridData: any;
                debugger;
                // if (this.pdfstatus == "Deposited" || this.pdfstatus == "Cancelled") {
                //     gridData = result[1]["pchequesclearreturnlist"];
                // }
                // else {
                //     gridData = result[0].pchequesOnHandlist;
                // }
                let rows = [];
                let reportname = "Cheques On Hand";
                let gridheaders;
                let colWidthHeight;
                if (this.pdfstatus == "Deposited" || this.pdfstatus == "Cancelled") {
                    colWidthHeight = {
                        0: { cellWidth: 'auto', halign: 'center' }, 1: { cellWidth: 'auto', halign: 'left' }, 2: { cellWidth: 18, halign: 'right' }, 3: { cellWidth: 15, halign: 'center' },4: { cellWidth: 15, halign: 'center' },
                        5: { cellWidth: 'auto', halign: 'center' }, 6: { cellWidth: 'auto', halign: 'center' }, 7: { cellWidth: 'auto', halign: 'center' }, 8: { cellWidth: 'auto' },
                        9: { cellWidth: 'auto' }
                        //,9:{cellWidth:'auto',halign:'center'}
                    }
                    gridheaders = ["Cheque/Reference No.", "Branch Name", "Amount","Receipt No", "Receipt ID", "Receipt Date", "Cheque Date", this.datetitle, "Transaction Mode", "Cheque Bank Name", "Party"];
                }
                else {
                    colWidthHeight = {
                        0: { cellWidth: 'auto', halign: 'center' }, 1: { cellWidth: 'auto', }, 2: { cellWidth: 18, halign: 'right' }, 3: { cellWidth: 15, halign: 'center' },4: { cellWidth: 15, halign: 'center' }, 5: { cellWidth: 'auto', halign: 'center' }, 6: { cellWidth: 'auto', halign: 'center' }, 7: { cellWidth: 'auto' },
                        8: { cellWidth: 'auto' }, 9: { cellWidth: 'auto' }, 10: { cellWidth: 'auto', halign: 'center' }
                    }
                    gridheaders = ["Cheque/Reference No.", "Branch Name", "Amount", "Receipt No", "Receipt ID", "Receipt Date", "Cheque Date", "Transaction Mode", "Cheque Bank Name", "Party", "Self Cheque"];
                }

                let datereceipt;
                gridData.forEach((element:any) => {
                    debugger;
                    let receiptdate = element.preceiptdate;
                    //let  DateFormat3= this._CommonService.getDateObjectFromDataBase(cleardate);
                   // let datereceipt = this._commonService.getFormatDateGlobal(receiptdate);
                   // let depositeddate = this._commonService.getFormatDateGlobal(element.pdepositeddate);
                    let chequedate;
                    if (element.pchequedate == null) {
                        chequedate = "";
                    }
                    else {
                       // chequedate = this._commonService.getFormatDateGlobal(element.pchequedate);
                    }
                    //let  DateFormat4= this._CommonService.getDateObjectFromDataBase(receiptdate);

                    let totalreceivedamt;
                    if (element.ptotalreceivedamount != 0) {
                       // totalreceivedamt = this._commonService.currencyformat(element.ptotalreceivedamount);
                       // totalreceivedamt = this._commonService.convertAmountToPdfFormat(totalreceivedamt);
                        this.Totalamount += element.ptotalreceivedamount;
                    }
                    else {
                        totalreceivedamt = "";
                    }
                    // totalreceivedamt = this._commonService.convertAmountToPdfFormat(totalreceivedamt);
                    let temp;

                    if (this.pdfstatus == "Deposited" || this.pdfstatus == "Cancelled") {
                        temp = [element.pChequenumber, element.pbranchname, totalreceivedamt, element.receiptnumbers, element.preceiptid, datereceipt, chequedate, Deposited, element.ptypeofpayment, element.cheque_bank, element.ppartyname, element.selfchequestatus];
                    }
                    else {
                        temp = [element.pChequenumber, element.pbranchname, totalreceivedamt, element.receiptnumbers,element.preceiptid, datereceipt, chequedate, element.ptypeofpayment, element.cheque_bank, element.ppartyname, element.selfchequestatus];
                    }
                    rows.push(temp);
                });

                // let amounttotal = this._commonService.convertAmountToPdfFormat(this._commonService.currencyformat(this.amounttotal));
                //let amounttotal = this._commonService.convertAmountToPdfFormat(this._commonService.currencyformat(this.Totalamount));;
                let lbl = {
                    content: 'Total',
                    colSpan: 2,
                    styles: {
                        halign: 'right', fontSize: 8, fontStyle: 'bold'//, textColor: "#663300", fillColor: "#e6f7ff" 
                    }
                };
                let lblvalue = {
                    //content: '' + amounttotal + '',
                    //colSpan: 2,
                    styles: {
                        halign: 'right', fontSize: 8, fontStyle: 'bold'//, textColor: "#663300", fillColor: "#e6f7ff" 
                    }
                };
                let trow = [];
                trow = [lbl, lblvalue, "", "", "", "", "", "", "", ""];
                rows.push(trow);

                // pass Type of Sheet Ex : a4 or lanscspe  
               // this._commonService._downloadchequesReportsPdf(reportname, rows, gridheaders, colWidthHeight, "landscape", "", "", "", printorpdf, amounttotal);
            });
    }

    Save() {
        debugger

        this.count = 0;
        this.DataForSaving = [];
        let isValid = true;
        let deposit = 0;
        this.ChequesOnHandValidation = {};
        this.gridData.filter((aa:any) => {
            if (aa.pchequestatus == "P") {
                deposit++;
            }
        })
        let validationcount = 0;
        for (let i = 0; i < this.gridData.length; i++) {
            if ((this.gridData[i].pchequestatus == "P" || this.gridData[i].pchequestatus == "C") && this.gridData[i].selfchequestatus == true) {
                validationcount++;
            }
        }
        const control = <FormGroup>this.ChequesOnHandForm['controls']['bankname'];
        if (deposit > 0 && validationcount > 0) {
            control.setValidators(Validators.required);
        }
        else {
            control.clearValidators();
        }
        control.updateValueAndValidity();


        if (this.checkValidations(this.ChequesOnHandForm, isValid)) {
            if (confirm("Do You Want To Save ?")) {
                this.disablesavebutton = true;
                this.buttonname = 'Processing';
                for (let i = 0; i < this.gridData.length; i++) {
                    if (this.gridData[i].pchequestatus == "P") {
                        this.count++;
                        //  if (this.SelectBankData != "" && this.SelectBankData != undefined) {


                        if (this.bankdetails) {
                            this.gridData[i].pdepositbankid = this.bankdetails.pdepositbankid;
                            this.gridData[i].pdepositbankname = this.bankdetails.pdepositbankname;
                        }
                        else {
                            this.gridData[i].pdepositbankid = '0';
                            this.gridData[i].pdepositbankname = '';
                        }

                        this.gridData[i].pchequestatus = this.gridData[i].pchequestatus;
                        this.gridData[i].pactualcancelcharges = this.gridData[i].pactualcancelcharges;
                       // this.DataForSaving.push(this.gridData[i]);
                        // }
                        //    else {
                        //         this.disablesavebutton = false;
                        //         this.buttonname = 'Save';
                        //     }
                    }
                    if (this.gridData[i].pchequestatus == "C") {
                        this.count++;
                        // if (this.SelectBankData != "" && this.SelectBankData != undefined) {
                        //     this.gridData[i].pchequestatus = this.gridData[i].pchequestatus;
                        //     this.gridData[i].pactualcancelcharges = this.gridData[i].pactualcancelcharges;
                       // this.DataForSaving.push(this.gridData[i]);
                        // }
                        // else {
                        //   //  this.ShowBankErrorMsg = true;
                        //   //  document.getElementById('bankselection').style.border = "1px solid red";
                        //     this.disablesavebutton = false;
                        //     this.buttonname = 'Save';
                        // }
                    }
                }

                // if (this.DataForSaving.length != 0) {
                //     for (let i = 0; i < this.DataForSaving.length; i++) {
                //         if (this.DataForSaving[i].pchequedate != null) {
                //             this.DataForSaving[i].pchequedate = this._commonService.getDateObjectFromDataBase(this.DataForSaving[i].pchequedate);
                //             this.DataForSaving[i].pchequedate = this._commonService.getFormatDateNormal(this.DataForSaving[i].pchequedate);
                //         }
                //         this.DataForSaving[i].pCreatedby = this._commonService.getcreatedby();
                //         this.DataForSaving[i].preceiptdate = this._commonService.getDateObjectFromDataBase(this.DataForSaving[i].preceiptdate);
                //         this.DataForSaving[i].preceiptdate = this._commonService.getFormatDateNormal(this.DataForSaving[i].preceiptdate);

                //         this.DataForSaving[i].pipaddress = this._commonService.getipaddress();
                //         if(!this._commonService.isNullOrEmptyString(this.DataForSaving[i].chitgroupstatus)){
                //             let splitdata = this.DataForSaving[i].chitgroupstatus.split('-');
                //             this.DataForSaving[i].ticketno = splitdata[1].replace(/[^0-9]+/g, '');                            
                //         }
                //     }

                // }
                if (this.DataForSaving.length == this.count && this.DataForSaving.length != 0) {
                    this.ChequesOnHandForm.controls['pchequesOnHandlist'].setValue(this.DataForSaving);
                    let chequsonhanddata = this.ChequesOnHandForm.value;
                    chequsonhanddata.ptransactiondate = this._commonService.getFormatDateNormal(chequsonhanddata.ptransactiondate);
                    let form = JSON.stringify(chequsonhanddata);
                    // let form = JSON.stringify(this.ChequesOnHandForm.value);
                    //console.log(this.ChequesOnHandForm.value)
                    this._accountingtransaction.SaveChequesOnHand(form).subscribe((data:any) => {

                        if (data) {
                           // this._commonService.showSuccessMessage();
                            this.Clear();
                        }
                        this.disablesavebutton = false;
                        this.buttonname = "Save";
                    }, (error: any) => {
                        //this._commonService.showErrorMessage(error);
                        this.disablesavebutton = false;
                        this.buttonname = "Save";
                        this.Clear()
                    });
                }
                else {
                    this.disablesavebutton = false;
                    this.buttonname = "Save";
                    this._commonService.showWarningMessage("Select atleast one record");
                }
            }
            else {
                this.disablesavebutton = false;
                this.buttonname = "Save";
            }
        }
    }

    Clear() {
        //$('#search').val("");
        this.ChequesOnHandValidation = {};
        this.ChequesOnHandForm.reset();
        this.ngOnInit();
        this.count = 0;
        this.DataForSaving = [];
        //  $("#bankselection").val("");
        //   this.ShowBankErrorMsg = false;
        this.SelectBankData = "";
        this.preferdrows=false
        //    document.getElementById('bankselection').style.border = "";

    }

    ShowBrsDeposit() {
        debugger;
        this.gridData = [];
        this._searchText = "";
        //  this.deposited = 0;
        this.deposited = 0;
        // let fromdate = this.ChequesOnHandForm.controls['pfrombrsdate'].value;
        let fromdate = this.ChequesOnHandForm.controls['pfrombrsdate'].value;
        let todate = this.ChequesOnHandForm.controls['ptobrsdate'].value;
        debugger;
        if (fromdate != null && todate != null) {
            this.OnBrsDateChanges(fromdate, todate);
            if (this.validate == false) {
                // fromdate = this.datepipe.transform(fromdate, 'dd-MMM-yyyy')
                // todate = this.datepipe.transform(todate, 'dd-MMM-yyyy')
                fromdate = this._commonService.getFormatDateNormal(fromdate);
                todate = this._commonService.getFormatDateNormal(todate);
                this.fromdate = fromdate;
                this.todate = todate;
                this.validatebrsdatedeposit = false;

                this.pageSetUp();
                this.GetDataOnBrsDates(fromdate, todate, this.bankid);

            }
            else {
                this.validatebrsdatedeposit = true;
            }
        }
        else {
            this._commonService.showWarningMessage("select fromdate and todate");
        }
    }

    ShowBrsCancel() {
        debugger;
        this._searchText = "";
        this.gridData = [];
        this.cancelled = 0;
        let fromdate = this.BrsDateForm.controls['frombrsdate'].value;
        let todate = this.BrsDateForm.controls['tobrsdate'].value;
        if (fromdate != null && todate != null) {
            this.OnBrsDateChanges(fromdate, todate);
            if (this.validate == false) {
                // fromdate = this.datepipe.transform(fromdate, 'dd-MMM-yyyy')
                // todate = this.datepipe.transform(todate, 'dd-MMM-yyyy')
                fromdate = this._commonService.getFormatDateNormal(fromdate);
                todate = this._commonService.getFormatDateNormal(todate);
                this.validatebrsdatecancel = false;
                this.todate = todate;
                this.validatebrsdatedeposit = false;

                this.pageSetUp();
                this.GetDataOnBrsDates(fromdate, todate, this.bankid);
                // if (this.bankid == 0) {
                //     this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
                //     this.BrsDateForm.controls.tobrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
                // }
                // else {
                //     this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankdetails.pfrombrsdate));
                //     this.BrsDateForm.controls.tobrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankdetails.ptobrsdate));
                // }

            }
            else {
                this.validatebrsdatecancel = true;
            }
        }
        else {
            this._commonService.showWarningMessage("select fromdate and todate");
        }
    }

    GetDataOnBrsDates(frombrsdate: any, tobrsdate: any, bankid: any) {
        this.ChequesClearReturnDataBasedOnBrs = [];
        let DataFromBrsDatesChequesOnHand = this._accountingtransaction.DataFromBrsDatesChequesOnHand(frombrsdate, tobrsdate, bankid, this.modeofreceipt, this._searchText, this.startindex, this.endindex);
        let GetChequesRowCount = this._accountingtransaction.GetChequesRowCount(this.bankid, this._searchText, frombrsdate, tobrsdate, "CHEQUESONHAND",'');

        // this._accountingtransaction.DataFromBrsDatesChequesOnHand(frombrsdate, tobrsdate, bankid)
        forkJoin(DataFromBrsDatesChequesOnHand, GetChequesRowCount)
            .subscribe(
                clearreturndata => {
                    debugger
                    let kk = [];
                    //this.ChequesClearReturnDataBasedOnBrs = clearreturndata[0]['pchequesclearreturnlist'];
                    console.log(clearreturndata)
                    for (let i = 0; i < this.ChequesClearReturnDataBasedOnBrs.length; i++) {
                        if (this.status == "deposited" && this.ChequesClearReturnDataBasedOnBrs[i].pchequestatus == "P") {
                            kk.push(this.ChequesClearReturnDataBasedOnBrs[i]);
                            // this.deposited = this.deposited + 1;
                        }
                        if (this.status == "cancelled" && this.ChequesClearReturnDataBasedOnBrs[i].pchequestatus == "C") {
                            kk.push(this.ChequesClearReturnDataBasedOnBrs[i]);
                            // this.cancelled = this.cancelled + 1;
                        }
                    }
                    //this._countData = clearreturndata[1];
                    this.CountOfRecords();
                    this.gridData = kk;
                    if (this.status == "deposited") {
                        this.totalElements = this._countData["clear_count"];
                        this.page.totalElements = this._countData["clear_count"];
                    } else {
                        this.totalElements = this._countData["return_count"];
                        this.page.totalElements = this._countData["return_count"];
                    }
                    // this.page.totalPages = 1;
                    if (this.page.totalElements > 10)
                        this.page.totalPages = parseInt((this.page.totalElements / 10).toString()) + 1;

                    // this.pageCriteria.totalrows = this.gridData.length;
                    // this.pageCriteria.TotalPages = 1;
                    // if (this.pageCriteria.totalrows > 10)
                    //     this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / 10).toString()) + 1;
                    // if (this.gridData.length < this.pageCriteria.pageSize) {
                    //     this.pageCriteria.currentPageRows = this.gridData.length;
                    // }
                    // else {
                    //     this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
                    // }
                    // this.gridData.filter(data => {
                    //     data.preceiptdate = this._commonService.getFormatDateGlobal((data.preceiptdate));
                    //     data.pchequedate = this._commonService.getFormatDateGlobal((data.pchequedate));
                    //     data.pdepositeddate = this._commonService.getFormatDateGlobal((data.pdepositeddate));
                    // })
                }, error => { this._commonService.showErrorMessage(error) })
    }
    GetDataOnBrsDates1(frombrsdate:any, tobrsdate:any, bankid:any) {
        // let DataFromBrsDatesChequesOnHand = this._accountingtransaction.DataFromBrsDatesChequesOnHand(frombrsdate, tobrsdate, bankid, this.modeofreceipt, this._searchText, this.startindex, this.endindex);
        // let GetChequesRowCount = this._accountingtransaction.GetChequesRowCount(this.bankid, this._searchText, frombrsdate, tobrsdate, "CHEQUESONHAND");

        // this._accountingtransaction.DataFromBrsDatesChequesOnHand(frombrsdate, tobrsdate, bankid)
        this._accountingtransaction.DataFromBrsDatesChequesOnHand(frombrsdate, tobrsdate, bankid, this.modeofreceipt, this._searchText, this.startindex, this.endindex)
            .subscribe(
                (clearreturndata:any) => {
                    debugger
                    let kk = [];
                    this.ChequesClearReturnDataBasedOnBrs = clearreturndata['pchequesclearreturnlist'];
                    console.log(clearreturndata)
                    for (let i = 0; i < this.ChequesClearReturnDataBasedOnBrs.length; i++) {
                        if (this.status == "deposited" && this.ChequesClearReturnDataBasedOnBrs[i].pchequestatus == "P") {
                            kk.push(this.ChequesClearReturnDataBasedOnBrs[i]);
                            // this.deposited = this.deposited + 1;
                        }
                        if (this.status == "cancelled" && this.ChequesClearReturnDataBasedOnBrs[i].pchequestatus == "C") {
                            kk.push(this.ChequesClearReturnDataBasedOnBrs[i]);
                            // this.cancelled = this.cancelled + 1;
                        }
                    }
                    this.gridData = kk;

                }, (error:any) => { this._commonService.showErrorMessage(error) })
    }
    OnBrsDateChanges(fromdate: any, todate: any) {

        if (fromdate > todate) {
            this.validate = true;
        }
        else {
            this.validate = false;
        }
    }

    
    checkValidations(group: FormGroup, isValid: boolean): boolean {

        try {
            Object.keys(group.controls).forEach((key: string) => {
                isValid = this.GetValidationByControl(group, key, isValid);
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
            if (formcontrol) {
                if (formcontrol instanceof FormGroup) {
                    this.checkValidations(formcontrol, isValid)
                }
                else if (formcontrol.validator) {
                    this.ChequesOnHandValidation[key] = '';
                    if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                        let lablename;
                        lablename = (document.getElementById(key) as HTMLInputElement).title;
                        let errormessage;
                        for (const errorkey in formcontrol.errors) {
                            if (errorkey) {
                                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                                this.ChequesOnHandValidation[key] += errormessage + ' ';
                                isValid = false;
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
           // this.showErrorMessage(e);
            return false;
        }
        return isValid;
    }
    showErrorMessage(errormsg: string) {
        this._commonService.showErrorMessage(errormsg);
    }
    // BlurEventAllControll(fromgroup: FormGroup) {
    //     try {
    //         Object.keys(fromgroup.controls).forEach((key: string) => {
    //             this.setBlurEvent(fromgroup, key);
    //         })
    //     }
    //     catch (e) {
    //        // this.showErrorMessage(e);
    //         return false;
    //     }
    // }

    BlurEventAllControll(fromgroup: FormGroup): boolean {
    try {
        Object.keys(fromgroup.controls).forEach((key: string) => {
            this.setBlurEvent(fromgroup, key);
        });
        return true; 
    }
    catch (e) {
       // this.showErrorMessage(e);
        return false;
    }
}


    // setBlurEvent(fromgroup: FormGroup, key: string) {
    //     try {
    //         let formcontrol;
    //         formcontrol = fromgroup.get(key);
    //         if (formcontrol) {
    //             if (formcontrol instanceof FormGroup) {
    //                 this.BlurEventAllControll(formcontrol)
    //             }
    //             // else {
    //             //     if (formcontrol.validator)
    //             //         fromgroup.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
    //             //   }
    //         }
    //     }
    //     catch (e) {
    //         //this.showErrorMessage(e);
    //         return false;
    //     }
    // }

    setBlurEvent(fromgroup: FormGroup, key: string): void {
    try {
        const formcontrol = fromgroup.get(key);
        if (formcontrol) {
            if (formcontrol instanceof FormGroup) {
                this.BlurEventAllControll(formcontrol);
            }
            // else {
            //     if (formcontrol.validator)
            //         formcontrol.valueChanges.subscribe((data) => { 
            //             this.GetValidationByControl(fromgroup, key, true) 
            //         });
            // }
        }
    }
    catch (e) {
        // this.showErrorMessage(e);
        // no return needed
    }
}



      // GridColumnsShow() {
      //   throw new Error('Method not implemented.');
      // }
      GetChequesOnHand(bankid: any, startindex: any, endindex: any, _searchText: string) {
        throw new Error('Method not implemented.');
      }
      // GridColumnsHide() {
      //   throw new Error('Method not implemented.');
      // }
      // checkValidations(ChequesOnHandForm: FormGroup<any>, isValid: boolean) {
      //   throw new Error('Method not implemented.');
      // }
      // Clear() {
      //   throw new Error('Method not implemented.');
      // }
      // OnBrsDateChanges(fromdate: any, todate: any) {
      //   throw new Error('Method not implemented.');
      // }
      // GetDataOnBrsDates(fromdate: any, todate: any, bankid: any) {
      //   throw new Error('Method not implemented.');
      // }
      // CountOfRecords() {
      //   throw new Error('Method not implemented.');
      // }
      // GetValidationByControl(group: any, key: string, isValid: any): any {
      //   throw new Error('Method not implemented.');
      // }
      // showErrorMessage(e: unknown) {
      //   throw new Error('Method not implemented.');
      // }
      // setBlurEvent(fromgroup: any, key: string) {
      //   throw new Error('Method not implemented.');
      // }
    public group: any[] = [{
        field: 'preceiptdate'
    }, {
        field: 'pChequenumber', dir: 'desc'
    }
    ];
    // public allData(): ExcelExportData {
    //   const result: ExcelExportData = {
    //       data: process(this.gridData, { group: this.group, sort: [{ field: 'preceiptdate', dir: 'desc' }, { field: 'pChequenumber', dir: 'desc' }] }).data,
    //       group: this.group
    //   };

    //   return result;
    // }

    sortGridBasedOnBankSelection(bankid:any) {
        debugger;
        //  console.log(this.ChequesOnHandData);
        console.log(this.ChequesClearReturnData);
        this.deposited = 0;
        if (this.bankid == 0) {
            for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
                // if (this.ChequesClearReturnData[i].pchequestatus == "P") {
                //     this.deposited = this.deposited + 1;
                // }
            }
        }
        else {
            for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
                // if (this.ChequesClearReturnData[i].pchequestatus == "P" && this.ChequesClearReturnData[i].pdepositbankid == bankid) {
                    this.deposited = this.deposited + 1;
                }
            }
        }
    //     if (this.status == "deposited") {
    //         this.Deposited();
    //     }
    // }

    export(): void {
        let rows:any = [];
        let GetChequesInBankData = this._accountingtransaction.GetChequesOnHandData(this.bankid, 0, 999999, this.modeofreceipt, this._searchText, "PDF");
        let ChequesClearReturnData = this._accountingtransaction.DataFromBrsDatesChequesOnHand(this.fromdate, this.todate, this.bankid, this.modeofreceipt, this._searchText, 0, 99999);
        //this._accountingtransaction.GetChequesInBankData(this.bankid,0,999999,this.modeofreceipt,this._searchText,"PDF")
        forkJoin(GetChequesInBankData, ChequesClearReturnData)
            .subscribe(result => {
                let gridData: any;
                debugger;
                // if (this.pdfstatus == "Deposited" || this.pdfstatus == "Cancelled") {
                //     gridData = result[1]["pchequesclearreturnlist"];
                // }
                // else {
                //     gridData = result[0].pchequesOnHandlist;
                // }


                gridData.forEach((element:any) => {
                    debugger;
                    let receiptdate = element.preceiptdate;
                    //let  DateFormat3= this._CommonService.getDateObjectFromDataBase(cleardate);
                    let datereceipt = this._commonService.getFormatDateGlobal(receiptdate);
                    let depositeddate = this._commonService.getFormatDateGlobal(element.pdepositeddate);
                    let chequedate;
                    if (element.pchequedate == null) {
                        chequedate = "";
                    }
                    else {
                        chequedate = this._commonService.getFormatDateGlobal(element.pchequedate);
                    }
                    //let  DateFormat4= this._CommonService.getDateObjectFromDataBase(receiptdate);

                    let totalreceivedamt;
                    if (element.ptotalreceivedamount != 0) {
                        //totalreceivedamt = this._commonService.currencyformat(element.ptotalreceivedamount);
                        //totalreceivedamt = this._commonService.convertAmountToPdfFormat(totalreceivedamt);
                        totalreceivedamt=element.ptotalreceivedamount;
                    }
                    else {
                        totalreceivedamt = "";
                    }
                    // totalreceivedamt = this._commonService.convertAmountToPdfFormat(totalreceivedamt);
                    let temp;
                    let dataobject;
                    if (this.pdfstatus == "Deposited" || this.pdfstatus == "Cancelled") {
                        if (this.pdfstatus == "Deposited") {
                            dataobject = {
                                "Cheque/ Reference No.": element.pChequenumber,
                                "Branch Name": element.pbranchname,
                                "Amount": totalreceivedamt,
                                "Receipt No": element.receiptnumbers,
                                "Receipt Id": element.preceiptid,
                                "Receipt Date": datereceipt,
                                "Cheque Date": chequedate,
                                "Deposited Date": depositeddate,
                                "Transaction Mode": element.ptypeofpayment,
                                "Cheque Bank Name": element.cheque_bank,
                                "Party": element.ppartyname,
                                //  "Self Cheque Status":element.selfchequestatus,
                            }
                        }
                        if (this.pdfstatus == "Cancelled") {
                            dataobject = {
                                "Cheque/ Reference No.": element.pChequenumber,
                                "Branch Name": element.pbranchname,
                                "Amount": totalreceivedamt,
                                "Receipt No": element.receiptnumbers,
                                "Receipt Id": element.preceiptid,
                                "Receipt Date": datereceipt,
                                "Cheque Date": chequedate,
                                "Cancelled Date": depositeddate,
                                "Transaction Mode": element.ptypeofpayment,
                                "Cheque Bank Name": element.cheque_bank,
                                "Party": element.ppartyname,
                                //  "Self Cheque Status":element.selfchequestatus,
                            }
                        }
                        // temp = [element.pChequenumber,totalreceivedamt,element.preceiptid,datereceipt,chequedate,depositeddate, element.ptypeofpayment, element.cheque_bank,element.ppartyname,element.selfchequestatus];
                    }
                    else {
                        dataobject = {
                            "Cheque/ Reference No.": element.pChequenumber,
                            "Branch Name": element.pbranchname,
                            "Amount": totalreceivedamt,
                            "Receipt No": element.receiptnumbers,
                            "Receipt Id": element.preceiptid,
                            "Receipt Date": datereceipt,
                            "Cheque Date": chequedate,
                            "Transaction Mode": element.ptypeofpayment,
                            "Cheque Bank Name": element.cheque_bank,
                            "Party": element.ppartyname,
                            "Self Cheque": element.selfchequestatus,
                        }
                        //  temp = [element.pChequenumber,element.pbranchname,totalreceivedamt,element.preceiptid,datereceipt,chequedate, element.ptypeofpayment, element.cheque_bank,element.ppartyname,element.selfchequestatus];
                    }

                    rows.push(dataobject);
                });
                this._commonService.exportAsExcelFile(rows, 'Cheques On Hand');
            });
        

    }
    preferedselection(eve:any){
 
        let maxvalue= (this.pageCriteria.CurrentPage)*10
         let minvalue=maxvalue-10
         for(let i = minvalue; i <= maxvalue-1; i++){
          if(eve.target.checked){
            this.preferdrows=true
            if(this.gridData[i].clearstatus == 'YES' ){
          this.checkedDeposit(eve, this.gridData[i])
            }
          }else{
           
            this.checkedDeposit(eve, this.gridData[i])
            this.preferdrows=false
          }
          }
        }

        CancelChargesOk(value: any) {
    console.log('CancelChargesOk called with:', value);

    
  }
        
}






    
  
function getChequeReturnCharges() {
  throw new Error('Function not implemented.');
}

function CancelChargesOk(value: any) {
  throw new Error('Function not implemented.');
}

function GridColumnsShow() {
  throw new Error('Function not implemented.');
}

function GridColumnsHide() {
  throw new Error('Function not implemented.');
}

function CountOfRecords() {
  throw new Error('Function not implemented.');
}

function All() {
  throw new Error('Function not implemented.');
}

function All1() {
  throw new Error('Function not implemented.');
}

function ChequesReceived() {
  throw new Error('Function not implemented.');
}

function ChequesReceived1() {
  throw new Error('Function not implemented.');
}

function OnlineReceipts() {
  throw new Error('Function not implemented.');
}

function OnlineReceipts1() {
  throw new Error('Function not implemented.');
}

function Deposited() {
  throw new Error('Function not implemented.');
}

function Deposited1() {
  throw new Error('Function not implemented.');
}

function Cancelled() {
  throw new Error('Function not implemented.');
}

function Cancelled1() {
  throw new Error('Function not implemented.');
}

function pdfOrprint(printorpdf: any) {
  throw new Error('Function not implemented.');
}

function Save() {
  throw new Error('Function not implemented.');
}

function Clear() {
  throw new Error('Function not implemented.');
}

function ShowBrsDeposit() {
  throw new Error('Function not implemented.');
}

function ShowBrsCancel() {
  throw new Error('Function not implemented.');
}

function GetDataOnBrsDates(frombrsdate: any, tobrsdate: any, bankid: any) {
  throw new Error('Function not implemented.');
}

 function GetDataOnBrsDates1(frombrsdate: any, tobrsdate: any, bankid: any) {
   throw new Error('Function not implemented.');
 }

function OnBrsDateChanges(fromdate: any, todate: any) {
  throw new Error('Function not implemented.');
}


// function checkValidations(group: any, FormGroup: typeof FormGroup, isValid: any, boolean: any) {
//   throw new Error('Function not implemented.');
// }

// function GetValidationByControl(formGroup: any, FormGroup: typeof FormGroup, key: any, string: any, isValid: any, boolean: any) {
//   throw new Error('Function not implemented.');
// }

// function showErrorMessage(errormsg: any, string: any) {
//   throw new Error('Function not implemented.');
// }

// function BlurEventAllControll(fromgroup: any, FormGroup: typeof FormGroup) {
//   throw new Error('Function not implemented.');
//  }

// function setBlurEvent(fromgroup: any, FormGroup: typeof FormGroup, key: any, string: any) {
//   throw new Error('Function not implemented.');
// }




