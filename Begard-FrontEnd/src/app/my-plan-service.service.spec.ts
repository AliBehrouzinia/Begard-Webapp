import { TestBed } from '@angular/core/testing';

import { MyPlanServiceService } from './my-plan-service.service';

describe('MyPlanServiceService', () => {
  let service: MyPlanServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyPlanServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
