import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSeleccionComponent } from './form-seleccion.component';

describe('FormSeleccionComponent', () => {
  let component: FormSeleccionComponent;
  let fixture: ComponentFixture<FormSeleccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormSeleccionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormSeleccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
