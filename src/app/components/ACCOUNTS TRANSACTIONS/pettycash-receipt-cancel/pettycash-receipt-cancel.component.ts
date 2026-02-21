import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { catchError, concat, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';
import { PageCriteria } from '../../../Models/pageCriteria';
import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import { SubscriberConfigurationService } from '../../../services/subscriber-configuration.service';
import { GeneralReceiptCancelService } from '../../../services/Transactions/general-receipt-cancel.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-pettycash-receipt-cancel',
  standalone: true,
  imports: [
    CommonModule,
    BsDatepickerModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    FormsModule,
    NgSelectModule
  ],
  templateUrl: './pettycash-receipt-cancel.component.html',
  styleUrl: './pettycash-receipt-cancel.component.css'
})
export class PettycashReceiptCancelComponent implements OnInit {

  dropDownDataSearchLength!: number;
  searchplaceholder!: string;

  currencysymbol: string = '₹';

  creditto = '';
  Employee: any[] = [];
  receiptdata: any[] = [];

  ButtonType = 'Save';
  isLoading = false;
  disablesavebutton = false;

  showtotalamount = 0;
  show = false;

  receivedfrom = '';
  receiptdate!: Date;
  narration = '';
  doneby = '';
  pmodofPayment = '';

  authorizedbylist$ = of<any[]>([]);
  contactSearchevent = new Subject<string>();

  lstdetails: any[] = [];
  totalledgeramount = 0;
  pettycashReceiptCancelData: any = [];

  pDobConfig: Partial<BsDatepickerConfig> = {};
  disabletransactiondate = false;

  pettycashValidation: Record<string, string> = {};
  pageCriteria = new PageCriteria();

  PettyCashCancel!: FormGroup<{
    receiptnumber: FormControl<string | null>;
    receiptid: FormControl<number | null>;
    ipaddress: FormControl<string | null>;
    userid: FormControl<string | null>;
    activitytype: FormControl<string>;
    ppaymentdate: FormControl<Date | string | null>;
    totalreceivedamount: FormControl<number | null>;
    narration: FormControl<string | null>;
    cancellationreason: FormControl<string | null>;
    schemaid: FormControl<string | null>;
    autorizedcontactid: FormControl<string | null>;
    subintroducedname: FormControl<string | null>;
    pCreatedby: FormControl<string | null>;
  }>;

  constructor(
    private _commonService: CommonService,
    private _AccountingTransactionsService: AccountingTransactionsService,
    private router: Router,
    private datePipe: DatePipe,
    private _paymentVouecherServices: AccountingReportsService,
    private fb: FormBuilder,
    private _SubscriberConfigurationService: SubscriberConfigurationService,
    private _generalreceiptcancelservice: GeneralReceiptCancelService
  ) {

    this.pDobConfig = {
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      maxDate: new Date(),
      dateInputFormat: 'DD-MMM-YYYY'
    };

    if (this._commonService.comapnydetails) {
      this.disabletransactiondate =
        this._commonService.comapnydetails.pdatepickerenablestatus;
    }

    this.dropDownDataSearchLength = this._commonService.searchfilterlength;
    this.searchplaceholder = this._commonService.searchplaceholder;
  }

  ngOnInit(): void {
    this.buildForm();
    this.setPageModel();
    this.contactSearch();
    this.getEmployeeName(this._commonService.getschemaname());
    this.getReceiptNumber();
  }

  private buildForm() {
    this.PettyCashCancel = this.fb.group({
      receiptnumber: [''],
      receiptid: [null, Validators.required],
      ipaddress: [''],
      userid: [''],
      activitytype: ['C'],
      ppaymentdate: [new Date(), Validators.required],
      totalreceivedamount: [null],
      narration: [''],
      cancellationreason: ['', Validators.required],
      schemaid: [this._commonService.getschemaname()],
      autorizedcontactid: ['', Validators.required],
      subintroducedname: [''],
      pCreatedby: [this._commonService.getCreatedBy()]
    }) as any;
  }

  Save() {
    if (this.PettyCashCancel.invalid) {
      this.PettyCashCancel.markAllAsTouched();
      return;
    }

    if (!confirm('Do you want to save ?')) return;

    this.isLoading = true;
    this.disablesavebutton = true;
    this.ButtonType = 'Processing';

    const formattedDate = this._commonService.getFormatDateGlobal(
      this.PettyCashCancel.value.ppaymentdate
    );

    this.PettyCashCancel.patchValue({
      ipaddress: this._commonService.getIpAddress(),
      userid: this._commonService.getCreatedBy(),
      ppaymentdate: formattedDate
    });

    const payload = JSON.stringify(this.PettyCashCancel.value);

    this._generalreceiptcancelservice.savepettycashcancel(payload).subscribe({
      next: () => {
        this._commonService.showInfoMessage('Cancelled Successfully');
        this.clear();
      },
      error: (err: any) => this.showErrorMessage(err),
      complete: () => {
        this.isLoading = false;
        this.disablesavebutton = false;
        this.ButtonType = 'Save';
      }
    });
  }

  private contactSearch() {
    this.authorizedbylist$ = concat(
      of([]),
      this.contactSearchevent.pipe(
        distinctUntilChanged(),
        switchMap(term =>
          this._SubscriberConfigurationService
            .GetSubInterducedDetails(term)
            .pipe(catchError(() => of([])))
        )
      )
    );
  }

  getreceiptdata(event: any) {
    if (!event) return;

    this.showtotalamount = 0;

    this._paymentVouecherServices
      .GetPettyCashbyId(event)
      .subscribe(res => {

        const data = res?.[0];
        if (!data) return;

        this.creditto = data.pcontactname;
        this.receivedfrom = data.pcontactname;
        this.receiptdate = data.ppaymentdate;
        this.narration = data.pnarration;
        this.doneby = data.pemployeename;
        this.pmodofPayment = data.pmodofPayment;

        this.lstdetails = data.ppaymentslist || [];

        this.showtotalamount = this.lstdetails
          .reduce((sum: number, x: any) => sum + x.pLedgeramount, 0);

        this.totalledgeramount = this.showtotalamount;

        this.pageCriteria.totalrows = this.lstdetails.length;
      });
  }

  showdata() {
    if (this.PettyCashCancel.value.receiptid) {
      this.show = true;
    } else {
      this._commonService.showWarningMessage('Please select the receipt number');
    }
  }

  clear() {
    this.PettyCashCancel.reset({
      ppaymentdate: new Date()
    });

    this.lstdetails = [];
    this.show = false;
    this.showtotalamount = 0;
    this.ButtonType = 'Save';
    this.disablesavebutton = false;
    this.isLoading = false;

    this.getReceiptNumber();
  }

  getReceiptNumber() {
    this._AccountingTransactionsService
      .getReceiptNumber()
      .subscribe(res => this.receiptdata = res);
  }

  getEmployeeName(schema: string) {
    this._generalreceiptcancelservice
      .getEmployeeName(schema)
      .subscribe((res: any) => this.Employee = res);
  }

  setPageModel() {
    this.pageCriteria.pageSize = this._commonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }

  showErrorMessage(msg: string) {
    this._commonService.showErrorMessage(msg);
  }

  subIntroducedGridRowSelect(selected: any) {
    if (selected) {
      this.PettyCashCancel.patchValue({
        autorizedcontactid: selected.subintroducedid,
        subintroducedname: selected.subintroducedname
      });
    } else {
      this.PettyCashCancel.patchValue({
        autorizedcontactid: '',
        subintroducedname: ''
      });
    }
  }
}
