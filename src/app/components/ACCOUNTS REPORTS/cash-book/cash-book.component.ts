import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-cash-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    BsDatepickerModule
  ],
  templateUrl: './cash-book.component.html',
  styleUrl: './cash-book.component.css'
})
export class CashBookComponent implements OnInit {

  today: Date = new Date();
  fromDate: Date = this.today;
  toDate: Date = this.today;

  transactionType: string = '';

  show = true;

  gridView: any[] = [];

  dpConfig: Partial<BsDatepickerConfig> = {};

  ngOnInit(): void {
    this.dpConfig = {
      maxDate: new Date(),
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD-MMM-YYYY',
      showWeekNumbers: false
    };
  }

  GenerateReport() {
    if (!this.fromDate || !this.toDate || !this.transactionType) {
      alert('Please select From Date, To Date and Transaction Type');
      return;
    }

    this.show = false;
    this.gridView = this.getDummyData();
  }

  getDummyData() {
    return [
      { ptransactiondate: '01-Feb-2026', description: 'Opening Balance', amount: 10000 },
      { ptransactiondate: '04-Feb-2026', description: 'Cash Receipt', amount: 5000 },
      { ptransactiondate: '05-Feb-2026', description: 'Office Expense', amount: -2000 },
      { ptransactiondate: '06-Feb-2026', description: 'Cash Receipt', amount: 3000 }
    ];
  }

  pdfOrprint(type: 'Pdf' | 'Print') {
    if (type === 'Print') {
      window.print();
    } else {
      alert('PDF export not implemented');
    }
  }

  exportExcel() {
    alert('Excel export not implemented');
  }
}
