import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentVoucherViewComponent } from './payment-voucher-view.component';

describe('PaymentVoucherViewComponent', () => {
  let component: PaymentVoucherViewComponent;
  let fixture: ComponentFixture<PaymentVoucherViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentVoucherViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentVoucherViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
