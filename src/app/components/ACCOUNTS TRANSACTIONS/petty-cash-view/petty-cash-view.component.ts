import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-petty-cash-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    CurrencyPipe
  ],
  templateUrl: './petty-cash-view.component.html',
  styleUrl: './petty-cash-view.component.css'
})
export class PettyCashViewComponent {

  gridView: any[] = [];
  originalData: any[] = [];

  pageCriteria = {
    footerPageHeight: 50,
    pageSize: 10,
    CurrentPage: 1,
    TotalPages: 1,
    totalrows: 0,
    offset: 0
  };

  currencySymbol = '₹';

  constructor() {
    this.loadData();
  }

  loadData() {

    this.originalData = [
      {
        preceiptdate: '10/Oct/2024',
        preceiptid: 'GR001',
        pmodofreceipt: 'CASH',
        ptypeofpayment: '',
        pChequenumber: '',
        ptotalreceivedamount: 1000,
        pnarration: 'Test narration'
      },
      {
        preceiptdate: '11/Oct/2024',
        preceiptid: 'GR002',
        pmodofreceipt: 'BANK',
        ptypeofpayment: 'Cheque',
        pChequenumber: '123456',
        ptotalreceivedamount: 2500,
        pnarration: ''
      }
    ];

    this.gridView = [...this.originalData];

    this.pageCriteria.totalrows = this.gridView.length;
    this.pageCriteria.TotalPages =
      Math.ceil(this.gridView.length / this.pageCriteria.pageSize);
  }

  filterDatatable(event: any) {

    const value = event.target.value?.toLowerCase();

    if (!value) {
      this.gridView = [...this.originalData];
      return;
    }

    this.gridView = this.originalData.filter((d: any) =>
      d.preceiptdate.toLowerCase().includes(value) ||
      d.preceiptid.toLowerCase().includes(value) ||
      d.pmodofreceipt.toLowerCase().includes(value) ||
      (d.pnarration && d.pnarration.toLowerCase().includes(value))
    );
  }

  viewRow(row: any) {
    alert('View clicked for Receipt No: ' + row.preceiptid);
  }

}
