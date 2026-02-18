import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-general-receipt-cancel',
  standalone: true,
  imports: [CommonModule, BsDatepickerModule, ReactiveFormsModule, NgxDatatableModule],
  templateUrl: './general-receipt-cancel.component.html'
})
export class GeneralReceiptCancelComponent {

  generalrecipetcancelform!: FormGroup;
  today: Date = new Date();
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  show: boolean = false;
  selectedReceipt: any = null;

  receipts = [
    {
      id: 1,
      receiptNo: 'REC001',
      receivedFrom: 'Kapil Chits Hyderabad Pvt Ltd',
      receiptDate: '15-Nov-2025',
      narration: 'Being the cash received from SECUNDERABAD-SAINIKPUR as on 20-08-2025 12:46:53 but not receipted (unknown)',
      mode: 'Cash',
      doneBy: 'DIRECT',
      items: [
        { sNo: 1, particulars: 'SUSPENSE ACCOUNT(UNKNOWN AMOUNT)', amount: 200 }
      ]
    },
    {
      id: 2,
      receiptNo: 'REC002',
      receivedFrom: 'Kapil Chits Hyderabad Pvt Ltd',
      receiptDate: '16-Jan-2026',
      narration: 'Payment received for consulting services',
      mode: 'Bank Transfer',
      doneBy: 'DIRECT',
      items: [
        { sNo: 1, particulars: 'Service Charges', amount: 100 },
        { sNo: 2, particulars: 'Consulting Fees', amount: 250 }
      ]
    }
  ];

  constructor(private fb: FormBuilder) {
    this.dpConfig.maxDate = new Date();
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MMM-YYYY';
    this.dpConfig.showWeekNumbers = false;
  }

  ngOnInit() {
    this.generalrecipetcancelform = this.fb.group({
      receiptNo: [''],
      toDate: [this.today]
    });
  }

  onSelectReceipt(event: any) {
    const receiptId = parseInt(event.target.value, 10);
    this.selectedReceipt = this.receipts.find(r => r.id === receiptId);
    this.show = false;
  }

  onShow() {
    if (!this.selectedReceipt) {
      alert('Please select a receipt first');
      return;
    }
    this.show = true;
  }
}
