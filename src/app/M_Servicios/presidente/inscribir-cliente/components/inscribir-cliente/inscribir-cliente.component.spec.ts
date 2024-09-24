import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscribirClienteComponent } from './inscribir-cliente.component';

describe('InscribirClienteComponent', () => {
  let component: InscribirClienteComponent;
  let fixture: ComponentFixture<InscribirClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InscribirClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InscribirClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
