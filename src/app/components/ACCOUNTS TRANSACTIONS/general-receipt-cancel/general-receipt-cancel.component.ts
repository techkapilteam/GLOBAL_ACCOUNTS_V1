import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-general-receipt-cancel',
  imports: [CommonModule,BsDatepickerModule,ReactiveFormsModule],
  templateUrl: './general-receipt-cancel.component.html',
  styleUrl: './general-receipt-cancel.component.css'
})
export class GeneralReceiptCancelComponent {
  
  
generalrecipetcancelform!:FormGroup;

  today:Date=new Date();
 public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
constructor(private fb:FormBuilder){
  this.dpConfig.maxDate = new Date();
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MMM-YYYY';
    this.dpConfig.showWeekNumbers = false;
}
  show: boolean = false
 ngOnInit() {
  this.generalrecipetcancelform=this.fb.group({
    toDate:[this.today],
  })
}

  onshow() {
    this.show = true
  }
}

