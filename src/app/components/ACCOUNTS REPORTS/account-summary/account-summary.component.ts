import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-account-summary',
  standalone: true,
  imports: [NgxDatatableModule, CommonModule, ReactiveFormsModule, BsDatepickerModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.css']
})
export class AccountSummaryComponent {

  accountSummaryForm!: FormGroup;

  ledgerList: any[] = [
    { pledgerid: '1', pledgername: 'Cash' },
    { pledgerid: '2', pledgername: 'Bank' },
    { pledgerid: '3', pledgername: 'Sales' }
  ];

  gridData: any[] = [];
  currencySymbol = '$';
  isLoading = false;

  showAsOn = true;
  saveButtonText = 'Generate Report';

  asOnDate!: Date;
  betweenFrom!: Date;
  betweenTo!: Date;

  dpConfig: Partial<BsDatepickerConfig> = {};

  constructor(private fb: FormBuilder, private datePipe: DatePipe) { }

  ngOnInit(): void {
    const today = new Date();

    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false
    };

    this.accountSummaryForm = this.fb.group({
      asOnChecked: [true],
      fromDate: [today, Validators.required],
      toDate: [today, Validators.required],
      ledgerId: ['', Validators.required]
    });

    this.accountSummaryForm.get('asOnChecked')?.valueChanges.subscribe(value => {
      this.showAsOn = value;
    });
  }

  generateReport() {
    if (!this.accountSummaryForm.valid) return;

    this.isLoading = true;

    const ledgerName = this.ledgerList.find(
      l => l.pledgerid === this.accountSummaryForm.value.ledgerId
    )?.pledgername;

    if (this.showAsOn) {
      this.asOnDate = this.accountSummaryForm.value.fromDate;

      this.gridData = [
        {
          particulars: ledgerName,
          transactionDate: this.asOnDate,
          debitAmount: 500,
          creditAmount: 0
        },
        {
          particulars: ledgerName,
          transactionDate: this.asOnDate,
          debitAmount: 0,
          creditAmount: 200
        }
      ];
    } else {
      this.betweenFrom = this.accountSummaryForm.value.fromDate;
      this.betweenTo = this.accountSummaryForm.value.toDate;

      this.gridData = [
        {
          particulars: ledgerName,
          transactionDate: this.betweenFrom,
          openingBalance: 1000,
          debitAmount: 0,
          creditAmount: 0,
          closingBalance: 1000
        },
        {
          particulars: ledgerName,
          transactionDate: this.betweenFrom,
          openingBalance: 1000,
          debitAmount: 500,
          creditAmount: 0,
          closingBalance: 1500
        },
        {
          particulars: ledgerName,
          transactionDate: this.betweenTo,
          openingBalance: 1500,
          debitAmount: 0,
          creditAmount: 200,
          closingBalance: 1300
        }
      ];
    }

    this.isLoading = false;
  }

  formatDate(date: Date | string | null): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
  }
}
