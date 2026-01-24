import { TestBed } from '@angular/core/testing';

import { TDSReportService } from './tds-report.service';

describe('TDSReportService', () => {
  let service: TDSReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TDSReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
