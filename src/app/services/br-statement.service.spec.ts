import { TestBed } from '@angular/core/testing';

import { BrStatementService } from './br-statement.service';

describe('BrStatementService', () => {
  let service: BrStatementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrStatementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
