import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarReportesComponent } from './navbar-reportes.component';

describe('NavbarReportesComponent', () => {
  let component: NavbarReportesComponent;
  let fixture: ComponentFixture<NavbarReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarReportesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
