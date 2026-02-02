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
  date?: Date;
  depositedDate?: Date;
  clearedDate?: Date;
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
  showTable: boolean = false;
  headerCheckbook: boolean = false;

  transactionDate: Date = new Date();
  chequesclearDate: Date = new Date();
  brsFromDate: Date = new Date();
  brsToDate: Date = new Date();

  dpConfig: Partial<BsDatepickerConfig> = {};

  allCheques: Cheque[] = [
    { chequeNo: 'CHQ001', branchName: 'SBI Main', amount: 10000, party: 'ABC Corp', receipts: 10000, status: 'Received', date: new Date('2026-01-01'), depositedDate: new Date('2026-01-03'), clearedDate: new Date('2026-01-05'), transactionMode: 'NEFT', chequeBankName: 'SBI', chequeBranchName: 'Main Branch' },
    { chequeNo: 'CHQ002', branchName: 'HDFC Branch', amount: 5000, party: 'XYZ Ltd', receipts: 5000, status: 'Online', date: new Date('2026-01-02'), depositedDate: new Date('2026-01-04'), clearedDate: new Date('2026-01-06'), transactionMode: 'RTGS', chequeBankName: 'HDFC', chequeBranchName: 'Branch A' }
  ];

  clearedCheques: Cheque[] = [
    { chequeNo: 'CHQ101', branchName: 'SBI Main', amount: 15000, party: 'ABC Corp', receipts: 15000, date: new Date('2026-01-01'), depositedDate: new Date('2026-01-03'), clearedDate: new Date('2026-01-05'), transactionMode: 'NEFT', chequeBankName: 'SBI', chequeBranchName: 'Main Branch' },
    { chequeNo: 'CHQ102', branchName: 'HDFC Branch', amount: 8000, party: 'XYZ Ltd', receipts: 8000, date: new Date('2026-01-02'), depositedDate: new Date('2026-01-04'), clearedDate: new Date('2026-01-06'), transactionMode: 'RTGS', chequeBankName: 'HDFC', chequeBranchName: 'Branch A' }
  ];

  filteredCheques: Cheque[] = [];

  ngOnInit(): void {
    this.showTable = true;
    this.filteredCheques = [...this.allCheques];
    this.activeTab = 'All';

    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false
    };
  }

  filterTab(tab: string) {
    this.activeTab = tab;
    this.showTable = false;
    if (tab === 'Deposited' || tab === 'Cancelled') {
      this.filteredCheques = [];
    } else {
      switch (tab) {
        case 'All': this.filteredCheques = [...this.allCheques]; break;
        case 'Received': this.filteredCheques = this.allCheques.filter(c => c.status === 'Received'); break;
        case 'Online': this.filteredCheques = this.allCheques.filter(c => c.status === 'Online'); break;
      }
      this.showTable = true;
    }
  }

  showCheques() { this.showTable = true; }

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


  formatDate(date: Date | string | null): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
  }
}
