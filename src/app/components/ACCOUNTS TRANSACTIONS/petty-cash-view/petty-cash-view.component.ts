
import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-petty-cash-view',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule, RouterModule,CurrencyPipe],
    templateUrl: './petty-cash-view.component.html',
  styleUrl: './petty-cash-view.component.css',
})
export class PettyCashViewComponent {

  gridView: any[] = [];
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
    this.gridView = [
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

    this.pageCriteria.totalrows = this.gridView.length;
    this.pageCriteria.TotalPages = Math.ceil(this.gridView.length / this.pageCriteria.pageSize);
  }

  filterDatatable(event: any) {
    let value = event.target.value.toLowerCase();
    this.gridView = this.gridView.filter((d: any) => {
      return (
        d.preceiptdate.toLowerCase().includes(value) ||
        d.preceiptid.toLowerCase().includes(value) ||
        d.pmodofreceipt.toLowerCase().includes(value) ||
        d.pnarration.toLowerCase().includes(value)
      );
    });
  }

  removeHandler(event: any, row: any) {
    alert('View clicked for Receipt No: ' + row.preceiptid);
  }

  onFooterPageChange(event: any) {
    this.pageCriteria.CurrentPage = event.page + 1;
  }
  viewRow(){
    
  }
}
