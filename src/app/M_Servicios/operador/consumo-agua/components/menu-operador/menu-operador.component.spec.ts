import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuOperadorComponent } from './menu-operador.component';

describe('MenuOperadorComponent', () => {
  let component: MenuOperadorComponent;
  let fixture: ComponentFixture<MenuOperadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuOperadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
