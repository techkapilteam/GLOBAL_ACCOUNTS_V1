import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-issued-cheque',
  imports: [NgxDatatableModule,FormsModule,CommonModule],
  templateUrl: './issued-cheque.component.html',
  styleUrl: './issued-cheque.component.css',
})
export class IssuedChequeComponent {
  selectedBank: string = '';
selectedChequeNo: string = '';

unusedChequeRows: any[] = [];
issuedChequeRows: any[] = [];

loadChequeDetails() {
  if (!this.selectedBank || !this.selectedChequeNo) {
    this.unusedChequeRows = [];
    this.issuedChequeRows = [];
    return;
  }

  if (this.selectedBank === 'Bank A' && this.selectedChequeNo === '1001-1010') {
    this.unusedChequeRows = [
      { chequeNo: '1002', bankName: 'Bank A', chequeBookId: 'CB001' },
      { chequeNo: '1005', bankName: 'Bank A', chequeBookId: 'CB001' }
    ];

    this.issuedChequeRows = [
      {
        chequeNo: '1001',
        paymentId: 'PAY123',
        particulars: 'Vendor Payment',
        paymentDate: '12-01-2026',
        clearedDate: '15-01-2026',
        paidAmount: 25000,
        bankName: 'Bank A',
        chequeBookId: 'CB001',
        status: 'Cleared'
      }
    ];
  } else {
    this.unusedChequeRows = [];
    this.issuedChequeRows = [];
  }
}


}
