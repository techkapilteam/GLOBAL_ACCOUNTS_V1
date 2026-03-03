import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
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
import { TableModule } from 'primeng/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SubscriberjvService } from '../../../services/Transactions/subscriber/subscriberjv.service';
import { AccountReportsService } from 'src/app/services/account-reports.service';

@Component({
  selector: 'app-re-print',
  standalone: true,
  imports: [NgxDatatableModule, ReactiveFormsModule, CommonModule, NgSelectModule, TableModule],
  templateUrl: './re-print.component.html',
  styleUrl: './re-print.component.css',
  providers: [NumberToWordsPipe]
})
export class RePrintComponent implements OnInit {
  public ReprintRepotForm!: FormGroup;
  public lstreporttype: { reporttype: string; reporttypeid: string }[] = [];
  ReprinttValidation: Record<string, string> = {};
  @ViewChild('myTable') table: any;

  userBranchType: string | null = null;
  userbranchtxtboxshowhide = true;
  form15UID = false;
  userbranchngselectshowhide!: boolean;
  loginBranchschema!: string;

  pageCriteria!: PageCriteria;
  caolist: any[] = [];
  list: any[] = [];
  reporttype: any;
  branchcode: any;
  pageSize: any;
  Showhide = false;
  griddata: any[] = [];
  branchName: string | null = null;
  legalChitReceipt: any;
  ReceiptColunmForLegal = false;
  gstvoucherprintdata: any[] = [];
  gsthideshow = true;
  otherstate = true;
  UIDNoList!: any[];
  UIDdata: any;
  uid: any;
  showForm15HGrid = false;
  enteredPAN = '';
  form15HGridData: any[] = [];
  currencysymbol: string = '';

  commencementgridPage = new PageCriteria();
  private _AccountService=inject(AccountReportsService);

  constructor(
    private numbertowords: NumberToWordsPipe,
    private router: Router,
    private formbuilder: FormBuilder,
    private _commonService: CommonService,
    private _AccountingReportsService: AccountingReportsService,
    private _ChitTransactionsService: ChitTransactionsService,
    private _subscriberJVService: SubscriberjvService,
    private _AccountingTransactionsService: AccountingTransactionsService
  ) {
    this.pageCriteria = new PageCriteria();
  }

  ngOnInit(): void {
    this.currencysymbol = this._commonService.currencysymbol ?? '₹';
    this.lstreporttype = [
      { reporttype: 'General Receipt', reporttypeid: 'General Receipt' },
      { reporttype: 'Payment Voucher', reporttypeid: 'Payment Voucher' },
      { reporttype: 'Journal Voucher', reporttypeid: 'Journal Voucher' },
      { reporttype: 'Chit Receipt/PSO Chit Receipt', reporttypeid: 'Chit Receipt/PSO Chit Receipt' },
      { reporttype: 'Subscriber JV', reporttypeid: 'Subscriber JV' },
      { reporttype: 'Petty Cash', reporttypeid: 'Petty Cash' },
      { reporttype: 'Chit Payment', reporttypeid: 'Chit Payment' },
      { reporttype: 'GST BILL', reporttypeid: 'GST BILL' },
      { reporttype: 'Verification Charges', reporttypeid: 'Verification Charges' },
      { reporttype: 'Form 15H', reporttypeid: 'Form 15H' }
    ];

    this.ReprintRepotForm = this.formbuilder.group({
      schemaid: [this._commonService.getschemaname()],
      schemaname: ['schemaname'],
      samebranchcode: [this._commonService.getschemaname()],
      TransType: [null, Validators.required],
      Transno: [null],
      branch_name: [null],
      panno: [null]
    });

    this.setPageModel();
    // this.BlurEventAllControll(this.ReprintRepotForm);

    this.userBranchType = sessionStorage.getItem('userBranchType');
    this.loginBranchschema = sessionStorage.getItem('loginBranchSchemaname') ?? '';

    this.Showhide = this.userBranchType === 'CAO' ? true : false;

    const companyDetails = this._commonService._getCompanyDetails();
    this.branchName = sessionStorage.getItem('branchname');
    this.legalChitReceipt = companyDetails?.plegalcell_name;

    if (this.legalChitReceipt === this.branchName) {
      this.ReceiptColunmForLegal = true;
    }
  }

  setPageModel(): void {
    this.pageCriteria.pageSize = this._commonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }

  onFooterPageChange(event: any): void {
    this.pageCriteria.offset = event.page - 1;
    this.pageCriteria.CurrentPage = event.page;

    if (this.pageCriteria.totalrows < event.page * this.pageCriteria.pageSize) {
      this.pageCriteria.currentPageRows =
        this.pageCriteria.totalrows % this.pageCriteria.pageSize;
    } else {
      this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
    }
  }

  ReprintdataFilter(event: any): void {
    let searchText = event?.toString() ?? '';

    if (searchText !== '') {
      searchText = searchText.toLowerCase();
      this.griddata = this.list.filter(
        a =>
          a?.chit_no?.toString().toLowerCase().includes(searchText) ||
          a?.receipt_number?.toString().toLowerCase().includes(searchText)
      );
    } else {
      this.griddata = [...this.list];
    }

    this.pageCriteria.totalrows = this.griddata.length;
    this.pageCriteria.TotalPages =
      this.pageCriteria.totalrows > 10
        ? Math.floor(this.pageCriteria.totalrows / 10) + 1
        : 1;

    this.pageCriteria.currentPageRows =
      this.griddata.length < this.pageCriteria.pageSize
        ? this.griddata.length
        : this.pageCriteria.pageSize;
  }
  reportchange_Change(event: any): void {
    this.ReprintRepotForm.controls['panno'].clearValidators();
    this.ReprintRepotForm.controls['panno'].setValue(null);
    this.ReprintRepotForm.controls['panno'].updateValueAndValidity();

    this.form15UID = false;
    this.showForm15HGrid = false;

    this.ReprintRepotForm.controls['TransType'].setValue(event?.reporttype);
    this.reporttype = event?.reporttype;
    this.Showhide = false;
    this.griddata = [];

    if (event?.reporttype === 'Form 15H') {
      this.form15UID = true;
      this.userbranchtxtboxshowhide = false;
      this.userbranchngselectshowhide = false;

      this.ReprintRepotForm.controls['panno'].setValidators(Validators.required);
      this.ReprintRepotForm.controls['panno'].updateValueAndValidity();

      this.ReprintRepotForm.controls['branch_name'].clearValidators();
      this.ReprintRepotForm.controls['branch_name'].updateValueAndValidity();

      this.ReprintRepotForm.controls['Transno'].clearValidators();
      this.ReprintRepotForm.controls['Transno'].updateValueAndValidity();
      return;
    } else {
      this.vaildationforbranch();
    }

    if (
      event?.reporttype === 'Chit Receipt/PSO Chit Receipt' ||
      event?.reporttype === 'Verification Charges'
    ) {
      if (this.userBranchType === 'CAO') {
        if (event?.reporttype === 'Verification Charges') {
          this.userbranchtxtboxshowhide = false;
          this.form15UID = false;
          this.userbranchngselectshowhide = true;
          this.ReprintRepotForm.controls['panno'].clearValidators();
          this.ReprintRepotForm.controls['Transno'].clearValidators();
          this.ReprintRepotForm.controls['Transno'].updateValueAndValidity();
          this.Showhide = true;

          this._AccountingReportsService
            .GetVerificationChargesReceiptslist(this.loginBranchschema, this.loginBranchschema)
            .subscribe(res => {
              this.griddata = res ?? [];
              this.list = [...this.griddata];
              this.updatePagination(this.griddata);
            });
        } else {
          this.ReprintRepotForm.controls['Transno'].setValidators(Validators.required);
          this.ReprintRepotForm.controls['Transno'].updateValueAndValidity();
          this.ReprintRepotForm.controls['panno'].clearValidators();
          this.ReprintRepotForm.controls['panno'].updateValueAndValidity();
          this.vaildationforbranch();
        }

        if (this.ReprintRepotForm.controls['TransType'].value === 'Form 15H') {
          this.form15UID = true;
          this.ReprintRepotForm.controls['panno'].setValue(null);
          this.userbranchtxtboxshowhide = false;

          this._AccountingReportsService
            .GetForm15hReportwithpan(this.loginBranchschema, this.enteredPAN)
            .subscribe(res => (this.UIDNoList = res ?? []));
        }
      } else {
        this.ReprintRepotForm.controls['branch_name'].setValue(null);
        this.CallBranchApi();

        this.ReprintRepotForm.controls['branch_name'].setValidators(Validators.required);
        this.ReprintRepotForm.controls['branch_name'].updateValueAndValidity();

        this.ReprintRepotForm.controls['Transno'].clearValidators();
        this.ReprintRepotForm.controls['Transno'].updateValueAndValidity();

        this.ReprintRepotForm.controls['panno'].clearValidators();
        this.ReprintRepotForm.controls['panno'].updateValueAndValidity();

        this.userbranchngselectshowhide = true;
        this.userbranchtxtboxshowhide = false;
      }
    }
  }

  vaildationforbranch(): void {
    this.ReprintRepotForm.controls['Transno'].setValue('');
    this.userbranchngselectshowhide = false;
    this.userbranchtxtboxshowhide = true;

    this.ReprintRepotForm.controls['Transno'].setValidators(Validators.required);
    this.ReprintRepotForm.controls['Transno'].updateValueAndValidity();

    this.ReprintRepotForm.controls['branch_name'].clearValidators();
    this.ReprintRepotForm.controls['branch_name'].updateValueAndValidity();

    this.ReprinttValidation = {};
    this.Showhide = this.userBranchType === 'CAO' ? false : true;
  }

  Branchchange(event: any): void {
    this.ReprinttValidation = {};
    this.griddata = [];
    this.branchcode = event?.branch_code;
    this.Showhide = this.userBranchType === 'CAO' ? false : true;

    const serviceCall =
      this.reporttype === 'Verification Charges'
        ? this._AccountingReportsService.GetVerificationChargesReceiptslist(
          this.loginBranchschema,
          this.branchcode
        )
        : this._AccountingReportsService.GetChitReceiptslist(
          this.loginBranchschema,
          this.branchcode
        );

    serviceCall.subscribe(res => {
      this.griddata = res ?? [];
      this.list = [...this.griddata];
      this.updatePagination(this.griddata);
    });
  }

  CallBranchApi(): void {
    this._AccountingReportsService
      .GetCaobranchlist(this.loginBranchschema)
      .subscribe(res => (this.caolist = res ?? []));
  }

  clickForLegalReceipt(row: any): void {
    if (this.legalChitReceipt === this.branchName) {
      const recieptno = btoa(row?.general_receipt_number);
      const commonreceiptno = btoa(row?.commanReceiptNumber);
      const caoschema = btoa(this.branchcode);
      const incidentalcharges = btoa('true');

      window.open(
        `/#/LegalChitReceiptPrint?recieptno=${recieptno}&commonreceiptno=${commonreceiptno}&caoschema=${caoschema}&INCcharges=${incidentalcharges}`,
        '_blank'
      );
    }
  }

  click(row: any): void {
    this.ReprintRepotForm.controls['Transno'].setValue(row?.receipt_number);
    this.getduplicateReport();
  }

  updatePagination(data: any[]): void {
    this.pageCriteria.totalrows = data.length;
    this.pageCriteria.TotalPages =
      data.length > 10 ? Math.ceil(data.length / 10) : 1;
    this.pageCriteria.CurrentPage = 1;
    this.pageCriteria.currentPageRows =
      data.length < this.pageCriteria.pageSize
        ? data.length
        : this.pageCriteria.pageSize;
  }
  getduplicateReport(): void {
    // if (!this.validateSaveDeatails(this.ReprintRepotForm)) return;
    //  window.open('/GeneralReceiptReport','_blank')
    //  this.router.navigate(['/GeneralReceiptReport'])
    // this.router.navigate(['/dashboard/GeneralReceiptReport']);
    const transType = this.ReprintRepotForm.controls['TransType'].value;
    const transNo = this.ReprintRepotForm.controls['Transno'].value;
    // const schemaName = this._commonService.getschemaname();
    const schemaName = this._commonService.getbranchname();

    if (transType === 'General Receipt') {
      this._AccountingReportsService
        .GetRePrintInterBranchGeneralReceiptbyId(transNo, 'accounts', 'KAPILCHITS', 'KLC01')
        .subscribe(count => {
          if (count === 0) {
            this._AccountingReportsService
              // .GetGeneralReceiptbyId(transNo, schemaName)
              .GetGeneralReceiptbyId(transNo, 'accounts', 'KAPILCHITS', 'KLC01', 'global')
              .subscribe(res => {
                if (res) {
                  // const receipt = btoa(`${transNo},General Receipt,Reprint,${schemaName}`);
                  // // window.open(`/GeneralReceiptReport?id=${receipt}`, '_blank');
                  // window.open('/GeneralReceiptReport','_blank')
                  const receipt = btoa(
                    `${transNo},General Receipt,Reprint,${schemaName}`
                  );

                  const url = this.router.serializeUrl(
                    this.router.createUrlTree(
                      ['/GeneralReceiptReport/:id'],
                      { queryParams: { id: receipt } }
                    )
                  );

                  window.open(url, '_blank');

                } else alert('Transaction No. Does Not Exit !');
              });
          } else {
            this._AccountingReportsService
              .GetInterBranchGeneralReceiptbyId(transNo)
              .subscribe(res => {
                if (res) {
                  const receipt = btoa(`${transNo},Inter Branch Receipt,Reprint`);
                  window.open(`/InterBranchReport?id=${receipt}`, '_blank');
                } else alert('Transaction No. Does Not Exit !');
              });
          }
        });
    }

    if (transType === 'Form 15H') {
      this._AccountingReportsService
        .GetForm15hReportwithpan(this.loginBranchschema, this.ReprintRepotForm.controls['panno'].value)
        .subscribe(
          res => {
            if (res?.length > 0) {
              this.form15HGridData = res;
              this.showForm15HGrid = true;
              this.Showhide = false;
              this.pageCriteria.totalrows = res.length;
              this.pageCriteria.TotalPages = Math.ceil(res.length / this.pageCriteria.pageSize);
              this.pageCriteria.CurrentPage = 1;
            } else {
              this._commonService.showWarningMessage('No Records!');
              this.form15HGridData = [];
            }
          },
          () => this._commonService.showErrorMessage('Error fetching UID list')
        );
      return;
    }

    if (transType === 'Verification Charges') {
      const branchSchema =
        this.userBranchType === 'CAO' ? schemaName : this.branchcode;

      this._AccountingReportsService
        // .GetGeneralReceiptbyId(transNo, branchSchema)
        .GetGeneralReceiptbyId(transNo, 'accounts', 'KAPILCHITS', 'KLC01', 'global')
        .subscribe(res => {
          if (res) {
            // const receipt = btoa(`${transNo},General Receipt,Reprint,${branchSchema}`);
            // window.open(`/#/GeneralReceiptReport?id=${receipt}`, '_blank');
            const receipt = btoa(
                    `${transNo},General Receipt,Reprint,${schemaName}`
                  );

                  const url = this.router.serializeUrl(
                    this.router.createUrlTree(
                      ['/GeneralReceiptReport/:id'],
                      { queryParams: { id: receipt } }
                    )
                  );

                  window.open(url, '_blank');
          } else alert('Transaction No. Does Not Exit !');
        });
    }

    if (transType === 'Journal Voucher') {
      const receipt = btoa(`${transNo},Journal Voucher,Reprint`);
      this._AccountingReportsService.GetJvReport(transNo,'accounts','global','KAPILCHITS','KLC01').subscribe(res => {
        if (res){
          const url = this.router.serializeUrl(
                    this.router.createUrlTree(
                      ['/JournalVoucherReport/:id'],
                      { queryParams: { id: receipt } }
                    )
                  );

                  window.open(url, '_blank');
        }
          //  window.open(`/#/JournalVoucherReport?id=${receipt}`, '_blank');
        else alert('Transaction No. Does Not Exit !');
      });
    }

    if (transType === 'Payment Voucher') {
      
      this._AccountingReportsService.GetPaymentVoucherbyId(transNo,'accounts','KAPILCHITS','KLC01','global').subscribe(res => {
        if (res?.length > 0) {
          const receipt = btoa(`${transNo},Payment Voucher,Reprint`);
          // window.open(`/#/PaymentVoucherReport?id=${receipt}`, '_blank');
          const url = this.router.serializeUrl(
                    this.router.createUrlTree(
                      ['/PaymentVoucherReport/:id'],
                      { queryParams: { id: receipt } }
                    )
                  );

                  window.open(url, '_blank');
        } else alert('Transaction No. Does Not Exit !');
      });
    }

    if (transType === 'Subscriber JV') {
      this._subscriberJVService.getSubscriberJVReport(transNo).subscribe((res: any[]) => {
        if (res?.[0]?.sjvDetails?.length > 0) {
          const debit = res[0].sjvDetails.reduce((s: number, v: any) => s + v.debit, 0);
          const credit = res[0].sjvDetails.reduce((s: number, v: any) => s + v.credit, 0);

          if (debit === credit) {
            const receipt = btoa(`${transNo},Subscriber JV,Reprint`);
            window.open(`/#/JournalVoucherPrint?id=${receipt}`, '_blank');
          } else this._commonService.showWarningMessage('Credit and Debit Not Matched!!');
        } else alert('Transaction No. Does Not Exit !');
      });
    }

    if (transType === 'Petty Cash') {
      this._AccountingReportsService.GetPettyCashbyId(transNo,'accounts','KAPILCHITS','KLC01','global').subscribe(res => {
        if (res?.length > 0) {
          const receipt = btoa(`${transNo},Petty Cash,Reprint`);
          // window.open(`/#/PaymentVoucherReport?id=${receipt}`, '_blank');
          const url = this.router.serializeUrl(
                    this.router.createUrlTree(
                      ['/PaymentVoucherReport/:id'],
                      { queryParams: { id: receipt } }
                    )
                  );

                  window.open(url, '_blank');
        } else alert('Transaction No. Does Not Exit !');
      });
    }

    if (transType === 'Chit Payment') {
      this._AccountingReportsService.GetChitPaymentReportData(transNo,'accounts','KAPILCHITS','KLC01','global').subscribe(res => {
        if (res) {
          const receipt = btoa(`${transNo},Chit Payment Voucher,Reprint`);
          // window.open(`/#/PaymentVoucherReport?id=${receipt}`, '_blank');
          const url = this.router.serializeUrl(
                    this.router.createUrlTree(
                      ['/PaymentVoucherReport/:id'],
                      { queryParams: { id: receipt } }
                    )
                  );

                  window.open(url, '_blank');
        } else alert('Transaction No. Does Not Exist !');
      });
    }

    if (transType === 'GST BILL') {
      this._AccountService
        .Getgstvocuherprint(schemaName, transNo)
        .subscribe(res => {
          this.gstvoucherprintdata = res ?? [];
          if (this.gstvoucherprintdata.length > 0) this.print();
          else alert('Transaction No. Does Not Exist !');
        });
    }
  }

  print(): void {
    debugger
    let totaligstamt = 0;
    let totalamtBeforeTax = 0;
    let totalCGSTAmt = 0;
    let totalSGSTAmt = 0;
    let totalTaxAmt = 0;
    let totalamtAfterTax = 0;
    let totaldiscountAmt = 0;
    let proundoff_amount = 0;
    let tdsamount = 0;
    const gridrows: any[] = [];

    this.gstvoucherprintdata.forEach((e: any) => {
      proundoff_amount = parseFloat(e.proundoff_amount)||0;
      tdsamount = parseFloat(e.invoice_tds_amount)||0;
      totalamtBeforeTax += e.invoice_amount;
      totaldiscountAmt += e.product_discount;
      totalamtAfterTax += e.invoice_total_amount;

      if (this.gsthideshow) {
        totalCGSTAmt += e.cgst_amount;
        totalSGSTAmt += e.sgst_amount;
        totalTaxAmt = totalCGSTAmt + totalSGSTAmt;

        gridrows.push([
          e.product_name,
          e.hsN_code,
          e.product_qty,
          e.product_cost,
          e.invoice_amount,
          e.product_discount,
          e.invoice_amount - e.product_discount,
          e.cgst_percentage,
          e.cgst_amount,
          e.sgst_percentage,
          e.sgst_amount,
          e.invoice_total_amount
        ]);
      } else {
        totaligstamt += e.igst_amount;
        totalTaxAmt = totaligstamt;

        gridrows.push([
          e.product_name,
          e.hsN_code,
          e.product_qty,
          e.product_cost,
          e.invoice_amount,
          e.product_discount,
          e.invoice_amount - e.product_discount,
          e.igst_percentage,
          e.igst_amount,
          e.invoice_total_amount
        ]);
      }
    });

    totalamtAfterTax -= tdsamount;
    const finalAmount = totalamtAfterTax + proundoff_amount;
    const amountWords =
      this.titleCase(this.numbertowords.transform(finalAmount)) + ' Rupees Only.';

    const totalamount_after_tax = this.gstvoucherprintdata.reduce(
      (s: number, c: any) => s + parseFloat(c.invoice_total_amount),
      0
    );

    this._commonService._downloadGSTVOucherReport2(
      'Tax Invoice',
      gridrows,
      [],
      {},
      'a4',
      'As On',
      '',
      '',
      'Pdf',
      this.gstvoucherprintdata,
      '',
      '',
      false,
      totalamtBeforeTax,
      totaligstamt,
      totalCGSTAmt,
      totalSGSTAmt,
      totalTaxAmt,
      finalAmount,
      this.gsthideshow,
      this.otherstate,
      amountWords,
      totaldiscountAmt,
      proundoff_amount,
      tdsamount,
      totalamount_after_tax
    );
  }

  titleCase(str: string): string {
    return str
      ?.toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  onUIDClick(uid: string): void {
    const encoded = btoa(`${uid},Form 15H,Reprint,${this.loginBranchschema}`);
    window.open(`/#/Form15hReprint?id=${encoded}`, '_blank');
  }



}
