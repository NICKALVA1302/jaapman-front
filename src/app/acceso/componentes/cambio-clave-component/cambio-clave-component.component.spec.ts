import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioClaveComponentComponent } from './cambio-clave-component.component';

describe('CambioClaveComponentComponent', () => {
  let component: CambioClaveComponentComponent;
  let fixture: ComponentFixture<CambioClaveComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CambioClaveComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CambioClaveComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
