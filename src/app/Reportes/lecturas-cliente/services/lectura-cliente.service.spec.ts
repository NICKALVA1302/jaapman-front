import { TestBed } from '@angular/core/testing';

import { LecturaClienteService } from './lectura-cliente.service';

describe('LecturaClienteService', () => {
  let service: LecturaClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LecturaClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
