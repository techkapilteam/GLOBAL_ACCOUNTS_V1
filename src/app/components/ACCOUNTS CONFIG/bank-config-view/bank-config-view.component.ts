import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bank-config-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    CurrencyPipe,
    RouterLink
  ],
  templateUrl: './bank-config-view.component.html',
  styleUrl: './bank-config-view.component.css'
})
export class BankConfigViewComponent implements OnInit {

  bankForm!: FormGroup;
  submitted = false;

  currencySymbol = '₹';

  gridView: any[] = [];

  pageCriteria = {
    pageSize: 10,
    footerPageHeight: 50
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.bankForm = this.fb.group({
      bankName: ['', Validators.required],
      accountNo: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{8,20}$')
      ]],
      accountName: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      accountStatus: ['', Validators.required],
      accountType: ['', Validators.required]
    });

    
    this.gridView = [
      {
        preceiptdate: 'HDFC Bank',
        preceiptid: '1234567890',
        pmodofreceipt: 'CASH',
        ptypeofpayment: '',
        pChequenumber: '',
        ptotalreceivedamount: 25000,
        pnarration: 'Savings Account'
      },
      {
        preceiptdate: 'ICICI Bank',
        preceiptid: '9876543210',
        pmodofreceipt: 'CHEQUE',
        ptypeofpayment: 'CHEQUE',
        pChequenumber: 'CHQ001',
        ptotalreceivedamount: 50000,
        pnarration: ''
      }
    ];
  }

  get f() {
    return this.bankForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.bankForm.invalid) {
      return;
    }

    console.log('Form Value:', this.bankForm.value);
  }

  onReset(): void {
    this.submitted = false;
    this.bankForm.reset();
  }

  filterDatatable(event: any): void {
    let value = event.target.value.toLowerCase();
    
    console.log('Filter:', value);
  }

  viewRow(): void {
    console.log('View row clicked');
  }
}
