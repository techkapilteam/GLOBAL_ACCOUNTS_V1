import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, FormGroup } from '@angular/forms';
import { NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-online-settlement',
  standalone: true,
  imports: [NgxDatatableModule, CommonModule, BsDatepickerModule, FormsModule],
  templateUrl: './online-settlement.component.html',
  styleUrls: ['./online-settlement.component.css'],
  providers: [DatePipe]
})
export class OnlineSettlementComponent implements OnInit {
  SelectionType = SelectionType;
  ChequesInBankForm!: FormGroup;
  today: string = '';
  selected: any[] = [];

  private datePipe = inject(DatePipe);

  // Datepicker configuration
  dpConfig: Partial<BsDatepickerConfig> = {};

  receiptDate!: Date;
  clearDate!: Date;

  rows = [
    {
      receiptNo: 'CR123',
      referenceNo: 'REF456',
      branch: 'Hyderabad',
      amount: 5000,
      party: 'Ramesh',
      receiptDate: '12/01/2026',
      depositedDate: '13/01/2026',
      clearDate: '23/01/2026',
      receiptId: 'R001',
      mode: 'CHEQUE',
      upi: 'Paytm'
    },
    {
      receiptNo: 'CR124',
      referenceNo: 'REF999',
      branch: 'Bangalore',
      amount: 7500,
      party: 'Suresh',
      receiptDate: '15/01/2026',
      depositedDate: '16/01/2026',
      clearDate: '—',
      receiptId: 'R002',
      mode: 'UPI',
      upi: 'PhonePe'
    }
  ];

  ngOnInit() {
    const today = new Date();
    this.today = this.formatDate(today);
    this.receiptDate = today;
    this.clearDate = today;

    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      maxDate: new Date()
    };
  }

  formatDate(date: Date | string | null): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
  }

  get grandTotal(): number {
    return this.rows.reduce((sum, r) => sum + r.amount, 0);
  }

  onSelect(event: any) {
    this.selected = [...event.selected];
  }

  get totalAmount() {
    return this.rows.reduce((sum, r) => sum + r.amount, 0);
  }

  // Clear button functionality
  clearSelection() {
    this.selected = [];
    this.rows = [];
  }
}
