import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-bank-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    BsDatepickerModule
  ],
  templateUrl: './bank-book.component.html'
})
export class BankBookComponent implements OnInit {

  fromDate: string = '';
  toDate: string = '';
  bankName: string = '';

  showTable: boolean = false; 

  rows = [
    { txnNo: 'TXN001', particulars: '01-01-2026', narration: 'CR001', receipts: 1000, payments: 0, balance: 5000 },
    { txnNo: 'TXN002', particulars: '02-01-2026', narration: 'CR002', receipts: 0, payments: 500, balance: 4500 },
    { txnNo: 'TXN003', particulars: '03-01-2026', narration: 'CR003', receipts: 2000, payments: 0, balance: 6500 },
    { txnNo: 'TXN004', particulars: '04-01-2026', narration: 'CR004', receipts: 0, payments: 1000, balance: 5500 }
  ];

  constructor() { }

  ngOnInit(): void { }

  generateReport() {
    if (!this.fromDate || !this.toDate || !this.bankName) {
      alert('Please select From Date, To Date, and Bank Name.');
      return;
    }
    this.showTable = true;
  }

  exportPDF() { console.log('Export PDF clicked'); }
  printReport() { window.print(); }
  exportExcel() { console.log('Export Excel clicked'); }
}
