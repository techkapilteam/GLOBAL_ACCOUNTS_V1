import { TestBed } from '@angular/core/testing';

import { AddFormToMenuService } from './add-form-to-menu.service';

describe('AddFormToMenuService', () => {
  let service: AddFormToMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddFormToMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
