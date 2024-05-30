import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewConsumosClientesComponent } from './view-consumos-clientes.component';

describe('ViewConsumosClientesComponent', () => {
  let component: ViewConsumosClientesComponent;
  let fixture: ComponentFixture<ViewConsumosClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewConsumosClientesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewConsumosClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
