import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gst-report',
  imports: [FormsModule,CommonModule],
  templateUrl: './gst-report.component.html',
  styleUrl: './gst-report.component.css',
})
export class GstReportComponent {
   reportType: 'receipts' | 'payments' = 'receipts';

  ledger: string = '';
  month: string = '';
  fromDate: string = '';
  toDate: string = '';
  gstData: any[] = [];

  onTypeChange(type: 'receipts' | 'payments') {
    this.reportType = type;

    this.ledger = '';
    this.month = '';
    this.fromDate = '';
    this.toDate = '';
    this.gstData = [];
  }

  showReport() {
    console.log('Report Type:', this.reportType);
    console.log('Ledger:', this.ledger);
    console.log('Month:', this.month);
    console.log('From:', this.fromDate);
    console.log('To:', this.toDate);
    this.gstData = [];
  }

  showSummary() {
    console.log('GST Summary clicked');
  }


}
