import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCobrosComponent } from './view-cobros.component';

describe('ViewCobrosComponent', () => {
  let component: ViewCobrosComponent;
  let fixture: ComponentFixture<ViewCobrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewCobrosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewCobrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
