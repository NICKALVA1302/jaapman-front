import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMultaComponent } from './view-multa.component';

describe('ViewMultaComponent', () => {
  let component: ViewMultaComponent;
  let fixture: ComponentFixture<ViewMultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewMultaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewMultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
