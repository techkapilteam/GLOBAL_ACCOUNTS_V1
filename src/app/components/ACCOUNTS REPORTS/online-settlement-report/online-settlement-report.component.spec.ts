import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineSettlementReportComponent } from './online-settlement-report.component';

describe('OnlineSettlementReportComponent', () => {
  let component: OnlineSettlementReportComponent;
  let fixture: ComponentFixture<OnlineSettlementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineSettlementReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineSettlementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
