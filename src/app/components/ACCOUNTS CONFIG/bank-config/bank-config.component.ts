import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { BsDatepickerModule, BsDatepickerConfig, BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';

// interface District { name: string; pincodes: string[]; }
// interface State { name: string; districts: District[]; }
// interface Country { name: string; states: State[]; }

import { IftaLabelModule } from 'primeng/iftalabel';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Router, RouterModule } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { AccountingMasterService } from '../../../services/accounting-master.service';
import { AddressComponent } from '../../../common/address/address/address.component';
import { TableModule } from 'primeng/table';
import { ValidationMessageComponent } from '../../../common/validation-message/validation-message.component';
import { routes } from '../../../app.routes';
import { Logger } from 'html2canvas/dist/types/core/logger';
@Component({
  selector: 'app-bank-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BsDatepickerModule, TableModule, ValidationMessageComponent, AddressComponent],
  templateUrl: './bank-config.component.html',
  styleUrls: ['./bank-config.component.css']
})
// export class BankConfigComponent implements OnInit {

//   bankmasterform!: FormGroup;

//   banksList = [{ pBankName: 'HDFC' }, { pBankName: 'ICICI' }, { pBankName: 'SBI' }];
//   upiname = [{ pUpiname: 'PhonePe' }, { pUpiname: 'GooglePay' }, { pUpiname: 'Paytm' }];

//   debitcardhideandshow = false;
//   bankupihideandshow = false;
//   branchAddressExpanded = false;
//   bankSetupExpanded = false;

//   selectedBankStatus: 'isprimary' | 'isformanbank' | 'isforemanpaymentbank' | 'isintrestpaymentbank' | null = null;

//   dpConfig: Partial<BsDatepickerConfig> = {
//     containerClass: 'theme-dark-blue',
//     dateInputFormat: 'DD-MMM-YYYY',
//     maxDate: new Date(),
//     showWeekNumbers: false
//   };

//   countries: Country[] = [
//     {
//       name: 'India', states: [
//         {
//           name: 'Maharashtra', districts: [
//             { name: 'Mumbai', pincodes: ['400001', '400002'] },
//             { name: 'Pune', pincodes: ['411001', '411002'] }
//           ]
//         }
//       ]
//     }
//   ];

//   states: State[] = [];
//   districts: District[] = [];
//   pincodes: string[] = [];

//   constructor(private fb: FormBuilder) { }

//   ngOnInit(): void {
//     this.bankmasterform = this.fb.group({
//       todate: [new Date(), Validators.required],
//       pAcctountype: ['', Validators.required],
//       pAccountnumber: ['', Validators.required],
//       pBankname: ['', Validators.required],
//       pAccountname: ['', Validators.required],
//       pBankbranch: ['', Validators.required],
//       pIfsccode: ['', Validators.required],
//       pOverdraft: ['0.00', Validators.required],
//       pOpeningBalance: ['0.00', Validators.required],
//       pOpeningBalanceType: ['', Validators.required],
//       address1: ['', Validators.required],
//       address2: [''],
//       city: ['', Validators.required],
//       country: ['', Validators.required],
//       state: ['', Validators.required],
//       district: ['', Validators.required],
//       pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
//       pIsdebitcardapplicable: [false],
//       pCardNo: [''],
//       pValidfrom: [new Date()],
//       pValidto: [new Date()],
//       pCardName: [''],
//       pIsupiapplicable: [false],
//       pUpiid: [''],
//       pUpiname: [''],
//       isprimary: [false],
//       isformanbank: [false],
//       isforemanpaymentbank: [false],
//       isintrestpaymentbank: [false]
//     });

//     this.bankmasterform.get('country')?.valueChanges.subscribe(c => this.onCountryChange(c));
//     this.bankmasterform.get('state')?.valueChanges.subscribe(s => this.onStateChange(s));
//     this.bankmasterform.get('district')?.valueChanges.subscribe(d => this.onDistrictChange(d));

//     this.bankmasterform.get('pIsdebitcardapplicable')?.valueChanges.subscribe(val => {
//       this.debitcardhideandshow = val;
//     });

//     this.bankmasterform.get('pIsupiapplicable')?.valueChanges.subscribe(val => {
//       this.bankupihideandshow = val;
//     });
//   }

//   onCountryChange(countryName: string) {
//     const country = this.countries.find(c => c.name === countryName);
//     this.states = country ? country.states : [];
//     this.districts = [];
//     this.pincodes = [];
//     this.bankmasterform.patchValue({ state: '', district: '', pincode: '' });
//   }

//   onStateChange(stateName: string) {
//     const state = this.states.find(s => s.name === stateName);
//     this.districts = state ? state.districts : [];
//     this.pincodes = [];
//     this.bankmasterform.patchValue({ district: '', pincode: '' });
//   }

//   onDistrictChange(districtName: string) {
//     const district = this.districts.find(d => d.name === districtName);
//     this.pincodes = district ? district.pincodes : [];
//     this.bankmasterform.patchValue({ pincode: this.pincodes[0] || '' });
//   }

//   toggleBranchAddress() {
//     this.branchAddressExpanded = !this.branchAddressExpanded;
//   }

//   toggleBankSetup() {
//     this.bankSetupExpanded = !this.bankSetupExpanded;
//   }

//   selectBankStatus(
//     status: 'isprimary' | 'isformanbank' | 'isforemanpaymentbank' | 'isintrestpaymentbank',
//     event: Event
//   ) {
//     event.stopPropagation();
//     this.selectedBankStatus = this.selectedBankStatus === status ? null : status;
//     this.bankmasterform.patchValue({
//       isprimary: false,
//       isformanbank: false,
//       isforemanpaymentbank: false,
//       isintrestpaymentbank: false
//     });
//     if (this.selectedBankStatus) {
//       this.bankmasterform.patchValue({ [status]: true });
//     }
//   }

//   save() {
//     if (this.bankmasterform.valid) {
//       console.log('Form submitted', this.bankmasterform.value);
//       alert('Form submitted successfully!');
//     } else {
//       alert('Please fill all required fields.');
//     }
//   }

//   clear() {
//     this.bankmasterform.reset({
//       todate: new Date(),
//       pOverdraft: '0.00',
//       pOpeningBalance: '0.00',
//       pIsdebitcardapplicable: false,
//       pIsupiapplicable: false
//     });
//   }

// }


export class BankConfigComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding!: DataBindingDirective;
  // @ViewChild(AddressComponent, { static: false }) addressdetails;
  // @ViewChild(AddressComponent, { static: false }) addressdetails!: AddressComponent;
@ViewChild(AddressComponent) set addressdetails(comp: AddressComponent) {
  if (comp && this.datatobind?.[0]?.lstBankInformationAddressDTO?.length) {
    comp.editdata(this.datatobind[0].lstBankInformationAddressDTO, 'Bank');
  }
}

  AdresssDetailsForm: any;
  accuntnumber = false;
  bankname: any;
  upiname: any = []
  duplicateupi = "";
  duplicatebank = "";
  duplicatedebitcard = 0;
  duplicateaccountno = "";
  todate = false;
  openingbls: any;
  openingtype = false;
  submitted = false;
  public loading = false;
  buttonname = "Save"
  date: any;
  disable = false;
  debitcard: any;
  cardno = false;
  accountno = false;
  datatobind: any;
  editdata: any
  bankdetails: any
  public disablesavebutton = false;
  checkduplicate: any;
  validationforupigriddata = false;
  validationfordebitcarddetails = false;
  upigridvalidation = false;
  upisetup: any = {}
  addressvalid: any;
  bankmastervalidations: any = {};
  gridData: any = []
  banksList: any = [];
  debitcarddetails = false;
  bankupidetails = false;
  addressstatus!: false;
  buttontype: any;
  debitcardhideandshow: any;
  bankupihideandshow: any;
  isDebitCardOpen = false;
  precordid1 = 1;
  isUpiOpen = false;
  bankOpen = false;

  isPrimaryBank = false;
  isForemanBank = false;
  isForemanPaymentBank = false;
  isInterestPaymentBank = false;
  // bankupihideandshow = false;
  // debitcardhideandshow= false;
  public gridState: State = {
    sort: [],
    take: 10
  };
  isBranchOpen: boolean = false;

  banksetup: boolean = false
  Primary: boolean = false
  ForemanBank: boolean = false
  ForemanPaymentBank: boolean = false
  IntrestPaymentBank: boolean = false
  public pageSize = 2;
  public skip = 0;
  bankmasterform!: FormGroup
  public currentdate: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public ddpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  minMode: BsDatepickerViewMode = 'month';
  constructor(private fb: FormBuilder, private router: Router,
    private _commonService: CommonService,
    private datepipe: DatePipe, private _accountingmasterserive: AccountingMasterService) {
    this.dpConfig = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      dateInputFormat: "MM/YYYY",
      maxDate: new Date(),
      showWeekNumbers: false,
      minMode: this.minMode
    });

    this.ddpConfig = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      dateInputFormat: "MM/YYYY",
      minDate: new Date(),
      showWeekNumbers: false,
      minMode: this.minMode
    });


    //  this.dpConfig.containerClass = 'theme-dark-blue';
    //  this.dpConfig.showWeekNumbers = false;

    //  this.dpConfig.maxDate = new Date();
    //this.dpConfig.minDate = new Date();
    // this.dpConfig.dateInputFormat = 'MM/YYYY'

    // this.ddpConfig.containerClass = 'theme-dark-blue';
    // this.ddpConfig.showWeekNumbers = false;
    //this.ddpConfig.maxDate = new Date();
    // this.ddpConfig.minDate = new Date();
    // this.ddpConfig.dateInputFormat = 'MM/YYYY'
  }
  public onOpenCalendar(container: any) {
    debugger;
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }
  ngOnInit() {

    this.bankupihideandshow = false;
    this.debitcardhideandshow = false;
    this.bankmasterform = this.fb.group
      ({
        pCreatedby: [this._commonService.getCreatedBy()],
        pBankdate: [''],
        // pAcctountype: ['', Validators.required],
        pAcctountype: [null, Validators.required],
        pBankID: [''],
        // bankName: ['', Validators.required],
        bankName: [null, Validators.required],

        pBankbranch: [''],
        // pAccountnumber: ['', Validators.required],
        pAccountnumber: ['', [Validators.required, Validators.pattern("^[0-9]{9,18}$")]],
        pIfsccode: [''],
        account_name: ['', Validators.required],
        // pAccountname: ['', Validators.required],
        // pOverdraft: [''],
        // pOpeningBalance: [''],
        // pOpeningBalanceType: [''],

         pOverdraft: [0, [Validators.pattern(/^\d*(\.\d{0,2})?$/)]],
  pOpeningBalance: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
  //         pOverdraft: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{0,2})?$/)]],
  // pOpeningBalance: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{0,2})?$/)]],
  pOpeningBalanceType: ['', Validators.required],
        pRecordid: ['0'],
        pStatusname: ['Active'],
        ptypeofoperation: ['CREATE'],
          pCardNo: ['', [
    Validators.required,
    Validators.minLength(16),
    Validators.maxLength(16),
    Validators.pattern('^[0-9]+$') // digits only
  ]],
        // pCardNo: [],
        pIsdebitcardapplicable: [false],
        pCardName: [''],
        pValidfrom: [''],
        pValidto: [''],
        pUpiid: [''],
        // pUpiname: [''],
        upiname: [''],
        popeningjvno: [''],
        pIsupiapplicable: [false],
        pAddress1: [''],
        pAddress2: [''],
        pCity: [''],
        pState: [''],
        pDistrict: [''],
        //pBankId: [''],
        pPincode: [''],
        pCountry: [''],
        lstBankdebitcarddtlsDTO: this.fb.array([]),
        lstBankUPI: [],
        branchSchema: [this._commonService.getschemaname()],
        pipaddress: [this._commonService.getIpAddress()],

        //lstChequemanagement :this.fb.array([]),
        lstBankInformationAddressDTO: this.fb.array([]),
        isprimary: [false],
        isformanbank: [false],
        isforemanpaymentbank: [false],
        isintrestpaymentbank: [false]
      })
    let containerClass = this._commonService.datePickerPropertiesSetup('containerClass');
    let dateInputFormat = this._commonService.datePickerPropertiesSetup('dateInputFormat');
    let showWeekNumbers = this._commonService.datePickerPropertiesSetup('showWeekNumbers');
    // this.currentdate = Object.assign({}, {
    //   containerClass: containerClass,
    //   dateInputFormat: dateInputFormat,
    //   maxDate: new Date(),
    //   showWeekNumbers: showWeekNumbers
    // });

    this.currentdate.maxDate = new Date();
    this.currentdate.containerClass = 'theme-dark-blue';
    this.currentdate.dateInputFormat = 'DD-MM-YYYY';
    this.currentdate.showWeekNumbers = false;


    this.date = new Date();
    this.bankmasterform['controls']['pBankdate'].setValue(this.date);
    this.bankmasterform['controls']['pOpeningBalanceType'].setValue('D')
    this.BlurEventAllControll(this.bankmasterform)
    // this._accountingmasterserive.GetBankUPIDetails().subscribe(data => {
    //   debugger;
    //   this.upiname = data
    // })

    this._accountingmasterserive.GetBankUPIDetails(
      this._commonService.getschemaname(),
      this._commonService.getBranchCode(),
      this._commonService.getCompanyCode(),

    )
      .subscribe({
        next: (res: any) => {
          // bankName
          console.log('data', res);

          this.upiname = res;

          console.log('SUCCESS:', res);

        },
        error: (err: any) => {
          console.log('ERROR:', err);
          alert('API Error');
        }
      });
    debugger;
    this._accountingmasterserive.GetGlobalBanks(

      this._commonService.getschemaname(),
    )
      .subscribe({
        next: (res: any) => {
          // bankName
          console.log('data', res);

          this.banksList = res;

          console.log('SUCCESS:', res);

        },
        error: (err: any) => {
          console.log('ERROR:', err);
          alert('API Error');
        }
      });



    this.buttontype = this._accountingmasterserive.newstatus();
    //console.log(this.buttontype)

    if (this.buttontype == "edit") {
      debugger;
      this.editdata = this._accountingmasterserive.editbankdetails();
      this.bankdetails = this._accountingmasterserive.editbankdetails1();
      console.log('bank', this.bankdetails)
      this.loading = true;
      this._accountingmasterserive.viewbank(this.editdata,
        this._commonService.getschemaname(),
        this._commonService.getbranchname(),
        this._commonService.getCompanyCode(),
        this._commonService.getBranchCode()

      ).subscribe(data => {
        debugger;
        console.log('datatobind', data)

        this.datatobind = data
        this.buttonname = "Update"
        this.disable = true;
        this.loading = false;
        // this.bankmasterform.controls['pBankdate'].setValue(this._commonService.getDateObjectFromDataBase(this.datatobind.bank_date))
        this.bankmasterform.controls['pBankdate'].setValue(this._commonService.getDateObjectFromDataBase(this.datatobind[0].pBankdate))
        console.log('DATE', this.datatobind[0].pBankdate);

        // this.bankmasterform.controls['pBankID'].setValue(this.datatobind.pBankID)
        // this.bankmasterform.controls['pBankID'].setValue(this.datatobind.pBankID)
        this.bankmasterform.controls['isprimary'].setValue(this.bankdetails.isprimary)
        this.bankmasterform.controls['isformanbank'].setValue(this.bankdetails.isformanbank)
        this.bankmasterform.controls['isintrestpaymentbank'].setValue(this.bankdetails.is_interest_payment_bank)
        this.bankmasterform.controls['isforemanpaymentbank'].setValue(this.bankdetails.is_foreman_payment_bank)
        if (this.bankdetails.isprimary || this.bankdetails.isformanbank || this.bankdetails.is_interest_payment_bank || this.bankdetails.is_foreman_payment_bank) {
          this.banksetup = true
        }

        this.bankmasterform.controls['bankName'].setValue(this.datatobind[0].pBankname)
        this.bankmasterform.controls['pBankbranch'].setValue(this.datatobind[0].pBankbranch)
        this.bankmasterform.controls['pRecordid'].setValue(this.datatobind[0].pRecordid);
        if (this.datatobind[0].pAccountnumber != '' && this.datatobind[0].pAccountnumber!= null) {
          this.accountno = true;
          this.bankmasterform.controls['pAccountnumber'].setValue(this.datatobind[0].pAccountnumber)
        }
        else {
          this.bankmasterform.controls['pAccountnumber'].setValue('')
        }
        this.bankmasterform.controls['pAccountnumber'].setValue(this.datatobind[0].pAccountnumber)

        this.bankmasterform.controls['pIfsccode'].setValue(this.datatobind[0].pIfsccode)
        // this.bankmasterform.controls['pAccountname'].setValue(this.datatobind.pAccountname)
        this.bankmasterform.controls['account_name'].setValue(this.datatobind[0].pAccountnumber)
        this.bankmasterform.controls['ptypeofoperation'].setValue("UPDATE");
        this.bankmasterform.controls['pOverdraft'].setValue(this._commonService.currencyformat(this.datatobind[0].pOverdraft))
        this.bankmasterform.controls['pAcctountype'].setValue(this.datatobind[0].pAcctountype)
        this.bankmasterform.controls['pOpeningBalance'].setValue(this._commonService.currencyformat(this.datatobind[0].pOpeningBalance))
        this.bankmasterform.controls['popeningjvno'].setValue(this.datatobind[0].popeningjvno)
        if (this.datatobind[0].pOpeningBalanceType == "") {
          this.bankmasterform.controls['pOpeningBalanceType'].setValue('D')
        }
        else {
          this.bankmasterform.controls['pOpeningBalanceType'].setValue(this.datatobind[0].pOpeningBalanceType)
        }



        if (this.datatobind[0].pIsupiapplicable == true) {
          this.bankmasterform.controls['pIsupiapplicable'].setValue(this.datatobind[0].pIsupiapplicable)
          this.bankupihideandshow = true;
          this.bankupidetails = true;
          this.gridData = this.datatobind[0].lstBankUPI
        }

        if (this.datatobind[0].pIsdebitcardapplicable == true) {
          this.bankmasterform.controls['pIsdebitcardapplicable'].setValue(this.datatobind[0].pIsdebitcardapplicable)
          this.debitcardhideandshow = true
          this.debitcarddetails = true;
          console.log('databind 1', this.datatobind[0].lstBankdebitcarddtlsDTO);


          if (this.datatobind[0].lstBankdebitcarddtlsDTO.length > 0) {
            if (this.datatobind[0].lstBankdebitcarddtlsDTO.pCardNo != '' && this.datatobind[0].lstBankdebitcarddtlsDTO.pCardNo != null) {
              this.cardno = true;
              this.bankmasterform.controls['pCardNo'].patchValue(this.datatobind[0].lstBankdebitcarddtlsDTO.pCardNo)
            }
            else {
              this.bankmasterform.controls['pCardNo'].patchValue('')
            }
          }
          else {
            this.bankmasterform.controls['pCardNo'].patchValue('')
          }

          this.bankmasterform.controls['pCardName'].patchValue(this.datatobind[0].lstBankdebitcarddtlsDTO.pCardName)

          this.bankmasterform.controls['pValidfrom'].setValue(this._commonService.getDateObjectFromDataBase(this.datatobind[0].lstBankdebitcarddtlsDTO.pValidfrom))
          this.bankmasterform.controls['pValidto'].setValue(this._commonService.getDateObjectFromDataBase(this.datatobind[0].lstBankdebitcarddtlsDTO.pValidto))
          // this.bankmasterform.controls['pRecordid'].setValue(this.datatobind.lstBankdebitcarddtlsDTO[0].pRecordid);
        }
      if (this.datatobind[0].lstBankInformationAddressDTO?.length > 0){
        // if (this.datatobind[0].lstBankInformationAddressDTO != 0) {
          debugger;
          console.log('edit data', this.datatobind[0].lstBankInformationAddressDTO);

          this.addressdetails.editdata(this.datatobind[0].lstBankInformationAddressDTO, 'Bank')
        }
        //console.log(this.bankmasterform.value)
      })

    }
  }



// Prevent pasting invalid content
blockNonLettersPaste(event: ClipboardEvent) {
  const paste = event.clipboardData?.getData('text') || '';
  const regex = /^[a-zA-Z ]*$/;
  if (!regex.test(paste)) {
    event.preventDefault();
  }
}






lettersOnly(event: any) {
  event.target.value = event.target.value.replace(/[^a-zA-Z ]/g, '');
}



convertTitleCase(controlName: string) {
  const control = this.bankmasterform.get(controlName);
  const value = control?.value;

  if (value) {
    const titleCase = value
      .toLowerCase()
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    control?.setValue(titleCase);
  }
}

// Only allow numbers and dot
// allowNumbersOnly(event: KeyboardEvent) {
//   const charCode = event.which ? event.which : event.keyCode;
//   const input = event.target as HTMLInputElement;

//   // Allow digits (0-9), one dot, and control keys
//   if (
//     (charCode < 48 || charCode > 57) && // not 0-9
//     charCode !== 46 && // not dot
//     charCode !== 8 && // backspace
//     charCode !== 9 && // tab
//     charCode !== 37 && // left arrow
//     charCode !== 39 // right arrow
//   ) {
//     event.preventDefault();
//   }

//   // Prevent more than one dot
//   if (charCode === 46 && input.value.includes('.')) {
//     event.preventDefault();
//   }
// }

// // Prevent pasting letters or invalid characters
// blockNonNumericPaste(event: ClipboardEvent) {
//   const paste = event.clipboardData?.getData('text') || '';
//   const regex = /^\d*\.?\d*$/; // allow digits and optional single dot
//   if (!regex.test(paste)) {
//     event.preventDefault();
//   }
// }



// Allow only digits and one decimal point on typing



allowNumbersOnly(event: KeyboardEvent) {
  const charCode = event.which ? event.which : event.keyCode;
  const input = event.target as HTMLInputElement;

  // Allow digits (48-57), one dot (46), backspace (8), tab (9), left/right arrow (37/39)
  if (
    (charCode < 48 || charCode > 57) && // not 0-9
    charCode !== 46 && // not dot
    charCode !== 8 && // backspace
    charCode !== 9 && // tab
    charCode !== 37 && // left arrow
    charCode !== 39 // right arrow
  ) {
    event.preventDefault();
  }

  // Prevent entering more than one dot
  if (charCode === 46 && input.value.includes('.')) {
    event.preventDefault();
  }
}

// Prevent pasting non-numeric or badly formatted content
blockNonNumericPaste(event: ClipboardEvent) {
  const paste = event.clipboardData?.getData('text') || '';
  const regex = /^\d*\.?\d*$/; // digits with optional single dot
  if (!regex.test(paste)) {
    event.preventDefault();
  }
}

// Format input as currency with commas on every input
onInputChange(event: Event, controlName: string) {
  const input = event.target as HTMLInputElement;
  let value = input.value;

  // Remove all commas before processing
  value = value.replace(/,/g, '');

  // Validate number format: allow digits and at most one dot with up to 2 decimals
  if (!/^\d*\.?\d{0,2}$/.test(value)) {
    // Invalid format: remove last char
    value = value.slice(0, -1);
  }

  // Format integer part with commas
  const parts = value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Set formatted value back to input
  input.value = parts.join('.');

  // Update form control with unformatted value (no commas)
  this.bankmasterform.controls[controlName].setValue(value, { emitEvent: false });
}

// Format on blur to fixed 2 decimals with commas
onInputBlur(event: Event, controlName: string) {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/,/g, '');

  if (value === '') return;

  const num = parseFloat(value);
  if (!isNaN(num)) {
    input.value = num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    this.bankmasterform.controls[controlName].setValue(num.toFixed(2), { emitEvent: false });
  }
}


formatValueWithCommas(controlName: string) {
  const val = this.bankmasterform.controls[controlName].value;
  if (!val) return;

  // Remove commas (if any)
  const numStr = val.toString().replace(/,/g, '');

  const num = parseFloat(numStr);
  if (isNaN(num)) return;

  // Format with commas and 2 decimals
  const formatted = num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Update input field’s displayed value ONLY (without changing form control value)
  const el = document.getElementById(controlName) as HTMLInputElement;
  if (el) {
    el.value = formatted;
  }
}



  Bankdebitcarddtls() {
    return this.fb.group
      ({
        pCardNo: [''],
        pCardName: [''],
        pValidfrom: [''],
        pValidto: [''],
        pRecordid: [''],
        pStatusname: ['Active'],
        ptypeofoperation: ['CREATE'],
        pCreatedby: [this._commonService.getCreatedBy()],
      });

  }
  cardno_change() {
    this.bankmastervalidations['pCardNo'] = '';
  }
  name_change() {
    this.bankmastervalidations['pCardName'] = '';
  }
  BankInformationAddress() {
    return this.fb.group
      ({
        pAddress1: [''],
        pAddress2: [''],
        pCity: [''],
        pState: [''],
        pDistrict: [''],
        pPincode: [''],
        pCountry: [''],
        pRecordid: [''],

      })
  }
  bankdebitcardchecked(event: any) {
    debugger;
    this.bankmastervalidations = {}

    if (event.target.checked == true) {

      this.debitcarddetails = true;
      this.debitcardvalidation('GET');
      this.debitcardhideandshow = true
    }
    else {
      this.debitcardhideandshow = false;
      this.debitcarddetails = false;
      this.debitcardvalidation('SET');

    }
  }
  onChange(event: any) {
    debugger
    this.bankname = event.target.options[event.target.options.selectedIndex].text;
    console.log(this.bankname);
    this.bankmasterform.get('account_name')?.setValue(this.bankname);
    // this.bankmasterform.controls.['account_name'].setValue(this.bankname);
    // bankmastervalidations.pAccountname
    //console.log((this.banksList.filter((ele)=>{return ele.pBankName==this.bankmasterform.controls['pBankname'].value}))[0]['pBankId']);
  }

  // removeHandler(event: any) {

  //   this.gridData.splice(event.rowIndex, 1);
  // }
  removeHandler(row: any, rowIndex: number) {
    this.gridData.splice(rowIndex, 1);
    this.gridData = [...this.gridData]; // refresh table
  }

  upivalidation(type: any) {

    let pUpiid = <FormGroup>this.bankmasterform['controls']['pUpiid'];
    let pUpiname = <FormGroup>this.bankmasterform['controls']['upiname'];

    if (type == 'GET') {
      pUpiid.setValidators(Validators.required);
      pUpiname.setValidators(Validators.required);

    }
    else {
      pUpiid.clearValidators();
      pUpiname.clearValidators();

    }
    pUpiid.updateValueAndValidity();
    pUpiname.updateValueAndValidity();
  }
  debitcardvalidation(type: any) {


    let pCardNo = <FormGroup>this.bankmasterform['controls']['pCardNo'];
    let pCardName = <FormGroup>this.bankmasterform['controls']['pCardName'];
    //  let pValidfrom = <FormGroup>this.bankmasterform['controls']['pValidfrom'];
    //  let pValidto = <FormGroup>this.bankmasterform['controls']['pValidto'];
    if (type == 'GET') {
      pCardNo.setValidators(Validators.required);
      pCardName.setValidators(Validators.required);
      // pValidfrom.setValidators(Validators.required);
      // pValidto.setValidators(Validators.required);
    }
    else {
      pCardNo.setErrors(null);
      pCardNo.clearValidators();

      pCardName.setErrors(null);
      pCardName.clearValidators();
      // pValidfrom.clearValidators();
      // pValidto.clearValidators();
    }
    pCardNo.updateValueAndValidity();
    pCardName.updateValueAndValidity();
    // pValidfrom.updateValueAndValidity();
    // pValidto.updateValueAndValidity();
  }

  validateopeningbalancetype(type: any) {

    debugger
    let pOpeningBalanceType = <FormGroup>this.bankmasterform['controls']['pOpeningBalanceType'];

    if (type == "GET") {
      pOpeningBalanceType.setValidators(Validators.required)

    }
    else {
      pOpeningBalanceType.clearValidators();


    }
    pOpeningBalanceType.updateValueAndValidity();
  }


  bankupichecked(event: any) {
    this.bankmastervalidations = {}
    if (event.target.checked == true) {
      this.bankupidetails = true;
      this.bankupihideandshow = true;
      this.upivalidation('GET')
    }
    else {
      this.bankupidetails = false;
      this.bankupihideandshow = false;

    }
  }
  bankchange(eve: any, type: any) {
    if (eve.target.checked) {
      this.banksetup = true
      if (type == 'primary') {
        this.bankmasterform.controls['isprimary'].setValue(true)
        this.bankmasterform.controls['isformanbank'].setValue(false)
        this.bankmasterform.controls['isforemanpaymentbank'].setValue(false)
        this.bankmasterform.controls['isintrestpaymentbank'].setValue(false)
      }
      if (type == 'foreman') {
        this.bankmasterform.controls['isformanbank'].setValue(true)
        this.bankmasterform.controls['isprimary'].setValue(false)
        this.bankmasterform.controls['isforemanpaymentbank'].setValue(false)
        this.bankmasterform.controls['isintrestpaymentbank'].setValue(false)
      }
      if (type == 'foremanpayment') {
        this.bankmasterform.controls['isforemanpaymentbank'].setValue(true)
        this.bankmasterform.controls['isprimary'].setValue(false)
        this.bankmasterform.controls['isformanbank'].setValue(false)
        this.bankmasterform.controls['isintrestpaymentbank'].setValue(false)
      }
      if (type == 'intrest') {
        this.bankmasterform.controls['isintrestpaymentbank'].setValue(true)
        this.bankmasterform.controls['isforemanpaymentbank'].setValue(false)
        this.bankmasterform.controls['isprimary'].setValue(false)
        this.bankmasterform.controls['isformanbank'].setValue(false)
      }

    } else {
      // this.banksetup=false
      // this.bankmasterform.controls.isprimary.setValue(false)
      // this.bankmasterform.controls.isformanbank.setValue(false)
      // this.bankmasterform.controls.isforemanpaymentbank.setValue(false)
      // this.bankmasterform.controls.isintrestpaymentbank.setValue(false)
      if (type == 'primary') {
        this.bankmasterform.controls['isprimary'].setValue(false)
      }
      if (type == 'foreman') {
        this.bankmasterform.controls['isformanbank'].setValue(false)
      }
      if (type == 'foremanpayment') {
        this.bankmasterform.controls['isforemanpaymentbank'].setValue(false)
      }
      if (type == 'intrest') {
        this.bankmasterform.controls['isintrestpaymentbank'].setValue(false)
      }
      if (this.bankmasterform.controls['isprimary'].value || this.bankmasterform.controls['isformanbank'].value || this.bankmasterform.controls['isforemanpaymentbank'].value || this.bankmasterform.controls['isintrestpaymentbank'].value) {
        this.banksetup = true
      } else {
        this.banksetup = false
      }
    }
  }

  // addtogrid() {
  //   this.submitted = true
  //   debugger;
  //   if (this.validateupi()) {
  //     this.duplicateupi = this.bankmasterform.controls['pUpiid'].value
  //     this.upisetup['pUpiid'] = this.bankmasterform.controls['pUpiid'].value
  //     this.upisetup['pUpiname'] = this.bankmasterform.controls['pUpiname'].value
  //     this.upisetup['pCreatedby'] = this.bankmasterform.controls['pCreatedby'].value
  //     this.upisetup['pStatusname'] = this.bankmasterform.controls['pStatusname'].value
  //     this.upisetup['ptypeofoperation'] = "CREATE";
  //     this.gridData.push(this.upisetup);
  //     console.log(this.gridData);

  //     this.bankmasterform.controls['pUpiid'].setValue("");
  //     this.bankmasterform.controls['pUpiname'].setValue("");
  //     this.submitted = false;
  //     this.bankmastervalidations['pUpiname'] = "";
  //     this.bankmastervalidations['pUpiid'] = ""
  //     //this.getapi();

  //     this.upisetup = {}
  //   }
  // }
  // validateupi(): boolean {

  //   let isValid = true;

  //   if (this.bankmasterform.controls['pUpiid'].value == "") {
  //     this.upigridvalidation = true;
  //     this.bankmastervalidations['pUpiid'] = "Upi ID Required"
  //     isValid = false;
  //   }

  //   if (this.bankmasterform.controls['pUpiname'].value == "") {
  //     this.upigridvalidation = true;
  //     this.bankmastervalidations['pUpiname'] = "Upi Link with";
  //     isValid = false;
  //   }
  //   let upiiddata = this.gridData.filter((data: any) => {
  //     return data.pUpiid == this.bankmasterform.controls['pUpiid'].value;
  //   });

  //   if (upiiddata != null) {
  //     if (upiiddata.length > 0) {
  //       isValid = false;
  //     }
  //   }

  //   let upinamedata = this.gridData.filter((c: any) => c.pUpiname == this.bankmasterform.controls['pUpiname'].value)

  //   //let upinamedata = this.gridData.filter(data1 => {
  //   //  return data1.pUpiname == this.upisetup['pUpiname'];
  //   //});

  //   if (upinamedata != null) {
  //     if (upinamedata.length > 0) {
  //       isValid = false;
  //     }
  //   }

  //   this.upigridvalidation = false;


  //   return isValid
  // }


  addtogrid() {
    this.submitted = true;
    debugger;

    if (this.validateupi()) {

      const newUpi: any = {
        pUpiid: this.bankmasterform.value.pUpiid,
        pUpiname: this.bankmasterform.value.upiname,
        pCreatedby: this.bankmasterform.value.pCreatedby,
        // pStatusname: this.bankmasterform.value.pStatusname,
        pStatusname: this.bankmasterform.value.pIsupiapplicable,
        ptypeofoperation: "CREATE"
      };

      this.gridData.push(newUpi);
      console.log("Grid after add:", this.gridData);

      // clear form controls
      this.bankmasterform.patchValue({
        pUpiid: "",
        pUpiname: ""
      });

      this.submitted = false;
      this.bankmastervalidations.pUpiid = "";
      this.bankmastervalidations.pUpiname = "";

    }
  }

  validateupi(): boolean {
    let isValid = true;

    const upiid = this.bankmasterform.value.pUpiid;
    const upiname = this.bankmasterform.value.upiname;

    // required fields
    if (!upiid) {
      this.upigridvalidation = true;
      this.bankmastervalidations.pUpiid = "UPI ID Required";
      isValid = false;
    }

    if (!upiname) {
      this.upigridvalidation = true;
      this.bankmastervalidations.pUpiname = "UPI Link with Required";
      isValid = false;
    }

    // check duplicates
    const duplicateId = this.gridData.find((d: any) => d.pUpiid === upiid);
    if (duplicateId) {
      this.bankmastervalidations.pUpiid = "UPI ID already exists!";
      isValid = false;
    }

    const duplicateName = this.gridData.find((d: any) => d.pUpiname === upiname);
    if (duplicateName) {
      this.bankmastervalidations.pUpiname = "UPI Link already exists!";
      isValid = false;
    }

    this.upigridvalidation = !isValid;

    return isValid;
  }


  getapi() {
    return this.upisetup
  }
  checkValidations(group: FormGroup, isValid: boolean): boolean {

    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e: any) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    debugger;
    try {
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.bankmastervalidations[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            let control = document.getElementById(key);
            if (control != null) {
              lablename = (document.getElementById(key) as HTMLInputElement).title;
              let errormessage;
              for (const errorkey in formcontrol.errors) {
                if (errorkey) {
                  errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                  this.bankmastervalidations[key] += errormessage + ' ';
                  isValid = false;
                }
              }
            }
          }
        }
      }
    }
    catch (e: any) {
      this.showErrorMessage(e);
      //return false;
    }
    return isValid;
  }
  showErrorMessage(errormsg: string) {

    this._commonService.showErrorMessage(errormsg);
  }

  BlurEventAllControll(fromgroup: FormGroup): any {
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
    }
    catch (e: any) {
      this.showErrorMessage(e);
      return false;
    }
  }
  setBlurEvent(fromgroup: FormGroup, key: string): any {
    try {
      let formcontrol;
      formcontrol = fromgroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.BlurEventAllControll(formcontrol)
        }
        else {
          if (formcontrol.validator)
            fromgroup.get(key)?.valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
        }
      }
    }
    catch (e: any) {
      this.showErrorMessage(e);
      return false;
    }
  }

  clear() {


    this.disable = false;
    this.cardno = false;
    this.accountno = false;
    this.buttonname = "Save"
    this.buttontype = "new";
    this._accountingmasterserive.newformstatus(this.buttontype);
    this.bankmasterform.reset();
    this.addressdetails.clear();
    this.ngOnInit()
    this.debitcarddetails = false;
    this.bankupidetails = false;
    this.bankmastervalidations = {}
    this.gridData = []
    this.bankmasterform['controls']['pBankdate'].setValue(this.date);


  }
  // validatedatepicker(): boolean {

  //   let isValid = true;
  //   let from_date = this.datepipe.transform(this.bankmasterform.controls['pValidfrom'].value, 'yyyy-MM-dd');
  //   let to_date = this.datepipe.transform(this.bankmasterform.controls['pValidto'].value, 'yyyy-MM-dd');
  //   if (from_date > to_date) {
  //     this.todate = true;
  //     isValid = false;
  //   }
  //   else {
  //     this.todate = false;
  //   }

  //   return isValid
  // }
  validatedatepicker(): boolean {
    const fromValue = this.bankmasterform.get('pValidfrom')?.value;
    const toValue = this.bankmasterform.get('pValidto')?.value;

    if (!fromValue || !toValue) {
      // Either date is empty — consider invalid
      this.todate = true;
      return false;
    }

    const fromDate = new Date(fromValue);
    const toDate = new Date(toValue);

    if (fromDate > toDate) {
      this.todate = true;  // can be used in template to show error
      return false;
    }

    this.todate = false;
    return true;
  }


  save() {

      this.bankmasterform.markAllAsTouched();
  this.bankmasterform.updateValueAndValidity();

  if (this.bankmasterform.invalid) {
    this._commonService.showWarningMessage("Please fill all required fields");
    return;
  }

  debugger;
    
    this.AdresssDetailsForm = this.addressdetails.addressForm.value;


    this.upivalidation('')
    // let c = this._commonService.removeCommasForEntredNumber(this.bankmasterform.controls['pOpeningBalance'].value)

    // if (c > 0) {
    //   this.validateopeningbalancetype('GET')
    // }

    const openingBalanceStr = this.bankmasterform.get('pOpeningBalance')?.value || '';
    let c = Number(this._commonService.removeCommasForEntredNumber(openingBalanceStr));

    // Now you can safely compare
    if (c > 0) {
      this.validateopeningbalancetype('GET');
    }







    else {
      this.validateopeningbalancetype('SET')
    }

    let i = this.validatedatepicker()
    if (this.debitcarddetails == true && i == true) {
      this.validationfordebitcarddetails = true;
    }
    else {
      this.validationfordebitcarddetails = false;
    }
    let upistatus = true;
    if (this.bankmasterform.controls['pIsupiapplicable'].value == true && this.gridData.length == 0) {
      this.addtogrid();
      upistatus = false;
    }

    let isValid = true;
    if (this.checkValidations(this.bankmasterform, isValid) && upistatus) {
      let savetype = this.buttontype == 'edit' ? 'Update' : 'Save';
      let bankcount = 0
      if (this.banksetup) {
        if (this.bankmasterform.controls['isprimary'].value) {
          bankcount++
        }
        if (this.bankmasterform.controls['isforemanpaymentbank'].value) {
          bankcount++
        }
        if (this.bankmasterform.controls['isformanbank'].value) {
          bankcount++
        }
        if (this.bankmasterform.controls['isintrestpaymentbank'].value) {
          bankcount++
        }
        if (bankcount == 1) {
          if (confirm('Do You Want to ' + savetype + ' ?')) {
            // if (this.validationfordebitcarddetails == true) {
            //   let Chargescontrolbankdebitcard = <FormArray>this.bankmasterform.controls['lstBankdebitcarddtlsDTO'];
            //   Chargescontrolbankdebitcard.push(this.Bankdebitcarddtls());
            //   this.BlurEventAllControll(this.bankmasterform);


            //   this.bankmasterform['controls']['lstBankdebitcarddtlsDTO']['controls'][0].patchValue(this.bankmasterform.value);


            //           // this.bankmasterform.get('lstBankdebitcarddtlsDTO')?.value[0].patchValue(this.bankmasterform.value);

            //   // console.log(this.datatobind.lstBankdebitcarddtlsDTO[0].pRecordid)
            //   if (this.buttontype == "edit") {
            //     if (this.datatobind.lstBankdebitcarddtlsDTO.length > 0) {
            //       this.bankmasterform.value["lstBankdebitcarddtlsDTO"][0]["pRecordid"] = this.datatobind.lstBankdebitcarddtlsDTO[0].pRecordid
            //     }
            //   }

            // }


            if (this.validationfordebitcarddetails) {
              const debitCardsArray = this.bankmasterform.get('lstBankdebitcarddtlsDTO') as FormArray;

              debitCardsArray.push(this.Bankdebitcarddtls());

              this.BlurEventAllControll(this.bankmasterform);

              if (debitCardsArray.length > 0) {
                const firstCardGroup = debitCardsArray.at(0) as FormGroup;

                firstCardGroup.patchValue(this.bankmasterform.value);
              }

              if (this.buttontype === "edit") {
                if (this.datatobind.lstBankdebitcarddtlsDTO?.length > 0) {
                  const firstCardValue = debitCardsArray.at(0).value;
                  firstCardValue.pRecordid = this.datatobind.lstBankdebitcarddtlsDTO[0].pRecordid;

                  debitCardsArray.at(0).patchValue(firstCardValue);
                }
              }
            }

            // console.log(this.AdresssDetailsForm);
            if (this.AdresssDetailsForm['paddress1'] != "" || this.AdresssDetailsForm['paddress2'] != "" || this.AdresssDetailsForm['pcity'] != "" ||
              this.AdresssDetailsForm['pState'] != "" || this.AdresssDetailsForm['pDistrict'] != "" || this.AdresssDetailsForm['pCountry'] != ""
              || this.AdresssDetailsForm['Pincode'] != "") {
              debugger;
              let Chargescontrolbankadress = <FormArray>this.bankmasterform.controls['lstBankInformationAddressDTO'];
              Chargescontrolbankadress.push(this.BankInformationAddress());
              this.bankmasterform.value["lstBankInformationAddressDTO"][0]["pAddress1"] = this.AdresssDetailsForm['paddress1']
              this.bankmasterform.value["lstBankInformationAddressDTO"][0]["pAddress2"] = this.AdresssDetailsForm['paddress2']
              this.bankmasterform.value["lstBankInformationAddressDTO"][0]["pCity"] = this.AdresssDetailsForm['pcity']
              this.bankmasterform.value["lstBankInformationAddressDTO"][0]["pState"] = this.AdresssDetailsForm['pState']
              this.bankmasterform.value["lstBankInformationAddressDTO"][0]["pDistrict"] = this.AdresssDetailsForm['pDistrict']
              this.bankmasterform.value["lstBankInformationAddressDTO"][0]["pdistrictid"] = this.AdresssDetailsForm['pDistrictId']
              this.bankmasterform.value["lstBankInformationAddressDTO"][0]["pCountry"] = this.AdresssDetailsForm['pCountry']
              this.bankmasterform.value["lstBankInformationAddressDTO"][0]["pPincode"] = this.AdresssDetailsForm['Pincode']
              this.bankmasterform.value["lstBankInformationAddressDTO"][0]["pStatusname"] = this.bankmasterform.controls['pStatusname'].value
              this.bankmasterform.value["lstBankInformationAddressDTO"][0]["ptypeofoperation"] = this.bankmasterform.controls['ptypeofoperation'].value
              this.bankmasterform.value["lstBankInformationAddressDTO"][0]["pCreatedby"] = this.bankmasterform.controls['pCreatedby'].value;
              this.bankmasterform.value["lstBankInformationAddressDTO"][0]["pRecordid"] = this.AdresssDetailsForm['pRecordid']
              console.log(this.bankmasterform.value["lstBankInformationAddressDTO"][0])
            }

            if (this.bankmasterform.controls['pOverdraft'].value == "") {
              this.bankmasterform.controls['pOverdraft'].setValue(0);
            }
            else {

              let b = this._commonService.removeCommasForEntredNumber(this.bankmasterform.controls['pOverdraft'].value)

              this.bankmasterform.controls['pOverdraft'].setValue(b)

            }
            if (this.bankmasterform.controls['pOpeningBalance'].value == "") {
              this.bankmasterform.controls['pOpeningBalance'].setValue(0);
            }
            else {
              let a = this._commonService.removeCommasForEntredNumber(this.bankmasterform.controls['pOpeningBalance'].value)
              this.bankmasterform.controls['pOpeningBalance'].setValue(a)

            }

            //this.bankmasterform.controls.pBankdate.setValue(this._commonService.getFormatDate(this.bankmasterform.controls.pBankdate.value))

            this.bankmasterform['controls']['lstBankUPI'].setValue(this.gridData);
            //console.log(this.gridData);
            // this.bankmasterform.controls['pBankname'].setValue(this.captilizebank)
            //this.bankname=(this.banksList.filter((ele)=>{return ele.pBankId==this.bankmasterform.controls['pBankname'].value}))[0]["pBankName"];
            let bankid: object = (this.banksList.filter((ele: any) => { return ele.pBankName == this.bankmasterform.controls['pBankname'].value }))[0]['pBankId'];
            this.bankmasterform.controls['pBankID'].setValue(bankid);

            if (this.buttontype == "edit") {

              this.bankmasterform.controls['pRecordid'].setValue(this.datatobind.pRecordid)


            }

            let bankmasterdata = this.bankmasterform.value;
            bankmasterdata.pValidfrom = this._commonService.getFormatDateNormal(bankmasterdata.pValidfrom);
            bankmasterdata.pValidto = this._commonService.getFormatDateNormal(bankmasterdata.pValidto);

            bankmasterdata.pBankdate = this._commonService.getFormatDateNormal(bankmasterdata.pBankdate);
            bankmasterdata.lstBankdebitcarddtlsDTO.filter((x: any) => {
              x.pValidfrom = this._commonService.getFormatDateNormal(x.pValidfrom);
              x.pValidto = this._commonService.getFormatDateNormal(x.pValidto);
            });
            //console.log(bankmasterdata.lstBankdebitcarddtlsDTO);


            // let data = JSON.stringify(this.bankmasterform.value);
            let data = JSON.stringify(bankmasterdata);
            console.log(data)
            this._accountingmasterserive.GetCheckDuplicateDebitCardNo(data).subscribe(res => {

              debugger;
              if (res[0] == "TRUE") {
                this.disablesavebutton = true;
                this.buttonname = 'Processing';
                console.log(data)
                let temp = []
                let count = 0
                this._accountingmasterserive.getBankConfigurationdetails(this._commonService.getschemaname()).subscribe(json => {
                  console.log(json)
                  temp = json

                  temp.forEach((element: any) => {
                    if (this.bankmasterform.controls['isprimary'].value) {
                      if (element.isprimary) {
                        count++
                      }
                    }
                    if (this.bankmasterform.controls['isforemanpaymentbank'].value) {
                      if (element.isformanpaymentbank) {
                        count++
                      }
                    }
                    if (this.bankmasterform.controls['isformanbank'].value) {
                      if (element.isformanbank) {
                        count++
                      }
                    }
                    if (this.bankmasterform.controls['isintrestpaymentbank'].value) {
                      if (element.isinterestpaymentbank) {
                        count++
                      }
                    }
                  });
                  if (count == 0) {
                    this._accountingmasterserive.savebankinformation(data).subscribe(saveddata => {

                      //console.log(saveddata)
                      if (saveddata) {
                        this.disablesavebutton = false;
                        //this.router.navigateByUrl("/BankView")
                        this.router.navigate(['/configuration/BankViewComponent']);

                        this.bankmasterform.reset();
                        this.addressdetails.clear();
                        this.gridData = []
                        this.bankupihideandshow = false;
                        this.debitcardhideandshow = false;
                        this.bankmasterform['controls']['pBankdate'].setValue(this.date);
                        if (this.buttontype == "edit") {
                          this._commonService.showSuccessMsg("Updated Successfully");
                          this.clear();
                        }
                        else {
                          this._commonService.showSuccessMessage();
                          this.clear();
                        }

                      } else {
                        this.disablesavebutton = false;
                        this.buttonname = 'Save';
                      }
                    },
                      (error) => {
                        this._commonService.showErrorMessage(error);
                        this.disablesavebutton = false;
                      })
                  } else {
                    this._commonService.showWarningMessage('Selected Bank Setup is Already exist ,Select Another Bank Setup')
                    this.disablesavebutton = false;
                    this.buttonname = 'Save';
                  }
                })
              }
              else {
                debugger;
                res.forEach((element: any) => {
                  if (element == "B") {
                    this._commonService.showWarningMessage("Bank Already Exist");
                    //this._commonService.showWarningMessage("Bank Already Exist");
                  }
                  if (element == "D") {
                    this._commonService.showWarningMessage("Debit Card Already Exist");
                    // this._commonService.showWarningMessage("Debit Card Already Exist");
                  }
                  if (element == "U") {
                    this._commonService.showWarningMessage("UPI Id Already Exist");

                    // this._commonService.showWarningMessage("UPI Id Already Exist");
                  }
                });
                // if (res[0] == "B") {
                //     //this.toaster.info("Bank Already Exist")
                //     this._commonService.showInfoMessage("Bank Already Exist");
                //   }
                //   if (res[0] == "D") {
                //     //this.toaster.info("Debit Card Already Exist")
                //     this._commonService.showInfoMessage("Debit Card Already Exist");
                //   }
                //   if (res[1] == "U") {
                //    // this.toaster.info("UPI Id Already Exist")
                //     this._commonService.showInfoMessage("UPI Id Already Exist");
                //   }
              }
              // else if (res[0] == "Bank Already Exist") {
              //   this.toaster.info("Bank Already Exist")
              // }
              // else if (res[0] == "Debit Card Already Exist") {
              //   this.toaster.info("Debit Card Already Exist")
              // }
              // else if (res[0] == "UPI Id Already Exist") {
              //   this.toaster.info("UPI Id Already Exist")
              // }
            }, (error) => {
              this._commonService.showErrorMessage(error);
              this.disablesavebutton = false;

            })
            //

            let Chargescontrolbankdebitcard1 = <FormArray>this.bankmasterform.controls['lstBankdebitcarddtlsDTO'];
            for (let i = Chargescontrolbankdebitcard1.length - 1; i >= 0; i--) {
              Chargescontrolbankdebitcard1.removeAt(i)
            }
            let Chargescontrolbankadress1 = <FormArray>this.bankmasterform.controls['lstBankInformationAddressDTO'];
            for (let i = Chargescontrolbankadress1.length - 1; i >= 0; i--) {
              Chargescontrolbankadress1.removeAt(i)
            }
          }
        } else {
          this._commonService.showWarningMessage('Select only one Bank ')
        }
      } else {
        this._commonService.showWarningMessage('Select Bank Setup')
      }
    }


  }



  toggleBranch() {
    this.isBranchOpen = !this.isBranchOpen;
  }


  toggleDebitCard() {
    this.isDebitCardOpen = !this.isDebitCardOpen;
  }

  // bankdebitcardchecked(event: any) {
  //   this.debitcardhideandshow = event.target.checked;
  // }

  toggleUpi() {
    this.isUpiOpen = !this.isUpiOpen;
  }

  // bankupichecked(event: any) {
  //   this.bankupihideandshow = event.target.checked;
  // }

  toggleBank() {
    this.bankOpen = !this.bankOpen;
  }

  bankChange(event: any, type: string) {
    const checked = event.target.checked;

    switch (type) {
      case 'primary':
        this.isPrimaryBank = checked;
        break;
      case 'foreman':
        this.isForemanBank = checked;
        break;
      case 'foremanpayment':
        this.isForemanPaymentBank = checked;
        break;
      case 'interest':
        this.isInterestPaymentBank = checked;
        break;
    }
  }

}