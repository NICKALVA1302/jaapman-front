import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTarifaComponent } from './view-tarifa.component';

describe('ViewTarifaComponent', () => {
  let component: ViewTarifaComponent;
  let fixture: ComponentFixture<ViewTarifaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewTarifaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewTarifaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
