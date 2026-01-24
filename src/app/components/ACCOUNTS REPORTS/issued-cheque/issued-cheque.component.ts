import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-issued-cheque',
  imports: [NgxDatatableModule,FormsModule],
  templateUrl: './issued-cheque.component.html',
  styleUrl: './issued-cheque.component.css',
})
export class IssuedChequeComponent {
  unusedChequeRows = [
  { selected: false, chequeNo: '1001', bankName: 'Bank A', chequeBookId: 'CHB001' },
  { selected: false, chequeNo: '1002', bankName: 'Bank A', chequeBookId: 'CHB001' }
];

issuedChequeRows = [
  {
    chequeNo: '1001',
    paymentId: 'PID001',
    particulars: 'Payment to Vendor',
    paymentDate: '01-01-2026',
    clearedDate: '05-01-2026',
    paidAmount: '5,000.00',
    bankName: 'Bank A',
    chequeBookId: 'CHB001',
    status: 'Issued'
  },
  {
    chequeNo: '1002',
    paymentId: 'PID002',
    particulars: 'Payment to Vendor',
    paymentDate: '02-01-2026',
    clearedDate: '06-01-2026',
    paidAmount: '7,500.00',
    bankName: 'Bank A',
    chequeBookId: 'CHB001',
    status: 'Issued'
  }
];


}
