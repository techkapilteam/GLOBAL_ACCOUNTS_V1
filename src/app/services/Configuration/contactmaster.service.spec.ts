import { TestBed } from '@angular/core/testing';

import { ContactmasterService } from './contactmaster.service';

describe('ContactmasterService', () => {
  let service: ContactmasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactmasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
