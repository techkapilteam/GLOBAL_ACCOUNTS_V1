import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralReceiptCancelComponent } from './general-receipt-cancel.component';

describe('GeneralReceiptCancelComponent', () => {
  let component: GeneralReceiptCancelComponent;
  let fixture: ComponentFixture<GeneralReceiptCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralReceiptCancelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralReceiptCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
