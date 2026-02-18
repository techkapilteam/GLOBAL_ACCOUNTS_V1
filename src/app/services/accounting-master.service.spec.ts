import { TestBed } from '@angular/core/testing';

import { AccountingMasterService } from './accounting-master.service';

describe('AccountingMasterService', () => {
  let service: AccountingMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountingMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
