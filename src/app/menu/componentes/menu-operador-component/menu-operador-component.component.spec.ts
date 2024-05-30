import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuOperadorComponentComponent } from './menu-operador-component.component';

describe('MenuOperadorComponentComponent', () => {
  let component: MenuOperadorComponentComponent;
  let fixture: ComponentFixture<MenuOperadorComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuOperadorComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuOperadorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
