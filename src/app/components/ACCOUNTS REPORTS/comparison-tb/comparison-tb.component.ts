import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonService } from '../../../services/common.service';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PageCriteria } from '../../../Models/pageCriteria';
import { DateformatPipe } from '../day-book/day-book.component';

@Component({
  selector: 'app-comparison-tb',
  imports: [FormsModule,CommonModule,NgxDatatableModule,ReactiveFormsModule,BsDatepickerModule,DateformatPipe],
  templateUrl: './comparison-tb.component.html',
  styleUrl: './comparison-tb.component.css',
})
export class ComparisonTbComponent {
  private fb = inject(FormBuilder);
  private commonService = inject(CommonService);
  private datePipe = inject(DatePipe);
  private destroyRef = inject(DestroyRef);

  @ViewChild('myTable') table: any;

  dpConfig: Partial<BsDatepickerConfig> = {};
  dpConfig1: Partial<BsDatepickerConfig> = {};

  ComparisionTBForm!: FormGroup;

  today = new Date();
  from!: Date;
  to!: Date;

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

    this.dpConfig = {
      dateInputFormat: String(this.commonService.datePickerPropertiesSetup('dateInputFormat')),
      containerClass: String(this.commonService.datePickerPropertiesSetup('containerClass')),
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
    });
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
    this.GetComparisionTBReports();
  }

  private loadDummyData() {
    this.gridData = [
      {
        pparentaccountName: 'Assets',
        paccountName: 'Cash',
        pdebitamount1: 5000,
        pcreditamount1: 0,
        pdebitamount2: 3000,
        pcreditamount2: 0,
        pdebittotal: 8000,
        pcredittotal: 0
      },
      {
        pparentaccountName: 'Assets',
        paccountName: 'Bank',
        pdebitamount1: 2000,
        pcreditamount1: 0,
        pdebitamount2: 1000,
        pcreditamount2: 0,
        pdebittotal: 3000,
        pcredittotal: 0
      },
      {
        pparentaccountName: 'Liabilities',
        paccountName: 'Loans',
        pdebitamount1: 0,
        pcreditamount1: 4000,
        pdebitamount2: 0,
        pcreditamount2: 2000,
        pdebittotal: 0,
        pcredittotal: 6000
      }
    ];

    this.showHide = false;
    this.loading = this.isLoading = false;
    this.savebutton = 'Generate Report';
    this.calculateTotals();
  }

  GetComparisionTBReports() {
    this.loading = this.isLoading = true;
    this.savebutton = 'Processing';

    this.from = this.ComparisionTBForm.value.fromDate;
    this.to = this.ComparisionTBForm.value.toDate;

    setTimeout(() => {
      this.loadDummyData();
    }, 800);
  }

  pdfOrprint(type: 'Pdf' | 'Print') {
    if (type === 'Print') {
      window.print();
    } else {
      alert('PDF export not implemented in demo mode');
    }
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
