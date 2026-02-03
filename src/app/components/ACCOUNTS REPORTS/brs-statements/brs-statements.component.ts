import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-brs-statements',
  standalone: true,
  imports: [NgxDatatableModule, ReactiveFormsModule, CommonModule, BsDatepickerModule, NgSelectModule],
  providers: [DatePipe],
  templateUrl: './brs-statements.component.html',
  styleUrls: ['./brs-statements.component.css']
})
export class BrsStatementsComponent {

  form!: FormGroup;
  bankType: 'CREDIT' | 'DEBIT' | null = null;
  gridView: any[] = [];

  dpConfig: Partial<BsDatepickerConfig> = {};

  bankData = [
    { id: 1, name: 'HDFC Bank' },
    { id: 2, name: 'ICICI Bank' },
    { id: 3, name: 'SBI Bank' }
  ];

  constructor(private fb: FormBuilder, private datePipe: DatePipe) { }

  ngOnInit(): void {
    const today = new Date();

    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false
    };

    this.form = this.fb.group({
      bankId: [''],
      fromDate: [today],
      toDate: [today]
    });
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

  formatDate(date: Date | string | null): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
  }

  pdfOrprint(type: string) {
    console.log(type);
  }

  export() {
    console.log('Excel Export');
  }
}
