import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonTbComponent } from './comparison-tb.component';

describe('ComparisonTbComponent', () => {
  let component: ComparisonTbComponent;
  let fixture: ComponentFixture<ComparisonTbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonTbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparisonTbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
