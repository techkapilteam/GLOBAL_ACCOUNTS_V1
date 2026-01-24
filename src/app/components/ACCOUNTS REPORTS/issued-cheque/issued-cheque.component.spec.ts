import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedChequeComponent } from './issued-cheque.component';

describe('IssuedChequeComponent', () => {
  let component: IssuedChequeComponent;
  let fixture: ComponentFixture<IssuedChequeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuedChequeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssuedChequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
