import { TestBed } from '@angular/core/testing';

import { LoadingHelper } from './loading.helper';

describe('LoadingService', () => {
  let service: LoadingHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
