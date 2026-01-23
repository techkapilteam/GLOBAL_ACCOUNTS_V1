import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralReceiptViewComponent } from './general-receipt-view.component';

describe('GeneralReceiptViewComponent', () => {
  let component: GeneralReceiptViewComponent;
  let fixture: ComponentFixture<GeneralReceiptViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralReceiptViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralReceiptViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
