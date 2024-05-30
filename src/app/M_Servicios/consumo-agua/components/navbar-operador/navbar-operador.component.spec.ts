import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarOperadorComponent } from './navbar-operador.component';

describe('NavbarOperadorComponent', () => {
  let component: NavbarOperadorComponent;
  let fixture: ComponentFixture<NavbarOperadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarOperadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
