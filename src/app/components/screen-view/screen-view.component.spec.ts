import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NavigationService } from '../../services/navigation.service';

import { ScreenViewComponent } from './screen-view.component';

describe('ScreenViewComponent', () => {
  let component: ScreenViewComponent;
  let fixture: ComponentFixture<ScreenViewComponent>;

  beforeEach(async () => {
    const mockActivatedRoute = {
      snapshot: {
        url: []
      }
    };

    const mockNavigationService = {
      selectedScreen$: of(null)
    };

    await TestBed.configureTestingModule({
      imports: [ScreenViewComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: NavigationService, useValue: mockNavigationService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
