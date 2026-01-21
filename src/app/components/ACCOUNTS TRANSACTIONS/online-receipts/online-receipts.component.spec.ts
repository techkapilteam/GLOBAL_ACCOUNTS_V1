import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineReceiptsComponent } from './online-receipts.component';

describe('OnlineReceiptsComponent', () => {
  let component: OnlineReceiptsComponent;
  let fixture: ComponentFixture<OnlineReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineReceiptsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
