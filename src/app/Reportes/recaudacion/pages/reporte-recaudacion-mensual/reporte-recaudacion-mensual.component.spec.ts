import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteRecaudacionMensualComponent } from './reporte-recaudacion-mensual.component';

describe('ReporteRecaudacionMensualComponent', () => {
  let component: ReporteRecaudacionMensualComponent;
  let fixture: ComponentFixture<ReporteRecaudacionMensualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteRecaudacionMensualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteRecaudacionMensualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
