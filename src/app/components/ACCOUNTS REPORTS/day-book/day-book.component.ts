import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
//import { NgxLoadingModule } from 'ngx-loading';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
//import { CompanyDetails } from '../company-details/company-details.component'; 
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'dateformat', standalone: true })
export class DateformatPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}
  transform(value: any, format: string = 'dd-MMM-yyyy'): any {
    if (!value) return '';
    return this.datePipe.transform(value, format);
  }
}


@Pipe({ name: 'currencypipe', standalone: true })
export class Currencypipe implements PipeTransform {
  transform(value: any, symbol: string = '₹', decimal: string = '1.2-2'): string {
    if (value == null) return '';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(value);
  }
}

@Component({
  selector: 'app-day-book',
  imports: [ CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    NgSelectModule,
    //NgxLoadingModule,
    NgxDatatableModule,
   // CompanyDetails,
    DateformatPipe,
    Currencypipe ],
  standalone:true,
  templateUrl:'./day-book.component.html',
  styleUrl: './day-book.component.css',
})
export class DayBookComponent {
public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dppConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  Daybook!: FormGroup;
  public Ason: any;
  @Output() printedDate: any;
  @ViewChild('myTable') table: any;
  date: any;
  currencysymbol: any;
  kgmsBranchList: any;
  griddata: any;
  fromDate: any;
  toDate: any;

  constructor(private fb: FormBuilder, private datepipe: DatePipe) {}

  ChequesAmount: any = 0;
  public mySelection: string[] = [];
  updategrid: any = [];
  betweenason: any;
  savebutton = "Generate Report";
  showicons = false;
  public isLoading = false;
  public loading = false;
  gridData: any = [];
  gridDataCheques: any = [];
  totalbalancegrid: any = [];
  datepicker = true;
  selecteddate = true;
  fdate: any;
  showdate: any;
  FromDate: any;
  tdate: any;
  hidedate = true;
  Receiptsamount = 0;
  paymentsamount = 0;
  betweendates: any;
  betweenfromdate: any;
  betweentodate: any;
  fromdate: any;
  todate: any;
  validation = false;
  public disablesavebutton = false;
  hideRow: boolean = false;
  kgms: boolean = false;
  loginBranchschema: any;
  chkbox2: boolean = true;
  cash_total: any = 0;
  cheque_total: any = 0;
  online_total: any = 0;
  grand_total: any = 0;
  generateReport = 'Generate Report';
  ngOnInit() {
    this.betweenason = "";
    this.printedDate = true;
    this.setPageModel();
    this.Daybook = this.fb.group({
      dfromdate: [''],
      dtodate: [''],
      date: [''],
      branch_code: ['']
    });

    this.date = new Date();
    this.showdate = "Date";
    this.betweendates = "";
    this.hidedate = true;
    this.datepicker = false;
    this.FromDate = "Date";
    this.Daybook['controls']['date'].setValue(true);
    this.Daybook['controls']['dfromdate'].setValue(this.date);
    this.Daybook['controls']['dtodate'].setValue(this.date);
    this.betweenfromdate = this.datepipe.transform(this.date, "dd-MMM-yyyy");
    this.Ason = 'T';

    this.loginBranchschema = sessionStorage.getItem('loginBranchSchemaname');
  }

  setPageModel() {
    throw new Error('Method not implemented.');
  }

  GenerateReport() {
    this.isLoading = true;
    this.disablesavebutton = true;
    this.showicons = false;
    let fDate = this.Daybook['controls']['dfromdate'].value;
    let tDate = this.Daybook['controls']['dtodate'].value;
    if (!fDate || !tDate) {
      alert("Please select both dates.");
      this.isLoading = false;
      this.disablesavebutton = false;
      return;
    }

    this.fromDate = this.datepipe.transform(fDate, "dd-MMM-yyyy");
    this.toDate = this.datepipe.transform(tDate, "dd-MMM-yyyy");
    this.gridData = []; 
    this.isLoading = false;
    this.disablesavebutton = false;
  }

  PrintReport() { alert("Print logic commented."); }
  ExportToExcel() { alert("Export logic commented."); }

  ResetForm() {
    this.Daybook.reset();
    this.Daybook['controls']['date'].setValue(true);
    this.Daybook['controls']['dfromdate'].setValue(new Date());
    this.Daybook['controls']['dtodate'].setValue(new Date());
    this.gridData = [];
    this.showicons = false;
    this.betweenason = "";
  }

  ToggleDateSelection() {
    this.datepicker = !this.datepicker;
    this.Daybook['controls']['date'].setValue(this.datepicker);
  }

  CalculateTotals() {
    this.cash_total = 0;
    this.cheque_total = 0;
    this.online_total = 0;
    this.grand_total = 0;

    for (let item of this.gridData) {
      this.cash_total += item.cashAmount || 0;
      this.cheque_total += item.chequeAmount || 0;
      this.online_total += item.onlineAmount || 0;
    }

    this.grand_total = this.cash_total + this.cheque_total + this.online_total;
  }

  SelectRow(row: any) {
    if (this.mySelection.includes(row.id)) {
      this.mySelection = this.mySelection.filter(id => id !== row.id);
    } else { this.mySelection.push(row.id); }
  }

  FetchBranchList() { this.kgmsBranchList = []; }
  FilterByBranch(branchCode: any) { 
    if (!branchCode) return;
    this.gridData = this.gridData.filter((item: any) => item.branchCode === branchCode);
  }

  ShowBetweenDates() {
    let fDate = this.Daybook['controls']['dfromdate'].value;
    let tDate = this.Daybook['controls']['dtodate'].value;

    if (fDate && tDate) {
      this.betweenfromdate = this.datepipe.transform(fDate, "dd-MMM-yyyy");
      this.betweentodate = this.datepipe.transform(tDate, "dd-MMM-yyyy");
      this.betweendates = `${this.betweenfromdate} - ${this.betweentodate}`;
    } else { this.betweendates = ""; }
  }

  GetChequeonHandDetails() { alert("GetChequeonHandDetails clicked"); }
  branch_change(event: any) { alert("Branch changed"); }
  PrintSelectedRows() { alert("Print of selected rows commented."); }
  ExportSelectedToExcel() { alert("Export of selected rows commented."); }
  checkdatevalidation() { console.log("Date validation called"); }
  checkingfrommdate() { console.log("checkingfrommdate called"); }
  checkox(event: any) { console.log("Checkbox changed:", event); }
  getdaybookdata() { alert("getdaybookdata clicked"); }
  checkboxx(event: any) { console.log("checkboxx called", event); } 
  getsummaryReport() { alert("Summary Report clicked"); }

  customLoadingTemplate = null; 
  
  pdfOrprint(type: string) {
    if (type === 'Pdf') {
      alert('PDF generation clicked');
    } else if (type === 'Print') {
      this.PrintReport();
    }
  }

  onDetailToggle(event: any) {
    console.log('Detail toggle clicked:', event);
  }

  toggleExpandGroup(group: any) {
    console.log('Expand/Collapse group clicked:', group);
  }



}
