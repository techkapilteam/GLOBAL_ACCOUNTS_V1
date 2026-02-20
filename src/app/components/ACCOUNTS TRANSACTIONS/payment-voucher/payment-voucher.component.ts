// import { Component } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// import { CommonService } from '../../../services/common.service';
// import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';
// import { PageCriteria } from '../../../Models/pageCriteria';

// @Component({
//   selector: 'app-payment-voucher',
//   imports: [RouterModule,NgxDatatableModule],
//   templateUrl: './payment-voucher.component.html',
//   styleUrl: './payment-voucher.component.css',
// })
// export class PaymentVoucherComponent {
// // rows = [
// //     {
// //       paymentDate: '2024-01-01',
// //       voucherNo: 'PV-001',
// //       paymentDetails: 'CASH',
// //       bankName: '-- NA --',
// //       paidAmount: '$ 1,000.00'
// //     },
// //     {
// //       paymentDate: '2024-01-05',
// //       voucherNo: 'PV-002',
// //       paymentDetails: 'BANK (CHEQUE - 123456)',
// //       bankName: 'HDFC Bank',
// //       paidAmount: '$ 2,500.00'
// //     }
// //   ];

//   // page = {
//   //   limit: 10,
//   //   count: this.rows.length,
//   //   offset: 0
//   // };
//   constructor(private _commonService: CommonService,
//      private _AccountingTransactionsService: AccountingTransactionsService,
//       private router: Router) {
//     this.pageCriteria = new PageCriteria();
//   }


//   getLoadData() {




//   this._AccountingTransactionsService.GetPaymentVoucherExistingData().subscribe({
//     next: (json: any[]) => {
//       if (json && json.length > 0) {

//         this.gridData = json;

//         this.gridData.forEach(row => {
//           row.ppaymentdate = this._commonService.getFormatDateGlobal(row.ppaymentdate);
//         });

//         this.filteredData = [...this.gridData];

//         this.columnsWithSearch = Object.keys(this.gridData[0]);

//         this.pageCriteria.totalrows = this.gridData.length;

//         this.pageCriteria.TotalPages = Math.ceil(this.pageCriteria.totalrows / this.pageCriteria.pageSize);

//         // Current page rows
//         this.pageCriteria.currentPageRows =
//           this.gridData.length < this.pageCriteria.pageSize
//             ? this.gridData.length
//             : this.pageCriteria.pageSize;

//       } else {
//         // Empty dataset
//         this.gridData = [];
//         this.filteredData = [];
//         this.pageCriteria.totalrows = 0;
//         this.pageCriteria.TotalPages = 0;
//         this.pageCriteria.currentPageRows = 0;
//       }
//     },
//     error: (error) => {
//       this._commonService.showErrorMessage(error);
//     }
//   });
// }


// }

import {  RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';
import { PageCriteria } from '../../../Models/pageCriteria';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-payment-voucher',
  templateUrl: './payment-voucher.component.html',
  styleUrls: ['./payment-voucher.component.css'],
  standalone: true, // Angular 20 allows standalone components
  imports: [
    TableModule,
    ButtonModule,
    RouterModule,
    CommonModule,
    
    NgxDatatableModule
  ],
  providers: [CurrencyPipe, DatePipe]
})
export class PaymentVoucherComponent implements OnInit {

  gridData: any[] = [];
  filteredData: any[] = [];
  columnsWithSearch: string[] = [];
  pageCriteria: PageCriteria = new PageCriteria();
  currencySymbol: string = '₹';


  constructor(
    private _commonService: CommonService,
    private _AccountingTransactionsService: AccountingTransactionsService,
    private router: Router,
    private currencyPipe: CurrencyPipe
  ) { }

ngOnInit(): void {
  this.getLoadData();
}

getLoadData(): void {

  this._AccountingTransactionsService
    .GetPaymentVoucherExistingData()
    .subscribe({
      next: (json: any[]) => {

        if (!json || json.length === 0) {
          this.gridData = [];
          this.filteredData = [];
          this.pageCriteria.totalrows = 0;
          this.pageCriteria.TotalPages = 0;
          this.pageCriteria.currentPageRows = 0;
          return;
        }
        this.gridData = json;
        this.gridData.forEach(row => {
          row.ppaymentdate =
            this._commonService.getFormatDateGlobal(row.ppaymentdate);
        });
        this.filteredData = [...this.gridData];
        this.columnsWithSearch = Object.keys(this.gridData[0]);
        this.pageCriteria.totalrows = this.gridData.length;
        this.pageCriteria.TotalPages = Math.ceil(
          this.pageCriteria.totalrows / this.pageCriteria.pageSize
        );
        this.pageCriteria.currentPageRows =
          this.gridData.length < this.pageCriteria.pageSize
            ? this.gridData.length
            : this.pageCriteria.pageSize;
      },
      error: (error) => {
        this._commonService.showErrorMessage(error);
      }
    });
}
removeHandler(event: any, row: any): void {
  console.log('Remove clicked for row:', row);
}
formatCurrency(amount: number): string {
    return this.currencyPipe.transform(amount, 'INR', 'symbol', '1.2-2') || '';
  }

}
