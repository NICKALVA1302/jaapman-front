import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReportePagoComponent } from './view-reporte-pago.component';

describe('ViewReportePagoComponent', () => {
  let component: ViewReportePagoComponent;
  let fixture: ComponentFixture<ViewReportePagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewReportePagoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewReportePagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
