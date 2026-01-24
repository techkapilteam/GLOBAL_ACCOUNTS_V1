import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeEnquiryComponent } from './cheque-enquiry.component';

describe('ChequeEnquiryComponent', () => {
  let component: ChequeEnquiryComponent;
  let fixture: ComponentFixture<ChequeEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChequeEnquiryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChequeEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
