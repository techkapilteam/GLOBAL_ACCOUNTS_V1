import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-comparison-tb',
  imports: [FormsModule,CommonModule,NgxDatatableModule],
  templateUrl: './comparison-tb.component.html',
  styleUrl: './comparison-tb.component.css',
})
export class ComparisonTbComponent {
  fromDate: string = '';
  toDate: string = '';
  grouping: boolean = false;

  formattedFrom: string = '';
  formattedTo: string = '';

  showReport: boolean = false;
  showActions: boolean = false;

  generateReport() {
    if (!this.fromDate || !this.toDate) return;

    this.formattedFrom = this.formatDate(this.fromDate);
    this.formattedTo = this.formatDate(this.toDate);

    this.showReport = true;
    this.showActions = true;
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  printReport() {
    window.print();
  }
  trialBalanceRows = [
  {
    particulars: 'Account 1',
    debitFrom: 1000,
    creditFrom: 500,
    debitTo: 1200,
    creditTo: 700,
    periodDebit: 200,
    periodCredit: 200
  },
  {
    particulars: 'Account 2',
    debitFrom: 2000,
    creditFrom: 1500,
    debitTo: 2300,
    creditTo: 1700,
    periodDebit: 300,
    periodCredit: 200
  }
];


}
