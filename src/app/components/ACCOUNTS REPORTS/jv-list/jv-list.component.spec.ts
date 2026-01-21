import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JvListComponent } from './jv-list.component';

describe('JvListComponent', () => {
  let component: JvListComponent;
  let fixture: ComponentFixture<JvListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JvListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JvListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
