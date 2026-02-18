import { TestBed } from '@angular/core/testing';

import { SubscriberConfigurationService } from './subscriber-configuration.service';

describe('SubscriberConfigurationService', () => {
  let service: SubscriberConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriberConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
