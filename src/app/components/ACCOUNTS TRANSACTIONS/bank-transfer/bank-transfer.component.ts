import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { PageCriteria } from 'src/app/Models/pageCriteria';
import { AccountingTransactionsService } from 'src/app/services/Transactions/AccountingTransaction/accounting-transaction.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-bank-transfer',
  templateUrl: './bank-transfer.component.html',
  styleUrls: ['./bank-transfer.component.css'],
  imports: [CommonModule, FormsModule, DatePipe, ReactiveFormsModule, TableModule, InputTextModule, NgSelectModule,
    BsDatepickerModule]
})
export class BankTransferComponent implements OnInit {

  branchschema: any;
  branch_id: any;

  BankTransferForm!: FormGroup;
  BankDetailsForm!: FormGroup;

  savebutton: string = "Show";
  saveBankTransferDetailsbutton: string = "Save";

  selected: any[] = [];
  pageCriteria: PageCriteria;

  showhidetable: boolean = false;
  dataisempty: boolean = false;

  BankTransferDetails: any[] = [];
  transferTypeList: any[] = [];
  list: any[] = [];

  chequenumberslist: any[] = [];

  disablesavebutton: boolean = false;
  disablesavebutton1: boolean = false;

  BankTransfervalidation: any = {};

  dpConfig: Partial<BsDatepickerConfig>;

  frombankaccountid: any;
  tobankaccountid: any;
  bankid: any;
  bankname: any;
  chequenumber: any;
  currencyCode!: 'INR';
  totalamount: number = 0;
  bidpaybleamt: boolean = false;
  fromdate: any = '';
  todate: any = '';
  endDate: any = '';
  currencysymbol: string = '₹';

  constructor(
    private _accountingtransaction: AccountingTransactionsService,
    private _commonService: CommonService,
    private formbuilder: FormBuilder
  ) {

    this.pageCriteria = new PageCriteria();

    this.dpConfig = {
      maxDate: new Date(),
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD-MMM-YYYY',
      showWeekNumbers: false
    };
  }

  ngOnInit(): void {

    this.setPageModel();

    this.branchschema = this._commonService.getschemaname();
    this.branch_id = this._commonService.getbrachid();

    this.createForms();
    this.GetBankTransferTypes();
  }

  createForms() {

    this.BankTransferForm = this.formbuilder.group({
      todate: [new Date(), Validators.required],
      transferType: ['', Validators.required],
      transferTypeid: ['']
    });

    this.BankDetailsForm = this.formbuilder.group({
      chequeNo: ['', Validators.required],
      narration: ['', Validators.required],
    });
  }

  setPageModel() {
    this.pageCriteria.pageSize = 10;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.TotalPages = 1;
  }

  
  GetBankTransferTypes() {
    this._accountingtransaction
      .GetBankTransferTypes('accounts','KAPILCHITS','KLC01')
      .subscribe(res => this.transferTypeList = res || []);
  }

  transferType_change(event: any) {

    this.BankTransferDetails = [];
    this.totalamount = 0;

    if (!event) return;

    this.bidpaybleamt =
      event.banktransfername === 'Subscriber Bank A/C No.1-Subscriber Bank A/C No.2';

    this.BankTransferForm.patchValue({
      transferTypeid: event.bankttransferid
    });

    this.frombankaccountid = event.frombankaccountid;
    this.tobankaccountid = event.tobankaccountid;
    this.bankid = event.bankconfigurationid;
    this.bankname = event.accountname;

    this.SelectBank();
  }

  SelectBank() {

    this._accountingtransaction
      .GetBankDetailsbyId(this.bankid)
      .subscribe({
        next: (res) => {
          this.chequenumberslist = res?.chequeslist || [];
        },
        error: (err) => this._commonService.showErrorMessage(err)
      });
  }

  SelectCheque(value: any) {
    this.chequenumber = value || '';
  }

  fromDateChange() {
    this.BankTransferDetails = [];
  }

  /* ================= GRID ================= */

  onSelect(event: any) {
    this.selected = event.value || [];

    this.totalamount = this.selected
      .reduce((sum: number, c: any) =>
        sum + Number(c.transactionamount || 0), 0);
  }

  PSBankTransferDetailsFilter(value: string) {

    if (!value) {
      this.BankTransferDetails = [...this.list];
      return;
    }

    const search = value.toLowerCase();

    this.BankTransferDetails = this.list.filter(a =>
      a.chitreceiptnumber?.toString().toLowerCase().includes(search) ||
      a.transactionamount?.toString().toLowerCase().includes(search)
    );
  }

  /* ================= SHOW ================= */

  onCLick() {

    if (!this.checkValidations(this.BankTransferForm, true)) return;

    this.disablesavebutton = true;
    this.savebutton = "Processing";

    const todate = this._commonService.getFormatDateNormal(
      this.BankTransferForm.value.todate
    );

    this._accountingtransaction
      .getBankTransferDetails(
        this.branchschema,
        todate,
        this.BankTransferForm.value.transferType
      )
      .subscribe(res => {

        this.BankTransferDetails = res || [];
        this.list = [...this.BankTransferDetails];

        this.showhidetable = this.BankTransferDetails.length > 0;
        this.dataisempty = this.BankTransferDetails.length === 0;

        this.disablesavebutton = false;
        this.savebutton = "Show";
      });
  }

  /* ================= SAVE ================= */

  saveBankTransferDetails() {

    if (this.selected.length === 0) {
      this._commonService.showWarningMessage("Select Atleast 1 Record");
      return;
    }

    if (!this.checkValidations(this.BankDetailsForm, true)) return;

    if (this.totalamount <= 0) {
      this._commonService.showWarningMessage("Total Amount should not be Zero");
      return;
    }

    this.disablesavebutton1 = true;
    this.saveBankTransferDetailsbutton = "Processing";

    const createdby = this._commonService.getCreatedBy();
    const IPAddress = this._commonService.getIpAddress();

    this.selected.forEach(element => {
      element.frombankaccountid = this.frombankaccountid;
      element.tobankaccountid = this.tobankaccountid;
      element.pCreatedby = createdby;
      element.pipaddress = IPAddress;
      element.totalamount = this.totalamount;
      element.chequenumber = this.chequenumber;
      element.bankname = this.bankname;
      element.transactiondate = this._commonService.getFormatDateNormal(new Date());
      element.branchschema = this.branchschema;
      element.narration = this.BankDetailsForm.value.narration;
    });

    const data = JSON.stringify(this.selected);

    if (confirm("Do you want to Save")) {

      this._accountingtransaction
        .SaveBankTransferDetails(data)
        .subscribe(res => {

          if (res) {
            this._commonService.showSuccessMessage();
            this.clearBankTransferDetails();
          }

          this.disablesavebutton1 = false;
          this.saveBankTransferDetailsbutton = "Save";
        });
    }
  }

  clearBankTransferDetails() {

    this.BankDetailsForm.reset();
    this.BankTransferForm.patchValue({
      transferType: '',
      transferTypeid: '',
      todate: new Date()
    });

    this.BankTransferDetails = [];
    this.selected = [];
    this.totalamount = 0;
    this.bankname = '';
    this.bidpaybleamt = false;
  }

  pdfOrprint(printorpdf: string): void {

    let rows: any[] = [];
    let gridheaders: string[] = [];

    const reportname =
      "Bank Transfer (" + this.BankTransferForm.controls['transferType'].value + ")";

    const toDate =
      this._commonService.getFormatDateGlobal(
        this.BankTransferForm.controls['todate'].value
      );

    this.endDate = toDate;

    if (this.bidpaybleamt) {
      gridheaders = [
        "Transaction Date",
        "Transaction Number",
        "Transaction Amount",
        "Bid Payable Amount",
        "Particular"
      ];
    } else {
      gridheaders = [
        "Transaction Date",
        "Transaction Number",
        "Transaction Amount",
        "Particular"
      ];
    }

    this.todate = toDate;

    let FirstcolWidthHeight: any;

    if (this.bidpaybleamt) {
      FirstcolWidthHeight = {
        0: { cellWidth: 'auto', halign: 'left' },
        1: { cellWidth: 'auto', halign: 'left' },
        2: { cellWidth: 'auto', halign: 'right' },
        3: { cellWidth: 'auto', halign: 'right' },
        4: { cellWidth: 'auto', halign: 'center' }
      };
    } else {
      FirstcolWidthHeight = {
        0: { cellWidth: 'auto', halign: 'left' },
        1: { cellWidth: 'auto', halign: 'left' },
        2: { cellWidth: 'auto', halign: 'right' },
        3: { cellWidth: 'auto', halign: 'center' }
      };
    }

    const totalamount = this.BankTransferDetails.reduce(
      (sum: number, c: any) => sum + Number(c.transactionamount || 0),
      0
    );

    const totalamount1 =
      this._commonService.convertAmountToPdfFormat(
        this._commonService.currencyformat(totalamount)
      );

 this.BankTransferDetails.forEach((element: any) => {

  const transactionamount =
    this._commonService.convertAmountToPdfFormat(
      Number(element?.transactionamount || 0)
    );

  let temp: any[];

  if (this.bidpaybleamt) {

    const bidpaybleamt =
      this._commonService.convertAmountToPdfFormat(
        Number(element?.pbidpayableamount || 0)
      );

    temp = [
      this._commonService.getFormatDateGlobal(element?.transactiondate),
      element?.chitreceiptnumber || '',
      transactionamount,
      bidpaybleamt,
      element?.pparticulars ? element.pparticulars : "--NA--"
    ];

  } else {

    temp = [
      this._commonService.getFormatDateGlobal(element?.transactiondate),
      element?.chitreceiptnumber || '',
      transactionamount,
      element?.pparticulars ? element.pparticulars : "--NA--"
    ];
  }

  rows.push(temp);
});

    const rowStyle = {
      halign: 'right',
      fontSize: "9",
      fontStyle: 'bold',
      textColor: "#663300"
    };

    rows.push([
      { content: "Total", colSpan: 2, styles: rowStyle },
      { content: totalamount1, styles: rowStyle },
      { content: "", styles: rowStyle }
    ]);

    this._commonService.NPSPledgeDetails1(reportname,rows,gridheaders,
      FirstcolWidthHeight,"a4","between",this.fromdate,toDate,printorpdf);
  }

  checkValidations(group: FormGroup, isValid: boolean): boolean {

    Object.keys(group.controls).forEach(key => {

      const control = group.get(key);

      if (control && control.invalid) {
        control.markAsTouched();
        isValid = false;
      }
    });

    return isValid;
  }
  export(): void {
  if (!this.BankTransferDetails?.length) {
    return;
  }

  const rows = this.BankTransferDetails.map((element: any) => {
    const transactiondate = this._commonService.getFormatDateGlobal(
      element?.transactiondate
    );

    const baseObject: any = {
      "Transaction Date": transactiondate ?? '--NA--',
      "Transaction Number": element?.chitreceiptnumber ?? '--NA--',
      "Transaction Amount": element?.transactionamount ?? 0,
      "Particular": element?.pparticulars || '--NA--'
    };

    // Add Bid Payable Amount only if condition is true
    if (this.bidpaybleamt) {
      baseObject["Bid Payable Amount"] =
        element?.pbidpayableamount ?? 0;
    }

    return baseObject;
  });

  this._commonService.exportAsExcelFile(rows, 'BankTransferForm');
}
}