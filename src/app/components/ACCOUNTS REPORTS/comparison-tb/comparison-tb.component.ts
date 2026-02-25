import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { CommonService } from '../../../services/common.service';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PageCriteria } from '../../../Models/pageCriteria';

import { TableModule } from 'primeng/table';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-comparison-tb',
  imports: [FormsModule,CommonModule,ReactiveFormsModule,BsDatepickerModule,TableModule],
  templateUrl: './comparison-tb.component.html',
  styleUrl: './comparison-tb.component.css',
})
export class ComparisonTbComponent {
  private fb = inject(FormBuilder);
  private commonService = inject(CommonService);
  private reportService = inject(AccountingReportsService);
  private datePipe = inject(DatePipe);
  private destroyRef = inject(DestroyRef);

  @ViewChild('myTable') table: any;

  dpConfig: Partial<BsDatepickerConfig> = {};
  dpConfig1: Partial<BsDatepickerConfig> = {};

  ComparisionTBForm!: FormGroup;

  today = new Date();
  fromdate!: string|null;
  todate!: string|null;

  gridData: any[] = [];
  loading = false;
  isLoading = false;
  savebutton = 'Generate Report';
  hideprint = true;
  showHide = true;
  difference = 0;
  currencysymbol: string;

  totaldebitamount1 = 0;
  totalcreditamount1 = 0;
  totaldebitamount2 = 0;
  totalcreditamount2 = 0;
  totaldebitamount3 = 0;
  totalcreditamount3 = 0;

  pageCriteria = new PageCriteria();
  // commencementgridPage = new Page();

  constructor() {
    this.currencysymbol = String(this.commonService.datePickerPropertiesSetup('currencysymbol'));
     this.dpConfig.maxDate = new Date();
    this.dpConfig.dateInputFormat = 'DD-MMM-YYYY'
    // this.dpConfig.maxDate = new Date();

    this.dpConfig = {
      dateInputFormat: String(this.commonService.datePickerPropertiesSetup('dateInputFormat')),
      // containerClass: String(this.commonService.datePickerPropertiesSetup('containerClass')),
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      maxDate: new Date()
    };

    this.dpConfig1 = {
      minDate: new Date(),
      maxDate: new Date(),
      dateInputFormat: String(this.commonService.datePickerPropertiesSetup('dateInputFormat')),
      containerClass: String(this.commonService.datePickerPropertiesSetup('containerClass')),
      showWeekNumbers: false
    };

    this.setPageModel();
    this.buildForm();
  }

  private buildForm() {
    this.ComparisionTBForm = this.fb.group({
      fromDate: [this.today, Validators.required],
      toDate: [this.today, Validators.required],
      grouping: [false]
    }, { validators: this.dateRangeValidator() });
  }
  dateRangeValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {

      const from = group.get('fromDate')?.value;
      const to = group.get('toDate')?.value;

      if (!from || !to) return null;

      const fromTime = new Date(from).setHours(0, 0, 0, 0);
      const toTime = new Date(to).setHours(0, 0, 0, 0);

      return fromTime > toTime
        ? { dateRangeInvalid: true }
        : null;
    };
  }
  get f() {
    return this.ComparisionTBForm.controls;
  }

  updateFormattedDates() {
    this.fromdate = this.datePipe.transform(this.f['fromDate'].value, 'dd-MMM-yyyy');
    this.todate = this.datePipe.transform(this.f['toDate'].value, 'dd-MMM-yyyy');
  }


  setPageModel() {
    this.pageCriteria.pageSize = this.commonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }

  DateChange(date: Date) {
    this.dpConfig1.minDate = date;
    this.ComparisionTBForm.controls['toDate'].setValue(new Date());
  }

  checkbox(event: any) {
    console.log('Checkbox value:', event.target.checked);
  }

  show() {
    // this.GetComparisionTBReports();
    this.ComparisionTBForm.value.grouping
      ? this.crystalreport()
      : this.GetComparisionTBReports();
  }
  crystalreport() {
    const fromDate = this.commonService.getFormatDateNormal(this.ComparisionTBForm.value.fromDate);
    const toDate = this.commonService.getFormatDateNormal(this.ComparisionTBForm.value.toDate);
    const BranchSchema = this.commonService.getschemaname();

    // window.open(
    //   `${this.urldata?.CrystalReportsApiHostUrl}AccountsReports/getComptbGrouping/?fromDate=${fromDate}&toDate=${toDate}&BranchSchema=${BranchSchema}`,
    //   '_blank'
    // );
  }

  // private loadDummyData() {
  //   this.gridData = [
  //     {
  //       pparentaccountName: 'Assets',
  //       paccountName: 'Cash',
  //       pdebitamount1: 5000,
  //       pcreditamount1: 0,
  //       pdebitamount2: 3000,
  //       pcreditamount2: 0,
  //       pdebittotal: 8000,
  //       pcredittotal: 0
  //     },
  //     {
  //       pparentaccountName: 'Assets',
  //       paccountName: 'Bank',
  //       pdebitamount1: 2000,
  //       pcreditamount1: 0,
  //       pdebitamount2: 1000,
  //       pcreditamount2: 0,
  //       pdebittotal: 3000,
  //       pcredittotal: 0
  //     },
  //     {
  //       pparentaccountName: 'Liabilities',
  //       paccountName: 'Loans',
  //       pdebitamount1: 0,
  //       pcreditamount1: 4000,
  //       pdebitamount2: 0,
  //       pcreditamount2: 2000,
  //       pdebittotal: 0,
  //       pcredittotal: 6000
  //     }
  //   ];

  //   this.showHide = false;
  //   this.loading = this.isLoading = false;
  //   this.savebutton = 'Generate Report';
  //   this.calculateTotals();
  // }

  GetComparisionTBReports() {

    this.ComparisionTBForm.markAllAsTouched();

    if (this.ComparisionTBForm.errors?.['dateRangeInvalid']) {
      alert('From Date should not be greater than To Date');
      return;
    }

    if (this.ComparisionTBForm.invalid) return;
    this.loading = this.isLoading = true;
    this.savebutton = 'Processing';
    this.updateFormattedDates();

    // this.from = this.ComparisionTBForm.value.fromDate;
    // this.to = this.ComparisionTBForm.value.toDate;

    // setTimeout(() => {
    //   this.loadDummyData();
    // }, 800);
    const fromdate = this.commonService.getFormatDateNormal(this.ComparisionTBForm.value.fromDate)??'';
    const todate = this.commonService.getFormatDateNormal(this.ComparisionTBForm.value.toDate)??'';

    this.reportService.GetComparisionTB(fromdate, todate,'accounts','global','KAPILCHITS','KLC01')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.gridData = res || [];
        this.showHide = false;
        this.loading = this.isLoading = false;
        this.savebutton = 'Generate Report';
        this.calculateTotals();
      });
  }

//   pdfOrprint(printorpdf: 'Pdf' | 'Print'): void {
//   if (this.gridData.length === 0) {
//     this.commonService.showInfoMessage('No Data');
//     return;
//   }

//   const rows: any[] = [];
//   const reportname = 'Comparison Trial Balance';
//   const gridheaders = ['Particulars', 'Debit', 'Credit', 'Debit', 'Credit', 'Debit', 'Credit'];

//   const fromDate = this.commonService.getFormatDateGlobal(
//     this.ComparisionTBForm.controls['fromDate'].value
//   );

//   const toDate = this.commonService.getFormatDateGlobal(
//     this.ComparisionTBForm.controls['toDate'].value
//   );

//   const colWidthHeight = {
//     parentaccountname: { cellWidth: 'auto' },
//     accountname: { cellWidth: 'auto' },
//     debitamount1: { cellWidth: 'auto' },
//     creditamount1: { cellWidth: 'auto' },
//     debitamount2: { cellWidth: 'auto' },
//     creditamount2: { cellWidth: 'auto' },
//     debittotal: { cellWidth: 'auto' },
//     credittotal: { cellWidth: 'auto' }
//   };
  

//   const retungridData = this.commonService._groupwiseSummaryExportDataTB(
//     this.gridData,
//     'parentaccountname',
//     'debitamount1',
//     'creditamount1',
//     'debitamount2',
//     'creditamount2',
//     'debittotal',
//     'credittotal',
//     'Total',
//     false
//   );

//   retungridData.forEach((element: any) => {
//     let debitamt = '';
//     let creditamt = '';
//     let debitamt1 = '';
//     let creditamt1 = '';
//     let debitamt2 = '';
//     let creditamt2 = '';

//     if (element.debitamount1) {
//       debitamt = this.commonService.currencyFormat(parseFloat(element.debitamount1).toFixed(2));
//     }
//     if (element.creditamount1) {
//       creditamt = this.commonService.currencyFormat(parseFloat(element.creditamount1).toFixed(2));
//     }
//     if (element.debitamount2) {
//       debitamt1 = this.commonService.currencyFormat(parseFloat(element.debitamount2).toFixed(2));
//     }
//     if (element.creditamount2) {
//       creditamt1 = this.commonService.currencyFormat(parseFloat(element.creditamount2).toFixed(2));
//     }
//     if (element.debittotal) {
//       debitamt2 = this.commonService.currencyFormat(parseFloat(element.debittotal).toFixed(2));
//     }
//     if (element.credittotal) {
//       creditamt2 = this.commonService.currencyFormat(parseFloat(element.credittotal).toFixed(2));
//     }

//     const temp = element.group
//       ? [element.group, element.accountname, debitamt, creditamt, debitamt1, creditamt1, debitamt2, creditamt2]
//       : [element.accountname, debitamt, creditamt, debitamt1, creditamt1, debitamt2, creditamt2];

//     rows.push(temp);
//   });

//   const gridtotals: any = {
//     grandtotal1: this.commonService.convertAmountToPdfFormat(
//       this.commonService.currencyFormat(this.totaldebitamount1)
//     ),
//     grandtotal2: this.commonService.convertAmountToPdfFormat(
//       this.commonService.currencyFormat(this.totalcreditamount1)
//     ),
//     grandtotal3: this.commonService.convertAmountToPdfFormat(
//       this.commonService.currencyFormat(this.totaldebitamount2)
//     ),
//     grandtotal4: this.commonService.convertAmountToPdfFormat(
//       this.commonService.currencyFormat(this.totalcreditamount2)
//     ),
//     grandtotal5: this.commonService.convertAmountToPdfFormat(
//       this.commonService.currencyFormat(this.totaldebitamount3)
//     ),
//     grandtotal6: this.commonService.convertAmountToPdfFormat(
//       this.commonService.currencyFormat(this.totalcreditamount3)
//     )
//   };

//   const total = [
//     ' Grand Total ',
//     gridtotals.grandtotal1,
//     gridtotals.grandtotal2,
//     gridtotals.grandtotal3,
//     gridtotals.grandtotal4,
//     gridtotals.grandtotal5,
//     gridtotals.grandtotal6
//   ];

//   rows.push(total);

//   this.reportService._ComparisionTBReportsPdf(
//     reportname,
//     rows,
//     gridheaders,
//     colWidthHeight,
//     'landscape',
//     'Between',
//     fromDate,
//     toDate,
//     printorpdf
//   );
// }
pdfOrprint(printorpdf: 'Pdf' | 'Print'): void {
  if (this.gridData.length === 0) {
    this.commonService.showInfoMessage('No Data');
    return;
  }

  const rows: any[] = [];
  const reportname = 'Comparison Trial Balance';
  const gridheaders = ['Particulars', 'Debit', 'Credit', 'Debit', 'Credit', 'Debit', 'Credit'];

  const fromDate = this.commonService.getFormatDateGlobal(
    this.ComparisionTBForm.controls['fromDate'].value
  );
  const toDate = this.commonService.getFormatDateGlobal(
    this.ComparisionTBForm.controls['toDate'].value
  );

  const colWidthHeight = {
    parentaccountname: { cellWidth: 'auto' },
    accountname: { cellWidth: 'auto' },
    debitamount1: { cellWidth: 'auto' },
    creditamount1: { cellWidth: 'auto' },
    debitamount2: { cellWidth: 'auto' },
    creditamount2: { cellWidth: 'auto' },
    debittotal: { cellWidth: 'auto' },
    credittotal: { cellWidth: 'auto' }
  };

  const retungridData = this.commonService._groupwiseSummaryExportDataTB(
    this.gridData,
    'parentaccountname',
    'debitamount1',
    'creditamount1',
    'debitamount2',
    'creditamount2',
    'debittotal',
    'credittotal',
    'Total',
    false
  );

  const fmt = (val: any): string => {
    if (val === undefined || val === null || val === '' || val === 0) return '';
    return this.commonService.currencyFormat(parseFloat(val).toFixed(2));
  };

  retungridData.forEach((element: any) => {
    if (element.isGroupHeader) {
      rows.push([element.group]);
      return;
    }

    if (element.isSubtotal) {

      const subtotalRow: any[] = [
        { content: element.accountname,                    styles: { fontStyle: 'bold', halign: 'left',  fillColor: '#ffffb3' } },
        { content: fmt(element.debitamount1),              styles: { fontStyle: 'bold', halign: 'right', fillColor: '#ffffb3' } },
        { content: fmt(element.creditamount1),             styles: { fontStyle: 'bold', halign: 'right', fillColor: '#ffffb3' } },
        { content: fmt(element.debitamount2),              styles: { fontStyle: 'bold', halign: 'right', fillColor: '#ffffb3' } },
        { content: fmt(element.creditamount2),             styles: { fontStyle: 'bold', halign: 'right', fillColor: '#ffffb3' } },
        { content: fmt(element.debittotal),                styles: { fontStyle: 'bold', halign: 'right', fillColor: '#ffffb3' } },
        { content: fmt(element.credittotal),               styles: { fontStyle: 'bold', halign: 'right', fillColor: '#ffffb3' } },
      ];
      rows.push(subtotalRow);
      return;
    }

    rows.push([
      element.accountname  ?? '',
      fmt(element.debitamount1),
      fmt(element.creditamount1),
      fmt(element.debitamount2),
      fmt(element.creditamount2),
      fmt(element.debittotal),
      fmt(element.credittotal),
    ]);
  });

  const grandRow: any[] = [
    { content: 'Grand Total', styles: { fontStyle: 'bold', halign: 'left',  fillColor: '#ffd700' } },
    { content: this.commonService.currencyFormat(this.totaldebitamount1),  styles: { fontStyle: 'bold', halign: 'right', fillColor: '#ffd700' } },
    { content: this.commonService.currencyFormat(this.totalcreditamount1), styles: { fontStyle: 'bold', halign: 'right', fillColor: '#ffd700' } },
    { content: this.commonService.currencyFormat(this.totaldebitamount2),  styles: { fontStyle: 'bold', halign: 'right', fillColor: '#ffd700' } },
    { content: this.commonService.currencyFormat(this.totalcreditamount2), styles: { fontStyle: 'bold', halign: 'right', fillColor: '#ffd700' } },
    { content: this.commonService.currencyFormat(this.totaldebitamount3),  styles: { fontStyle: 'bold', halign: 'right', fillColor: '#ffd700' } },
    { content: this.commonService.currencyFormat(this.totalcreditamount3), styles: { fontStyle: 'bold', halign: 'right', fillColor: '#ffd700' } },
  ];
  rows.push(grandRow);

  this.reportService._ComparisionTBReportsPdf(
    reportname,
    rows,
    gridheaders,
    colWidthHeight,
    'landscape',
    'Between',
    fromDate,
    toDate,
    printorpdf
  );
}


  private calculateTotals() {
    const sum = (field: string) =>
      this.gridData.reduce((a, b) => a + (+b[field] || 0), 0);

    this.totaldebitamount1 = sum('pdebitamount1');
    this.totalcreditamount1 = sum('pcreditamount1');
    this.totaldebitamount2 = sum('pdebitamount2');
    this.totalcreditamount2 = sum('pcreditamount2');
    this.totaldebitamount3 = sum('pdebittotal');
    this.totalcreditamount3 = sum('pcredittotal');

    this.difference = Math.abs(this.totaldebitamount1 - this.totalcreditamount1);
    this.hideprint = this.difference === 0;
  }

  export(): void {
    const rows = this.gridData.map(e => ({
      'Comparision Name': e.pparentaccountName,
      'Particulars': e.paccountName,
      'Debit': e.pdebitamount1,
      'Credit': e.pcreditamount1,
      'Debit 2': e.pdebitamount2,
      'Credit 2': e.pcreditamount2,
      'Debit Total': e.pdebittotal,
      'Credit Total': e.pcredittotal
    }));

    this.commonService.exportAsExcelFile(rows, 'Comparision_tb_dummy');
  }

}
