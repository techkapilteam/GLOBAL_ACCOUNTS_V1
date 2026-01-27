import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

interface Cheque {
  checkbook?: string;
  clear?: boolean;
  return?: boolean;
  referenceNo?: string;
  chequeNo: string;
  branchName: string;
  amount: number;
  party: string;
  receipts: number;
  status?: string;
  date?: string;
  depositedDate?: string;
  clearedDate?: string;
  receiptId?: string;
  transactionMode?: string;
  chequeBankName?: string;
  chequeBranchName?: string;
}

@Component({
  selector: 'app-cheques-in-bank',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxDatatableModule],
  templateUrl: './cheques-inbank.component.html'
})
export class ChequesInbankComponent implements OnInit {
  selectedBank: string = '';
  searchText: string = '';
  activeTab: string = '';
  showTable: boolean = false;
  transactionDate: string = new Date().toISOString().split('T')[0];
  chequesclearDate: string = new Date().toISOString().split('T')[0];

  brsFromDate: string = '';
  brsToDate: string = '';

  headerCheckbook: boolean = false;

  allCheques: Cheque[] = [
    { checkbook: '', clear: false, return: false, referenceNo: 'REF001', chequeNo: 'CHQ001', branchName: 'SBI Main', amount: 10000, party: 'ABC Corp', receipts: 10000, status: 'Received', transactionMode: 'NEFT', chequeBankName: 'SBI', chequeBranchName: 'Main Branch' },
    { checkbook: '', clear: false, return: false, referenceNo: 'REF002', chequeNo: 'CHQ002', branchName: 'HDFC Branch', amount: 5000, party: 'XYZ Ltd', receipts: 5000, status: 'Online', transactionMode: 'RTGS', chequeBankName: 'HDFC', chequeBranchName: 'Branch A' },
    { checkbook: '', clear: false, return: false, referenceNo: 'REF003', chequeNo: 'CHQ003', branchName: 'ICICI Branch', amount: 7000, party: 'LMN Pvt Ltd', receipts: 7000, status: 'Deposited', transactionMode: 'Cash', chequeBankName: 'ICICI', chequeBranchName: 'Branch B' },
    { checkbook: '', clear: false, return: false, referenceNo: 'REF004', chequeNo: 'CHQ004', branchName: 'IDBI Branch', amount: 2000, party: 'OPQ Corp', receipts: 2000, status: 'Cancelled', transactionMode: 'Cheque', chequeBankName: 'IDBI', chequeBranchName: 'Branch C' },
  ];

  clearedCheques: Cheque[] = [
    { chequeNo: 'CHQ101', branchName: 'SBI Main', amount: 15000, party: 'ABC Corp', receipts: 15000, date: '2026-01-01', depositedDate: '2026-01-03', clearedDate: '2026-01-05', transactionMode: 'NEFT', chequeBankName: 'SBI', chequeBranchName: 'Main Branch' },
    { chequeNo: 'CHQ102', branchName: 'HDFC Branch', amount: 8000, party: 'XYZ Ltd', receipts: 8000, date: '2026-01-02', depositedDate: '2026-01-04', clearedDate: '2026-01-06', transactionMode: 'RTGS', chequeBankName: 'HDFC', chequeBranchName: 'Branch A' },
  ];

  filteredCheques: Cheque[] = [];

  ngOnInit(): void {
    this.showTable = false;
  }

  filterTab(tab: string) {
    this.activeTab = tab;
    this.showTable = false;
    if (tab === 'Deposited' || tab === 'Cancelled') {
      this.filteredCheques = [];
    } else {
      switch (tab) {
        case 'All':
          this.filteredCheques = [...this.allCheques];
          break;
        case 'Received':
          this.filteredCheques = this.allCheques.filter(c => c.status === 'Received');
          break;
        case 'Online':
          this.filteredCheques = this.allCheques.filter(c => c.status === 'Online');
          break;
      }
      this.showTable = true;
    }
  }

  showCheques() {
    if (this.activeTab && this.activeTab !== 'Deposited' && this.activeTab !== 'Cancelled') {
      this.showTable = true;
    }
  }

  showClearedCheques() {
    this.filteredCheques = [...this.clearedCheques];
    this.showTable = true;
  }

  clearSelections() {
    this.filteredCheques.forEach(c => { c.clear = false; c.return = false; });
    this.headerCheckbook = false;
  }

  saveSelections() {
    console.log('Selected Cheques:', this.filteredCheques.filter(c => c.clear || c.return));
    alert('Saved successfully!');
  }

  toggleAllCheckbook(event: any) {
    this.headerCheckbook = event.target.checked;
    this.filteredCheques.forEach(c => c.checkbook = this.headerCheckbook ? 'selected' : '');
  }
  
}
// 555