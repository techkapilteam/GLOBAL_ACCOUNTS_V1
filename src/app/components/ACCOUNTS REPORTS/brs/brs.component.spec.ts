import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrsComponent } from './brs.component';

describe('BrsComponent', () => {
  let component: BrsComponent;
  let fixture: ComponentFixture<BrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
