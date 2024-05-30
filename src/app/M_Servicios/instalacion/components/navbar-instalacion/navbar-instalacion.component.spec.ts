import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarInstalacionComponent } from './navbar-instalacion.component';

describe('NavbarInstalacionComponent', () => {
  let component: NavbarInstalacionComponent;
  let fixture: ComponentFixture<NavbarInstalacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarInstalacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarInstalacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
