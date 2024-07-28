import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReporteRecaudacionComponent } from './view-reporte-recaudacion.component';

describe('ViewReporteRecaudacionComponent', () => {
  let component: ViewReporteRecaudacionComponent;
  let fixture: ComponentFixture<ViewReporteRecaudacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewReporteRecaudacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewReporteRecaudacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
