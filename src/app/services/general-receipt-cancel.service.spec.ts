import { TestBed } from '@angular/core/testing';

import { GeneralReceiptCancelService } from './general-receipt-cancel.service';

describe('GeneralReceiptCancelService', () => {
  let service: GeneralReceiptCancelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralReceiptCancelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
