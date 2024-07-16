import { TestBed } from '@angular/core/testing';

import { PagoClienteService } from './pago-cliente.service';

describe('PagoClienteService', () => {
  let service: PagoClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagoClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
