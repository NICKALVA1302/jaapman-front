import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReporteCVComponent } from './view-reporte-cv.component';

describe('ViewReporteCVComponent', () => {
  let component: ViewReporteCVComponent;
  let fixture: ComponentFixture<ViewReporteCVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewReporteCVComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewReporteCVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
