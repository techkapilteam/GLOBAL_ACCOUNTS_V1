import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalVoucherReportComponent } from './journal-voucher-report.component';

describe('JournalVoucherReportComponent', () => {
  let component: JournalVoucherReportComponent;
  let fixture: ComponentFixture<JournalVoucherReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalVoucherReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalVoucherReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
