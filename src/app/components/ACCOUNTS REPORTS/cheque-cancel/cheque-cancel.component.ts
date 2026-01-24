import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-cheque-cancel',
  imports: [CommonModule,FormsModule,NgxDatatableModule],
  templateUrl: './cheque-cancel.component.html',
  styleUrl: './cheque-cancel.component.css',
})
export class ChequeCancelComponent {
  fromDate: string = '';
  toDate: string = '';
  showReport: boolean = false;

  generateReport() {
    if (this.fromDate && this.toDate) {
      this.showReport = true;
    } else {
      this.showReport = false;
    }
  }
  chequeCancelRows = [
  {
    cancelDate: '12-01-2026',
    chequeNo: 'CHQ12345',
    chequeAmt: '₹ 5,000.00',
    bankName: 'SBI',
    receiptNo: 'RCPT001',
    receiptDate: '10-01-2026',
    particulars: 'Cheque Cancelled'
  },
  {
    cancelDate: '15-01-2026',
    chequeNo: 'CHQ67890',
    chequeAmt: '₹ 12,750.00',
    bankName: 'HDFC',
    receiptNo: 'RCPT002',
    receiptDate: '14-01-2026',
    particulars: 'Cheque Cancelled'
  }
];


}
