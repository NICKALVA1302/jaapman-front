import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteValoresxmesComponent } from './reporte-valoresxmes.component';

describe('ReporteValoresxmesComponent', () => {
  let component: ReporteValoresxmesComponent;
  let fixture: ComponentFixture<ReporteValoresxmesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteValoresxmesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteValoresxmesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
