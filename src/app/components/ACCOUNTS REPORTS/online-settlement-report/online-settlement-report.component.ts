import { Component } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-online-settlement-report',
  imports: [NgxDatatableModule],
  templateUrl: './online-settlement-report.component.html',
  styleUrl: './online-settlement-report.component.css',
})
export class OnlineSettlementReportComponent {
onlineSettlementRows: any[] = [];

}
