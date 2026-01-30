import { CommonModule, DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-brs-statements',
  standalone:true,
  imports: [NgxDatatableModule,ReactiveFormsModule,CommonModule,BsDatepickerModule],
   providers: [ DatePipe],
  templateUrl: './brs-statements.component.html',
  styleUrl: './brs-statements.component.css',
})
export class BrsStatementsComponent {  

   form: FormGroup;

  currencySymbol = '₹';

  bankList = [
    { id: 1, name: 'SBI', account: '123456' },
    { id: 2, name: 'HDFC', account: '987654' }
  ];

  selectedBankName = '';
  selectedBankAccount = '';

  reportDate = new Date(); 
  rows: any[] = []; 
  private allRows = [
    {
      pGroupType: 'Receipts',
      date: new Date('2025-01-05'),
      chequeNo: 'CHQ001',
      particulars: 'Customer Payment',
      amount: 25000
    },
    {
      pGroupType: 'Receipts',
      date: new Date('2025-01-10'),
      chequeNo: 'CHQ002',
      particulars: 'Installment',
      amount: 15000
    },
    {
      pGroupType: 'Payments',
      date: new Date('2025-01-12'),
      chequeNo: 'CHQ003',
      particulars: 'Office Rent',
      amount: 10000
    }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      bankId: [''],
      chequeInfo: [false],
      onDate: [this.today()],
      fromDate: [this.today()],
      toDate: [this.today()]
    });
  }

  today(): string {
    return new Date().toISOString().substring(0, 10);
  }

  generateReport(): void {
    const bank = this.bankList.find(
      b => b.id === +this.form.value.bankId
    );

    this.selectedBankName = bank?.name || '';
    this.selectedBankAccount = bank?.account || '';
    this.reportDate = new Date();

   
    this.rows = [...this.allRows];
  }

  getGroupTotal(type: string): number {
    return this.rows
      .filter(r => r.pGroupType === type)
      .reduce((sum, r) => sum + r.amount, 0);
  }

}

 





