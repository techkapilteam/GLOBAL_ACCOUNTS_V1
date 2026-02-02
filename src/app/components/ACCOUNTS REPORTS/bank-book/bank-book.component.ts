import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-bank-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    BsDatepickerModule
  ],
  templateUrl: './bank-book.component.html',
  providers: [DatePipe]
})
export class BankBookComponent implements OnInit {
  private datePipe = inject(DatePipe);

  bankName: string = '';
  showTable: boolean = false;

  fromDate!: Date;
  toDate!: Date;

  dpConfig: Partial<BsDatepickerConfig> = {};

  rows = [
    { txnNo: 'TXN001', particulars: new Date('2026-01-01'), narration: 'CR001', receipts: 1000, payments: 0, balance: 5000 },
    { txnNo: 'TXN002', particulars: new Date('2026-01-02'), narration: 'CR002', receipts: 0, payments: 500, balance: 4500 },
    { txnNo: 'TXN003', particulars: new Date('2026-01-03'), narration: 'CR003', receipts: 2000, payments: 0, balance: 6500 },
    { txnNo: 'TXN004', particulars: new Date('2026-01-04'), narration: 'CR004', receipts: 0, payments: 1000, balance: 5500 }
  ];

  ngOnInit() {
    const today = new Date();
    this.fromDate = today;
    this.toDate = today;

    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false
    };
  }

  generateReport() {
    if (!this.fromDate || !this.toDate || !this.bankName) {
      alert('Please Select From Date, To Date And Bank Name.');
      return;
    }
    this.showTable = true;
  }

  exportPDF() {
    console.log('Export PDF clicked');
  }

  printReport() {
    window.print();
  }

  exportExcel() {
    console.log('Export Excel clicked');
  }

  formatDate(date: Date | string | null): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
  }
}
