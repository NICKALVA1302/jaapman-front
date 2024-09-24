import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInscribirClienteComponent } from './view-inscribir-cliente.component';

describe('ViewInscribirClienteComponent', () => {
  let component: ViewInscribirClienteComponent;
  let fixture: ComponentFixture<ViewInscribirClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewInscribirClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewInscribirClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
