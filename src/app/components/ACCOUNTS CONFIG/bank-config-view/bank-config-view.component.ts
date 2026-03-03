


import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { State, process, GroupDescriptor } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PageCriteria } from '../../../Models/pageCriteria';
import { AccountingMasterService } from '../../../services/accounting-master.service';
import { CommonService } from '../../../services/common.service';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-bank-config-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    // CurrencyPipe,
    RouterLink,
    TableModule,
    RouterModule
  ],
  templateUrl: './bank-config-view.component.html',
  styleUrl: './bank-config-view.component.css'
})
// export class BankConfigViewComponent implements OnInit {

//   bankForm!: FormGroup;
//   submitted = false;

//   currencySymbol = '₹';

//   gridView: any[] = [];

//   pageCriteria = {
//     pageSize: 10,
//     footerPageHeight: 50
//   };

//   constructor(private fb: FormBuilder) {}

//   ngOnInit(): void {
//     this.bankForm = this.fb.group({
//       bankName: ['', Validators.required],
//       accountNo: ['', [
//         Validators.required,
//         Validators.pattern('^[0-9]{8,20}$')
//       ]],
//       accountName: ['', [
//         Validators.required,
//         Validators.minLength(3)
//       ]],
//       accountStatus: ['', Validators.required],
//       accountType: ['', Validators.required]
//     });


//     this.gridView = [
//       {
//         preceiptdate: 'HDFC Bank',
//         preceiptid: '1234567890',
//         pmodofreceipt: 'CASH',
//         ptypeofpayment: '',
//         pChequenumber: '',
//         ptotalreceivedamount: 25000,
//         pnarration: 'Savings Account'
//       },
//       {
//         preceiptdate: 'ICICI Bank',
//         preceiptid: '9876543210',
//         pmodofreceipt: 'CHEQUE',
//         ptypeofpayment: 'CHEQUE',
//         pChequenumber: 'CHQ001',
//         ptotalreceivedamount: 50000,
//         pnarration: ''
//       }
//     ];
//   }

//   get f() {
//     return this.bankForm.controls;
//   }

//   onSubmit(): void {
//     this.submitted = true;

//     if (this.bankForm.invalid) {
//       return;
//     }

//     console.log('Form Value:', this.bankForm.value);
//   }

//   onReset(): void {
//     this.submitted = false;
//     this.bankForm.reset();
//   }

//   filterDatatable(event: any): void {
//     let value = event.target.value.toLowerCase();

//     console.log('Filter:', value);
//   }

//   viewRow(): void {
//     console.log('View row clicked');
//   }
// }
export class BankConfigViewComponent implements OnInit {
  @ViewChild(DatatableComponent) myTable!: DatatableComponent;
  @ViewChild(DataBindingDirective, { static: true }) dataBinding!: DataBindingDirective;
  recordid: any;
  newform = false;
  public gridState: State = {
    sort: [],
    take: 10
  };
  public loading = false;
  public pageSize = 10;
  public headerCells: any = {
    textAlign: 'center'
  };
  gridData: any = [];
  gridView: any = [];
  filteredData = [];
  columnsWithSearch: string[] = [];
  pageCriteria: PageCriteria;
  constructor(private accountingmasterservice: AccountingMasterService,
    private router: Router, private _commonservice: CommonService) {
    this.pageCriteria = new PageCriteria();
  }

  ngOnInit() {


    
    this.loading = true;
    // this.pageSize = this._commonservice.pageSize;
    this.setPageModel();
    this.accountingmasterservice.viewbankinformation(
      this._commonservice.getschemaname(),
      this._commonservice.getbranchname(),
      this._commonservice.getBranchCode(),
      this._commonservice.getCompanyCode()
    ).subscribe(
      {
        next: (data: any) => {

          this.gridView = data;
          this.gridData = this.gridView;
          this.loading = false;
           console.log('grid data:',this.gridData);

          // copy over dataset to empty object
          this.filteredData = this.gridView;
          // for specific columns to be search instead of all you can list them by name
          this.columnsWithSearch = Object.keys(this.gridView[0]);

          // custom page navigation

          this.setpagenumbers(this.gridView);

        },
        error: (error: any) => {
          this._commonservice.showErrorMessage(error);

        }
      });


  }

  setpagenumbers(gridView: any) {
    this.pageCriteria.totalrows = gridView.length;
    this.pageCriteria.TotalPages = 1;
    if (this.pageCriteria.totalrows > this.pageCriteria.pageSize)
      this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / this.pageCriteria.pageSize).toString()) + 1;
    if (gridView.length < this.pageCriteria.pageSize) {
      this.pageCriteria.currentPageRows = gridView.length;
    }
    else {
      this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
    }
  }
  //initializing page model
  setPageModel() {
    this.pageCriteria.pageSize = this._commonservice.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }
  //for ngx table footer page navigation purpose
  onFooterPageChange(event: any): void {
    this.pageCriteria.offset = event.page - 1;
    if (this.pageCriteria.totalrows < event.page * this.pageSize) {
      this.pageCriteria.currentPageRows = this.pageCriteria.totalrows % this.pageSize;
    }
    else {
      this.pageCriteria.currentPageRows = this.pageSize;
    }
  }
  newschemeform() {
    // this.newform="new";
    this.accountingmasterservice.newformstatus("new")
  }
  editClick(event: any) {
    //console.log(event.dataItem)
  }
  // grid edit event when click on edit button
  // editDetails(event, row, rowIndex, group) {
  //   debugger;
  //   try {
  //     this._contacmasterservice.loadEditInformation(row.pContactType, row.pContactId)
  //     this._routes.navigate(['/configuration/contact'])
  //   } catch (e) {
  //     alert(e);

  //   }
  // }
  editHandler(event: any, row: any, rowIndex: any) {
    debugger;
    // this.router.navigate(['/configuration/BankConfiguration']);
    // this.router.navigate(['/accounts/accounts-config/bank-config']);
    this.router.navigate(['/dashboard/accounts/accounts-config/bank-config']);


    this.accountingmasterservice.newformstatus("edit")
    //console.log(event.dataItem)
    //this.recordid = event.dataItem.pRecordid
    this.recordid = row.bank_id;
    console.log('record id:', this.recordid );
    
    this.accountingmasterservice.GetBankDetails1(row.bank_id, row)



  }
  public group: any[] = [{
    field: 'pBankname'
  }];

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridData, { group: this.group, sort: [{ field: 'pBankname', dir: 'desc' }] }).data,
      group: this.group
    };

    return result;
  }


  filterDatatable(event: any) {
    const filter = event.target.value?.toLowerCase() || '';

    if (!filter) {
      this.gridData = [...this.filteredData];
    } else {
      this.gridData = this.filteredData.filter(item =>
        this.columnsWithSearch.some(column => {
          const colValue = item[column];

          return colValue != null &&
            String(colValue).toLowerCase().includes(filter);
        })
      );
    }

    this.myTable.offset = 0;
    this.setpagenumbers(this.gridData);
  }


}


