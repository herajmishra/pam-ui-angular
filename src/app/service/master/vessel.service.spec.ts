import { TestBed } from '@angular/core/testing';

import { VesselService } from './vessel.service';

describe('VesselService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VesselService = TestBed.get(VesselService);
    expect(service).toBeTruthy();
  });
});
