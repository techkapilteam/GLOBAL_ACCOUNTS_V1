import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { CommonService } from '../../../services/common.service';
import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';

@Component({
  selector: 'app-general-receipt',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule],
  templateUrl: './general-receipt.component.html'
})
export class GeneralReceiptComponent implements OnInit {

  gridView: any[] = [];
  allGridView: any[] = [];

  pageCriteria = {
    footerPageHeight: 50,
    pageSize: 10,
    pageNumber: 1,
    TotalPages: 1,
    totalrows: 0,
    offset: 0
  };

  currencySymbol: string = '₹';
  loading: boolean = false;

  constructor(
    private commonService: CommonService,
    private accountingTransactionsService: AccountingTransactionsService
  ) {}

  ngOnInit(): void {
    this.currencySymbol = this.commonService.currencysymbol || '₹';
    this.loadData();
  }

  loadData(): void {

    this.loading = true;

    this.accountingTransactionsService
      .GetGeneralReceiptExistingData()
      .subscribe({
        next: (data: any[]) => {

          this.loading = false;

          if (!data || data.length === 0) {
            this.gridView = [];
            this.allGridView = [];
            this.pageCriteria.totalrows = 0;
            this.pageCriteria.TotalPages = 0;
            return;
          }

          // Format and normalize API data
          this.gridView = data.map(item => ({
            ...item,
            preceiptdate:
              this.commonService.getFormatDateGlobal(item.preceiptdate) || '--',
            pmodofreceipt: item.pmodofreceipt || '--',
            ptypeofpayment: item.ptypeofpayment || '',
            pChequenumber: item.pChequenumber || '',
            ptotalreceivedamount: item.ptotalreceivedamount ?? 0,
            pnarration: item.pnarration || ''
          }));

          this.allGridView = [...this.gridView];

          this.pageCriteria.totalrows = this.gridView.length;
          this.pageCriteria.TotalPages = Math.ceil(
            this.gridView.length / this.pageCriteria.pageSize
          );
        },
        error: (error) => {
          this.loading = false;
          this.gridView = [];
          this.allGridView = [];
          this.pageCriteria.totalrows = 0;
          this.pageCriteria.TotalPages = 1;
          this.commonService.showErrorMessage(error);
        }
      });
  }

  filterDatatable(event: any): void {
    const value = (event.target.value || '').toLowerCase();

    this.gridView = this.allGridView.filter(d =>
      (d.preceiptdate?.toLowerCase() || '').includes(value) ||
      (d.preceiptid?.toString().toLowerCase() || '').includes(value) ||
      (d.pmodofreceipt?.toLowerCase() || '').includes(value) ||
      (d.pnarration?.toLowerCase() || '').includes(value)
    );

    this.pageCriteria.totalrows = this.gridView.length;
    this.pageCriteria.TotalPages = Math.ceil(
      this.gridView.length / this.pageCriteria.pageSize
    );
    this.pageCriteria.pageNumber = 1;
  }

  onFooterPageChange(event: any): void {
    this.pageCriteria.pageNumber = event.page + 1;
  }

  viewRow(row: any): void {
    const receipt = btoa(
      `${row.preceiptid},General Receipt,,${this.commonService.getschemaname()}`
    );
    window.open(`/#/GeneralReceiptReport?id=${receipt}`, '_blank');
  }
}