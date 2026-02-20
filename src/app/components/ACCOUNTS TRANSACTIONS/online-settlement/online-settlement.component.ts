import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-online-settlement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,  
    BsDatepickerModule,
    TableModule,
    NgSelectModule
  ],
  templateUrl: './online-settlement.component.html',
  styleUrls: ['./online-settlement.component.css'],
  providers: [DatePipe]
})
export class OnlineSettlementComponent implements OnInit {

  
  ChequesInBankForm!: FormGroup;

  
  gridData: any[] = [];
  selected: any[] = [];

  
  bankList: any[] = [];
  PaytmList: any[] = [];

 
  currencySymbol = '₹';
  bankbalance = 0;
  bankbalancetype = 'Dr';
  brsdate = '';

  
  today = '';
  receiptDate!: Date;
  clearDate!: Date;

  dpConfig: Partial<BsDatepickerConfig> = {};
  ptransactiondateConfig: Partial<BsDatepickerConfig> = {};
  pchequecleardateConfig: Partial<BsDatepickerConfig> = {};

  private datePipe = inject(DatePipe);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  
  ngOnInit(): void {

    const todayDate = new Date();
    this.today = this.formatDate(todayDate);

    
    this.ChequesInBankForm = this.fb.group({
      ptransactiondate: [todayDate],
      pchequereceiptdate: [todayDate],
      pchequecleardate: [todayDate],
      bankname: [''],
      paytmname: [''],
      chequeintype: ['A'],
      searchtext: ['']
    });

    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      showWeekNumbers: false,
      maxDate: new Date()
    };

    this.ptransactiondateConfig = this.dpConfig;
    this.pchequecleardateConfig = this.dpConfig;

    this.loadBanks();
    this.loadDataFromBackend();
  }

  loadBanks(): void {
    this.http.get<any[]>('YOUR_BANK_API_URL')
      .subscribe({
        next: (res) => {
          this.bankList = res || [];
          this.PaytmList = res || []; 
        },
        error: (err) => {
          console.error('Bank API Error:', err);
        }
      });
  }

  loadDataFromBackend(): void {
    this.http.get<any[]>('YOUR_GRID_API_URL')
      .subscribe({
        next: (response) => {
          this.gridData = response || [];
        },
        error: (error) => {
          console.error('Grid API Error:', error);
        }
      });
  }

  onSearch(value: string): void {
    if (!value) {
      this.loadDataFromBackend();
      return;
    }

    const search = value.toLowerCase();
    this.gridData = this.gridData.filter(item =>
      JSON.stringify(item).toLowerCase().includes(search)
    );
  }

  formatDate(date: Date | string | null): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
  }

  getSelectedTotal(): number {
    return this.selected.reduce(
      (sum, row) => sum + (row.ptotalreceivedamount || 0),
      0
    );
  }

  clearSelection(): void {
    this.selected = [];
  }

  Save(): void {
    console.log('Selected Rows:', this.selected);
  }
}
