import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-cheque-enquiry',
  imports: [FormsModule,CommonModule,NgxDatatableModule],
  templateUrl: './cheque-enquiry.component.html',
  styleUrl: './cheque-enquiry.component.css',
})
export class ChequeEnquiryComponent {
chequeType: string = 'issued';
issuedChequeRows = [];

receivedChequeRows = [];


}
