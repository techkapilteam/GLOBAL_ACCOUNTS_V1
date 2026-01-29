import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-cheque-return',
  imports: [FormsModule,CommonModule,NgxDatatableModule],
  templateUrl: './cheque-return.component.html',
  styleUrl: './cheque-return.component.css',
})
export class ChequeReturnComponent {
  fromDate!: string;
toDate!: string;
showReport = false;
chequeReturnRows = [
  {
    returnDate: '12-01-2026',
    chequeNo: '123456',
    chequeAmt: '$1,000.00',
    bankName: 'Bank ABC',
    receiptNo: 'R001',
    receiptDate: '10-01-2026',
    particulars: 'Payment Particulars',
    referredBy: 'Branch XYZ'
  }
];


}
