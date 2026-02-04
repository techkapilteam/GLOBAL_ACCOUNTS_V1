import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-cheque-management',
  imports: [BsDatepickerModule,ReactiveFormsModule],
  templateUrl: './cheque-management.component.html',
  styleUrl: './cheque-management.component.css'
})
export class ChequeManagementComponent {
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  chequeform!:FormGroup;
  today:Date=new Date;
constructor(private fb:FormBuilder){
   this.dpConfig.maxDate = new Date();
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig.showWeekNumbers = false;
}
 ngOnInit(): void {
    this.chequeform=this.fb.group({
      pjvdate:[this.today]
    })

  }

}
