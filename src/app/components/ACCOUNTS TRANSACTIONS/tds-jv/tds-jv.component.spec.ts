import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdsJvComponent } from './tds-jv.component';

describe('TdsJvComponent', () => {
  let component: TdsJvComponent;
  let fixture: ComponentFixture<TdsJvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TdsJvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TdsJvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
