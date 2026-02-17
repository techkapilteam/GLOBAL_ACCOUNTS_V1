import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonService } from '../../../services/common.service';
import { PageCriteria } from '../../../Models/pageCriteria';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';
import { AccountingTransactionsService } from '../../../services/Transactions/AccountingTransaction/accounting-transaction.service';
import { ChequesIssuedComponent } from '../../ACCOUNTS TRANSACTIONS/cheques-issued/cheques-issued.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cheque-enquiry',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxDatatableModule, ReactiveFormsModule,TableModule],
  templateUrl: './cheque-enquiry.component.html',
  styleUrl: './cheque-enquiry.component.css',
})
export class ChequeEnquiryComponent implements OnInit {

  private fb = inject(NonNullableFormBuilder);
  private commonService = inject(CommonService);
  private accountingService = inject(AccountingTransactionsService);
  private destroyRef = inject(DestroyRef);

  @ViewChild(ChequesIssuedComponent)
  chequesissued!: ChequesIssuedComponent;

  ChequesIssuedForm!: FormGroup;
  BrsCancelForm!: FormGroup;

  showOrHideIssuedCheques = true;
  showOrHideReceivedCheques = false;
  showOrHideOtherChequesGrid = false;
  showOrHideAllChequesGrid = true;
  brsdateshowhidecancelled = false;

  bankid = 0;
  bankname = '';
  bankbalance = 0;
  bankbalancetype = '';

  BanksList: any[] = [];
  ChequesIssuedData: any[] = [];
  ChequesInBankData: any[] = [];
  ChequesClearReturnData: any[] = [];

  displayAllChequesDataBasedOnForm: any[] = [];
  displayAllChequesDataBasedOnFormTemp: any[] = [];
  displayGridDataBasedOnForm: any[] = [];
  displayGridDataBasedOnFormTemp: any[] = [];

  pageCriteria = new PageCriteria();
  currencySymbol = this.commonService.currencysymbol;

  totalamount = 0;
  totalreceivedcheques = 0;
  spinner = false;
  tabname = 'Cheques';

  public brsfromConfig: Partial<BsDatepickerConfig> = {};
  public brstoConfig: Partial<BsDatepickerConfig> = {};
  amounttotal!: number;
  dummyReceived: any;

  ngOnInit(): void {
    this.initializeForms();
    this.initializeDatePicker();
    this.loadBanks();
    this.setPageModel();
  }

  private initializeForms() {
    this.ChequesIssuedForm = this.fb.group({
      pchequestype: ['Issued'],
      ptransactiondate: [new Date()],
      bankname: [''],
      pfrombrsdate: [''],
      ptobrsdate: [''],
      SearchClear: [''],
      schemaname: [this.commonService.getschemaname()]
    });

    this.BrsCancelForm = this.fb.group({
      frombrsdate: [''],
      tobrsdate: ['']
    });
  }

  private initializeDatePicker() {
    this.brsfromConfig.maxDate = new Date();
    this.brsfromConfig.containerClass = 'theme-dark-blue';
    this.brsfromConfig.dateInputFormat = 'DD-MM-YYYY';
    this.brsfromConfig.showWeekNumbers = false;

    // this.brsfromConfig = {
    //   dateInputFormat: this.commonService.datePickerPropertiesSetup('dateInputFormat'),
    //   maxDate: new Date(),
    //   showWeekNumbers: true,
    //   // this.commonService.datePickerPropertiesSetup('showWeekNumbers'),
    //   containerClass: 'theme-dark-blue',
    //   // this.commonService.datePickerPropertiesSetup('containerClass')
    // };

    // this.brstoConfig = { ...this.brsfromConfig };
  }

  private loadBanks() {
    this.accountingService
      .GetBanksList(this.commonService.getschemaname())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (banks) => (this.BanksList = banks),
        error: (err) => this.commonService.showErrorMessage(err)
      });
  }

  setPageModel() {
    this.pageCriteria.pageSize = this.commonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.CurrentPage = 1;
  }

  selectChequesType(type: 'Issued' | 'Received') {
    this.showOrHideIssuedCheques = type === 'Issued';
    this.showOrHideReceivedCheques = type === 'Received';
    this.brsdateshowhidecancelled = type === 'Received';

    if (type === 'Issued') {
      this.tabname = 'Cheques';
      this.chequesStatusInfoGridForChequesIssued();
    } else {
      this.chequesStatusInfoGrid();
    }
  }

  SelectBank(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    if (!value) {
      this.bankid = 0;
      this.bankname = '';
      return;
    }

    const bank = this.BanksList.find(b => b.pdepositbankname === value);
    if (!bank) return;

    this.bankid = bank.pbankid;
    this.bankname = bank.pdepositbankname;

    this.bankbalance = Math.abs(bank.pbankbalance);
    this.bankbalancetype =
      bank.pbankbalance < 0 ? 'Cr' :
      bank.pbankbalance > 0 ? 'Dr' : '';
  }

  chequesStatusInfoGridForChequesIssued() {

    const grid = [
      ...this.ChequesIssuedData.filter(c => c.ptypeofpayment !== 'CASH')
        .map(c => ({ ...c, chequeStatus: 'Cheques Issued' })),

      ...this.ChequesClearReturnData
        .filter(c => ['P', 'R', 'C'].includes(c.pchequestatus))
        .map(c => ({
          ...c,
          chequeStatus:
            c.pchequestatus === 'P' ? 'Cleared' :
            c.pchequestatus === 'R' ? 'Returned' : 'Cancelled'
        }))
    ];

    this.displayAllChequesDataBasedOnForm = grid;
    this.displayAllChequesDataBasedOnFormTemp = structuredClone(grid);

    this.totalamount = grid.reduce(
      (sum, item) => sum + (item.ptotalreceivedamount || 0),
      0
    );
  }

  chequesStatusInfoGrid() {

    const grid = this.ChequesInBankData
      ?.filter(item => item.ptotalreceivedamount !== 0)
      ?.map(item => ({
        ...item,
        chequeStatus:
          item.pchequestatus === 'N' ? 'Deposited' :
          item.pchequestatus === 'Y' ? 'Cleared' :
          item.pchequestatus === 'R' ? 'Returned' : ''
      }));

    this.displayGridDataBasedOnForm = grid;
    this.displayGridDataBasedOnFormTemp = structuredClone(grid);

    this.totalreceivedcheques = grid.reduce(
      (sum, item) => sum + (item.ptotalreceivedamount || 0),
      0
    );

    this.amounttotal = this.totalreceivedcheques;
  }

  Clear() {
    this.ChequesIssuedForm.reset({
      pchequestype: 'Issued',
      ptransactiondate: new Date()
    });

    this.bankid = 0;
    this.displayAllChequesDataBasedOnForm = [];
    this.displayGridDataBasedOnForm = [];
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
      this.dummyReceived.filter((c:any) => c.pChequenumber.includes(value));
  }

  pdfOrprint(printOrPdf: 'Pdf' | 'Print'): void {

  const rows: (string | number)[][] = [];
  const reportName = 'Received Cheque Details';

  const gridHeaders: string[] = [
    'Cheque Status',
    'Cheque/ Reference No.',
    'Branch Name',
    'Amount',
    'Receipt Id',
    'Receipt Date',
    'Deposited Date',
    'Cleared Date',
    'Returned Date',
    'Transaction Mode',
    'Cheque Bank Name',
    'Party'
  ];

  const colWidthHeight = {
    0: { cellWidth: 'auto', halign: 'center' },
    1: { cellWidth: 'auto', halign: 'center' },
    2: { cellWidth: 22, halign: 'left' },
    3: { cellWidth: 'auto', halign: 'right' },
    4: { cellWidth: 17, halign: 'center' },
    5: { cellWidth: 20, halign: 'center' },
    6: { cellWidth: 'auto', halign: 'center' },
    7: { cellWidth: 'auto', halign: 'center' },
    8: { cellWidth: 'auto', halign: 'center' },
    9: { cellWidth: 'auto', halign: 'center' },
    10: { cellWidth: 'auto', halign: 'center' },
    11: { cellWidth: 'auto', halign: 'left' }
  };

  this.displayGridDataBasedOnForm?.forEach(element => {

    const totalReceivedAmt =
      element?.ptotalreceivedamount && element.ptotalreceivedamount !== 0
        ? this.commonService.convertAmountToPdfFormat(
            this.commonService.currencyformat(element.ptotalreceivedamount)
          )
        : '';

    const dateReceipt = this.commonService.getFormatDateGlobal(
      element?.preceiptdate
    );

    const depositedDate =
      element?.ptypeofpayment === 'CHEQUE'
        ? this.commonService.getFormatDateGlobal(element?.pdepositeddate)
        : 'N/A';

    const clearedDate =
      element?.ptypeofpayment === 'CHEQUE' &&
      element?.pchequestatus === 'Y'
        ? this.commonService.getFormatDateGlobal(element?.pCleardate)
        : 'N/A';

    const returnedDate =
      element?.ptypeofpayment === 'CHEQUE' &&
      element?.pchequestatus === 'R'
        ? this.commonService.getFormatDateGlobal(element?.pCleardate)
        : 'N/A';

    rows.push([
      element?.chequeStatus ?? '',
      element?.pChequenumber ?? '',
      element?.pbranchname ?? '',
      totalReceivedAmt,
      element?.preceiptid ?? '',
      dateReceipt ?? '',
      depositedDate,
      clearedDate,
      returnedDate,
      element?.ptypeofpayment ?? '',
      element?.cheque_bank ?? '',
      element?.ppartyname ?? ''
    ]);
  });

  const amountTotal = this.commonService.convertAmountToPdfFormat(
    this.commonService.currencyFormat(this.amounttotal)
  );

  this.commonService._downloadchqrecReportsPdf(
    reportName,
    rows,
    gridHeaders,
    colWidthHeight,
    'landscape',
    '',
    this.commonService.getFormatDateGlobal(new Date()),
    printOrPdf === 'Pdf' ? null : '',
    printOrPdf,
    amountTotal
  );
}

}

