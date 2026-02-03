import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

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
  imports: [CommonModule, FormsModule, NgxDatatableModule, BsDatepickerModule],
  templateUrl: './cheques-inbank.component.html',
  providers: [DatePipe]
})
export class ChequesInbankComponent implements OnInit {
  private datePipe = inject(DatePipe);

  selectedBank: string = '';
  searchText: string = '';
  activeTab: string = '';
  showTable: boolean = true;
  transactionDate: Date = new Date();
  chequesclearDate: Date = new Date();
  brsFromDate: Date = new Date();
  brsToDate: Date = new Date();
  headerCheckbook: boolean = false;
  brsDataLoaded: boolean = false;

  dpConfig: Partial<BsDatepickerConfig> = {};

  allCheques: Cheque[] = [
    { checkbook: '', clear: false, return: false, referenceNo: 'REF001', chequeNo: 'CHQ001', branchName: 'SBI Main', amount: 10000, party: 'ABC Corp', receipts: 10000, status: 'Received', transactionMode: 'NEFT', chequeBankName: 'SBI', chequeBranchName: 'Main Branch' },
    { checkbook: '', clear: false, return: false, referenceNo: 'REF002', chequeNo: 'CHQ002', branchName: 'HDFC Branch', amount: 5000, party: 'XYZ Ltd', receipts: 5000, status: 'Online', transactionMode: 'RTGS', chequeBankName: 'HDFC', chequeBranchName: 'Branch A' },
    { checkbook: '', clear: false, return: false, referenceNo: 'REF003', chequeNo: 'CHQ003', branchName: 'ICICI Branch', amount: 7000, party: 'LMN Pvt Ltd', receipts: 7000, status: 'Deposited', transactionMode: 'Cash', chequeBankName: 'ICICI', chequeBranchName: 'Branch B' },
    { checkbook: '', clear: false, return: false, referenceNo: 'REF004', chequeNo: 'CHQ004', branchName: 'IDBI Branch', amount: 2000, party: 'OPQ Corp', receipts: 2000, status: 'Cancelled', transactionMode: 'Cheque', chequeBankName: 'IDBI', chequeBranchName: 'Branch C' },
  ];

  clearedCheques: Cheque[] = [
    { chequeNo: 'CHQ101', branchName: 'SBI Main', amount: 15000, party: 'ABC Corp', receipts: 15000, date: '2026-01-01', depositedDate: '2026-01-03', clearedDate: '2026-01-05', transactionMode: 'NEFT', chequeBankName: 'SBI', chequeBranchName: 'Main Branch', receiptId: 'RCPT101' },
    { chequeNo: 'CHQ102', branchName: 'HDFC Branch', amount: 8000, party: 'XYZ Ltd', receipts: 8000, date: '2026-01-02', depositedDate: '2026-01-04', clearedDate: '2026-01-06', transactionMode: 'RTGS', chequeBankName: 'HDFC', chequeBranchName: 'Branch A', receiptId: 'RCPT102' },
    { chequeNo: 'CHQ103', branchName: 'ICICI Branch', amount: 12000, party: 'LMN Pvt Ltd', receipts: 12000, date: '2026-01-03', depositedDate: '2026-01-05', clearedDate: '2026-01-07', transactionMode: 'Cheque', chequeBankName: 'ICICI', chequeBranchName: 'Branch B', receiptId: 'RCPT103' }
  ];

  filteredCheques: Cheque[] = [];
  brsFilteredCheques: Cheque[] = [];

  ngOnInit(): void {
    this.activeTab = 'All';
    this.filteredCheques = [...this.allCheques];

    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false
    };
  }

  filterTab(tab: string) {
    this.activeTab = tab;
    this.showTable = true;

    if (tab === 'Deposited' || tab === 'Cancelled') {
      this.filteredCheques = [];
      this.brsDataLoaded = false;
      this.brsFromDate = new Date();
      this.brsToDate = new Date();
    } else {
      this.brsDataLoaded = false;
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
    }
  }

  onShowClick() {
    if (this.activeTab === 'Deposited' || this.activeTab === 'Cancelled') {
      this.showClearedCheques();
    } else {
      this.showCheques();
    }
  }

  showCheques() {
    this.showTable = true;
    if (this.selectedBank) {
      this.filteredCheques = [...this.allCheques].filter(c => c.chequeBankName === this.selectedBank);
    } else {
      this.filteredCheques = [...this.allCheques];
    }
  }

  showClearedCheques() {
    if (!this.brsFromDate || !this.brsToDate) {
      alert('Please select BRS From and To Dates.');
      return;
    }

    this.brsFilteredCheques = this.selectedBank 
      ? this.clearedCheques.filter(c => c.chequeBankName === this.selectedBank) 
      : [...this.clearedCheques];

    this.filteredCheques = [...this.brsFilteredCheques];
    this.brsDataLoaded = true;
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

  formatDate(date: Date | string | null): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
  }

 
  pdfOrPrint(type: 'Pdf' | 'Print') {
    if (type === 'Print') {
      window.print();
    } else {
      alert('PDF export not implemented in demo mode');
    }
  }

  exportExcel() {
    alert('Excel export not implemented in demo mode');
  }
}
