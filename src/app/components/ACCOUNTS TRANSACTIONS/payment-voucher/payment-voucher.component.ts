import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-payment-voucher',
  imports: [RouterModule,NgxDatatableModule],
  templateUrl: './payment-voucher.component.html',
  styleUrl: './payment-voucher.component.css',
})
export class PaymentVoucherComponent {
rows = [
    {
      paymentDate: '2024-01-01',
      voucherNo: 'PV-001',
      paymentDetails: 'CASH',
      bankName: '-- NA --',
      paidAmount: '$ 1,000.00'
    },
    {
      paymentDate: '2024-01-05',
      voucherNo: 'PV-002',
      paymentDetails: 'BANK (CHEQUE - 123456)',
      bankName: 'HDFC Bank',
      paidAmount: '$ 2,500.00'
    }
  ];

  page = {
    limit: 10,
    count: this.rows.length,
    offset: 0
  };

}
