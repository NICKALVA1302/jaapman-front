import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCarteraMensualComponent } from './reporte-cartera-mensual.component';

describe('ReporteCarteraMensualComponent', () => {
  let component: ReporteCarteraMensualComponent;
  let fixture: ComponentFixture<ReporteCarteraMensualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteCarteraMensualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteCarteraMensualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
