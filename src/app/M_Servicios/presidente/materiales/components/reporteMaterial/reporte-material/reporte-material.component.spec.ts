import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteMaterialComponent } from './reporte-material.component';

describe('ReporteMaterialComponent', () => {
  let component: ReporteMaterialComponent;
  let fixture: ComponentFixture<ReporteMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteMaterialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
