import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralReceiptComponent } from './general-receipt.component';

describe('GeneralReceiptComponent', () => {
  let component: GeneralReceiptComponent;
  let fixture: ComponentFixture<GeneralReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralReceiptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
