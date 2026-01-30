import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@Component({
  selector: 'app-trial-balance',
  standalone:true,
  imports: [NgxDatatableModule,ReactiveFormsModule,BsDatepickerModule,DatePipe,CommonModule],
  providers: [CurrencyPipe, DatePipe],
  templateUrl: './trial-balance.component.html',
  styleUrl: './trial-balance.component.css',
})
export class TrialBalanceComponent {

 TrialBalanceForm!: FormGroup;
  showhideason: boolean = false;
  ShowAsOn: boolean = true;
  withGroupingFlag: boolean = false;
  showhidetable: boolean = false;
  dataisempty: boolean = true;
  TrialBalanceDifference:any;
  Trialbalancelst: any[] = [];
  currencysymbol: string = '₹';
  fromdate!: Date;
  todate!: Date;

  savebutton: string = 'Generate Report';

  constructor(private fb: FormBuilder) { }


ngOnInit(): void {
  const today = new Date();

  
  const todayString = today.toISOString().split('T')[0];

  
  this.TrialBalanceForm = this.fb.group({
    fromdate: [todayString],
    todate: [todayString]
  });

 
  this.fromdate = today;
  this.todate = today;


  this.TrialBalanceForm.get('fromdate')?.valueChanges.subscribe(value => {
    this.fromdate = new Date(value);
  });

  this.TrialBalanceForm.get('todate')?.valueChanges.subscribe(value => {
    this.todate = new Date(value);
  });
}
  
  checkboxChecked(event: any) {
    this.showhideason = event.target.checked;
    this.ShowAsOn = event.target.checked;

 
    this.showhidetable = false;
    this.dataisempty = true;
    this.Trialbalancelst = [];
  }

  withGrouping(event: any) {
    this.withGroupingFlag = event.target.checked;
  }


  DateChange(event: any, type: string) {
    if (type === 'from') {
      this.fromdate = new Date(event.target.value);
      this.TrialBalanceForm.get('fromdate')?.setValue(event.target.value, { emitEvent: false });
    } else if (type === 'to') {
      this.todate = new Date(event.target.value);
      this.TrialBalanceForm.get('todate')?.setValue(event.target.value, { emitEvent: false });
    }
  }

  GenerateReport() {
    this.Trialbalancelst = [];
    this.showhidetable = false;
    this.dataisempty = true;

    if (this.showhideason) {
      this.Trialbalancelst = [
        { pparentname: 'ASSETS', paccountname: 'ADVANCES', pdebitamount: 300, pcreditamount: 0 },
        { pparentname: 'EXPENSES', paccountname: 'BANK CHARGES', pdebitamount: 1047.3, pcreditamount: 0 }
      ];
    }

    if (this.withGroupingFlag && this.Trialbalancelst.length > 0) {
      this.Trialbalancelst = this.groupByParent(this.Trialbalancelst);
    }

    if (this.Trialbalancelst.length > 0) {
      this.showhidetable = true;
      this.dataisempty = false;
    }
  }
  
  groupByParent(rows: any[]) {
    const grouped: any[] = [];
    const groups: any = {};

    rows.forEach(row => {
      const parent = row.pparentname;
      if (!groups[parent]) groups[parent] = [];
      groups[parent].push(row);
    });

    Object.keys(groups).forEach(key => {
      grouped.push({ pparentname: key, paccountname: '', pdebitamount: 0, pcreditamount: 0, isGroup: true });
      grouped.push(...groups[key]);
    });

    return grouped;
  }
}

function pdfOrprint1(printorpdf: any) {
  throw new Error('Function not implemented.');
}





