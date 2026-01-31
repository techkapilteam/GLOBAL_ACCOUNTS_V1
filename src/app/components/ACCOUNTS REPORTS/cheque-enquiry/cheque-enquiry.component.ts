import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonService } from '../../../services/common.service';
import { PageCriteria } from '../../../Models/pageCriteria';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-cheque-enquiry',
  standalone:true,
  imports: [FormsModule,CommonModule,NgxDatatableModule,ReactiveFormsModule],
  templateUrl: './cheque-enquiry.component.html',
  styleUrl: './cheque-enquiry.component.css',
})
export class ChequeEnquiryComponent implements OnInit {

  private fb = inject(FormBuilder);
  private commonService = inject(CommonService);

  spinner = false;
  showOrHideIssuedCheques = true;
  showOrHideReceivedCheques = false;

  displayAllChequesDataBasedOnForm: any[] = [];
  displayGridDataBasedOnForm: any[] = [];

  totalamount = 0;
  totalReceivedAmount = 0;

  pageCriteria = new PageCriteria();
  currencySymbol = this.commonService.currencysymbol;

  ChequesIssuedForm: FormGroup = this.fb.group({
    pchequestype: ['Issued'], 
    chequeNumber: [''],
    bankname: [''],
    fromDate: [null],
    toDate: [null],
    schemaname: [this.commonService.getschemaname()]
  });

  dateConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: String(this.commonService.datePickerPropertiesSetup('dateInputFormat')),
    maxDate: new Date(),
    showWeekNumbers: Boolean(this.commonService.datePickerPropertiesSetup('showWeekNumbers')),
    containerClass: String(this.commonService.datePickerPropertiesSetup('containerClass'))
  };

  private dummyIssuedOnHand = [
    {
      pChequenumber: '100001',
      ptotalreceivedamount: 15000,
      preceiptid: 'RCPT001',
      preceiptdate: new Date(2026, 0, 10),
      pdepositeddate: null,
      pCleardate: null,
      ptypeofpayment: 'CHEQUE',
      ppartyname: 'Ramesh Kumar',
      pAccountnumber: '1234567890',
      pchequestatus: ''
    }
  ];

  private dummyIssuedCleared = [
    {
      pChequenumber: '100002',
      ptotalreceivedamount: 20000,
      preceiptid: 'RCPT002',
      preceiptdate: new Date(2026, 0, 12),
      pdepositeddate: new Date(2026, 0, 15),
      pCleardate: null,
      ptypeofpayment: 'CHEQUE',
      ppartyname: 'Suresh',
      pAccountnumber: '999888777',
      pchequestatus: 'P'
    },
    {
      pChequenumber: '100003',
      ptotalreceivedamount: 12000,
      preceiptid: 'RCPT003',
      preceiptdate: new Date(2026, 0, 14),
      pdepositeddate: null,
      pCleardate: new Date(2026, 0, 18),
      ptypeofpayment: 'CHEQUE',
      ppartyname: 'Anita',
      pAccountnumber: '444555666',
      pchequestatus: 'R'
    }
  ];

  private dummyReceived = [
    {
      chequeStatus: 'Deposited',
      pChequenumber: '200001',
      pbranchname: 'Hyderabad',
      ptotalreceivedamount: 18000,
      preceiptid: 'REC001',
      preceiptdate: new Date(2026, 0, 5),
      pdepositeddate: new Date(2026, 0, 6),
      pCleardate: null,
      ptypeofpayment: 'CHEQUE',
      pbankname: 'HDFC Bank',
      ppartyname: 'Vikas',
      pchequestatus: 'N'
    }
  ];

  ngOnInit(): void {
    this.setPageModel();
    this.loadDefaultIssuedData();
  }

  private loadDefaultIssuedData() {
    const statusMap: Record<string, string> = { P: 'Cleared', R: 'Returned', C: 'Cancelled' };

    const issuedMapped = this.dummyIssuedOnHand.map(c => ({
      ...c,
      chequeStatus: 'Issued'
    }));

    const clearedMapped = this.dummyIssuedCleared.map(c => ({
      ...c,
      chequeStatus: statusMap[c.pchequestatus] || 'Unknown'
    }));

    this.displayAllChequesDataBasedOnForm = [...issuedMapped, ...clearedMapped];
    this.totalamount = this.displayAllChequesDataBasedOnForm
      .reduce((s, c) => s + c.ptotalreceivedamount, 0);
  }

  selectChequesType(type: 'Issued' | 'Received') {
    this.ChequesIssuedForm.patchValue({ pchequestype: type });

    this.showOrHideIssuedCheques = type === 'Issued';
    this.showOrHideReceivedCheques = type === 'Received';

    if (type === 'Issued') {
      this.loadDefaultIssuedData();
    } else {
      this.displayGridDataBasedOnForm = [...this.dummyReceived];
    }
  }

  onSearchForCheque(value: string) {
    if (value.length < 3) return;

    this.spinner = true;
    setTimeout(() => {
      this.displayAllChequesDataBasedOnForm =
        this.displayAllChequesDataBasedOnForm.filter(c =>
          c.pChequenumber.includes(value)
        );

      this.totalamount = this.displayAllChequesDataBasedOnForm
        .reduce((s, c) => s + c.ptotalreceivedamount, 0);

      this.spinner = false;
    }, 400);
  }

  onSearchForChequeReceived(value: string) {
    if (value.length < 3) return;

    this.displayGridDataBasedOnForm =
      this.dummyReceived.filter(c => c.pChequenumber.includes(value));
  }

  pdfOrprint(type: string) {
    alert(type + ' option clicked (dummy)');
  }
  
  Clear() {
    this.ChequesIssuedForm.reset({ pchequestype: 'Issued' });
    this.selectChequesType('Issued');
  }

  setPageModel() {
    this.pageCriteria.pageSize = 5;
    this.pageCriteria.offset = 0;
    this.pageCriteria.footerPageHeight = 50;
  }
}

