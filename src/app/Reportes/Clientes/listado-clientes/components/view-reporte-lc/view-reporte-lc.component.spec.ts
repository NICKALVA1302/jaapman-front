import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReporteLcComponent } from './view-reporte-lc.component';

describe('ViewReporteLcComponent', () => {
  let component: ViewReporteLcComponent;
  let fixture: ComponentFixture<ViewReporteLcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewReporteLcComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewReporteLcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
