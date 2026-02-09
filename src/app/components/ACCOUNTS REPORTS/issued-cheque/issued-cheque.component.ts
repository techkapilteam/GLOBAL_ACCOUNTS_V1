import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import { CommonService } from '../../../services/common.service';
import { BankBookService } from '../../../services/Transactions/AccountingReports/bank-book.service';
import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';
import { PageCriteria } from '../../../Models/pageCriteria';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableModule } from 'primeng/table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-issued-cheque',
  imports: [TableModule, FormsModule, CommonModule, ReactiveFormsModule, NgSelectModule,NgxDatatableModule],
  templateUrl: './issued-cheque.component.html',
  styleUrl: './issued-cheque.component.css',
})
export class IssuedChequeComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private datePipe = inject(DatePipe);
  private reportService = inject(AccountingReportsService);
  private commonService = inject(CommonService);
  private bankBookService = inject(BankBookService);
  private accountingTransaction = inject(AccountingTransactionsService);

  @ViewChild('myTable') table: any;


  FrmIssuedCheque!: FormGroup;

  BankData: any[] = [];
  lstBankChequeDetails: any[] = [];
  gridData: any[] = [];
  datagrid: any[] = [];
  gridDataDetails: any[] = [];
  DataForCancel: any[] = [];

  savebutton = 'Submit';
  isSubmited = false;
  disablesavebutton = false;

  _BankId: any;
  _ChqBookId: any;
  _ChqFromNo: any;
  _ChqToNo: any;
  BankName: any;
  chequefrom: any;
  strChqNo: any;

  currencysymbol = this.commonService.datePickerPropertiesSetup('currencysymbol');

  pageCriteria = new PageCriteria();
  // commencementgridPage: Page = {
  //   size: 10,
  //   totalElements: 0,
  //   pageNumber: 0,
  //   CurrentPage: 0,
  //   PageSize: 0,
  //   TotalRows: 0,
  //   TotalPages: 0,
  //   StartRow: 0,
  //   EndRow: 0,
  //   currentPageRows: 0
  // };

  Showhide = true;
  ShowReport = true;
  // commencementgridPage: any;
  commencementgridPage = {
    size: 10,
    totalElements: 0,
    pageNumber: 0
  };

  ngOnInit() {
    this.initForm();
    this.setPageModel();
    this.loadDummyBanks();
  }

  private initForm() {
    this.FrmIssuedCheque = this.fb.group({
      pbankname: [null, Validators.required],
      pchqfromto: [null, Validators.required],
      branchSchema: [''],
      lstIssuedCheque: [[]]
    });
  }

  get f() {
    return this.FrmIssuedCheque.controls;
  }

  setPageModel() {
    this.pageCriteria.pageSize = this.commonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }

  // bankBookDetails() {
  //   this.bankBookService.GetBankNames().subscribe({
  //     next: (res: any) => (this.BankData = res),
  //     error: (err: any) => this.commonService.showErrorMessage(err)
  //   });
  // }
  loadDummyBanks() {
    this.BankData = [
      { pbankaccountid: 1, pbankname: 'HDFC Bank' },
      { pbankaccountid: 2, pbankname: 'ICICI Bank' }
    ];
  }
  BankName_Cahange(event: any) {
    this.gridData = [];
    this.gridDataDetails = [];
    this.lstBankChequeDetails = [];
    this.FrmIssuedCheque.get('pchqfromto')?.reset();

    if (!event) return;

    const bankId = event.pbankaccountid;
    this.BankName = event.pbankname;

    // this.reportService.GetBankChequeDetails(bankId).subscribe({
    //   next: res => (this.lstBankChequeDetails = res ?? []),
    //   error: err => this.commonService.showErrorMessage(err)
    // });
    this.lstBankChequeDetails = [
      { pchkBookId: 101, pchqfromto: '1001-1010' },
      { pchkBookId: 102, pchqfromto: '2001-2010' }
    ];
  }

  GetIssuedBankDetails(event: any) {
    this.isSubmited = true;

    if (this.FrmIssuedCheque.invalid) {
      Object.values(this.f).forEach(control => control.markAsTouched());
      return;
    }

    this._BankId = this.f['pbankname'].value;
    this._ChqBookId = this.f['pchqfromto'].value;
    this.strChqNo = event.pchqfromto;
    this.chequefrom = event.pchqfromto;

    this.GetData();
  }

  GetData() {
    this.Showhide = false;
    const [from, to] = this.strChqNo.split('-');
    this._ChqFromNo = from;
    this._ChqToNo = to;
    this.ShowReport = false;

    // this.reportService.GetUnusedChequeDetails(this._BankId, this._ChqBookId, from, to)
    //   .subscribe((res: any) => {
    //     this.gridData = res ?? [];
    //     this.pageCriteria.totalrows = this.gridData.length;
    //   });

    // this.reportService.GetIssuedBankDetails(this._BankId, this._ChqBookId, from, to)
    //   .subscribe((res: any) => {
    //     this.datagrid = res ?? [];
    //     this.gridDataDetails = [...this.datagrid];
    //     this.commencementgridPage.totalElements = this.gridDataDetails.length;
    //   });
    this.gridData = [
      { pchequenumber: from, pbankname: this.BankName, pchkBookId: this._ChqBookId, pchequestatus: false },
      { pchequenumber: +from + 1, pbankname: this.BankName, pchkBookId: this._ChqBookId, pchequestatus: false }
    ];

    this.pageCriteria.totalrows = this.gridData.length;

    this.datagrid = [
      {
        pchequestatus: 'Issued',
        pchequenumber: from,
        ppaymentid: 'PAY001',
        pparticulars: 'Vendor Payment',
        ppaymentdate: new Date(),
        pcleardate: new Date(),
        ppaidamount: 15000,
        pbankname: this.BankName,
        pchkBookId: this._ChqBookId,
        pstatus: 'Cleared'
      }
    ];

    this.gridDataDetails = [...this.datagrid];
    this.commencementgridPage.totalElements = this.gridDataDetails.length;
  }

  export() {
    const rows = this.gridDataDetails.map(element => ({
      'Cheque Status': element.pchequestatus,
      'Cheque No.': element.pchequenumber,
      'Payment ID': element.ppaymentid,
      'Particulars': element.pparticulars,
      'Payment Date': this.commonService.getFormatDateGlobal(element.ppaymentdate),
      'Cleared Date': this.commonService.getFormatDateGlobal(element.pcleardate),
      'Paid Amt.': element.ppaidamount
        ? this.commonService.convertAmountToPdfFormat(
          this.commonService.currencyformat(element.ppaidamount)
        )
        : '',
      'Bank Name': element.pbankname,
      'Cheque Book ID': element.pchkBookId,
      'Cheque Status ': element.pstatus
    }));

    this.commonService.exportAsExcelFile(rows, 'Issued_Cheque');
  }

  UnusedChequeCancel() {
    if (!this.DataForCancel.length) {
      this.commonService.showWarningMessage('Select Atleast One Un Used Cheque No.');
      return;
    }

    this.savebutton = 'Processing';

    this.FrmIssuedCheque.patchValue({
      branchSchema: this.commonService.getschemaname(),
      lstIssuedCheque: this.DataForCancel
    });

    const payload = {
      ...this.FrmIssuedCheque.value,
      pbankname: this.BankName,
      pchqfromto: this.chequefrom
    };

    this.accountingTransaction.UnusedhequeCancel(JSON.stringify(payload)).subscribe({
      next: () => {
        this.commonService.showSuccessMsg('Cancelled Successfully');
        this.savebutton = 'Submit';
        this.DataForCancel = [];
        this.GetData();
      },
      error: (err: any) => this.commonService.showErrorMessage(err)
    });
  }

  toggleExpandGroup(group: any) {
    this.table?.groupHeader?.toggleExpandGroup(group);
  }

  pdfOrprint(type: 'Pdf' | 'Print') {
    const content = document.getElementById('print-section');
    if (!content) return;

    if (type === 'Print') {
      window.print();
      return;
    }

    const win = window.open('', '', 'width=900,height=700');
    win?.document.write(`
      <html>
        <head><title>Issued Cheques</title></head>
        <body>${content.innerHTML}</body>
      </html>
    `);
    win?.document.close();
    win?.print();
  }
  TotalPages: number = 0;

  checkedCancel(event: any, row: any) {
    const isChecked = event.target.checked;
    row.pchequestatus = isChecked;
  }
}
