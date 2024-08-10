import { TestBed } from '@angular/core/testing';

import { TipoIngresoService } from './tipo-ingreso.service';

describe('TipoIngresoService', () => {
  let service: TipoIngresoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoIngresoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
