import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleTbComponent } from './schedule-tb.component';

describe('ScheduleTbComponent', () => {
  let component: ScheduleTbComponent;
  let fixture: ComponentFixture<ScheduleTbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleTbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleTbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
