import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSeleccionMensualComponent } from './form-seleccion-mensual.component';

describe('FormSeleccionMensualComponent', () => {
  let component: FormSeleccionMensualComponent;
  let fixture: ComponentFixture<FormSeleccionMensualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormSeleccionMensualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormSeleccionMensualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
