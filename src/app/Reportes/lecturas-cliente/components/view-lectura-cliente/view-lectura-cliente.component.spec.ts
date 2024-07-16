import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLecturaClienteComponent } from './view-lectura-cliente.component';

describe('ViewLecturaClienteComponent', () => {
  let component: ViewLecturaClienteComponent;
  let fixture: ComponentFixture<ViewLecturaClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewLecturaClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewLecturaClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
