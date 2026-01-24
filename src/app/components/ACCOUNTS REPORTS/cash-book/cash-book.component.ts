
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cash-book',
  imports: [],
   templateUrl: './cash-book.component.html',
  styleUrl: './cash-book.component.css',
})
export class CashBookComponent 
// implements OnInit 
{

  // CashBookReportForm!: FormGroup;
  // submitted = false;
  // savebutton = 'Generate';

  // loading = false;
  // showicons = false;
  // printedDate = true;

  // startDate: any;
  // endDate: any;

  // gridView: any[] = [];

  // pageCriteria = {
  //   pageSize: 10,
  //   offset: 0,
  //   footerPageHeight: 50
  // };

  // dpConfig = {
  //   containerClass: 'theme-default',
  //   dateInputFormat: 'DD/MM/YYYY'
  // };

  // dpConfig1 = {
  //   containerClass: 'theme-default',
  //   dateInputFormat: 'DD/MM/YYYY'
  // };

  // constructor(private fb: FormBuilder) {}

  // ngOnInit(): void {
  //   this.CashBookReportForm = this.fb.group({
  //     fromDate: [''],
  //     toDate: [''],
  //     ptranstype: ['', Validators.required]
  //   });
  // }

  // get f() {
  //   return this.CashBookReportForm.controls;
  // }

  // ToDateChange(event: any) {
  //   this.endDate = event;
  // }

  // FromDateChange(event: any) {
  //   this.startDate = event;
  // }

  // cashBookData() {
  //   this.submitted = true;

  //   if (this.CashBookReportForm.invalid) {
  //     return;
  //   }

  //   this.loading = true;

  //   // dummy static data
  //   this.gridView = [
  //     { ptransactiondate: '2024-01-01', description: 'Cash In', amount: 100 },
  //     { ptransactiondate: '2024-01-01', description: 'Cash Out', amount: -50 },
  //     { ptransactiondate: '2024-01-02', description: 'Cheque In', amount: 200 }
  //   ];

  //   this.showicons = true;
  //   this.loading = false;
  // }

  // toggleExpandGroup(group: any) {
  //   group.expanded = !group.expanded;
  // }

  // onDetailToggle(event: any) {
  //   console.log(event);
  // }

  // pdfOrprint(type: string) {
  //   console.log(type);
  // }

  // export() {
  //   console.log('Export');
  // }
}
