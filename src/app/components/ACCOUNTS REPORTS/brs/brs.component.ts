import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-brs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxDatatableModule, BsDatepickerModule],
  templateUrl: './brs.component.html',
  styleUrls: ['./brs.component.css'],
  providers: [DatePipe]
})
export class BrsComponent implements OnInit {

  BRStatmentForm!: FormGroup;
  disablereference: boolean = false;

  bankData = [
    { pbankaccountid: 1, pbankname: 'UNION BANK OF INDIA', pbankaccountnumber: '183911010000003' },
    { pbankaccountid: 2, pbankname: 'STATE BANK OF INDIA', pbankaccountnumber: '1234567890' }
  ];

  allData: any[] = [
    { pGroupType: 'CHEQUES ISSUED BUT NOT CLEARED', ptransactiondate: new Date(), pChequeNumber: '1001', pparticulars: 'Cash Deposit', ptotalreceivedamount: 5000 },
    { pGroupType: 'Deposit', ptransactiondate: new Date(), pChequeNumber: '1002', pparticulars: 'Cheque Deposit', ptotalreceivedamount: 2000 },
    { pGroupType: 'Withdrawal', ptransactiondate: new Date(), pChequeNumber: '2001', pparticulars: 'ATM Withdrawal', ptotalreceivedamount: 1000 }
  ];

  gridView: any[] = [];

  startDate!: Date;
  selectedBankName = '';
  selectedBankAccount = '';
  currencysymbol = '₹';

  dpConfig: Partial<BsDatepickerConfig> = {};

  constructor(private fb: FormBuilder, private datePipe: DatePipe) { }

  ngOnInit() {
    const today = new Date();

    this.BRStatmentForm = this.fb.group({
      pbankname: ['', Validators.required],
      chequeInfo: [false],
      onDate: [today],
      fromDate: [today],
      toDate: [today],
      pDocStorePath: ['']
    });
   
    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false
    };
   
    this.BRStatmentForm.get('chequeInfo')?.valueChanges.subscribe(checked => {
      if (checked) {
        this.BRStatmentForm.patchValue({ fromDate: today, toDate: today });
      } else {
        this.BRStatmentForm.patchValue({ onDate: today });
      }
      this.gridView = [];
    });
  }

  getBRStatmentReports() {
    const chequeInfoChecked = this.BRStatmentForm.get('chequeInfo')?.value;

    if (chequeInfoChecked) {
      this.gridView = [];
      return;
    }

    this.startDate = this.BRStatmentForm.value.onDate;
    const selectedBankId = this.BRStatmentForm.value.pbankname;
    const selectedBank = this.bankData.find(b => b.pbankaccountid === +selectedBankId);

    if (selectedBank) {
      this.selectedBankName = selectedBank.pbankname;
      this.selectedBankAccount = selectedBank.pbankaccountnumber;
    }

    this.gridView = [...this.allData];
  }

  toggleExpandGroup(group: any): void {
    this.gridView = [...this.gridView];
  }

  getGroupTotal(groupType: string): number {
    return this.gridView
      .filter(r => r.pGroupType === groupType)
      .reduce((acc, curr) => acc + (curr.ptotalreceivedamount || 0), 0);
  }

  formatDate(date: Date | string | null): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
  }

  get pbankname() { return this.BRStatmentForm.get('pbankname'); }

}
