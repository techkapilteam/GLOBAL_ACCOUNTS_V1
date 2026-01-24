import { TestBed } from '@angular/core/testing';

import { CommonDetailsService } from './common-details.service';

describe('CommonDetailsService', () => {
  let service: CommonDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
