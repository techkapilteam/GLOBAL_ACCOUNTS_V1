import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-online-settlement',
  standalone: true,
  imports: [NgxDatatableModule, CommonModule, BsDatepickerModule, FormsModule],
  templateUrl: './online-settlement.component.html',
  styleUrl: './online-settlement.component.css',
})


export class OnlineSettlementComponent {
  SelectionType = SelectionType;
  ChequesInBankForm!: FormGroup;
  today: string = '';
  selected: any[] = [];
  ngOnInit() {
    this.today = this.formatDate(new Date());
  }
  dateConfig = {
    dateInputFormat: 'DD-MMM-YYYY',
    adaptivePosition: true
  };

  receiptDate = new Date();
  clearDate = new Date();

  formatDate(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const d = date.getDate().toString().padStart(2, '0');
    const m = months[date.getMonth()];
    const y = date.getFullYear();

    return `${d}-${m}-${y}`; // 29-Jan-2026
  }
  rows = [
    {
      receiptNo: 'CR123',
      referenceNo: 'REF456',
      branch: 'Hyderabad',
      amount: 5000,
      party: 'Ramesh',
      receiptDate: '12/01/2026',
      depositedDate: '13/01/2026',
      clearDate: '23/01/2026',
      receiptId: 'R001',
      mode: 'CHEQUE',
      upi: 'Paytm'
    },
    {
      receiptNo: 'CR124',
      referenceNo: 'REF999',
      branch: 'Bangalore',
      amount: 7500,
      party: 'Suresh',
      receiptDate: '15/01/2026',
      depositedDate: '16/01/2026',
      clearDate: '—',
      receiptId: 'R002',
      mode: 'UPI',
      upi: 'PhonePe'
    }
  ];

  get grandTotal(): number {
    return this.rows.reduce((sum, r) => sum + r.amount, 0);
  }

  onSelect(event: any) {
    this.selected = [...event.selected];
  }

  get totalAmount() {
    return this.rows.reduce((sum, r) => sum + r.amount, 0);
  }
}

