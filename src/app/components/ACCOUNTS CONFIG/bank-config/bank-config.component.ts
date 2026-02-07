import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

interface District { name: string; pincodes: string[]; }
interface State { name: string; districts: District[]; }
interface Country { name: string; states: State[]; }

import { IftaLabelModule } from 'primeng/iftalabel';
@Component({
  selector: 'app-bank-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './bank-config.component.html',
  styleUrls: ['./bank-config.component.css']
})
export class BankConfigComponent implements OnInit {

  bankmasterform!: FormGroup;

  banksList = [{ pBankName: 'HDFC' }, { pBankName: 'ICICI' }, { pBankName: 'SBI' }];
  upiname = [{ pUpiname: 'PhonePe' }, { pUpiname: 'GooglePay' }, { pUpiname: 'Paytm' }];

  debitcardhideandshow = false;
  bankupihideandshow = false;
  branchAddressExpanded = false;
  bankSetupExpanded = false;

  selectedBankStatus: 'isprimary' | 'isformanbank' | 'isforemanpaymentbank' | 'isintrestpaymentbank' | null = null;

  dpConfig: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-dark-blue',
    dateInputFormat: 'DD-MMM-YYYY',
    maxDate: new Date(),
    showWeekNumbers: false
  };

  countries: Country[] = [
    {
      name: 'India', states: [
        {
          name: 'Maharashtra', districts: [
            { name: 'Mumbai', pincodes: ['400001', '400002'] },
            { name: 'Pune', pincodes: ['411001', '411002'] }
          ]
        }
      ]
    }
  ];

  states: State[] = [];
  districts: District[] = [];
  pincodes: string[] = [];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.bankmasterform = this.fb.group({
      todate: [new Date(), Validators.required],
      pAcctountype: ['', Validators.required],
      pAccountnumber: ['', Validators.required],
      pBankname: ['', Validators.required],
      pAccountname: ['', Validators.required],
      pBankbranch: ['', Validators.required],
      pIfsccode: ['', Validators.required],
      pOverdraft: ['0.00', Validators.required],
      pOpeningBalance: ['0.00', Validators.required],
      pOpeningBalanceType: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      district: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
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

    this.bankmasterform.get('country')?.valueChanges.subscribe(c => this.onCountryChange(c));
    this.bankmasterform.get('state')?.valueChanges.subscribe(s => this.onStateChange(s));
    this.bankmasterform.get('district')?.valueChanges.subscribe(d => this.onDistrictChange(d));

    this.bankmasterform.get('pIsdebitcardapplicable')?.valueChanges.subscribe(val => {
      this.debitcardhideandshow = val;
    });

    this.bankmasterform.get('pIsupiapplicable')?.valueChanges.subscribe(val => {
      this.bankupihideandshow = val;
    });
  }

  onCountryChange(countryName: string) {
    const country = this.countries.find(c => c.name === countryName);
    this.states = country ? country.states : [];
    this.districts = [];
    this.pincodes = [];
    this.bankmasterform.patchValue({ state: '', district: '', pincode: '' });
  }

  onStateChange(stateName: string) {
    const state = this.states.find(s => s.name === stateName);
    this.districts = state ? state.districts : [];
    this.pincodes = [];
    this.bankmasterform.patchValue({ district: '', pincode: '' });
  }

  onDistrictChange(districtName: string) {
    const district = this.districts.find(d => d.name === districtName);
    this.pincodes = district ? district.pincodes : [];
    this.bankmasterform.patchValue({ pincode: this.pincodes[0] || '' });
  }

  toggleBranchAddress() {
    this.branchAddressExpanded = !this.branchAddressExpanded;
  }

  toggleBankSetup() {
    this.bankSetupExpanded = !this.bankSetupExpanded;
  }

  selectBankStatus(
    status: 'isprimary' | 'isformanbank' | 'isforemanpaymentbank' | 'isintrestpaymentbank',
    event: Event
  ) {
    event.stopPropagation();
    this.selectedBankStatus = this.selectedBankStatus === status ? null : status;
    this.bankmasterform.patchValue({
      isprimary: false,
      isformanbank: false,
      isforemanpaymentbank: false,
      isintrestpaymentbank: false
    });
    if (this.selectedBankStatus) {
      this.bankmasterform.patchValue({ [status]: true });
    }
  }

  save() {
    if (this.bankmasterform.valid) {
      console.log('Form submitted', this.bankmasterform.value);
      alert('Form submitted successfully!');
    } else {
      alert('Please fill all required fields.');
    }
  }

  clear() {
    this.bankmasterform.reset({
      todate: new Date(),
      pOverdraft: '0.00',
      pOpeningBalance: '0.00',
      pIsdebitcardapplicable: false,
      pIsupiapplicable: false
    });
  }
  
}
