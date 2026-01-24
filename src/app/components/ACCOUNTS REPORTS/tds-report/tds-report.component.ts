import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tds-report',
  imports: [FormsModule,CommonModule],
  templateUrl: './tds-report.component.html',
  styleUrl: './tds-report.component.css',
})
export class TdsReportComponent {
asOn: boolean = false;

}
