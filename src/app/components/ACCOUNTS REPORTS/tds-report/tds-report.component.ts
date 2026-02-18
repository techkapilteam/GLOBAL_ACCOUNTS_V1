import { CommonModule, formatDate } from '@angular/common';
import { Component,inject,OnInit } from '@angular/core';
import { FormsModule,FormBuilder, FormGroup,Validators, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';
import { CommonService } from '../../../services/common.service';
import { TdsService } from '../../../services/tds.service';


@Component({
 selector: 'app-tdsreport',
  standalone: true,
  imports: [BsDatepickerModule, NgxDatatableModule, CommonModule, ReactiveFormsModule,TableModule],
  templateUrl: './tds-report.component.html',
  styleUrl: './tds-report.component.css',
  host: {
    ngSkipHydration: ''
  }
})
export class TdsReportComponent implements OnInit{
  private fb = inject(FormBuilder);
  private tdsService = inject(TdsService);
  private commonService = inject(CommonService);

  TDSReport!: FormGroup;
  Tdsreporterrors: Record<string, string> = {};
  sectionName: string = '';
asOnChecked = false;
isSummary = false;
showResult = false;

summaryData: any[] = [];

  pageSize = 10;
  skip = 0;
  gridData: any[] = [];
  tdssectionlist: any[] = [];

  today = new Date();
  isLoading = false;
  savebutton = 'Generate Report';

  dpFromConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'DD-MMM-YYYY',
    containerClass:'theme-dark-blue',
    maxDate: new Date(),
    showWeekNumbers: false
  };

  dpToConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'DD-MMM-YYYY',
    containerClass:'theme-dark-blue',
    maxDate: new Date(),
    showWeekNumbers: false
  };

  fromdate!: string;
  todate!: string;
  validation = false;
  section!: string;

  ngOnInit(): void {
    this.buildForm();
    this.setDefaultDates();
    this.getTDSsectiondetails();
  }

  trackByFn(index: number): number {
    return index;
  }

  private buildForm(): void {
    this.TDSReport = this.fb.group({
      pTdsSection: ['', Validators.required],
      fromDate: [this.today, Validators.required],
      toDate: [this.today, Validators.required],
    });

    this.TDSReport.valueChanges.subscribe(() => {
      this.validateDates();
    });
  }

  private setDefaultDates(): void {
    this.fromdate = formatDate(this.today, 'yyyy-MM-dd', 'en-IN');
    this.todate = formatDate(this.today, 'yyyy-MM-dd', 'en-IN');
  }

  getTDSsectiondetails(): void {
    this.tdsService.getTdsSectionDetails().subscribe({
      next: (data: never[]) => this.tdssectionlist = data ?? [],
      error: (err: any) => this.commonService.showErrorMessage(err)
    });
  }

  FromDateChange(date: Date): void {
    this.fromdate = formatDate(date, 'yyyy-MM-dd', 'en-IN');
    this.validateDates();
  }

  ToDateChange(date: Date): void {
    this.todate = formatDate(date, 'yyyy-MM-dd', 'en-IN');
    this.validateDates();
  }

  private validateDates(): void {
    if (this.fromdate && this.todate) {
      this.validation = this.fromdate > this.todate;
    }
  }

  sectionchange(event: Event): void {
    const select = event.target as HTMLSelectElement;
  this.section = select.value;

  const selected = this.tdssectionlist.find(
    x => x.pTdsSection === this.section
  );

  this.sectionName = selected?.sectionName || '';
  }
  onAsOnChange(event: any): void {
  this.asOnChecked = event.target.checked;

  if (this.asOnChecked) {
    this.TDSReport.get('toDate')?.setValue(this.TDSReport.get('fromDate')?.value);
  }
}
onSummaryChange(event: any): void {
  this.isSummary = event.target.checked;
}

  generatetdsreport(): void {
    if (this.TDSReport.invalid || this.validation) {
      this.TDSReport.markAllAsTouched();
      return;
    }

    const fromdate = formatDate(this.TDSReport.value.fromDate, 'dd-MMM-yyyy', 'en-IN');
    const todate = formatDate(this.TDSReport.value.toDate, 'dd-MMM-yyyy', 'en-IN');

    this.isLoading = true;

    this.tdsService.getTdsReport(fromdate, todate, this.section).subscribe({
      next: (result: never[]) => {
        this.gridData = result ?? [];
        this.isLoading = false;
      },
      error: (err: any) => {
        this.commonService.showErrorMessage(err);
        this.isLoading = false;
      }
    });
  }

}






