import { TestBed } from '@angular/core/testing';

import { AccountingTransactionService } from './accounting-transaction.service';

describe('AccountingTransactionService', () => {
  let service: AccountingTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountingTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
