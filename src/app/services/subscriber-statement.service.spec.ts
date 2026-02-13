import { TestBed } from '@angular/core/testing';

import { SubscriberStatementService } from './subscriber-statement.service';

describe('SubscriberStatementService', () => {
  let service: SubscriberStatementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriberStatementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
