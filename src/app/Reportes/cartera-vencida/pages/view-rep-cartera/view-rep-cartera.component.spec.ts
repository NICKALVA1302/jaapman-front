import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRepCarteraComponent } from './view-rep-cartera.component';

describe('ViewRepCarteraComponent', () => {
  let component: ViewRepCarteraComponent;
  let fixture: ComponentFixture<ViewRepCarteraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewRepCarteraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewRepCarteraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
