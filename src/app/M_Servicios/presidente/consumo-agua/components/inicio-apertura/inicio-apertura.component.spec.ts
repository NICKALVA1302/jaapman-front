import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioAperturaComponent } from './inicio-apertura.component';

describe('InicioAperturaComponent', () => {
  let component: InicioAperturaComponent;
  let fixture: ComponentFixture<InicioAperturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InicioAperturaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InicioAperturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
