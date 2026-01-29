import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-pettycash-receipt-cancel',
  imports: [CommonModule],
  templateUrl: './pettycash-receipt-cancel.component.html',
  styleUrl: './pettycash-receipt-cancel.component.css'
})
export class PettycashReceiptCancelComponent {

  show: boolean = false
  onshow() {
    this.show = true
  }
}
