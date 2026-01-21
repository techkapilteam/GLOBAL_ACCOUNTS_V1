import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequesIssuedComponent } from './cheques-issued.component';

describe('ChequesIssuedComponent', () => {
  let component: ChequesIssuedComponent;
  let fixture: ComponentFixture<ChequesIssuedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChequesIssuedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChequesIssuedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
