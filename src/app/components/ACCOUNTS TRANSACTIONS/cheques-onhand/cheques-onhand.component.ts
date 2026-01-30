import { CommonModule, DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cheques-onhand',
  imports: [FormsModule,ReactiveFormsModule,NgxDatatableModule,CommonModule,BsDatepickerModule],
  standalone:true,
  providers:[DatePipe],
  templateUrl: './cheques-onhand.component.html',
  styleUrl: './cheques-onhand.component.css',

})
export class ChequesOnhandComponent {

    
  activeTab: string = 'ALL';
  showCheckbox: boolean = true;
  gridData: any[] = [];
  ngOnInit(): void {
    this.setTab('ALL'); 
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
          receiptDate: '24-Nov-2025',
          chequeDate: '24-Nov-2025',
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
          receiptDate: '05-Dec-2025',
          chequeDate: '05-Dec-2025',
          depositedDate: '05-Dec-2025',
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
          receiptDate: '05-Dec-2025',
          chequeDate: '05-Dec-2025',
          cancelledDate: '05-Dec-2025',
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
  return this.gridData?.length > 0 &&
         this.gridData.every(row => row.selected);
}

toggleAll(event: Event): void {
  const checked = (event.target as HTMLInputElement).checked;
  this.gridData.forEach(row => row.selected = checked);
}
}



