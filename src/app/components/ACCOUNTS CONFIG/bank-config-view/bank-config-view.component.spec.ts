import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankConfigViewComponent } from './bank-config-view.component';

describe('BankConfigViewComponent', () => {
  let component: BankConfigViewComponent;
  let fixture: ComponentFixture<BankConfigViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankConfigViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankConfigViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
