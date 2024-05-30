import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLocUsuariosComponent } from './view-loc-usuarios.component';

describe('ViewLocUsuariosComponent', () => {
  let component: ViewLocUsuariosComponent;
  let fixture: ComponentFixture<ViewLocUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewLocUsuariosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewLocUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
