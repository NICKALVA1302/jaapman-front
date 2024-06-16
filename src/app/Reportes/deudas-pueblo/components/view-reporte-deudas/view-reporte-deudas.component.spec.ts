import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReporteDeudasComponent } from './view-reporte-deudas.component';

describe('ViewReporteDeudasComponent', () => {
  let component: ViewReporteDeudasComponent;
  let fixture: ComponentFixture<ViewReporteDeudasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewReporteDeudasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewReporteDeudasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
