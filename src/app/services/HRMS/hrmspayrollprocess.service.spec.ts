import { TestBed } from '@angular/core/testing';

import { HrmspayrollprocessService } from './hrmspayrollprocess.service';

describe('HrmspayrollprocessService', () => {
  let service: HrmspayrollprocessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrmspayrollprocessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
