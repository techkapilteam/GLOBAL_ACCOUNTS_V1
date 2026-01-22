import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequesOnhandComponent } from './cheques-onhand.component';

describe('ChequesOnhandComponent', () => {
  let component: ChequesOnhandComponent;
  let fixture: ComponentFixture<ChequesOnhandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChequesOnhandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChequesOnhandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
