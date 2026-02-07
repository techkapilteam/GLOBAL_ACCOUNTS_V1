// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-journal-voucher-view',
//   imports: [],
//   templateUrl: './journal-voucher-view.component.html',
//   styleUrl: './journal-voucher-view.component.css',
// })
// export class JournalVoucherViewComponent {

// }
import { Component, OnInit, ViewChild } from '@angular/core';
// import { CommonService } from 'src/app/Services/common.service';
// import { AccountingTransactionsService } from 'src/app/Services/Transactions/AccountingTransactions/accounting-transactions.service';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Router, RouterLink } from '@angular/router';
import { PageCriteria } from '../../../Models/pageCriteria';
import { Table, TableModule } from 'primeng/table';
import { CurrencyPipe } from '@angular/common';
// import { PageCriteria } from 'src/app/Models/pagecriteria';
// import { PageCriteria } from '../Models/pageCriteria';
// import { CurrencyPipe } from '@angular/common';
// import { CustomCurrencyPipe } from '../pipes/custom-currency-pipe';
@Component({
  selector: 'app-journal-voucher-view',
  imports: [NgxDatatableModule,TableModule,
    CurrencyPipe,
    // CustomCurrencyPipe,
    RouterLink
  ],
  templateUrl: './journal-voucher-view.component.html',
  styleUrl: './journal-voucher-view.component.css',
})

export class JournalVoucherViewComponent  {
[x: string]: any;
  //@ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public Journalvoucherlist: any[] = [];
  //public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[] = [];
  public gridData: any;
  public gridView: any;

  currencySymbol: any;
  filteredData = [];
  columnsWithSearch: string[] = [];
  // public gridState: State = {
  //   sort: [],
  //   skip: 0,
  //   take: 10
  // };
  public headerCells: any = {
    textAlign: 'center'
  };
  pageCriteria: PageCriteria;

  //public selectableSettings: SelectableSettings;
  @ViewChild(DatatableComponent)
  myTable!: DatatableComponent;
  constructor(
    // private _commonService: CommonService,
    //  private _AccountingTransactionsService: AccountingTransactionsService,
      private router: Router) {
    //this.allData = this.allData.bind(this);
    this.pageCriteria = new PageCriteria();

  }

  ngOnInit() {

    this.getLoadData();
    this.setPageModel();
    // this.currencySymbol = this._commonService.currencysymbol;
  }

currencyCode = 'INR';

  getLoadData() {

    // this._AccountingTransactionsService.GetJournalVoucherData().subscribe(json => {
    //   debugger;
    //   if (json != null) {
    //     this.gridData = json
    //     this.gridView = json;
    //     this.Journalvoucherlist = this.gridData;
    //     // this.gridData.filter(data => {
    //     //   data.pjvdate = this._commonService.getFormatDateGlobal(data.pjvdate);
    //     // });


    //     // custom page navigation
    //     this.pageCriteria.totalrows = this.gridData.length;
    //     this.pageCriteria.TotalPages = 1;
    //     if (this.pageCriteria.totalrows > this.pageCriteria.pageSize)
    //       this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / this.pageCriteria.pageSize).toString()) + 1;
    //     if (this.gridData.length < this.pageSize) {
    //       this.pageCriteria.currentPageRows = this.gridData.length;
    //     }
    //     else {
    //       this.pageCriteria.currentPageRows = this.pageSize;
    //     }

    //     // copy over dataset to empty object
    //     this.filteredData = this.gridView;
    //     // for specific columns to be search instead of all you can list them by name
    //     this.columnsWithSearch = Object.keys(this.gridView[0]);


    //   }
    // },
    //   (error) => {

    //     this._commonService.showErrorMessage(error);
    //   });
  }
  //initializing page model
  setPageModel() {
    // this.pageCriteria.pageSize = this._commonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }
  //for ngx table footer page navigation purpose
  onFooterPageChange(event:any): void {
    this.pageCriteria.offset = event.page - 1;
    if (this.pageCriteria.totalrows < event.page * this.pageSize) {
      this.pageCriteria.currentPageRows = this.pageCriteria.totalrows % this.pageSize;
    }
    else {
      this.pageCriteria.currentPageRows = this.pageSize;
    }
  }
  viewHandler(event:any, row:any) {
    debugger;
    let receipt = btoa(row.pjvnumber + ',' + 'Journal Voucher');
    window.open('/#/JournalVoucherReport?id=' + receipt + '', "_blank");
   
  }
  // filters results
  filterDatatable(event:any) {
    // get the value of the key pressed and make it lowercase
    let filter = event.target.value.toLowerCase();

    // assign filtered matches to the active datatable
    this.Journalvoucherlist = this.filteredData.filter(item => {
      // iterate through each row's column data
      for (let i = 0; i < this.columnsWithSearch.length; i++) {
        var colValue = item[this.columnsWithSearch[i]];

        
        // if (!filter || (!!colValue && colValue.toString().toLowerCase().indexOf(filter) !== -1)) {
          
        //   return true;
        // }
      }
    });
    // TODO - whenever the filter changes, always go back to the first page
    //this.table.offset = 0;
    this.myTable.offset = 0;
  }


//   filterDatatable(event: Event): void {
//   const input = event.target as HTMLInputElement;
//   const filter = input.value?.toLowerCase() || '';

//   this.Journalvoucherlist = this.filteredData.filter(item => {
//     return this.columnsWithSearch.some(column => {
//       const colValue = item[column];
//       return colValue != null &&
//              colValue.toString().toLowerCase().includes(filter);
//     });
//   });

//   // Reset to first page
//   if (this.myTable) {
//     this.myTable.offset = 0;
//   }
// }


}
