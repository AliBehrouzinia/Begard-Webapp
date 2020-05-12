import { TestBed } from '@angular/core/testing';

import { PostLocationService } from './post-location.service';

describe('PostLocationService', () => {
  let service: PostLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
