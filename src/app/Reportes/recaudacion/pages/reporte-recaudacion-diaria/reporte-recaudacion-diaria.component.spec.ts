import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteRecaudacionDiariaComponent } from './reporte-recaudacion-diaria.component';

describe('ReporteRecaudacionDiariaComponent', () => {
  let component: ReporteRecaudacionDiariaComponent;
  let fixture: ComponentFixture<ReporteRecaudacionDiariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteRecaudacionDiariaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteRecaudacionDiariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
