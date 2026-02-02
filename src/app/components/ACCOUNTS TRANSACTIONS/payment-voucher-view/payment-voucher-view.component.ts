import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-payment-voucher-view',
  templateUrl: './payment-voucher-view.component.html',
  styleUrls: ['./payment-voucher-view.component.css'],
  imports: [CommonModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    BsDatepickerModule
  ],
  providers: [DecimalPipe]
})
export class PaymentVoucherViewComponent implements OnInit {
 public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  today:Date=new Date();

  // Payment Mode
  paymentMode: 'CASH' | 'BANK' = 'CASH';

  // Bank Instrument Type
  bankType: 'CHEQUE' | 'ONLINE' | 'DEBIT' | 'CREDIT' = 'CHEQUE';

  // GST / TDS toggles
  gstEnabled: boolean = false;
  tdsEnabled: boolean = false;

  // Dummy Data
  payment = {
    amountPaid: 5000,
    party: 'Party A',
    ledger: 'Ledger A',
    subLedger: 'Sub Ledger A',
  };

  // Dummy grid data
  paymentslist1: any[] = [];
  partyjournalentrylist: any[] = [];

  // Reactive Form
  paymentVoucherForm!: FormGroup;
  journalform!: FormGroup;

  constructor(private fb: FormBuilder) {
      this.dpConfig.maxDate = new Date();
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig.showWeekNumbers = false;
  }

  ngOnInit(): void {
   // this.today = new Date().toISOString().substring(0, 10);

    this.paymentVoucherForm = this.fb.group({
      todate:[this.today],
      pisgstapplicable: [false],
      pgstcalculationtype: ['INCLUDE'],
      pStateId: [''],
      pgstno: [''],
      pgstpercentage: [0],
      pgstamount: [0],
      pigstpercentage: [0],
      pigstamount: [0],
      pcgstpercentage: [0],
      pcgstamount: [0],
      psgstpercentage: [0],
      psgstamount: [0],
      putgstpercentage: [0],
      putgstamount: [0],

      pistdsapplicable: [false],
      ptdscalculationtype: ['INCLUDE'],
      pTdsSection: [''],
      pTdsPercentage: [0],
      ptdsamount: [0],

      ppaymentsslistcontrols: this.fb.group({
        pgstamount: [0],
        pigstpercentage: [0],
        pigstamount: [0],
        pcgstpercentage: [0],
        pcgstamount: [0],
        psgstpercentage: [0],
        psgstamount: [0],
        putgstpercentage: [0],
        putgstamount: [0],
        ptdsamount: [0]
      }),

      pnarration: [''],
      pDocStorePath: ['']
    });

    this.paymentslist1 = [
      { ppartyname: 'Party A', pledgername: 'Ledger A', psubledgername: 'Sub Ledger A', ptotalamount: 5000, pamount: 5000, pgstcalculationtype: '', pTdsSection: '', pgstpercentage: 0, ptdsamount: 0 }
    ];

    this.partyjournalentrylist = [
      { accountname: 'Party A', debitamount: 5000, creditamount: 0 },
      { accountname: 'Bank', debitamount: 0, creditamount: 5000 }
    ];
  }

  setPaymentMode(mode: 'CASH' | 'BANK') {
    this.paymentMode = mode;
    if (mode === 'BANK') {
      this.bankType = 'CHEQUE';
    }
  }

  setBankType(type: 'CHEQUE' | 'ONLINE' | 'DEBIT' | 'CREDIT') {
    this.bankType = type;
  }

  isgstapplicable_Checked() {
    this.gstEnabled = !this.gstEnabled;
  }

  istdsapplicable_Checked() {
    this.tdsEnabled = !this.tdsEnabled;
  }

  claculategsttdsamounts() {
    // Dummy calculation for GST/TDS
    const baseAmount = this.payment.amountPaid;

    if (this.gstEnabled) {
      const gstPercent = this.paymentVoucherForm.get('pgstpercentage')?.value || 0;
      const gstAmount = (baseAmount * gstPercent) / 100;
      this.paymentVoucherForm.patchValue({
        pgstamount: gstAmount,
        pigstpercentage: gstPercent,
        pigstamount: gstAmount
      });
    }

    if (this.tdsEnabled) {
      const tdsPercent = this.paymentVoucherForm.get('pTdsPercentage')?.value || 0;
      const tdsAmount = (baseAmount * tdsPercent) / 100;
      this.paymentVoucherForm.patchValue({
        ptdsamount: tdsAmount
      });
    }
  }

  clearPaymentDetails() {
    this.paymentVoucherForm.reset({
      pisgstapplicable: false,
      pgstcalculationtype: 'INCLUDE',
      pStateId: '',
      pgstno: '',
      pgstpercentage: 0,
      pgstamount: 0,
      pistdsapplicable: false,
      ptdscalculationtype: 'INCLUDE',
      pTdsSection: '',
      pTdsPercentage: 0,
      ptdsamount: 0,
      pnarration: '',
      pDocStorePath: ''
    });

    this.gstEnabled = false;
    this.tdsEnabled = false;
  }

  addPaymentDetails() {
    alert('Payment Added (Dummy)');
  }

  savePaymentVoucher() {
    alert('Saved (Dummy)');
  }

  removeHandler(rowIndex: number) {
    this.paymentslist1.splice(rowIndex, 1);
  }
  saveJournalVoucher(){

  }
  clearPaymentVoucher(){}
  uploadAndProgress($event:any){}
}
