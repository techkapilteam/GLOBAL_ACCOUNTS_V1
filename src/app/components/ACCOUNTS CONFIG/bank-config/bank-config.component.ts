import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

import { IftaLabelModule } from 'primeng/iftalabel';
@Component({
  selector: 'app-bank-config',

  imports: [FloatLabelModule, IftaLabelModule,InputTextModule, FormsModule],
  templateUrl: './bank-config.component.html',
  styleUrl: './bank-config.component.css'
})
export class BankConfigComponent {
value1: string | undefined;
value: string | undefined;
  bankmasterform!: FormGroup;

  loading: boolean = false;
  disablesavebutton: boolean = false;
  buttonname: string = 'Save';

  // Datepicker configs
  currentdate: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-default',
    dateInputFormat: 'DD/MM/YYYY'
  };
  dpConfig: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-default',
    dateInputFormat: 'MM/YY'
  };
  ddpConfig: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-default',
    dateInputFormat: 'MM/YY'
  };

  // Example dropdown data
  banksList = [{ pBankName: 'HDFC' }, { pBankName: 'ICICI' }, { pBankName: 'SBI' }];
  upiname = [{ pUpiname: 'PhonePe' }, { pUpiname: 'GooglePay' }, { pUpiname: 'Paytm' }];

  // Toggle sections
  debitcardhideandshow: boolean = false;
  bankupihideandshow: boolean = false;

  // Form validation messages
  bankmastervalidations: any = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.bankmasterform = this.fb.group({
      pBankdate: [new Date(), Validators.required],
      pAcctountype: ['', Validators.required],
      pAccountnumber: ['', Validators.required],
      pBankname: ['', Validators.required],
      pAccountname: ['', Validators.required],
      pBankbranch: [''],
      pIfsccode: [''],
      pOverdraft: ['0.00'],
      pOpeningBalance: ['0.00'],
      pOpeningBalanceType: [''],
      pIsdebitcardapplicable: [false],
      pCardNo: [''],
      pValidfrom: [new Date()],
      pValidto: [new Date()],
      pCardName: [''],
      pIsupiapplicable: [false],
      pUpiid: [''],
      pUpiname: [''],
      isprimary: [false],
      isformanbank: [false],
      isforemanpaymentbank: [false],
      isintrestpaymentbank: [false]
    });
  }

  save() {
    if (this.bankmasterform.valid) {
      console.log('Form submitted', this.bankmasterform.value);
      alert('Form submitted! Check console.');
    } else {
      this.markFormGroupTouched(this.bankmasterform);
      alert('Please fill all required fields.');
    }
  }

  clear() {
    this.bankmasterform.reset({
      pBankdate: new Date(),
      pValidfrom: new Date(),
      pValidto: new Date(),
      pOverdraft: '0.00',
      pOpeningBalance: '0.00',
      pIsdebitcardapplicable: false,
      pIsupiapplicable: false
    });
  }

  bankdebitcardchecked(event: any) {
    this.debitcardhideandshow = event.target.checked;
  }

  bankupichecked(event: any) {
    this.bankupihideandshow = event.target.checked;
  }

  bankchange(event: any, type: string) {
    console.log('Bank type changed:', type, event.target.checked);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}

