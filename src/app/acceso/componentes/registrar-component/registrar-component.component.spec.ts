import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarComponentComponent } from './registrar-component.component';

describe('RegistrarComponentComponent', () => {
  let component: RegistrarComponentComponent;
  let fixture: ComponentFixture<RegistrarComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrarComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrarComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
