import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashOnhandComponent } from './cash-onhand.component';

describe('CashOnhandComponent', () => {
  let component: CashOnhandComponent;
  let fixture: ComponentFixture<CashOnhandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashOnhandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashOnhandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
