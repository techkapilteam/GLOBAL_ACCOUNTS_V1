import { TestBed } from '@angular/core/testing';

import { SscagendsService } from './sscagends.service';

describe('SscagendsService', () => {
  let service: SscagendsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SscagendsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
