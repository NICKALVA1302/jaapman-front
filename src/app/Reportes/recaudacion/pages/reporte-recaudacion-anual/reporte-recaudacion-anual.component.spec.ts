import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteRecaudacionAnualComponent } from './reporte-recaudacion-anual.component';

describe('ReporteRecaudacionAnualComponent', () => {
  let component: ReporteRecaudacionAnualComponent;
  let fixture: ComponentFixture<ReporteRecaudacionAnualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteRecaudacionAnualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteRecaudacionAnualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
