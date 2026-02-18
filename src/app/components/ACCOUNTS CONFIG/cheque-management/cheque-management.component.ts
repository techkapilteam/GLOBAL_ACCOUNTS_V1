import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PageCriteria } from '../../../Models/pageCriteria';
import { CommonService } from '../../../services/common.service';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import { AccountingMasterService } from '../../../services/accounting-master.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-cheque-management',
  imports: [BsDatepickerModule,ReactiveFormsModule,CommonModule,RouterModule,NgxDatatableModule,
     TableModule,
    ButtonModule
  ],
  templateUrl: './cheque-management.component.html',
  styleUrl: './cheque-management.component.css'
})
export class ChequeManagementComponent {
  gridData: any[] = [];
  list: any[] = [];

  pageCriteria: PageCriteria = new PageCriteria();

  pageSize = 10;
  loading = false;
  hideprint = false;

  constructor(
    private accountingService: AccountingMasterService,
    private commonService: CommonService,
    private accReportService: AccountingReportsService
  ) {}

  ngOnInit(): void {
    this.setPageModel();
    this.getChequeManagementGridData();
  }
  setPageModel(): void {
    this.pageCriteria.pageSize = this.commonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }

  getChequeManagementGridData(): void {
    this.loading = true;
    this.accountingService.ViewChequeManagementDetails().subscribe({
      next: (data: any[]) => {
        this.loading = false;
        this.gridData = data ?? [];
        this.list = [...this.gridData];
        this.hideprint = this.gridData.length > 0;
        this.updatePagination();
      },
      error: (error:any) => {
        this.loading = false;
        this.commonService.showErrorMessage(error);
      }
    });
  }

  updatePagination(): void {
    this.pageCriteria.totalrows = this.gridData.length;
    this.pageCriteria.TotalPages =
      this.pageCriteria.totalrows > this.pageCriteria.pageSize
        ? Math.ceil(this.pageCriteria.totalrows / this.pageCriteria.pageSize)
        : 1;

    this.pageCriteria.currentPageRows =
      this.gridData.length < this.pageSize
        ? this.gridData.length
        : this.pageSize;
  }

  editClick(row: any): void {
    if (row.pChqegeneratestatus === true) {
      return;
    }

    const isActive = row.pChqegeneratestatus ? 'false' : 'true';

    const item = {
      pBankId: row.pBankId,
      pChqbookid: row.pChqbookid,
      pNoofcheques: row.pNoofcheques,
      pChequefrom: row.pChequefrom,
      pChequeto: row.pChequeto,
      pChqegeneratestatus: isActive,
      pBankname: `${row.pBankname} - ${row.pAccountnumber}`,
      pAccountnumber: row.pAccountnumber,
      pStatusname: row.pStatusname,
      ptypeofoperation: 'UPDATE',
      pCreatedby: this.commonService.getCreatedBy(),
      branchSchema: this.commonService.getschemaname(),
      pipaddress: this.commonService.getIpAddress()
    };

    const payload = {
      pChqegeneratestatus: isActive,
      pStatusname: row.pStatusname,
      ptypeofoperation: 'UPDATE',
      branchSchema: this.commonService.getschemaname(),
      pipaddress: this.commonService.getIpAddress(),
      pCreatedby: this.commonService.getCreatedBy(),
      lstChequemanagementDTO: [item]
    };

    this.accountingService.SaveChequeManagement(JSON.stringify(payload)).subscribe({
      next: () => {
        this.commonService.showInfoMessage('Updated Successfully');
        this.getChequeManagementGridData();
      },
      error: (error:any) => {
        this.commonService.showErrorMessage(error);
      }
    });
  }

  onFooterPageChange(event: any): void {
    this.pageCriteria.offset = event.page - 1;
    this.pageCriteria.currentPageRows =
      this.pageCriteria.totalrows < event.page * this.pageSize
        ? this.pageCriteria.totalrows % this.pageSize
        : this.pageSize;
  }

  filterByCodeStatus(status: string): void {
    this.gridData =
      status === 'All'
        ? [...this.list]
        : this.list.filter(x => x.pchequestatus === status);

    this.hideprint = this.gridData.length > 0;
    this.updatePagination();
  }

  pdforprint(type: string): void {
    const rows: any[] = [];
    const headers = [
      'Book ID',
      'No. of Cheques',
      'From',
      'To',
      'Cheque Status',
      'Bank Name',
      'Account No.',
      'Book Status'
    ];

    const styles = {
      0: { cellWidth: 'auto', halign: 'center' },
      1: { cellWidth: 'auto', halign: 'center' },
      2: { cellWidth: 'auto', halign: 'center' },
      3: { cellWidth: 'auto', halign: 'center' },
      4: { cellWidth: 'auto', halign: 'center' },
      5: { cellWidth: 'auto', halign: 'center' },
      6: { cellWidth: 'auto', halign: 'left' },
      7: { cellWidth: 'auto', halign: 'left' }
    };

    this.gridData.forEach(e => {
      const status = e.pChqegeneratestatus ? 'Active' : 'Generate Cheques';
      rows.push([
        e.pChqbookid,
        e.pNoofcheques,
        e.pChequefrom,
        e.pChequeto,
        status,
        e.pBankname,
        e.pAccountnumber,
        e.pchequestatus
      ]);
    });

    this.accReportService._ChequeManagementPdf(
      'Cheque Management',
      rows,
      headers,
      styles,
      'landscape',
      type
    );
  }

  excel(): void {
    const rows = this.gridData.map(e => ({
      'Book ID': e.pChqbookid,
      'No. of Cheques': e.pNoofcheques,
      'From': e.pChequefrom,
      'To': e.pChequeto,
      'Cheque Status': e.pChqegeneratestatus ? 'Active' : 'Generate Cheques',
      'Bank Name': e.pBankname,
      'Account No.': e.pAccountnumber,
      'Book Status': e.pchequestatus
    }));

    this.commonService.exportAsExcelFile(rows, 'Cheque Management');
  }

}
