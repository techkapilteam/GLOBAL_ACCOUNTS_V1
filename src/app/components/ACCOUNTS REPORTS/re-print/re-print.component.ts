import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonService } from '../../../services/common.service';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import { ChitTransactionsService } from '../../../services/chit-transactions.service';
import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';
import { Router } from '@angular/router';
import { PageCriteria } from '../../../Models/pageCriteria';
import { NumberToWordsPipe } from './number-to-words.pipe';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-re-print',
  standalone:true,
  imports: [NgxDatatableModule,ReactiveFormsModule,CommonModule,NgSelectModule],
  templateUrl: './re-print.component.html',
  styleUrl: './re-print.component.css',
  providers: [NumberToWordsPipe]
})
export class RePrintComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private commonService = inject(CommonService);
  private accountingReportsService = inject(AccountingReportsService);
  private chitService = inject(ChitTransactionsService);
  // private subscriberJVService = inject(SubscriberJV);
  private accountingTxnService = inject(AccountingTransactionsService);
  private numberToWords = inject(NumberToWordsPipe);

  @ViewChild('myTable') table: any;

  ReprintRepotForm!: FormGroup;
currencysymbol = '₹';
  lstreporttype: any[] = [];
  userBranchType: any;
  userbranchtxtboxshowhide = true;
  userbranchngselectshowhide = false;
  form15UID = false;
  showForm15HGrid = false;
  Showhide = false;

  pageCriteria: PageCriteria = new PageCriteria();
  // commencementgridPage = new Page();
  caolist: any[] = [];
  list: any[] = [];
  griddata: any[] = [];
  UIDNoList: any[] = [];
  form15HGridData: any[] = [];
  gstvoucherprintdata: any[] = [];

  branchcode: any;
  branchName: any;
  legalChitReceipt: any;
  loginBranchschema: any;
  reporttype: any;

  ReceiptColunmForLegal = false;
  gsthideshow = true;
  otherstate = true;
  enteredPAN = '';
  selectedReport: any;


  ngOnInit(): void {

    this.lstreporttype = [
      { reporttype: 'General Receipt' },
      { reporttype: 'Payment Voucher' },
      { reporttype: 'Journal Voucher' },
      { reporttype: 'Chit Receipt/PSO Chit Receipt' },
      { reporttype: 'Subscriber JV' },
      { reporttype: 'Petty Cash' },
      { reporttype: 'Chit Payment' },
      { reporttype: 'GST BILL' },
      { reporttype: 'Verification Charges' },
      { reporttype: 'Form 15H' }
    ];

    this.ReprintRepotForm = this.fb.group({
      schemaid: [this.commonService.getschemaname(), Validators.required],
      schemaname: ['schemaname', [Validators.required, Validators.minLength(3)]],
      samebranchcode: [this.commonService.getschemaname(), Validators.required],
      TransType: [null, Validators.required],
      Transno: [null],
      branch_name: [null],
      panno: [null]
    });

    this.setPageModel();

    this.userBranchType = sessionStorage.getItem("userBranchType");
    this.loginBranchschema = sessionStorage.getItem('loginBranchSchemaname');
    this.branchName = sessionStorage.getItem("branchname");

    this.Showhide = false;

    const companyDetails = this.commonService._getCompanyDetails();
    this.legalChitReceipt = companyDetails?.plegalcell_name || '';
    this.ReceiptColunmForLegal = this.legalChitReceipt === this.branchName;
  }

  setPageModel() {
    this.pageCriteria.pageSize = this.commonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }

  onFooterPageChange(event: any): void {
    this.pageCriteria.offset = event.page - 1;
    this.pageCriteria.CurrentPage = event.page;
  }

  ReprintdataFilter(event: any) {
    let searchText = event?.toString().toLowerCase() || '';
    this.griddata = searchText
      ? this.list.filter(a =>
          a.chit_no?.toString().toLowerCase().includes(searchText) ||
          a.receipt_number?.toString().toLowerCase().includes(searchText))
      : this.list;

    this.pageCriteria.totalrows = this.griddata.length;
  }

  showErrorMessage(msg: any) {
    this.commonService.showErrorMessage(msg);
  }

  click(row: any) {
    this.ReprintRepotForm.controls['Transno'].setValue(row.receipt_number);
    this.getduplicateReport();
  }

  getduplicateReport() {
    this.ReprintRepotForm.markAllAsTouched();
    this.ReprintRepotForm.updateValueAndValidity();

    if (this.ReprintRepotForm.invalid) return;

    const transNo = this.ReprintRepotForm.value.Transno;
    const type = this.ReprintRepotForm.value.TransType;
    this.Showhide = false;
    this.griddata = [];

    if (type === 'General Receipt') {
      window.open('/#/GeneralReceiptReport?id=' +
        btoa(`${transNo},General Receipt,Reprint,${this.commonService.getschemaname()}`),
        "_blank");
      return;
    }

    if (type === 'GST BILL') {
      this.accountingTxnService
        .Getgstvocuherprint(this.commonService.getschemaname(), transNo)
        .subscribe((res: any) => {
          if (res?.length) this.print();
          else alert("Transaction No. Does Not Exist!");
        });
      return;
    }
  }

  reportchange_Change(selectedType: any): void {

    this.selectedReport = selectedType;

    const transNoCtrl = this.ReprintRepotForm.get('Transno');
    const panCtrl = this.ReprintRepotForm.get('panno');
    const branchCtrl = this.ReprintRepotForm.get('branch_name');

    this.userbranchtxtboxshowhide = true;
    this.userbranchngselectshowhide = false;
    this.form15UID = false;
    this.Showhide = false;

    transNoCtrl?.clearValidators();
    panCtrl?.clearValidators();
    branchCtrl?.clearValidators();

    if (selectedType === 'Verification Charges') {
      this.userbranchtxtboxshowhide = false;
      this.userbranchngselectshowhide = true;
      this.Showhide = true;

      transNoCtrl?.setValue(null);
      branchCtrl?.setValidators([Validators.required]);
    }
    else if (selectedType === 'Form 15H') {
      this.userbranchtxtboxshowhide = false;
      this.form15UID = true;
      panCtrl?.setValidators([Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]);
    }
    else {
      this.userbranchtxtboxshowhide = true;
      transNoCtrl?.setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
    }

    transNoCtrl?.updateValueAndValidity();
    panCtrl?.updateValueAndValidity();
    branchCtrl?.updateValueAndValidity();
  }

  print(): void {
    const totalamtAfterTax = this.gstvoucherprintdata
      .reduce((sum: number, x: any) => sum + Number(x.invoice_total_amount || 0), 0);

    const words =
      this.titleCase(this.numberToWords.transform(totalamtAfterTax)) +
      ' Rupees Only.';

    this.commonService._downloadGSTVOucherReport2(
      'Tax Invoice', [], [], {},
      'a4', 'As On', '', '', 'Pdf',
      this.gstvoucherprintdata,
      '', {}, false, 0, 0, 0, 0, 0,
      totalamtAfterTax,
      this.gsthideshow,
      this.otherstate,
      words, 0, 0, 0,
      totalamtAfterTax
    );
  }

  titleCase(str: string) {
    return str.toLowerCase().split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  onUIDClick(uid: any) {
    const encoded = btoa(`${uid},Form 15H,Reprint,${this.loginBranchschema}`);
    window.open('/#/Form15hReprint?id=' + encoded, "_blank");
  }

}
