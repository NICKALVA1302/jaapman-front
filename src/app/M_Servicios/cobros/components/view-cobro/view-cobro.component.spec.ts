import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCobroComponent } from './view-cobro.component';

describe('ViewCobroComponent', () => {
  let component: ViewCobroComponent;
  let fixture: ComponentFixture<ViewCobroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewCobroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewCobroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
