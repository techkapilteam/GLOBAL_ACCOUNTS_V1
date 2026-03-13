import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankEntriesComponent } from './bank-entries.component';

describe('BankEntriesComponent', () => {
  let component: BankEntriesComponent;
  let fixture: ComponentFixture<BankEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankEntriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
