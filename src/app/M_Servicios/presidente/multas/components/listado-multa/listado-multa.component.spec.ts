import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoMultaComponent } from './listado-multa.component';

describe('ListadoMultaComponent', () => {
  let component: ListadoMultaComponent;
  let fixture: ComponentFixture<ListadoMultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListadoMultaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListadoMultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
