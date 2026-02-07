import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-cash-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    BsDatepickerModule
  ],
  templateUrl: './cash-book.component.html',
  providers: [DatePipe]
})
export class CashBookComponent implements OnInit {

  private datePipe = inject(DatePipe);

  transactionType = '';
  showTable = false;

  fromDate!: Date;
  toDate!: Date;

  dpConfig: Partial<BsDatepickerConfig> = {};

  // Static Data
  rows = [
    { txnNo: 'TXC001', particulars: new Date('2026-01-01'), narration: 'Opening Balance', receipts: 10000, payments: 0, balance: 10000 },
    { txnNo: 'TXC002', particulars: new Date('2026-01-02'), narration: 'Cash Sale', receipts: 5000, payments: 0, balance: 15000 },
    { txnNo: 'TXC003', particulars: new Date('2026-01-03'), narration: 'Office Expenses', receipts: 0, payments: 2000, balance: 13000 },
    { txnNo: 'TXC004', particulars: new Date('2026-01-04'), narration: 'Cash Received', receipts: 3000, payments: 0, balance: 16000 }
  ];

  ngOnInit(): void {
    const today = new Date();
    this.fromDate = today;
    this.toDate = today;

    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      maxDate: new Date()
    };
  }

  generateReport() {
    if (!this.fromDate || !this.toDate || !this.transactionType) {
      alert('Please select From Date, To Date, and Transaction Type.');
      return;
    }
    this.showTable = true;
  }

  pdfOrprint(type: 'Pdf' | 'Print') {
    if (type === 'Print') {
      window.print();
    } else {
      alert('PDF export not implemented in demo mode');
    }
  }

  exportExcel() {
    alert('Excel export not implemented in demo mode');
  }

  formatDate(date: Date | string | null): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
  }
}
