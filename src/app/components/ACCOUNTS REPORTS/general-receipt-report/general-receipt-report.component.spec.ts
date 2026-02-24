import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralReceiptReportComponent } from './general-receipt-report.component';

describe('GeneralReceiptReportComponent', () => {
  let component: GeneralReceiptReportComponent;
  let fixture: ComponentFixture<GeneralReceiptReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralReceiptReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralReceiptReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
