import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';
import { Observable, Subject, of } from 'rxjs';

@Component({
  selector: 'app-general-receipt-cancel',
  standalone: true,
  templateUrl: './general-receipt-cancel.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    BsDatepickerModule,
    TableModule
  ]
})
export class GeneralReceiptCancelComponent {

  GeneralReceiptCancelForm!: FormGroup;

  /** UI flags */
  show = false;
  disabletransactiondate = true;
  disablesavebutton = false;

  /** Labels */
  lblcontact = '';
  lblreceiptdate: Date | null = null;
  lblnarration = '';
  lblmodeoftransaction = '';
  lblemployee = '';
  currencysymbol = '₹';
  ButtonType = 'Save';

  /** Dropdowns */
  receiptdata: any[] = [];
  authorizedbylist: Observable<any[]> = of([]);

  /** Search */
  contactSearchevent = new Subject<string>();
  searchplaceholder = 'Search...';
  dropDownDataSearchLength = 3;

  /** Table */
  generealreceiptdata: any[] = [];
  pageCriteria = {
    pageSize: 10,
    offset: 0,
    totalrows: 0
  };

  /** Datepicker */
  dpConfig = {
    dateInputFormat: 'DD/MM/YYYY',
    showWeekNumbers: false
  };

  /** Error messages (index signature safe) */
  GeneralReceiptCancelErrorMessages: Record<string, string> = {};

  constructor(private fb: FormBuilder) {
    this.createForm();
    this.loadInitialData();
  }

  private createForm(): void {
    this.GeneralReceiptCancelForm = this.fb.group({
      receiptid: [null, Validators.required],
      ppaymentdate: [{ value: null, disabled: true }, Validators.required],
      cancellationreason: ['', Validators.required],
      autorizedcontactid: [null, Validators.required]
    });
  }

  private loadInitialData(): void {
    // mock data – replace with API
    this.receiptdata = [
      { receiptid: 1, receiptnumber: 'RC-001' },
      { receiptid: 2, receiptnumber: 'RC-002' }
    ];

    this.authorizedbylist = of([
      {
        subintroducedid: 1,
        subintroducedcode: 'EMP01',
        subintroducedname: 'John',
        subintroducedmobilenumber: '9999999999',
        subintroducedemailid: 'john@test.com'
      }
    ]);
  }

  /** Events */
  Show(): void {
    this.show = true;
  }

  getreceiptdata(event: any): void {
    if (!event) return;

    this.lblcontact = 'Customer Name';
    this.lblreceiptdate = new Date();
    this.lblnarration = 'Receipt narration';
    this.lblmodeoftransaction = 'Cash';
    this.lblemployee = 'Admin';

    this.generealreceiptdata = [
      { parentaccountname: 'Cash', totalreceivedamount: 1500 }
    ];

    this.pageCriteria.totalrows = this.generealreceiptdata.length;
  }

  subIntroducedGridRowSelect(event: any): void {
    // optional handler
  }

  onPrimePageChange(event: any): void {
    this.pageCriteria.offset = event.first / event.rows;
    this.pageCriteria.pageSize = event.rows;
  }

  Save(): void {
    if (this.GeneralReceiptCancelForm.invalid) {
      this.GeneralReceiptCancelErrorMessages = {
        receiptid: 'Receipt is required',
        ppaymentdate: 'Date is required',
        cancellationreason: 'Reason is required',
        autorizedcontactid: 'Authorised by is required'
      };
      return;
    }

    this.disablesavebutton = true;

    setTimeout(() => {
      this.disablesavebutton = false;
      alert('Receipt cancelled successfully');
    }, 1000);
  }

  Cancel(): void {
    this.GeneralReceiptCancelForm.reset();
    this.show = false;
  }
}
