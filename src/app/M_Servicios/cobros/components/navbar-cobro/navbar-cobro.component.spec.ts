import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarCobroComponent } from './navbar-cobro.component';

describe('NavbarCobroComponent', () => {
  let component: NavbarCobroComponent;
  let fixture: ComponentFixture<NavbarCobroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarCobroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarCobroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
