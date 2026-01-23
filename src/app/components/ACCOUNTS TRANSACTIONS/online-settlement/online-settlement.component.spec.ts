import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineSettlementComponent } from './online-settlement.component';

describe('OnlineSettlementComponent', () => {
  let component: OnlineSettlementComponent;
  let fixture: ComponentFixture<OnlineSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineSettlementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
