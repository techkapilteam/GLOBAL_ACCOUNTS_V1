import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-general-receipt-cancel',
  imports: [CommonModule],
  templateUrl: './general-receipt-cancel.component.html',
  styleUrl: './general-receipt-cancel.component.css'
})
export class GeneralReceiptCancelComponent {
  show:boolean=false;
onshow(){
this.show=true
}
}
