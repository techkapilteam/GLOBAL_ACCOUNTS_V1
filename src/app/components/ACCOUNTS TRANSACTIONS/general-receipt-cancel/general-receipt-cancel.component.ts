import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-general-receipt-cancel',
  standalone: true,
  templateUrl: './general-receipt-cancel.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    BsDatepickerModule,
    TableModule
  ]
})
export class GeneralReceiptCancelComponent implements OnInit {

  GeneralReceiptCancelForm!: FormGroup;

  show = false;
  disablesavebutton = false;
  ButtonType = 'Save';

  lblcontact = '';
  lblreceiptdate: any = null;
  lblnarration = '';
  lblmodeoftransaction = '';
  lblemployee = '';
  currencysymbol = '₹';

  // 🔹 Dummy receipt dropdown data
  receiptdata: any[] = [
    {
      payment_number: 'GR-001',
      tbl_trans_pettycash_voucher_id: 1
    },
    {
      payment_number: 'GR-002',
      tbl_trans_pettycash_voucher_id: 2
    }
  ];

  // 🔹 Dummy authorised-by list
  authorizedbylist!: Observable<any[]>;

  // 🔹 Dummy grid data
  generealreceiptdata: any[] = [];

  pageCriteria = {
    pageSize: 10,
    offset: 0,
    totalrows: 0
  };

  dpConfig = {
    dateInputFormat: 'DD/MMM/YYYY',
    showWeekNumbers: false
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();

    // Dummy authorised-by observable
    this.authorizedbylist = of([
      { subintroducedid: 1, subintroducedname: 'Manager One' },
      { subintroducedid: 2, subintroducedname: 'Manager Two' }
    ]);
  }

  private createForm(): void {
    this.GeneralReceiptCancelForm = this.fb.group({
      receiptid: [null, Validators.required],
      ppaymentdate: [{ value: new Date(), disabled: true }, Validators.required],
      cancellationreason: ['', Validators.required],
      autorizedcontactid: [null, Validators.required]
    });
  }

  Show(): void {

    if (this.GeneralReceiptCancelForm.get('receiptid')?.invalid) {
      this.GeneralReceiptCancelForm.get('receiptid')?.markAsTouched();
      return;
    }

    this.show = true;

    // 🔹 Bind dummy header + grid data
    this.bindDummyReceiptData();
  }

  // 🔹 Dummy receipt details (exactly matching HTML bindings)
  private bindDummyReceiptData(): void {

    this.lblcontact = 'Dummy Customer';
    this.lblreceiptdate = new Date();
    this.lblnarration = 'Dummy receipt narration';
    this.lblmodeoftransaction = 'Cash';
    this.lblemployee = 'Dummy Employee';

    this.generealreceiptdata = [
      {
        parentaccountname: 'Sales Account',
        totalreceivedamount: 3000
      },
      {
        parentaccountname: 'Service Charges',
        totalreceivedamount: 1500
      },
      {
        parentaccountname: 'Tax',
        totalreceivedamount: 500
      }
    ];

    this.pageCriteria.totalrows = this.generealreceiptdata.length;
  }

  Save(): void {

    if (this.GeneralReceiptCancelForm.invalid) {
      this.GeneralReceiptCancelForm.markAllAsTouched();
      return;
    }

    this.disablesavebutton = true;
    this.ButtonType = 'Processing';

    const payload = this.GeneralReceiptCancelForm.getRawValue();
    console.log('Dummy Save Payload:', payload);

    setTimeout(() => {
      alert('Receipt cancelled successfully (Dummy)');
      this.resetForm();
      this.disablesavebutton = false;
      this.ButtonType = 'Save';
    }, 1000);
  }

  Cancel(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.GeneralReceiptCancelForm.reset({
      receiptid: null,
      ppaymentdate: new Date(),
      cancellationreason: '',
      autorizedcontactid: null
    });

    this.generealreceiptdata = [];
    this.pageCriteria.totalrows = 0;
    this.show = false;
  }

  onPrimePageChange(event: any): void {
    this.pageCriteria.offset = event.first / event.rows;
    this.pageCriteria.pageSize = event.rows;
  }
}