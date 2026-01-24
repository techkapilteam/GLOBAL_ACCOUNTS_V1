import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralReceiptNewComponent } from './general-receipt-new.component';

describe('GeneralReceiptNewComponent', () => {
  let component: GeneralReceiptNewComponent;
  let fixture: ComponentFixture<GeneralReceiptNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralReceiptNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralReceiptNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
