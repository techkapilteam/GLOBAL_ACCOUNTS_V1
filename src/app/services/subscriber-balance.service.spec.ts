import { TestBed } from '@angular/core/testing';

import { SubscriberBalanceService } from './subscriber-balance.service';

describe('SubscriberBalanceService', () => {
  let service: SubscriberBalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriberBalanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
