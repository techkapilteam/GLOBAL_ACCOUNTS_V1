import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-day-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ],
  templateUrl: './day-book.component.html'
})
export class DayBookComponent implements OnInit {

  Daybook!: FormGroup;
  isSingleDate: boolean = true;
  showGrid: boolean = false;
 
  today: string = new Date().toISOString().split('T')[0];

  transactions: any[] = [];
  bankSummary: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.Daybook = this.fb.group({
      date: [true],
      dfromdate: [this.today],
      dtodate: [this.today],
      branch: ['']
    });
  }

  checkox(event: any) {
    this.isSingleDate = event.target.checked;
    this.Daybook.get('date')?.setValue(this.isSingleDate);
  }

  checkboxx(event: any) {}

  private validateInputs(): boolean {
    if (this.isSingleDate) {
      if (!this.Daybook.value.dfromdate) {
        alert('Please select Date');
        return false;
      }
    } else {
      if (!this.Daybook.value.dfromdate || !this.Daybook.value.dtodate) {
        alert('Please select From Date and To Date');
        return false;
      }
    }
    return true;
  }

  private loadGrid() {
    this.showGrid = true;

    this.transactions = [
      {
        rTxn: 'R001',
        rPart: 'Cash Receipt',
        rType: 'Cash',
        amount: 5000,
        pTxn: 'P001',
        pPart: 'Office Expense',
        pType: 'Cash'
      },
      {
        rTxn: 'R002',
        rPart: 'Online Receipt',
        rType: 'Online',
        amount: 12000,
        pTxn: 'P002',
        pPart: 'Bank Transfer',
        pType: 'Online'
      }
    ];

    this.bankSummary = [
      {
        bank: 'UNION BANK OF INDIA',
        opening: '₹ 9,89,39,559.97 Dr',
        receipts: '₹ 12,000',
        payments: '₹ 5,000',
        closing: '₹ 9,89,46,559.97 Dr'
      },
      {
        bank: 'STATE BANK OF INDIA',
        opening: '₹ 5,45,14,713.69 Dr',
        receipts: '₹ 8,000',
        payments: '₹ 2,500',
        closing: '₹ 5,45,20,213.69 Dr'
      }
    ];
  }

  getdaybookdata() {
    if (this.validateInputs()) {
      this.loadGrid();
    } else {
      this.showGrid = false;
    }
  }

  GetChequeonHandDetails() {
    this.loadGrid();
  }

  getsummaryReport() {
    if (!this.Daybook.value.branch) {
      alert('Please select Branch');
      this.showGrid = false;
      return;
    }
    this.loadGrid();
  }

  exportPDF() { console.log('Export PDF'); }
  printReport() { window.print(); }
  exportExcel() { console.log('Export Excel'); }
}
