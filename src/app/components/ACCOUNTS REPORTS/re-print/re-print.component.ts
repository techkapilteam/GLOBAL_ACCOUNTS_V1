import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-re-print',
  imports: [NgxDatatableModule,ReactiveFormsModule,CommonModule],
  templateUrl: './re-print.component.html',
  styleUrl: './re-print.component.css',
})
export class RePrintComponent {
  reprintForm!: FormGroup;
  submitted = false;
  showTable = false;

  reprintRows: any[] = [];
  filteredRows: any[] = [];
  totalAmount = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.reprintForm = this.fb.group({
      transactionType: ['', Validators.required],
      transactionNo: ['', Validators.required]
    });
  }

  get f() {
    return this.reprintForm.controls;
  }

  generateReport() {
    this.submitted = true;

    if (this.reprintForm.invalid) {
      this.showTable = false;
      return;
    }

    this.showTable = true;

    // Dummy data (replace with API response)
    this.reprintRows = [
      { trReceiptNo: 'TR001', receiptDate: '12-01-2026', receiptNo: 'R001', chitNo: 'CH101', amount: 5000 },
      { trReceiptNo: 'TR002', receiptDate: '13-01-2026', receiptNo: 'R002', chitNo: 'CH102', amount: 7000 }
    ];

    this.filteredRows = [...this.reprintRows];
    this.calculateTotal();
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    this.filteredRows = this.reprintRows.filter(d =>
      d.trReceiptNo.toLowerCase().includes(val) ||
      d.receiptNo.toLowerCase().includes(val) ||
      d.chitNo.toLowerCase().includes(val)
    );

    this.calculateTotal();
  }

  calculateTotal() {
    this.totalAmount = this.filteredRows.reduce((sum, row) => sum + Number(row.amount), 0);
  }


}
