import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInstalacionComponent } from './view-instalacion.component';

describe('ViewInstalacionComponent', () => {
  let component: ViewInstalacionComponent;
  let fixture: ComponentFixture<ViewInstalacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewInstalacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewInstalacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
