import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-bank-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    NgSelectModule,
    BsDatepickerModule
  ],
  templateUrl: './bank-book.component.html',
  styleUrls: ['./bank-book.component.css']
})
export class BankBookComponent implements OnInit {

  fromDate: string = '';
  toDate: string = '';
  bankName: string = '';

  // Original dummy data
  allRows = [
    { txnNo: 'TXN001', particulars: '01-01-2026', narration: 'CR001', receipts: 'CHQ123', payments: 10, balance: 5000, bank: 'State Bank', date: '2026-01-01' },
    { txnNo: 'TXN002', particulars: '02-01-2026', narration: 'CR002', receipts: 'CHQ124', payments: 11, balance: 7500, bank: 'HDFC Bank', date: '2026-01-02' },
    { txnNo: 'TXN003', particulars: '03-01-2026', narration: 'CR003', receipts: 'CHQ125', payments: 5, balance: 8000, bank: 'ICICI Bank', date: '2026-01-03' },
    { txnNo: 'TXN004', particulars: '04-01-2026', narration: 'CR004', receipts: 'CHQ126', payments: 15, balance: 9000, bank: 'State Bank', date: '2026-01-04' }
  ];

  rows: any[] = [];

  columns = [
    { name: 'Transaction No.', prop: 'txnNo' },
    { name: 'Particulars', prop: 'particulars' },
    { name: 'Narration', prop: 'narration' },
    { name: 'Receipts', prop: 'receipts' },
    { name: 'Payments', prop: 'payments' },
    { name: 'Balance', prop: 'balance' }
  ];

  showTable: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  generateReport() {
    this.showTable = true;
    this.rows = this.allRows.filter(row => {
      const rowDate = new Date(row.date);
      const from = this.fromDate ? new Date(this.fromDate) : null;
      const to = this.toDate ? new Date(this.toDate) : null;

      const inDateRange = (!from || rowDate >= from) && (!to || rowDate <= to);
      const bankMatch = !this.bankName || row.bank === this.bankName;

      return inDateRange && bankMatch;
    });
  }

  exportPDF() { console.log('Export PDF clicked'); }
  printReport() { console.log('Print clicked'); }
  exportExcel() { console.log('Export Excel clicked'); }

}
