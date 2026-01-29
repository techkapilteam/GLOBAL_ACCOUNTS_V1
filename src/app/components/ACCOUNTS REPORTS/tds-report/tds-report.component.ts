import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-tds-report',
  imports: [FormsModule,CommonModule,NgxDatatableModule],
  templateUrl: './tds-report.component.html',
  styleUrl: './tds-report.component.css',
})
export class TdsReportComponent {
asOn: boolean = false;
showTable = false;
  rows: any[] = [];

  onShow() {
    this.rows = [
      {
        pan: 'BVHPG8853J',
        agentName: 'STR',
        agentCode: 'AG001',
        paidAmount: 54687478,
        tdsAmount: 4971249,
        netAmount: 49712498
      }
    ];
    this.showTable = true;
  }
}
