import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLecturasComponent } from './view-lecturas.component';

describe('ViewLecturasComponent', () => {
  let component: ViewLecturasComponent;
  let fixture: ComponentFixture<ViewLecturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewLecturasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewLecturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
