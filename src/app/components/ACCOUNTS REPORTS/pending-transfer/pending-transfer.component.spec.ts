import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingTransferComponent } from './pending-transfer.component';

describe('PendingTransferComponent', () => {
  let component: PendingTransferComponent;
  let fixture: ComponentFixture<PendingTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingTransferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
