import { CommonModule, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-pending-transfer',
  imports: [NgxDatatableModule,ReactiveFormsModule,CommonModule,FormsModule,DecimalPipe],
  templateUrl: './pending-transfer.component.html',
  styleUrl: './pending-transfer.component.css',
})
export class PendingTransferComponent {
  reportForm: FormGroup;
  submitted = false;
  showTable = false;

  pendingDaysFilter = '';
  pendingTransferRows: any[] = [];
  filteredRows: any[] = [];
  totalPendingAmount = 0;

  constructor(private fb: FormBuilder) {
    this.reportForm = this.fb.group({
      branch: ['', Validators.required],
      paymentType: ['', Validators.required]
    });
  }

  get f() {
    return this.reportForm.controls;
  }

  generateReport() {
    this.submitted = true;

    if (this.reportForm.invalid) return;

    this.pendingTransferRows = [
      {
        branchName: 'Branch A',
        chitNo: 'CH001',
        subscriberName: 'Ramesh',
        chitStatus: 'Active',
        receiptNo: 'RC1001',
        receiptDate: '12-01-2026',
        trDate: '15-01-2026',
        amount: 25000,
        pendingDays: 5,
        dueMonths: 1,
        referenceNo: 'REF123',
        referenceDate: '10-01-2026',
        bankName: 'SBI'
      },
      {
        branchName: 'Branch B',
        chitNo: 'CH002',
        subscriberName: 'Suresh',
        chitStatus: 'Pending',
        receiptNo: 'RC1002',
        receiptDate: '10-01-2026',
        trDate: '12-01-2026',
        amount: 18000,
        pendingDays: 8,
        dueMonths: 2,
        referenceNo: 'REF456',
        referenceDate: '09-01-2026',
        bankName: 'HDFC'
      }
    ];

    this.filteredRows = [...this.pendingTransferRows];
    this.calculateTotal();
    this.showTable = true;
  }

  applyFilter() {
    const days = Number(this.pendingDaysFilter);
    if (!days) {
      this.filteredRows = [...this.pendingTransferRows];
    } else {
      this.filteredRows = this.pendingTransferRows.filter(x => x.pendingDays >= days);
    }
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalPendingAmount = this.filteredRows.reduce((sum, row) => sum + row.amount, 0);
  }

}
