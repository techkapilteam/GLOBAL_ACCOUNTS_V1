import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-day-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    BsDatepickerModule
  ],
  templateUrl: './day-book.component.html',
  styleUrls: ['./day-book.component.css'],
  providers: [DatePipe]
})
export class DayBookComponent implements OnInit {

  private fb = inject(FormBuilder);
  private datePipe = inject(DatePipe);

  Daybook!: FormGroup;
  isSingleDate = true;
  showGrid = false;

  today = new Date();
  dpConfig: Partial<BsDatepickerConfig> = {};

  transactions: any[] = [];
  bankSummary: any[] = [];

  StartDate: Date | null = null;
  EndDate: Date | null = null;
  
  isKgmsChecked = false;

  constructor() {
    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false
    };
  }

  ngOnInit(): void {
    this.Daybook = this.fb.group({
      date: [true],
      dfromdate: [this.today, Validators.required],
      dtodate: [this.today, Validators.required],
      branch: ['']
    });
  }

  checkox(event: any) {
    this.isSingleDate = event.target.checked;
  }

  toggleKgmsGenerate(event: any) {
    this.isKgmsChecked = event.target.checked;
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

    this.StartDate = new Date(this.Daybook.value.dfromdate);
    this.EndDate = this.isSingleDate
      ? this.StartDate
      : new Date(this.Daybook.value.dtodate);
   
    this.transactions = [
      { rTxn: 'R001', rPart: 'Cash Receipt', rType: 'Cash', amount: 5000, pTxn: 'P001', pPart: 'Office Expense', pType: 'Cash' },
      { rTxn: 'R002', rPart: 'Online Receipt', rType: 'Online', amount: 12000, pTxn: 'P002', pPart: 'Bank Transfer', pType: 'Online' }
    ];

    this.bankSummary = [
      { bank: this.Daybook.value.branch, opening: '₹ 9,89,39,559.97 Dr', receipts: '₹ 12,000', payments: '₹ 5,000', closing: '₹ 9,89,46,559.97 Dr' }
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
    this.showGrid = false;
    this.transactions = [];
    this.bankSummary = [];

    setTimeout(() => {
      this.loadGrid();
      this.showGrid = true;
    }, 50);
  }

  getsummaryReport() {
  
    if (!this.Daybook.value.branch) {
      alert('Please select Branch');
      this.showGrid = false;
      return;
    }
   
    this.showGrid = false;
    this.transactions = [];
    this.bankSummary = [];
    
    setTimeout(() => {
      this.loadGrid();
      this.showGrid = true;
    }, 50);
  }

  formatDate(date: Date | string | null): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
  }

 
  pdfOrprint(type: 'Pdf' | 'Print') {
    if (type === 'Print') {
      window.print();
    } else {
      alert('PDF export not implemented');
    }
  }
}
