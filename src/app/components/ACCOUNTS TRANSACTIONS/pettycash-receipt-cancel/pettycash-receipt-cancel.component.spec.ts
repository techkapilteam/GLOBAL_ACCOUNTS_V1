import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PettycashReceiptCancelComponent } from './pettycash-receipt-cancel.component';

describe('PettycashReceiptCancelComponent', () => {
  let component: PettycashReceiptCancelComponent;
  let fixture: ComponentFixture<PettycashReceiptCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PettycashReceiptCancelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PettycashReceiptCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
