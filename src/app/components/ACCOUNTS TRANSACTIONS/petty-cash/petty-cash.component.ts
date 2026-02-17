import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-petty-cash',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    TableModule,ButtonModule,InputTextModule
  ],
  templateUrl: './petty-cash.component.html',
  styleUrls: ['./petty-cash.component.css']
})
export class PettyCashComponent implements OnInit {

  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  today: Date = new Date();

  // Payment Mode
  paymentMode: 'CASH' | 'BANK' = 'CASH';

  // Bank Instrument Type
  bankType: 'CHEQUE' | 'ONLINE' | 'DEBIT' | 'CREDIT' = 'CHEQUE';

  // GST / TDS toggles
  gstEnabled: boolean = false;
  tdsEnabled: boolean = false;

  // Data Lists (Initially Empty)
  paymentslist1: any[] = [];
  partyjournalentrylist: any[] = [];

  // Reactive Forms
  paymentVoucherForm!: FormGroup;
  journalform!: FormGroup;

  constructor(private fb: FormBuilder) {

    this.dpConfig.maxDate = new Date();
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MMM-YYYY';
    this.dpConfig.showWeekNumbers = false;
  }

  ngOnInit(): void {

    this.paymentVoucherForm = this.fb.group({
      todate: [this.today],

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

      pnarration: [''],
      pDocStorePath: [''],

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
      })
    });

    this.journalform = this.fb.group({});
  }

  // -------------------------
  // Payment Mode Handling
  // -------------------------

  setPaymentMode(mode: 'CASH' | 'BANK') {
    this.paymentMode = mode;
    if (mode === 'BANK') {
      this.bankType = 'CHEQUE';
    }
  }

  setBankType(type: 'CHEQUE' | 'ONLINE' | 'DEBIT' | 'CREDIT') {
    this.bankType = type;
  }

  // -------------------------
  // GST / TDS Toggles
  // -------------------------

  isgstapplicable_Checked() {
    this.gstEnabled = !this.gstEnabled;
    this.claculategsttdsamounts();
  }

  istdsapplicable_Checked() {
    this.tdsEnabled = !this.tdsEnabled;
    this.claculategsttdsamounts();
  }

  // -------------------------
  // GST / TDS Calculation
  // -------------------------

  claculategsttdsamounts() {

    const baseAmount = 0; // Replace with actual amount control when available

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

  // -------------------------
  // Clear Form
  // -------------------------

  clearPaymentDetails() {

    this.paymentVoucherForm.reset({
      todate: this.today,
      pisgstapplicable: false,
      pgstcalculationtype: 'INCLUDE',
      pgstpercentage: 0,
      pgstamount: 0,
      pistdsapplicable: false,
      ptdscalculationtype: 'INCLUDE',
      pTdsPercentage: 0,
      ptdsamount: 0,
      pnarration: '',
      pDocStorePath: ''
    });

    this.gstEnabled = false;
    this.tdsEnabled = false;
  }

  // -------------------------
  // Placeholder Methods
  // -------------------------

  addPaymentDetails() {
    // Implement actual add logic here
  }

  savePaymentVoucher() {
    // Implement actual save logic here
  }

  removeHandler(rowIndex: number) {
    this.paymentslist1.splice(rowIndex, 1);
  }

  saveJournalVoucher() {
    // Implement journal save logic
  }

  clearPaymentVoucher() {
    this.paymentVoucherForm.reset();
  }

  uploadAndProgress(event: any) {
    // Implement file upload logic
  }

}
