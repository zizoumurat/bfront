import { TestBed } from '@angular/core/testing';

import { NotificationHelper } from './notification.helper';

describe('NotificationService', () => {
  let service: NotificationHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
