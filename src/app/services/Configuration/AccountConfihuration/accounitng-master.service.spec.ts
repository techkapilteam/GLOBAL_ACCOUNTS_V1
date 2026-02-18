import { TestBed } from '@angular/core/testing';

import { AccounitngMasterService } from './accounitng-master.service';

describe('AccounitngMasterService', () => {
  let service: AccounitngMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccounitngMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
