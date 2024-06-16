import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReporteVmComponent } from './view-reporte-vm.component';

describe('ViewReporteVmComponent', () => {
  let component: ViewReporteVmComponent;
  let fixture: ComponentFixture<ViewReporteVmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewReporteVmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewReporteVmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
