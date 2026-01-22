import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrsStatementsComponent } from './brs-statements.component';

describe('BrsStatementsComponent', () => {
  let component: BrsStatementsComponent;
  let fixture: ComponentFixture<BrsStatementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrsStatementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrsStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
