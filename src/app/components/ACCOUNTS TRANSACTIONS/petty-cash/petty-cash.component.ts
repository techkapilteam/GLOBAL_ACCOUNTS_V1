import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ngx-datatable imports
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-petty-cash',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ],
  templateUrl: './petty-cash.component.html',
  styleUrls: ['./petty-cash.component.css']
})
export class PettyCashComponent implements OnInit {

  // Payment list
  paymentslist1: any[] = [];
  tdsEnabled:boolean=false
  gstEnabled:boolean=false

  // Journal entry list
  partyjournalentrylist: any[] = [];

  constructor() {}

  ngOnInit(): void {
    // init default values
    this.paymentslist1 = [];
    this.partyjournalentrylist = [];
  }

  removeHandler(index: number) {
    this.paymentslist1.splice(index, 1);
    this.updateJournalEntries();
  }

  updateJournalEntries() {
    let debit = 0;
    let credit = 0;

    this.paymentslist1.forEach(p => {
      debit += Number(p.ptotalamount);
      credit += Number(p.pamount);
    });

    this.partyjournalentrylist = [
      { accountname: 'Cash / Bank', debitamount: debit, creditamount: 0 },
      { accountname: 'Party', debitamount: 0, creditamount: credit }
    ];
  }
  saveJournalVoucher(){

  }
  clearPaymentVoucher(){

  }
  uploadAndProgress($event:any){
    
  }
  addPaymentDetails(){}
  clearPaymentDetails(){}
  claculategsttdsamounts(){}
  istdsapplicable_Checked(){
    this.tdsEnabled=true
  }
  isgstapplicable_Checked(){
    this.gstEnabled=true
  }
}
