import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-jv-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule,
    NgxDatatableModule
  ],
  templateUrl: './jv-list.component.html',
  providers: [DatePipe]
})
export class JvListComponent implements OnInit {
  private datePipe = inject(DatePipe);

  fromDate!: Date;
  toDate!: Date;

  pformname = '';
  ptranstype = '';

  dpConfig: Partial<BsDatepickerConfig> = {};
  rows: any[] = [];

  ngOnInit(): void {
    const today = new Date();
    this.fromDate = today;
    this.toDate = today;

    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      maxDate: new Date()
    };
  }

  generateReport() {
    if (!this.fromDate || !this.toDate || !this.pformname || !this.ptranstype) {
      alert('Please select all fields');
      return;
    }

  
    this.rows = [
      { particulars: 'Transaction A', debit: 1000, credit: 0 },
      { particulars: 'Transaction B', debit: 0, credit: 500 },
      { particulars: 'Transaction C', debit: 200, credit: 0 }
    ];
  }

  formatDate(date: Date | string | null): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
  }

  get totalDebit(): number {
    return this.rows.reduce((sum, r) => sum + r.debit, 0);
  }

  get totalCredit(): number {
    return this.rows.reduce((sum, r) => sum + r.credit, 0);
  }
}
