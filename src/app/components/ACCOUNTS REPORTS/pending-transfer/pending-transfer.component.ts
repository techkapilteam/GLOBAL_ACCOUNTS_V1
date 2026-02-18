import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonService } from '../../../services/common.service';
import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';
import { PageCriteria } from '../../../Models/pageCriteria';
import { ChitTransactionsService } from '../../../services/chit-transactions.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableModule } from 'primeng/table';
import { SubscriberBalanceService } from '../../../services/subscriber-balance.service';

@Component({
  selector: 'app-pending-transfer',
  imports: [NgxDatatableModule,ReactiveFormsModule,CommonModule,FormsModule,NgSelectModule,TableModule],
  templateUrl: './pending-transfer.component.html',
  styleUrl: './pending-transfer.component.css',
})
export class PendingTransferComponent implements OnInit {
  private _commonservice = inject(CommonService);
  private _ChitTransactionsService = inject(ChitTransactionsService);
  private _subscriberBalanceService = inject(SubscriberBalanceService);
  private _AccountingTransactionsService = inject(AccountingTransactionsService);
  private _fb = inject(FormBuilder);

  @ViewChild('myTable') table: any;

  ColumnMode = ColumnMode;
  loading = false;
  gridData: any[] = [];
  list: any[] = [];
  totalamount = 0;
  showicons = false;
  showhidetable = false;
  dataisempty = false;
  pendingtransferform!: FormGroup;
  pendingtransfervalidation: Record<string, string> = {};

  CAOBranchList: any[] = [];
  kgmsBranchList: any[] = [];
  modeoftransactionslist = [
    { ptypeofpayment: 'ALL', ptranstype: 'ALL' },
    { ptypeofpayment: 'CASH', ptranstype: 'C' },
    { ptypeofpayment: 'CHEQUE', ptranstype: 'CH' },
    { ptypeofpayment: 'ONLINE', ptranstype: 'ONLINE' }
  ];

  userBranchType = sessionStorage.getItem('userBranchType')??'';
  loginBranchschema = sessionStorage.getItem('loginBranchSchemaname')??'';
  loginBranchname = sessionStorage.getItem('loginBranchName')??'';

  branchname: any;
  caoschema: any;
  formname = '';
  branchkgms = false;
  branchcao = true;

  typeofpayment = '';
  typeofpaymentforreport = '';

  savebutton = 'Generate Report';
  disablesavebutton = false;

  pageCriteria: PageCriteria = new PageCriteria();
  reportname!: string;

  // public groups: GroupDescriptor[] = [{
  //   field: 'modeofreceipt',
  //   aggregates: [{ field: "amount", aggregate: "sum" }]
  // }];

  ngOnInit(): void {
   this.buildForm();
    this.setPageModel();

    if (this.userBranchType === 'CAO') {
      this.branchcao = true;
      this.formname = 'Pending Transfer In';

      const kgms = this.pendingtransferform.get('kgmsbranchschema');
      kgms?.setValidators(Validators.required);
      kgms?.updateValueAndValidity();

      this._ChitTransactionsService
        .getBranchesByCAO(this.loginBranchschema, this.loginBranchschema)
        .subscribe((res: any) => this.CAOBranchList = res);

    } else if (this.userBranchType === 'KGMS') {
      this.branchkgms = true;
      this.formname = 'Pending Transfer Out';

      const userBranch = this.pendingtransferform.get('userbranchname');
      userBranch?.setValidators(Validators.required);
      userBranch?.updateValueAndValidity();

      this._ChitTransactionsService
        .getKGMSBranchList(this.loginBranchschema)
        .subscribe((res: any) => this.kgmsBranchList = res);
    }
  }


  buildForm() {
    this.pendingtransferform = this._fb.group({
      kgmsbranchschema: ['', Validators.required],
      userbranchname: ['', Validators.required],
      ptypeofpayment: [null, Validators.required]
    });
  }
   get f() {
    return this.pendingtransferform.controls;
  }

  typeofPaymentChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.typeofpayment = value;

    const map: any = {
      ALL: 'All',
      C: 'CASH',
      CH: 'CHEQUE',
      ONLINE: 'ONLINE'
    };
    this.typeofpaymentforreport = map[value] || '';
  }

  Caobranchchange(event: any) {
    if (!event) return;
    this.caoschema = event.branch_code;
    this.branchname = event.branch_name;
  }

  kgmsBranch_Change(event: any) {
    if (!event) return;
    this.caoschema = event.branchschema;
    this.branchname = event.branchname;
  }

  GenerateReport() {
    this.totalamount = 0;

    if (!this.validateSaveDeatails(this.pendingtransferform)) return;

    this.disablesavebutton = true;
    this.savebutton = 'Processing...';
    this.gridData = [];

    this._ChitTransactionsService
      .getCAOpendingtrasferlist(this.caoschema, this.loginBranchschema, this.typeofpayment)
      .subscribe((res:any) => {
        this.gridData = res || [];
        this.list = [...this.gridData];

        this.showhidetable = this.gridData.length > 0;
        this.dataisempty = !this.showhidetable;
        this.showicons = this.showhidetable;

        this.totalamount = this.gridData.reduce((sum, x) => sum + (x.amount || 0), 0);

        this.savebutton = 'Generate Report';
        this.disablesavebutton = false;

        this.updatePagination();
      });
  }

  setPageModel() {
    this.pageCriteria.pageSize = this._commonservice.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }

  updatePagination() {
    this.pageCriteria.totalrows = this.gridData.length;
    this.pageCriteria.TotalPages = Math.ceil(this.gridData.length / this.pageCriteria.pageSize);
    this.pageCriteria.CurrentPage = 1;
    this.pageCriteria.currentPageRows = Math.min(this.pageCriteria.pageSize, this.gridData.length);
  }

  onFooterPageChange(event: any) {
    this.pageCriteria.offset = event.page - 1;
    this.pageCriteria.CurrentPage = event.page;
  }

  onSort(event: any) {
    this.loading = true;
    const sort = event.sorts[0];

    setTimeout(() => {
      this.gridData = [...this.gridData].sort((a, b) =>
        a[sort.prop] > b[sort.prop] ? 1 : -1
      );
      this.loading = false;
    }, 500);
  }
  validateSaveDeatails(group: FormGroup): boolean {
    let valid = true;
    Object.keys(group.controls).forEach(k => {
      if (group.get(k)?.invalid) valid = false;
    });
    return valid;
  }
  betweendaysFilter(value: string) {
  const days = Number(value);

  if (!days) {
    this.gridData = [...this.list];
  } else {
    this.gridData = this.list.filter(x => (x.pendingdays || 0) >= days);
  }

  this.totalamount = this.gridData.reduce((sum, x) => sum + (x.amount || 0), 0);
  this.updatePagination();
}
export() {
  if (!this.gridData.length) return;

  const rows = this.gridData.map(x => ({
    'Branch Name': x.branchname,
    'Mode Of Receipt': x.modeofreceipt,
    'Voucher No': x.voucherno,
    'Transaction Date': x.transactiondate,
    'Amount': x.amount,
    'Pending Days': x.pendingdays
  }));

  this._commonservice.exportAsExcelFile(rows, 'Pending_Transfer_Report');
}


pdfOrprint(printorpdf: string) {
  debugger;
  let rows: any[] = [];

  if (this.gridData.length > 0) {
    if (this.userBranchType === 'CAO') {
      this.reportname = "Pending Transfer In";
    } else {
      this.reportname = "Pending Transfer Out";
    }

    const gridheaders = [
      "Branch\n Name",
      "   Chit No        ",
      "Subscriber \nName",
      "Chit\nStatus",
      "Receipt No",
      "Receipt Date",
      "Tr Date ",
      "    Receipt  \n Amount ",
      "Pending\ndays",
      "Due\nMonths",
      "Ref.No",
      "Cheque Date",
      "Bank Name"
    ];

    const colWidthHeight: any = {
      0: { cellWidth: 'auto', halign: 'left' },
      1: { cellWidth: 'auto', halign: 'center' },
      2: { cellWidth: 'auto', halign: 'left' },
      3: { cellWidth: 'auto', halign: 'center' },
      4: { cellWidth: 'auto', halign: 'center' },
      5: { cellWidth: 'auto', halign: 'left' },
      6: { cellWidth: 'auto', halign: 'left' },
      7: { cellWidth: 'auto', halign: 'right' },
      8: { cellWidth: 'auto', halign: 'center' },
      9: { cellWidth: 'auto', halign: 'center' },
      10: { cellWidth: 'auto', halign: 'center' },
      11: { cellWidth: 'auto', halign: 'center' },
      12: { cellWidth: 'auto', halign: 'left' }
    };

    const returningdata = this._commonservice._groupwiseSummaryExport_pendingtransfer(
      this.gridData,
      "modeofreceipt",
      "amount",
      false
    );

    returningdata.forEach((element: any) => {
      debugger;

      let datereceipt = '';
      if (element.date && element.date !== '[object Object]') {
        datereceipt = this._commonservice.getFormatDateGlobal(element.date);
      }

      let Amount = this._commonservice.convertAmountToPdfFormat(
        parseFloat(element.amount || 0).toFixed(2)
      );

      let referencenumber = element.reference_number || "--NA--";
      let chequedate = element.cheque_date || "--NA--";
      let trdate = element.trdate ? this._commonservice.getFormatDateGlobal(element.trdate) : "--NA--";
      let bankname = element.bankName || "--NA--";
      let totaldays = element.totaldays && element.totaldays !== '[object Object]' ? element.totaldays : "--NA--";

      let temp: any[] = [];

      if (element.group !== undefined) {
        temp = [
          element.group,
          element.branchName,
          element.subscriberName,
          element.chitstatus,
          element.receiptNo,
          datereceipt,
          trdate,
          element.chitNo,
          referencenumber,
          chequedate,
          bankname,
          Amount
        ];
      } else {
        temp = [
          element.branchName,
          element.chitNo,
          element.subscriberName,
          element.chitstatus,
          element.receiptNo,
          datereceipt,
          trdate,
          Amount,
          totaldays,
          element.pduemonths,
          referencenumber,
          chequedate,
          bankname
        ];
      }

      rows.push(temp);
    });

    const totalRow = [
      {
        content:
          '             Grand Total  :' +
          this._commonservice.convertAmountToPdfFormat(
            this._commonservice.currencyFormat(this.totalamount)
          ),
        colSpan: 13,
        styles: { halign: 'center', fontSize: 9, fontStyle: 'bold', textColor: "#663300" }
      }
    ];

    rows.push(totalRow as any);

    this._subscriberBalanceService._downloadPending_transferinReportsPdf(
      this.reportname,
      rows,
      gridheaders,
      colWidthHeight,
      "landscape",
      printorpdf,
      this.branchname,
      this.typeofpaymentforreport
    );
  } else {
    this._commonservice.showInfoMessage("No Data");
  }
}


}
