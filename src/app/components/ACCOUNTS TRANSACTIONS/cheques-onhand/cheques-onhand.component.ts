import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-cheques-onhand',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgxDatatableModule, CommonModule, BsDatepickerModule],
  providers: [DatePipe],
  templateUrl: './cheques-onhand.component.html'
})
export class ChequesOnhandComponent {

  datePipe = inject(DatePipe);

  activeTab: string = 'ALL';
  showCheckbox: boolean = true;


  selectedDate: Date = new Date();
  brsDate: Date = new Date();
  brsFromDate: Date = new Date();
  brsToDate: Date = new Date();
  selectedBank: string = '';

  dpConfig: Partial<BsDatepickerConfig> = {};

  gridData: any[] = [];

  ngOnInit(): void {
    this.setTab('ALL');

    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false
    };
  }

  setTab(tab: string): void {
    this.activeTab = tab;
    this.gridData = [];
    this.showCheckbox = true;

    if (tab === 'ALL' || tab === 'CHEQUE') {
      this.showCheckbox = true;
      this.gridData = [
        {
          cheque: '03560',
          branch: 'KADAPA-CAO',
          amount: 4217422,
          party: 'Kapil Chits (Rayalaseema) Private Limited(KRKL02J-24)',
          receiptDate: new Date('2025-11-24'),
          chequeDate: new Date('2025-11-24'),
          receiptNo: '14534',
          receiptId: '14534',
          mode: 'CHEQUE',
          bank: 'Union Bank Of India'
        }
      ];
    }

    if (tab === 'ONLINE') {
      this.showCheckbox = true;
      this.gridData = [];
    }

    if (tab === 'DEPOSITED') {
      this.showCheckbox = false;
      this.gridData = [
        {
          cheque: '02548',
          branch: 'HYDERABAD',
          amount: 157400700,
          party: 'Kapil Chits',
          receiptDate: new Date('2025-12-05'),
          chequeDate: new Date('2025-12-05'),
          depositedDate: new Date('2025-12-05'),
          receiptNo: '9988',
          receiptId: '9988',
          mode: 'CHEQUE',
          bank: 'Union Bank Of India'
        }
      ];
    }

    if (tab === 'CANCELLED') {
      this.showCheckbox = false;
      this.gridData = [
        {
          cheque: '01452',
          branch: 'KADAPA',
          amount: 4059837,
          party: 'Kapil Chits',
          receiptDate: new Date('2025-12-05'),
          chequeDate: new Date('2025-12-05'),
          cancelledDate: new Date('2025-12-05'),
          receiptNo: '5544',
          receiptId: '5544',
          mode: 'CHEQUE',
          bank: 'Union Bank Of India'
        }
      ];
    }
  }

  get showActionColumns(): boolean {
    return this.activeTab !== 'DEPOSITED' && this.activeTab !== 'CANCELLED';
  }

  isAllSelected(): boolean {
    return this.gridData?.length > 0 && this.gridData.every(row => row.selected);
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.gridData.forEach(row => row.selected = checked);
  }

  formatDate(date: Date | string | null): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
  }
}
