import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@Component({
  selector: 'app-cash-onhand',
   imports: [
     CommonModule,
    ReactiveFormsModule,
    NgxDatatableModule,
     BsDatepickerModule,
    
    
  ],
  standalone:true,
  templateUrl: './cash-onhand.component.html',
  styleUrl: './cash-onhand.component.css',
})


export class CashOnhandComponent  {

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

  /** ---------------- VALIDATION FLAGS (STATIC) ---------------- */
  CashOnHandValidation: any = {};

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

  /** ---------------- MODAL DATA ---------------- */
  chequenumber = 'CHQ-123456';

  /** ---------------- DATE PICKER CONFIG (STATIC) ---------------- */
  dpConfig = { dateInputFormat: 'DD-MM-YYYY' };
  fromdate = { dateInputFormat: 'DD-MM-YYYY' };
  todate = { dateInputFormat: 'DD-MM-YYYY' };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
    this.calculateTotal();
  }

  /** ---------------- FORM ---------------- */

  createForm(): void {
    this.CashOnHandForm = this.fb.group({
      banknameForLegal: [''],
      asondate: [false],
      fromdate: [''],
      todate: ['', Validators.required],
      bankname: [''],
      ptransactiondate: ['', Validators.required]
    });
  }

  /** ---------------- CALCULATIONS ---------------- */

  calculateTotal(): void {
    this.amounttotal = this.gridData.reduce(
      (sum, row) => sum + row.ptotalreceivedamount,
      0
    );
  }

  /** ---------------- EVENTS (DUMMY) ---------------- */

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