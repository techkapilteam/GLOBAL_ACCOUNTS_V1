import { TestBed } from '@angular/core/testing';

import { AccountingTransactionsService } from './accounting-transaction.service';

describe('AccountingTransactionService', () => {
  let service: AccountingTransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountingTransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
