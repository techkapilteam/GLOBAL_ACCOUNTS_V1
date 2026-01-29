import { Component, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule, BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';

@Pipe({ name: 'dateformat', standalone: true })
export class DateFormatPipe implements PipeTransform {
  transform(value: any): any {
    if (!value) return '';
    const date = new Date(value);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}

class PageCriteria {
  pageSize = 10;
  offset = 0;
  footerPageHeight = 50;
  pageNumber = 1;
  totalrows = 0;
  currentPageRows = 0;
}

@Component({
  selector: 'app-account-ledger',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxDatatableModule,
    BsDatepickerModule,
    DateFormatPipe
  ],
  templateUrl: './account-ledger.component.html'
})
export class AccountLedgerComponent implements OnInit {

  @ViewChild('fromDp', { static: false }) fromDp!: BsDatepickerDirective;
  @ViewChild('toDp', { static: false }) toDp!: BsDatepickerDirective;

  AccountLedger!: FormGroup;
  savebutton = 'Generate Report';
  Showhide = true;
  isNarrationChecked = false;

  dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  // ledgeraccountslist: any[] = [];
  // subledgeraccountslist: any[] = [];
  gridView: any[] = [];
  LedgerName: any = '';
  SubLedgerName: any = '';
  startDatesReport: any;
  endDatesReport: any;

  ledgeraccountslist = [
    {
      pledgerid: 1,
      pledgername: 'Cash Account'
    },
    {
      pledgerid: 2,
      pledgername: 'Bank Account'
    },
    {
      pledgerid: 3,
      pledgername: 'Sales Account',
    }
  ];
  subledgeraccountslist = [
    { psubledgerid: 11, psubledgername: 'Cash Sub 1', pledgerid: 1 },
    { psubledgerid: 12, psubledgername: 'Cash Sub 2', pledgerid: 1 },
    { psubledgerid: 21, psubledgername: 'Bank Sub 1', pledgerid: 2 },
    { psubledgerid: 22, psubledgername: 'Bank Sub 2', pledgerid: 2 },
    { psubledgerid: 31, psubledgername: 'Sales Sub 1', pledgerid: 3 },
    { psubledgerid: 32, psubledgername: 'Sales Sub 2', pledgerid: 3 }
  ];

  filtersubledgeraccountslist:any[]=[];

selectedLedger:any;
selectedsubledger:any;
  pageCriteria = new PageCriteria();
  LedgerValidationErrors: any = {};

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    const today = new Date();

    this.AccountLedger = this.fb.group({
      pledgerid: [null, Validators.required],
      pledgername: [''],
      psubledgerid: [null],
      psubledgername: [''],
      fromDate: [today, Validators.required],
      toDate: [today, Validators.required],
    });

    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      containerClass: 'theme-default',
      maxDate: today
    };

    this.dpConfig1 = {
      dateInputFormat: 'DD-MMM-YYYY',
      containerClass: 'theme-default',
      maxDate: today,
      minDate: today
    };

  }



 ledgerName_Change(pledgerid: number) {
  debugger
    this.filtersubledgeraccountslist = this.subledgeraccountslist.filter(
      s => s.pledgerid === pledgerid
    );
   
    this.selectedsubledger = null;
  }


  subledgerName_Change(event: any): void {
    const psubledgerid = event?.value;
    if (psubledgerid) {
      this.AccountLedger.controls['psubledgername'].setValue(event.label);
      this.SubLedgerName = event.label;
    }
  }
   

  FromDateChange(event: any) {
    this.dpConfig1.minDate = event;
    this.AccountLedger.controls['fromDate'].setValue(event);
  }

  ToDateChange(event: any) {
    this.AccountLedger.controls['toDate'].setValue(event);
  }

  checkValidations(group: FormGroup, isValid: boolean): boolean {
    Object.keys(group.controls).forEach((key: string) => {
      isValid = this.GetValidationByControl(group, key, isValid);
    });
    return isValid;
  }

  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    const formcontrol = formGroup.get(key);
    if (formcontrol && formcontrol.validator) {
      this.LedgerValidationErrors[key] = '';
      if (formcontrol.errors) {
        for (const errorkey in formcontrol.errors) {
          if (errorkey) {
            const lablename = (document.getElementById(key) as HTMLInputElement)?.title || key;
            const errormessage = `${lablename} is invalid`;
            this.LedgerValidationErrors[key] += errormessage + ' ';
            isValid = false;
          }
        }
      }
    }
    return isValid;
  }

  BlurEventAllControll(fromgroup: FormGroup) {
    Object.keys(fromgroup.controls).forEach((key: string) => {
      this.setBlurEvent(fromgroup, key);
    });
  }

  setBlurEvent(fromgroup: FormGroup, key: string) {
    const formcontrol = fromgroup.get(key);
    if (formcontrol && formcontrol.validator) {
      formcontrol.valueChanges.subscribe(() => {
        this.GetValidationByControl(fromgroup, key, true);
      });
    }
  }

  exportExcel(): void {
    console.log('Excel export (dummy)');
  }

  GenerateReport(): void {
    let isValid = true;
    if (!this.checkValidations(this.AccountLedger, isValid)) {
      return;
    }

    this.savebutton = 'Processing';
    this.Showhide = false;

    this.gridView = this.getDummyGridData();

    this.gridView.forEach(x => {
      if (x.pparticulars !== 'Opening Balance' && x.pdescription !== '') {
        x.pparticulars = this.isNarrationChecked
          ? `${x.pparticulars} (${x.pdescription})`
          : x.pparticulars;
      }
    });

    this.savebutton = 'Generate Report';
  }

  getDummyGridData() {
    return [
      { ptransactiondate: '01-Jan-2025', ptransactionno: 'OB-001', pparticulars: 'Opening Balance', pdebitamount: 0, pcreditamount: 0, popeningbal: 10000, pdescription: '', pBalanceType: 'DR' },
      { ptransactiondate: '01-Jan-2025', ptransactionno: 'TXN-1001', pparticulars: 'Cash Received', pdebitamount: 5000, pcreditamount: 0, popeningbal: 15000, pdescription: 'Received from customer', pBalanceType: 'DR' },
      { ptransactiondate: '02-Jan-2025', ptransactionno: 'TXN-1002', pparticulars: 'Office Rent', pdebitamount: 0, pcreditamount: 3000, popeningbal: 12000, pdescription: 'Monthly rent', pBalanceType: 'DR' },
      { ptransactiondate: '03-Jan-2025', ptransactionno: 'TXN-1003', pparticulars: 'Stationery', pdebitamount: 0, pcreditamount: 1500, popeningbal: 10500, pdescription: 'Stationery purchase', pBalanceType: 'DR' }
    ];
  }

  pdfOrprint(type: 'Pdf' | 'Print'): void {
    console.log(type + ' generated (dummy)');
  }

  CheckNarration(event: any): void {
    this.isNarrationChecked = event.target.checked;
    this.gridView = [];
  }
}
