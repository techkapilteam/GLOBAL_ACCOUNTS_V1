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
    pageSize: 10,
    pageNumber: 1,
    TotalPages: 1,
    totalrows: 0
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
      .GetGeneralReceiptsData(
        'global',
        'accounts',
        'taxes',
       'KAPILCHITS',
        'KLC01'
      )
      .subscribe({
        next: (data: any[]) => {

          this.loading = false;

          if (!data || data.length === 0) {
            this.resetGrid();
            return;
          }
          this.allGridView = data.map(item => ({
            ...item,
            preceiptdate:
              this.commonService.getFormatDateGlobal(item.preceiptdate) || '--',
            pmodofreceipt: item.pmodofreceipt || '--',
            ptypeofpayment: item.ptypeofpayment || '',
            pChequenumber: item.pChequenumber || '',
            ptotalreceivedamount: item.ptotalreceivedamount ?? 0,
            pnarration: item.pnarration || ''
          }));

          this.pageCriteria.totalrows = this.allGridView.length;
          this.pageCriteria.TotalPages = Math.ceil(
            this.allGridView.length / this.pageCriteria.pageSize
          );

          this.updatePagedData();
        },
        error: (error) => {
          this.loading = false;
          this.resetGrid();
          this.commonService.showErrorMessage(error);
        }
      });
  }
  onFooterPageChange(event: any): void {

    this.pageCriteria.pageNumber = event.page + 1;
    this.pageCriteria.pageSize = event.rows;

    this.updatePagedData();
  }

  updatePagedData(): void {

    const startIndex =
      (this.pageCriteria.pageNumber - 1) * this.pageCriteria.pageSize;

    const endIndex =
      startIndex + this.pageCriteria.pageSize;

    this.gridView = this.allGridView.slice(startIndex, endIndex);
  }
  filterDatatable(event: any): void {

    const value = (event.target.value || '').toLowerCase();

    if (!value) {
      this.pageCriteria.pageNumber = 1;
      this.pageCriteria.totalrows = this.allGridView.length;
      this.pageCriteria.TotalPages = Math.ceil(
        this.allGridView.length / this.pageCriteria.pageSize
      );
      this.updatePagedData();
      return;
    }

    const filtered = this.allGridView.filter(d =>
      (d.preceiptdate?.toLowerCase() || '').includes(value) ||
      (d.preceiptid?.toString().toLowerCase() || '').includes(value) ||
      (d.pmodofreceipt?.toLowerCase() || '').includes(value) ||
      (d.pnarration?.toLowerCase() || '').includes(value)
    );

    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.totalrows = filtered.length;
    this.pageCriteria.TotalPages = Math.ceil(
      filtered.length / this.pageCriteria.pageSize
    );

    this.gridView = filtered.slice(0, this.pageCriteria.pageSize);
  }
  viewRow(row: any): void {

    const receipt = btoa(
      `${row.preceiptid},General Receipt,,${this.commonService.getschemaname()}`
    );

    window.open(`/#/GeneralReceiptReport?id=${receipt}`, '_blank');
  }
  private resetGrid(): void {
    this.gridView = [];
    this.allGridView = [];
    this.pageCriteria.totalrows = 0;
    this.pageCriteria.TotalPages = 1;
  }
}
