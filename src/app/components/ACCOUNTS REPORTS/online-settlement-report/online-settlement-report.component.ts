import { Component, ViewChild, OnInit } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule, ColumnMode } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-online-settlement',
  standalone: true,
  imports: [BsDatepickerModule, FormsModule, NgxDatatableModule, CommonModule],
  templateUrl: './online-settlement-report.component.html',
  styleUrl: './online-settlement-report.component.css',
})
export class OnlineSettlementReportComponent {
onlineSettlementRows: any[] = [];
  ColumnMode = ColumnMode;

  rows = [
    {
      transactionNo: 'TXN001',
      transactionDate: '12/01/2026',
      chitReceiptNo: 'CR123',
      referenceNo: 'REF456',
      chequeDate: '12/01/2026',
      amount: '₹ 5,000.00',
      chitNo: 'CH001 - 10',
      receiptDate: '12/01/2026',
      depositedDate: '13/01/2026',
      receiptId: 'R001',
      upiName: 'Paytm',
      party: 'Ramesh'
    },
    {
      transactionNo: 'TXN002',
      transactionDate: '13/01/2026',
      chitReceiptNo: 'CR124',
      referenceNo: 'REF457',
      chequeDate: '13/01/2026',
      amount: '₹ 3,200.00',
      chitNo: 'CH002 - 12',
      receiptDate: '13/01/2026',
      depositedDate: '14/01/2026',
      receiptId: 'R002',
      upiName: 'PhonePe',
      party: 'Suresh'
    },
    {
      transactionNo: 'TXN003',
      transactionDate: '14/01/2026',
      chitReceiptNo: 'CR125',
      referenceNo: 'REF458',
      chequeDate: '14/01/2026',
      amount: '₹ 7,500.00',
      chitNo: 'CH003 - 15',
      receiptDate: '14/01/2026',
      depositedDate: '15/01/2026',
      receiptId: 'R003',
      upiName: 'GooglePay',
      party: 'Anita'
    },
    {
      transactionNo: 'TXN004',
      transactionDate: '15/01/2026',
      chitReceiptNo: 'CR126',
      referenceNo: 'REF459',
      chequeDate: '15/01/2026',
      amount: '₹ 2,800.00',
      chitNo: 'CH004 - 8',
      receiptDate: '15/01/2026',
      depositedDate: '16/01/2026',
      receiptId: 'R004',
      upiName: 'Paytm',
      party: 'Rohit'
    },
    {
      transactionNo: 'TXN005',
      transactionDate: '16/01/2026',
      chitReceiptNo: 'CR127',
      referenceNo: 'REF460',
      chequeDate: '16/01/2026',
      amount: '₹ 4,200.00',
      chitNo: 'CH005 - 9',
      receiptDate: '16/01/2026',
      depositedDate: '17/01/2026',
      receiptId: 'R005',
      upiName: 'PhonePe',
      party: 'Priya'
    },
    {
      transactionNo: 'TXN006',
      transactionDate: '17/01/2026',
      chitReceiptNo: 'CR128',
      referenceNo: 'REF461',
      chequeDate: '17/01/2026',
      amount: '₹ 6,000.00',
      chitNo: 'CH006 - 11',
      receiptDate: '17/01/2026',
      depositedDate: '18/01/2026',
      receiptId: 'R006',
      upiName: 'GooglePay',
      party: 'Vikram'
    }
  ];
displayedRows: any[] = [];  
  selectedUPI: string = '';

  columns = [
    { name: 'Transaction No', prop: 'transactionNo', headerClass: 'text-center', cellClass: 'text-center' },
    { name: 'Transaction Date', prop: 'transactionDate', headerClass: 'text-center', cellClass: 'text-center' },
    { name: 'Chit Receipt No', prop: 'chitReceiptNo', headerClass: 'text-center', cellClass: 'text-center' },
    { name: 'Reference No', prop: 'referenceNo', headerClass: 'text-center', cellClass: 'text-center' },
    { name: 'Cheque Date', prop: 'chequeDate', headerClass: 'text-center', cellClass: 'text-center' },
    { name: 'Amount', prop: 'amount', headerClass: 'text-end', cellClass: 'text-end fw-bold' },
    { name: 'Chit No', prop: 'chitNo' },
    { name: 'Receipt Date', prop: 'receiptDate', headerClass: 'text-center', cellClass: 'text-center' },
    { name: 'Deposited Date', prop: 'depositedDate', headerClass: 'text-center', cellClass: 'text-center' },
    { name: 'Receipt Id', prop: 'receiptId', headerClass: 'text-center', cellClass: 'text-center' },
    { name: 'UPI Name', prop: 'upiName' },
    { name: 'Party', prop: 'party' }
  ];
  fromDate!: Date;
  toDate!: Date;

  ngOnInit() {
    const today = new Date();
    this.fromDate = today;
    this.toDate = today;
  }
  downloadPDF() {
    const link = document.createElement('a');
    link.href = 'assets/sample.pdf';  // replace with your PDF path
    link.download = 'Report.pdf';
    link.click();
  }

  downloadExcel() {
    const link = document.createElement('a');
    link.href = 'assets/sample.xlsx'; // replace with your Excel path
    link.download = 'Report.xlsx';
    link.click();
  }

  printPage() {
    window.print();
  }



  showFiltered() {
    this.displayedRows = this.rows.filter(row => {
      const matchUPI = this.selectedUPI ? row.upiName === this.selectedUPI : true;

      let matchDate = true;
      if (this.fromDate && this.toDate) {
        const txDate = new Date(row.transactionDate.split('/').reverse().join('-'));
        matchDate = txDate >= this.fromDate && txDate <= this.toDate;
      }

      return matchUPI && matchDate;
    });
  }

  showAll() {
    this.displayedRows = [...this.rows];
    this.selectedUPI = '';
  }

}


