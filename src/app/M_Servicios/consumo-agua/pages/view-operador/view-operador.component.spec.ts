import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOperadorComponent } from './view-operador.component';

describe('ViewOperadorComponent', () => {
  let component: ViewOperadorComponent;
  let fixture: ComponentFixture<ViewOperadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewOperadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
