import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeManagementnewComponent } from './cheque-managementnew.component';

describe('ChequeManagementnewComponent', () => {
  let component: ChequeManagementnewComponent;
  let fixture: ComponentFixture<ChequeManagementnewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChequeManagementnewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChequeManagementnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
