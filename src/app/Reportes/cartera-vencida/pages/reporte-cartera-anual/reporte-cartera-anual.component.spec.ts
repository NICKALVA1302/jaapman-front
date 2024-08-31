import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCarteraAnualComponent } from './reporte-cartera-anual.component';

describe('ReporteCarteraAnualComponent', () => {
  let component: ReporteCarteraAnualComponent;
  let fixture: ComponentFixture<ReporteCarteraAnualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteCarteraAnualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteCarteraAnualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
