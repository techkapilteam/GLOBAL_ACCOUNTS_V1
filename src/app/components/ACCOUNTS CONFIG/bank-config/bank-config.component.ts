import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

interface District {
  name: string;
  pincodes: string[];
}

interface State {
  name: string;
  districts: District[];
}

interface Country {
  name: string;
  states: State[];
}

@Component({
  selector: 'app-bank-config',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BsDatepickerModule
  ],
  templateUrl: './bank-config.component.html',
  styleUrl: './bank-config.component.css'
})
export class BankConfigComponent implements OnInit {

  bankmasterform!: FormGroup;

  banksList = [
    { pBankName: 'HDFC' },
    { pBankName: 'ICICI' },
    { pBankName: 'SBI' }
  ];

  upiname = [
    { pUpiname: 'PhonePe' },
    { pUpiname: 'GooglePay' },
    { pUpiname: 'Paytm' }
  ];

  debitcardhideandshow: boolean = false;
  bankupihideandshow: boolean = false;

  dpConfig: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-default',
    dateInputFormat: 'DD-MMM-YYYY'
  };

  countries: Country[] = [
    {
      name: 'India',
      states: [
        { name: 'Maharashtra', districts: [
            { name: 'Mumbai', pincodes: ['400001', '400002'] },
            { name: 'Pune', pincodes: ['411001', '411002'] },
            { name: 'Nagpur', pincodes: ['440001', '440002'] },
            { name: 'Nashik', pincodes: ['422001', '422002'] }
          ]
        },
        { name: 'Karnataka', districts: [
            { name: 'Bengaluru', pincodes: ['560001', '560002'] },
            { name: 'Mysuru', pincodes: ['570001', '570002'] },
            { name: 'Mangalore', pincodes: ['575001', '575002'] }
          ]
        },
        { name: 'Tamil Nadu', districts: [
            { name: 'Chennai', pincodes: ['600001', '600002'] },
            { name: 'Coimbatore', pincodes: ['641001', '641002'] },
            { name: 'Madurai', pincodes: ['625001', '625002'] }
          ]
        }
      ]
    },
    {
      name: 'United States',
      states: [
        { name: 'California', districts: [
            { name: 'Los Angeles County', pincodes: ['90001', '90002'] },
            { name: 'San Francisco County', pincodes: ['94101', '94102'] }
          ]
        },
        { name: 'Texas', districts: [
            { name: 'Harris County', pincodes: ['77001', '77002'] },
            { name: 'Dallas County', pincodes: ['75201', '75202'] }
          ]
        },
        { name: 'New York', districts: [
            { name: 'New York City', pincodes: ['10001', '10002'] },
            { name: 'Buffalo', pincodes: ['14201', '14202'] }
          ]
        }
      ]
    },
    {
      name: 'United Kingdom',
      states: [
        { name: 'England', districts: [
            { name: 'Greater London', pincodes: ['EC1A', 'SW1A'] },
            { name: 'Greater Manchester', pincodes: ['M1', 'M2'] }
          ]
        },
        { name: 'Scotland', districts: [
            { name: 'Glasgow', pincodes: ['G1', 'G2'] },
            { name: 'Edinburgh', pincodes: ['EH1', 'EH2'] }
          ]
        }
      ]
    },
    {
      name: 'Canada',
      states: [
        { name: 'Ontario', districts: [
            { name: 'Toronto', pincodes: ['M5H', 'M5J'] },
            { name: 'Ottawa', pincodes: ['K1A', 'K1P'] }
          ]
        },
        { name: 'British Columbia', districts: [
            { name: 'Vancouver', pincodes: ['V5K', 'V6B'] },
            { name: 'Victoria', pincodes: ['V8W', 'V8X'] }
          ]
        }
      ]
    },
    {
      name: 'Australia',
      states: [
        { name: 'New South Wales', districts: [
            { name: 'Sydney', pincodes: ['2000', '2001'] },
            { name: 'Newcastle', pincodes: ['2300', '2301'] }
          ]
        },
        { name: 'Victoria', districts: [
            { name: 'Melbourne', pincodes: ['3000', '3001'] },
            { name: 'Geelong', pincodes: ['3220', '3221'] }
          ]
        }
      ]
    },
    {
      name: 'Germany',
      states: [
        { name: 'Bavaria', districts: [
            { name: 'Munich', pincodes: ['80331', '80333'] },
            { name: 'Nuremberg', pincodes: ['90402', '90403'] }
          ]
        },
        { name: 'Berlin', districts: [
            { name: 'Berlin', pincodes: ['10115', '10117'] }
          ]
        }
      ]
    },
    {
      name: 'France',
      states: [
        { name: 'Île-de-France', districts: [
            { name: 'Paris', pincodes: ['75001', '75002'] },
            { name: 'Versailles', pincodes: ['78000', '78001'] }
          ]
        },
        { name: 'Provence-Alpes-Côte d\'Azur', districts: [
            { name: 'Marseille', pincodes: ['13001', '13002'] },
            { name: 'Nice', pincodes: ['06000', '06001'] }
          ]
        }
      ]
    },
    {
      name: 'Japan',
      states: [
        { name: 'Tokyo', districts: [
            { name: 'Chiyoda', pincodes: ['100-0001', '100-0002'] },
            { name: 'Shinjuku', pincodes: ['160-0001', '160-0002'] }
          ]
        },
        { name: 'Osaka', districts: [
            { name: 'Osaka City', pincodes: ['530-0001', '530-0002'] },
            { name: 'Sakai', pincodes: ['590-0001', '590-0002'] }
          ]
        }
      ]
    },
    {
      name: 'China',
      states: [
        { name: 'Guangdong', districts: [
            { name: 'Guangzhou', pincodes: ['510000', '510001'] },
            { name: 'Shenzhen', pincodes: ['518000', '518001'] }
          ]
        },
        { name: 'Beijing', districts: [
            { name: 'Beijing', pincodes: ['100000', '100001'] }
          ]
        }
      ]
    },
    {
      name: 'Russia',
      states: [
        { name: 'Moscow Oblast', districts: [
            { name: 'Moscow', pincodes: ['101000', '101001'] },
            { name: 'Zelenograd', pincodes: ['124000', '124001'] }
          ]
        },
        { name: 'Saint Petersburg', districts: [
            { name: 'Saint Petersburg', pincodes: ['190000', '190001'] }
          ]
        }
      ]
    },
    {
      name: 'South Africa',
      states: [
        { name: 'Gauteng', districts: [
            { name: 'Johannesburg', pincodes: ['2000', '2001'] },
            { name: 'Pretoria', pincodes: ['0001', '0002'] }
          ]
        },
        { name: 'Western Cape', districts: [
            { name: 'Cape Town', pincodes: ['8000', '8001'] },
            { name: 'Stellenbosch', pincodes: ['7600', '7601'] }
          ]
        }
      ]
    },
    {
      name: 'Singapore',
      states: [
        { name: 'Singapore', districts: [
            { name: 'Central', pincodes: ['018989', '018990'] },
            { name: 'West', pincodes: ['598000', '598001'] }
          ]
        }
      ]
    },
    {
      name: 'New Zealand',
      states: [
        { name: 'Auckland', districts: [
            { name: 'Auckland City', pincodes: ['1010', '1011'] },
            { name: 'North Shore', pincodes: ['0620', '0621'] }
          ]
        },
        { name: 'Wellington', districts: [
            { name: 'Wellington City', pincodes: ['6011', '6012'] }
          ]
        }
      ]
    },
    {
      name: 'UAE',
      states: [
        { name: 'Dubai', districts: [
            { name: 'Dubai Marina', pincodes: ['00000'] },
            { name: 'Deira', pincodes: ['00000'] }
          ]
        },
        { name: 'Abu Dhabi', districts: [
            { name: 'Abu Dhabi City', pincodes: ['00000'] }
          ]
        }
      ]
    },
    {
      name: 'Brazil',
      states: [
        { name: 'São Paulo', districts: [
            { name: 'São Paulo City', pincodes: ['01000-000', '01001-000'] },
            { name: 'Campinas', pincodes: ['13000-000', '13001-000'] }
          ]
        },
        { name: 'Rio de Janeiro', districts: [
            { name: 'Rio de Janeiro City', pincodes: ['20000-000', '20001-000'] }
          ]
        }
      ]
    },
    {
      name: 'Mexico',
      states: [
        { name: 'Mexico City', districts: [
            { name: 'Cuauhtémoc', pincodes: ['06000', '06001'] },
            { name: 'Coyoacán', pincodes: ['04000', '04001'] }
          ]
        },
        { name: 'Jalisco', districts: [
            { name: 'Guadalajara', pincodes: ['44100', '44101'] },
            { name: 'Puerto Vallarta', pincodes: ['48300', '48301'] }
          ]
        }
      ]
    }
  ];

  states: State[] = [];
  districts: District[] = [];
  pincodes: string[] = [];
  fb: any;

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

    this.bankmasterform.get('country')?.valueChanges.subscribe(country => {
      this.onCountryChange(country);
    });

    this.bankmasterform.get('state')?.valueChanges.subscribe(state => {
      this.onStateChange(state);
    });

    this.bankmasterform.get('district')?.valueChanges.subscribe(district => {
      this.onDistrictChange(district);
    });

    this.bankmasterform.get('pIsdebitcardapplicable')?.valueChanges.subscribe(val => {
      this.debitcardhideandshow = val;
      if (val) {
        this.bankmasterform.get('pCardNo')?.setValidators([Validators.required]);
        this.bankmasterform.get('pCardName')?.setValidators([Validators.required]);
      } else {
        this.bankmasterform.get('pCardNo')?.clearValidators();
        this.bankmasterform.get('pCardName')?.clearValidators();
      }
      this.bankmasterform.get('pCardNo')?.updateValueAndValidity();
      this.bankmasterform.get('pCardName')?.updateValueAndValidity();
    });

    this.bankmasterform.get('pIsupiapplicable')?.valueChanges.subscribe(val => {
      this.bankupihideandshow = val;
      if (val) {
        this.bankmasterform.get('pUpiid')?.setValidators([Validators.required]);
        this.bankmasterform.get('pUpiname')?.setValidators([Validators.required]);
      } else {
        this.bankmasterform.get('pUpiid')?.clearValidators();
        this.bankmasterform.get('pUpiname')?.clearValidators();
      }
      this.bankmasterform.get('pUpiid')?.updateValueAndValidity();
      this.bankmasterform.get('pUpiname')?.updateValueAndValidity();
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

  save() {
    if (this.bankmasterform.valid) {
      console.log('Form submitted', this.bankmasterform.value);
      alert('Form submitted successfully!');
    } else {
      this.markFormGroupTouched(this.bankmasterform);
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

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
