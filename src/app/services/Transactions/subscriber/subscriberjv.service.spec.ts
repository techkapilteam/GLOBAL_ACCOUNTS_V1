import { TestBed } from '@angular/core/testing';

import { SubscriberjvService } from './subscriberjv.service';

describe('SubscriberjvService', () => {
  let service: SubscriberjvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriberjvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
