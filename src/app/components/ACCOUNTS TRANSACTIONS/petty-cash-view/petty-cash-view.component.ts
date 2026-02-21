import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { PageCriteria } from '../../../Models/pageCriteria';
import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';
import { CommonService } from '../../../services/common.service';

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
  styleUrls: ['./petty-cash-view.component.css']
})
export class PettyCashViewComponent implements OnInit {
  public gridData: any[] = [];
  public gridView: any[] = [];
  public filteredData: any[] = [];
  public list: any[] = [];
  public columnsWithSearch: string[] = [];
  public currencySymbol!: string;

  pageCriteria: PageCriteria;

  constructor(
    private _commonService: CommonService,
    private _AccountingTransactionsService: AccountingTransactionsService,
    private router: RouterModule
  ) {
    this.pageCriteria = new PageCriteria();
  }

  ngOnInit(): void {
    this.setPageModel();
    this.getLoadData();


    this.currencySymbol = this._commonService.currencysymbol
      ? this._commonService.currencysymbol
      : '₹';
  }

  setPageModel() {
    this.pageCriteria.pageSize = this._commonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }


  getLoadData(): void {

  this._AccountingTransactionsService
    .GetPettyCashExistingData()
    .subscribe({
      next: (json: any[]) => {

        if (!json || json.length === 0) {
          this.gridData = [];
          this.gridView = [];
          this.filteredData = [];
          this.pageCriteria.totalrows = 0;
          this.pageCriteria.TotalPages = 0;
          return;
        }

        this.gridData = json;
        this.gridView = [...json];
        this.list = json;

        this.gridView.forEach((data: any) => {
          data.preceiptdate =
            this._commonService.getFormatDateGlobal(data.preceiptdate);
        });

        this.filteredData = [...this.gridView];

        this.columnsWithSearch =
          this.gridView.length > 0 ? Object.keys(this.gridView[0]) : [];

        this.pageCriteria.totalrows = this.gridView.length;
        this.pageCriteria.TotalPages = Math.ceil(
          this.pageCriteria.totalrows / this.pageCriteria.pageSize
        );

        this.pageCriteria.currentPageRows =
          this.gridView.length < this.pageCriteria.pageSize
            ? this.gridView.length
            : this.pageCriteria.pageSize;
      },
      error: (error) => {
        this._commonService.showErrorMessage(error);
      }
    });
}
  viewRow(row: any) {
    const receipt = btoa(row.preceiptid + ',' + 'Petty Cash');
    window.open('/#/PaymentVoucherReport?id=' + receipt, '_blank');
  }

  filterDatatable(event: any) {
    const filter = event.target.value.toLowerCase();
    this.gridView = this.filteredData.filter((item) => {
      for (let i = 0; i < this.columnsWithSearch.length; i++) {
        const colValue = item[this.columnsWithSearch[i]];
        if (
          !filter ||
          (!!colValue &&
            colValue.toString().toLowerCase().indexOf(filter) !== -1)
        ) {
          return true;
        }
      }
      return false;
    });
    this.pageCriteria.offset = 0;
  }
}

// @Component({
//   selector: 'app-petty-cash-view',
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterModule,
//     TableModule,
//     CurrencyPipe
//   ],
//   templateUrl: './petty-cash-view.component.html',
//   styleUrl: './petty-cash-view.component.css'
// })
// export class PettyCashViewComponent {

//   gridView: any[] = [];
//   originalData: any[] = [];

//   pageCriteria = {
//     footerPageHeight: 50,
//     pageSize: 10,
//     CurrentPage: 1,
//     TotalPages: 1,
//     totalrows: 0,
//     offset: 0
//   };

//   currencySymbol = '₹';

//   constructor() {
//     this.loadData();
//   }

//   loadData() {

//     this.originalData = [
//       {
//         preceiptdate: '10/Oct/2024',
//         preceiptid: 'GR001',
//         pmodofreceipt: 'CASH',
//         ptypeofpayment: '',
//         pChequenumber: '',
//         ptotalreceivedamount: 1000,
//         pnarration: 'Test narration'
//       },
//       {
//         preceiptdate: '11/Oct/2024',
//         preceiptid: 'GR002',
//         pmodofreceipt: 'BANK',
//         ptypeofpayment: 'Cheque',
//         pChequenumber: '123456',
//         ptotalreceivedamount: 2500,
//         pnarration: ''
//       }
//     ];

//     this.gridView = [...this.originalData];

//     this.pageCriteria.totalrows = this.gridView.length;
//     this.pageCriteria.TotalPages =
//       Math.ceil(this.gridView.length / this.pageCriteria.pageSize);
//   }

//   filterDatatable(event: any) {

//     const value = event.target.value?.toLowerCase();

//     if (!value) {
//       this.gridView = [...this.originalData];
//       return;
//     }

//     this.gridView = this.originalData.filter((d: any) =>
//       d.preceiptdate.toLowerCase().includes(value) ||
//       d.preceiptid.toLowerCase().includes(value) ||
//       d.pmodofreceipt.toLowerCase().includes(value) ||
//       (d.pnarration && d.pnarration.toLowerCase().includes(value))
//     );
//   }

//   viewRow(row: any) {
//     alert('View clicked for Receipt No: ' + row.preceiptid);
//   }

// }
