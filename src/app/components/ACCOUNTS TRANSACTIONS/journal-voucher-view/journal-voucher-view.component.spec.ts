import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalVoucherViewComponent } from './journal-voucher-view.component';

describe('JournalVoucherViewComponent', () => {
  let component: JournalVoucherViewComponent;
  let fixture: ComponentFixture<JournalVoucherViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalVoucherViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalVoucherViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
