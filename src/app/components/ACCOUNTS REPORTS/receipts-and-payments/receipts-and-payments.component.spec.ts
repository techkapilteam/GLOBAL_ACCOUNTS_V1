import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptsAndPaymentsComponent } from './receipts-and-payments.component';

describe('ReceiptsAndPaymentsComponent', () => {
  let component: ReceiptsAndPaymentsComponent;
  let fixture: ComponentFixture<ReceiptsAndPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptsAndPaymentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptsAndPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
