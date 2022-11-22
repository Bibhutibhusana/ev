import { TestBed } from '@angular/core/testing';

import { IfmsService } from './ifms.service';

describe('IfmsService', () => {
  let service: IfmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IfmsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
