// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-general-receipt-new',
//   standalone: true,
//   imports: [ReactiveFormsModule],
//   templateUrl: './general-receipt-new.component.html',
//   styleUrls: ['./general-receipt-new.component.css']
// })
// export class GeneralReceiptNewComponent implements OnInit {

//   generalReceiptForm!: FormGroup;

//   today = new Date().toISOString().substring(0, 10);
//   today1 = new Date();

//   paymentMode: 'CASH' | 'BANK' = 'CASH';
//   bankType: 'CHEQUE' | 'ONLINE' | 'DEBIT' | 'CREDIT' = 'CHEQUE';

//   gstEnabled = false;
//   tdsEnabled = false;
// savebutton!:'Save';
//   paymentslist1: any[] = [];
//   partyjournalentrylist: any[]= [];

//   payment = {
//     amountPaid: 0
//   };

//   constructor(private fb: FormBuilder) {}

//   ngOnInit(): void {
//     this.buildForm();
//   }

//   // ---------------- FORM ----------------
//   buildForm() {
//     this.generalReceiptForm = this.fb.group({
//       pisgstapplicable: false,
//       pistdsapplicable: false,

//       pgstcalculationtype: 'INCLUDE',
//       ptdscalculationtype: 'INCLUDE',

//       pStateId: '',
//       pgstno: '',
//       pgstpercentage: 0,

//       pgstamount: 0,
//       pigstpercentage: 0,
//       pigstamount: 0,
//       pcgstpercentage: 0,
//       pcgstamount: 0,
//       psgstpercentage: 0,
//       psgstamount: 0,
//       putgstpercentage: 0,
//       putgstamount: 0,

//       pTdsSection: '',
//       pTdsPercentage: 0,
//       ptdsamount: 0
//     });
//   }

//   // ---------------- PAYMENT MODE ----------------
//   setPaymentMode(mode: 'CASH' | 'BANK') {
//     this.paymentMode = mode;
//   }

//   setBankType(type: 'CHEQUE' | 'ONLINE' | 'DEBIT' | 'CREDIT') {
//     this.bankType = type;
//   }

//   // ---------------- GST ----------------
//   isgstapplicable_Checked() {
//     this.gstEnabled = this.generalReceiptForm.get('pisgstapplicable')?.value;
//     this.claculategsttdsamounts();
//   }

//   // ---------------- TDS ----------------
//   istdsapplicable_Checked() {
//     this.tdsEnabled = this.generalReceiptForm.get('pistdsapplicable')?.value;
//     this.claculategsttdsamounts();
//   }

//   // ---------------- CALCULATIONS ----------------
//   claculategsttdsamounts() {
//     const amount = Number(this.payment.amountPaid) || 0;

//     // GST
//     if (this.gstEnabled) {
//       const gstPercent = Number(this.generalReceiptForm.get('pgstpercentage')?.value || 0);
//       const gstAmount = (amount * gstPercent) / 100;

//       this.generalReceiptForm.patchValue({
//         pgstamount: gstAmount,
//         pigstpercentage: gstPercent,
//         pigstamount: gstAmount,
//         pcgstpercentage: gstPercent / 2,
//         pcgstamount: gstAmount / 2,
//         psgstpercentage: gstPercent / 2,
//         psgstamount: gstAmount / 2,
//         putgstpercentage: 0,
//         putgstamount: 0
//       });
//     } else {
//       this.resetGst();
//     }

//     // TDS
//     if (this.tdsEnabled) {
//       const tdsPercent = Number(this.generalReceiptForm.get('pTdsPercentage')?.value || 0);
//       const tdsAmount = (amount * tdsPercent) / 100;

//       this.generalReceiptForm.patchValue({
//         ptdsamount: tdsAmount
//       });
//     } else {
//       this.generalReceiptForm.patchValue({ ptdsamount: 0 });
//     }
//   }

//   resetGst() {
//     this.generalReceiptForm.patchValue({
//       pgstamount: 0,
//       pigstpercentage: 0,
//       pigstamount: 0,
//       pcgstpercentage: 0,
//       pcgstamount: 0,
//       psgstpercentage: 0,
//       psgstamount: 0,
//       putgstpercentage: 0,
//       putgstamount: 0
//     });
//   }

//   // ---------------- ACTIONS ----------------
//   addPaymentDetails() {
//     const formValue = this.generalReceiptForm.value;

//     const row = {
//       ppartyname: 'Party A',
//       pledgername: 'Ledger A',
//       psubledgername: 'Sub Ledger A',
//       pamount: this.payment.amountPaid,
//       ptotalamount:
//         this.payment.amountPaid +
//         formValue.pgstamount -
//         formValue.ptdsamount,
//       pgstcalculationtype: this.gstEnabled
//         ? formValue.pgstcalculationtype
//         : '',
//       pgstpercentage: formValue.pgstpercentage,
//       pTdsSection: this.tdsEnabled ? formValue.pTdsSection : '',
//       ptdsamount: formValue.ptdsamount
//     };

//     this.paymentslist1 = [...this.paymentslist1, row];

//     this.updateJournalEntries();
//     this.clearPaymentDetails();
//   }

//   clearPaymentDetails() {
//     this.generalReceiptForm.reset({
//       pisgstapplicable: false,
//       pistdsapplicable: false,
//       pgstcalculationtype: 'INCLUDE',
//       ptdscalculationtype: 'INCLUDE',
//       pgstpercentage: 0,
//       pTdsPercentage: 0
//     });

//     this.gstEnabled = false;
//     this.tdsEnabled = false;
//     this.payment.amountPaid = 0;
//   }

//   removeHandler(index: number) {
//     this.paymentslist1.splice(index, 1);
//     this.updateJournalEntries();
//   }

//   // ---------------- JOURNAL ENTRY ----------------
//   updateJournalEntries() {
//     let debit = 0;
//     let credit = 0;

//     this.paymentslist1.forEach(p => {
//       debit += Number(p.ptotalamount);
//       credit += Number(p.pamount);
//     });

//     this.partyjournalentrylist = [
//       { accountname: 'Cash / Bank', debitamount: debit, creditamount: 0 },
//       { accountname: 'Party', debitamount: 0, creditamount: credit }
//     ];
//   }
// }


import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-general-receipt-new',
 templateUrl: './general-receipt-new.component.html',
  styleUrls: ['./general-receipt-new.component.css'],
  imports: [CommonModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    BsDatepickerModule
  ],
  providers: [DecimalPipe]
})
export class GeneralReceiptNewComponent implements OnInit {
  
 public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  today:Date=new Date();
disablesavebutton:boolean=false;
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

  constructor(private fb: FormBuilder) {
      this.dpConfig.maxDate = new Date();
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MMM-YYYY';
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
  saveJournalVoucher(){
    alert('save succesfully');
  }
  clearPaymentVoucher(){}
uploadAndProgress($event:any){}
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
}
