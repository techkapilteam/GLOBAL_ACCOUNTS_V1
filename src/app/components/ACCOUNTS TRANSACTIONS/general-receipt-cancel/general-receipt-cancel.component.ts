import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { GeneralReceiptCancelService } from '../../../services/Transactions/general-receipt-cancel.service';

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

  receiptdata: any[] = [];
  authorizedbylist!: Observable<any[]>;

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

  constructor(
    private fb: FormBuilder,
    private service: GeneralReceiptCancelService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.loadReceiptNumbers();
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

    const receiptId = this.GeneralReceiptCancelForm.value.receiptid;
    console.log('Selected Receipt ID:', receiptId);
  }

  loadReceiptNumbers(): void {
    this.service.getReceiptNumber().subscribe({
      next: (res: any) => this.receiptdata = res || [],
      error: (err: any) => console.error(err)
    });
  }

  getreceiptdata(receiptId: any): void {

    if (!receiptId) {
      this.generealreceiptdata = [];
      this.show = false;
      return;
    }

    // Always set current date
    this.GeneralReceiptCancelForm.patchValue({
      ppaymentdate: new Date()
    });

    this.service.getreceiptdata(receiptId).subscribe({
      next: (res: any) => {

        if (!res) return;

        this.lblcontact = res.contactname;
        this.lblreceiptdate = res.receiptdate;
        this.lblnarration = res.narration;
        this.lblmodeoftransaction = res.modeoftransaction;
        this.lblemployee = res.employee;

        this.generealreceiptdata = res.receiptDetails || [];
        this.pageCriteria.totalrows = this.generealreceiptdata.length;
      },
      error: (err: any) => console.error(err)
    });
  }

  Save(): void {

    if (this.GeneralReceiptCancelForm.invalid) {
      this.GeneralReceiptCancelForm.markAllAsTouched();
      return;
    }

    this.disablesavebutton = true;
    this.ButtonType = 'Processing';

    const payload = this.GeneralReceiptCancelForm.getRawValue();

    this.service.saveReceiptCancel(payload).subscribe({
      next: () => {
        alert('Receipt cancelled successfully');
        this.resetForm();
      },
      error: (err: any) => console.error(err),
      complete: () => {
        this.disablesavebutton = false;
        this.ButtonType = 'Save';
      }
    });
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
    this.show = false;
  }

  
  onPrimePageChange(event: any): void {
    this.pageCriteria.offset = event.first / event.rows;
    this.pageCriteria.pageSize = event.rows;
  }
}