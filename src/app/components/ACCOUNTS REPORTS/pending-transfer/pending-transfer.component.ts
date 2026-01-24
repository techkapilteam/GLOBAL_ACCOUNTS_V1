import { Component } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-pending-transfer',
  imports: [NgxDatatableModule],
  templateUrl: './pending-transfer.component.html',
  styleUrl: './pending-transfer.component.css',
})
export class PendingTransferComponent {
  pendingTransferRows = [
  {
    branchName: 'Branch A',
    chitNo: 'CHT001',
    subscriberName: 'John Doe',
    chitStatus: 'Active',
    receiptNo: 'R001',
    receiptDate: '01-01-2026',
    trDate: '02-01-2026',
    amount: '10,000.00',
    pendingDays: 5,
    dueMonths: 1,
    referenceNo: 'REF001',
    referenceDate: '03-01-2026',
    bankName: 'Bank A'
  },
  {
    branchName: 'Branch B',
    chitNo: 'CHT002',
    subscriberName: 'Jane Smith',
    chitStatus: 'Pending',
    receiptNo: 'R002',
    receiptDate: '02-01-2026',
    trDate: '03-01-2026',
    amount: '15,500.00',
    pendingDays: 3,
    dueMonths: 1,
    referenceNo: 'REF002',
    referenceDate: '04-01-2026',
    bankName: 'Bank B'
  }
];

get totalPendingAmount(): string {
  const total = this.pendingTransferRows
    .map(x => parseFloat(x.amount.replace(/,/g, '')))
    .reduce((a, b) => a + b, 0);
  return total.toLocaleString('en-IN', { minimumFractionDigits: 2 });
}


}
