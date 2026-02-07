import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormsModule,FormBuilder, FormGroup,Validators } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';


@Component({
 selector: 'app-tdsreport',
  standalone: true,
  imports: [BsDatepickerModule, NgxDatatableModule, CommonModule, FormsModule,TableModule],
  templateUrl: './tds-report.component.html',
  styleUrl: './tds-report.component.css',
  host: {
    ngSkipHydration: ''
  }
})
export class TdsReportComponent {
  asOnChecked = false;
  onAsOnChange(event: Event) {
    this.asOnChecked = (event.target as HTMLInputElement).checked;
  }
  sections = [
    { code: '194C', name: 'Contract / Sub Contract / Courier / Transport / Printing' },
    { code: '194J', name: 'Professional Fees / Technical Fees / Royalty' },
    { code: '194H', name: 'Commission or Brokerage' },
    { code: '194I', name: 'Rent (Land / Building / Machinery)' },
    { code: '194A', name: 'Interest Other Than Securities' },
    { code: '194Q', name: 'Purchase of Goods' },
    { code: '194O', name: 'E-commerce Participant Payments' },
    { code: '192', name: 'Salary' },
    { code: '193', name: 'Interest on Securities' },
    { code: '194D', name: 'Insurance Commission' },
    { code: '194EE', name: 'Payment in respect of NSS' },
    { code: '194K', name: 'Income from Units (Mutual Funds / UTI)' },
    { code: '194LA', name: 'Compensation on Acquisition of Immovable Property' },
    { code: '195', name: 'Non-Resident Payments' }
  ];

  selectedSection = '';
  sectionName = '';
  fromDate: Date| null = null;
  toDate: Date| null = null;
  ngOnInit() {
    const today = new Date();
    this.fromDate = today;
    this.toDate = today;
  }
  onSectionChange() {
    this.showResult=false
    const selected = this.sections.find(
      s => s.code === this.selectedSection
      
    );

    this.sectionName = selected ? selected.name : '';
  }

  isSummary = false;
  showResult = false;
  onShowClick() {
    this.showResult=true;
    // if(this.showResult){
    //   
    // }
    // else{
    //   this.showResult=false;
    // }
  }
  onSummaryChange(event: Event) {
    this.isSummary = (event.target as HTMLInputElement).checked;
  }
  rows = [
    {
      particulars: 'ABC Services',
      panNumber: 'ABCDE1234F',
      panStatus: 'Valid',
      name: 'Ramesh',
      code: 'AG001',
      transactionDate: '10-01-2026',
      paidAmount: '10,000.00',
      tdsAmount: '1,000.00',
      amount: '9,000.00',
      effectiveJV: 'JV123',
      subscriberBranch: 'Hyderabad'
    }
  ];
  agentRows = [
    {
      agentName: 'Kapil Group Marketing Services Private Limited',
      agentCode: 'KAP2141/23',
      panNumber: 'AAICK0350Q',
      paidAmount: 13453836,
      tdsAmount: 269077,
      amount: 13184759
    },
    {
      agentName: 'Kapil IT Solutions Pvt Ltd',
      agentCode: 'KAP143/24',
      panNumber: 'NA',
      paidAmount: 247360,
      tdsAmount: 4948,
      amount: 242412
    }
  ];
  validateDates() {
  if (this.fromDate && this.toDate) {

    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);

    if (from > to) {
      alert('From Date should not be greater than To Date');
      this.fromDate = null; 
    }
  }
}

}






