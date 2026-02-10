import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-brs-statements',
  standalone: true,
  imports: [NgxDatatableModule, ReactiveFormsModule, CommonModule, BsDatepickerModule, NgSelectModule, TableModule],
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
    }, { validators: this.dateRangeValidator() });
  }
  dateRangeValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {

      const from = group.get('fromDate')?.value;
      const to = group.get('toDate')?.value;

      const fromTime = new Date(from).setHours(0, 0, 0, 0);
      const toTime = new Date(to).setHours(0, 0, 0, 0);

      return fromTime > toTime
        ? { dateRangeInvalid: true }
        : null;
    };
  }

  onBankTypeChange(type: 'CREDIT' | 'DEBIT') {
    this.bankType = type;
    this.gridView = [];
  }

  getReport() {
    this.form.markAllAsTouched();

    if (this.form.errors?.['dateRangeInvalid']) {
      alert('From Date should not be greater than To Date');
      return;
    }

    if (this.form.invalid) return;
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

  exportExcel() {
    alert('Excel export not implemented in demo mode');
  }
}
