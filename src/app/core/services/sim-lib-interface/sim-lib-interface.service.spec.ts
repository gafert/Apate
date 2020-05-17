import { TestBed } from '@angular/core/testing';

import { SimLibInterfaceService } from './sim-lib-interface.service';

describe('SimLibInterfaceService', () => {
  let service: SimLibInterfaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimLibInterfaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
