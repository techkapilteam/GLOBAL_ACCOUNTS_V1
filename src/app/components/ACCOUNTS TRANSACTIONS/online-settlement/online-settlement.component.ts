import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';
import { NgSelectModule } from '@ng-select/ng-select';

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
  bankbalance = 125000.75;
  bankbalancetype = 'Cr';
  brsdate = '23-Feb-2026';

  dpConfig: Partial<BsDatepickerConfig> = {};
  ptransactiondateConfig: Partial<BsDatepickerConfig> = {};
  pchequecleardateConfig: Partial<BsDatepickerConfig> = {};

  private fb = inject(FormBuilder);
  private datePipe = inject(DatePipe);

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

    this.loadDummyBanks();
    this.loadDummyGrid();
    this.setupDependencies();
  }

  // ==================================================
  // DEPENDENCY LOGIC
  // ==================================================

  setupDependencies(): void {

    // Bank → Enable Online Account
    this.ChequesInBankForm.get('bankname')?.valueChanges.subscribe(value => {
      if (value) {
        this.ChequesInBankForm.get('paytmname')?.enable();
      } else {
        this.ChequesInBankForm.get('paytmname')?.disable();
        this.ChequesInBankForm.get('paytmname')?.setValue('');
      }
    });

    // Radio Filter
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
  // SEARCH (WITH RADIO SUPPORT)
  // ==================================================

  onSearch(value: string): void {

    let filteredData = [...this.originalGridData];
    const type = this.ChequesInBankForm.value.chequeintype;

    // Apply radio filter first
    if (type === 'D') {
      filteredData = filteredData.filter(x => x.pCleardate);
    }
    else if (type === 'ND') {
      filteredData = filteredData.filter(x => !x.pCleardate);
    }

    // Apply search filter
    if (value) {
      const search = value.toLowerCase();
      filteredData = filteredData.filter(item =>
        JSON.stringify(item).toLowerCase().includes(search)
      );
    }

    this.gridData = filteredData;
  }

  // ==================================================
  // DUMMY DROPDOWN DATA
  // ==================================================

  private loadDummyBanks(): void {

    this.bankList = [
      { paccountid: 1, pdepositbankname: 'SBI - 1234567890' },
      { paccountid: 2, pdepositbankname: 'HDFC - 9876543210' },
      { paccountid: 3, pdepositbankname: 'ICICI - 4567891230' }
    ];

    this.PaytmList = [
      { paccountid: 101, pdepositbankname: 'Paytm Wallet' },
      { paccountid: 102, pdepositbankname: 'PhonePe UPI' },
      { paccountid: 103, pdepositbankname: 'Google Pay' }
    ];
  }

  private loadDummyGrid(): void {

    this.originalGridData = [
      {
        preceiptid: 1001,
        chitReceiptNo: 'CR001',
        pChequenumber: 'CHQ12345',
        pbranchname: 'Hyderabad',
        ptotalreceivedamount: 15000,
        ppartyname: 'Ramesh Kumar',
        preceiptdate: '20-Feb-2026',
        pdepositeddate: '21-Feb-2026',
        pCleardate: '22-Feb-2026',
        ptypeofpayment: 'Cheque',
        cheque_bank: 'SBI'
      },
      {
        preceiptid: 1002,
        chitReceiptNo: 'CR002',
        pChequenumber: 'CHQ56789',
        pbranchname: 'Warangal',
        ptotalreceivedamount: 25000,
        ppartyname: 'Suresh Babu',
        preceiptdate: '19-Feb-2026',
        pdepositeddate: '20-Feb-2026',
        pCleardate: '',
        ptypeofpayment: 'UPI',
        cheque_bank: 'PhonePe'
      },
      {
        preceiptid: 1003,
        chitReceiptNo: 'CR003',
        pChequenumber: 'CHQ99887',
        pbranchname: null,
        ptotalreceivedamount: 10000,
        ppartyname: 'Lakshmi Devi',
        preceiptdate: '18-Feb-2026',
        pdepositeddate: '19-Feb-2026',
        pCleardate: '',
        ptypeofpayment: 'Cheque',
        cheque_bank: 'HDFC'
      }
    ];

    this.gridData = [...this.originalGridData];
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