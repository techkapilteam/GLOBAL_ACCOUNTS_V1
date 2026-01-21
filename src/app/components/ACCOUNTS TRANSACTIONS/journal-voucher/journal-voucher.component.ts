// import { Component } from '@angular/core';
// import { FormGroup, ɵInternalFormsSharedModule } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators ,ɵInternalFormsSharedModule} from '@angular/forms';
// import { AccountingTransactionsService } from 'src/app/Services/Transactions/AccountingTransactions/accounting-transactions.service';
// import { CommonService } from 'src/app/Services/common.service';
import { CommonModule, DatePipe } from '@angular/common';
//  import { PageCriteria } from 'src/app/Models/pagecriteria';
//  import { PageCriteria } from '../Models/pagecriteria';

// import { PageCriteria } from 'src/app/Models/pageCriteria';
// import { DataBindingDirective, SelectableSettings } from '@progress/kendo-angular-grid';
// import { GroupDescriptor } from '@progress/kendo-data-query';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// import { error } from 'console';
// import { AccountingReportsService } from 'src/app/Services/Transactions/AccountingReports/accounting-reports.service';
declare var $: any;
@Component({
  selector: 'app-journal-voucher',
  imports: [
     CommonModule,
    ReactiveFormsModule,
    NgxDatatableModule,
     BsDatepickerModule,
    
    
  ],
  standalone:true,
  templateUrl: './journal-voucher.component.html',
  styleUrl: './journal-voucher.component.css',
})

export class JournalVoucherComponent {


  CashOnHandForm!: FormGroup;
  BrsDateForm!: FormGroup;

  showhidegridcolumns = false;
  gridData: any[] = [];

  gridData1 = [
    { id: 1, name: 'John Doe', amount: 100, date: new Date('2026-01-01') },
    { id: 2, name: 'Jane Smith', amount: 250, date: new Date('2026-01-02') },
    { id: 3, name: 'Alice Johnson', amount: 400, date: new Date('2026-01-03') },
  ];
  //   gridData = [
  //   { pdepositstatus: false, ppartyname: 'John Doe', ptotalreceivedamount: 100, preceiptno: 'R001', preceiptid: 101, preceiptdate: new Date('2026-01-01') },
  //   { pdepositstatus: true, ppartyname: 'Jane Smith', ptotalreceivedamount: 250, preceiptno: 'R002', preceiptid: 102, preceiptdate: new Date('2026-01-02') },
  //   { pdepositstatus: false, ppartyname: 'Alice Johnson', ptotalreceivedamount: 400, preceiptno: 'R003', preceiptid: 103, preceiptdate: new Date('2026-01-03') }
  // ];
  gridDatatemp: any[] = [];

  BanksList: any[] = [];
  BankNamesList: any[] = [];

  amounttotal: any;
  currencySymbol: any;
  pcashonhandbalance: any;

  CashOnHandValidation: any = {};

  saveshowhide = true;
  disablesavebutton = false;

  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public fromdate: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public todate: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  //  pageCriteria!: PageCriteria;

  fromdatevisible = true;
  showbuttontext = 'Show';
  disableShowbutton = false;
  datelable = 'To Date';
  AsOnDate = 'F';

  pdatepickerenablestatus!: boolean;
  companydetails: any;
  bankid: number | undefined;
  banknameshowhide!: boolean;
  checkbox: any;
  gridLoading!: boolean;
  selectedBankdetails!: never[];
  selectedBankname: any;
  selectedtotal!: number;
  bankname!: string;
  SelectBankData: any;
  bankdetails: any;
  caobranchid: any;
  _commonService: any;
  allrowsSelected!: boolean;
  PopupData: any;
  chequenumber: any;
  brsdateshowhidedeposited!: boolean;
  brsdateshowhidecancelled!: boolean;
  hiddendate!: boolean;
  all!: number;
  chequesreceived!: number;
  onlinereceipts!: number;
  cancelled!: number;
  ChequesOnHandData: any;
  status!: string;
  pdfstatus!: string;
  datetitle: any;
  count!: number;
  DataForSaving!: never[];
  buttonname!: string;
  selectedBankid: any;
  _accountingtransaction: any;
  jvlistDatanew!: never[];
  validate!: boolean;
  validatebrsdatedeposit!: boolean;
  validatebrsdatecancel!: boolean;
  AccountingReportsService: any;
event: { target: { checked: any; }; }|undefined;
bankDropdowmHide: any;

  constructor(
    private fb: FormBuilder,
    private datepipe: DatePipe,
    
    // private commonService: CommonService,
    // private accountingReportsService: AccountingReportsService
  ) {

    // this.dpConfig.containerClass = this.commonService.datePickerPropertiesSetup('containerClass');
    // this.dpConfig.showWeekNumbers = this.commonService.datePickerPropertiesSetup('showWeekNumbers');
    this.dpConfig.maxDate = new Date();
    // this.dpConfig.dateInputFormat = this.commonService.datePickerPropertiesSetup('dateInputFormat');

    this.fromdate = { ...this.dpConfig };
    this.todate = { ...this.dpConfig };

    // this.pageCriteria = new PageCriteria();
  }


    ngOnInit(): void {
        // this.currencySymbol = this._commonService.currencysymbol;
        this.CashOnHandForm = this.fb.group({
            ptransactiondate: [new Date(), Validators.required],
            bankname: ['', Validators.required],
            banknameForLegal: [''],
            //   pfrombrsdate: [''],
            //   ptobrsdate: [''],
            pchequesOnHandlist: [],
            // SearchClear: [''],
            //  schemaname: [this._commonService.getschemaname()],
            fromdate:[new Date()],
            todate:[new Date()],
            asondate:['']
        })
        // this.companydetails=this._commonService._getCompanyDetails();
        this.pdatepickerenablestatus=this.companydetails?.pdatepickerenablestatus;

        // this.BrsDateForm = this.fb.group({
        //     frombrsdate: [''],
        //     tobrsdate: ['']
        // })
        this.bankid = 0;
        this.banknameshowhide = false;
        this.CashOnHandValidation = {};
        //this.GetBankBalance(this.bankid);
        this.GetCashonhandBalance();

        // this._accountingtransaction.GetCAOBranchList(this._commonService.getschemaname()).subscribe(bankslist => {
        //     this.BanksList = bankslist;
        // })

       // this.setPageModel();
        // this.GetChequesOnHand(this.bankid);
        this.BlurEventAllControll(this.CashOnHandForm);
        this.bankNamesList();
        // let Companyreportdetails = this._commonService._getCompanyDetails();
        // let legalCellName = Companyreportdetails.plegalcell_name;
        // if(legalCellName == this._commonService.getbranchname()){
        //     this.bankDropdowmHide = true;
        // }
        // else{
        //     this.bankDropdowmHide = false;
        // }
    }
    public setSelectableSettings(): void {
        // this.selectableSettings = {
        //     checkboxOnly: this.checkbox,
        //     //mode: this.mode
        //     mode: "multiple"
        // };
    }

    bankNamesList() {
        debugger;
        // this._accountingtransaction.GetBanksList(this._commonService.getschemaname()).subscribe(res => {
        //     debugger;
        //     this.BankNamesList = res;
        // })
    }

    //initializing page model
    // setPageModel() {
    //     // this.pageCriteria.pageSize = this._commonService.pageSize;
    //     this.pageCriteria.offset = 0;
    //     this.pageCriteria.pageNumber = 1;
    //     this.pageCriteria.footerPageHeight = 50;
    // }
    //for ngx table footer page navigation purpose
    // onFooterPageChange(event:any): void {
    //     this.pageCriteria.offset = event.page - 1;
    //     this.pageCriteria.CurrentPage = event.page;
    //     if (this.pageCriteria.totalrows < event.page * this.pageCriteria.pageSize) {
    //         this.pageCriteria.CurrentPage = this.pageCriteria.totalrows % this.pageCriteria.pageSize;
    //     }
    //     else {
    //         this.pageCriteria.CurrentPage = this.pageCriteria.pageSize;
    //     }

    // }


    GetCashonhandBalance() {
        // this._accountingtransaction.GetCashonhandBalance().subscribe(data => {
        //     console.log(data);
        //     this.pcashonhandbalance = data;
        //     if (parseFloat(this.pcashonhandbalance) != 0) {
        //         this.buttonname = "Update";
        //         this.GetChequesOnHand("");
        //     } else {
        //         this.buttonname = "Save";
        //     }
        // });
    }
    GetBankBalance(bankid:number) {
        debugger;
        // this._accountingtransaction.GetBankBalance(bankid).subscribe(bankdetails => {
        //     debugger
        //     this.bankbalancedetails = bankdetails;
        //     if (this.bankid == 0) {
        //         if (this.bankbalancedetails._BankBalance < 0) {
        //             this.bankbalance = Math.abs(this.bankbalancedetails._BankBalance)
        //             this.bankbalancetype = "Cr";
        //         }
        //         else if (this.bankbalancedetails._BankBalance == 0) {
        //             this.bankbalance = 0;
        //             this.bankbalancetype = "";
        //         }
        //         else {
        //             this.bankbalance = (this.bankbalancedetails._BankBalance)
        //             this.bankbalancetype = "Dr";
        //         }

        //     }
        //     debugger;
        //     console.log(this.bankbalancedetails.ptobrsdate);
        //     this.brsdate = this._commonService.getFormatDateGlobal(this.bankbalancedetails.ptobrsdate);

        //     //   this.CashOnHandForm.controls.pfrombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
        //     //   this.BrsDateForm.controls.frombrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.pfrombrsdate));
        //     //   this.CashOnHandForm.controls.ptobrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));
        //     //   this.BrsDateForm.controls.tobrsdate.setValue(this._commonService.getDateObjectFromDataBase(this.bankbalancedetails.ptobrsdate));

        // })
    }
    GetChequesOnHand(bankid:number) {
        debugger;
        this.gridLoading = true;
        // let fromdate = this._commonService.getFormatDateNormal(this.CashOnHandForm.controls.fromdate.value);
        // let todate = this._commonService.getFormatDateNormal(this.CashOnHandForm.controls.todate.value);
        this.disableShowbutton=true;
        this.showbuttontext="Processing"
        // this._accountingtransaction.GetCashOnHandData(bankid).subscribe(data => {
        // this._accountingtransaction.GetCashOnHandData_(bankid,fromdate,todate,this.AsOnDate).subscribe(data => {
        //     debugger;
        //     console.log(data)
        //     this.disableShowbutton=false;
        //     this.showbuttontext="Show";
        //     this.gridLoading = false;
        //     // if (bankid == 0) {
           // let data1 = data.pchequesOnHandlist;
            //  this.cashbalance = data._CashBalance;
             this.cashbalance ;
        //     // data1.filter(i => {
        //     //     i.preceiptdate = this._commonService.getFormatDateGlobal(i.preceiptdate);
        //     //     i.pchequedate = this._commonService.getFormatDateGlobal(i.pchequedate);
        //     // })
        //     // this.ChequesOnHandData = data.pchequesOnHandlist;
        //     console.log(data1);
        //     this.ChequesOnHandData = data1;
        //     // this.ChequesClearReturnData = data.pchequesclearreturnlist;
        //     this.CountOfRecords();

        //     if (this.status == "all") {
        //         this.All();
        //     }
        //     //   if (this.status == "chequesreceived") {
        //     //       this.ChequesReceived();
        //     //   }
        //     //   if (this.status == "onlinereceipts") {
        //     //       this.OnlineReceipts();
        //     //   }
        //     //   if (this.status == "deposited") {
        //     //       this.Deposited();
        //     //   }
        //     //   if (this.status == "cancelled") {
        //     //       this.Cancelled();
        //     //   }
        // }, (error) => { 
        //     this._commonService.showErrorMessage(error);
        //     this.disableShowbutton=false;
        //     this.showbuttontext="Show"; })
    }

    BankChange(event:any) {
        debugger;
        let values = event;
        this.selectedBankdetails = [];
        for (let i = 0; i < this.BankNamesList.length; i++) {
            if (event.target.value == this.BankNamesList[i].pdepositbankname) {
                this.selectedBankdetails = this.BankNamesList[i];
                break;
            }
        }
        // this.SelectBank = this.selectedBankdetails.paccountid;
        // this.selectedBankname = this.selectedBankdetails.pdepositbankname;
    }

    SelectBank(event:any) {
        debugger;
        this.gridData=[];
        //  this.ShowBankErrorMsg = false;
        //  document.getElementById('bankselection').style.border = "";
        this.selectedtotal=0;
        if (event.target.value == "") {
            this.bankid = 0;
            this.bankname = "";
            this.banknameshowhide = false;
        }
        else {
            this.SelectBankData = event.target.value;
            this.banknameshowhide = true;
            for (let i = 0; i < this.BanksList.length; i++) {
                if (event.target.value == this.BanksList[i].branch_name) {
                    this.bankdetails = this.BanksList[i];
                    break;
                }
            }
            this.bankid = this.bankdetails.branch_code;
            this.bankname = this.bankdetails.branch_name;
            this.caobranchid = this.bankdetails.branch_config_id;
            //   if (this.bankdetails.pbankbalance < 0) {
            //       this.bankbalance = Math.abs(this.bankdetails.pbankbalance)
            //       this.bankbalancetype = "Cr";
            //   }
            //   else if (this.bankdetails.pbankbalance == 0) {
            //       this.bankbalance = 0;
            //       this.bankbalancetype = "";
            //   }
            //   else {
            //       this.bankbalance = (this.bankdetails.pbankbalance)
            //       this.bankbalancetype = "Dr";
            //   }

            this.CashOnHandValidation['bankname'] = '';
        }
        // this.GetChequesOnHand(this.bankid);
        // this.sortGridBasedOnBankSelection(this.bankid);
        // this.GetBankBalance(this.bankid);
        //this.CashOnHandForm.controls.SearchClear.setValue('');
    }

    onSearch(event:any) {
        debugger;

        let searchText = event.toString();
        if (searchText != "") {
            let columnName;
            let lastChar = searchText.substr(searchText.length - 1);
            let asciivalue = lastChar.charCodeAt()
            if (asciivalue > 47 && asciivalue < 58) {
                columnName = "pChequenumber";
            } else {
                columnName = "";
            }

            this.gridData = this._commonService.transform(this.gridDatatemp, searchText, columnName);
        }
        else {
            this.gridData = this.gridDatatemp;
        }
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
    }
    checkedDeposit(event:any, data:any) {
        debugger
        this.selectedtotal=0;
        let gridtemp = this.gridData.filter(a => {
            if (a.preceiptid == data.preceiptid) {
                return a;
            }
        })
        if (event.target.checked == true) {
            debugger;
            // let transdate = this.datepipe.transform(this.CashOnHandForm.controls.ptransactiondate.value, 'dd/MM/yyyy');
            // let chkdate = this.datepipe.transform(gridtemp[0].pchequedate, 'dd/MM/yyyy');
            let chequedate = this._commonService.getDateObjectFromDataBase(gridtemp[0].pchequedate);
            // let rcptdate = this.datepipe.transform(gridtemp[0].preceiptdate, 'dd/MM/yyyy');
            let receiptdate = this._commonService.getDateObjectFromDataBase(gridtemp[0].preceiptdate);
            let transactiondate = this.CashOnHandForm.controls['ptransactiondate'].value;
            // let todaydate = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
            let today = new Date();
            // if (today >= chequedate) {
            if (transactiondate >= receiptdate) {
                data.pdepositstatus = true;
                data.pcancelstatus = false;
                data.pchequestatus = "P";
            }
            else {
                data.pdepositstatus = false;
                data.pcancelstatus = false;
                data.pchequestatus = "N";
                //$('#' + event.target.id + ''). prop("checked", false);
                event.target.checked = false;
                this._commonService.showWarningMessage("Transaction Date Should be Greater than Receipt Date");
            }
            // }
            // else {
            //     data.pdepositstatus = false;
            //     data.pcancelstatus = false;
            //     data.pchequestatus = "N";
            //     //$('#' + event.target.id + '').prop("checked", false);
            //     event.target.checked = false;
            //     this._commonService.showWarningMessage("Post Dated Cheques Are Not Allowed");

            // }
            // this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));

        }
        else {
            data.pdepositstatus = false;
            data.pchequestatus = "N";
            
        }
        for (let i = 0; i < this.gridData.length; i++) {
            if (this.gridData[i].preceiptid == data.preceiptid) {
           //if (this.gridData[i].preceiptid == data.preceiptid && this.gridData[i].preceiptid == data.preceiptno) {
                this.gridData[i] = data;
                //console.log(this.gridData[i])
                break;
            }
        }
        let p = 0
        this.gridData.forEach(element => {
            if (element.pdepositstatus == true) {
                p += element.ptotalreceivedamount
                this.selectedtotal+=1;
                console.log('Total count',this.selectedtotal);
            }
        });
        this.amounttotal = p;

        let bool1=this.gridData.every(res=>res.pdepositstatus == false);
            if(bool1){
                this.allrowsSelected=false;
                this.selectedtotal=0;
            }else{
                this.allrowsSelected=true;
            }
            let bool2 = this.gridData.some(res=>res.pdepositstatus == false);
            if(bool2){
                this.allrowsSelected=false;
            }
    }

    checkedCancel(event:any, data:any) {
        debugger;
        let gridtemp = this.gridData.filter(a => {
            if (a.preceiptid == data.preceiptid) {
                return a;
            }
        })
        this.PopupData = data;
        if (event.target.checked == true) {
            // let transdate = this.datepipe.transform(this.CashOnHandForm.controls.ptransactiondate.value, 'dd/MM/yyyy');
            //  let rcptdate = this._commonService.getFormatDateGlobal(gridtemp[0].preceiptdate);
            let receiptdate = this._commonService.getDateObjectFromDataBase(gridtemp[0].preceiptdate);

            let transactiondate = this.CashOnHandForm.controls['ptransactiondate'].value;
            if (transactiondate >= receiptdate) {
                data.pcancelstatus = true;
                data.pdepositstatus = false;
                data.pchequestatus = "C";
                $("#cancelcharges").val(data.pcancelcharges);
                this.chequenumber = data.pChequenumber;
                $('#add-detail').modal('show');
            }
            else {
                data.pdepositstatus = false;
                data.pcancelstatus = false;
                data.pchequestatus = "N";

                // $('#' + data.preceiptid + ''). prop("checked", false);
                event.target.checked = false;
                this._commonService.showWarningMessage("Transaction Date Should be Greater than Receipt Date");
            }
        }
        else {
            data.pcancelstatus = false;
            data.pchequestatus = "N";
        }
        for (let i = 0; i < this.gridData.length; i++) {
            if (this.gridData[i].preceiptid == data.preceiptid) {
                this.gridData[i] = data;
                break;
            }
        }
    }

    CancelChargesOk(value:any) {

        for (let i = 0; i < this.gridData.length; i++) {
            if (this.gridData[i].preceiptid == this.PopupData.preceiptid) {
                this.gridData[i].pactualcancelcharges = value;
            }
        }
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
        //   this.deposited = 0;
        this.all = this.ChequesOnHandData.length;
        //   for (let j = 0; j < this.ChequesOnHandData.length; j++) {
        //       if (this.ChequesOnHandData[j].ptypeofpayment != "CHEQUE") {
        //           this.onlinereceipts = this.onlinereceipts + 1;
        //       }
        //   }
        //   for (let i = 0; i < this.ChequesOnHandData.length; i++) {
        //       if (this.ChequesOnHandData[i].ptypeofpayment == "CHEQUE") {
        //           this.chequesreceived = this.chequesreceived + 1;
        //       }
        //   }
        //   for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
        //       if (this.ChequesClearReturnData[i].pchequestatus == "C") {
        //           this.cancelled = this.cancelled + 1;
        //       }
        //   }
        //   for (let i = 0; i < this.ChequesClearReturnData.length; i++) {
        //       if (this.ChequesClearReturnData[i].pchequestatus == "P") {
        //           this.deposited = this.deposited + 1;
        //       }
        //   }
    }

    All() {
        $('#search').val("");
        this.gridData = [];
        this.gridDatatemp = [];
        // this.dataTemp = [];
        this.GridColumnsShow();
        this.status = "all";
        this.pdfstatus = "All"
        this.gridData = JSON.parse(JSON.stringify(this.ChequesOnHandData));
        this.gridDatatemp = this.gridData;
        // this.dataTemp = JSON.parse(JSON.stringify(this.ChequesOnHandData))
        this.gridData = this.ChequesOnHandData;

        console.log(this.gridData);
        this.amounttotal = 0;

        //this.amounttotal = parseFloat(this.gridData.reduce((sum, c) => sum + c.ptotalreceivedamount, 0));
        // custom page navigation
        // this.pageCriteria.totalrows = this.gridData.length;
        // this.pageCriteria.TotalPages = 1;
        // if (this.pageCriteria.totalrows > this.pageCriteria.pageSize)
        //     this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / this.pageCriteria.pageSize).toString()) + 1;
        // if (this.gridData.length < this.pageCriteria.pageSize) {
        //     this.pageCriteria.currentPageRows = this.gridData.length;
        // }
        // else {
        //     this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
        // }
    }


    pdfOrprint(printorpdf: any) {
        debugger;
        let rows: any[][] = [];
        let reportname = "Cheques On Hand";
        let gridheaders;
        let colWidthHeight;
        if (this.pdfstatus == "Deposited" || this.pdfstatus == "Cancelled") {
            colWidthHeight = {
                0: { cellWidth: 'auto', halign: 'center' }, 1: { cellWidth: 'auto', halign: 'left' }, 2: { cellWidth: 'auto', halign: 'right' }, 3: { cellWidth: 'auto', halign: 'center' },
                4: { cellWidth: 'auto', halign: 'center' }, 5: { cellWidth: 'auto', halign: 'center' }, 6: { cellWidth: 'auto', halign: 'center' }, 7: { cellWidth: 'auto' },
                8: { cellWidth: 'auto' }
                //,9:{cellWidth:'auto',halign:'center'}
            }
            gridheaders = ["Cheque/Reference No.", "Branch Name", "Amount", "Receipt ID", "Receipt Date", "Cheque Date", this.datetitle, "Transaction Mode", "Cheque Bank Name", "Party"];
        }
        else {
            colWidthHeight = {
                0: { cellWidth: 'auto', halign: 'center' }, 1: { cellWidth: 'auto', }, 2: { cellWidth: 'auto', halign: 'right' },
                3: { cellWidth: 'auto', halign: 'center' },
                4: { cellWidth: 'auto', halign: 'center' }, 5: { cellWidth: 'auto', halign: 'center' }, 6: { cellWidth: 'auto' },
                7: { cellWidth: 'auto' },
                8: { cellWidth: 'auto' }, 9: { cellWidth: 'auto', halign: 'center' }
            }
            gridheaders = ["Cheque/Reference No.", "Branch Name", "Amount", "Receipt ID", "Receipt Date", "Cheque Date", "Transaction Mode", "Cheque Bank Name", "Party", "Self Cheque"];
        }


        // let fromDate = this._commonService.getFormatDateGlobal(this.FromDate);


        // let toDate = this._commonService.getFormatDateGlobal(this.ToDate);


        // let colWidthHeight = {
        //     pChequenumber: { cellWidth: 'auto' },  preceiptid: { cellWidth: 'auto' }, preceiptdate: { cellWidth: 'auto' }, pchequedate: { cellWidth: 'auto' }, pdepositeddate: { cellWidth: 'auto' },ptotalreceivedamount: { cellWidth: 'auto',halign:'right' },ptypeofpayment:{cellWidth:'auto'},cheque_bank:{cellWidth:'auto'},ppartyname:{cellWidth:'auto'}
        // }

        let datereceipt;
        this.gridData.forEach(element => {
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
                totalreceivedamt = this._commonService.currencyformat(element.ptotalreceivedamount);
                totalreceivedamt = this._commonService.convertAmountToPdfFormat(totalreceivedamt);
            }
            else {
                totalreceivedamt = "";
            }
            // totalreceivedamt = this._commonService.convertAmountToPdfFormat(totalreceivedamt);
            let temp;

            if (this.pdfstatus == "Deposited" || this.pdfstatus == "Cancelled") {

                temp = [element.pChequenumber, element.pbranchname, totalreceivedamt, element.preceiptid, datereceipt, chequedate, depositeddate, element.ptypeofpayment, element.cheque_bank, element.ppartyname, element.selfchequestatus];
            }
            else {

                temp = [element.pChequenumber, element.pbranchname, totalreceivedamt, element.preceiptid, datereceipt, chequedate, element.ptypeofpayment, element.cheque_bank, element.ppartyname, element.selfchequestatus];
            }

            rows.push(temp);
        });

        let amounttotal = this._commonService.convertAmountToPdfFormat(this._commonService.currencyformat(this.amounttotal));
        // pass Type of Sheet Ex : a4 or lanscspe  
        this._commonService._downloadchequesReportsPdf(reportname, rows, gridheaders, colWidthHeight, "landscape", "", "", "", printorpdf, amounttotal);

    }

    Save() {
        debugger

        this.count = 0;
        this.DataForSaving = [];
        let isValid = true;
        let deposit = 0;
        let amount = 0;
        this.CashOnHandValidation = {};
        this.gridData.filter(aa => {
            if (aa.pchequestatus == "P") {
                deposit++;
            }
        })
        let validationcount = 0;
        for (let i = 0; i < this.gridData.length; i++) {
            if (this.gridData[i].pchequestatus == "P") {
                validationcount++;
                amount += this.gridData[i].ptotalreceivedamount;
            }
        }
        if (this.buttonname == "Save") {
            const control = <FormGroup>this.CashOnHandForm['controls']['bankname'];
            if (deposit > 0 && validationcount > 0) {
                control.setValidators(Validators.required);
            }
            else {
                control.clearValidators();
            }
            control.updateValueAndValidity();


            if (this.checkValidations(this.CashOnHandForm, isValid)) {

                // if (parseFloat(this.cashbalance) >= amount) {
                //     if (confirm("Do You Want To Save ?")) {
                //         debugger;
                //         this.disablesavebutton = true;
                //         this.buttonname = 'Processing';
                //         for (let i = 0; i < this.gridData.length; i++) {
                //             if (this.gridData[i].pchequestatus == "P") {
                //                 this.count++;
                //                 //  if (this.SelectBankData != "" && this.SelectBankData != undefined) {

                //                 if (this.bankdetails) {
                //                     this.gridData[i].pdepositbankid = this.bankdetails.pdepositbankid;
                //                     this.gridData[i].pdepositbankname = this.bankdetails.pdepositbankname;
                //                 }
                //                 else {
                //                     this.gridData[i].pdepositbankid = '0';
                //                     this.gridData[i].pdepositbankname = '';
                //                 }

                //                 this.gridData[i].pchequestatus = this.gridData[i].pchequestatus;
                //                 this.gridData[i].pactualcancelcharges = this.gridData[i].pactualcancelcharges;
                //                 this.DataForSaving.push(this.gridData[i]);

                //             }

                //         }

                //         if (this.DataForSaving.length != 0) {
                //             for (let i = 0; i < this.DataForSaving.length; i++) {
                //                 //   if (this.DataForSaving[i].pchequedate != null) {
                //                 //       this.DataForSaving[i].pchequedate = this._commonService.getDateObjectFromDataBase(this.DataForSaving[i].pchequedate);
                //                 //       this.DataForSaving[i].pchequedate = this._commonService.getFormatDateNormal(this.DataForSaving[i].pchequedate);
                //                 //   }
                //                 this.DataForSaving[i].pCreatedby = this._commonService.getcreatedby();
                //                 this.DataForSaving[i].preceiptdate = this._commonService.getDateObjectFromDataBase(this.DataForSaving[i].preceiptdate);
                //                 this.DataForSaving[i].preceiptdate = this._commonService.getFormatDateNormal(this.DataForSaving[i].preceiptdate);

                //                 this.DataForSaving[i].pipaddress = this._commonService.getipaddress();
                //             }
                //         }
                //         if (this.DataForSaving.length == this.count && this.DataForSaving.length != 0) {
                //             this.CashOnHandForm.controls.pchequesOnHandlist.setValue(this.DataForSaving);
                //             let chequsonhanddata = this.CashOnHandForm.value;
                //             let transactiondatee = this._commonService.getFormatDateNormal(new Date(chequsonhanddata?.ptransactiondate));
                //             let fromdate;
                //             let todate;
                //             if(this.fromdatevisible){
                //                 fromdate=this._commonService.getFormatDateNormal(this.CashOnHandForm.controls.fromdate.value);
                //                 todate = this._commonService.getFormatDateNormal(this.CashOnHandForm.controls.todate.value);
                //             }else{
                //                 todate = this._commonService.getFormatDateNormal(this.CashOnHandForm.controls.todate.value);
                //                 fromdate = todate
                //             }
                //             chequsonhanddata.ptransactiondate = this._commonService.getFormatDateNormal(chequsonhanddata.ptransactiondate);
                //             chequsonhanddata.fromdate = this._commonService.getFormatDateNormal(chequsonhanddata.fromdate);
                //             chequsonhanddata.todate = this._commonService.getFormatDateNormal(chequsonhanddata.todate);
                //             chequsonhanddata.pcaobranchcode = this.bankdetails.branch_code;
                //             chequsonhanddata.pcaobranchname = this.bankdetails.branch_name;
                //             chequsonhanddata.pcaobranchid = this.bankdetails.branch_config_id;
                //             chequsonhanddata.pCreatedby = this._commonService.getcreatedby();
                //             chequsonhanddata.banknameForLegal = this.selectedBankid;
                //             let form = JSON.stringify(chequsonhanddata);
                //             // let form = JSON.stringify(this.CashOnHandForm.value);
                //             //console.log(this.CashOnHandForm.value)
                //             this._accountingtransaction.SaveCashOnHand(form).subscribe(data => {
                //                 if (data[0] == 'TRUE') {
                //                     let rcpt = data[1].split(',');
                //                     // let receipt = btoa(data[1] + ',' + 'Payment Voucher');
                //                     let receipt = btoa(rcpt[0] + ',' + 'Payment Voucher');
                //                     //  this.router.navigate(['/Reports/PaymentVoucherReport', receipt]);
                //                     //window.open('/#/PaymentVoucherReport?id=' + receipt + '', "_blank");//commented on 03-09-2024
                //                     // let transactiondate = this._commonService.getFormatDateNormal(chequsonhanddata.ptransactiondate);
                //                     this.DownloadJVListDetails(fromdate,todate,rcpt[0],'PAYMENT VOUCHER');

                //                     this._commonService.showSuccessMessage();
                //                     this.Clear();
                //                 } else {
                //                     let rcpt = data[1].split(',')[1];
                //                     this._commonService.showWarningMessage('common receipt no.' + rcpt + ' already posted to cao office');
                //                 }
                //                 this.disablesavebutton = false;
                //                 this.buttonname = "Save";
                //             }, error => {
                //                 this._commonService.showErrorMessage(error);
                //                 this.disablesavebutton = false;
                //                 this.buttonname = "Save";
                //                 this.Clear()
                //             });
                //         }
                //         else {
                //             this.disablesavebutton = false;
                //             this.buttonname = "Save";
                //             this._commonService.showWarningMessage("Select atleast one record");
                //         }
                //         // }
                //     }
                //     else {
                //         this.disablesavebutton = false;
                //         this.buttonname = "Save";
                //     }
                // }
                // else {
                //     this._commonService.showWarningMessage("Insufficient cash on hand balance !!");
                // }

            }
        } else {
            if (amount != parseFloat(this.pcashonhandbalance)) {
                this._commonService.showWarningMessage("Please Select Cash on band balance equilent receipts!");
            } else {
                if (confirm("Do You Want To Update ?")) {
                    debugger;

                    for (let i = 0; i < this.gridData.length; i++) {
                        if (this.gridData[i].pchequestatus == "P") {
                            this.count++;
                            //this.DataForSaving.push(this.gridData[i]);
                        }
                    }
                    if (this.DataForSaving.length == this.count && this.DataForSaving.length != 0) {
                        this.CashOnHandForm.controls['pchequesOnHandlist'].setValue(this.DataForSaving);
                        let chequsonhanddata = this.CashOnHandForm.value;
                        chequsonhanddata.ptransactiondate = this._commonService.getFormatDateNormal(chequsonhanddata.ptransactiondate);
                        // chequsonhanddata.pcaobranchcode = this.bankdetails.branch_code;
                        // chequsonhanddata.pcaobranchname = this.bankdetails.branch_name;
                        let form = JSON.stringify(chequsonhanddata);

                        // this._accountingtransaction.UpdateCashOnHand(form).subscribe(data => {
                        //     if (data) {

                        //         this._commonService.showSuccessMessage();
                        //         this.Clear();
                        //         this.GetCashonhandBalance();
                        //     }
                        //     this.disablesavebutton = false;
                        //     this.buttonname = "Save";
                        // }, error => {
                        //     this._commonService.showErrorMessage(error);
                        //     this.disablesavebutton = false;
                        //     this.buttonname = "Save";
                        //     this.Clear()
                        // });
                    }
                    else {
                        this.disablesavebutton = false;
                        this.buttonname = "Save";
                        this._commonService.showWarningMessage("Select atleast one record");
                    }
                }
            }
        }
    }
  cashbalance(cashbalance: any) {
    throw new Error('Method not implemented.');
  }
    change_date(event:any) {
        debugger;
        for (let i = 0; i < this.gridData.length; i++) {
            this.gridData[i].pdepositstatus = false;
            this.gridData[i].pcancelstatus = false;
            this.gridData[i].pchequestatus = "N";
        }
    }

    Clear() {
        $('#search').val("");
        this.CashOnHandValidation = {};
        this.CashOnHandForm.reset();
        this.ngOnInit();
        this.count = 0;
        this.DataForSaving = [];
        this.gridData = [];
        //  $("#bankselection").val("");
        //   this.ShowBankErrorMsg = false;
        this.SelectBankData = "";
        this.jvlistDatanew=[];
        this.allrowsSelected=false;
        this.selectedtotal=0;
        //    document.getElementById('bankselection').style.border = "";

    }

    ShowBrsDeposit() {
        debugger;
        this.gridData = [];
        //  this.deposited = 0;

        // let fromdate = this.CashOnHandForm.controls['pfrombrsdate'].value;
        let fromdate = this.CashOnHandForm.controls['pfrombrsdate'].value;
        let todate = this.CashOnHandForm.controls['ptobrsdate'].value;
        debugger;
        if (fromdate != null && todate != null) {
            this.OnBrsDateChanges(fromdate, todate);
            if (this.validate == false) {
                // fromdate = this.datepipe.transform(fromdate, 'dd-MMM-yyyy')
                // todate = this.datepipe.transform(todate, 'dd-MMM-yyyy')
                fromdate = this._commonService.getFormatDateNormal(fromdate);
                todate = this._commonService.getFormatDateNormal(todate);

                this.validatebrsdatedeposit = false;
               
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
        this.gridData = [];
        this.cancelled = 0;
        let fromdate = this.BrsDateForm.controls['frombrsdate'].value;
        let todate = this.BrsDateForm.controls['tobrsdate'].value;
        if (fromdate != null && todate != null) {
            this.OnBrsDateChanges(fromdate, todate);
            if (this.validate == false) {
              
                fromdate = this._commonService.getFormatDateNormal(fromdate);
                todate = this._commonService.getFormatDateNormal(todate);
                this.validatebrsdatecancel = false;
               

            }
            else {
                this.validatebrsdatecancel = true;
            }
        }
        else {
            this._commonService.showWarningMessage("select fromdate and todate");
        }
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
            this.showErrorMessage('');
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
                    this.CashOnHandValidation[key] = '';
                    if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
                        let lablename;
                        if(key != "fromdate"){
                            lablename = (document.getElementById(key) as HTMLInputElement).title;
                        }
                        let errormessage;
                        for (const errorkey in formcontrol.errors) {
                            if (errorkey) {
                                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                                this.CashOnHandValidation[key] += errormessage + ' ';
                                isValid = false;
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
            this.showErrorMessage('e');
            return false;
        }
        return isValid;
    }
    showErrorMessage(errormsg: string) {
        this._commonService.showErrorMessage(errormsg);
    }
    BlurEventAllControll(fromgroup: FormGroup):void {
        try {
            Object.keys(fromgroup.controls).forEach((key: string) => {
                this.setBlurEvent(fromgroup, key);
            })
        }
        catch (e) {
            this.showErrorMessage('');
           // return false;
        }
    }
    setBlurEvent(fromgroup: FormGroup, key: string):void {
        try {
            let formcontrol;
            formcontrol = fromgroup.get(key);
            if (formcontrol) {
                if (formcontrol instanceof FormGroup) {
                    this.BlurEventAllControll(formcontrol)
                }
                else {
          const control = fromgroup.get(key);
if (control && control.validator) {
  control.valueChanges.subscribe(() => {
    this.GetValidationByControl(fromgroup, key, true);
  });
}
          }
            }
        }
        catch (e) {
            this.showErrorMessage('');
           // return false;
        }
    }
    public group: any[] = [{
        field: 'preceiptdate'
    }, {
        field: 'pChequenumber', dir: 'desc'
    }
    ];
   

    export(): void {
        let rows: ({ "Cheque/ Reference No.": any; "Branch Name": any; Amount: any; "Receipt Id": any; "Receipt Date": any; "Cheque Date": any; "Cancelled Date": any; "Transaction Mode": any; "Cheque Bank Name": any; Party: any; "Deposited Date"?: undefined; "Self Cheque"?: undefined; } | { "Cheque/ Reference No.": any; "Branch Name": any; Amount: any; "Receipt Id": any; "Receipt Date": any; "Cheque Date": any; "Deposited Date": any; "Transaction Mode": any; "Cheque Bank Name": any; Party: any; "Cancelled Date"?: undefined; "Self Cheque"?: undefined; } | { "Cheque/ Reference No.": any; "Branch Name": any; Amount: any; "Receipt Id": any; "Receipt Date": any; "Cheque Date": any; "Transaction Mode": any; "Cheque Bank Name": any; Party: any; "Self Cheque": any; "Cancelled Date"?: undefined; "Deposited Date"?: undefined; } | undefined)[] = [];
        this.gridData.forEach(element => {
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
                totalreceivedamt = this._commonService.currencyformat(element.ptotalreceivedamount);
                totalreceivedamt = this._commonService.convertAmountToPdfFormat(totalreceivedamt);
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

    }
    DownloadJVListDetails(fromdate: any,todate: any,mvnumber: any,formname: any) {
        debugger;
        this.jvlistDatanew=[];
        this.AccountingReportsService.GetSubscriberJvListReport(fromdate, todate, mvnumber, formname).subscribe((res: never[]) => {
          if (res) {
            this.jvlistDatanew = res;
            console.log(res);
            if (this.jvlistDatanew.length>0){
                let fromdatee;
                let todatee
                if(this.fromdatevisible){
                    fromdatee=this._commonService.getFormatDateGlobal(this.CashOnHandForm.controls['fromdate'].value);
                    todatee = this._commonService.getFormatDateGlobal(this.CashOnHandForm.controls['todate'].value);
                }else{
                    todatee = this._commonService.getFormatDateGlobal(this.CashOnHandForm.controls['fromdate'].value);
                    fromdatee = todatee;
                }
              this.pdfOrprintnewJvst('Pdf',formname,"","");//fromdate,todate
            }else{
              this._commonService.showWarningMessage('No Data !');
            }
          }
        });
      }
      pdfOrprintnewJvst(printorpdf: string,formname: any,fromdate: string,todate: string) {
        debugger
            let rows: any[][] = [];
            let reportname = formname;
            let gridheaders = ["Particulars", "Debit Amount", "Credit Amount"];
            // let fromDate = this._commonService.getFormatDateGlobal(fromdate);
            // let toDate = this._commonService.getFormatDateGlobal(todate);
            let colWidthHeight = {
              0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto', halign: 'right' }, 2: { cellWidth: 'auto', halign: 'right' }
            }
            console.log(this.jvlistDatanew);
            let retungridData = this._commonService._MultipleGroupingGridExportData(this.jvlistDatanew, "ptransactiondate", true)
        
            retungridData.forEach((element: { ptransactiondate: any; ptransactionno: undefined; pdebitamount: any; pcreditamount: string; group: undefined; pparticulars: any; }) => {
        
              let temp;
              let transdate = element.ptransactiondate;
              // let  DateFormat3= this._CommonService.getDateObjectFromDataBase(transdate);
              if (element.ptransactionno !== undefined) {
                let tansactiondate = this._commonService.getFormatDateGlobal(transdate);
                let debitamt = this._commonService.currencyformat(element.pdebitamount);
                debitamt = this._commonService.convertAmountToPdfFormat(debitamt);
                let creditamt = this._commonService.currencyformat(parseFloat(element.pcreditamount).toFixed(2));
                creditamt = this._commonService.convertAmountToPdfFormat(creditamt);
                if (element.group != undefined) {
                  temp = [element.group, element.pparticulars, debitamt, creditamt];
                }
                else {
        
                  temp = [element.pparticulars, debitamt, creditamt];
                }
              } else {
        
                temp = [element.group];
              }
        
              rows.push(temp);
            });
            // pass Type of Sheet Ex : a4 or lanscspe  
            // this._commonService._JvListdownloadReportsPdf(reportname, rows, gridheaders, colWidthHeight, "a4", "Between", fromDate, toDate, printorpdf);
            this._commonService._JvListdownloadReportsPdf(reportname, rows, gridheaders, colWidthHeight, "a4", "", "", "", printorpdf);
        
          }
    
    selectedAll($event: { target: { checked: any; }; } | undefined){
        debugger
        if($event != undefined){
            if($event.target.checked){
                this.allrowsSelected = true;
                this.amounttotal=0;
                this.selectedtotal=0;
                this.gridData.forEach(data=>{
                    data.pdepositstatus = true;
                    data.pcancelstatus = false;
                    data.pchequestatus = "P";
                    this.amounttotal+=data.ptotalreceivedamount;
                    this.selectedtotal+=1;
                });
            }else{
                this.selectedtotal=0;
                this.allrowsSelected = false;
                this.amounttotal=0;
                this.gridData.forEach(data=>{
                    data.pdepositstatus = false;
                    data.pcancelstatus = false;
                    data.pchequestatus = "N";
                });
            }
        }
    }
    asOnChange($event: { target: { checked: any; }; }){
    debugger
    console.log($event);
    this.fromdate.maxDate = new Date();
    this.todate.maxDate = new Date();
    this.CashOnHandForm.controls['fromdate'].setValue(new Date());
    this.CashOnHandForm.controls['todate'].setValue(new Date());
    if($event.target.checked){
        this.fromdatevisible=false;
        this.CashOnHandForm.controls['fromdate'].setValue(this.CashOnHandForm.controls['todate'].value);
        this.datelable="Date";
        this.AsOnDate="T";
        $("#todate").prop("disabled",false);
    }else{
        this.fromdatevisible=true;
        this.datelable="To Date";
        this.AsOnDate="F";
        $("#todate").prop("disabled",true);
    }
    }
    getCashOnHandData(){
        debugger
        // if(this.checkValidations(this.CashOnHandForm,true)){
        if(!this._commonService.isNullOrEmptyString(this.CashOnHandForm.controls['bankname'].value)){
            this.CashOnHandValidation={};
            // this.GetChequesOnHand(this.bankid);
            this.GetChequesOnHand(2);
        }else{
            this.CashOnHandValidation['bankname']="Bank Name Required";
        }
    }
    fromdateChange($event: string | number | Date | undefined){
        if($event != undefined){
            this.todate.minDate=new Date($event);
            $("#todate").prop("disabled",false);
        }
    }

    pageCriteria = {
  page: 0,
  size: 10,
  sort: 'name,asc'
};
}
