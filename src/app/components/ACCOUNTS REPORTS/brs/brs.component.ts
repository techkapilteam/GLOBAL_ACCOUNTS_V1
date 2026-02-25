import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';
import { CommonService } from '../../../services/common.service';
import { BankBookService } from '../../../services/Transactions/AccountingReports/bank-book.service';
import { PageCriteria } from '../../../Models/pageCriteria';
import { BrStatementService } from '../../../services/br-statement.service';

@Component({
  selector: 'app-brs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxDatatableModule, BsDatepickerModule, TableModule],
  templateUrl: './brs.component.html',
  styleUrls: ['./brs.component.css'],
  providers: [DatePipe]
})
export class BrsComponent implements OnInit {

//   BRStatmentForm!: FormGroup;
//   disablereference: boolean = false;

//   bankData = [
//     { pbankaccountid: 1, pbankname: 'UNION BANK OF INDIA', pbankaccountnumber: '183911010000003' },
//     { pbankaccountid: 2, pbankname: 'STATE BANK OF INDIA', pbankaccountnumber: '1234567890' }
//   ];

//   allData: any[] = [
//     { pGroupType: 'CHEQUES ISSUED BUT NOT CLEARED', ptransactiondate: new Date(), pChequeNumber: '1001', pparticulars: 'Cash Deposit', ptotalreceivedamount: 5000 },
//     { pGroupType: 'Deposit', ptransactiondate: new Date(), pChequeNumber: '1002', pparticulars: 'Cheque Deposit', ptotalreceivedamount: 2000 },
//     { pGroupType: 'Withdrawal', ptransactiondate: new Date(), pChequeNumber: '2001', pparticulars: 'ATM Withdrawal', ptotalreceivedamount: 1000 }
//   ];

//   gridView: any[] = [];
//   startDate!: Date;
//   selectedBankName = '';
//   selectedBankAccount = '';
//   currencysymbol = '₹';

//   dpConfig: Partial<BsDatepickerConfig> = {};

//   constructor(private fb: FormBuilder, private datePipe: DatePipe) { }


//   ngOnInit() {
//     const today = new Date();

//     this.BRStatmentForm = this.fb.group({
//       pbankname: ['', Validators.required],
//       chequeInfo: [false],
//       onDate: [today],
//       fromDate: [today],
//       toDate: [today],
//       pDocStorePath: ['']
//     },{ validators: this.dateRangeValidator() });

//     this.dpConfig = {
//       dateInputFormat: 'DD-MMM-YYYY',
//       containerClass: 'theme-dark-blue',
//       showWeekNumbers: false
//     };

//     this.BRStatmentForm.get('chequeInfo')?.valueChanges.subscribe(checked => {
//       if (checked) {
//         this.BRStatmentForm.patchValue({ fromDate: today, toDate: today });
//       } else {
//         this.BRStatmentForm.patchValue({ onDate: today });
//       }
//       this.gridView = [];
//     });
//   }
//   dateRangeValidator(): ValidatorFn {
//   return (group: AbstractControl): ValidationErrors | null => {

//     const from = group.get('fromDate')?.value;
//     const to = group.get('toDate')?.value;

//     if (!from || !to) return null;

//     return from > to ? { dateRangeInvalid: true } : null;
//   };
// }

//   getBRStatmentReports() {
//     this.BRStatmentForm.markAllAsTouched();

//   if (this.BRStatmentForm.errors?.['dateRangeInvalid']) {
//     alert('From Date should not be greater than To Date');
//     return;
//   }

//   if (this.BRStatmentForm.invalid) return;
    
//     const chequeInfoChecked = this.BRStatmentForm.get('chequeInfo')?.value;

//     if (chequeInfoChecked) {
//       this.gridView = [];
//       return;
//     }

//     this.startDate = this.BRStatmentForm.value.onDate;
//     const selectedBankId = this.BRStatmentForm.value.pbankname;
//     const selectedBank = this.bankData.find(b => b.pbankaccountid === +selectedBankId);

//     if (selectedBank) {
//       this.selectedBankName = selectedBank.pbankname;
//       this.selectedBankAccount = selectedBank.pbankaccountnumber;
//     }

//     this.gridView = [...this.allData];
//   }

//   toggleExpandGroup(group: any): void {
//     this.gridView = [...this.gridView];
//   }

//   getGroupTotal(groupType: string): number {
//     return this.gridView
//       .filter(r => r.pGroupType === groupType)
//       .reduce((acc, curr) => acc + (curr.ptotalreceivedamount || 0), 0);
//   }

//   formatDate(date: Date | string | null): string {
//     if (!date) return '';
//     return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
//   }

//   get pbankname() { return this.BRStatmentForm.get('pbankname'); }

//   pdfOrprint(type: 'Pdf' | 'Print') {
//     if (type === 'Print') {
//       window.print();
//     } else {
//       alert('PDF export not implemented in demo mode');
//     }
//   }

private datePipe = inject(DatePipe);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private commonService = inject(CommonService);
  private bankBookService = inject(BankBookService);
  private brstatement = inject(BrStatementService);
    loading = false;
  BRStatmentForm!: FormGroup;
  submitted = false;

  dpConfig: Partial<BsDatepickerConfig> = {};
  dpConfig1: Partial<BsDatepickerConfig> = {};

  paymentVouecherServicesData: any = {};
  today: Date = new Date();

  bankData: any[] = [];
  gridView: any[] = [];

  startDate!: Date;
  bankname = '';

  @Output() printedDate = new EventEmitter<boolean>();
  @ViewChild('myTable') table: any;

  pBankBookBalance: any;
  bankBalance: any;

  show = false;
  BalanceBRS: any;

  chequesdepositedbutnotcrediteddecimal: any;
  chequesdepositedbutnotcredited = 0;

  CHEQUESISSUEDBUTNOTCLEAREDdecimal: any;
  CHEQUESISSUEDBUTNOTCLEARED = 0;

  Balanceasperbankbook: any;
  BalanceAsperBankBook: any;

  savebutton = 'Generate Report';
  isLoading = false;

  currencysymbol: any;
  Showhide = true;

  pageCriteria = new PageCriteria();

  BrsBalance: any;
  BankBalance: any[] = [];

  totaldeposit = 0;
  totalissued = 0;

  chequesInfo = false;
  ChequesInfoDetails: any[] = [];

  selectedvalues: any[] = [];

  dbdate: any;
  imageResponse: any;
  kycFileName: any;
  kycFilePath: any;

  roleid = '';
  ngOnInit(): void {

  this.dbdate = sessionStorage.getItem('Dbtime');
  this.roleid = sessionStorage.getItem('roleid') || '';

  this.printedDate.emit(true);

  this.setPageModel();

  this.BRStatmentForm = this.fb.group({
    fromDate: [new Date(this.dbdate!), Validators.required],
    toDate: [new Date()],
    bankAccountId: ['', Validators.required],
    pbankbalance: [0, [Validators.required, Validators.min(0)]],
    pFilename: ['']
  });

  this.initializeDatePicker();
  this.bankBookDetails();
}
private initializeDatePicker(): void {

  this.currencysymbol = this.commonService.datePickerPropertiesSetup('currencysymbol');

  this.dpConfig = {
    dateInputFormat:'DD-MMM-YYYY',
    //  this.commonService.datePickerPropertiesSetup('dateInputFormat'),
    containerClass: 'theme-dark-blue',
    // this.commonService.datePickerPropertiesSetup('containerClass'),
    showWeekNumbers: false,
    maxDate: new Date()
  };

  this.dpConfig1 = { ...this.dpConfig };

  if (!this.chequesInfo && this.roleid !== '2') {
    this.dpConfig.minDate = new Date(
      new Date(this.dbdate!).setDate(new Date(this.dbdate!).getDate() - 3)
    );
  }
}
setPageModel(): void {
    this.pageCriteria.pageSize = this.commonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.BRStatmentForm.controls;
  }

  ChequesInfo(event: any): void {
    this.chequesInfo = event.target.checked;
    this.BRStatmentForm.patchValue({
      fromDate: new Date(),
      pbankbalance: 0,
      pFilename: ''
    });

    if (this.chequesInfo) {
      this.dpConfig.minDate = undefined;
    } else {
      this.dpConfig.minDate = new Date(
        new Date(this.dbdate!).setDate(new Date(this.dbdate!).getDate() - 3)
      );
    }
  }

  onFooterPageChange(event: any): void {
    this.pageCriteria.offset = event.page - 1;
  }

  bankBookDetails(): void {
    this.bankBookService.GetBankNames(this.commonService.getschemaname(),
  this.commonService.getbranchname(),
  this.commonService.getCompanyCode(),
  this.commonService.getBranchCode()).subscribe({
      next: (res) => this.bankData = res,
      error: (err) => this.commonService.showErrorMessage(err)
    });
  }

  getBRStatmentReports(): void {
    debugger;

    this.submitted = true;
    if (this.BRStatmentForm.invalid) return;

    this.loading = true;
    this.isLoading = true;
    this.Showhide=false
    this.savebutton = 'Processing';

    const fromDate = this.commonService.getFormatDateNormal(this.BRStatmentForm.value.fromDate)??'';
    const toDate = this.commonService.getFormatDateNormal(this.BRStatmentForm.value.toDate)??'';
    const _pBankAccountId = this.BRStatmentForm.value.bankAccountId;

    if (!this.chequesInfo) {

      this.brstatement.GetBrStatementReportByDates(fromDate, _pBankAccountId,'accounts','KLC01','KAPILCHITS','global').subscribe({
        next: (res: any[]) => {
          this.gridView = res || [];
          this.show = true;
          this.loading = false;
          this.isLoading = false;
          this.savebutton = 'Generate Report';
        },
        error: (err: any) => {
          this.commonService.showErrorMessage(err);
          this.loading = false;
          this.isLoading = false;
        }
      });

    } else {

      this.brstatement.GetBrStatementReportByDatesChequesInfo(fromDate, toDate, _pBankAccountId)
        .subscribe({
          next: (res: never[]) => {
            this.ChequesInfoDetails = res || [];
            this.loading = false;
            this.isLoading = false;
            this.savebutton = 'Generate Report';

            if (this.ChequesInfoDetails.length > 0) {
              this.export();
            } else {
              this.commonService.showWarningMessage('BRS Cheques Info No Data to Display.');
            }
          }
        });
    }
  }

  export(): void {
    const rows: any[] = [];

    this.ChequesInfoDetails.forEach(element => {
      rows.push({
        "Branch Name": element.pBranchName,
        "Contact Name": element.contact_name,
        "Receipt Date": this.commonService.getFormatDateGlobal(element.receiptdate),
        "Total Received Amount": this.commonService.currencyformat(element.total_received_amount),
        "Cheque Date": this.commonService.getFormatDateGlobal(element.chequedate)
      });
    });

    this.commonService.exportAsExcelFile(rows, 'BRS Cheques Info');
  }

  pdfOrprint(type: string): void {

    if (!this.gridView.length) return;

    const rows: any[] = [];
    const gridheaders = ["Transaction Date", "Cheque No.", "Particulars", "Amount"];

    this.gridView.forEach(element => {
      rows.push([
        this.commonService.getFormatDateGlobal(element.ptransactiondate),
        element.pChequeNumber,
        element.pparticulars || '--NA--',
        this.commonService.convertAmountToPdfFormat(element.ptotalreceivedamount)
      ]);
    });

    this.commonService._downloadBRSReportsPdf(
      "BRS",
      rows,
      gridheaders,
      {},
      "a4",
      "As On",
      this.commonService.getFormatDateGlobal(this.BRStatmentForm.value.fromDate),
      new Date().toLocaleDateString(),
      '',
      '',
      '',
      '',
      type,
      this.bankname
    );
  }

  toggleExpandGroup(group: any): void {
    this.table?.groupHeader?.toggleExpandGroup(group);
  }

  onDetailToggle(event: any): void {
    console.log('Detail Toggled', event);
  }

  fromdateChange(event: Date): void {
    this.dpConfig1.minDate = new Date(event);
    this.BRStatmentForm.get('toDate')?.enable();
    this.BRStatmentForm.patchValue({ toDate: new Date() });
  }

  validateFile(fileName: string): boolean {
    if (!fileName) return true;
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ['jpg', 'png', 'pdf'].includes(ext || '');
  }

  uploadAndProgress(event: Event): void {

  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    return;
  }

  if (!this.validateFile(input.value)) {
    this.commonService.showWarningMessage("Upload jpg, png or pdf files");
    return;
  }

  const formData = new FormData();

  Array.from(input.files).forEach(file => {
    formData.append(file.name, file);
  });

  this.commonService.fileUploadS3("BPO", formData)
    .subscribe(data => {
      this.kycFileName = data[0];
      this.BRStatmentForm.patchValue({
        pFilename: this.kycFileName
      });
    });
}

  saveWithPrint(): void {

    if (!this.BRStatmentForm.value.pFilename) {
      this.commonService.showWarningMessage('Upload Document Required');
      return;
    }

    const date = this.commonService.getFormatDateNormal(this.BRStatmentForm.value.fromDate);

    const data = {
      "_BrsDTO": this.gridView
    };

    this.brstatement.SaveBrs(JSON.stringify(data)).subscribe(() => {
      this.commonService.showSuccessMsg('success');
      this.BRStatmentForm.patchValue({ pbankbalance: 0 });
    });
  }

}



