import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';
declare var $: any;
@Component({
  selector: 'app-cash-onhand',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    BsDatepickerModule,
TableModule

  ],
  standalone: true,
  templateUrl: './cash-onhand.component.html',
  styleUrl: './cash-onhand.component.css',
})


export class CashOnhandComponent {

  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public fromdate: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public todate: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  CashOnHandForm!: FormGroup;

  /** ---------------- UI FLAGS ---------------- */
  pcashonhandbalance = 5000;           // change to 0 to test other UI
  bankDropdowmHide = true;
  fromdatevisible = false;
  saveshowhide = true;

  disableShowbutton = false;
  disablesavebutton = false;

  pdatepickerenablestatus = true;

  showbuttontext = 'Show';
  buttonname = 'Save';

  datelable = 'To Date';

  currencySymbol = '₹';
  FromDate = 'From Date';
  showTodate: boolean = true;
  today:Date=new Date()
  /** ---------------- VALIDATION FLAGS (STATIC) ---------------- */
  // CashOnHandValidation: any = {};

  /** ---------------- STATIC DROPDOWN DATA ---------------- */

  BankNamesList = [
    { pdepositbankname: 'HDFC Bank' },
    { pdepositbankname: 'ICICI Bank' },
    { pdepositbankname: 'State Bank of India' }
  ];

  BanksList = [
    { branch_name: 'CAO – Head Office' },
    { branch_name: 'CAO – Branch 1' },
    { branch_name: 'CAO – Branch 2' }
  ];

  /** ---------------- STATIC GRID DATA ---------------- */

  gridData = [
    {
      ppartyname: 'John Doe',
      ptotalreceivedamount: 1500.50,
      preceiptno: 'RCPT-001',
      preceiptid: 'RID-101',
      preceiptdate: new Date('2024-04-10')
    },
    {
      ppartyname: 'Jane Smith',
      ptotalreceivedamount: 2500.00,
      preceiptno: 'RCPT-002',
      preceiptid: 'RID-102',
      preceiptdate: new Date('2024-04-11')
    },
    {
      ppartyname: 'ABC Pvt Ltd',
      ptotalreceivedamount: 1000.00,
      preceiptno: 'RCPT-003',
      preceiptid: 'RID-103',
      preceiptdate: new Date('2024-04-12')
    }
  ];

  amounttotal = 0;


  chequenumber = 'CHQ-123456';


  //  .dpConfig = { dateInputFormat: 'DD-MM-YYYY' };
  //   fromdate = { dateInputFormat: 'DD-MM-YYYY' };
  //   todate = { dateInputFormat: 'DD-MM-YYYY' };

  constructor(private fb: FormBuilder) {
    this.fromdate.maxDate = new Date();
    this.fromdate.containerClass = 'theme-dark-blue';
    this.fromdate.dateInputFormat = 'DD-MM-YYYY';
    this.fromdate.showWeekNumbers = false;

    this.todate.maxDate = new Date();
    this.todate.containerClass = 'theme-dark-blue';
    this.todate.dateInputFormat = 'DD-MM-YYYY';
    this.todate.showWeekNumbers = false;

    this.dpConfig.maxDate = new Date();
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig.showWeekNumbers = false;

  }


  ngOnInit(): void {
    this.createForm();
    this.calculateTotal();
  }

  /** ---------------- FORM ---------------- */

  createForm(): void {
    this.CashOnHandForm = this.fb.group({
      banknameForLegal: [''],
      asondate: [''],
      fromdate: [this.today],
      todate: [this.today],
      bankname: [''],
      ptransactiondate: [this.today],

    });
  }

  /** ---------------- CALCULATIONS ---------------- */

  calculateTotal(): void {
    // this.amounttotal = this.gridData.reduce(
    //   (sum, row) => sum + row.ptotalreceivedamount,
    //   0
    // );
  }

  asOnChange($event: any) {
    debugger
    if ($event.target.checked) {
      this.FromDate = 'Date'
      this.showTodate = false;

    } else {
      this.FromDate = 'From Date'
      this.showTodate = true;
    }
  }


  BankChange(event: any): void {
    console.log('Bank changed:', event.target.value);
  }

  SelectBank(event: any): void {
    console.log('CAO selected:', event.target.value);
  }

  fromdateChange(value: any): void {
    console.log('From date changed:', value);
  }

  change_date(value: any): void {
    console.log('Date changed:', value);
  }

  getCashOnHandData(): void {
    console.log('Form Value:', this.CashOnHandForm.value);
    this.disableShowbutton = true;

    setTimeout(() => {
      this.disableShowbutton = false;
    }, 800);
  }

  Clear(): void {
    this.CashOnHandForm.reset();
  }

  Save(): void {
    this.disablesavebutton = true;

    setTimeout(() => {
      this.disablesavebutton = false;
      alert('Cash On Hand Saved (Static)');
    }, 1000);
  }

  CancelChargesOk(value: any): void {
    console.log('Cancel charges:', value);
  }

  /** ---------------- SEARCH / EXPORT (OPTIONAL) ---------------- */

  onSearch(event: any): void {
    console.log('Search:', event.target.value);
  }

  export(): void {
    console.log('Export clicked');
  }

  pdfOrprint(type: 'Pdf' | 'Print'): void {
    console.log(type, 'clicked');
  }
}