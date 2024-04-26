import { TestBed } from '@angular/core/testing';

import { RaspService } from './rasp.service';

describe('RaspService', () => {
  let service: RaspService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaspService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
