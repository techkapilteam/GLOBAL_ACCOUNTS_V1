import { TestBed } from '@angular/core/testing';

import { HrmsemployeeattendanceService } from './hrmsemployeeattendance.service';

describe('HrmsemployeeattendanceService', () => {
  let service: HrmsemployeeattendanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrmsemployeeattendanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
