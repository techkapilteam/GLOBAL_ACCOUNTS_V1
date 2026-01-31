import { TestBed } from '@angular/core/testing';

import { ChitTransactionsService } from './chit-transactions.service';

describe('ChitTransactionsService', () => {
  let service: ChitTransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChitTransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
