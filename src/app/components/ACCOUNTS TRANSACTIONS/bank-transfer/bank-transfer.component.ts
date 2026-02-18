import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-bank-transfer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule
  ],
  templateUrl: './bank-transfer.component.html'
})
export class BankTransferComponent implements OnInit {

  transferDate!: Date;
  transferType: string = '';

  showReport = false;

  dpConfig: Partial<BsDatepickerConfig> = {};

  ngOnInit(): void {
    this.transferDate = new Date();

    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      maxDate: new Date()
    };
  }

  show() {
    if (!this.transferDate || !this.transferType) {
      alert('Please select Date and Transfer Type');
      return;
    }
    this.showReport = true;
  }

  pdfOrprint(type: 'Pdf' | 'Print') {
    if (type === 'Print') {
      window.print();
    } else {
      alert('PDF export not implemented in demo mode');
    }
  }

  exportExcel() {
    alert('Excel export not implemented in demo mode');
  }
}
