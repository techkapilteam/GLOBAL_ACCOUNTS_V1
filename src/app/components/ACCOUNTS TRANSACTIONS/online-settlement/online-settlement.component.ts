import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccountingTransactionsService } from 'src/app/services/Transactions/AccountingTransaction/accounting-transaction.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-online-settlement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    TableModule,
    NgSelectModule
  ],
  templateUrl: './online-settlement.component.html',
  styleUrls: ['./online-settlement.component.css'],
  providers: [DatePipe]
})
export class OnlineSettlementComponent implements OnInit {

  ChequesInBankForm!: FormGroup;

  gridData: any[] = [];
  originalGridData: any[] = [];
  selected: any[] = [];

  bankList: any[] = [];
  PaytmList: any[] = [];

  currencySymbol = '₹';
  bankbalance = 0;
  bankbalancetype = '';
  brsdate = '';

  dpConfig: Partial<BsDatepickerConfig> = {};
  ptransactiondateConfig: Partial<BsDatepickerConfig> = {};
  pchequecleardateConfig: Partial<BsDatepickerConfig> = {};

  private fb = inject(FormBuilder);
  private datePipe = inject(DatePipe);
  private _Accountservice = inject(AccountingTransactionsService);
  private _CommonService = inject(CommonService);

  // ==================================================
  // INIT
  // ==================================================

  ngOnInit(): void {

    const todayDate = new Date();

    this.ChequesInBankForm = this.fb.group({
      ptransactiondate: [todayDate],
      pchequereceiptdate: [todayDate],
      pchequecleardate: [todayDate],
      bankname: [''],
      paytmname: [{ value: '', disabled: true }],
      chequeintype: ['A'],
      searchtext: ['']
    });

    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      showWeekNumbers: false,
      maxDate: new Date()
    };

    this.ptransactiondateConfig = this.dpConfig;
    this.pchequecleardateConfig = this.dpConfig;

    this.loadBankList();
    this.loadUPIList();
    this.loadChequeReturnCharges();
    this.loadGridData();

    this.setupDependencies();
  }

  loadBankList(): void {

    const BranchSchema = this._CommonService.getbranchname();
    const GlobalSchema = this._CommonService.getschemaname();
    const CompanyCode = this._CommonService.getCompanyCode();
    const BranchCode = this._CommonService.getBranchCode();

    this._Accountservice.GetBankntList(
      BranchSchema,
      GlobalSchema,
      CompanyCode,
      BranchCode
    ).subscribe((res: any) => {

      this.bankList = res || [];

    });
  }

  loadUPIList(): void {

    const GlobalSchema = this._CommonService.getschemaname();
    const CompanyCode = this._CommonService.getCompanyCode();
    const BranchCode = this._CommonService.getBranchCode();

    this._Accountservice.GetBankUPIDetails(
      GlobalSchema,
      BranchCode,
      CompanyCode
    ).subscribe((res: any) => {

      this.PaytmList = res || [];

    });
  }

  loadGridData(): void {

    const payload = {
      transactiondate: this.formatDate(
        this.ChequesInBankForm.value.ptransactiondate
      ),
      branchcode: this._CommonService.getBranchCode(),
      companycode: this._CommonService.getCompanyCode(),
      globalschema: this._CommonService.getschemaname()
    };

    this._Accountservice.GetOnlineSettlementList(payload)
      .subscribe((res: any) => {

        this.originalGridData = res || [];
        this.gridData = [...this.originalGridData];

      });

  }

  // ==================================================
  // CHEQUE RETURN CHARGES
  // ==================================================

  loadChequeReturnCharges(): void {

    const GlobalSchema = this._CommonService.getschemaname();
    const CompanyCode = this._CommonService.getCompanyCode();
    const BranchCode = this._CommonService.getBranchCode();

    this._Accountservice.getchequereturncharges(
      GlobalSchema,
      CompanyCode,
      BranchCode
    ).subscribe();
  }

  // ==================================================
  // DEPENDENCY LOGIC
  // ==================================================

  setupDependencies(): void {

    this.ChequesInBankForm.get('bankname')?.valueChanges.subscribe(value => {

      if (value) {

        this.ChequesInBankForm.get('paytmname')?.enable();

        const brstodate = this.formatDate(
          this.ChequesInBankForm.value.ptransactiondate
        );

        const BranchSchema = this._CommonService.getbranchname();
        const BranchCode = this._CommonService.getBranchCode();
        const CompanyCode = this._CommonService.getCompanyCode();

        this._Accountservice.GetBankBalance(
          brstodate,
          value,
          BranchSchema,
          BranchCode,
          CompanyCode
        ).subscribe((res: any) => {

          this.bankbalance = res?.bankbalance || 0;
          this.bankbalancetype = res?.bankbalancetype || '';
          this.brsdate = res?.brsdate || '';

        });

      }
      else {

        this.ChequesInBankForm.get('paytmname')?.disable();
        this.ChequesInBankForm.get('paytmname')?.setValue('');

      }

    });

    this.ChequesInBankForm.get('chequeintype')?.valueChanges.subscribe(type => {
      this.applyRadioFilter(type);
    });

  }

  // ==================================================
  // RADIO FILTER
  // ==================================================

  applyRadioFilter(type: string): void {

    if (type === 'A') {
      this.gridData = [...this.originalGridData];
    }
    else if (type === 'D') {
      this.gridData = this.originalGridData.filter(x => x.pCleardate);
    }
    else if (type === 'ND') {
      this.gridData = this.originalGridData.filter(x => !x.pCleardate);
    }

    this.selected = [];
  }

  // ==================================================
  // SEARCH
  // ==================================================

  onSearch(value: string): void {

    let filteredData = [...this.originalGridData];
    const type = this.ChequesInBankForm.value.chequeintype;

    if (type === 'D') {
      filteredData = filteredData.filter(x => x.pCleardate);
    }
    else if (type === 'ND') {
      filteredData = filteredData.filter(x => !x.pCleardate);
    }

    if (value) {
      const search = value.toLowerCase();
      filteredData = filteredData.filter(item =>
        JSON.stringify(item).toLowerCase().includes(search)
      );
    }

    this.gridData = filteredData;
  }

  // ==================================================
  // HELPERS
  // ==================================================

  getSelectedTotal(): number {
    return this.selected.reduce(
      (sum, row) => sum + (row.ptotalreceivedamount || 0),
      0
    );
  }

  clearSelection(): void {
    this.selected = [];
  }

  Save(): void {
    console.log('Selected Rows:', this.selected);
  }

  formatDate(date: Date | string | null): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
  }
}