import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteRecaudacionAguaComponent } from './reporte-recaudacion-agua.component';

describe('ReporteRecaudacionAguaComponent', () => {
  let component: ReporteRecaudacionAguaComponent;
  let fixture: ComponentFixture<ReporteRecaudacionAguaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteRecaudacionAguaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteRecaudacionAguaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
