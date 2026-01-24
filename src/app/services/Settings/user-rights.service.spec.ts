import { TestBed } from '@angular/core/testing';

import { UserRightsService } from './user-rights.service';

describe('UserRightsService', () => {
  let service: UserRightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
