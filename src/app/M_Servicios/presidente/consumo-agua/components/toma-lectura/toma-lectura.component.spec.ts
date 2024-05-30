import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TomaLecturaComponent } from './toma-lectura.component';

describe('TomaLecturaComponent', () => {
  let component: TomaLecturaComponent;
  let fixture: ComponentFixture<TomaLecturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TomaLecturaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TomaLecturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
