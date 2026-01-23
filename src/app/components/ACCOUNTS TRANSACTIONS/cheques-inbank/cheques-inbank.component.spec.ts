import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequesInbankComponent } from './cheques-inbank.component';

describe('ChequesInbankComponent', () => {
  let component: ChequesInbankComponent;
  let fixture: ComponentFixture<ChequesInbankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChequesInbankComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChequesInbankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
