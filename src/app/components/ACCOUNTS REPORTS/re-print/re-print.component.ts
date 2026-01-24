import { Component } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-re-print',
  imports: [NgxDatatableModule],
  templateUrl: './re-print.component.html',
  styleUrl: './re-print.component.css',
})
export class RePrintComponent {
  reprintRows = [
  {
    trReceiptNo: 'TR001',
    receiptDate: '01/01/2026',
    receiptNo: 'R001',
    chitNo: 'CHT001',
    amount: '10,000.00'
  },
  {
    trReceiptNo: 'TR002',
    receiptDate: '02/01/2026',
    receiptNo: 'R002',
    chitNo: 'CHT002',
    amount: '15,500.00'
  }
];

get totalAmount(): string {
  const total = this.reprintRows
    .map(x => parseFloat(x.amount.replace(/,/g, '')))
    .reduce((a, b) => a + b, 0);
  return total.toLocaleString('en-IN', { minimumFractionDigits: 2 });
}


}
