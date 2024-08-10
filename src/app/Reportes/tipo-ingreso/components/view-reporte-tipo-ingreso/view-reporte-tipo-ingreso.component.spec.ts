import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReporteTipoIngresoComponent } from './view-reporte-tipo-ingreso.component';

describe('ViewReporteTipoIngresoComponent', () => {
  let component: ViewReporteTipoIngresoComponent;
  let fixture: ComponentFixture<ViewReporteTipoIngresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewReporteTipoIngresoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewReporteTipoIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
