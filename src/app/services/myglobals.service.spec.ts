import { TestBed, inject } from '@angular/core/testing';

import { MyGlobalsService } from './myglobals.service';

describe('MyglobalsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyGlobalsService]
    });
  });

  it('should ...', inject([MyGlobalsService], (service: MyGlobalsService) => {
    expect(service).toBeTruthy();
  }));
});
