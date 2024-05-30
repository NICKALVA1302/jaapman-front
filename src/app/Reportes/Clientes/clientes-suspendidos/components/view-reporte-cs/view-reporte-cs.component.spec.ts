import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReporteCSComponent } from './view-reporte-cs.component';

describe('ViewReporteCSComponent', () => {
  let component: ViewReporteCSComponent;
  let fixture: ComponentFixture<ViewReporteCSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewReporteCSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewReporteCSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
