import { TestBed } from '@angular/core/testing';

import { BRSStatementsService } from './brs-statements.service';

describe('BRSStatementsService', () => {
  let service: BRSStatementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BRSStatementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
