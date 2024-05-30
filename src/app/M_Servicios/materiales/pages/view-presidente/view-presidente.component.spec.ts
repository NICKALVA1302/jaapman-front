import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPresidenteComponent } from './view-presidente.component';

describe('ViewPresidenteComponent', () => {
  let component: ViewPresidenteComponent;
  let fixture: ComponentFixture<ViewPresidenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewPresidenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewPresidenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
