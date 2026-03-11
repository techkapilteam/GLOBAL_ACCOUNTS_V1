import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { GeneralReceiptCancelService } from 'src/app/services/Transactions/general-receipt-cancel.service';
import { PageCriteria } from 'src/app/Models/pageCriteria';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Observable, Subject, concat, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
//import { ValidationMessageComponent } from 'src/app/common/validation-message/validation-message.component';

@Component({
  selector: 'app-general-receipt-cancel',
  templateUrl: './general-receipt-cancel.component.html',
  imports: [CommonModule, NgSelectModule, CommonModule, FormsModule, ReactiveFormsModule,
    BsDatepickerModule, TableModule, ButtonModule, InputTextModule]
})
export class GeneralReceiptCancelComponent implements OnInit {

  dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  currencysymbol: any;

  pageCriteria: PageCriteria = new PageCriteria();

  GeneralReceiptCancelForm!: FormGroup;

  receiptdata: any[] = [];

  generealreceiptdata: any[] = [];

  lblcontact: any;
  lblreceiptdate: any;
  lblnarration: any;
  lblmodeoftransaction: any;
  lblemployee: any;

  ButtonType = "Save";

  show = false;

  disablesavebutton = false;

  isLoading = false;

  GeneralReceiptCancelData: any = [];

  authorizedbylist!: Observable<any[]>;

  contactSearchevent = new Subject<string>();

  disabletransactiondate = false;

  dropDownDataSearchLength: any = 3;

  searchplaceholder = 'Please enter 3 or more characters';

  constructor(
    private fb: FormBuilder,
    private _CommonService: CommonService,
    private _generalreceiptcancelservice: GeneralReceiptCancelService
  ) {

    this.dpConfig.maxDate = new Date();
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MMM-YYYY';
    this.dpConfig.showWeekNumbers = false;

    this.currencysymbol =
      this._CommonService.datePickerPropertiesSetup("currencysymbol");

    if (this._CommonService.comapnydetails) {
      this.disabletransactiondate =
        this._CommonService.comapnydetails.pdatepickerenablestatus;
    }

  }

  ngOnInit(): void {

    this.setPageModel();

    this.createForm();

    this.getReceiptNumber();

    this.BlurEventAllControll(this.GeneralReceiptCancelForm);

    this.contactSearch();

  }

  createForm() {

    this.GeneralReceiptCancelForm = this.fb.group({

      receiptnumber: [''],

      receiptid: [null, Validators.required],

      ipaddress: [''],

      userid: [''],

      activitytype: ['C'],

      ppaymentdate: [new Date(), Validators.required],

      totalreceivedamount: [''],

      narration: [''],

      cancellationreason: ['', Validators.required],

      schemaid: [this._CommonService.getschemaname()],

      autorizedcontactid: ['', Validators.required],

      subintroducedname: ['']

    });

  }
  onPrimePageChange(event: any): void {
    this.pageCriteria.offset = event.first / event.rows;
    this.pageCriteria.pageSize = event.rows;
  }
  setPageModel() {

    this.pageCriteria.pageSize = this._CommonService.pageSize;

    this.pageCriteria.offset = 0;

    this.pageCriteria.pageNumber = 1;

    this.pageCriteria.footerPageHeight = 50;

  }

  onFooterPageChange(event: any): void {

    this.pageCriteria.offset = event.page - 1;

  }

  /* ---------------------------------- RECEIPT NUMBER ---------------------------------- */

  getReceiptNumber() {

    this._generalreceiptcancelservice.getReceiptNumber()
      .subscribe({

        next: res => this.receiptdata = res || [],

        error: err => this.showErrorMessage(err)

      });

  }

  /* ---------------------------------- CONTACT SEARCH ---------------------------------- */

  private contactSearch() {

    this.authorizedbylist = concat(

      of([]),

      this.contactSearchevent.pipe(

        debounceTime(400),

        distinctUntilChanged(),

        switchMap(term =>

          this._generalreceiptcancelservice.getEmployeeName(term)
            .pipe(catchError(() => of([])))

        )

      )

    );

  }

  subIntroducedGridRowSelect(selected: any) {

    if (selected) {

      this.GeneralReceiptCancelForm.patchValue({

        autorizedcontactid: selected.subintroducedid,

        subintroducedname: selected.subintroducedname

      });

    }

  }

  /* ---------------------------------- RECEIPT DATA ---------------------------------- */

  getreceiptdata(receiptId: any) {

    if (!receiptId) {

      this.generealreceiptdata = [];

      this.lblmodeoftransaction = "";

      this.lblnarration = "";

      this.lblreceiptdate = "";

      return;

    }

    this._generalreceiptcancelservice.getreceiptdata(receiptId)

      .subscribe({

        next: (res: any[]) => {

          this.generealreceiptdata = res || [];

          if (!this.generealreceiptdata.length) return;

          this.pageCriteria.totalrows = this.generealreceiptdata.length;

          const first = this.generealreceiptdata[0];

          this.lblcontact = first.contactname;

          this.lblemployee = first.employee;

          this.lblmodeoftransaction = "Cash";

          this.lblnarration = first.narration;

          this.lblreceiptdate = first.receiptdate;

        },

        error: err => this.showErrorMessage(err)

      });

  }

  /* ---------------------------------- SHOW ---------------------------------- */

  Show() {

    if (!this.GeneralReceiptCancelForm.controls['receiptid'].value) {

      this._CommonService.showWarningMessage("Please select the receipt number");

      return;

    }

    this.show = true;

  }

  /* ---------------------------------- SAVE ---------------------------------- */

  Save() {

    try {

      if (!this.generealreceiptdata.length) {

        this._CommonService.showWarningMessage("No receipt data found");

        return;

      }

      this.GeneralReceiptCancelForm.patchValue({

        ipaddress: this._CommonService.getIpAddress(),

        userid: this._CommonService.getCreatedBy()

      });

      if (this.checkValidations(this.GeneralReceiptCancelForm, true)) {

        this.isLoading = true;

        this.disablesavebutton = true;

        this.ButtonType = "Processing";

        const first = this.generealreceiptdata[0];

        this.GeneralReceiptCancelForm.controls['narration']
          .setValue(first.narration);

        const totalreceivedamount = this.generealreceiptdata.reduce(

          (sum, c) =>
            sum + parseFloat(
              this._CommonService.removeCommasInAmount(c.totalreceivedamount)
            ),

          0

        );

        this.GeneralReceiptCancelForm.controls['totalreceivedamount']
          .setValue(totalreceivedamount);

        this.GeneralReceiptCancelForm.controls['receiptnumber']
          .setValue(first.receiptnumber);

        const paymentdate =
          this._CommonService.getFormatDateNormal(
            this.GeneralReceiptCancelForm.controls['ppaymentdate'].value
          );

        this.GeneralReceiptCancelData = this.GeneralReceiptCancelForm.value;

        this.GeneralReceiptCancelData.ppaymentdate = paymentdate;

        if (confirm("Do you want to cancel this receipt ?")) {

          this._generalreceiptcancelservice
            .cancelReceipt(this.GeneralReceiptCancelData)

            .subscribe((res: any) => {

              if (res) {

                this._CommonService.showInfoMessage("Cancelled Successfully");

                this.getReceiptNumber();

                this.Cancel();

                const receipt = btoa(res[1] + ',Payment Voucher');

                window.open('/#/PaymentVoucherReport?id=' + receipt, "_blank");

              }

            });

        }

        this.resetButtons();

      }

    }

    catch (e) {

      this.resetButtons();

      this.showErrorMessage(e);

    }

  }

  /* ---------------------------------- CANCEL ---------------------------------- */

  Cancel() {

    this.GeneralReceiptCancelForm.reset();

    this.createForm();

    this.ButtonType = "Save";

    this.disablesavebutton = false;

    this.isLoading = false;

    this.show = false;

    this.generealreceiptdata = [];

  }

  resetButtons() {

    this.disablesavebutton = false;

    this.ButtonType = "Save";

    this.isLoading = false;

  }

  /* ---------------------------------- VALIDATION ---------------------------------- */

  checkValidations(group: FormGroup, isValid: boolean): boolean {

    Object.keys(group.controls).forEach(key => {

      const control = group.get(key);

      if (control?.invalid) {

        isValid = false;

      }

    });

    return isValid;

  }

  BlurEventAllControll(fromgroup: FormGroup) {

    Object.keys(fromgroup.controls).forEach(key => {

      fromgroup.get(key)?.valueChanges.subscribe(() => {

        this.checkValidations(fromgroup, true);

      });

    });

  }

  showErrorMessage(errormsg: any) {

    this._CommonService.showErrorMessage(errormsg);

  }

}