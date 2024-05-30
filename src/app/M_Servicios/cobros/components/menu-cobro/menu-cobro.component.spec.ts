import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCobroComponent } from './menu-cobro.component';

describe('MenuCobroComponent', () => {
  let component: MenuCobroComponent;
  let fixture: ComponentFixture<MenuCobroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuCobroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuCobroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
