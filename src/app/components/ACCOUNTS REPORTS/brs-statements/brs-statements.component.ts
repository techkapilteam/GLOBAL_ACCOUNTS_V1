import { CommonModule, DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-brs-statements',
  standalone:true,
  imports: [NgxDatatableModule,ReactiveFormsModule,CommonModule,BsDatepickerModule,CommonModule,NgSelectModule],
   providers: [ DatePipe],
  templateUrl: './brs-statements.component.html',
  styleUrl: './brs-statements.component.css',
})
export class BrsStatementsComponent {  

  form!: FormGroup;
bankType: 'CREDIT' | 'DEBIT' | null = null;
  gridView: any[] = [];

  dpConfig = {
    dateInputFormat: 'DD-MM-YYYY'
  };

  bankData = [
    { id: 1, name: 'HDFC Bank' },
    { id: 2, name: 'ICICI Bank' },
    { id: 3, name: 'SBI Bank' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
   
    const todayStr = this.getTodayString();
    this.form = this.fb.group({
      bankId: [''],
      fromDate: [todayStr],
      toDate: [todayStr]
    });
  }


  getTodayString(): string {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  }

  onBankTypeChange(type: 'CREDIT' | 'DEBIT') {
    this.bankType = type;
    this.gridView = []; 
  }

  getReport() {
    if (this.bankType === 'CREDIT') {
      this.gridView = [
        {
          receiptDate: new Date(),
          receiptNo: 'RC001',
          amount: 5000,
          chequeNo: 'CH123',
          chequeDate: new Date(),
          depositDate: new Date(),
          clearedDate: new Date(),
          particular: 'Customer Deposit'
        }
      ];
    } else {
      this.gridView = [
        {
          transDate: new Date(),
          transNo: 'TR001',
          chequeNo: 'CH789',
          amount: 2500,
          clearedDate: new Date(),
          particular: 'Office Expense'
        }
      ];
    }
  }

  pdfOrprint(type: string) {
    console.log(type);
  }

  export() {
    console.log('Excel Export');
  }



  
}
  




 





