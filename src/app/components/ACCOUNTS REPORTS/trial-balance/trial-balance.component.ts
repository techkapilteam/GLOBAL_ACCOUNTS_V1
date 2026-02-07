import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-trial-balance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    NgxDatatableModule
  ],
  providers: [DatePipe],
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.css']
})
export class TrialBalanceComponent {

  TrialBalanceForm!: FormGroup;

  showhideason = false;
  ShowAsOn = true;
  withGroupingFlag = false;

  showhidetable = false;
  dataisempty = true;

  Trialbalancelst: any[] = [];
  currencysymbol = '₹';

  fromdate!: Date;
  todate!: Date;

  savebutton = 'Generate Report';

  dpConfig: Partial<BsDatepickerConfig> = {};

  constructor(private fb: FormBuilder,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    const today = new Date();

    this.dpConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      showWeekNumbers: false,
      containerClass: 'theme-dark-blue'
    };

    this.TrialBalanceForm = this.fb.group({
      fromdate: [today],
      todate: [today]
    });

    this.fromdate = today;
    this.todate = today;

    this.TrialBalanceForm.get('fromdate')?.valueChanges.subscribe(v => {
      this.fromdate = v;
    });

    this.TrialBalanceForm.get('todate')?.valueChanges.subscribe(v => {
      this.todate = v;
    });
  }

  checkboxChecked(event: any) {
    this.showhideason = event.target.checked;
    this.ShowAsOn = event.target.checked;
    this.resetGrid();
  }

  withGrouping(event: any) {
    this.withGroupingFlag = event.target.checked;
  }

  GenerateReport() {
    this.resetGrid();

    if (this.showhideason) {
      this.Trialbalancelst = [
        {
          pparentname: 'ASSETS',
          paccountname: 'ADVANCES',
          pdebitamount: 300,
          pcreditamount: 0
        },
        {
          pparentname: 'EXPENSES',
          paccountname: 'BANK CHARGES',
          pdebitamount: 1047.30,
          pcreditamount: 0
        }
      ];
    }

    if (this.Trialbalancelst.length > 0) {
      this.showhidetable = true;
      this.dataisempty = false;
    }
  }

  resetGrid() {
    this.Trialbalancelst = [];
    this.showhidetable = false;
    this.dataisempty = true;
  }

  formatDate(date: Date | string): string {
    return this.datePipe.transform(date, 'dd-MMM-yyyy') ?? '';
  }

  pdfOrprint(type: 'Pdf' | 'Print') {
    if (type === 'Print') {
      window.print();
    } else {
      alert('PDF export not implemented in demo mode');
    }
  }

  exportExcel() {
    alert('Excel export not implemented in demo mode');
  }
}
